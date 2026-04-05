package jreap

import (
	"testing"
	"time"
)

func TestDecoder_DecodeOPIR(t *testing.T) {
	encoder := NewEncoder("FORGE-NODE-001", "TEST")
	decoder := NewDecoder("FORGE-NODE-001", "TEST")

	// Create a test sensor event
	event := &mockSensorEvent{
		eventID:   "EVT-OPIR-001",
		timestamp: time.Unix(1704067200, 0),
		sensorID:  "SBIRS-GEO-2",
		latitude:  35.5,
		longitude: -115.5,
		altitude:  150000,
		intensity: 450.0, // K — fits in J28 IR field (max 655.35K at 0.01K resolution)
	}

	// Encode
	msg, err := encoder.EncodeSensorEvent(event, nil)
	if err != nil {
		t.Fatalf("EncodeSensorEvent failed: %v", err)
	}

	// Decode
	decoded, err := decoder.DecodeOPIR(msg, nil)
	if err != nil {
		t.Fatalf("DecodeOPIR failed: %v", err)
	}

	// Verify
	if decoded.TrackNumber == 0 {
		t.Error("TrackNumber should not be zero (it's a hash of sensorID)")
	}

	if decoded.Altitude != event.altitude {
		t.Errorf("Altitude mismatch: got %.0f, want %.0f", decoded.Altitude, event.altitude)
	}

	// IR Intensity matches exactly at 0.01K resolution
	irDiff := abs(decoded.IRIntensity - event.intensity)
	if irDiff > 0.1 {
		t.Errorf("IRIntensity mismatch: got %.1f, want %.1f (diff=%.1f)", decoded.IRIntensity, event.intensity, irDiff)
	}

	t.Logf("Decoded OPIR: Track#%d, (%.4f, %.4f, %.0fm), IR=%.1fK",
		decoded.TrackNumber, decoded.Latitude, decoded.Longitude, decoded.Altitude, decoded.IRIntensity)
}

func TestDecoder_DecodeTrackUpdate(t *testing.T) {
	encoder := NewEncoder("FORGE-NODE-001", "TEST")
	decoder := NewDecoder("FORGE-NODE-001", "TEST")

	track := &mockTrack{
		trackNumber: 5678,
		latitude:   51.5074,
		longitude:  -0.1278,
		altitude:   200000,
		speed:      4500,
		heading:    90.5,
		threatLevel: 3,
		status:     "ACTIVE",
		lastUpdate: time.Unix(1704067200, 0),
	}

	// Encode
	msg, err := encoder.EncodeTrack(track, nil)
	if err != nil {
		t.Fatalf("EncodeTrack failed: %v", err)
	}

	// Decode
	decoded, err := decoder.DecodeTrackUpdate(msg, nil)
	if err != nil {
		t.Fatalf("DecodeTrackUpdate failed: %v", err)
	}

	// Verify
	if decoded.TrackNumber != track.trackNumber {
		t.Errorf("TrackNumber mismatch: got %d, want %d", decoded.TrackNumber, track.trackNumber)
	}

	if decoded.ThreatLevel != track.threatLevel {
		t.Errorf("ThreatLevel mismatch: got %d, want %d", decoded.ThreatLevel, track.threatLevel)
	}

	if decoded.Status != "ACTIVE" {
		t.Errorf("Status mismatch: got %s, want ACTIVE", decoded.Status)
	}

	// Check latitude (may have small rounding error)
	latDiff := abs(decoded.Latitude - track.latitude)
	if latDiff > 0.001 {
		t.Errorf("Latitude mismatch: got %.6f, want %.6f", decoded.Latitude, track.latitude)
	}

	t.Logf("Decoded Track: #%d at (%.6f, %.6f, %.0fm), speed=%.1f, heading=%.2f, TL=%d, %s",
		decoded.TrackNumber, decoded.Latitude, decoded.Longitude, decoded.Altitude,
		decoded.Speed, decoded.Heading, decoded.ThreatLevel, decoded.Status)
}

