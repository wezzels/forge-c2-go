package tena

import (
	"time"
)

// SessionManager handles TENA session lifecycle
type SessionManager struct {
	sessionID        uint64
	connected        bool
	lastHeartbeat   time.Time
	heartbeatInterval time.Duration
	federates       map[uint64]*TENAFederate
	objectRegistry  map[uint64]*TENAObject
	sessionMetadata map[string]string
}

// TENAFederate represents a federate in a TENA session
type TENAFederate struct {
	ID           uint64
	Name         string
	FederateType string
	JoinedAt     time.Time
	IsActive     bool
}

// NewSessionManager creates a new TENA session manager
func NewSessionManager(sessionID uint64) *SessionManager {
	return &SessionManager{
		sessionID:        sessionID,
		connected:        false,
		lastHeartbeat:    time.Now(),
		heartbeatInterval: 100 * time.Millisecond,
		federates:        make(map[uint64]*TENAFederate),
		objectRegistry:   make(map[uint64]*TENAObject),
		sessionMetadata:   make(map[string]string),
	}
}

// Connect establishes a TENA session connection
func (sm *SessionManager) Connect() error {
	sm.connected = true
	sm.lastHeartbeat = time.Now()
	return nil
}

// Disconnect closes the TENA session
func (sm *SessionManager) Disconnect() error {
	sm.connected = false
	return nil
}

// IsConnected returns the connection state
func (sm *SessionManager) IsConnected() bool {
	return sm.connected
}

// Heartbeat sends a heartbeat to the TENA session
func (sm *SessionManager) Heartbeat() error {
	sm.lastHeartbeat = time.Now()
	return nil
}

// TimeSinceLastHeartbeat returns time since last heartbeat
func (sm *SessionManager) TimeSinceLastHeartbeat() time.Duration {
	return time.Since(sm.lastHeartbeat)
}

// RegisterFederate registers a federate in the session
func (sm *SessionManager) RegisterFederate(id uint64, name, federateType string) error {
	sm.federates[id] = &TENAFederate{
		ID:           id,
		Name:         name,
		FederateType: federateType,
		JoinedAt:     time.Now(),
		IsActive:     true,
	}
	return nil
}

// UnregisterFederate removes a federate from the session
func (sm *SessionManager) UnregisterFederate(id uint64) error {
	delete(sm.federates, id)
	return nil
}

// GetFederate returns a federate by ID
func (sm *SessionManager) GetFederate(id uint64) (*TENAFederate, bool) {
	f, ok := sm.federates[id]
	return f, ok
}

// RegisterObject registers an object instance
func (sm *SessionManager) RegisterObject(instance uint64, obj *TENAObject) error {
	sm.objectRegistry[instance] = obj
	return nil
}

// UnregisterObject removes an object instance
func (sm *SessionManager) UnregisterObject(instance uint64) error {
	delete(sm.objectRegistry, instance)
	return nil
}

// GetObject returns an object by instance handle
func (sm *SessionManager) GetObject(instance uint64) (*TENAObject, bool) {
	obj, ok := sm.objectRegistry[instance]
	return obj, ok
}

// GetAllObjects returns all registered objects
func (sm *SessionManager) GetAllObjects() []*TENAObject {
	var result []*TENAObject
	for _, obj := range sm.objectRegistry {
		result = append(result, obj)
	}
	return result
}

// SetMetadata sets session metadata
func (sm *SessionManager) SetMetadata(key, value string) {
	sm.sessionMetadata[key] = value
}

// GetMetadata gets session metadata
func (sm *SessionManager) GetMetadata(key string) (string, bool) {
	v, ok := sm.sessionMetadata[key]
	return v, ok
}

// =============================================================================
// TENA Object Lifecycle
// =============================================================================

// ObjectLifecycle tracks object creation, update, and deletion
type ObjectLifecycle struct {
	created  map[uint64]time.Time
	updated  map[uint64]time.Time
	deleted  map[uint64]time.Time
	onCreate func(obj *TENAObject)
	onUpdate func(obj *TENAObject)
	onDelete func(instance uint64)
}

