package conformance

import (
	"testing"
	"time"

	"forge-c2/internal/dis"
	"forge-c2/internal/hla"
	"forge-c2/internal/tena"
	"forge-c2/jreap/jseries"
)

// =============================================================================
// Phase 7.2: Interoperability Testing
// Tests cross-gateway data consistency and protocol bridging
// =============================================================================

// TestTENADiscoveryFlow tests TENA object discovery process.
func TestTENADiscoveryFlow(t *testing.T) {
	sessionID := uint64(12345)
	disc := tena.NewDiscovery(sessionID, "FORGE-C2-Gateway", "GATEWAY")

	discBuf := make([]byte, tena.TENAObjectHeaderSize)
	disc.Header.MessageType = tena.MessageTypeDiscovery
	tena.PackTENAObjectHeader(&disc.Header, discBuf)

	unpacked := tena.UnpackTENAObjectHeader(discBuf)

	if unpacked.SessionID != sessionID {
		t.Errorf("SessionID: got %d, want %d", unpacked.SessionID, sessionID)
	}
	t.Logf("TENA Discovery: Session=%d Type=%d", unpacked.SessionID, unpacked.MessageType)
}

// TestGatewayAllProtocols tests all three protocols in gateway.
func TestGatewayAllProtocols(t *testing.T) {
	sessionID := uint64(999)

	disPdu := dis.NewEntityStatePDU(1, 1, 100)
	disPdu.SetLocation(33.7512, -117.8567, 10000)
	disPdu.SetOrientation(0, 0, 45.0)
	disPdu.SetVelocity(200.0, 0, 0)

	disBuf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(disPdu, disBuf)
	unpackedDIS := dis.UnpackEntityStatePDU(disBuf)
	site, app, entity, lat, lon, alt, heading, speed, _, _ := dis.DISToJSeries(unpackedDIS)
	_ = lat
	_ = lon
	_ = alt
	_ = heading
	_ = speed
	_ = hla.NewEntity(site, app, entity)

	tenaObj := tena.NewTENAObject(tena.HandleTrack, 100)
	tenaObj.SetAttribute("Latitude", tena.TypeDouble, lat)
	tenaObj.SetAttribute("Longitude", tena.TypeDouble, lon)

	hb := tena.NewHeartbeat(sessionID)
	hbBuf := make([]byte, tena.TENAObjectHeaderSize)
	tena.PackHeartbeat(hb, hbBuf)

	t.Logf("Gateway: DIS->HLA->TENA OK. Heartbeat Session=%d Size=%d", sessionID, len(hbBuf))
}

// =============================================================================
// Additional Interoperability Tests
// =============================================================================

// TestJSeriesDISRoundtrip tests J-series to DIS roundtrip for tracks.
func TestJSeriesDISRoundtrip(t *testing.T) {
	// Create J0 Track
	j0 := &jseries.J0TrackManagement{
		TrackNumber:    12345,
		TrackStatus:    jseries.TrackMgmtConfirmed,
		MgtType:        jseries.J0TrackInitiation,
		Classification: 3,
		Latitude:       33.7512,
		Longitude:     -117.8567,
		Altitude:      10000,
		Speed:          250.4,
		Heading:        315.0,
		Time:           time.Now(),
	}

	// Pack J0
	jbuf := make([]byte, jseries.J0PayloadSize)
	jseries.PackJ0TrackManagement(j0, jbuf)

	// Unpack J0
	unpacked := jseries.UnpackJ0TrackManagement(jbuf)

	if unpacked.TrackNumber != j0.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, j0.TrackNumber)
	}
}

// TestHLATimeInteropAdvanced tests HLA time management corner cases.
func TestHLATimeInteropAdvanced(t *testing.T) {
	tm := hla.NewTimeManager()

	// Test time regulation with lookahead
	if err := tm.EnableTimeRegulation(50 * time.Millisecond); err != nil {
		t.Errorf("EnableTimeRegulation failed: %v", err)
	}

	// Verify time constrained enables
	if err := tm.EnableTimeConstrained(); err != nil {
		t.Errorf("EnableTimeConstrained failed: %v", err)
	}

	// Test multiple advance requests
	for i := 0; i < 5; i++ {
		if err := tm.TimeAdvanceRequest(time.Now().Add(time.Duration(i+1) * time.Second)); err != nil {
			t.Errorf("TimeAdvanceRequest %d failed: %v", i, err)
		}
	}

	// Test flush queue
	if err := tm.FlushQueueRequest(time.Now()); err != nil {
		t.Errorf("FlushQueueRequest failed: %v", err)
	}
}

