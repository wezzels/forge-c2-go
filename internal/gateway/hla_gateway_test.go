package gateway

import (
	"testing"
	"time"

	"forge-c2/internal/hla"
	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

func TestHLAGatewayLifecycle(t *testing.T) {
	enc := jreap.NewEncoder("test", "test")
	meta := mdpa.NewMDPAMetadata("test", "test", "", "UNCLASSIFIED")

	config := DefaultHLAGatewayConfig()
	gw := NewHLAGateway(config, enc, meta)

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
	// Double stop ok
	if err := gw.Stop(); err != nil {
		t.Errorf("double stop: %v", err)
	}
}

func TestHLAGatewayPublishEntity(t *testing.T) {
	enc := jreap.NewEncoder("test", "test")
	meta := mdpa.NewMDPAMetadata("test", "test", "", "UNCLASSIFIED")

	config := DefaultHLAGatewayConfig()
	gw := NewHLAGateway(config, enc, meta)

	if err := gw.Start(); err != nil {
		t.Fatalf("Start: %v", err)
	}
	defer gw.Stop()

	entity := hla.NewEntity(1, 2, 42)
	entity.SetLocation(38.0, -77.0, 10000)
	entity.SetOrientation(0, 0, 1.57)
	entity.SetVelocity(300, 0, 0)

	handle, err := gw.PublishEntity(entity)
	if err != nil {
		t.Fatalf("PublishEntity: %v", err)
	}
	if handle == 0 {
		t.Error("expected non-zero handle")
	}

	// Remove
	if err := gw.RemoveEntity(handle); err != nil {
		t.Fatalf("RemoveEntity: %v", err)
	}
}

func TestHLAGatewayTimeManagement(t *testing.T) {
	enc := jreap.NewEncoder("test", "test")
	meta := mdpa.NewMDPAMetadata("test", "test", "", "UNCLASSIFIED")

	config := DefaultHLAGatewayConfig()
	gw := NewHLAGateway(config, enc, meta)

	if err := gw.Start(); err != nil {
		t.Fatalf("Start: %v", err)
	}
	defer gw.Stop()

	now := time.Now()
	if err := gw.AdvanceTime(now); err != nil {
		t.Fatalf("AdvanceTime: %v", err)
	}

	lt := gw.QueryLogicalTime()
	if lt.IsZero() {
		t.Error("expected non-zero logical time")
	}
}

func TestJ0ToHLAConversion(t *testing.T) {
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 100,
		ForceType:   2, // HOSTILE
		Latitude:    38.0,
		Longitude:   -77.0,
		Altitude:    10000,
		Heading:     270,
		Speed:       300,
	}

	entity := J0ToHLA(j0, 1, 1)
	if entity == nil {
		t.Fatal("J0ToHLA returned nil")
	}
	if entity.EntityID.EntityNumber != 100 {
		t.Errorf("EntityNumber: got %d, want 100", entity.EntityID.EntityNumber)
	}
	if entity.ForceID != hla.ForceOpposing {
		t.Errorf("ForceID: got %d, want %d", entity.ForceID, hla.ForceOpposing)
	}
	if entity.Marking != "TRK-0100" {
		t.Errorf("Marking: got %s", entity.Marking)
	}
}

func TestJ12ToHLAInteraction(t *testing.T) {
	j12 := &jseries.J12Alert{
		AlertType:   2,
		Severity:    5,
		TrackNumber: 42,
	}

	params := J12ToHLAInteraction(j12)
	if len(params) == 0 {
		t.Fatal("expected parameters")
	}
	if params[1][0] != 2 {
		t.Errorf("AlertType: got %d, want 2", params[1][0])
	}
	if params[2][0] != 5 {
		t.Errorf("Severity: got %d, want 5", params[2][0])
	}
}