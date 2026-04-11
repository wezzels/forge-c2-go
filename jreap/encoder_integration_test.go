package jreap

import (
	"fmt"
	"testing"
	"time"

	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// TestEncoderRegistryComplete tests that all J-series types are registered in encoder
func TestEncoderRegistryComplete(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")

	types := []MessageType{
		J0_TrackManagement, J1_NetworkInitialize, J2_Surveillance,
		J4_EngagementOrder, J5_EngagementStatus, J6_SensorRegistration,
		J7_Platform, J8_Radio, J9_ElectronicAttack, J10_Offset,
		J11_DataTransfer, J12_Alert, J13_PreciseParticipant, J14_ProcessSpec,
		J15_Command, J16_Acknowledge, J17_InitiateTransfer, J18_SpaceTrack,
		J26_Test, J27_Time, J28_SatelliteOPIR, J29_Symbology, J30_IFF, J31_FileTransfer,
	}

	for _, msgType := range types {
		if _, ok := enc.registry[msgType]; !ok {
			t.Errorf("Encoder registry missing: %s", msgType)
		}
	}
}

// TestDecoderRegistryComplete tests that all J-series types are registered in decoder
func TestDecoderRegistryComplete(t *testing.T) {
	dec := NewDecoder("TEST", "DEC")

	types := []MessageType{
		J0_TrackManagement, J1_NetworkInitialize, J2_Surveillance,
		J4_EngagementOrder, J5_EngagementStatus, J6_SensorRegistration,
		J7_Platform, J8_Radio, J9_ElectronicAttack, J10_Offset,
		J11_DataTransfer, J12_Alert, J13_PreciseParticipant, J14_ProcessSpec,
		J15_Command, J16_Acknowledge, J17_InitiateTransfer, J18_SpaceTrack,
		J26_Test, J27_Time, J28_SatelliteOPIR, J29_Symbology, J30_IFF, J31_FileTransfer,
	}

	for _, msgType := range types {
		if _, ok := dec.registry[msgType]; !ok {
			t.Errorf("Decoder registry missing: %s", msgType)
		}
	}
}

// TestEncodeJ0Roundtrip tests encode/decode for J0 via EncodeUsing
func TestEncodeJ0Roundtrip(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")
	dec := NewDecoder("TEST", "DEC")

	j0 := &jseries.J0TrackManagement{
		TrackNumber:       1234,
		Time:             time.Now(),
		Latitude:         33.7512,
		Longitude:       -117.8567,
		Altitude:        10000,
		Speed:           250.0,
		Heading:         90.0,
		ForceType:      2,
		Quality:        jseries.QualityIndicator{Quality: 3},
		ParticipantNumber: 1,
		SensorID:       "RADAR-1",
	}

	encoded, err := enc.EncodeUsing(J0_TrackManagement, j0)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}

	decoded, msgType, err := dec.DecodeUsing(encoded)
	if err != nil {
		t.Fatalf("DecodeUsing failed: %v", err)
	}

	if msgType != J0_TrackManagement {
		t.Errorf("Message type mismatch: got %s, want %s", msgType, J0_TrackManagement)
	}

	j0Decoded, ok := decoded.(*jseries.J0TrackManagement)
	if !ok {
		t.Fatalf("Decoded type is not *J0TrackManagement")
	}

	if j0Decoded.TrackNumber != j0.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", j0Decoded.TrackNumber, j0.TrackNumber)
	}
}

// TestEncodeUsingUnregisteredType tests error for unregistered type
func TestEncodeUsingUnregisteredType(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")
	_, err := enc.EncodeUsing(MessageType(100), nil)
	if err == nil {
		t.Error("Expected error for unregistered message type")
	}
}

// TestDecodeUsingUnregisteredType tests error for unregistered type
func TestDecodeUsingUnregisteredType(t *testing.T) {
	dec := NewDecoder("TEST", "DEC")
	enc := NewEncoder("TEST", "ENC")
	testMsg := &jseries.J0TrackManagement{TrackNumber: 123}
	encoded, _ := enc.EncodeUsing(J0_TrackManagement, testMsg)
	encoded[6] = 100 // Change message type to unknown
	_, _, err := dec.DecodeUsing(encoded)
	if err == nil {
		t.Error("Expected error for unregistered message type")
	}
}

