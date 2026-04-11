package jreap

import (
	"testing"
	"time"

	"forge-c2/jreap/jseries"
)

// TestEncoderRegistryComplete tests that all J-series types are registered in encoder
func TestEncoderRegistryComplete(t *testing.T) {
	enc := NewEncoder("TEST", "ENC")

	// All J-series types that should have encoders
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

	// All J-series types that should have decoders
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
		TrackNumber:    1234,
		Time:           time.Now(),
		Latitude:       33.7512,
		Longitude:     -117.8567,
		Altitude:      10000,
		Speed:         250.0,
		Heading:       90.0,
		ForceType:     2,
		Quality:       jseries.QualityIndicator{Quality: 3},
		ParticipantNumber: 1,
		SensorID:     "RADAR-1",
	}

	// Encode via registry
	encoded, err := enc.EncodeUsing(J0_TrackManagement, j0)
	if err != nil {
		t.Fatalf("EncodeUsing failed: %v", err)
	}

	// Decode via registry
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

	// Try to encode with an unregistered type
	_, err := enc.EncodeUsing(MessageType(100), nil)
	if err == nil {
		t.Error("Expected error for unregistered message type")
	}
}

// TestDecodeUsingUnregisteredType tests error for unregistered type
func TestDecodeUsingUnregisteredType(t *testing.T) {
	dec := NewDecoder("TEST", "DEC")

	// Create a fake JREAP message with unknown type
	enc := NewEncoder("TEST", "ENC")
	testMsg := &jseries.J0TrackManagement{TrackNumber: 123}
	encoded, _ := enc.EncodeUsing(J0_TrackManagement, testMsg)

	// Manually corrupt the type byte to make it unknown
	encoded[6] = 100 // Change message type

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
		t.Fatalf("Decoded type is not *J28SpaceTrack")
	}

	if j28Decoded.TrackNumber != j28.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", j28Decoded.TrackNumber, j28.TrackNumber)
	}
}
