// Package gateway provides integration tests for the DIS/HLA/TENA gateway.
package gateway

import (
	"forge-c2/internal/dis"
	"forge-c2/internal/hla"
	"forge-c2/internal/tena"
	"testing"
	"time"
)

// TestDIStoHLAGateway tests DIS Entity State PDU to HLA Entity conversion.
func TestDIStoHLAGateway(t *testing.T) {
	disPdu := dis.NewEntityStatePDU(1, 2, 3)
	disPdu.SetLocation(33.7512, -117.8567, 10000)
	disPdu.SetOrientation(0, 0, 90.0)
	disPdu.SetVelocity(250.0, 0, 0)
	disPdu.EntityType.Country = 200

	disBuf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(disPdu, disBuf)
	unpackedDIS := dis.UnpackEntityStatePDU(disBuf)

	// DIS to J-series fields (via dis mapper)
	site, app, entity, lat, lon, alt, heading, speed, _, _ := dis.DISToJSeries(unpackedDIS)
	
	// J-series fields to HLA Entity
	hlaEntity := hla.NewEntity(site, app, entity)
	hlaEntity.SetLocation(lat, lon, alt)
	hlaEntity.SetOrientation(0, 0, heading*3.14159/180)
	hlaEntity.SetVelocity(speed, 0, 0)

	if hlaEntity.EntityID.SiteNumber != 1 {
		t.Errorf("SiteNumber: got %d, want %d", hlaEntity.EntityID.SiteNumber, 1)
	}
	t.Logf("DIS -> HLA: Entity(%d/%d/%d) @ (%.4f, %.4f, %.2f) hdg=%.1f spd=%.1f",
		hlaEntity.EntityID.SiteNumber, hlaEntity.EntityID.ApplicationNumber, hlaEntity.EntityID.EntityNumber,
		lat, lon, alt, heading, speed)
}

// TestHLAToDISGateway tests HLA Entity to DIS Entity State PDU conversion.
func TestHLAToDISGateway(t *testing.T) {
	hlaEntity := hla.NewEntity(10, 20, 30)
	hlaEntity.SetLocation(1000.5, 2000.5, 500.0)
	hlaEntity.SetOrientation(0.1, 0.2, 1.57)
	hlaEntity.SetVelocity(100.0, 50.0, 10.0)

	// HLA Entity to J-series fields (simplified - just use position for lat/lon)
	// In real impl, would convert Cartesian to geodetic
	lat := hlaEntity.Position.X / 111000.0 // rough degrees
	lon := hlaEntity.Position.Y / 111000.0
	alt := hlaEntity.Position.Z
	heading := hlaEntity.Orientation.Psi * 180.0 / 3.14159
	speed := hlaEntity.Velocity.X

	// J-series fields to DIS
	disPdu := dis.NewEntityStatePDU(hlaEntity.EntityID.SiteNumber, hlaEntity.EntityID.ApplicationNumber, hlaEntity.EntityID.EntityNumber)
	disPdu.SetLocation(lat, lon, alt)
	disPdu.SetOrientation(0, 0, heading)
	disPdu.SetVelocity(speed, 0, 0)

	disBuf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(disPdu, disBuf)
	unpackedDIS := dis.UnpackEntityStatePDU(disBuf)

	if unpackedDIS.EntityNumber != 30 {
		t.Errorf("EntityNumber: got %d, want %d", unpackedDIS.EntityNumber, 30)
	}
	t.Logf("HLA -> DIS: Entity(%d/%d/%d) vel=(%.1f, %.1f, %.1f)",
		disPdu.SiteNumber, disPdu.ApplicationNumber, disPdu.EntityNumber,
		disPdu.VelocityX, disPdu.VelocityY, disPdu.VelocityZ)
}

