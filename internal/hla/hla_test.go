package hla

import (
	"testing"
	"time"
)

func TestHLAUpdateHeaderRoundtrip(t *testing.T) {
	h := &HLAUpdateHeader{
		Marks:               [4]byte{'H', 'L', 'U', 0},
		MessageLength:       100,
		FederateHandle:      42,
		ObjectInstanceHandle: 123,
		AttributeCount:      5,
		SentTime:           time.Now(),
	}

	buf := make([]byte, HLAMessageSize)
	PackHLAUpdateHeader(h, buf)

	unpacked := UnpackHLAUpdateHeader(buf)
	if unpacked.MessageLength != h.MessageLength {
		t.Errorf("MessageLength: got %d, want %d", unpacked.MessageLength, h.MessageLength)
	}
	if unpacked.FederateHandle != h.FederateHandle {
		t.Errorf("FederateHandle: got %d, want %d", unpacked.FederateHandle, h.FederateHandle)
	}
	if unpacked.AttributeCount != h.AttributeCount {
		t.Errorf("AttributeCount: got %d, want %d", unpacked.AttributeCount, h.AttributeCount)
	}
}

func TestHLAEntityNew(t *testing.T) {
	e := NewEntity(1, 2, 3)
	if e.EntityID.SiteNumber != 1 {
		t.Errorf("SiteNumber: got %d, want %d", e.EntityID.SiteNumber, 1)
	}
	if e.EntityID.ApplicationNumber != 2 {
		t.Errorf("ApplicationNumber: got %d, want %d", e.EntityID.ApplicationNumber, 2)
	}
	if e.EntityID.EntityNumber != 3 {
		t.Errorf("EntityNumber: got %d, want %d", e.EntityID.EntityNumber, 3)
	}
	if e.State.Published != true {
		t.Errorf("Published: got %v, want true", e.State.Published)
	}
}

func TestHLAEntitySetLocation(t *testing.T) {
	e := NewEntity(1, 2, 3)
	e.SetLocation(100.5, 200.5, 50.0)
	if e.Position.X != 100.5 {
		t.Errorf("X: got %f, want %f", e.Position.X, 100.5)
	}
	if e.Position.Y != 200.5 {
		t.Errorf("Y: got %f, want %f", e.Position.Y, 200.5)
	}
	if e.Position.Z != 50.0 {
		t.Errorf("Z: got %f, want %f", e.Position.Z, 50.0)
	}
}

func TestHLAEntitySetOrientation(t *testing.T) {
	e := NewEntity(1, 2, 3)
	e.SetOrientation(0.1, 0.2, 0.3)
	if e.Orientation.Phi != 0.1 {
		t.Errorf("Phi: got %f, want %f", e.Orientation.Phi, 0.1)
	}
	if e.Orientation.Theta != 0.2 {
		t.Errorf("Theta: got %f, want %f", e.Orientation.Theta, 0.2)
	}
	if e.Orientation.Psi != 0.3 {
		t.Errorf("Psi: got %f, want %f", e.Orientation.Psi, 0.3)
	}
}

func TestHLAEntitySetVelocity(t *testing.T) {
	e := NewEntity(1, 2, 3)
	e.SetVelocity(100.0, 50.0, 10.0)
	if e.Velocity.X != 100.0 {
		t.Errorf("X: got %f, want %f", e.Velocity.X, 100.0)
	}
}

func TestHLAMessageSize(t *testing.T) {
	h := &HLAUpdateHeader{}
	buf := make([]byte, HLAMessageSize)
	PackHLAUpdateHeader(h, buf)
	if len(buf) != HLAMessageSize {
		t.Errorf("HLAMessageSize: got %d, want %d", len(buf), HLAMessageSize)
	}
}

func TestRTIGatewayCreate(t *testing.T) {
	gw := NewRTIGateway()
	
	err := gw.CreateFederation("TestFed", "test.fed")
	if err != nil {
		t.Fatalf("CreateFederation failed: %v", err)
	}
	
	exec, ok := gw.federations["TestFed"]
	if !ok {
		t.Fatal("Federation not created")
	}
	
	if exec.Name != "TestFed" {
		t.Errorf("Name: got %s, want TestFed", exec.Name)
	}
}

