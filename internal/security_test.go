package internal

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSecurityMiddlewareRateLimit(t *testing.T) {
	config := SecurityConfig{
		AllowedOrigins:  []string{},
		MaxRequestSize:  1 << 20,
		RateLimitPerMin: 5,
		RateLimitBurst:  2,
		EnableCSRF:      false,
	}
	mw := NewSecurityMiddleware(config)

	handler := mw.Wrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	// Should allow burst of 2
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest("GET", "/test", nil)
		req.RemoteAddr = "1.2.3.4:1234"
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		if w.Code != 200 {
			t.Errorf("request %d: expected 200, got %d", i, w.Code)
		}
	}

	// Additional requests should be rate limited (burst exhausted, rate=5/min too slow to refill)
	for i := 0; i < 3; i++ {
		req := httptest.NewRequest("GET", "/test", nil)
		req.RemoteAddr = "1.2.3.4:1234"
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		if w.Code == 429 {
			break // Got rate limited as expected
		}
		if i == 2 {
			t.Errorf("expected 429 after burst, got %d", w.Code)
		}
	}

	// Different IP should be allowed
	req2 := httptest.NewRequest("GET", "/test", nil)
	req2.RemoteAddr = "5.6.7.8:1234"
	w2 := httptest.NewRecorder()
	handler.ServeHTTP(w2, req2)
	if w2.Code != 200 {
		t.Errorf("different IP: expected 200, got %d", w2.Code)
	}
}

func TestSecurityMiddlewareSecurityHeaders(t *testing.T) {
	config := SecurityConfig{
		AllowedOrigins:  []string{},
		RateLimitPerMin: 100,
		RateLimitBurst:  100,
		EnableCSRF:      false,
	}
	mw := NewSecurityMiddleware(config)

	handler := mw.Wrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/test", nil)
	req.RemoteAddr = "1.2.3.4:1234"
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Error("missing X-Content-Type-Options")
	}
	if w.Header().Get("X-Frame-Options") != "DENY" {
		t.Error("missing X-Frame-Options")
	}
	if w.Header().Get("Strict-Transport-Security") == "" {
		t.Error("missing HSTS")
	}
}

func TestSecurityMiddlewareCORS(t *testing.T) {
	config := SecurityConfig{
		AllowedOrigins:  []string{"https://forge.example.com"},
		RateLimitPerMin: 100,
		RateLimitBurst:   100,
		EnableCSRF:       false,
	}
	mw := NewSecurityMiddleware(config)

	// Allowed origin
	handler := mw.Wrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Origin", "https://forge.example.com")
	req.RemoteAddr = "1.2.3.4:1234"
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	if w.Header().Get("Access-Control-Allow-Origin") != "https://forge.example.com" {
		t.Error("CORS origin not set for allowed origin")
	}

	// Disallowed origin on POST should be blocked
	req2 := httptest.NewRequest("POST", "/test", nil)
	req2.Header.Set("Origin", "https://evil.com")
	req2.RemoteAddr = "1.2.3.4:1234"
	w2 := httptest.NewRecorder()
	handler.ServeHTTP(w2, req2)
	if w2.Code != 403 {
		t.Errorf("expected 403 for disallowed origin POST, got %d", w2.Code)
	}
}

func TestSecurityMiddlewareRequestSizeLimit(t *testing.T) {
	config := SecurityConfig{
		AllowedOrigins:  []string{},
		MaxRequestSize:  100, // 100 bytes
		RateLimitPerMin: 100,
		RateLimitBurst:  100,
		EnableCSRF:      false,
	}
	mw := NewSecurityMiddleware(config)

	handler := mw.Wrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest("POST", "/test", nil)
	req.ContentLength = 200
	req.RemoteAddr = "1.2.3.4:1234"
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	if w.Code != 413 {
		t.Errorf("expected 413 for oversized request, got %d", w.Code)
	}
}

func TestCheckOriginForWS(t *testing.T) {
	check := CheckOriginForWS([]string{"https://forge.example.com"})

	req1 := httptest.NewRequest("GET", "/ws", nil)
	req1.Header.Set("Origin", "https://forge.example.com")
	if !check(req1) {
		t.Error("allowed origin should pass")
	}

	req2 := httptest.NewRequest("GET", "/ws", nil)
	req2.Header.Set("Origin", "https://evil.com")
	if check(req2) {
		t.Error("disallowed origin should fail")
	}

	// No origin = non-browser client
	req3 := httptest.NewRequest("GET", "/ws", nil)
	if !check(req3) {
		t.Error("no origin (non-browser) should pass")
	}
}

func TestSecurityMiddlewareCSRF(t *testing.T) {
	config := SecurityConfig{
		AllowedOrigins:  []string{},
		RateLimitPerMin: 100,
		RateLimitBurst:  100,
		EnableCSRF:      true,
		CSRFAuthKey:     "test-key-32-bytes-long-enough!!!",
	}
	mw := NewSecurityMiddleware(config)

	handler := mw.Wrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	// POST without CSRF token should fail
	req := httptest.NewRequest("POST", "/test", nil)
	req.RemoteAddr = "1.2.3.4:1234"
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)
	if w.Code != 403 {
		t.Errorf("expected 403 for POST without CSRF, got %d", w.Code)
	}

	// GET should still work
	req2 := httptest.NewRequest("GET", "/test", nil)
	req2.RemoteAddr = "1.2.3.4:1234"
	w2 := httptest.NewRecorder()
	handler.ServeHTTP(w2, req2)
	if w2.Code != 200 {
		t.Errorf("expected 200 for GET, got %d", w2.Code)
	}
}

func TestIsSafeContentType(t *testing.T) {
	if !isSafeContentType("application/json") {
		t.Error("application/json should be safe")
	}
	if !isSafeContentType("application/x-www-form-urlencoded") {
		t.Error("form-urlencoded should be safe")
	}
	if isSafeContentType("text/xml") {
		t.Error("text/xml should not be safe")
	}
}

func TestIPRateLimiterCleanup(t *testing.T) {
	rl := NewIPRateLimiter(10, 5)
	rl.Allow("1.1.1.1")
	rl.Allow("2.2.2.2")

	rl.Cleanup(0) // Clean everything
	if len(rl.buckets) != 0 {
		t.Errorf("expected 0 buckets after cleanup, got %d", len(rl.buckets))
	}
}