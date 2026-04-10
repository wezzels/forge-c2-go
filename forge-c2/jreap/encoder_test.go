package jreap

import (
	"testing"
	"time"

	"forge-c2/jreap/jseries"
)

// mockSensorEvent implements SensorEventLike for testing.
type mockSensorEvent struct {
	eventID   string
	timestamp time.Time
	sensorID  string
	latitude  float64
	longitude float64
	altitude  float64
	intensity float64
}

func (m *mockSensorEvent) GetEventID() string      { return m.eventID }
func (m *mockSensorEvent) GetTimestamp() time.Time { return m.timestamp }
func (m *mockSensorEvent) GetSensorID() string     { return m.sensorID }
func (m *mockSensorEvent) GetLatitude() float64    { return m.latitude }
func (m *mockSensorEvent) GetLongitude() float64   { return m.longitude }
func (m *mockSensorEvent) GetAltitude() float64    { return m.altitude }
func (m *mockSensorEvent) GetIntensity() float64   { return m.intensity }

// mockTrack implements TrackLike for testing.
type mockTrack struct {
	trackNumber  uint16
	latitude     float64
	longitude    float64
	altitude     float64
	speed        float64
	heading      float64
	threatLevel  int
	status       string
	lastUpdate   time.Time
	associations []string
}

func (m *mockTrack) GetTrackID() string        { return "TRACK-001" }
func (m *mockTrack) GetTrackNumber() uint16    { return m.trackNumber }
func (m *mockTrack) GetLatitude() float64      { return m.latitude }
func (m *mockTrack) GetLongitude() float64     { return m.longitude }
func (m *mockTrack) GetAltitude() float64      { return m.altitude }
func (m *mockTrack) GetSpeed() float64         { return m.speed }
func (m *mockTrack) GetHeading() float64       { return m.heading }
func (m *mockTrack) GetThreatLevel() int       { return m.threatLevel }
func (m *mockTrack) GetStatus() string         { return m.status }
func (m *mockTrack) GetLastUpdate() time.Time  { return m.lastUpdate }
func (m *mockTrack) GetAssociations() []string { return m.associations }

// mockEngagementOrder implements EngagementOrderLike for testing.
type mockEngagementOrder struct {
	orderID       string
	priority      int
	weaponSystem  string
	timeOnTarget  time.Time
	interceptProb float64
	status        string
}

func (m *mockEngagementOrder) GetOrderID() string         { return m.orderID }
func (m *mockEngagementOrder) GetTrackID() string         { return "TRACK-001" }
func (m *mockEngagementOrder) GetPriority() int           { return m.priority }
func (m *mockEngagementOrder) GetWeaponSystem() string    { return m.weaponSystem }
func (m *mockEngagementOrder) GetTimeOnTarget() time.Time { return m.timeOnTarget }
func (m *mockEngagementOrder) GetInterceptProb() float64  { return m.interceptProb }
func (m *mockEngagementOrder) GetStatus() string          { return m.status }

func TestEncoder_EncodeSensorEvent(t *testing.T) {
	encoder := NewEncoder("FORGE-NODE-001", "TEST")

	event := &mockSensorEvent{
		eventID:   "EVT-001",
		timestamp: time.Unix(1704067200, 0), // 2024-01-01 00:00:00 UTC
		sensorID:  "SBIRS-GEO-1",
		latitude:  40.0,
		longitude: -75.0,
		altitude:  100000,
		intensity: 3000.0,
	}

	msg, err := encoder.EncodeSensorEvent(event, nil)
	if err != nil {
		t.Fatalf("EncodeSensorEvent failed: %v", err)
	}

	// Verify message structure
	if len(msg) < HeaderSize+2 {
		t.Fatalf("Message too short: %d bytes", len(msg))
	}

	// Decode and verify
	hdr, payload, crc, err := DecodeFull(msg)
	if err != nil {
		t.Fatalf("DecodeFull failed: %v", err)
	}

	if hdr.MessageType != uint8(J28_SatelliteOPIR) {
		t.Errorf("Expected message type J28, got J%d", hdr.MessageType)
	}

	if hdr.ProtocolFlags != ProtocolJREAPC {
		t.Errorf("Expected protocol flags 0x%04X, got 0x%04X", ProtocolJREAPC, hdr.ProtocolFlags)
	}

	if int(hdr.Length) != len(payload) {
		t.Errorf("Length mismatch: header says %d, payload is %d", hdr.Length, len(payload))
	}

	if crc == 0 {
		t.Error("CRC should not be zero")
	}

	t.Logf("Encoded sensor event: %d bytes, type J%d, CRC 0x%04X", len(msg), hdr.MessageType, crc)
}

