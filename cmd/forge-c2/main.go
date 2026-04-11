// Package cmd provides the main entrypoint for FORGE-C2.
package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

)

// Version info (set at build time)
var (
	Version   = "dev"
	Commit    = "unknown"
	BuildDate = "unknown"
)

func main() {
	// Command line flags
	mode := flag.String("mode", "serve", "Mode: serve, worker, health")
	flag.Parse()

	switch *mode {
	case "serve":
		runServer()
	case "worker":
		runWorker()
	case "health":
		healthCheck()
	default:
		fmt.Fprintf(os.Stderr, "Unknown mode: %s\n", *mode)
		os.Exit(1)
	}
}

func runServer() {
	fmt.Printf("FORGE-C2 v%s (commit: %s, built: %s)\n", Version, Commit, BuildDate)
	fmt.Println("Starting FORGE-C2 server...")

	// Create HTTP server with timeouts
	server := &http.Server{
		Addr:         ":8080",
		Handler:      createMux(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Start server in goroutine
	go func() {
		fmt.Println("Server listening on :8080")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Fprintf(os.Stderr, "Server error: %v\n", err)
			os.Exit(1)
		}
	}()

	// Wait for shutdown signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "Server shutdown error: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Server stopped")
}

func runWorker() {
	fmt.Printf("FORGE-C2 Worker v%s\n", Version)
	fmt.Println("Starting FORGE-C2 worker...")

	// Worker implementation would go here
	// For now, just wait for shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	fmt.Println("Worker stopped")
}

func healthCheck() {
	// Liveness check
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	req, _ := http.NewRequestWithContext(ctx, "GET", "http://localhost:8080/health/ready", nil)
	client := &http.Client{Timeout: 2 * time.Second}

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		os.Exit(1)
	}
	os.Exit(0)
}

func createMux() *http.ServeMux {
	mux := http.NewServeMux()

	// Health endpoints
	mux.HandleFunc("/health/live", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})

	mux.HandleFunc("/health/ready", func(w http.ResponseWriter, r *http.Request) {
		// TODO: Check dependencies (Kafka, database, etc.)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ready"}`))
	})

	// Metrics endpoint (Prometheus format)
	mux.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		metrics := getMetrics()
		w.Header().Set("Content-Type", "text/plain; version=0.0.4")
		w.Write([]byte(metrics))
	})

	// API endpoints
	mux.HandleFunc("/api/v1/encode", handleEncode)
	mux.HandleFunc("/api/v1/decode", handleDecode)
	mux.HandleFunc("/api/v1/jseries/types", handleListTypes)

	return mux
}

func handleEncode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"encode endpoint"}`))
}

func handleDecode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"decode endpoint"}`))
}

func handleListTypes(w http.ResponseWriter, r *http.Request) {
	types := "J0-J31"
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"types":[%s]}`, types)
}

// getMetrics returns Prometheus-formatted metrics
func getMetrics() string {
	return fmt.Sprintf(`# HELP forge_c2_version FORGE-C2 version info
# TYPE forge_c2_version gauge
forge_c2_version{version="%s",commit="%s"} 1

# HELP forge_c2_uptime_seconds FORGE-C2 uptime in seconds
# TYPE forge_c2_uptime_seconds counter
forge_c2_uptime_seconds 0

# HELP forge_c2_encode_total Total encode operations
# TYPE forge_c2_encode_total counter
forge_c2_encode_total 0

# HELP forge_c2_decode_total Total decode operations
# TYPE forge_c2_decode_total counter
forge_c2_decode_total 0

# HELP forge_c2_errors_total Total errors
# TYPE forge_c2_errors_total counter
forge_c2_errors_total 0

# HELP forge_c2_encode_duration_seconds Encode duration in seconds
# TYPE forge_c2_encode_duration_seconds histogram
forge_c2_encode_duration_seconds_bucket{le="0.001"} 0
forge_c2_encode_duration_seconds_bucket{le="0.01"} 0
forge_c2_encode_duration_seconds_bucket{le="0.1"} 0
forge_c2_encode_duration_seconds_bucket{le="1"} 0
forge_c2_encode_duration_seconds_bucket{le="+Inf"} 0
forge_c2_encode_duration_seconds_sum 0
forge_c2_encode_duration_seconds_count 0

# HELP forge_c2_decode_duration_seconds Decode duration in seconds
# TYPE forge_c2_decode_duration_seconds histogram
forge_c2_decode_duration_seconds_bucket{le="0.001"} 0
forge_c2_decode_duration_seconds_bucket{le="0.01"} 0
forge_c2_decode_duration_seconds_bucket{le="0.1"} 0
forge_c2_decode_duration_seconds_bucket{le="1"} 0
forge_c2_decode_duration_seconds_bucket{le="+Inf"} 0
forge_c2_decode_duration_seconds_sum 0
forge_c2_decode_duration_seconds_count 0

# HELP forge_c2_connections_active Active connections
# TYPE forge_c2_connections_active gauge
forge_c2_connections_active 0
`, Version, Commit)
}
