// Package gateway implements TENA gateway for FORGE-C2.
// TENAGateway bridges TENA session objects to the JREAP pipeline.
package gateway

import (
	"fmt"
	"sync"
	"time"

	"forge-c2/internal/dis"
	"forge-c2/internal/hla"
	"forge-c2/internal/tena"
	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// TENAGatewayConfig holds configuration for a TENA gateway.
type TENAGatewayConfig struct {
	SessionID      uint64
	DiscoveryAddr  string
	LocalFederate  string
	SiteID         uint16
	ApplicationID  uint16
}

// DefaultTENAGatewayConfig returns sensible defaults.
func DefaultTENAGatewayConfig() TENAGatewayConfig {
	return TENAGatewayConfig{
		SessionID:     1,
		DiscoveryAddr: "225.0.0.2:5005",
		LocalFederate: "FORGE-C2-TENA",
		SiteID:        1,
		ApplicationID: 1,
	}
}

// TENAGateway bridges TENA sessions to FORGE-C2 JREAP pipeline.
type TENAGateway struct {
	config     TENAGatewayConfig
	session    *tena.Gateway
	discovery  *tena.DiscoveryManager
	mapper     *tena.DISMapper
	hlaMapper  *tena.HLAMapper
	encoder    *jreap.Encoder
	meta       *mdpa.MDPAMetadata

	mu       sync.Mutex
	running  bool

	// Callbacks
	OnDiscoverGateway func(ann *tena.GatewayAnnouncement)
	OnSessionEvent    func(instanceID uint64, event string)
}

// NewTENAGateway creates a new TENA gateway.
func NewTENAGateway(config TENAGatewayConfig, encoder *jreap.Encoder, meta *mdpa.MDPAMetadata) *TENAGateway {
	return &TENAGateway{
		config:  config,
		encoder: encoder,
		meta:    meta,
	}
}

// Start initializes the TENA session and discovery.
func (g *TENAGateway) Start() error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.running {
		return fmt.Errorf("TENA gateway already running")
	}

	// Create session gateway
	g.session = tena.NewGateway(g.config.SessionID)

	// Create discovery manager
	g.discovery = tena.NewDiscoveryManager(5005)
	g.discovery.SetOnDiscover(func(ann *tena.GatewayAnnouncement) {
		if g.OnDiscoverGateway != nil {
			g.OnDiscoverGateway(ann)
		}
	})

	// Create mappers
	g.mapper = &tena.DISMapper{}
	g.hlaMapper = &tena.HLAMapper{}

	g.running = true
	return nil
}

// Stop shuts down the TENA gateway.
func (g *TENAGateway) Stop() error {
	g.mu.Lock()
	defer g.mu.Unlock()

	g.running = false
	return nil
}

// IsRunning returns whether the gateway is active.
func (g *TENAGateway) IsRunning() bool {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.running
}

// RegisterTENAToDIS registers a TENA→DIS mapping.
func (g *TENAGateway) RegisterTENAToDIS(tenaInstance, disID uint64) error {
	if g.session == nil {
		return fmt.Errorf("gateway not started")
	}
	return g.session.RegisterTENAToDIS(tenaInstance, disID)
}

// RegisterTENAToHLA registers a TENA→HLA mapping.
func (g *TENAGateway) RegisterTENAToHLA(tenaInstance uint64, hlaHandle uint32) error {
	if g.session == nil {
		return fmt.Errorf("gateway not started")
	}
	return g.session.RegisterTENAToHLA(tenaInstance, hlaHandle)
}

// SyncTENAToDIS synchronizes a TENA instance to DIS.
func (g *TENAGateway) SyncTENAToDIS(instance uint64) error {
	if g.session == nil {
		return fmt.Errorf("gateway not started")
	}
	return g.session.SyncTENAToDIS(instance)
}

// SyncTENAToHLA synchronizes a TENA instance to HLA.
func (g *TENAGateway) SyncTENAToHLA(instance uint64, attrs map[uint32][]byte) error {
	if g.session == nil {
		return fmt.Errorf("gateway not started")
	}
	return g.session.SyncTENAToHLA(instance, attrs)
}

// DiscoverGateways discovers available TENA gateways.
func (g *TENAGateway) DiscoverGateways() []*tena.GatewayAnnouncement {
	if g.discovery == nil {
		return nil
	}
	return g.discovery.Discover()
}

// TENATrackToJ0 converts TENA track data to a J0 Track Management message.
func TENATrackToJ0(trackNum uint16, lat, lon, alt, speed, heading float64, forceType uint8) *jseries.J0TrackManagement {
	return &jseries.J0TrackManagement{
		TrackNumber:       trackNum,
		TrackStatus:       2, // Active
		ForceType:         forceType,
		Time:              time.Now().UTC().Truncate(time.Millisecond),
		Latitude:          lat,
		Longitude:         lon,
		Altitude:          alt,
		Speed:             speed,
		Heading:           heading,
		Quality:           jseries.QualityIndicator{Quality: 3},
	}
}

// J0ToTENA converts a J0 message to TENA gateway track data.
func J0ToTENA(j0 *jseries.J0TrackManagement, sessionID uint64) *TENATrackData {
	return &TENATrackData{
		SessionID:  sessionID,
		TrackNum:   j0.TrackNumber,
		Lat:        j0.Latitude,
		Lon:        j0.Longitude,
		Alt:        j0.Altitude,
		Speed:      j0.Speed,
		Heading:    j0.Heading,
		ForceType:  j0.ForceType,
		Timestamp:  time.Now().UTC(),
	}
}

// TENATrackData is a simplified track representation for TENA gateway bridging.
type TENATrackData struct {
	SessionID  uint64
	TrackNum   uint16
	Lat        float64
	Lon        float64
	Alt        float64
	Speed      float64
	Heading    float64
	ForceType  uint8
	Timestamp  time.Time
}

// DISToJ0 converts a DIS Entity State PDU to J0 via TENA gateway.
func DISToJ0(pdu *dis.DISEntityStatePDU) *jseries.J0TrackManagement {
	site, app, entity, lat, lon, alt, heading, speed, forceType, _ := dis.DISToJSeries(pdu)
	return &jseries.J0TrackManagement{
		TrackNumber:       entity,
		TrackStatus:       2,
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
	}
}

// HLAToJ0 converts an HLA entity to J0 Track Management.
func HLAToJ0(entity *hla.HLAEntity) *jseries.J0TrackManagement {
	return &jseries.J0TrackManagement{
		TrackNumber:       entity.EntityID.EntityNumber,
		TrackStatus:       2, // Active
		ForceType:         uint8(entity.ForceID),
		Time:              time.Now().UTC().Truncate(time.Millisecond),
		Latitude:          entity.Position.X, // Assuming geodetic coords stored in X,Y,Z
		Longitude:         entity.Position.Y,
		Altitude:          entity.Position.Z,
		Speed:             entity.Velocity.X,
		Heading:           entity.Orientation.Psi * 180.0 / 3.14159265,
		Quality:           jseries.QualityIndicator{Quality: 3},
		ParticipantNumber: entity.EntityID.SiteNumber,
		SensorID:          fmt.Sprintf("HLA-%d-%d", entity.EntityID.SiteNumber, entity.EntityID.ApplicationNumber),
	}
}