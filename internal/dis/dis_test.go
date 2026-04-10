package dis

import (
	"testing"
	"math"
)

// floatApproxEq compares two floats with a tolerance.
func floatApproxEq(a, b, tolerance float64) bool {
	diff := math.Abs(a - b)
	return diff < tolerance
}

func TestDISHeaderRoundtrip(t *testing.T) {
	orig := &DISHeader{
		ProtocolVersion: DISProtocolVersion,
		ExerciseID:      1,
		PDUHeaderLength: 144,
		PDUType:        TypeEntityState,
		Family:         FamilyEntityManagement,
		Timestamp:      12345,
	}
	buf := make([]byte, 16)
	PackDISHeader(orig, buf)
	unpacked := UnpackDISHeader(buf)

	if unpacked.ProtocolVersion != orig.ProtocolVersion {
		t.Errorf("ProtocolVersion: got %d, want %d", unpacked.ProtocolVersion, orig.ProtocolVersion)
	}
	if unpacked.ExerciseID != orig.ExerciseID {
		t.Errorf("ExerciseID: got %d, want %d", unpacked.ExerciseID, orig.ExerciseID)
	}
	if unpacked.PDUType != orig.PDUType {
		t.Errorf("PDUType: got %d, want %d", unpacked.PDUType, orig.PDUType)
	}
	if unpacked.Family != orig.Family {
		t.Errorf("Family: got %d, want %d", unpacked.Family, orig.Family)
	}
	if unpacked.Timestamp != orig.Timestamp {
		t.Errorf("Timestamp: got %d, want %d", unpacked.Timestamp, orig.Timestamp)
	}
}

func TestEntityStatePDUNew(t *testing.T) {
	pdu := NewEntityStatePDU(1, 2, 3)

	if pdu.SiteNumber != 1 {
		t.Errorf("SiteNumber: got %d, want %d", pdu.SiteNumber, 1)
	}
	if pdu.ApplicationNumber != 2 {
		t.Errorf("ApplicationNumber: got %d, want %d", pdu.ApplicationNumber, 2)
	}
	if pdu.EntityNumber != 3 {
		t.Errorf("EntityNumber: got %d, want %d", pdu.EntityNumber, 3)
	}
	if pdu.Header.PDUType != TypeEntityState {
		t.Errorf("PDUType: got %d, want %d", pdu.Header.PDUType, TypeEntityState)
	}
	if pdu.Header.Family != FamilyEntityManagement {
		t.Errorf("Family: got %d, want %d", pdu.Header.Family, FamilyEntityManagement)
	}
}

func TestEntityStatePDUSetLocation(t *testing.T) {
	pdu := NewEntityStatePDU(1, 1, 1)
	pdu.SetLocation(33.7512, -117.8567, 1000)

	if !floatApproxEq(pdu.Latitude, 33.7512, 0.0001) {
		t.Errorf("Latitude: got %f, want %f", pdu.Latitude, 33.7512)
	}
	if !floatApproxEq(pdu.Longitude, -117.8567, 0.0001) {
		t.Errorf("Longitude: got %f, want %f", pdu.Longitude, -117.8567)
	}
	if !floatApproxEq(pdu.Altitude, 1000.0, 0.1) {
		t.Errorf("Altitude: got %f, want 1000.0", pdu.Altitude)
	}
}

func TestEntityStatePDUSetOrientation(t *testing.T) {
	pdu := NewEntityStatePDU(1, 1, 1)
	pdu.SetOrientation(45.0, 30.0, 90.0)

	// 45 degrees = 0.7854 radians
	expectedPhi := 45.0 * math.Pi / 180
	if !floatApproxEq(pdu.Orientation.Phi, expectedPhi, 0.001) {
		t.Errorf("Phi: got %f, want %f", pdu.Orientation.Phi, expectedPhi)
	}
}

func TestEntityStatePDUSetVelocity(t *testing.T) {
	pdu := NewEntityStatePDU(1, 1, 1)
	pdu.SetVelocity(100.5, -50.25, 0.0)

	if !floatApproxEq(pdu.VelocityX, 100.5, 0.1) {
		t.Errorf("VelocityX: got %f, want %f", pdu.VelocityX, 100.5)
	}
	if !floatApproxEq(pdu.VelocityY, -50.25, 0.1) {
		t.Errorf("VelocityY: got %f, want %f", pdu.VelocityY, -50.25)
	}
	if !floatApproxEq(pdu.VelocityZ, 0.0, 0.1) {
		t.Errorf("VelocityZ: got %f, want %f", pdu.VelocityZ, 0.0)
	}
}

func TestEntityStatePDURoundtrip(t *testing.T) {
	orig := NewEntityStatePDU(1, 2, 3)
	orig.SetLocation(33.7512, -117.8567, 10000)
	orig.SetOrientation(315.0, 5.0, 180.0)
	orig.SetVelocity(250.0, 0.0, 0.0)
	orig.SetEntityType(1, 2, 5, 1, 1, 200) // Air platform, USA
	orig.SetMarking("TEST-123")

	buf := make([]byte, EntityStatePDUSize)
	PackEntityStatePDU(orig, buf)
	unpacked := UnpackEntityStatePDU(buf)

	if unpacked.SiteNumber != orig.SiteNumber {
		t.Errorf("SiteNumber: got %d, want %d", unpacked.SiteNumber, orig.SiteNumber)
	}
	if unpacked.ApplicationNumber != orig.ApplicationNumber {
		t.Errorf("ApplicationNumber: got %d, want %d", unpacked.ApplicationNumber, orig.ApplicationNumber)
	}
	if unpacked.EntityNumber != orig.EntityNumber {
		t.Errorf("EntityNumber: got %d, want %d", unpacked.EntityNumber, orig.EntityNumber)
	}

	if !floatApproxEq(unpacked.Latitude, 33.7512, 0.01) {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, 33.7512)
	}
	if !floatApproxEq(unpacked.Longitude, -117.8567, 0.01) {
		t.Errorf("Longitude: got %f, want %f", unpacked.Longitude, -117.8567)
	}
	if !floatApproxEq(unpacked.Altitude, 10000.0, 1) {
		t.Errorf("Altitude: got %f, want 10000.0", unpacked.Altitude)
	}

	if !floatApproxEq(unpacked.VelocityX, 250.0, 1.0) {
		t.Errorf("VelocityX: got %f, want %f", unpacked.VelocityX, 250.0)
	}

	if unpacked.EntityType.Kind != 1 {
		t.Errorf("EntityType.Kind: got %d, want %d", unpacked.EntityType.Kind, 1)
	}
	if unpacked.EntityType.Domain != 2 {
		t.Errorf("EntityType.Domain: got %d, want %d", unpacked.EntityType.Domain, 2)
	}
}

func TestDISConstants(t *testing.T) {
	if DISProtocolVersion != 7 {
		t.Errorf("DISProtocolVersion: got %d, want %d", DISProtocolVersion, 7)
	}

	if FamilyEntityManagement != 1 {
		t.Errorf("FamilyEntityManagement: got %d, want %d", FamilyEntityManagement, 1)
	}

	if TypeEntityState != 1 {
		t.Errorf("TypeEntityState: got %d, want %d", TypeEntityState, 1)
	}
}
