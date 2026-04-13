package tena

import (
	"fmt"
	"sync"
	"time"
)

// =============================================================================
// Phase 4.2.5: Attribute Synchronization between realms
// =============================================================================

// AttributeSyncManager synchronizes attributes across DIS/HLA/TENA realms
type AttributeSyncManager struct {
	syncRules   map[SyncRuleKey]*SyncRule
	handlers    map[RealmType][]AttributeHandler
	onSync      func(src, dst RealmType, attrs map[string][]byte)
	mu          sync.RWMutex
}

// RealmType identifies a protocol realm
type RealmType uint8

const (
	RealmDIS RealmType = iota
	RealmHLA
	RealmTENA
)

// SyncRule defines synchronization rules between realms
type SyncRuleKey struct {
	SourceRealm RealmType
	TargetRealm RealmType
	ClassHandle uint32
}

// SyncRule defines attribute sync configuration
type SyncRule struct {
	Key            SyncRuleKey
	AttributeMap   map[string]string // source attr -> target attr
	Transform      AttributeTransform
	Direction      SyncDirection
	Throttle       time.Duration
	lastSync       time.Time
}

// AttributeTransform transforms attribute values between realms
type AttributeTransform func(srcAttr string, value interface{}) interface{}

// SyncDirection defines sync direction
type SyncDirection uint8

const (
	SyncUnidirectional SyncDirection = 0
	SyncBidirectional  SyncDirection = 1
)

// AttributeHandler is called when attributes are synchronized
type AttributeHandler func(realm RealmType, classHandle uint32, attrs map[string][]byte)

// NewAttributeSyncManager creates a new sync manager
func NewAttributeSyncManager() *AttributeSyncManager {
	return &AttributeSyncManager{
		syncRules: make(map[SyncRuleKey]*SyncRule),
		handlers:  make(map[RealmType][]AttributeHandler),
	}
}

// AddRule adds a synchronization rule
func (m *AttributeSyncManager) AddRule(rule *SyncRule) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.syncRules[rule.Key] = rule
}

// RemoveRule removes a synchronization rule
func (m *AttributeSyncManager) RemoveRule(key SyncRuleKey) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.syncRules, key)
}

// SyncAttributes synchronizes attributes between realms
func (m *AttributeSyncManager) SyncAttributes(srcRealm, dstRealm RealmType, classHandle uint32, attrs map[string][]byte) error {
	m.mu.RLock()
	key := SyncRuleKey{SourceRealm: srcRealm, TargetRealm: dstRealm, ClassHandle: classHandle}
	rule, exists := m.syncRules[key]
	m.mu.RUnlock()

	if !exists {
		return nil // No rule configured
	}

	// Check throttle
	if rule.Throttle > 0 && time.Since(rule.lastSync) < rule.Throttle {
		return nil
	}
	rule.lastSync = time.Now()

	// Transform attributes according to rule
	transformed := make(map[string][]byte)
	for srcAttr, value := range attrs {
		if targetAttr, ok := rule.AttributeMap[srcAttr]; ok {
			var transformedVal interface{} = value
			if rule.Transform != nil {
				transformedVal = rule.Transform(srcAttr, value)
			}
			transformed[targetAttr] = transformedVal.([]byte)
		}
	}

	// Invoke handlers
	m.mu.RLock()
	handlers := m.handlers[dstRealm]
	onSync := m.onSync
	m.mu.RUnlock()

	for _, h := range handlers {
		h(dstRealm, classHandle, transformed)
	}

	if onSync != nil {
		onSync(srcRealm, dstRealm, transformed)
	}

	return nil
}

// RegisterHandler registers an attribute handler for a realm
func (m *AttributeSyncManager) RegisterHandler(realm RealmType, handler AttributeHandler) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.handlers[realm] = append(m.handlers[realm], handler)
}

// SetOnSync sets the sync callback
func (m *AttributeSyncManager) SetOnSync(cb func(src, dst RealmType, attrs map[string][]byte)) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.onSync = cb
}

// =============================================================================
// Phase 4.2.6: Time Synchronization across gateways
// =============================================================================

