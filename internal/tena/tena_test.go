package tena

import (
	"testing"
	"time"
)

func TestTENAObjectHeaderPackUnpack(t *testing.T) {
	h := &TENAObjectHeader{
		Magic:          TENAMagic,
		Version:        1,
		MessageType:    MessageTypeObjectUpdate,
		SessionID:      12345,
		ObjectClass:    1001,
		ObjectInstance: 999,
		Timestamp:     time.Now(),
		SequenceNumber: 42,
	}

	buf := make([]byte, TENAObjectHeaderSize)
	PackTENAObjectHeader(h, buf)

	unpacked := UnpackTENAObjectHeader(buf)
	if unpacked.SessionID != h.SessionID {
		t.Errorf("SessionID: got %d, want %d", unpacked.SessionID, h.SessionID)
	}
	if unpacked.ObjectClass != h.ObjectClass {
		t.Errorf("ObjectClass: got %d, want %d", unpacked.ObjectClass, h.ObjectClass)
	}
	if unpacked.SequenceNumber != h.SequenceNumber {
		t.Errorf("SequenceNumber: got %d, want %d", unpacked.SequenceNumber, h.SequenceNumber)
	}
}

func TestNewTENAObject(t *testing.T) {
	obj := NewTENAObject(HandleTrack, 123)
	if obj.Header.ObjectClass != HandleTrack {
		t.Errorf("ObjectClass: got %d, want %d", obj.Header.ObjectClass, HandleTrack)
	}
	if obj.Header.ObjectInstance != 123 {
		t.Errorf("ObjectInstance: got %d, want %d", obj.Header.ObjectInstance, 123)
	}
}

func TestTENAObjectSetGetAttribute(t *testing.T) {
	obj := NewTENAObject(HandleTrack, 1)
	obj.SetAttribute("Latitude", TypeDouble, 33.7512)
	obj.SetAttribute("Longitude", TypeDouble, -117.8567)
	obj.SetAttribute("TrackNumber", TypeUInt16, uint16(42))

	lat := obj.GetAttribute("Latitude")
	if lat.(float64) != 33.7512 {
		t.Errorf("Latitude: got %f, want %f", lat, 33.7512)
	}

	track := obj.GetAttribute("TrackNumber")
	if track.(uint16) != 42 {
		t.Errorf("TrackNumber: got %d, want %d", track, 42)
	}
}

func TestTENAAttributePackUnpack(t *testing.T) {
	obj := NewTENAObject(HandleTrack, 1)
	obj.SetAttribute("Latitude", TypeDouble, 33.7512)
	obj.SetAttribute("Longitude", TypeDouble, -117.8567)
	obj.SetAttribute("Name", TypeString, "TestTrack")

	buf := make([]byte, 256)
	n := PackAttributes(obj, buf)

	attrs, _ := UnpackAttributes(buf[:n])

	if len(attrs) != 3 {
		t.Errorf("Attribute count: got %d, want 3", len(attrs))
	}
}

func TestHeartbeatPackUnpack(t *testing.T) {
	hb := NewHeartbeat(999)
	
	buf := make([]byte, TENAObjectHeaderSize)
	n := PackHeartbeat(hb, buf)

	if n != TENAObjectHeaderSize {
		t.Errorf("Heartbeat size: got %d, want %d", n, TENAObjectHeaderSize)
	}

	unpacked := UnpackHeartbeat(buf)
	if unpacked.Header.SessionID != 999 {
		t.Errorf("SessionID: got %d, want %d", unpacked.Header.SessionID, 999)
	}
	if unpacked.Header.MessageType != MessageTypeHeartbeat {
		t.Errorf("MessageType: got %d, want %d", unpacked.Header.MessageType, MessageTypeHeartbeat)
	}
}

func TestTENAMagic(t *testing.T) {
	if TENAMagic != [4]byte{'T', 'E', 'N', 'A'} {
		t.Errorf("TENAMagic: got %v, want %v", TENAMagic, [4]byte{'T', 'E', 'N', 'A'})
	}
}

func TestTENAObjectHeaderSize(t *testing.T) {
	buf := make([]byte, TENAObjectHeaderSize)
	h := &TENAObjectHeader{}
	PackTENAObjectHeader(h, buf)
	if len(buf) != TENAObjectHeaderSize {
		t.Errorf("TENAObjectHeaderSize: got %d, want %d", len(buf), TENAObjectHeaderSize)
	}
}
