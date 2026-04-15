package internal

import (
	"testing"
	"time"

	"forge-c2/jreap"
	"forge-c2/mdpa"
)

// TestQualityFlagsRoundtrip verifies QualityFlags survive encode→decode.
func TestQualityFlagsRoundtrip(t *testing.T) {
	enc := jreap.NewEncoder("test-node", "test-app")
	dec := jreap.NewDecoder("test-node", "test-app")

	event := &SensorEvent{
		EventID:    "QE-001",
		Timestamp:  time.Now().UTC().Truncate(time.Millisecond),
		SensorID:   "SBIRS-GEO-2",
		SensorType: "OPIR",
		Latitude:   38.0,
		Longitude:  -77.0,
		Altitude:   35786000,
		Intensity:  0.92,
	}

	// Create metadata with specific quality flags
	meta := mdpa.NewMDPAMetadata("node1", "OPIR-INGEST", "corr-001", "SECRET//NOFORN")
	meta.SetQualityFlag(mdpa.QualityGood | mdpa.QualitySNRAdequate | mdpa.QualityCorrelated)

	encoded, err := enc.EncodeSensorEvent(event, meta)
	if err != nil {
		t.Fatalf("EncodeSensorEvent: %v", err)
	}

	decoded, err := dec.DecodeOPIR(encoded, meta)
	if err != nil {
		t.Fatalf("DecodeOPIR: %v", err)
	}

	if decoded.TrackNumber == 0 {
		t.Error("expected non-zero TrackNumber")
	}
	t.Logf("QualityFlags roundtrip: meta.QualityFlags=%08b, track=%d", meta.QualityFlags, decoded.TrackNumber)
}

// TestCorrelationIDRoundtrip verifies CorrelationID survives encode→decode.
func TestCorrelationIDRoundtrip(t *testing.T) {
	enc := jreap.NewEncoder("test-node", "test-app")
	dec := jreap.NewDecoder("test-node", "test-app")

	corrID := GenerateCorrelationID("SBIRS-GEO-1", 42, time.Now().UTC())

	track := &Track{
		TrackID:       "TRK-0042",
		TrackNumber:   42,
		Status:        "ACTIVE",
		Latitude:      33.75,
		Longitude:     -117.85,
		Altitude:      10000,
		Speed:         250,
		Heading:       180,
		ThreatLevel:   3,
		TrackSource:   "OPIR",
		ForceType:     "HOSTILE",
		LastUpdate:    time.Now().UTC().Truncate(time.Millisecond),
		QualityFlags:  0x1F, // All quality bits set
		CorrelationID: corrID,
	}

	meta := mdpa.NewMDPAMetadata("node1", "TRK-INIT", corrID, "UNCLASSIFIED")
	meta.SetQualityFlag(mdpa.QualityCorrelated | mdpa.QualityFused)

	encoded, err := enc.EncodeTrack(track, meta)
	if err != nil {
		t.Fatalf("EncodeTrack: %v", err)
	}

	decoded, err := dec.DecodeTrackUpdate(encoded, meta)
	if err != nil {
		t.Fatalf("DecodeTrackUpdate: %v", err)
	}

	if decoded.TrackNumber != 42 {
		t.Errorf("TrackNumber: got %d, want 42", decoded.TrackNumber)
	}
	t.Logf("CorrelationID roundtrip OK: meta.CorrelationID=%s", meta.CorrelationID)
}

// TestCorrelatorQualityFlags verifies the correlator sets quality flags correctly.
func TestCorrelatorQualityFlags(t *testing.T) {
	tc := NewTrackCorrelator()

	event := &SensorEvent{
		EventID:    "E1",
		Timestamp:  time.Now().UTC(),
		SensorID:   "RADAR-01",
		SensorType: "RADAR",
		Latitude:   33.0,
		Longitude:  -117.0,
		Altitude:   5000,
		Intensity:  0.8,
	}

	track, isNew := tc.ProcessEvent(event)
	if !isNew {
		t.Fatal("expected new track from first event")
	}

	if track.CorrelationID == "" {
		t.Error("expected CorrelationID to be set on new track")
	}
	if track.QualityFlags == 0 {
		t.Error("expected QualityFlags to be non-zero on new track")
	}
	t.Logf("New track: TrackID=%s QualityFlags=%08b CorrelationID=%s", track.TrackID, track.QualityFlags, track.CorrelationID)
}