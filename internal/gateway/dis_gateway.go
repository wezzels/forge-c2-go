// Package gateway implements DIS/HLA/TENA gateway services for FORGE-C2.
// The DISGateway listens for DIS PDUs on UDP and routes them through
// the JREAP encoder pipeline, and vice versa.
package gateway

import (
	"encoding/binary"
	"fmt"
	"net"
	"sync"
	"time"

	"forge-c2/internal/dis"
	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// DISGatewayConfig holds configuration for a DIS gateway instance.
type DISGatewayConfig struct {
	// ListenAddr is the UDP address to listen for incoming DIS PDUs (e.g., ":3000")
	ListenAddr string
	// DestAddr is the UDP address to send outgoing DIS PDUs (e.g., "225.0.0.1:3000")
	DestAddr string
	// MulticastTTL is the TTL for multicast packets (default 1)
	MulticastTTL int
	// BufferSize is the UDP receive buffer size (default 65535)
	BufferSize int
	// Site and Application numbers for DIS entity IDs
	SiteID        uint16
	ApplicationID uint16
	// ExerciseID is the DIS exercise identifier (default 0)
	ExerciseID uint8
}

// DefaultDISGatewayConfig returns a sensible default config.
func DefaultDISGatewayConfig() DISGatewayConfig {
	return DISGatewayConfig{
		ListenAddr:     ":3000",
		DestAddr:       "225.0.0.1:3000",
		MulticastTTL:   1,
		BufferSize:     65535,
		SiteID:         1,
		ApplicationID:  1,
		ExerciseID:     0,
	}
}

// DISGateway bridges DIS UDP traffic to FORGE-C2 JREAP pipeline.
type DISGateway struct {
	config  DISGatewayConfig
	conn    *net.UDPConn
	encoder *jreap.Encoder
	meta    *mdpa.MDPAMetadata

	mu       sync.Mutex
	running  bool
	stopCh   chan struct{}
	seqTrack *SequenceNumberTracker

	// Callbacks for received PDUs
	OnEntityState    func(pdu *dis.DISEntityStatePDU)
	OnFire           func(pdu *dis.DISFirePDU)
	OnDetonation     func(pdu *dis.DISDetonationPDU)
	OnElectromagnetic func(pdu *dis.DISElectromagneticEmissionPDU)
}

// NewDISGateway creates a new DIS gateway.
func NewDISGateway(config DISGatewayConfig, encoder *jreap.Encoder, meta *mdpa.MDPAMetadata) *DISGateway {
	return &DISGateway{
		config:   config,
		encoder:  encoder,
		meta:     meta,
		stopCh:   make(chan struct{}),
		seqTrack: NewSequenceNumberTracker(),
	}
}

// Start begins listening for DIS PDUs.
func (g *DISGateway) Start() error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.running {
		return fmt.Errorf("DIS gateway already running")
	}

	addr, err := net.ResolveUDPAddr("udp", g.config.ListenAddr)
	if err != nil {
		return fmt.Errorf("resolve listen addr: %w", err)
	}

	conn, err := net.ListenMulticastUDP("udp", nil, addr)
	if err != nil {
		// Fall back to regular UDP listen if multicast fails
		conn, err = net.ListenUDP("udp", addr)
		if err != nil {
			return fmt.Errorf("listen UDP: %w", err)
		}
	}

	g.conn = conn
	g.running = true

	go g.receiveLoop()
	return nil
}

// Stop shuts down the DIS gateway.
func (g *DISGateway) Stop() error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if !g.running {
		return nil
	}

	g.running = false
	close(g.stopCh)
	if g.conn != nil {
		return g.conn.Close()
	}
	return nil
}

// IsRunning returns whether the gateway is active.
func (g *DISGateway) IsRunning() bool {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.running
}

// SendEntityState sends a DIS Entity State PDU to the destination.
func (g *DISGateway) SendEntityState(pdu *dis.DISEntityStatePDU) error {
	buf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(pdu, buf)
	return g.sendRaw(buf)
}

// SendFire sends a DIS Fire PDU.
func (g *DISGateway) SendFire(pdu *dis.DISFirePDU) error {
	buf := make([]byte, 8192) // Fire PDU is variable
	dis.PackDISFirePDU(pdu, buf)
	return g.sendRaw(buf)
}

// SendDetonation sends a DIS Detonation PDU.
func (g *DISGateway) SendDetonation(pdu *dis.DISDetonationPDU) error {
	buf := make([]byte, 8192)
	dis.PackDISDetonationPDU(pdu, buf)
	return g.sendRaw(buf)
}

// receiveLoop reads DIS PDUs from the UDP connection.
func (g *DISGateway) receiveLoop() {
	buf := make([]byte, g.config.BufferSize)

	for {
		select {
		case <-g.stopCh:
			return
		default:
		}

		g.conn.SetReadDeadline(time.Now().Add(1 * time.Second))
		n, _, err := g.conn.ReadFromUDP(buf)
		if err != nil {
			if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
				continue
			}
			if !g.IsRunning() {
				return
			}
			continue
		}

		if n < 6 {
			continue // Too small for DIS header
		}

		g.handlePDU(buf[:n])
	}
}