// TimeSyncManager manages time synchronization across DIS/HLA/TENA gateways
type TimeSyncManager struct {
	enabled           bool
	timeOffset        time.Duration
	timeDrift         float64 // seconds per second
	lastSync          time.Time
	syncInterval      time.Duration
	onTimeSync        func(offset time.Duration)
	mu                sync.Mutex
}

// NewTimeSyncManager creates a new time sync manager
func NewTimeSyncManager() *TimeSyncManager {
	return &TimeSyncManager{
		enabled:      false,
		timeOffset:   0,
		timeDrift:    1.0,
		syncInterval: 1 * time.Second,
	}
}

// Enable enables time synchronization
func (m *TimeSyncManager) Enable() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.enabled = true
	m.lastSync = time.Now()
}

// Disable disables time synchronization
func (m *TimeSyncManager) Disable() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.enabled = false
}

// IsEnabled returns time sync state
func (m *TimeSyncManager) IsEnabled() bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.enabled
}

// UpdateOffset updates the time offset based on peer time
func (m *TimeSyncManager) UpdateOffset(peerTime time.Time) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if !m.enabled {
		return
	}

	localTime := time.Now()
	m.timeOffset = peerTime.Sub(localTime)
	m.lastSync = localTime

	if m.onTimeSync != nil {
		m.onTimeSync(m.timeOffset)
	}
}

// GetOffset returns current time offset
func (m *TimeSyncManager) GetOffset() time.Duration {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.timeOffset
}

// LocalToGlobal converts local time to global (synced) time
func (m *TimeSyncManager) LocalToGlobal(local time.Time) time.Time {
	m.mu.Lock()
	defer m.mu.Unlock()
	return local.Add(m.timeOffset)
}

// GlobalToLocal converts global time to local time
func (m *TimeSyncManager) GlobalToLocal(global time.Time) time.Time {
	m.mu.Lock()
	defer m.mu.Unlock()
	return global.Add(-m.timeOffset)
}

// SetOnTimeSync sets the time sync callback
func (m *TimeSyncManager) SetOnTimeSync(cb func(offset time.Duration)) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.onTimeSync = cb
}

// =============================================================================
// Phase 4.2.8: Federate/Participant Bridging
// =============================================================================

// FederateBridge bridges federates across DIS/HLA/TENA
type FederateBridge struct {
	bridges      map[BridgeKey]*FederateBridgeEntry
	localFederate string
	onBridge      func(srcFed, dstFed string)
	mu            sync.RWMutex
}

// BridgeKey identifies a bridge connection
type BridgeKey struct {
	LocalFederate  string
	RemoteRealm    RealmType
	RemoteFederate string
}

// FederateBridgeEntry tracks a bridge entry
type FederateBridgeEntry struct {
	Key         BridgeKey
	LocalID     uint64
	RemoteID    interface{} // uint64 for DIS/TENA, uint32 for HLA
	State       BridgeState
	CreatedAt   time.Time
	LastActivity time.Time
}

// BridgeState tracks bridge connection state
type BridgeState uint8

const (
	BridgeStatePending BridgeState = 0
	BridgeStateActive  BridgeState = 1
	BridgeStateIdle    BridgeState = 2
	BridgeStateError   BridgeState = 3
)

// NewFederateBridge creates a new federate bridge
func NewFederateBridge(localFederate string) *FederateBridge {
	return &FederateBridge{
		bridges:      make(map[BridgeKey]*FederateBridgeEntry),
		localFederate: localFederate,
	}
}

// CreateBridge creates a bridge to a remote federate
func (b *FederateBridge) CreateBridge(remoteFederate string, remoteRealm RealmType, remoteID interface{}) *FederateBridgeEntry {
	b.mu.Lock()
	defer b.mu.Unlock()

	key := BridgeKey{LocalFederate: b.localFederate, RemoteRealm: remoteRealm, RemoteFederate: remoteFederate}
	entry := &FederateBridgeEntry{
		Key:         key,
		RemoteID:    remoteID,
		State:       BridgeStatePending,
		CreatedAt:   time.Now(),
		LastActivity: time.Now(),
	}
	b.bridges[key] = entry

	if b.onBridge != nil {
		b.onBridge(b.localFederate, remoteFederate)
	}

	return entry
}