// NewObjectLifecycle creates a new lifecycle tracker
func NewObjectLifecycle() *ObjectLifecycle {
	return &ObjectLifecycle{
		created: make(map[uint64]time.Time),
		updated: make(map[uint64]time.Time),
		deleted: make(map[uint64]time.Time),
	}
}

// TrackCreate records object creation
func (lc *ObjectLifecycle) TrackCreate(instance uint64, obj *TENAObject) {
	lc.created[instance] = time.Now()
	if lc.onCreate != nil {
		lc.onCreate(obj)
	}
}

// TrackUpdate records object update
func (lc *ObjectLifecycle) TrackUpdate(instance uint64, obj *TENAObject) {
	lc.updated[instance] = time.Now()
	if lc.onUpdate != nil {
		lc.onUpdate(obj)
	}
}

// TrackDelete records object deletion
func (lc *ObjectLifecycle) TrackDelete(instance uint64) {
	lc.deleted[instance] = time.Now()
	if lc.onDelete != nil {
		lc.onDelete(instance)
	}
}

// SetOnCreate sets the create callback
func (lc *ObjectLifecycle) SetOnCreate(cb func(obj *TENAObject)) {
	lc.onCreate = cb
}

// SetOnUpdate sets the update callback
func (lc *ObjectLifecycle) SetOnUpdate(cb func(obj *TENAObject)) {
	lc.onUpdate = cb
}

// SetOnDelete sets the delete callback
func (lc *ObjectLifecycle) SetOnDelete(cb func(instance uint64)) {
	lc.onDelete = cb
}

// =============================================================================
// TENA Gateway (TENA-DIS-HLA Bridging)
// =============================================================================

// Gateway bridges TENA with DIS and HLA protocols
type Gateway struct {
	session     *SessionManager
	tenaToDIS  map[uint64]uint64 // TENA instance -> DIS ID
	tenaToHLA  map[uint64]uint32 // TENA instance -> HLA handle
	onDISUpdate func(disID uint64)
	onHLAUpdate func(hlaHandle uint32, attrs map[uint32][]byte)
}

// NewGateway creates a new TENA gateway
func NewGateway(sessionID uint64) *Gateway {
	return &Gateway{
		session:    NewSessionManager(sessionID),
		tenaToDIS: make(map[uint64]uint64),
		tenaToHLA: make(map[uint64]uint32),
	}
}

// RegisterTENAToDIS maps a TENA instance to a DIS entity ID
func (gw *Gateway) RegisterTENAToDIS(tenaInstance, disID uint64) error {
	gw.tenaToDIS[tenaInstance] = disID
	return nil
}

// RegisterTENAToHLA maps a TENA instance to an HLA object handle
func (gw *Gateway) RegisterTENAToHLA(tenaInstance uint64, hlaHandle uint32) error {
	gw.tenaToHLA[tenaInstance] = hlaHandle
	return nil
}

// SyncTENAToDIS sends TENA update to DIS
func (gw *Gateway) SyncTENAToDIS(instance uint64) error {
	if gw.onDISUpdate != nil {
		if disID, ok := gw.tenaToDIS[instance]; ok {
			gw.onDISUpdate(disID)
		}
	}
	return nil
}

// SyncTENAToHLA sends TENA update to HLA
func (gw *Gateway) SyncTENAToHLA(instance uint64, attrs map[uint32][]byte) error {
	if gw.onHLAUpdate != nil {
		if hlaHandle, ok := gw.tenaToHLA[instance]; ok {
			gw.onHLAUpdate(hlaHandle, attrs)
		}
	}
	return nil
}

// GetDISFromTENA returns DIS ID for a TENA instance
func (gw *Gateway) GetDISFromTENA(instance uint64) (uint64, bool) {
	id, ok := gw.tenaToDIS[instance]
	return id, ok
}

// GetHLAFromTENA returns HLA handle for a TENA instance
func (gw *Gateway) GetHLAFromTENA(instance uint64) (uint32, bool) {
	h, ok := gw.tenaToHLA[instance]
	return h, ok
}