// TestEncodeJ28Roundtrip tests encode/decode for J28 via EncodeUsing
func TestEncodeJ28Roundtrip(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")
	dec := NewDecoder("TEST", "DEC")

	j28 := &jseries.J28SpaceTrack{
		TrackNumber: 5678,
		Time:       time.Now(),
		Latitude:   40.7128,
		Longitude: -74.0060,
		Altitude:  40000,
		VelocityX: 7800,
	}

	encoded, err := enc.EncodeUsing(J28_SatelliteOPIR, j28)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}

	decoded, msgType, err := dec.DecodeUsing(encoded)
	if err != nil {
		t.Fatalf("DecodeUsing failed: %v", err)
	}

	if msgType != J28_SatelliteOPIR {
		t.Errorf("Message type mismatch: got %s, want %s", msgType, J28_SatelliteOPIR)
	}

	j28Decoded, ok := decoded.(*jseries.J28SpaceTrack)
	if !ok {
		t.Fatalf("Decoded type is not *jseries.J28SpaceTrack")
	}

	if j28Decoded.TrackNumber != j28.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", j28Decoded.TrackNumber, j28.TrackNumber)
	}
}

// TestQualityFlagsPipeline tests that QualityFlags flow through the encoder pipeline
func TestQualityFlagsPipeline(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")

	tests := []struct {
		name  string
		flags uint8
	}{
		{"Good+SNR", mdpa.QualityGood | mdpa.QualitySNRAdequate},
		{"Good only", mdpa.QualityGood},
		{"Good+SNR+Correlated", mdpa.QualityGood | mdpa.QualitySNRAdequate | mdpa.QualityCorrelated},
		{"All flags", 0xFF},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			meta := &mdpa.MDPAMetadata{
				ProcessingNodeID: "TEST",
				QualityFlags:     tt.flags,
				Classification:   "UNCLASSIFIED",
			}

			track := &testTrack{
				id: "TRK-001", trackNum: 1234,
				lat: 33.7512, lon: -117.8567, alt: 10000,
				speed: 250.0, heading: 90.0, threat: 1,
				status: "ACTIVE", lastUpdate: time.Now(),
			}

			encoded, err := enc.EncodeTrackWithMetadata(track, meta)
			if err != nil {
				t.Fatalf("EncodeTrackWithMetadata failed: %v", err)
			}
			if encoded.Bytes == nil {
				t.Error("Encoded bytes is nil")
			}
		})
	}
}

// TestCorrelationIDPropagation tests that CorrelationID is preserved through encoding
func TestCorrelationIDPropagation(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")

	tests := []struct {
		name   string
		corrID string
	}{
		{"SBIRS-GEO-1", "SBIRS-GEO-1-0001-1744354800000"},
		{"NG-OPIR-2", "NG-OPIR-2-1234-1744354801000"},
		{"FUSED", "FUSED-9999-1744354802000"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			meta := &mdpa.MDPAMetadata{
				ProcessingNodeID: "TEST",
				CorrelationID:   tt.corrID,
				QualityFlags:     mdpa.QualityGood,
				Classification:   "UNCLASSIFIED",
			}

			track := &testTrack{
				id: "TRK-001", trackNum: 1234,
				lat: 33.7512, lon: -117.8567, alt: 10000,
				speed: 250.0, heading: 90.0, threat: 1,
				status: "ACTIVE", lastUpdate: time.Now(),
			}

			encoded, err := enc.EncodeTrackWithMetadata(track, meta)
			if err != nil {
				t.Fatalf("EncodeTrackWithMetadata failed: %v", err)
			}

			if encoded.Metadata == nil {
				t.Fatal("Metadata is nil")
			}
			if encoded.Metadata.CorrelationID != tt.corrID {
				t.Errorf("CorrelationID: got %q, want %q", encoded.Metadata.CorrelationID, tt.corrID)
			}
		})
	}
}

// TestCorrelationIDFormat tests the CorrelationID format
func TestCorrelationIDFormat(t *testing.T) {
	satID := "SBIRS-GEO-1"
	trackNum := uint16(1234)
	ts := time.UnixMilli(1744354800000)

	expected := fmt.Sprintf("%s-%04d-%d", satID, trackNum, ts.UnixMilli())
	if expected != "SBIRS-GEO-1-1234-1744354800000" {
		t.Errorf("CorrelationID format: got %q", expected)
	}
}

// testTrack is a test implementation of TrackLike
type testTrack struct {
	id         string
	trackNum   uint16
	lat, lon   float64
	alt        float64
	speed      float64
	heading    float64
	threat     int
	status     string
	lastUpdate time.Time
	assoc      []string
}

func (t *testTrack) GetTrackID() string            { return t.id }
func (t *testTrack) GetTrackNumber() uint16        { return t.trackNum }
func (t *testTrack) GetLatitude() float64          { return t.lat }
func (t *testTrack) GetLongitude() float64         { return t.lon }
func (t *testTrack) GetAltitude() float64          { return t.alt }
func (t *testTrack) GetSpeed() float64            { return t.speed }
func (t *testTrack) GetHeading() float64           { return t.heading }
func (t *testTrack) GetThreatLevel() int          { return t.threat }
func (t *testTrack) GetStatus() string             { return t.status }
func (t *testTrack) GetLastUpdate() time.Time      { return t.lastUpdate }
func (t *testTrack) GetAssociations() []string    { return t.assoc }
