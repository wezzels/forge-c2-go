package bmdsbridge

import (
	"context"
	"encoding/json"
	"testing"
	"time"
)

func TestNewBridge(t *testing.T) {
	b := NewBridge("/tmp/bin", nil)
	if b == nil {
		t.Fatal("NewBridge returned nil")
	}
	if b.binDir != "/tmp/bin" {
		t.Errorf("Expected binDir=/tmp/bin, got %s", b.binDir)
	}
}

func TestRegister(t *testing.T) {
	b := NewBridge("/tmp/bin", nil)
	b.Register("icbm", "icbm", []string{"-scenario", "minuteman-3"}, 60*time.Second)
	if !b.IsRegistered("icbm") {
		t.Error("icbm should be registered")
	}
	if b.IsRegistered("nonexistent") {
		t.Error("nonexistent should not be registered")
	}
}

func TestDefaultConfigs(t *testing.T) {
	configs := DefaultConfigs()
	if len(configs) < 20 {
		t.Errorf("Expected at least 20 default configs, got %d", len(configs))
	}
	required := []string{"icbm", "sbirs", "gmd", "wta", "hub"}
	for _, name := range required {
		if _, ok := configs[name]; !ok {
			t.Errorf("Missing required config: %s", name)
		}
	}
}

func TestExtractTracks_Threats(t *testing.T) {
	raw := map[string]interface{}{
		"threats": []interface{}{
			map[string]interface{}{
				"id":       "T-001",
				"name":     "Minuteman-III",
				"type":     "ICBM",
				"latitude": 35.0,
				"longitude": -120.0,
				"altitude": 400000.0,
				"speed":    7000.0,
				"heading":  45.0,
			},
		},
	}
	b := &Bridge{binDir: ""}
	tracks := b.extractTracks(raw, "icbm")
	if len(tracks) != 1 {
		t.Fatalf("Expected 1 track, got %d", len(tracks))
	}
	if tracks[0].TrackID != "T-001" {
		t.Errorf("Expected TrackID=T-001, got %s", tracks[0].TrackID)
	}
	if tracks[0].ForceType != "HOSTILE" {
		t.Errorf("Expected HOSTILE, got %s", tracks[0].ForceType)
	}
	if tracks[0].Latitude != 35.0 {
		t.Errorf("Expected latitude 35.0, got %f", tracks[0].Latitude)
	}
}

func TestExtractTracks_Sensors(t *testing.T) {
	raw := map[string]interface{}{
		"sensors": []interface{}{
			map[string]interface{}{
				"id":   "SBIRS-1",
				"name": "SBIRS GEO-1",
				"type": "IR",
				"latitude": 0.0,
				"longitude": 75.0,
			},
		},
	}
	b := &Bridge{binDir: ""}
	tracks := b.extractTracks(raw, "sbirs")
	if len(tracks) != 1 {
		t.Fatalf("Expected 1 track, got %d", len(tracks))
	}
	if tracks[0].ForceType != "FRIEND" {
		t.Errorf("Expected FRIEND sensor, got %s", tracks[0].ForceType)
	}
}

func TestExtractTracks_Interceptors(t *testing.T) {
	raw := map[string]interface{}{
		"interceptors": []interface{}{
			map[string]interface{}{
				"id":        "GBI-1",
				"name":      "Ground Based Interceptor",
				"type":      "GMD",
				"latitude":  63.9,
				"longitude": -145.6,
				"altitude":  0.0,
				"speed":     0.0,
			},
		},
	}
	b := &Bridge{binDir: ""}
	tracks := b.extractTracks(raw, "gmd")
	if len(tracks) != 1 {
		t.Fatalf("Expected 1 track, got %d", len(tracks))
	}
	if tracks[0].ForceType != "FRIEND" {
		t.Errorf("Expected FRIEND interceptor, got %s", tracks[0].ForceType)
	}
}

func TestFormatTrackAsJREAP(t *testing.T) {
	track := &SimTrack{
		TrackID:     "T-001",
		ForceType:   "HOSTILE",
		Latitude:    35.0,
		Longitude:   -120.0,
		Altitude:    400000.0,
		Speed:       7000.0,
		Heading:     45.0,
		ThreatLevel: 5,
		Source:       "icbm",
	}
	msg := FormatTrackAsJREAP(track)
	if msg == "" {
		t.Error("JREAP message should not be empty")
	}
}

func TestFormatTrackAsDIS(t *testing.T) {
	track := &SimTrack{
		TrackID:      "GBI-1",
		ForceType:    "FRIEND",
		Latitude:     63.9,
		Longitude:    -145.6,
		Altitude:     0.0,
		PlatformType: "interceptor",
	}
	msg := FormatTrackAsDIS(track)
	if msg == "" {
		t.Error("DIS message should not be empty")
	}
}

func TestParseSimTracksFromJSON(t *testing.T) {
	data := []byte(`{
		"scenario": "minuteman-3",
		"threats": [
			{"id": "T-001", "name": "ICBM", "type": "ICBM", "latitude": 35.0, "longitude": -120.0}
		],
		"sensors": [
			{"id": "SBIRS-1", "name": "SBIRS GEO-1", "type": "IR", "latitude": 0.0, "longitude": 75.0}
		]
	}`)
	
	tracks, err := ParseSimTracksFromJSON(data, "icbm")
	if err != nil {
		t.Fatalf("ParseSimTracksFromJSON error: %v", err)
	}
	if len(tracks) != 2 {
		t.Errorf("Expected 2 tracks, got %d", len(tracks))
	}
}

func TestSimResultJSON(t *testing.T) {
	result := &SimResult{
		Simulator: "icbm",
		Scenario:  "minuteman-3",
		Tracks: []SimTrack{
			{TrackID: "T-001", ForceType: "HOSTILE", Latitude: 35.0},
		},
	}
	data, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Fatalf("Marshal error: %v", err)
	}
	if len(data) == 0 {
		t.Error("Marshaled data should not be empty")
	}
}

func TestBridgeStatus(t *testing.T) {
	b := NewBridge("/tmp/bin", nil)
	b.Register("icbm", "icbm", []string{}, 60*time.Second)
	status := b.Status()
	if status.Running {
		t.Error("Bridge should not be running")
	}
	if len(status.Simulators) != 1 {
		t.Errorf("Expected 1 simulator, got %d", len(status.Simulators))
	}
}

func TestGetSimulatorNames(t *testing.T) {
	b := NewBridge("/tmp/bin", nil)
	b.Register("icbm", "icbm", []string{}, 60*time.Second)
	b.Register("sbirs", "sbirs", []string{}, 30*time.Second)
	names := b.GetSimulatorNames()
	if len(names) != 2 {
		t.Errorf("Expected 2 names, got %d", len(names))
	}
}

func TestRunSimulator_InvalidBinary(t *testing.T) {
	b := NewBridge("/nonexistent/path", nil)
	config := &SimConfig{
		Name:    "test",
		Binary:  "nonexistent",
		Args:    []string{"-json"},
		Timeout: 5 * time.Second,
	}
	_, err := b.RunSimulator(context.Background(), config)
	if err == nil {
		t.Error("Expected error for nonexistent binary")
	}
}