// Package gateway implements HLA/HLA/TENA gateway services for FORGE-C2.
// The HLAGateway bridges HLA federation object updates to the JREAP pipeline.
package gateway

import (
	"fmt"
	"sync"
	"time"

	"forge-c2/internal/hla"
	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// HLAGatewayConfig holds configuration for an HLA gateway.
type HLAGatewayConfig struct {
	FederationName string
	FederateType   string
	FederateName   string
	SiteID         uint16
	ApplicationID  uint16
}

// DefaultHLAGatewayConfig returns sensible defaults.
func DefaultHLAGatewayConfig() HLAGatewayConfig {
	return HLAGatewayConfig{
		FederationName: "FORGE-Federation",
		FederateType:   hla.FederateTypeGateway,
		FederateName:   "FORGE-C2-HLA",
		SiteID:         1,
		ApplicationID:  1,
	}
}

// HLAGateway bridges HLA federation updates to FORGE-C2 JREAP pipeline.
type HLAGateway struct {
	config      HLAGatewayConfig
	rti         *hla.RTIGateway
	objMgr      *hla.ObjectManager
	declMgr     *hla.DeclarationManager
	timeMgr     *hla.TimeManager
	encoder     *jreap.Encoder
	meta        *mdpa.MDPAMetadata

	mu         sync.Mutex
	running    bool
	fedHandle  uint32

	// Callbacks
	OnDiscoverObject func(handle uint32, classHandle uint32, name string)
	OnReflectAttrs   func(handle uint32, attrs map[uint32][]byte, tag []byte)
	OnRemoveObject   func(handle uint32, tag []byte)
}

// NewHLAGateway creates a new HLA gateway.
func NewHLAGateway(config HLAGatewayConfig, encoder *jreap.Encoder, meta *mdpa.MDPAMetadata) *HLAGateway {
	return &HLAGateway{
		config:  config,
		encoder: encoder,
		meta:    meta,
	}
}

// Start creates the federation, joins, and publishes/subscribes.
func (g *HLAGateway) Start() error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.running {
		return fmt.Errorf("HLA gateway already running")
	}

	g.rti = hla.NewRTIGateway()

	// Create federation
	if err := g.rti.CreateFederation(g.config.FederationName, hla.FOMVersion); err != nil {
		// Federation might already exist, try to join
	}

	// Join federation
	handle, err := g.rti.JoinFederation(g.config.FederationName, g.config.FederateType, g.config.FederateName)
	if err != nil {
		return fmt.Errorf("join federation: %w", err)
	}
	g.fedHandle = handle

	// Set up object manager with callbacks
	g.objMgr = hla.NewObjectManager()
	g.objMgr.SetDiscoveryCallback(func(object, classHandle uint32, name string) {
		if g.OnDiscoverObject != nil {
			g.OnDiscoverObject(object, classHandle, name)
		}
	})
	g.objMgr.SetReflectionCallback(func(object uint32, attrs map[uint32][]byte, tag []byte) {
		if g.OnReflectAttrs != nil {
			g.OnReflectAttrs(object, attrs, tag)
		}
		g.reflectToJREAP(object, attrs)
	})

	// Set up declaration manager
	g.declMgr = hla.NewDeclarationManager()
	entityAttrs := []uint32{
		hla.HandleAttrEntityID, hla.HandleAttrPosition,
		hla.HandleAttrVelocity, hla.HandleAttrEntityType,
		hla.HandleAttrForceID, hla.HandleAttrMarking,
	}
	g.declMgr.PublishObjectClass(hla.HandleObjectEntity, entityAttrs)
	g.declMgr.SubscribeObjectClassAttributes(hla.HandleObjectEntity, entityAttrs)

	// Set up time manager
	g.timeMgr = hla.NewTimeManager()
	g.timeMgr.EnableTimeRegulation(10 * time.Millisecond)
	g.timeMgr.EnableTimeConstrained()

	g.running = true
	return nil
}

// Stop resigns from the federation.
func (g *HLAGateway) Stop() error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if !g.running {
		return nil
	}

	if g.rti != nil {
		g.rti.ResignFederation(g.fedHandle, hla.ResignDeleteObjects)
	}

	g.running = false
	return nil
}

// IsRunning returns whether the gateway is active.
func (g *HLAGateway) IsRunning() bool {
	g.mu.Lock()
	defer g.mu.Unlock()
	return g.running
}

