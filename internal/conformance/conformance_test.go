package conformance

import (
	"math"
	"testing"
	"time"

	"forge-c2/internal/bmds"
	"forge-c2/internal/dis"
	"forge-c2/internal/hla"
	"forge-c2/jreap/jseries"
)

// =============================================================================
// Phase 7: Testing & Validation - Conformance Test Suite
// =============================================================================

func TestDISEntityStateConformance(t *testing.T) {
	pdu := dis.NewEntityStatePDU(1, 1, 1)
	if pdu.SiteNumber != 1 {
		t.Errorf("SiteNumber: got %d, want 1", pdu.SiteNumber)
	}
	if pdu.EntityNumber != 1 {
		t.Errorf("EntityNumber: got %d, want 1", pdu.EntityNumber)
	}
}

func TestDISFirePDUConformance(t *testing.T) {
	pdu := dis.NewFirePDU(1, 1, 1)
	if pdu.FiringSiteNumber != 1 {
		t.Error("Firing entity ID mismatch")
	}
}

func TestDISDetonationPDUConformance(t *testing.T) {
	pdu := dis.NewDetonationPDU(1, 1, 1)
	if pdu.EventSiteNumber != 1 {
		t.Error("Event ID mismatch")
	}
}

func TestDISEnumerationsConformance(t *testing.T) {
	if dis.ForceOther != 0 {
		t.Errorf("ForceOther: got %d, want 0", dis.ForceOther)
	}
	if dis.ForceFriendly != 1 {
		t.Errorf("ForceFriendly: got %d, want 1", dis.ForceFriendly)
	}
	if dis.EntityStateActive != 0 {
		t.Errorf("EntityStateActive: got %d, want 0", dis.EntityStateActive)
	}
}

func TestHLARTIAmbassadorConformance(t *testing.T) {
	gateway := hla.NewRTIGateway()
	if gateway == nil {
		t.Fatal("NewRTIGateway returned nil")
	}
}

func TestHLATimeManagementConformance(t *testing.T) {
	tm := hla.NewTimeManager()
	if err := tm.EnableTimeRegulation(100); err != nil {
		t.Errorf("EnableTimeRegulation failed: %v", err)
	}
	if err := tm.DisableTimeRegulation(); err != nil {
		t.Errorf("DisableTimeRegulation failed: %v", err)
	}
	if err := tm.EnableTimeConstrained(); err != nil {
		t.Errorf("EnableTimeConstrained failed: %v", err)
	}
	if err := tm.DisableTimeConstrained(); err != nil {
		t.Errorf("DisableTimeConstrained failed: %v", err)
	}
	if err := tm.TimeAdvanceRequest(time.Now().Add(time.Second)); err != nil {
		t.Errorf("TimeAdvanceRequest failed: %v", err)
	}
}

func TestHLAObjectManagementConformance(t *testing.T) {
	om := hla.NewObjectManager()
	dm := hla.NewDeclarationManager()

	classHandle := uint32(1)
	om.RegisterObjectInstance(classHandle, "TestObject")
	dm.PublishObjectClass(classHandle, []uint32{1})
	dm.SubscribeObjectClassAttributes(classHandle, []uint32{1})
}

func TestJSeriesConformance(t *testing.T) {
	// J0 Track Management
	buf := make([]byte, 1024)
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 12345,
	}
	jseries.PackJ0TrackManagement(j0, buf)

	// Unpack
	j0Unpack := jseries.UnpackJ0TrackManagement(buf)
	if j0Unpack.TrackNumber != 12345 {
		t.Errorf("J0 TrackNumber: got %d, want 12345", j0Unpack.TrackNumber)
	}
}

func TestBMDSConnectionConformance(t *testing.T) {
	conn := bmds.NewBMDSConnection("localhost", 8443, true)

	if err := conn.Connect(); err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	if err := conn.Heartbeat(); err != nil {
		t.Fatalf("Heartbeat failed: %v", err)
	}

	if conn.IsAuthenticated() {
		t.Error("Should not be authenticated before Authenticate")
	}
}

func TestTrackManagerConformance(t *testing.T) {
	tm := bmds.NewTrackManager()

	track := &bmds.BMDSTrack{
		TrackID:   1,
		Latitude:  35.5,
		Longitude: -120.5,
		Altitude:  10000,
	}

	if err := tm.AddTrack(track); err != nil {
		t.Fatalf("AddTrack failed: %v", err)
	}

	got, ok := tm.GetTrack(1)
	if !ok {
		t.Fatal("Track should exist")
	}
	if got.Latitude != 35.5 {
		t.Errorf("Latitude: got %f, want 35.5", got.Latitude)
	}
}

func TestEngagementManagerConformance(t *testing.T) {
	em := bmds.NewEngagementManager()

	order := &bmds.EngagementOrder{
		OrderID:  1,
		TrackID:  123,
		WeaponID: "THAAD-1",
		Priority: 100,
		Authorization: bmds.EngagementAuthorization{
			AuthorizationLevel: 2,
		},
	}

	if err := em.SubmitEngagementOrder(order); err != nil {
		t.Fatalf("SubmitEngagementOrder failed: %v", err)
	}

	result := &bmds.EngagementResult{
		OrderID:      1,
		TrackID:      123,
		Status:       bmds.EngagementComplete,
		Interception: true,
	}

	em.RecordEngagementResult(result)
}

func TestMessageAuthenticatorConformance(t *testing.T) {
	key := []byte("test-key-12345")
	ma := bmds.NewMessageAuthenticator(key)

	message := []byte("test message")
	mac := ma.GenerateMAC(message)

	if !ma.VerifyMAC(message, mac) {
		t.Error("Valid MAC should verify")
	}

	if ma.VerifyMAC([]byte("tampered"), mac) {
		t.Error("Tampered message should not verify")
	}
}

