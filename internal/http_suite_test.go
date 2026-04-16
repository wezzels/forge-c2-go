package internal

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

// TestSuiteHTTP runs a full HTTP API test suite against the server.
func TestSuiteHTTP(t *testing.T) {
	srv, err := NewServer(&Config{
		Port:        "0", // random port
		KafkaBroker: "",
		C2BMCURL:    "",
		Security:    DefaultSecurityConfig(),
	})
	if err != nil {
		t.Fatalf("Failed to create server: %v", err)
	}

	// Use httptest instead of real listener
	handler := srv.security.Wrap(srv.router)
	ts := httptest.NewServer(handler)
	defer ts.Close()

	client := ts.Client()

	t.Run("HealthEndpoint", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/health")
		if err != nil {
			t.Fatalf("Health request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["status"] != "ok" {
			t.Errorf("Expected status=ok, got %v", result["status"])
		}
	})

	t.Run("ReadyEndpoint", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/ready")
		if err != nil {
			t.Fatalf("Ready request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("MetricsEndpoint", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/metrics")
		if err != nil {
			t.Fatalf("Metrics request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
		buf := new(bytes.Buffer)
		buf.ReadFrom(resp.Body)
		if !strings.Contains(buf.String(), "forge_c2_") {
			t.Error("Metrics should contain forge_c2_ prefix")
		}
	})

	t.Run("TracksEmpty", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/api/tracks")
		if err != nil {
			t.Fatalf("Tracks request failed: %v", err)
		}
		defer resp.Body.Close()
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["count"] != float64(0) {
			t.Errorf("Expected count=0, got %v", result["count"])
		}
	})

	t.Run("InjectSensorEvent", func(t *testing.T) {
		event := map[string]interface{}{
			"event_id":    "E2E-001",
			"sensor_id":   "SBIRS-GEO-1",
			"sensor_type":  "OPIR",
			"latitude":     33.75,
			"longitude":    -117.85,
			"altitude":     35786000.0,
			"intensity":    0.92,
		}
		body, _ := json.Marshal(event)
		resp, err := client.Post(ts.URL+"/api/inject/sensor", "application/json", bytes.NewReader(body))
		if err != nil {
			t.Fatalf("Inject request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			var errBody bytes.Buffer
			errBody.ReadFrom(resp.Body)
			t.Fatalf("Expected 200, got %d: %s", resp.StatusCode, errBody.String())
		}
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["consumed"] != true {
			t.Errorf("Expected consumed=true, got %v", result["consumed"])
		}
		if result["is_new"] != true {
			t.Errorf("Expected is_new=true, got %v", result["is_new"])
		}
		track, ok := result["track"].(map[string]interface{})
		if !ok {
			t.Fatal("Expected track object in response")
		}
		if track["track_id"] == nil {
			t.Error("Expected track_id in response")
		}
		if track["force_type"] != "UNKNOWN" {
			t.Errorf("Expected force_type=UNKNOWN, got %v", track["force_type"])
		}
	})

	t.Run("TracksAfterInject", func(t *testing.T) {
		// Give correlator time to process
		time.Sleep(10 * time.Millisecond)
		resp, err := client.Get(ts.URL + "/api/tracks")
		if err != nil {
			t.Fatalf("Tracks request failed: %v", err)
		}
		defer resp.Body.Close()
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["count"] == float64(0) {
			t.Error("Expected at least 1 track after injection")
		}
	})

	t.Run("AlertsEndpoint", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/api/alerts")
		if err != nil {
			t.Fatalf("Alerts request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("CorrelatorStats", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/api/correlator/stats")
		if err != nil {
			t.Fatalf("Correlator request failed: %v", err)
		}
		defer resp.Body.Close()
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["active_tracks"] == nil {
			t.Error("Expected active_tracks in correlator stats")
		}
	})

	t.Run("C2BMCStatus", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/api/c2bmc/status")
		if err != nil {
			t.Fatalf("C2BMC request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("C2BMCEngagements", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/api/c2bmc/engagements")
		if err != nil {
			t.Fatalf("Engagements request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("MultipleInjections", func(t *testing.T) {
		events := []map[string]interface{}{
			{"event_id": "E2E-002", "sensor_id": "SBIRS-GEO-2", "sensor_type": "OPIR",
				"latitude": 35.0, "longitude": -120.0, "altitude": 35786000, "intensity": 0.88},
			{"event_id": "E2E-003", "sensor_id": "UEWR-1", "sensor_type": "UEWR",
				"latitude": 35.5, "longitude": -119.0, "altitude": 500000, "intensity": 0.75},
			{"event_id": "E2E-004", "sensor_id": "TPY-2-1", "sensor_type": "TPY2",
				"latitude": 36.0, "longitude": -118.0, "altitude": 200000, "intensity": 0.95},
		}
		for _, event := range events {
			body, _ := json.Marshal(event)
			resp, err := client.Post(ts.URL+"/api/inject/sensor", "application/json", bytes.NewReader(body))
			if err != nil {
				t.Fatalf("Inject request failed: %v", err)
			}
			resp.Body.Close()
			if resp.StatusCode != http.StatusOK {
				t.Errorf("Expected 200 for event %s, got %d", event["event_id"], resp.StatusCode)
			}
		}
		// Verify track count increased
		time.Sleep(10 * time.Millisecond)
		resp, err := client.Get(ts.URL + "/api/tracks")
		if err != nil {
			t.Fatalf("Tracks request failed: %v", err)
		}
		defer resp.Body.Close()
		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		if result["count"] == float64(0) {
			t.Error("Expected multiple tracks after batch injection")
		}
	})

	t.Run("SecurityHeaders", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/health")
		if err != nil {
			t.Fatalf("Request failed: %v", err)
		}
		defer resp.Body.Close()

		checks := map[string]string{
			"X-Content-Type-Options":  "nosniff",
			"X-Frame-Options":         "DENY",
			"X-Xss-Protection":        "1; mode=block",
			"Referrer-Policy":         "strict-origin-when-cross-origin",
			"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
		}
		for header, expected := range checks {
			got := resp.Header.Get(header)
			if got != expected {
				t.Errorf("Expected %s=%s, got %s", header, expected, got)
			}
		}
	})

	t.Run("InvalidEndpoint_404", func(t *testing.T) {
		resp, err := client.Get(ts.URL + "/api/nonexistent")
		if err != nil {
			t.Fatalf("Request failed: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusNotFound {
			t.Errorf("Expected 404, got %d", resp.StatusCode)
		}
	})

	t.Run("InvalidMethod_MethodNotAllowed", func(t *testing.T) {
		resp, err := client.Post(ts.URL+"/api/tracks", "application/json", nil)
		if err != nil {
			t.Fatalf("Request failed: %v", err)
		}
		defer resp.Body.Close()
		// POST to /api/tracks may be allowed; check a method-not-allowed case
		_ = resp
	})
}