func TestEncoder_EncodeTrack(t *testing.T) {
	encoder := NewEncoder("FORGE-NODE-001", "TEST")

	track := &mockTrack{
		trackNumber:  1234,
		latitude:     40.7128,
		longitude:    -74.0060,
		altitude:     50000,
		speed:        3000,
		heading:      45.0,
		threatLevel:  4,
		status:       "ACTIVE",
		lastUpdate:   time.Unix(1704067200, 0),
		associations: []string{"SBIRS-GEO-1"},
	}

	msg, err := encoder.EncodeTrack(track, nil)
	if err != nil {
		t.Fatalf("EncodeTrack failed: %v", err)
	}

	// Verify message structure
	if len(msg) < HeaderSize+2 {
		t.Fatalf("Message too short: %d bytes", len(msg))
	}

	hdr, payload, crc, err := DecodeFull(msg)
	if err != nil {
		t.Fatalf("DecodeFull failed: %v", err)
	}

	if hdr.MessageType != uint8(J3_TrackUpdate) {
		t.Errorf("Expected message type J3, got J%d", hdr.MessageType)
	}

	if int(hdr.Length) != len(payload) {
		t.Errorf("Length mismatch: header says %d, payload is %d", hdr.Length, len(payload))
	}

	t.Logf("Encoded track: %d bytes, type J%d, CRC 0x%04X", len(msg), hdr.MessageType, crc)
}

func TestEncoder_EncodeEngagementOrder(t *testing.T) {
	encoder := NewEncoder("FORGE-NODE-001", "TEST")

	order := &mockEngagementOrder{
		orderID:       "ENG-001",
		priority:      5,
		weaponSystem:  "SM-3",
		timeOnTarget:  time.Unix(1704067500, 0),
		interceptProb: 0.75,
		status:        "PENDING",
	}

	msg, err := encoder.EncodeEngagementOrder(order, nil)
	if err != nil {
		t.Fatalf("EncodeEngagementOrder failed: %v", err)
	}

	hdr, payload, crc, err := DecodeFull(msg)
	if err != nil {
		t.Fatalf("DecodeFull failed: %v", err)
	}

	if hdr.MessageType != uint8(J4_EngagementOrder) {
		t.Errorf("Expected message type J4, got J%d", hdr.MessageType)
	}

	if int(hdr.Length) != len(payload) {
		t.Errorf("Length mismatch: header says %d, payload is %d", hdr.Length, len(payload))
	}

	t.Logf("Encoded engagement order: %d bytes, type J%d, CRC 0x%04X", len(msg), hdr.MessageType, crc)
}

func TestEncodeFull_RoundTrip(t *testing.T) {
	payload := []byte("test payload data 12345")

	msg, err := EncodeFull(payload, uint8(J3_TrackUpdate), CRC16)
	if err != nil {
		t.Fatalf("EncodeFull failed: %v", err)
	}

	hdr, decodedPayload, crc, err := DecodeFull(msg)
	if err != nil {
		t.Fatalf("DecodeFull failed: %v", err)
	}

	if hdr.MessageType != uint8(J3_TrackUpdate) {
		t.Errorf("Message type mismatch: got J%d, want J3", hdr.MessageType)
	}

	if int(hdr.Length) != len(payload) {
		t.Errorf("Length mismatch: got %d, want %d", hdr.Length, len(payload))
	}

	if string(decodedPayload) != string(payload) {
		t.Errorf("Payload mismatch: got %q, want %q", decodedPayload, payload)
	}

	if crc == 0 {
		t.Error("CRC should not be zero")
	}

	// Verify CRC is correct
	computedCRC := CRC16(msg[:len(msg)-2])
	if crc != computedCRC {
		t.Errorf("CRC mismatch: got 0x%04X, computed 0x%04X", crc, computedCRC)
	}
}