// handlePDU dispatches a received DIS PDU.
func (g *DISGateway) handlePDU(data []byte) {
	header := dis.UnpackDISHeader(data)
	if header == nil {
		return
	}

	// Check exercise ID
	if header.ExerciseID != g.config.ExerciseID && header.ExerciseID != 0 {
		return
	}

	switch header.PDUType {
	case dis.TypeEntityState:
		pdu := dis.UnpackEntityStatePDU(data)
		if pdu == nil {
			return
		}
		if g.OnEntityState != nil {
			g.OnEntityState(pdu)
		}
		g.entityStateToJREAP(pdu)

	case dis.TypeFire:
		pdu := dis.UnpackDISFirePDU(data)
		if pdu == nil {
			return
		}
		if g.OnFire != nil {
			g.OnFire(pdu)
		}
		g.fireToJREAP(pdu)

	case dis.TypeDetonation:
		pdu := dis.UnpackDISDetonationPDU(data)
		if pdu == nil {
			return
		}
		if g.OnDetonation != nil {
			g.OnDetonation(pdu)
		}
		g.detonationToJREAP(pdu)

	case dis.TypeEntityStateUpdate:
		// EntityStateUpdate is a lighter version, process same as EntityState
		pdu := dis.UnpackEntityStatePDU(data)
		if pdu == nil {
			return
		}
		if g.OnEntityState != nil {
			g.OnEntityState(pdu)
		}
		g.entityStateToJREAP(pdu)
	}
}

// entityStateToJREAP converts a DIS Entity State PDU to a J0 Track Management message
// and encodes it via the JREAP pipeline.
func (g *DISGateway) entityStateToJREAP(pdu *dis.DISEntityStatePDU) {
	site, app, entity, lat, lon, alt, heading, speed, forceType, _ := dis.DISToJSeries(pdu)

	j0 := &jseries.J0TrackManagement{
		TrackNumber:       entity,
		TrackStatus:       1, // Active
		ForceType:         forceType,
		Time:              time.Now().UTC().Truncate(time.Millisecond),
		Latitude:          lat,
		Longitude:         lon,
		Altitude:          alt,
		Speed:             speed,
		Heading:           heading,
		Quality:           jseries.QualityIndicator{Quality: 3},
		ParticipantNumber: site,
		SensorID:          fmt.Sprintf("DIS-%d-%d", site, app),
		CorrelationID:     fmt.Sprintf("DIS-%d-%d-%d", site, app, entity),
	}

	_, err := g.encoder.EncodeUsing(jreap.J0_TrackManagement, j0)
	if err != nil {
		// Log but don't block
		return
	}
}

// fireToJREAP converts a DIS Fire PDU to a J4 Engagement Order message.
func (g *DISGateway) fireToJREAP(pdu *dis.DISFirePDU) {
	j4 := &jseries.J4EngagementOrder{
		EngagementID:  uint32(pdu.FiringEntityNumber)<<16 | uint32(pdu.TargetEntityNumber),
		TrackNumber:   pdu.TargetEntityNumber,
		Priority:      1,
		WeaponSystem:  jseries.J4WeaponSystem(pdu.MunitionType.Country),
		TimeOnTarget:  time.Now().UTC().Truncate(time.Millisecond),
	}

	_, err := g.encoder.EncodeUsing(jreap.J4_EngagementOrder, j4)
	if err != nil {
		return
	}
}

// detonationToJREAP converts a DIS Detonation PDU to a J5 Engagement Status.
func (g *DISGateway) detonationToJREAP(pdu *dis.DISDetonationPDU) {
	j5 := &jseries.J5EngagementStatus{
		EngagementID:    uint32(pdu.TargetEntityNumber),
		TrackNumber:     pdu.TargetEntityNumber,
		EngagementStage: 2, // DETONATION
		InterceptResult: 1, // COMPLETE
		TimeCompleted:   time.Now().UTC().Truncate(time.Millisecond),
	}

	_, err := g.encoder.EncodeUsing(jreap.J5_EngagementStatus, j5)
	if err != nil {
		return
	}
}

// sendRaw sends a raw UDP packet to the destination.
func (g *DISGateway) sendRaw(data []byte) error {
	addr, err := net.ResolveUDPAddr("udp", g.config.DestAddr)
	if err != nil {
		return fmt.Errorf("resolve dest addr: %w", err)
	}

	g.mu.Lock()
	conn := g.conn
	g.mu.Unlock()

	if conn == nil {
		return fmt.Errorf("gateway not started")
	}

	_, err = conn.WriteToUDP(data, addr)
	return err
}

// J0ToDIS converts a J0 Track Management message back to a DIS Entity State PDU.
func J0ToDIS(j0 *jseries.J0TrackManagement, siteID, appID uint16) *dis.DISEntityStatePDU {
	return dis.JSeriesToDIS(
		j0.TrackNumber,
		j0.Latitude, j0.Longitude, j0.Altitude,
		j0.Heading, j0.Speed,
		j0.ForceType,
		siteID, appID,
	)
}

// PackDISHeader writes a minimal DIS header for outgoing PDUs.
func PackDISHeaderMinimal(pduType uint8, exerciseID uint8, length uint16, timestamp uint32) [6]byte {
	var h [6]byte
	h[0] = byte(dis.DISProtocolVersion)
	h[1] = exerciseID
	h[2] = pduType
	h[3] = 0 // Protocol family
	binary.BigEndian.PutUint16(h[4:6], length)
	return h
}