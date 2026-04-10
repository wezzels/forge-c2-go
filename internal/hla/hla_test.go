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
