package tena

import (
	"testing"
)

func TestTENAObjectHeaderPackUnpackRoundtrip(t *testing.T) {
	header := &TENAObjectHeader{
		Magic:         [4]byte{'T', 'E', 'N', 'A'},
		Version:       1,
		MessageType:   2,
		SessionID:     12345,
		ObjectClass:   100,
		ObjectInstance: 67890,
	}
	buf := make([]byte, TENAObjectHeaderSize+16)
	PackTENAObjectHeader(header, buf)
	got := UnpackTENAObjectHeader(buf)
	if got == nil {
		t.Fatal("UnpackTENAObjectHeader returned nil")
	}
	if got.Version != 1 {
		t.Errorf("Expected Version=1, got %d", got.Version)
	}
	if got.MessageType != 2 {
		t.Errorf("Expected MessageType=2, got %d", got.MessageType)
	}
	if got.SessionID != 12345 {
		t.Errorf("Expected SessionID=12345, got %d", got.SessionID)
	}
}

func TestTENAObjectHeaderShortBuffer(t *testing.T) {
	buf := make([]byte, 10)
	got := UnpackTENAObjectHeader(buf)
	if got != nil {
		t.Error("Expected nil for short buffer")
	}
}

func TestTENAObjectCreationAndAttributes(t *testing.T) {
	obj := NewTENAObject(1, 100)
	if obj == nil {
		t.Fatal("Expected non-nil TENAObject")
	}
	obj.SetAttribute("latitude", 1, float64(33.75))
	obj.SetAttribute("longitude", 1, float64(-117.85))
	lat := obj.GetAttribute("latitude")
	if lat == nil {
		t.Error("Expected non-nil latitude attribute")
	}
}

func TestPackUnpackAttributesRoundtrip(t *testing.T) {
	obj := NewTENAObject(1, 100)
	obj.SetAttribute("speed", 1, float64(300.0))
	obj.SetAttribute("heading", 1, float64(180.0))
	obj.SetAttribute("force", 0, uint8(2))
	buf := make([]byte, 1024)
	n := PackAttributes(obj, buf)
	if n == 0 {
		t.Error("PackAttributes returned 0 bytes")
	}
	attrs, _ := UnpackAttributes(buf[:n])
	if len(attrs) != 3 {
		t.Errorf("Expected 3 attributes, got %d", len(attrs))
	}
}

func TestTENAHeartbeatRoundtrip(t *testing.T) {
	hb := NewHeartbeat(42)
	if hb == nil {
		t.Fatal("Expected non-nil heartbeat")
	}
	buf := make([]byte, 1024)
	n := PackHeartbeat(hb, buf)
	if n == 0 {
		t.Error("PackHeartbeat returned 0 bytes")
	}
	got := UnpackHeartbeat(buf[:n])
	if got == nil {
		t.Fatal("UnpackHeartbeat returned nil")
	}
}

func TestTENADiscoveryCreation(t *testing.T) {
	disc := NewDiscovery(1, "FORGE-C2", "C2-Gateway")
	if disc == nil {
		t.Fatal("Expected non-nil discovery")
	}
	if disc.FederateName != "FORGE-C2" {
		t.Errorf("Expected FederateName=FORGE-C2, got %s", disc.FederateName)
	}
	if disc.FederateType != "C2-Gateway" {
		t.Errorf("Expected FederateType=C2-Gateway, got %s", disc.FederateType)
	}
}

func TestTENAObjectString(t *testing.T) {
	obj := NewTENAObject(5, 42)
	obj.SetAttribute("test", 1, "value")
	s := obj.String()
	if s == "" {
		t.Error("Expected non-empty string representation")
	}
}

func TestAttributeSyncManagerCreation(t *testing.T) {
	asm := NewAttributeSyncManager()
	if asm == nil {
		t.Fatal("Expected non-nil AttributeSyncManager")
	}
}

func TestTimeSyncManagerEnableDisable(t *testing.T) {
	tsm := NewTimeSyncManager()
	if tsm.IsEnabled() {
		t.Error("Expected TimeSync disabled initially")
	}
	tsm.Enable()
	if !tsm.IsEnabled() {
		t.Error("Expected TimeSync enabled after Enable()")
	}
	tsm.Disable()
	if tsm.IsEnabled() {
		t.Error("Expected TimeSync disabled after Disable()")
	}
}