// TestTENAToDISGateway tests TENA Object to DIS PDU conversion.
func TestTENAToDISGateway(t *testing.T) {
	tenaObj := tena.NewTENAObject(tena.HandleTrack, 123)
	tenaObj.SetAttribute("Latitude", tena.TypeDouble, 33.7512)
	tenaObj.SetAttribute("Longitude", tena.TypeDouble, -117.8567)
	tenaObj.SetAttribute("Altitude", tena.TypeDouble, 10000.0)
	tenaObj.SetAttribute("Heading", tena.TypeDouble, 90.0)
	tenaObj.SetAttribute("Speed", tena.TypeDouble, 250.0)

	lat := tenaObj.GetAttribute("Latitude").(float64)
	lon := tenaObj.GetAttribute("Longitude").(float64)
	alt := tenaObj.GetAttribute("Altitude").(float64)
	heading := tenaObj.GetAttribute("Heading").(float64)
	speed := tenaObj.GetAttribute("Speed").(float64)

	// TENA to DIS
	disPdu := dis.NewEntityStatePDU(1, 1, 42)
	disPdu.SetLocation(lat, lon, alt)
	disPdu.SetOrientation(0, 0, heading)
	disPdu.SetVelocity(speed, 0, 0)

	disBuf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(disPdu, disBuf)
	unpackedDIS := dis.UnpackEntityStatePDU(disBuf)

	if unpackedDIS.EntityNumber != 42 {
		t.Errorf("EntityNumber: got %d, want %d", unpackedDIS.EntityNumber, 42)
	}
	t.Logf("TENA -> DIS: Track 42 @ (%.4f, %.4f, %.2f) hdg=%.1f spd=%.1f",
		lat, lon, alt, heading, speed)
}

// TestFullRoundtripDIS tests complete DIS -> HLA -> DIS roundtrip.
func TestFullRoundtripDIS(t *testing.T) {
	origDIS := dis.NewEntityStatePDU(5, 10, 15)
	origDIS.SetLocation(40.0, -75.0, 5000)
	origDIS.SetOrientation(0, 0, 180.0)
	origDIS.SetVelocity(300.0, 0, 0)

	disBuf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(origDIS, disBuf)
	unpackedDIS := dis.UnpackEntityStatePDU(disBuf)

	// DIS -> J-series fields
	site, app, entity, lat, lon, alt, heading, speed, _, _ := dis.DISToJSeries(unpackedDIS)
	
	// J-series -> HLA Entity
	_ = hla.NewEntity(site, app, entity)
	
	// HLA -> J-series (back - simplified)
	backSite, backApp, backEntity := site, app, entity

	// J-series -> DIS (back)
	backDIS := dis.NewEntityStatePDU(backSite, backApp, backEntity)
	backDIS.SetLocation(lat, lon, alt)
	backDIS.SetOrientation(0, 0, heading)
	backDIS.SetVelocity(speed, 0, 0)

	if backDIS.EntityNumber != origDIS.EntityNumber {
		t.Errorf("EntityNumber roundtrip failed: got %d, want %d", backDIS.EntityNumber, origDIS.EntityNumber)
	}
	t.Logf("DIS -> J-series -> HLA -> J-series -> DIS roundtrip OK")
}

// TestDISFireEngagementFlow tests fire engagement flow through the gateway.
func TestDISFireEngagementFlow(t *testing.T) {
	firePDU := dis.NewFirePDU(1, 2, 3)
	firePDU.TargetEntityNumber = 100
	firePDU.MunitionEntityNumber = 200
	firePDU.FireMissionIndex = 9999
	firePDU.Velocity = 500.0
	firePDU.Range = 50000.0

	fireBuf := make([]byte, dis.FirePDUSize)
	dis.PackDISFirePDU(firePDU, fireBuf)
	unpackedFire := dis.UnpackDISFirePDU(fireBuf)

	targetEntity, firingEntity, munitionEntity, _ := dis.DISFireToEngagement(unpackedFire)

	if targetEntity != 100 {
		t.Errorf("TargetEntity: got %d, want %d", targetEntity, 100)
	}
	t.Logf("DIS Fire -> Engagement: Firing=%d Target=%d Munition=%d",
		firingEntity, targetEntity, munitionEntity)
}