// ActivateBridge activates a bridge
func (b *FederateBridge) ActivateBridge(remoteFederate string, remoteRealm RealmType) error {
	b.mu.Lock()
	defer b.mu.Unlock()

	key := BridgeKey{LocalFederate: b.localFederate, RemoteRealm: remoteRealm, RemoteFederate: remoteFederate}
	if entry, ok := b.bridges[key]; ok {
		entry.State = BridgeStateActive
		entry.LastActivity = time.Now()
		return nil
	}
	return fmt.Errorf("bridge not found")
}

// GetBridge retrieves a bridge entry
func (b *FederateBridge) GetBridge(remoteFederate string, remoteRealm RealmType) (*FederateBridgeEntry, bool) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	key := BridgeKey{LocalFederate: b.localFederate, RemoteRealm: remoteRealm, RemoteFederate: remoteFederate}
	entry, ok := b.bridges[key]
	return entry, ok
}

// SetOnBridge sets the bridge callback
func (b *FederateBridge) SetOnBridge(cb func(srcFed, dstFed string)) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.onBridge = cb
}

// =============================================================================
// Phase 4.2.9: Gateway Discovery and Announcement
// =============================================================================

// DiscoveryManager handles gateway discovery and announcement
type DiscoveryManager struct {
	announcements map[string]*GatewayAnnouncement
	knownGateways map[string]*KnownGateway
	listenerPort  uint16
	onDiscover    func(*GatewayAnnouncement)
	onLose        func(gatewayID string)
	mu            sync.RWMutex
}

// GatewayAnnouncement announces a gateway's presence
type GatewayAnnouncement struct {
	GatewayID     string
	Name          string
	Realms        []RealmType
	Endpoints     []string
	Capabilities  []string
	Version       string
	Timestamp     time.Time
	TTL           time.Duration
}

// KnownGateway tracks a known gateway
type KnownGateway struct {
	Announcement *GatewayAnnouncement
	LastSeen     time.Time
	State        GatewayState
	HealthScore  float32
}

// GatewayState tracks gateway state
type GatewayState uint8

const (
	GatewayStateUnknown GatewayState = 0
	GatewayStateUp     GatewayState = 1
	GatewayStateDown   GatewayState = 2
	GatewayStateDegraded GatewayState = 3
)

// NewDiscoveryManager creates a discovery manager
func NewDiscoveryManager(port uint16) *DiscoveryManager {
	return &DiscoveryManager{
		announcements: make(map[string]*GatewayAnnouncement),
		knownGateways: make(map[string]*KnownGateway),
		listenerPort:  port,
	}
}

// Announce publishes a gateway announcement
func (m *DiscoveryManager) Announce(ann *GatewayAnnouncement) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	ann.Timestamp = time.Now()
	m.announcements[ann.GatewayID] = ann

	m.knownGateways[ann.GatewayID] = &KnownGateway{
		Announcement: ann,
		LastSeen:     time.Now(),
		State:        GatewayStateUp,
		HealthScore:  100,
	}

	return nil
}

// Discover returns all known gateways
func (m *DiscoveryManager) Discover() []*GatewayAnnouncement {
	m.mu.RLock()
	defer m.mu.RUnlock()

	result := make([]*GatewayAnnouncement, 0, len(m.announcements))
	for _, ann := range m.announcements {
		result = append(result, ann)
	}
	return result
}

// GetGateway returns a gateway by ID
func (m *DiscoveryManager) GetGateway(id string) (*GatewayAnnouncement, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if kg, ok := m.knownGateways[id]; ok {
		return kg.Announcement, true
	}
	return nil, false
}

// Remove removes a gateway from discovery
func (m *DiscoveryManager) Remove(gatewayID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.announcements, gatewayID)
	delete(m.knownGateways, gatewayID)
}

// SetOnDiscover sets the discover callback
func (m *DiscoveryManager) SetOnDiscover(cb func(*GatewayAnnouncement)) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.onDiscover = cb
}

// SetOnLose sets the gateway lost callback
func (m *DiscoveryManager) SetOnLose(cb func(gatewayID string)) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.onLose = cb
}

// =============================================================================
// Phase 4.2.10: Gateway Load Balancing
// =============================================================================

