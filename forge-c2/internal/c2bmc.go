package internal

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"forge-c2/jreap"
)

// C2BMCInterface simulates the Command and Control, Battle Management, and Communications
// system that interfaces with the Ballistic Missile Defense System (BMDS).
// This is a simulation/interface layer - actual C2BMC is a classified system.
type C2BMCInterface struct {
	mu sync.RWMutex

	// Connection state
	connected    bool
	lastHeartbeat time.Time
	connectionURL string

	// Track database (from FORGE-C2)
	tracks map[string]*Track

	// Engagement orders
	engagements map[string]*EngagementOrder

	// Alert states
	alerts map[string]*BMDAlert

	// BMDS status
	bmdsStatus *BMDSStatus

	// Engagement rules
	engageRadius float64 // km - radius for auto-engage
	engageMinTL  int     // minimum threat level for auto-engage
}

// BMDSStatus represents the overall BMD system status
type BMDSStatus struct {
	SystemMode    string    `json:"system_mode"`    // ACTIVE, STANDBY, TEST, DISABLED
	EngagementCap int       `json:"engagement_cap"` // number of simultaneous engagements
	ActiveSensors []string  `json:"active_sensors"`
	LastUpdate    time.Time `json:"last_update"`
}

// EngagementOrder represents an engagement order from C2BMC
type EngagementOrder struct {
	OrderID         string    `json:"order_id"`
	TrackID         string    `json:"track_id"`
	Priority        int       `json:"priority"` // 1-5
	WeaponSystem    string    `json:"weapon_system"` // GBI, SM-3, THAAD, PATRIOT
	TimeOnTarget    time.Time `json:"time_on_target"`
	InterceptProb   float64   `json:"intercept_probability"`
	Status          string    `json:"status"` // PENDING, LAUNCHED, INTERCEPTED, FAILED, CANCELLED
	LaunchSite      string    `json:"launch_site"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// BMDAlert represents a BMD-level alert
type BMDAlert struct {
	AlertID       string    `json:"alert_id"`
	TrackID       string    `json:"track_id"`
	AlertType     string    `json:"alert_type"` // LAUNCH_DETECTED, THREAT_CONFIRMED, ENGAGEMENT_ORDER, INTERCEPT_COMPLETE
	Severity      int       `json:"severity"`    // 1-5
	Message       string    `json:"message"`
	Acknowledged  bool      `json:"acknowledged"`
	CreatedAt     time.Time `json:"created_at"`
}

// NewC2BMCInterface creates a new C2BMC interface
func NewC2BMCInterface(connectionURL string) *C2BMCInterface {
	return &C2BMCInterface{
		connectionURL:  connectionURL,
		tracks:        make(map[string]*Track),
		engagements:   make(map[string]*EngagementOrder),
		alerts:        make(map[string]*BMDAlert),
		bmdsStatus: &BMDSStatus{
			SystemMode:    "ACTIVE",
			EngagementCap: 20,
			ActiveSensors: []string{"SBIRS-GEO-1", "SBIRS-GEO-2", "UEWR-1", "TPY-2-1"},
		},
		engageRadius: 1000, // km
		engageMinTL:  4,   // threat level 4 or 5
	}
}

// Connect establishes connection to C2BMC
func (c *C2BMCInterface) Connect(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Simulate connection establishment
	log.Printf("[C2BMC] Connecting to %s...", c.connectionURL)

	// In reality, this would be a TLS connection to the C2BMC system
	// For simulation, we just mark as connected
	c.connected = true
	c.lastHeartbeat = time.Now()

	log.Printf("[C2BMC] Connected successfully")
	return nil
}

// Disconnect closes the C2BMC connection
func (c *C2BMCInterface) Disconnect() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.connected = false
	log.Printf("[C2BMC] Disconnected")
}

// IsConnected returns connection state
func (c *C2BMCInterface) IsConnected() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.connected
}

// UpdateTrack updates a track in the C2BMC database
func (c *C2BMCInterface) UpdateTrack(track *Track) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.tracks[track.TrackID] = track
	log.Printf("[C2BMC] Track updated: %s at (%.4f, %.4f, %.0fm) TL=%d",
		track.TrackID, track.Latitude, track.Longitude, track.Altitude, track.ThreatLevel)

	// Check if this track warrants an engagement order
	c.checkEngagement(track)
}

// checkEngagement determines if a track should generate an engagement order
func (c *C2BMCInterface) checkEngagement(track *Track) {
	// Only engage high-threat tracks
	if track.ThreatLevel < c.engageMinTL {
		return
	}

	// Check if already engaged
	for _, eng := range c.engagements {
		if eng.TrackID == track.TrackID && eng.Status == "PENDING" {
			return
		}
	}

	// Create engagement order
	order := c.createEngagementOrder(track)
	c.engagements[order.OrderID] = order

	// Create alert
	alert := &BMDAlert{
		AlertID:      "ALERT-" + order.OrderID,
		TrackID:      track.TrackID,
		AlertType:    "ENGAGEMENT_ORDER",
		Severity:     track.ThreatLevel,
		Message:       "Engagement order created for " + track.TrackID,
		CreatedAt:     time.Now(),
	}
	c.alerts[alert.AlertID] = alert

	log.Printf("[C2BMC] 🚀 ENGAGEMENT ORDER: %s for %s with %s (P=%.1f%%)",
		order.OrderID, track.TrackID, order.WeaponSystem, order.InterceptProb*100)
}

// createEngagementOrder creates an engagement order for a track
func (c *C2BMCInterface) createEngagementOrder(track *Track) *EngagementOrder {
	// Determine weapon system based on altitude
	var weapon string
	var interceptProb float64

	switch {
	case track.Altitude > 100000: // > 100km - space
		weapon = "GBI"
		interceptProb = 0.65
	case track.Altitude > 40000: // > 40km - exoatmospheric
		weapon = "SM-3"
		interceptProb = 0.75
	case track.Altitude > 15000: // > 15km - upper atmosphere
		weapon = "THAAD"
		interceptProb = 0.85
	default: // lower atmosphere
		weapon = "PATRIOT"
		interceptProb = 0.90
	}

	// Calculate time on target (simplified)
	tot := time.Now().Add(5 * time.Minute)

	return &EngagementOrder{
		OrderID:       "ENG-" + track.TrackID + "-" + time.Now().Format("150405"),
		TrackID:       track.TrackID,
		Priority:      track.ThreatLevel,
		WeaponSystem:  weapon,
		TimeOnTarget:  tot,
		InterceptProb: interceptProb,
		Status:        "PENDING",
		LaunchSite:    c.selectLaunchSite(track),
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}

// selectLaunchSite chooses the best launch site for intercept
func (c *C2BMCInterface) selectLaunchSite(track *Track) string {
	// Simplified - in reality would calculate based on geometry
	sites := []string{"Fort Greely", "Vandenberg", "Kwajalein"}
	return sites[track.ThreatLevel%len(sites)]
}

// GetEngagements returns all current engagements
func (c *C2BMCInterface) GetEngagements() []*EngagementOrder {
	c.mu.RLock()
	defer c.mu.RUnlock()

	engs := make([]*EngagementOrder, 0, len(c.engagements))
	for _, e := range c.engagements {
		engs = append(engs, e)
	}
	return engs
}

// UpdateEngagementStatus updates an engagement status
func (c *C2BMCInterface) UpdateEngagementStatus(orderID, status string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if eng, ok := c.engagements[orderID]; ok {
		eng.Status = status
		eng.UpdatedAt = time.Now()

		// Create alert for status change
		alert := &BMDAlert{
			AlertID:   "ALERT-" + orderID + "-" + status,
			TrackID:   eng.TrackID,
			AlertType: "INTERCEPT_COMPLETE",
			Severity:  3,
			Message:   "Engagement " + orderID + " status: " + status,
			CreatedAt: time.Now(),
		}
		c.alerts[alert.AlertID] = alert

		log.Printf("[C2BMC] Engagement %s: %s", orderID, status)
	}
}

// GetAlerts returns all unacknowledged alerts
func (c *C2BMCInterface) GetAlerts() []*BMDAlert {
	c.mu.RLock()
	defer c.mu.RUnlock()

	alerts := make([]*BMDAlert, 0)
	for _, a := range c.alerts {
		if !a.Acknowledged {
			alerts = append(alerts, a)
		}
	}
	return alerts
}

// AcknowledgeAlert marks an alert as acknowledged
func (c *C2BMCInterface) AcknowledgeAlert(alertID string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if alert, ok := c.alerts[alertID]; ok {
		alert.Acknowledged = true
	}
}

// GetBMDSStatus returns current BMDS status
func (c *C2BMCInterface) GetBMDSStatus() *BMDSStatus {
	c.mu.RLock()
	defer c.mu.RUnlock()

	status := *c.bmdsStatus
	status.LastUpdate = time.Now()
	return &status
}

// SendHeartbeat sends a heartbeat to C2BMC
func (c *C2BMCInterface) SendHeartbeat() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if !c.connected {
		return nil // Would return error in production
	}

	c.lastHeartbeat = time.Now()
	return nil
}

// ToJSON serializes the C2BMC state for WebSocket broadcast
func (c *C2BMCInterface) ToJSON() ([]byte, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	state := struct {
		Connected    bool               `json:"connected"`
		BMDSStatus   *BMDSStatus        `json:"bmds_status"`
		Tracks       map[string]*Track  `json:"tracks"`
		Engagements  []*EngagementOrder `json:"engagements"`
		Alerts       []*BMDAlert        `json:"alerts"`
		Heartbeat    time.Time          `json:"heartbeat"`
	}{
		Connected:   c.connected,
		BMDSStatus:  c.bmdsStatus,
		Tracks:      c.tracks,
		Heartbeat:   c.lastHeartbeat,
	}

	// Convert engagements map to slice
	for _, e := range c.engagements {
		state.Engagements = append(state.Engagements, e)
	}

	// Convert alerts map to slice
	for _, a := range c.alerts {
		state.Alerts = append(state.Alerts, a)
	}

	return json.Marshal(state)
}

// SimulateInterceptComplete simulates an intercept completing
func (c *C2BMCInterface) SimulateInterceptComplete(orderID string) {
	statuses := []string{"INTERCEPTED", "INTERCEPTED", "FAILED"} // 66% success rate
	newStatus := statuses[time.Now().UnixNano()%3]

	c.UpdateEngagementStatus(orderID, newStatus)
}

// JREAPOutput encodes an EngagementOrder as JREAP J4.0 and returns the bytes.
// This is used for JREAP-C output to external C2 systems.
func (c *C2BMCInterface) JREAPOutput(order *EngagementOrder) ([]byte, error) {
	encoder := jreap.NewEncoder("FORGE-NODE-0001", "C2BMC-ENGAGE")
	return encoder.EncodeEngagementOrder(order)
}

// JREAPOutputAll encodes all current engagement orders as JREAP and returns them.
// Returns a map of orderID -> JREAP bytes.
func (c *C2BMCInterface) JREAPOutputAll() (map[string][]byte, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	encoder := jreap.NewEncoder("FORGE-NODE-0001", "C2BMC-ENGAGE")
	results := make(map[string][]byte)

	for id, order := range c.engagements {
		msg, err := encoder.EncodeEngagementOrder(order)
		if err != nil {
			return nil, err
		}
		results[id] = msg
	}

	return results, nil
}