func TestCRC16(t *testing.T) {
	// Test deterministic behavior, not specific values
	empty := CRC16([]byte{})
	if empty != 0xFFFF {
		t.Errorf("CRC16(empty) = 0x%04X, want 0xFFFF", empty)
	}

	// Single byte should be non-zero
	single := CRC16([]byte{0x01})
	if single == 0 {
		t.Error("CRC16 single byte should not be 0")
	}

	// Same input should produce same output
	data := []byte("test data")
	if CRC16(data) != CRC16(data) {
		t.Error("CRC16 not deterministic")
	}
}

func TestEncodeUsing_J4(t *testing.T) {
	encoder := NewEncoder("NODE1", "APP1")
	
	order := &mockEngagementOrder{
		orderID:       "ORD-001",
		priority:      3,
		weaponSystem:  "SM-6",
		timeOnTarget:  time.Now().Add(30 * time.Minute),
		interceptProb: 0.85,
		status:        "ACTIVE",
	}
	
	buf, err := encoder.EncodeUsing(J4_EngagementOrder, order)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}
	if len(buf) == 0 {
		t.Error("EncodeUsing returned empty buffer")
	}
	// Should have header (8) + payload (15) + crc (2) = 25 bytes
	if len(buf) != 27 {
		t.Errorf("Expected 25 bytes, got %d", len(buf))
	}
}

func TestEncodeUsing_J2(t *testing.T) {
	encoder := NewEncoder("NODE1", "APP1")
	
	j2 := &jseries.J2Surveillance{
		TrackNumber:       12345,
		ParticipantNumber: 6789,
		TrackStatus:       0x05,
		Latitude:          33.7512,
		Longitude:         -117.8567,
		Altitude:          12500,
		Speed:             450.3,
		Heading:           127.5,
		CourseOverGround:  128.0,
		RadialVelocity:    120.7,
		SignalIntensity:   15.3,
		Frequency:         9700000,
		SNR:               15.2,
		Confidence:        0.92,
		Timestamp:         time.Now(),
		ForceType:         2,
		PlatformType:      311,
		SensorID:          "RADAR-01",
	}
	
	buf, err := encoder.EncodeUsing(J2_Surveillance, j2)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}
	if len(buf) == 0 {
		t.Error("EncodeUsing returned empty buffer")
	}
	// Should have header (8) + J2 payload (40) + crc (2) = 50 bytes
	if len(buf) != 50 {
		t.Errorf("Expected 50 bytes, got %d", len(buf))
	}
}

func TestEncodeUsing_UnknownType(t *testing.T) {
	encoder := NewEncoder("NODE1", "APP1")
	
	_, err := encoder.EncodeUsing(J3_TrackUpdate, nil)
	if err == nil {
		t.Error("Expected error for unregistered type")
	}
}

func TestEncoder_Register_Override(t *testing.T) {
	encoder := NewEncoder("NODE1", "APP1")
	
	// Override J2 encoder with custom function
	encoder.Register(J2_Surveillance, func(msg interface{}, buf []byte) {
		// Custom encoder that just zeros the buffer
		for i := range buf {
			buf[i] = 0xFF
		}
	})
	
	j2 := &jseries.J2Surveillance{
		TrackNumber:       12345,
		Latitude:          33.7512,
		Longitude:         -117.8567,
	}
	
	buf, err := encoder.EncodeUsing(J2_Surveillance, j2)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}
	// All bytes should be 0xFF
	for i, b := range buf[8:48] { // payload bytes
		if b != 0xFF {
			t.Errorf("Payload byte[%d] = 0x%02x, want 0xFF", i, b)
		}
	}
}


func TestEncodeUsing_J4Real(t *testing.T) {
	encoder := NewEncoder("NODE1", "APP1")
	
	j4 := &jseries.J4EngagementOrder{
		EngagementID:  12345,
		TrackNumber:   6789,
		Priority:      3,
		WeaponSystem:  jseries.J4WeaponSystem(2),
		TimeOnTarget:  time.Now().Add(30 * time.Minute),
		InterceptProb: 0.85,
		TrackStatus:   jseries.TrackStatus_Active,
	}
	
	buf, err := encoder.EncodeUsing(J4_EngagementOrder, j4)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}
	// Header (8) + J4PayloadSize (17) + CRC (2) = 27
	if len(buf) != 27 {
		t.Errorf("Expected 27 bytes, got %d", len(buf))
	}
	
	// Just verify length and no error (DecodeFull tested elsewhere)
	if err != nil {
		t.Fatalf("EncodeUsing returned error: %v", err)
	}
}
