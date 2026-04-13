package dis

import (
	"time"
	"testing"
)

func TestWorldStatePDU(t *testing.T) {
	ws := &WorldStatePDU{
		Header:            DISHeader{ProtocolVersion: 7, PDUType: TypeWorldState},
		WorldStateOptions: 1,
		NumAggregates:     2,
		NumObjects:        3,
		NumEvents:         1,
	}

	if ws.Header.PDUType != TypeWorldState {
		t.Errorf("PDUType should be %d, got %d", TypeWorldState, ws.Header.PDUType)
	}
	if ws.NumAggregates != 2 {
		t.Errorf("NumAggregates should be 2, got %d", ws.NumAggregates)
	}
	if ws.NumObjects != 3 {
		t.Errorf("NumObjects should be 3, got %d", ws.NumObjects)
	}

	t.Logf("WorldStatePDU: aggregates=%d, objects=%d, events=%d", 
		ws.NumAggregates, ws.NumObjects, ws.NumEvents)
}

func TestObjectStatePDU(t *testing.T) {
	obj := NewObjectStatePDU()
	obj.ObjectID = EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 100}
	obj.ObjectType = EntityType{
		Kind:     1, Domain: 1, Country: 225,
		Category: 10, Subcategory: 5, Specific: 3,
	}
	obj.ObjectStateOptions = 0x00000001

	if obj.Header.PDUType != TypeObjectState {
		t.Errorf("PDUType should be %d, got %d", TypeObjectState, obj.Header.PDUType)
	}
	if obj.ObjectID.EntityNumber != 100 {
		t.Errorf("ObjectID.EntityNumber should be 100, got %d", obj.ObjectID.EntityNumber)
	}

	t.Logf("ObjectStatePDU: type=%+v, options=0x%x", obj.ObjectType, obj.ObjectStateOptions)
}

func TestDistributedEmissionsRegenerationPDU(t *testing.T) {
	em := NewDistributedEmissionsRegenerationPDU()
	em.EmissionEngineCount = 4
	em.EmissionEngines = []EmissionEngineData{
		{EngineID: 1, EngineActive: true},
		{EngineID: 2, EngineActive: false},
	}

	if em.Header.PDUType != TypeDistributedEmissionsRegen {
		t.Errorf("PDUType should be %d, got %d", TypeDistributedEmissionsRegen, em.Header.PDUType)
	}
	if em.EmissionEngineCount != 4 {
		t.Errorf("EmissionEngineCount should be 4, got %d", em.EmissionEngineCount)
	}
	if len(em.EmissionEngines) != 2 {
		t.Errorf("EmissionEngines should have 2 entries, got %d", len(em.EmissionEngines))
	}

	t.Logf("DistributedEmissionsRegenerationPDU: engines=%d", em.EmissionEngineCount)
}

func TestEntityRecoveryProtocol(t *testing.T) {
	erp := &EntityRecoveryProtocol{
		RecoveryTimeout: 5 * time.Second,
		MaxRetries:     3,
		PendingRecoveries: make(map[EntityID]*RecoveryState),
	}

	// Add a pending recovery
	erp.PendingRecoveries[EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 100}] = &RecoveryState{
		EntityID:    EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 100},
		Attempts:    1,
		LastAttempt: time.Now(),
		State:       0,
	}

	if len(erp.PendingRecoveries) != 1 {
		t.Errorf("Expected 1 pending recovery, got %d", len(erp.PendingRecoveries))
	}
	if erp.MaxRetries != 3 {
		t.Errorf("Expected MaxRetries=3, got %d", erp.MaxRetries)
	}

	t.Logf("ERP: %d pending recoveries, timeout=%v", len(erp.PendingRecoveries), erp.RecoveryTimeout)
}

func TestRecoveryState(t *testing.T) {
	rs := &RecoveryState{
		EntityID:    EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 100},
		Attempts:    2,
		LastAttempt: time.Now(),
		MissingPDUs: []uint32{5, 6, 7},
	}

	if rs.Attempts != 2 {
		t.Errorf("Expected 2 attempts, got %d", rs.Attempts)
	}
	if len(rs.MissingPDUs) != 3 {
		t.Errorf("Expected 3 missing PDUs, got %d", len(rs.MissingPDUs))
	}

	t.Logf("RecoveryState: entity=%+v, attempts=%d, missing=%v", rs.EntityID, rs.Attempts, rs.MissingPDUs)
}

func TestNPGManager(t *testing.T) {
	mgr := &NPGManager{
		ActiveNPGs: make(map[uint8]*NPG),
		NextNPGID:  1,
	}

	// Add an NPG
	mgr.ActiveNPGs[1] = &NPG{
		ID:               1,
		Name:             "Primary Fire Control",
		ParticipantCount: 5,
	}

	if len(mgr.ActiveNPGs) != 1 {
		t.Errorf("Expected 1 active NPG, got %d", len(mgr.ActiveNPGs))
	}
	if mgr.NextNPGID != 1 {
		t.Errorf("Expected NextNPGID=1, got %d", mgr.NextNPGID)
	}

	t.Logf("NPGManager: %d active NPGs", len(mgr.ActiveNPGs))
}