func TestRTIGatewayJoin(t *testing.T) {
	gw := NewRTIGateway()
	gw.CreateFederation("TestFed", "test.fed")
	
	handle, err := gw.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	if err != nil {
		t.Fatalf("JoinFederation failed: %v", err)
	}
	
	if handle == 0 {
		t.Error("Handle should be non-zero")
	}
}

func TestRTIGatewayResign(t *testing.T) {
	gw := NewRTIGateway()
	gw.CreateFederation("TestFed", "test.fed")
	
	handle, _ := gw.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	
	err := gw.ResignFederation(handle, ResignDeleteObjects)
	if err != nil {
		t.Fatalf("ResignFederation failed: %v", err)
	}
	
	if len(gw.federations) != 0 {
		t.Error("Federation should be removed after resign")
	}
}

func TestDeclarationManagerPublish(t *testing.T) {
	dm := NewDeclarationManager()
	
	err := dm.PublishObjectClass(HandleObjectEntity, []uint32{HandleAttrEntityID, HandleAttrPosition})
	if err != nil {
		t.Fatalf("PublishObjectClass failed: %v", err)
	}
	
	if !dm.IsPublished(HandleObjectEntity) {
		t.Error("Class should be published")
	}
	
	if dm.IsPublished(HandleObjectTrack) {
		t.Error("Class should not be published")
	}
}

func TestDeclarationManagerSubscribe(t *testing.T) {
	dm := NewDeclarationManager()
	
	dm.SubscribeObjectClassAttributes(HandleObjectTrack, []uint32{HandleAttrTrackNumber, HandleAttrTrackQuality})
	
	if !dm.IsSubscribed(HandleObjectTrack) {
		t.Error("Class should be subscribed")
	}
}

func TestObjectManagerRegister(t *testing.T) {
	om := NewObjectManager()
	
	handle, err := om.RegisterObjectInstance(HandleObjectEntity, "Tank-1")
	if err != nil {
		t.Fatalf("RegisterObjectInstance failed: %v", err)
	}
	
	if handle == 0 {
		t.Error("Handle should be non-zero")
	}
	
	obj, ok := om.GetObjectByHandle(handle)
	if !ok {
		t.Fatal("Object should be retrievable by handle")
	}
	
	if obj.Name != "Tank-1" {
		t.Errorf("Name: got %s, want Tank-1", obj.Name)
	}
	
	obj2, ok := om.GetObjectByName("Tank-1")
	if !ok {
		t.Fatal("Object should be retrievable by name")
	}
	
	if obj2.Handle != handle {
		t.Error("Same object should be returned by name lookup")
	}
}

func TestObjectManagerUpdate(t *testing.T) {
	om := NewObjectManager()
	
	handle, _ := om.RegisterObjectInstance(HandleObjectEntity, "Tank-1")
	
	err := om.UpdateAttributeValues(handle, map[uint32][]byte{
		HandleAttrPosition: []byte{1, 2, 3, 4, 5, 6, 7, 8},
	}, []byte("test"))
	if err != nil {
		t.Fatalf("UpdateAttributeValues failed: %v", err)
	}
	
	obj, _ := om.GetObjectByHandle(handle)
	if obj.Attributes[HandleAttrPosition] == nil {
		t.Error("Position should be updated")
	}
}

func TestTimeManager(t *testing.T) {
	tm := NewTimeManager()
	
	if tm.isRegulating {
		t.Error("Should not be regulating initially")
	}
	
	err := tm.EnableTimeRegulation(10 * time.Millisecond)
	if err != nil {
		t.Fatalf("EnableTimeRegulation failed: %v", err)
	}
	
	if !tm.isRegulating {
		t.Error("Should be regulating after enable")
	}
	
	err = tm.DisableTimeRegulation()
	if err != nil {
		t.Fatalf("DisableTimeRegulation failed: %v", err)
	}
	
	if tm.isRegulating {
		t.Error("Should not be regulating after disable")
	}
}

func TestTimeManagerAdvance(t *testing.T) {
	tm := NewTimeManager()
	
	now := time.Now()
	tm.TimeAdvanceRequest(now.Add(100 * time.Millisecond))
	
	if tm.currentTime != now.Add(100 * time.Millisecond) {
		t.Error("Current time should be updated")
	}
}
