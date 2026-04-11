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

func TestDetonationPDUNew(t *testing.T) {
	pdu := NewDetonationPDU(1, 2, 3)

	if pdu.EventSiteNumber != 1 {
		t.Errorf("EventSiteNumber: got %d, want %d", pdu.EventSiteNumber, 1)
	}
	if pdu.Header.PDUType != TypeDetonation {
		t.Errorf("PDUType: got %d, want %d", pdu.Header.PDUType, TypeDetonation)
	}
	if pdu.Header.Family != FamilyWarfare {
		t.Errorf("Family: got %d, want %d", pdu.Header.Family, FamilyWarfare)
	}
}

func TestDetonationPDURoundtrip(t *testing.T) {
	orig := NewDetonationPDU(1, 2, 3)
	orig.TargetSiteNumber = 10
	orig.TargetApplicationNumber = 11
	orig.TargetEntityNumber = 12
	orig.MunitionSiteNumber = 20
	orig.MunitionApplicationNumber = 21
	orig.MunitionEntityNumber = 22
	orig.FireMissionIndex = 12345
	orig.ExplosionType = 1 // Impact
	orig.Velocity = 500.0
	orig.Latitude = 33.7512
	orig.Longitude = -117.8567
	orig.Altitude = 10000
	orig.FusedTrackNumber = 999

	buf := make([]byte, DetonationPDUSize)
	PackDISDetonationPDU(orig, buf)
	unpacked := UnpackDISDetonationPDU(buf)

	if unpacked.TargetEntityNumber != orig.TargetEntityNumber {
		t.Errorf("TargetEntityNumber: got %d, want %d", unpacked.TargetEntityNumber, orig.TargetEntityNumber)
	}
	if unpacked.MunitionEntityNumber != orig.MunitionEntityNumber {
		t.Errorf("MunitionEntityNumber: got %d, want %d", unpacked.MunitionEntityNumber, orig.MunitionEntityNumber)
	}
	if unpacked.FireMissionIndex != orig.FireMissionIndex {
		t.Errorf("FireMissionIndex: got %d, want %d", unpacked.FireMissionIndex, orig.FireMissionIndex)
	}
	if !floatApproxEq(unpacked.Velocity, 500.0, 1.0) {
		t.Errorf("Velocity: got %f, want %f", unpacked.Velocity, 500.0)
	}
	if !floatApproxEq(unpacked.Latitude, 33.7512, 0.01) {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, 33.7512)
	}
}

func TestMapperDISToJSeries(t *testing.T) {
	pdu := NewEntityStatePDU(1, 2, 3)
	pdu.SetLocation(33.7512, -117.8567, 10000)
	pdu.SetOrientation(0, 0, 90.0) // Heading 90 degrees
	pdu.SetVelocity(250.0, 0, 0)
	pdu.EntityType.Country = 200

	site, app, entity, lat, _, _, heading, speed, _, _ := DISToJSeries(pdu)

	if site != 1 || app != 2 || entity != 3 {
		t.Errorf("Entity IDs: got %d/%d/%d, want 1/2/3", site, app, entity)
	}
	if !floatApproxEq(lat, 33.7512, 0.01) {
		t.Errorf("Latitude: got %f, want %f", lat, 33.7512)
	}
	if !floatApproxEq(heading, 90.0, 1.0) {
		t.Errorf("Heading: got %f, want %f", heading, 90.0)
	}
	if !floatApproxEq(speed, 250.0, 1.0) {
		t.Errorf("Speed: got %f, want %f", speed, 250.0)
	}
}

func TestMapperJSeriesToDIS(t *testing.T) {
	pdu := JSeriesToDIS(123, 33.7512, -117.8567, 10000, 90.0, 250.0, 2, 1, 2)

	if pdu.EntityNumber != 123 {
		t.Errorf("EntityNumber: got %d, want %d", pdu.EntityNumber, 123)
	}
	if !floatApproxEq(pdu.Latitude, 33.7512, 0.01) {
		t.Errorf("Latitude: got %f, want %f", pdu.Latitude, 33.7512)
	}
	if !floatApproxEq(pdu.VelocityX, 250.0, 1.0) {
		t.Errorf("VelocityX: got %f, want %f", pdu.VelocityX, 250.0)
	}
}

func TestVariableParameterPackUnpack(t *testing.T) {
	orig := &ArticulatedPartVP{
		ArticulatedPart: ArticulatedPart{
			ChangeIndicator: 1,
			PartAttachedTo: 2,
			ParameterType:  ArticulatedTypeAzimuth,
			ParameterValue1: 45.5,
			ParameterValue2: 90.0,
		},
	}

	buf := make([]byte, 20)
	n := PackVariableParameter(orig, buf)

	vp, _ := UnpackVariableParameter(buf)
	if vp == nil {
		t.Fatalf("Unpack returned nil")
	}

	unpacked, ok := vp.(*ArticulatedPartVP)
	if !ok {
		t.Fatalf("Wrong type: %T", vp)
	}
	if unpacked.ArticulatedPart.ChangeIndicator != orig.ArticulatedPart.ChangeIndicator {
		t.Errorf("ChangeIndicator: got %d, want %d", unpacked.ArticulatedPart.ChangeIndicator, orig.ArticulatedPart.ChangeIndicator)
	}
	if unpacked.ArticulatedPart.ParameterType != orig.ArticulatedPart.ParameterType {
		t.Errorf("ParameterType: got %d, want %d", unpacked.ArticulatedPart.ParameterType, orig.ArticulatedPart.ParameterType)
	}
	if n < 12 {
		t.Errorf("Pack size too small: %d", n)
	}
}

func TestAttachedPartPackUnpack(t *testing.T) {
	orig := &AttachedPartVP{
		AttachedPart: AttachedPart{
			ChangeIndicator: 1,
			PartAttachedTo: 0,
			PartType: EntityType{
				Kind:        1,
				Domain:      2,
				Country:     225,
				Category:    1,
				Subcategory: 1,
				Specific:    1,
				Extra1:      0,
			},
		},
	}

	buf := make([]byte, 20)
	n := PackVariableParameter(orig, buf)

	vp, _ := UnpackVariableParameter(buf)
	if vp == nil {
		t.Fatalf("Unpack returned nil")
	}

	unpacked, ok := vp.(*AttachedPartVP)
	if !ok {
		t.Fatalf("Wrong type: %T", vp)
	}
	if unpacked.AttachedPart.PartType.Kind != orig.AttachedPart.PartType.Kind {
		t.Errorf("Kind: got %d, want %d", unpacked.AttachedPart.PartType.Kind, orig.AttachedPart.PartType.Kind)
	}
	if n < 11 {
		t.Errorf("Pack size too small: %d", n)
	}
}