func TestDecoder_DecodeEngagementOrder(t *testing.T) {
	encoder := NewEncoder("FORGE-NODE-001", "TEST")
	decoder := NewDecoder("FORGE-NODE-001", "TEST")

	order := &mockEngagementOrder{
		orderID:       "ENG-THREAT-001",
		priority:     5,
		weaponSystem: "GBI",
		timeOnTarget: time.Unix(1704067500, 0),
		interceptProb: 0.65,
		status:       "PENDING",
	}

	// Encode
	msg, err := encoder.EncodeEngagementOrder(order, nil)
	if err != nil {
		t.Fatalf("EncodeEngagementOrder failed: %v", err)
	}

	// Decode
	decoded, err := decoder.DecodeEngagementOrder(msg, nil)
	if err != nil {
		t.Fatalf("DecodeEngagementOrder failed: %v", err)
	}

	// Verify
	if decoded.Priority != order.priority {
		t.Errorf("Priority mismatch: got %d, want %d", decoded.Priority, order.priority)
	}

	if decoded.WeaponSystem != "GBI" {
		t.Errorf("WeaponSystem mismatch: got %s, want GBI", decoded.WeaponSystem)
	}

	if decoded.Status != "PENDING" {
		t.Errorf("Status mismatch: got %s, want PENDING", decoded.Status)
	}

	// Intercept probability
	probDiff := abs(decoded.InterceptProb - order.interceptProb)
	if probDiff > 0.01 {
		t.Errorf("InterceptProb mismatch: got %.4f, want %.4f", decoded.InterceptProb, order.interceptProb)
	}

	t.Logf("Decoded Engagement: %s, %s, P=%d, TOT=%s, Prob=%.2f%%, %s",
		decoded.OrderID, decoded.WeaponSystem, decoded.Priority,
		decoded.TimeOnTarget.Format(time.RFC3339), decoded.InterceptProb*100, decoded.Status)
}

func TestDecoder_DecodeWrongType(t *testing.T) {
	decoder := NewDecoder("FORGE-NODE-001", "TEST")
	encoder := NewEncoder("FORGE-NODE-001", "TEST")

	// Create a track message
	track := &mockTrack{
		trackNumber: 1234,
		latitude:   40.0,
		longitude:  -75.0,
		altitude:   50000,
		speed:      3000,
		heading:    45.0,
		threatLevel: 4,
		status:     "ACTIVE",
		lastUpdate: time.Now(),
	}

	msg, err := encoder.EncodeTrack(track, nil)
	if err != nil {
		t.Fatalf("EncodeTrack failed: %v", err)
	}

	// Try to decode as engagement order - should fail
	_, err = decoder.DecodeEngagementOrder(msg, nil)
	if err == nil {
		t.Error("Expected error when decoding track as engagement order")
	}

	// Try to decode as OPIR - should fail
	_, err = decoder.DecodeOPIR(msg, nil)
	if err == nil {
		t.Error("Expected error when decoding track as OPIR")
	}
}

func TestDecodeFull_InvalidCRC(t *testing.T) {
	// Create a valid message
	payload := []byte("test data")
	msg, err := EncodeFull(payload, uint8(J3_TrackUpdate), CRC16)
	if err != nil {
		t.Fatalf("EncodeFull failed: %v", err)
	}

	// Corrupt the CRC
	msg[len(msg)-1] ^= 0xFF
	msg[len(msg)-2] ^= 0xFF

	// Try to decode - should fail with CRC error
	_, _, _, err = DecodeFull(msg)
	if err == nil {
		t.Error("Expected error for corrupted CRC")
	}
}

func TestDecodeFull_InvalidHeader(t *testing.T) {
	// Message too short
	_, _, _, err := DecodeFull([]byte{0x00})
	if err == nil {
		t.Error("Expected error for message too short")
	}

	// Invalid protocol flags
	badMsg := []byte{0x00, 0x02, 0x03, 0x00, 0x00, 0x00, 0x00, 0x05}
	_, _, _, err = DecodeFull(badMsg)
	if err == nil {
		t.Error("Expected error for invalid protocol flags")
	}
}

func abs(x float64) float64 {
	if x < 0 {
		return -x
	}
	return x
}