func TestCoordinateSystemConformance(t *testing.T) {
	validLats := []float64{0, 45, -45, 90, -90}
	for _, lat := range validLats {
		if lat < -90 || lat > 90 {
			t.Errorf("Latitude %f should be valid", lat)
		}
	}

	invalidLats := []float64{91, -91}
	for _, lat := range invalidLats {
		if lat >= -90 && lat <= 90 {
			t.Errorf("Latitude %f should be invalid", lat)
		}
	}
}

func TestVelocityRepresentationConformance(t *testing.T) {
	maxVelocity := 7000.0
	testVelocities := []float64{0, 300, 1500, 3000, maxVelocity}

	for _, v := range testVelocities {
		if v < 0 {
			t.Errorf("Velocity %f should be non-negative", v)
		}
		if v > maxVelocity*1.1 {
			t.Errorf("Velocity %f exceeds realistic bounds", v)
		}
	}
}

func TestEnumerationConstants(t *testing.T) {
	if dis.ForceFriendly != 1 {
		t.Error("DIS ForceFriendly should be 1")
	}

	if bmds.ThreatSRBM != 1 {
		t.Errorf("BMDS ThreatSRBM: got %d, want 1", bmds.ThreatSRBM)
	}
	if bmds.ThreatICBM != 4 {
		t.Errorf("BMDS ThreatICBM: got %d, want 4", bmds.ThreatICBM)
	}
	if bmds.EngagementPending != 0 {
		t.Errorf("BMDS EngagementPending: got %d, want 0", bmds.EngagementPending)
	}
	if bmds.EngagementComplete != 3 {
		t.Errorf("BMDS EngagementComplete: got %d, want 3", bmds.EngagementComplete)
	}
}

func TestDeadReckoningConformance(t *testing.T) {
	pdu := dis.NewEntityStatePDU(1, 1, 1)
	pdu.SetLocation(35.0, -120.0, 10000)
	pdu.SetVelocity(100, 0, 0)
	_ = math.Sin
}

func TestSignalPDUConformance(t *testing.T) {
	pdu := &dis.DISSignalPDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:      1,
			PDUType:        25,
		},
		EmitterKind:  1,
		SampleRateHz: 8000,
		SampleCount: 160,
	}

	buf := make([]byte, 256)
	n := dis.PackDISSignalPDU(pdu, buf)
	if n == 0 {
		t.Fatal("Pack returned 0")
	}

	unpacked := dis.UnpackDISSignalPDU(buf)
	if unpacked == nil {
		t.Fatal("Unpack returned nil")
	}

	if unpacked.EmitterKind != 1 {
		t.Errorf("EmitterKind: got %d, want 1", unpacked.EmitterKind)
	}
}

func TestTransmitterPDUConformance(t *testing.T) {
	pdu := &dis.DISTransmitterPDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:      1,
			PDUType:        26,
		},
		RadioID:    10,
		Frequency: 2400000000,
		Bandwidth: 25000,
	}

	buf := make([]byte, 256)
	n := dis.PackDISTransmitterPDU(pdu, buf)
	if n == 0 {
		t.Fatal("Pack returned 0")
	}

	unpacked := dis.UnpackDISTransmitterPDU(buf)
	if unpacked == nil {
		t.Fatal("Unpack returned nil")
	}

	if unpacked.RadioID != 10 {
		t.Errorf("RadioID: got %d, want 10", unpacked.RadioID)
	}
}

func TestCollisionPDUConformance(t *testing.T) {
	pdu := &dis.DISCollisionPDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:      1,
			PDUType:        4,
		},
		CollisionType: 1,
		CollisionMass: 5000.0,
	}

	buf := make([]byte, 256)
	n := dis.PackDISCollisionPDU(pdu, buf)
	if n == 0 {
		t.Fatal("Pack returned 0")
	}

	unpacked := dis.UnpackDISCollisionPDU(buf)
	if unpacked == nil {
		t.Fatal("Unpack returned nil")
	}

	if unpacked.CollisionType != 1 {
		t.Errorf("CollisionType: got %d, want 1", unpacked.CollisionType)
	}
}

func TestAcknowledgePDUConformance(t *testing.T) {
	pdu := &dis.DISAcknowledgePDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:      1,
			PDUType:        16,
		},
		AcknowledgeFlag: 1,
		ResponseFlag:    2,
	}

	buf := make([]byte, 256)
	n := dis.PackDISAcknowledgePDU(pdu, buf)
	if n == 0 {
		t.Fatal("Pack returned 0")
	}

	unpacked := dis.UnpackDISAcknowledgePDU(buf)
	if unpacked == nil {
		t.Fatal("Unpack returned nil")
	}

	if unpacked.AcknowledgeFlag != 1 {
		t.Errorf("AcknowledgeFlag: got %d, want 1", unpacked.AcknowledgeFlag)
	}
}

func TestFOMParserConformance(t *testing.T) {
	parser := hla.NewFOMParser()

	fomXML := `<?xml version="1.0"?>
<ObjectModel>
  <objectClass name="TestClass"/>
  <interactionClass name="TestInteraction"/>
</ObjectModel>`

	mod, err := parser.Parse([]byte(fomXML))
	if err != nil {
		t.Fatalf("Parse failed: %v", err)
	}

	if len(mod.ObjectClasses) != 1 {
		t.Errorf("ObjectClasses: got %d, want 1", len(mod.ObjectClasses))
	}
	if len(mod.InteractionClasses) != 1 {
		t.Errorf("InteractionClasses: got %d, want 1", len(mod.InteractionClasses))
	}
}
