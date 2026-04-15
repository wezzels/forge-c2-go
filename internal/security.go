// Package internal provides security middleware for FORGE-C2.
package internal

import (
	"log"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

// SecurityConfig holds security-related configuration.
type SecurityConfig struct {
	AllowedOrigins   []string
	MaxRequestSize   int64
	RateLimitPerMin  int
	RateLimitBurst   int
	EnableCSRF       bool
	CSRFAuthKey      string
	TrustedProxies   []string
	EnableStrictTLS  bool
}

// DefaultSecurityConfig returns production-ready defaults.
func DefaultSecurityConfig() SecurityConfig {
	return SecurityConfig{
		AllowedOrigins:   []string{}, // None by default — must be configured
		MaxRequestSize:   1 << 20,    // 1 MB
		RateLimitPerMin:  60,
		RateLimitBurst:   10,
		EnableCSRF:       true,
		CSRFAuthKey:      "", // Must be set from env
		TrustedProxies:   []string{},
		EnableStrictTLS:  true,
	}
}

// SecurityMiddleware wraps an http.Handler with security protections.
type SecurityMiddleware struct {
	config    SecurityConfig
	rateLimit *IPRateLimiter
}

// NewSecurityMiddleware creates a new security middleware stack.
func NewSecurityMiddleware(config SecurityConfig) *SecurityMiddleware {
	return &SecurityMiddleware{
		config:    config,
		rateLimit: NewIPRateLimiter(config.RateLimitPerMin, config.RateLimitBurst),
	}
}

// Wrap applies all security middleware to an http.Handler.
func (sm *SecurityMiddleware) Wrap(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Rate limiting
		ip := extractIP(r, sm.config.TrustedProxies)
		if !sm.rateLimit.Allow(ip) {
			http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
			sm.rateLimit.Rejects.Add(1)
			return
		}

		// 2. Request size limit
		if r.ContentLength > sm.config.MaxRequestSize {
			http.Error(w, "request too large", http.StatusRequestEntityTooLarge)
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, sm.config.MaxRequestSize)

		// 3. CORS check for preflight
		if r.Method == "OPTIONS" {
			origin := r.Header.Get("Origin")
			if sm.isOriginAllowed(origin) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, Authorization")
				w.Header().Set("Access-Control-Max-Age", "3600")
			}
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// 4. CORS enforcement for actual requests
		origin := r.Header.Get("Origin")
		if origin != "" && !sm.isOriginAllowed(origin) {
			// Allow same-origin (no Origin header) but block cross-origin from untrusted
			if r.Method != "GET" && r.Method != "OPTIONS" {
				http.Error(w, "origin not allowed", http.StatusForbidden)
				return
			}
		}
		if sm.isOriginAllowed(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		// 5. Security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		// 6. CSRF check for state-changing requests
		if sm.config.EnableCSRF && (r.Method == "POST" || r.Method == "PUT" || r.Method == "DELETE" || r.Method == "PATCH") {
			csrfToken := r.Header.Get("X-CSRF-Token")
			if csrfToken == "" {
				csrfToken = r.FormValue("csrf_token")
			}
			if !sm.validateCSRF(csrfToken, r) {
				http.Error(w, "invalid CSRF token", http.StatusForbidden)
				log.Printf("[SECURITY] CSRF validation failed from %s %s", ip, r.URL.Path)
				return
			}
		}

		// 7. Content-Type validation for POST requests
		if r.Method == "POST" {
			ct := r.Header.Get("Content-Type")
			if ct != "" && !isSafeContentType(ct) {
				http.Error(w, "unsupported content type", http.StatusUnsupportedMediaType)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// isOriginAllowed checks if the request origin is in the allowed list.
func (sm *SecurityMiddleware) isOriginAllowed(origin string) bool {
	if origin == "" {
		return true // Same-origin requests have no Origin header
	}
	if len(sm.config.AllowedOrigins) == 0 {
		return false // No origins configured = deny all cross-origin
	}
	for _, allowed := range sm.config.AllowedOrigins {
		if allowed == "*" || allowed == origin {
			return true
		}
		if strings.HasPrefix(allowed, "*.") && strings.HasSuffix(origin, allowed[1:]) {
			return true
		}
	}
	return false
}

// validateCSRF validates a CSRF token.
// In production, this should use gorilla/csrf or similar with HMAC.
// This simplified version checks for a non-empty token that matches
// a server-side session or double-submit cookie pattern.
func (sm *SecurityMiddleware) validateCSRF(token string, r *http.Request) bool {
	if sm.config.CSRFAuthKey == "" {
		// No auth key configured — skip CSRF (development mode)
		return true
	}
	if token == "" {
		return false
	}
	// Double-submit cookie pattern: token must match cookie
	cookie, err := r.Cookie("csrf_token")
	if err != nil || cookie.Value == "" {
		return false
	}
	return token == cookie.Value
}

// isSafeContentType checks if a content type is allowed.
func isSafeContentType(ct string) bool {
	safe := []string{
		"application/json",
		"application/x-www-form-urlencoded",
		"multipart/form-data",
	}
	lower := strings.ToLower(strings.Split(ct, ";")[0])
	for _, s := range safe {
		if lower == s {
			return true
		}
	}
	return false
}

// extractIP gets the real client IP, respecting trusted proxies.
func extractIP(r *http.Request, trustedProxies []string) string {
	if len(trustedProxies) > 0 {
		xff := r.Header.Get("X-Forwarded-For")
		if xff != "" {
			ips := strings.Split(xff, ",")
			// Return the leftmost non-trusted IP
			for i := len(ips) - 1; i >= 0; i-- {
				ip := strings.TrimSpace(ips[i])
				isTrusted := false
				for _, tp := range trustedProxies {
					if ip == tp {
						isTrusted = true
						break
					}
				}
				if !isTrusted {
					return ip
				}
			}
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

// IPRateLimiter provides per-IP rate limiting using a token bucket.
type IPRateLimiter struct {
	mu       sync.Mutex
	buckets  map[string]*tokenBucket
	rate     int
	burst    int
	Rejects  atomicCounter
}

type tokenBucket struct {
	tokens    float64
	lastCheck time.Time
}

type atomicCounter struct {
	val int64
	mu  sync.Mutex
}

func (c *atomicCounter) Add(n int64) {
	c.mu.Lock()
	c.val += n
	c.mu.Unlock()
}

func (c *atomicCounter) Load() int64 {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.val
}

// NewIPRateLimiter creates a new rate limiter.
func NewIPRateLimiter(ratePerMin, burst int) *IPRateLimiter {
	return &IPRateLimiter{
		buckets: make(map[string]*tokenBucket),
		rate:   ratePerMin,
		burst:  burst,
	}
}

// Allow checks if a request from ip is allowed.
func (rl *IPRateLimiter) Allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	bucket, ok := rl.buckets[ip]
	if !ok {
		rl.buckets[ip] = &tokenBucket{
			tokens:    float64(rl.burst),
			lastCheck: time.Now(),
		}
		return true
	}

	now := time.Now()
	elapsed := now.Sub(bucket.lastCheck).Seconds()
	bucket.tokens += elapsed * float64(rl.rate) / 60.0
	if bucket.tokens > float64(rl.burst) {
		bucket.tokens = float64(rl.burst)
	}
	bucket.lastCheck = now

	if bucket.tokens >= 1 {
		bucket.tokens--
		return true
	}

	return false
}

// Cleanup removes stale buckets older than maxAge.
func (rl *IPRateLimiter) Cleanup(maxAge time.Duration) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	cutoff := time.Now().Add(-maxAge)
	for ip, bucket := range rl.buckets {
		if bucket.lastCheck.Before(cutoff) {
			delete(rl.buckets, ip)
		}
	}
}

// CheckOriginForWS returns a WebSocket origin check function.
func CheckOriginForWS(allowedOrigins []string) func(r *http.Request) bool {
	return func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		if origin == "" {
			return true // Non-browser clients
		}
		for _, allowed := range allowedOrigins {
			if allowed == "*" || allowed == origin {
				return true
			}
			if strings.HasPrefix(allowed, "*.") && strings.HasSuffix(origin, allowed[1:]) {
				return true
			}
		}
		log.Printf("[SECURITY] WebSocket origin rejected: %s", origin)
		return false
	}
}