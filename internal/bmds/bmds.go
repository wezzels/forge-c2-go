package bmds

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"math"
	"sync"
	"time"
)

// TrackQuality represents BMDS track quality indicators
type TrackQuality struct {
	DetectionConfidence float32
	TrackAccuracy       float32
	SourceReliability   uint8
}

// ThreatType classifies detected threat
type ThreatType uint8

const (
	ThreatUnknown ThreatType = iota
	ThreatSRBM
	ThreatMRBM
	ThreatIRBM
	ThreatICBM
	ThreatSLBM
	ThreatAircraft
)

// EngagementStatus tracks engagement state
type EngagementStatus uint8

const (
	EngagementPending EngagementStatus = iota
	EngagementAuthorized
	EngagementInProgress
	EngagementComplete
	EngagementFailed
	EngagementCancelled
)

// BMDSTrack represents a track in the BMDS
type BMDSTrack struct {
	TrackID          uint32
	Latitude         float64
	Longitude        float64
	Altitude         float64
	Velocity         float64
	Heading          float64
	Quality          TrackQuality
	ThreatType       ThreatType
	ThreatAssessment float32
	Timestamp        time.Time
	LastUpdate       time.Time
}

// EngagementOrder represents weapons engagement order
type EngagementOrder struct {
	OrderID       uint32
	TrackID       uint32
	WeaponID      string
	ShooterID     string
	Authorization EngagementAuthorization
	Priority      uint8
	Timestamp     time.Time
}

// EngagementAuthorization validates engagement authorization
type EngagementAuthorization struct {
	AuthorizationLevel uint8
	CommandAuthority   string
	ValidUntil         time.Time
}

// EngagementResult reports engagement outcome
type EngagementResult struct {
	OrderID      uint32
	TrackID      uint32
	Status       EngagementStatus
	Interception bool
	MissDistance float32
	Timestamp    time.Time
}

// Alert represents a BMDS alert
type Alert struct {
	AlertID         uint32
	AlertType       uint8
	TrackID         uint32
	ThreatType      ThreatType
	Confidence      float32
	Position        [3]float64
	EstimatedImpact time.Time
	Timestamp       time.Time
}

// BMDSConnection manages connection to C2BMC
type BMDSConnection struct {
	host          string
	port          uint16
	tls           bool
	authenticated bool
	sessionKey   []byte
	lastHeartbeat time.Time
	mu            sync.RWMutex
}

// NewBMDSConnection creates a new BMDS connection
func NewBMDSConnection(host string, port uint16, tls bool) *BMDSConnection {
	return &BMDSConnection{
		host:          host,
		port:          port,
		tls:           tls,
		lastHeartbeat: time.Now(),
	}
}

// Connect establishes connection to C2BMC
func (c *BMDSConnection) Connect() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.lastHeartbeat = time.Now()
	return nil
}

// Heartbeat sends keepalive to C2BMC
func (c *BMDSConnection) Heartbeat() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.lastHeartbeat = time.Now()
	return nil
}

// IsAuthenticated returns connection state
func (c *BMDSConnection) IsAuthenticated() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.authenticated
}

// TrackManager manages BMDS tracks
type TrackManager struct {
	mu     sync.RWMutex
	tracks map[uint32]*BMDSTrack
}

// NewTrackManager creates a new track manager
func NewTrackManager() *TrackManager {
	return &TrackManager{tracks: make(map[uint32]*BMDSTrack)}
}

// AddTrack adds or updates a track
func (tm *TrackManager) AddTrack(track *BMDSTrack) error {
	if track == nil {
		return fmt.Errorf("nil track")
	}
	tm.mu.Lock()
	defer tm.mu.Unlock()
	track.LastUpdate = time.Now()
	tm.tracks[track.TrackID] = track
	return nil
}

// GetTrack retrieves a track by ID
func (tm *TrackManager) GetTrack(trackID uint32) (*BMDSTrack, bool) {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	t, ok := tm.tracks[trackID]
	return t, ok
}

// GetAllTracks returns all tracks
func (tm *TrackManager) GetAllTracks() []*BMDSTrack {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	result := make([]*BMDSTrack, 0, len(tm.tracks))
	for _, t := range tm.tracks {
		result = append(result, t)
	}
	return result
}

// EngagementManager coordinates engagements
type EngagementManager struct {
	mu      sync.RWMutex
	orders  map[uint32]*EngagementOrder
	results map[uint32]*EngagementResult
	onEngage func(*EngagementOrder) error
	onAlert  func(*Alert)
}

// NewEngagementManager creates a new engagement manager
func NewEngagementManager() *EngagementManager {
	return &EngagementManager{
		orders:  make(map[uint32]*EngagementOrder),
		results: make(map[uint32]*EngagementResult),
	}
}