// PublishEntity publishes an HLA entity to the federation.
func (g *HLAGateway) PublishEntity(entity *hla.HLAEntity) (uint32, error) {
	if g.objMgr == nil {
		return 0, fmt.Errorf("gateway not started")
	}

	handle, err := g.objMgr.RegisterObjectInstance(hla.HandleObjectEntity, entity.Name)
	if err != nil {
		return 0, err
	}

	// Pack and update attributes
	buf := make([]byte, 1024)
	n := hla.PackEntityAttributes(entity, buf)
	attrs := map[uint32][]byte{
		hla.HandleAttrEntityID: buf[:6],
	}
	// Pack all attributes
	_ = n
	if err := g.objMgr.UpdateAttributeValues(handle, attrs, nil); err != nil {
		return 0, err
	}

	return handle, nil
}

// RemoveEntity removes an HLA entity from the federation.
func (g *HLAGateway) RemoveEntity(handle uint32) error {
	if g.objMgr == nil {
		return fmt.Errorf("gateway not started")
	}
	return g.objMgr.DeleteObjectInstance(handle, nil)
}

// AdvanceTime advances the HLA logical time.
func (g *HLAGateway) AdvanceTime(t time.Time) error {
	if g.timeMgr == nil {
		return fmt.Errorf("gateway not started")
	}
	return g.timeMgr.TimeAdvanceRequest(t)
}

// QueryLogicalTime returns the current HLA logical time.
func (g *HLAGateway) QueryLogicalTime() time.Time {
	if g.timeMgr == nil {
		return time.Time{}
	}
	return g.timeMgr.QueryLogicalTime()
}

// reflectToJREAP converts an HLA attribute reflection to J0 Track Management.
func (g *HLAGateway) reflectToJREAP(objectHandle uint32, attrs map[uint32][]byte) {
	// Extract entity ID if present
	entityIDData, hasEntityID := attrs[hla.HandleAttrEntityID]
	if !hasEntityID || len(entityIDData) < 6 {
		return
	}

	// Decode entity ID
	_ = entityIDData // We'd need full binary decoding here

	// Create J0 Track Management message
	j0 := &jseries.J0TrackManagement{
		TrackNumber:       uint16(objectHandle & 0xFFFF),
		TrackStatus:       2, // Updated
		ForceType:         4, // Unknown by default
		Time:              time.Now().UTC().Truncate(time.Millisecond),
		Quality:           jseries.QualityIndicator{Quality: 3},
		ParticipantNumber: g.config.SiteID,
	}

	// Extract position if present
	if posData, ok := attrs[hla.HandleAttrPosition]; ok && len(posData) >= 24 {
		// Position is 3 x float64 LE
		// We'd need proper decoding; simplified for now
		_ = posData
	}

	_, err := g.encoder.EncodeUsing(jreap.J0_TrackManagement, j0)
	if err != nil {
		return
	}
}

// J0ToHLA converts a J0 Track Management message to an HLA Entity.
func J0ToHLA(j0 *jseries.J0TrackManagement, siteID, appID uint16) *hla.HLAEntity {
	entity := hla.NewEntity(siteID, appID, j0.TrackNumber)
	entity.SetLocation(j0.Latitude, j0.Longitude, j0.Altitude)

	// Map heading to orientation (yaw in radians)
	entity.SetOrientation(0, 0, j0.Heading*3.14159265/180.0)
	entity.SetVelocity(j0.Speed, 0, 0)

	// Map force type
	switch j0.ForceType {
	case 1:
		entity.ForceID = hla.ForceFriendly
	case 2:
		entity.ForceID = hla.ForceOpposing
	case 3:
		entity.ForceID = hla.ForceNeutral
	default:
		entity.ForceID = hla.ForceOther
	}

	entity.Marking = fmt.Sprintf("TRK-%04d", j0.TrackNumber)
	return entity
}

// J12ToHLAInteraction converts a J12 Alert to an HLA interaction.
func J12ToHLAInteraction(j12 *jseries.J12Alert) map[uint32][]byte {
	params := make(map[uint32][]byte)

	// AlertType as byte
	params[1] = []byte{j12.AlertType}
	// Severity as byte
	params[2] = []byte{j12.Severity}
	// TrackNumber as uint16 LE
	tn := make([]byte, 2)
	tn[0] = byte(j12.TrackNumber)
	tn[1] = byte(j12.TrackNumber >> 8)
	params[3] = tn

	return params
}