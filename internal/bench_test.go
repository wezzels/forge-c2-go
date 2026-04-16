package internal

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// BenchmarkHealthEndpoint benchmarks /health endpoint
func BenchmarkHealthEndpoint(b *testing.B) {
	srv, _ := NewServer(&Config{
		Port:     "0",
		Security: DefaultSecurityConfig(),
	})
	handler := srv.security.Wrap(srv.router)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest("GET", "/health", nil)
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
	}
}

// BenchmarkTrackList benchmarks /api/tracks endpoint
func BenchmarkTrackList(b *testing.B) {
	srv, _ := NewServer(&Config{
		Port:     "0",
		Security: DefaultSecurityConfig(),
	})
	handler := srv.security.Wrap(srv.router)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest("GET", "/api/tracks", nil)
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
	}
}

// BenchmarkInjectSensor benchmarks POST /api/inject/sensor
func BenchmarkInjectSensor(b *testing.B) {
	srv, _ := NewServer(&Config{
		Port:     "0",
		Security: DefaultSecurityConfig(),
	})
	handler := srv.security.Wrap(srv.router)

	event := map[string]interface{}{
		"event_id":    "BENCH-001",
		"sensor_id":   "SBIRS-GEO-1",
		"sensor_type":  "OPIR",
		"latitude":     33.75,
		"longitude":    -117.85,
		"altitude":     35786000,
		"intensity":    0.92,
	}
	body, _ := json.Marshal(event)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest("POST", "/api/inject/sensor", bytes.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
	}
}

// BenchmarkMetricsEndpoint benchmarks /metrics endpoint
func BenchmarkMetricsEndpoint(b *testing.B) {
	srv, _ := NewServer(&Config{
		Port:     "0",
		Security: DefaultSecurityConfig(),
	})
	handler := srv.security.Wrap(srv.router)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest("GET", "/metrics", nil)
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
	}
}

// BenchmarkSecurityMiddleware benchmarks the full security middleware stack
func BenchmarkSecurityMiddleware(b *testing.B) {
	srv, _ := NewServer(&Config{
		Port:     "0",
		Security: DefaultSecurityConfig(),
	})
	handler := srv.security.Wrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"ok":true}`))
	}))

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := httptest.NewRequest("GET", "/test", nil)
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
	}
}