// LoadBalancer manages load balancing across gateways
type LoadBalancer struct {
	gateways     map[string]*LoadBalancedGateway
	strategy     LoadBalanceStrategy
	onBackendChange func()
	mu           sync.RWMutex
}

// LoadBalancedGateway tracks gateway load
type LoadBalancedGateway struct {
	ID         string
	Endpoint   string
	Load       float32 // 0-100, 100 = saturated
	ActiveConn int
	MaxConn    int
	Weight     float32
	State      GatewayState
	LastHealth time.Time
}

// LoadBalanceStrategy defines load balancing algorithms
type LoadBalanceStrategy uint8

const (
	StrategyRoundRobin LoadBalanceStrategy = 0
	StrategyLeastConn  LoadBalanceStrategy = 1
	StrategyWeighted   LoadBalanceStrategy = 2
	StrategyLoadBased  LoadBalanceStrategy = 3
)

// NewLoadBalancer creates a new load balancer
func NewLoadBalancer(strategy LoadBalanceStrategy) *LoadBalancer {
	return &LoadBalancer{
		gateways: make(map[string]*LoadBalancedGateway),
		strategy: strategy,
	}
}

// AddGateway adds a gateway to the load balancer
func (lb *LoadBalancer) AddGateway(id, endpoint string, weight float32) {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	lb.gateways[id] = &LoadBalancedGateway{
		ID:         id,
		Endpoint:   endpoint,
		Load:       0,
		ActiveConn: 0,
		MaxConn:    1000,
		Weight:     weight,
		State:      GatewayStateUp,
		LastHealth: time.Now(),
	}
}

// RemoveGateway removes a gateway from the load balancer
func (lb *LoadBalancer) RemoveGateway(id string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	delete(lb.gateways, id)
}

// SelectGateway selects a gateway based on load balancing strategy
func (lb *LoadBalancer) SelectGateway() (string, string, error) {
	lb.mu.RLock()
	defer lb.mu.RUnlock()

	// Filter active gateways
	var active []*LoadBalancedGateway
	for _, gw := range lb.gateways {
		if gw.State == GatewayStateUp {
			active = append(active, gw)
		}
	}

	if len(active) == 0 {
		return "", "", fmt.Errorf("no active gateways")
	}

	var selected *LoadBalancedGateway

	switch lb.strategy {
	case StrategyRoundRobin:
		selected = active[0] // Simplified

	case StrategyLeastConn:
		minConn := active[0]
		for _, gw := range active[1:] {
			if gw.ActiveConn < minConn.ActiveConn {
				minConn = gw
			}
		}
		selected = minConn

	case StrategyWeighted:
		var totalWeight float32
		for _, gw := range active {
			totalWeight += gw.Weight
		}
		// Select based on weight (simplified - use cumulative weight)

	case StrategyLoadBased:
		minLoad := active[0]
		for _, gw := range active[1:] {
			if gw.Load < minLoad.Load {
				minLoad = gw
			}
		}
		selected = minLoad
	}

	if selected == nil {
		selected = active[0]
	}

	return selected.ID, selected.Endpoint, nil
}

// IncrementConn increments active connections for a gateway
func (lb *LoadBalancer) IncrementConn(id string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	if gw, ok := lb.gateways[id]; ok {
		gw.ActiveConn++
		gw.Load = float32(gw.ActiveConn) / float32(gw.MaxConn) * 100
	}
}

// DecrementConn decrements active connections for a gateway
func (lb *LoadBalancer) DecrementConn(id string) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	if gw, ok := lb.gateways[id]; ok && gw.ActiveConn > 0 {
		gw.ActiveConn--
		gw.Load = float32(gw.ActiveConn) / float32(gw.MaxConn) * 100
	}
}

// UpdateHealth updates gateway health
func (lb *LoadBalancer) UpdateHealth(id string, healthy bool) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	if gw, ok := lb.gateways[id]; ok {
		if healthy {
			gw.State = GatewayStateUp
			gw.LastHealth = time.Now()
		} else {
			gw.State = GatewayStateDegraded
		}
	}
}

// SetOnBackendChange sets the backend change callback
func (lb *LoadBalancer) SetOnBackendChange(cb func()) {
	lb.mu.Lock()
	defer lb.mu.Unlock()
	lb.onBackendChange = cb
}