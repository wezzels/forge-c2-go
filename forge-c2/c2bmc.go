package main

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"
)

// C2BMCInterface simulates Command and Control, Battle Management, Communications
type C2BMCInterface struct {
	mu            sync.RWMutex
	connected     bool
	lastHeartbeat time.Time
	connectionURL string
	tracks        map[string]*Track
	engagements   map[string]*EngagementOrder
	alerts        map[string]*BMDAlert
	bmdsStatus   *BMDSStatus
	engageMinTL  int
}

type BMDSStatus struct {
	SystemMode    string    `json:"system_mode"`
	EngagementCap int       `json:"engagement_cap"`
	ActiveSensors []string  `json:"active_sensors"`
	LastUpdate    time.Time `json:"last_update"`
}

type EngagementOrder struct {
	OrderID       string    `json:"order_id"`
	TrackID       string    `json:"track_id"`
	Priority      int       `json:"priority"`
	WeaponSystem  string    `json:"weapon_system"`
	TimeOnTarget  time.Time `json:"time_on_target"`
	InterceptProb float64   `json:"intercept_probability"`
	Status        string    `json:"status"`
	LaunchSite    string    `json:"launch_site"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type BMDAlert struct {
	AlertID      string    `json:"alert_id"`
	TrackID      string    `json:"track_id"`
	AlertType    string    `json:"alert_type"`
	Severity     int       `json:"severity"`
	Message      string    `json:"message"`
	Acknowledged bool      `json:"acknowledged"`
	CreatedAt    time.Time `json:"created_at"`
}

func NewC2BMCInterface(url string) *C2BMCInterface {
	return &C2BMCInterface{
		connectionURL: url,
		tracks:       make(map[string]*Track),
		engagements:  make(map[string]*EngagementOrder),
		alerts:       make(map[string]*BMDAlert),
		bmdsStatus: &BMDSStatus{
			SystemMode:    "ACTIVE",
			EngagementCap: 20,
			ActiveSensors: []string{"SBIRS-GEO-1", "SBIRS-GEO-2", "UEWR-1", "TPY-2-1"},
		},
		engageMinTL: 4,
	}
}

func (c *C2BMCInterface) Connect(ctx context.Context) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	log.Printf("[C2BMC] Connecting to %s...", c.connectionURL)
	c.connected = true
	c.lastHeartbeat = time.Now()
	log.Printf("[C2BMC] Connected successfully")
	return nil
}

func (c *C2BMCInterface) Disconnect() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.connected = false
	log.Printf("[C2BMC] Disconnected")
}

func (c *C2BMCInterface) IsConnected() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.connected
}

func (c *C2BMCInterface) UpdateTrack(track *Track) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.tracks[track.TrackID] = track
	log.Printf("[C2BMC] Track: %s at (%.4f, %.4f, %.0fm) TL=%d",
		track.TrackID, track.Latitude, track.Longitude, track.Altitude, track.ThreatLevel)
	c.checkEngagement(track)
}

func (c *C2BMCInterface) checkEngagement(track *Track) {
	if track.ThreatLevel < c.engageMinTL {
		return
	}
	for _, eng := range c.engagements {
		if eng.TrackID == track.TrackID && eng.Status == "PENDING" {
			return
		}
	}
	order := c.createEngagementOrder(track)
	c.engagements[order.OrderID] = order
	c.alerts["ALERT-"+order.OrderID] = &BMDAlert{
		AlertID:   "ALERT-" + order.OrderID,
		TrackID:   track.TrackID,
		AlertType: "ENGAGEMENT_ORDER",
		Severity:  track.ThreatLevel,
		Message:   "Engagement order created for " + track.TrackID,
		CreatedAt: time.Now(),
	}
	log.Printf("[C2BMC] 🚀 ENGAGEMENT ORDER: %s for %s with %s (P=%.1f%%)",
		order.OrderID, track.TrackID, order.WeaponSystem, order.InterceptProb*100)
}

func (c *C2BMCInterface) createEngagementOrder(track *Track) *EngagementOrder {
	var weapon string
	var prob float64
	switch {
	case track.Altitude > 100000:
		weapon = "GBI"
		prob = 0.65
	case track.Altitude > 40000:
		weapon = "SM-3"
		prob = 0.75
	case track.Altitude > 15000:
		weapon = "THAAD"
		prob = 0.85
	default:
		weapon = "PATRIOT"
		prob = 0.90
	}
	sites := []string{"Fort Greely", "Vandenberg", "Kwajalein"}
	return &EngagementOrder{
		OrderID:       "ENG-" + track.TrackID + "-" + time.Now().Format("150405"),
		TrackID:       track.TrackID,
		Priority:      track.ThreatLevel,
		WeaponSystem:  weapon,
		TimeOnTarget:  time.Now().Add(5 * time.Minute),
		InterceptProb: prob,
		Status:        "PENDING",
		LaunchSite:    sites[track.ThreatLevel%len(sites)],
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}

func (c *C2BMCInterface) GetEngagements() []*EngagementOrder {
	c.mu.RLock()
	defer c.mu.RUnlock()
	engs := make([]*EngagementOrder, 0, len(c.engagements))
	for _, e := range c.engagements {
		engs = append(engs, e)
	}
	return engs
}

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

func (c *C2BMCInterface) GetBMDSStatus() *BMDSStatus {
	c.mu.RLock()
	defer c.mu.RUnlock()
	status := *c.bmdsStatus
	status.LastUpdate = time.Now()
	return &status
}

func (c *C2BMCInterface) SendHeartbeat() {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.connected {
		c.lastHeartbeat = time.Now()
	}
}

func (c *C2BMCInterface) ToJSON() ([]byte, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	type state struct {
		Connected   bool               `json:"connected"`
		BMDSStatus *BMDSStatus        `json:"bmds_status"`
		Tracks     map[string]*Track  `json:"tracks"`
		Engagements []*EngagementOrder `json:"engagements"`
		Alerts     []*BMDAlert        `json:"alerts"`
		Heartbeat  time.Time          `json:"heartbeat"`
	}
	s := state{
		Connected:   c.connected,
		BMDSStatus: c.bmdsStatus,
		Tracks:     c.tracks,
		Heartbeat:  c.lastHeartbeat,
	}
	for _, e := range c.engagements {
		s.Engagements = append(s.Engagements, e)
	}
	for _, a := range c.alerts {
		s.Alerts = append(s.Alerts, a)
	}
	return json.Marshal(s)
}