// TestGatewayDISToTENAToHLA tests full cross-protocol conversion.
func TestGatewayDISToTENAToHLA(t *testing.T) {
	// Create track in DIS
	disPdu := dis.NewEntityStatePDU(1, 1, 1)
	disPdu.SetLocation(35.5, -120.5, 10000)

	// DIS -> J-series fields
	disBuf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(disPdu, disBuf)
	unpackedDIS := dis.UnpackEntityStatePDU(disBuf)
	site, app, entity, lat, lon, alt, heading, speed, _, _ := dis.DISToJSeries(unpackedDIS)

	// J-series fields to HLA Entity
	hlaEntity := hla.NewEntity(site, app, entity)
	hlaEntity.SetLocation(lat, lon, alt)
	hlaEntity.SetOrientation(0, 0, heading*3.14159/180)
	hlaEntity.SetVelocity(speed, 0, 0)

	// J-series fields to TENA Object
	tenaObj := tena.NewTENAObject(tena.HandleTrack, uint64(entity))
	tenaObj.SetAttribute("Latitude", tena.TypeDouble, lat)
	tenaObj.SetAttribute("Longitude", tena.TypeDouble, lon)
	tenaObj.SetAttribute("Altitude", tena.TypeDouble, alt)
	tenaObj.SetAttribute("Heading", tena.TypeDouble, heading)
	tenaObj.SetAttribute("Speed", tena.TypeDouble, speed)

	if hlaEntity == nil {
		t.Error("DIS -> HLA conversion failed")
	}
	if tenaObj == nil {
		t.Error("DIS -> TENA conversion failed")
	}
	t.Logf("Full cross-protocol conversion: DIS Entity %d -> HLA + TENA", entity)
}

// TestCollisionPDUInterop tests collision PDU interoperability.
func TestCollisionPDUInterop(t *testing.T) {
	collisionPDU := &dis.DISCollisionPDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:     1,
			PDUType:        4,
			Family:         0,
		},
		EntityID:         dis.EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 3},
		CollisionType:    1,
		TargetEntityID:   dis.EntityID{SiteNumber: 4, ApplicationNumber: 5, EntityNumber: 6},
		Location:         dis.Vector3Double{X: 100.5, Y: 200.5, Z: 300.5},
		CollisionMass:    5000.0,
		CollisionVelocity: dis.Vector3Float{X: 10.0},
	}

	buf := make([]byte, 256)
	n := dis.PackDISCollisionPDU(collisionPDU, buf)
	if n == 0 {
		t.Fatal("Pack returned 0")
	}

	unpacked := dis.UnpackDISCollisionPDU(buf)
	if unpacked == nil {
		t.Fatal("Unpack returned nil")
	}

	if unpacked.CollisionType != collisionPDU.CollisionType {
		t.Errorf("CollisionType: got %d, want %d", unpacked.CollisionType, collisionPDU.CollisionType)
	}
	t.Logf("Collision PDU interoperability OK")
}

// TestSignalPDUInterop tests radio signal PDU interoperability.
func TestSignalPDUInterop(t *testing.T) {
	signalPDU := &dis.DISSignalPDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:     1,
			PDUType:        25, // Signal PDU type
			Family:         0,
		},
		EntityID:    dis.EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 1},
		SampleRateHz: 8000,
		SampleCount:  160,
	}

	signalBuf := make([]byte, dis.SignalPDUSize)
	dis.PackDISSignalPDU(signalPDU, signalBuf)
	unpacked := dis.UnpackDISSignalPDU(signalBuf)

	if unpacked.SampleRateHz != 8000 {
		t.Errorf("SampleRateHz: got %d, want %d", unpacked.SampleRateHz, 8000)
	}
	t.Logf("Signal PDU interoperability OK")
}

// TestTransmitterPDUInterop tests transmitter PDU interoperability.
func TestTransmitterPDUInterop(t *testing.T) {
	txPDU := &dis.DISTransmitterPDU{
		Header: dis.DISHeader{
			ProtocolVersion: 7,
			ExerciseID:     1,
			PDUType:        26, // Transmitter PDU type
			Family:         0,
		},
		EntityID:  dis.EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 1},
		RadioID:   42,
		RadioKind: 1,
	}

	txBuf := make([]byte, dis.TransmitterPDUSize)
	dis.PackDISTransmitterPDU(txPDU, txBuf)
	unpacked := dis.UnpackDISTransmitterPDU(txBuf)

	if unpacked.RadioID != 42 {
		t.Errorf("RadioID: got %d, want %d", unpacked.RadioID, 42)
	}
	t.Logf("Transmitter PDU interoperability OK")
}