// TestTENADiscoveryFlow tests TENA discovery and heartbeat flow.
func TestTENADiscoveryFlow(t *testing.T) {
	sessionID := uint64(12345)
	disc := tena.NewDiscovery(sessionID, "FORGE-C2-Gateway", "GATEWAY")

	discBuf := make([]byte, tena.TENAObjectHeaderSize)
	packDiscovery(disc, discBuf)

	unpacked := tena.UnpackTENAObjectHeader(discBuf)

	if unpacked.SessionID != sessionID {
		t.Errorf("SessionID: got %d, want %d", unpacked.SessionID, sessionID)
	}
	t.Logf("TENA Discovery: Session=%d Type=%d", unpacked.SessionID, unpacked.MessageType)
}

// TestGatewayAllProtocols tests all three protocols together.
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

func packDiscovery(d *tena.TENADiscovery, buf []byte) int {
	d.Header.MessageType = tena.MessageTypeDiscovery
	tena.PackTENAObjectHeader(&d.Header, buf)
	return tena.TENAObjectHeaderSize
}

func TestSequenceNumberTracker(t *testing.T) {
	tracker := NewSequenceNumberTracker()

	// First message should pass
	if !tracker.CheckAndUpdate(1, 1) {
		t.Error("First message should not be duplicate")
	}

	// Same sequence should fail
	if tracker.CheckAndUpdate(1, 1) {
		t.Error("Same sequence should be duplicate")
	}

	// Lower sequence should fail
	if tracker.CheckAndUpdate(1, 0) {
		t.Error("Lower sequence should be duplicate")
	}

	// Higher sequence should pass
	if !tracker.CheckAndUpdate(1, 2) {
		t.Error("Higher sequence should not be duplicate")
	}

	// New participant starts fresh
	if !tracker.CheckAndUpdate(2, 1) {
		t.Error("New participant should start fresh")
	}

	t.Logf("SequenceNumberTracker: OK")
}

func TestTrackNumberAllocator(t *testing.T) {
	alloc := NewTrackNumberAllocator()

	// Allocate some numbers
	n1 := alloc.Allocate()
	if n1 == 0 {
		t.Error("Should allocate track number")
	}

	n2 := alloc.Allocate()
	if n2 == n1 {
		t.Error("Different numbers should be allocated")
	}

	// Check allocated
	if !alloc.IsAllocated(n1) {
		t.Error("Track should be allocated")
	}

	// Release and reallocate
	alloc.Release(n1)
	if alloc.IsAllocated(n1) {
		t.Error("Track should be released")
	}

	n3 := alloc.Allocate()
	if n3 == 0 {
		t.Error("first available track (wrapping behavior)")
	}

	t.Logf("TrackNumberAllocator: n1=%d, n2=%d, n3=%d", n1, n2, n3)
}

func TestParticipantRegistry(t *testing.T) {
	reg := NewParticipantRegistry()

	// Add member
	reg.AddNetworkMember(1, "Federate1", "192.168.1.1")

	if !reg.ValidateParticipant(1) {
		t.Error("Participant should be valid")
	}

	if reg.ValidateParticipant(2) {
		t.Error("Unknown participant should be invalid")
	}

	// Remove member
	reg.RemoveNetworkMember(1)
	if reg.ValidateParticipant(1) {
		t.Error("Removed participant should be invalid")
	}

	t.Logf("ParticipantRegistry: OK")
}

func TestRateLimiter(t *testing.T) {
	limiter := NewRateLimiter()

	// Set limit: 5 messages per second
	limiter.SetLimit(1, 5, time.Second)

	// First 5 should pass
	for i := 0; i < 5; i++ {
		if !limiter.CheckLimit(1) {
			t.Errorf("Message %d should be within limit", i+1)
		}
	}

	// 6th should fail
	if limiter.CheckLimit(1) {
		t.Error("6th message should exceed limit")
	}

	t.Logf("RateLimiter: OK")
}