// SubmitEngagementOrder submits an engagement order
func (em *EngagementManager) SubmitEngagementOrder(order *EngagementOrder) error {
	if order.TrackID == 0 {
		return fmt.Errorf("invalid track ID")
	}
	if order.Authorization.AuthorizationLevel == 0 {
		return fmt.Errorf("no authorization level")
	}
	em.mu.Lock()
	defer em.mu.Unlock()
	em.orders[order.OrderID] = order
	return nil
}

// RecordEngagementResult records engagement result
func (em *EngagementManager) RecordEngagementResult(result *EngagementResult) {
	em.mu.Lock()
	defer em.mu.Unlock()
	em.results[result.OrderID] = result
}

// OnEngagement registers engagement callback
func (em *EngagementManager) OnEngagement(cb func(*EngagementOrder) error) {
	em.onEngage = cb
}

// MessageAuthenticator provides MAC generation/verification
type MessageAuthenticator struct {
	key []byte
}

// NewMessageAuthenticator creates a new authenticator
func NewMessageAuthenticator(key []byte) *MessageAuthenticator {
	return &MessageAuthenticator{key: key}
}

// GenerateMAC generates a message authentication code
func (ma *MessageAuthenticator) GenerateMAC(message []byte) []byte {
	h := hmac.New(sha256.New, ma.key)
	h.Write(message)
	return h.Sum(nil)
}

// VerifyMAC verifies a message authentication code
func (ma *MessageAuthenticator) VerifyMAC(message, mac []byte) bool {
	return hmac.Equal(mac, ma.GenerateMAC(message))
}

// EncodeTrack encodes a BMDS track for transmission
func EncodeTrack(track *BMDSTrack, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint32(buf[off:], track.TrackID)
	off += 4
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(track.Latitude))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(track.Longitude))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(track.Altitude))
	off += 8
	binary.LittleEndian.PutUint32(buf[off:], math.Float32bits(track.Quality.DetectionConfidence))
	off += 4
	buf[off] = uint8(track.ThreatType)
	off++
	return off
}

// =============================================================================
// Phase 5.2: BMDS Software Components (emulator-only, hardware deferred)
// =============================================================================

// BMDSEmulator represents the BMDS software stack
type BMDSEmulator struct {
	TPY2   *TPY2Emulator
	GBR    *GBREmulator
	Aegis  *AegisEmulator
	THAAD  *THAADEmulator
	Patriot *PatriotEmulator
	C2BMC  *C2BMCEmulator
}

// TPY2Emulator represents the AN/TPY-2 radar emulator
type TPY2Emulator struct {
	Range      float64
	Sectors    int
	Detections int
}

// NewTPY2Emulator creates a TPY-2 emulator
func NewTPY2Emulator() *TPY2Emulator {
	return &TPY2Emulator{
		Range:   6304000, // 6304 km
		Sectors: 24,
	}
}

// GBREmulator represents the GBR radar emulator
type GBREmulator struct {
	Range float64
}

// NewGBREmulator creates a GBR emulator
func NewGBREmulator() *GBREmulator {
	return &GBREmulator{
		Range: 67115000, // 67115 km
	}
}

// AegisEmulator represents the Aegis BMD emulator
type AegisEmulator struct {
	SPY1Range float64
	Tracks    int
}

// NewAegisEmulator creates an Aegis emulator
func NewAegisEmulator() *AegisEmulator {
	return &AegisEmulator{
		SPY1Range: 31605000, // 31605 km
	}
}

// THAADEmulator represents the THAAD battery emulator
type THAADEmulator struct {
	Range      float64
	PK         float64
	Launchers  int
}

// NewTHAADEmulator creates a THAAD emulator
func NewTHAADEmulator() *THAADEmulator {
	return &THAADEmulator{
		Range:    300000, // 300 km
		PK:       0.90,
		Launchers: 6,
	}
}

// PatriotEmulator represents the Patriot battery emulator
type PatriotEmulator struct {
	Range   float64
	PAC2PK  float64
	PAC3PK  float64
}

// NewPatriotEmulator creates a Patriot emulator
func NewPatriotEmulator() *PatriotEmulator {
	return &PatriotEmulator{
		Range:  150000, // 150 km
		PAC2PK: 0.70,
		PAC3PK: 0.75,
	}
}

// C2BMCEmulator represents the C2BMC hub emulator
type C2BMCEmulator struct {
	Federates int
	Tracks    int
}

// NewC2BMCEmulator creates a C2BMC emulator
func NewC2BMCEmulator() *C2BMCEmulator {
	return &C2BMCEmulator{
		Federates: 6,
	}
}

// NewBMDSEmulator creates a complete BMDS emulator
func NewBMDSEmulator() *BMDSEmulator {
	return &BMDSEmulator{
		TPY2:    NewTPY2Emulator(),
		GBR:     NewGBREmulator(),
		Aegis:   NewAegisEmulator(),
		THAAD:   NewTHAADEmulator(),
		Patriot: NewPatriotEmulator(),
		C2BMC:   NewC2BMCEmulator(),
	}
}

// RunEmulation runs the BMDS emulation (software-only)
func (b *BMDSEmulator) RunEmulation() error {
	return nil
}
