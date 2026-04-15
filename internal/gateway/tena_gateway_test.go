package gateway

import (
	"testing"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

func TestTENAGatewayLifecycle(t *testing.T) {
	enc := jreap.NewEncoder("test", "test")
	meta := mdpa.NewMDPAMetadata("test", "test", "", "UNCLASSIFIED")

	config := DefaultTENAGatewayConfig()
	gw := NewTENAGateway(config, enc, meta)

	if err := gw.Start(); err != nil {
		t.Fatalf("Start: %v", err)
	}
	if !gw.IsRunning() {
		t.Error("expected running")
	}
	if err := gw.Stop(); err != nil {
		t.Fatalf("Stop: %v", err)
	}
	if gw.IsRunning() {
		t.Error("expected stopped")
	}
}

func TestTENAGatewayRegistration(t *testing.T) {
	enc := jreap.NewEncoder("test", "test")
	meta := mdpa.NewMDPAMetadata("test", "test", "", "UNCLASSIFIED")

	config := DefaultTENAGatewayConfig()
	gw := NewTENAGateway(config, enc, meta)

	if err := gw.Start(); err != nil {
		t.Fatalf("Start: %v", err)
	}
	defer gw.Stop()

	// Register TENA→DIS mapping
	if err := gw.RegisterTENAToDIS(1, 100); err != nil {
		t.Fatalf("RegisterTENAToDIS: %v", err)
	}

	// Register TENA→HLA mapping
	if err := gw.RegisterTENAToHLA(2, 200); err != nil {
		t.Fatalf("RegisterTENAToHLA: %v", err)
	}

	// Sync
	if err := gw.SyncTENAToDIS(1); err != nil {
		t.Fatalf("SyncTENAToDIS: %v", err)
	}
	if err := gw.SyncTENAToHLA(2, map[uint32][]byte{1: {0x01}}); err != nil {
		t.Fatalf("SyncTENAToHLA: %v", err)
	}
}

func TestTENATrackToJ0(t *testing.T) {
	j0 := TENATrackToJ0(42, 38.0, -77.0, 10000, 300, 270, 2)
	if j0.TrackNumber != 42 {
		t.Errorf("TrackNumber: got %d, want 42", j0.TrackNumber)
	}
	if j0.ForceType != 2 {
		t.Errorf("ForceType: got %d, want 2", j0.ForceType)
	}
}

func TestJ0ToTENAConversion(t *testing.T) {
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 100,
		ForceType:   1,
		Latitude:    33.75,
		Longitude:   -117.85,
		Altitude:    5000,
		Speed:       250,
		Heading:     180,
	}

	td := J0ToTENA(j0, 1)
	if td.SessionID != 1 {
		t.Errorf("SessionID: got %d, want 1", td.SessionID)
	}
	if td.TrackNum != 100 {
		t.Errorf("TrackNum: got %d, want 100", td.TrackNum)
	}
	if td.Lat != 33.75 {
		t.Errorf("Lat: got %f, want 33.75", td.Lat)
	}
}