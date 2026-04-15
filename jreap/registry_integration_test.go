package jreap

import (
	"testing"
	"time"

	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// TestRegistryIntegration verifies all J0-J31 types are registered
// and can encode then decode through the registry.
func TestRegistryIntegration(t *testing.T) {
	enc := NewEncoder("node1", "app1")
	dec := NewDecoder("node1", "app1")

	// Verify all expected types are registered
	expectedTypes := []MessageType{
		J0_TrackManagement, J1_NetworkInitialize, J2_Surveillance,
		J4_EngagementOrder, J5_EngagementStatus, J6_SensorRegistration,
		J7_Platform, J8_Radio, J9_ElectronicAttack, J10_Offset,
		J11_DataTransfer, J12_Alert, J13_PreciseParticipant,
		J14_ProcessSpec, J15_Command, J16_Acknowledge, J17_InitiateTransfer,
		J18_SpaceTrack, J19_Component, J20_AirTrack, J21_SurfaceTrack,
		J22_SubsurfaceTrack, J23_LandTrack, J24_ForeignEquipment,
		J25_ProductionLevel, J26_Test, J27_Time, J28_SatelliteOPIR,
		J29_Symbology, J30_IFF, J31_FileTransfer,
	}

	for _, mt := range expectedTypes {
		if _, ok := enc.registry[mt]; !ok {
			t.Errorf("encoder: type %s not registered", mt)
		}
		if _, ok := dec.registry[mt]; !ok {
			t.Errorf("decoder: type %s not registered", mt)
		}
	}

	// Spot-check roundtrip through the registry for a few key types
	t.Run("J0_roundtrip", func(t *testing.T) {
		j0 := &jseries.J0TrackManagement{
			TrackNumber:  42,
			TrackStatus:  1,
			MgtType:      2,
			ForceType:    1,
			Time:         time.Now().Truncate(time.Millisecond),
			Latitude:     33.75,
			Longitude:    -117.85,
			Altitude:     500,
			Speed:        250,
			Heading:      180,
			Quality:      jseries.QualityIndicator{Quality: 3},
			ParticipantNumber: 100,
		}
		buf, err := enc.EncodeUsing(J0_TrackManagement, j0)
		if err != nil {
			t.Fatalf("EncodeUsing J0: %v", err)
		}
		got, msgType, err := dec.DecodeUsing(buf)
		if err != nil {
			t.Fatalf("DecodeUsing J0: %v", err)
		}
		if msgType != J0_TrackManagement {
			t.Errorf("expected J0, got %s", msgType)
		}
		decoded, ok := got.(*jseries.J0TrackManagement)
		if !ok {
			t.Fatalf("expected *J0TrackManagement, got %T", got)
		}
		if decoded.TrackNumber != 42 {
			t.Errorf("TrackNumber: got %d, want 42", decoded.TrackNumber)
		}
	})

	t.Run("J12_roundtrip", func(t *testing.T) {
		j12 := &jseries.J12Alert{
			AlertID:     "ALT-007",
			AlertType:   2,
			Severity:    3,
			Latitude:    35.0,
			Longitude:   -120.0,
			TrackNumber: 10,
		}
		buf, err := enc.EncodeUsing(J12_Alert, j12)
		if err != nil {
			t.Fatalf("EncodeUsing J12: %v", err)
		}
		got, msgType, err := dec.DecodeUsing(buf)
		if err != nil {
			t.Fatalf("DecodeUsing J12: %v", err)
		}
		if msgType != J12_Alert {
			t.Errorf("expected J12, got %s", msgType)
		}
		decoded, ok := got.(*jseries.J12Alert)
		if !ok {
			t.Fatalf("expected *J12Alert, got %T", got)
		}
		if decoded.AlertType != 2 {
			t.Errorf("AlertType: got %d, want 2", decoded.AlertType)
		}
	})

	t.Run("J20_roundtrip", func(t *testing.T) {
		j20 := &jseries.J20AirTrack{
			TrackNumber: 100,
			Time:        time.Now().Truncate(time.Millisecond),
			Latitude:    38.0,
			Longitude:   -77.0,
			Altitude:    10000,
			Speed:       300,
			Heading:     270,
			ForceType:   2,
		}
		buf, err := enc.EncodeUsing(J20_AirTrack, j20)
		if err != nil {
			t.Fatalf("EncodeUsing J20: %v", err)
		}
		got, msgType, err := dec.DecodeUsing(buf)
		if err != nil {
			t.Fatalf("DecodeUsing J20: %v", err)
		}
		if msgType != J20_AirTrack {
			t.Errorf("expected J20, got %s", msgType)
		}
		decoded, ok := got.(*jseries.J20AirTrack)
		if !ok {
			t.Fatalf("expected *J20AirTrack, got %T", got)
		}
		if decoded.TrackNumber != 100 {
			t.Errorf("TrackNumber: got %d, want 100", decoded.TrackNumber)
		}
	})

	t.Run("J8_roundtrip", func(t *testing.T) {
		j8 := &jseries.J8Radio{
			TrackNumber:       5,
			Subtype:           1,
			ParticipantNumber: 10,
			NetworkID:         200,
			MessageLength:     11,
			MessageText:       "HELLO FORGE",
		}
		buf, err := enc.EncodeUsing(J8_Radio, j8)
		if err != nil {
			t.Fatalf("EncodeUsing J8: %v", err)
		}
		got, msgType, err := dec.DecodeUsing(buf)
		if err != nil {
			t.Fatalf("DecodeUsing J8: %v", err)
		}
		if msgType != J8_Radio {
			t.Errorf("expected J8, got %s", msgType)
		}
		decoded, ok := got.(*jseries.J8Radio)
		if !ok {
			t.Fatalf("expected *J8Radio, got %T", got)
		}
		if decoded.TrackNumber != 5 {
			t.Errorf("TrackNumber: got %d, want 5", decoded.TrackNumber)
		}
	})

	t.Run("EncodeUsing_unknown_type", func(t *testing.T) {
		_, err := enc.EncodeUsing(MessageType(99), nil)
		if err == nil {
			t.Error("expected error for unknown type")
		}
	})

	t.Run("DecodeUsing_bad_message", func(t *testing.T) {
		_, _, err := dec.DecodeUsing([]byte{0xFF, 0xFF, 0xFF})
		if err == nil {
			t.Error("expected error for bad message")
		}
	})
}

// TestSensorEventRoundtrip tests the high-level EncodeSensorEvent/DecodeOPIR path.
func TestSensorEventRoundtrip(t *testing.T) {
	enc := NewEncoder("node1", "app1")
	dec := NewDecoder("node1", "app1")

	event := &testSensorEvent{
		eventID:   "SAT-001",
		timestamp: time.Now().UTC().Truncate(time.Millisecond),
		sensorID:  "SBIRS-GEO-1",
		latitude:  33.7512,
		longitude: -117.8567,
		altitude:  35786000,
		intensity: 0.85,
	}
	meta := mdpa.NewMDPAMetadata("node1", "app1", "", "UNCLASSIFIED")

	buf, err := enc.EncodeSensorEvent(event, meta)
	if err != nil {
		t.Fatalf("EncodeSensorEvent: %v", err)
	}

	decoded, err := dec.DecodeOPIR(buf, meta)
	if err != nil {
		t.Fatalf("DecodeOPIR: %v", err)
	}
	if decoded.TrackNumber == 0 {
		t.Error("expected non-zero track number")
	}
}

type testSensorEvent struct {
	eventID   string
	timestamp time.Time
	sensorID  string
	latitude  float64
	longitude float64
	altitude  float64
	intensity float64
}

func (e *testSensorEvent) GetEventID() string     { return e.eventID }
func (e *testSensorEvent) GetTimestamp() time.Time { return e.timestamp }
func (e *testSensorEvent) GetSensorID() string     { return e.sensorID }
func (e *testSensorEvent) GetLatitude() float64    { return e.latitude }
func (e *testSensorEvent) GetLongitude() float64   { return e.longitude }
func (e *testSensorEvent) GetAltitude() float64     { return e.altitude }
func (e *testSensorEvent) GetIntensity() float64    { return e.intensity }