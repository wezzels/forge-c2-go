package hla

// =============================================================================
// Phase 3.1.5: RegisterFederationSynchronizationPoint
// =============================================================================

// FederationSyncManager manages federation synchronization
type FederationSyncManager struct {
	syncPoints map[string]*SynchronizationPoint
	federates   map[string]*FederateRecord
}

// FederateRecord tracks federate sync progress
type FederateRecord struct {
	ID           string
	Name         string
	SyncAchieved map[string]bool
}

// NewFederationSyncManager creates a new sync manager
func NewFederationSyncManager() *FederationSyncManager {
	return &FederationSyncManager{
		syncPoints: make(map[string]*SynchronizationPoint),
		federates:  make(map[string]*FederateRecord),
	}
}

// RegisterFederationSynchronizationPoint registers a new sync point
func (m *FederationSyncManager) RegisterFederationSynchronizationPoint(label string, tag []byte) *SynchronizationPoint {
	sp := &SynchronizationPoint{
		Label: label,
		Tag:   tag,
		State: SyncStatePending,
	}
	m.syncPoints[label] = sp
	return sp
}

// AchieveSynchronizationPoint marks a sync point as achieved by a federate
func (m *FederationSyncManager) AchieveSynchronizationPoint(label string, federateID string) error {
	sp, exists := m.syncPoints[label]
	if !exists {
		return &SyncPointNotFoundError{Label: label}
	}

	sp.Federates = append(sp.Federates, federateID)
	if federate, ok := m.federates[federateID]; ok {
		federate.SyncAchieved[label] = true
	}

	return nil
}

// GetSynchronizationPointState returns the state of a sync point
func (m *FederationSyncManager) GetSynchronizationPointState(label string) SyncState {
	sp, exists := m.syncPoints[label]
	if !exists {
		return SyncStatePending
	}
	return sp.State
}

// =============================================================================
// Phase 3.1.6: SynchronizationPointAchieved
// =============================================================================

// SynchronizationPointAchievedCallback is called when a federate achieves sync
func (m *FederationSyncManager) SynchronizationPointAchievedCallback(federateID string, label string) error {
	return m.AchieveSynchronizationPoint(label, federateID)
}

// IsSynchronizationPointAchieved checks if all federates have achieved sync
func (m *FederationSyncManager) IsSynchronizationPointAchieved(label string) bool {
	sp, exists := m.syncPoints[label]
	if !exists {
		return false
	}
	return sp.State == SyncStateAchieved
}

// =============================================================================
// Phase 3.1.7: RequestFederationSave
// =============================================================================

// SaveRecord represents a federation save
type SaveRecord struct {
	Label      string
	TimeTag    []byte
	Initiator  string
	State      SaveState
}

// SaveState represents the state of a save operation
type SaveState uint8

const (
	SaveStateNotSaved SaveState = iota
	SaveStateInProgress
	SaveStateSaved
)

// RequestFederationSave requests a federation save
func (m *FederationSyncManager) RequestFederationSave(label string, timeTag []byte, initiator string) *SaveRecord {
	rec := &SaveRecord{
		Label:     label,
		TimeTag:   timeTag,
		Initiator: initiator,
		State:     SaveStateInProgress,
	}
	return rec
}

// CompleteSave marks a save as complete
func (r *SaveRecord) CompleteSave() {
	r.State = SaveStateSaved
}

// SyncPointNotFoundError indicates sync point wasn't found
type SyncPointNotFoundError struct {
	Label string
}

func (e *SyncPointNotFoundError) Error() string {
	return "Synchronization point not found: " + e.Label
}
