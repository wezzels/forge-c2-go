package bmdsbridge

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os/exec"
	"strings"
	"sync"
	"time"
)

// SimConfig configures a BMDS simulator
type SimConfig struct {
	Name    string            `json:"name"`
	Binary  string            `json:"binary"`
	Args    []string          `json:"args"`
	Env     map[string]string `json:"env"`
	Period  time.Duration     `json:"period"`
	Timeout time.Duration     `json:"timeout"`
}

// SimTrack represents a track from a BMDS simulator
type SimTrack struct {
	TrackID      string                 `json:"track_id"`
	Name         string                 `json:"name"`
	Type         string                 `json:"type"`
	Latitude     float64                `json:"latitude"`
	Longitude    float64                `json:"longitude"`
	Altitude     float64                `json:"altitude"`
	Speed        float64                `json:"speed"`
	Heading      float64                `json:"heading"`
	ThreatLevel  int                    `json:"threat_level"`
	Status       string                 `json:"status"`
	Source       string                 `json:"source"`
	PlatformType string                 `json:"platform_type"`
	ForceType    string                 `json:"force_type"`
	Timestamp    time.Time              `json:"timestamp"`
	Extra        map[string]interface{} `json:"extra"`
}

// SimResult is the output from a simulator run
type SimResult struct {
	Simulator string     `json:"simulator"`
	Scenario  string     `json:"scenario"`
	Tracks    []SimTrack `json:"tracks"`
	Timestamp time.Time  `json:"timestamp"`
	Duration  float64    `json:"duration_ms"`
	Error     string     `json:"error,omitempty"`
}

// TrackHandler is called when new tracks arrive
type TrackHandler func(result *SimResult)

// Bridge runs BMDS simulators and feeds tracks to FORGE-C2
type Bridge struct {
	configs map[string]*SimConfig
	handler TrackHandler
	mu      sync.RWMutex
	running bool
	stopCh  chan struct{}
	binDir  string
}

// NewBridge creates a new BMDS bridge
func NewBridge(binDir string, handler TrackHandler) *Bridge {
	return &Bridge{
		configs: make(map[string]*SimConfig),
		handler: handler,
		binDir:  binDir,
		stopCh:  make(chan struct{}),
	}
}

// Register adds a simulator configuration
func (b *Bridge) Register(name, binary string, args []string, period time.Duration) {
	b.configs[name] = &SimConfig{
		Name:    name,
		Binary:  binary,
		Args:    args,
		Period:  period,
		Timeout: period + 30*time.Second,
	}
}

// RunSimulator executes a simulator and parses its JSON output
func (b *Bridge) RunSimulator(ctx context.Context, config *SimConfig) (*SimResult, error) {
	binPath := b.binDir + "/" + config.Binary
	args := append([]string{"-json"}, config.Args...)

	ctx, cancel := context.WithTimeout(ctx, config.Timeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, binPath, args...)

	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("simulator %s failed: %w", config.Name, err)
	}

	var result SimResult
	result.Simulator = config.Name
	result.Timestamp = time.Now()

	var raw map[string]interface{}
	if err := json.Unmarshal(output, &raw); err != nil {
		return nil, fmt.Errorf("simulator %s: invalid JSON: %w", config.Name, err)
	}

	if s, ok := raw["scenario"].(string); ok {
		result.Scenario = s
	}
	if s, ok := raw["vehicle"].(string); ok {
		result.Scenario = s
	}

	result.Tracks = b.extractTracks(raw, config.Name)
	return &result, nil
}

// extractTracks pulls track data from various simulator JSON formats
func (b *Bridge) extractTracks(raw map[string]interface{}, source string) []SimTrack {
	var tracks []SimTrack
	now := time.Now()

	// Threats array
	if threats, ok := raw["threats"].([]interface{}); ok {
		for _, t := range threats {
			if tm, ok := t.(map[string]interface{}); ok {
				track := SimTrack{Source: source, Timestamp: now, ForceType: "HOSTILE", PlatformType: "threat"}
				if v, ok := tm["id"].(string); ok { track.TrackID = v }
				if v, ok := tm["name"].(string); ok { track.Name = v }
				if v, ok := tm["type"].(string); ok { track.Type = v }
				if v, ok := tm["latitude"].(float64); ok { track.Latitude = v }
				if v, ok := tm["longitude"].(float64); ok { track.Longitude = v }
				if v, ok := tm["altitude"].(float64); ok { track.Altitude = v }
				if v, ok := tm["speed"].(float64); ok { track.Speed = v }
				if v, ok := tm["heading"].(float64); ok { track.Heading = v }
				if v, ok := tm["threat_level"].(float64); ok { track.ThreatLevel = int(v) }
				if track.TrackID == "" { track.TrackID = fmt.Sprintf("%s-%d", source, len(tracks)) }
				tracks = append(tracks, track)
			}
		}
	}

	// Interceptors array
	if interceptors, ok := raw["interceptors"].([]interface{}); ok {
		for _, i := range interceptors {
			if im, ok := i.(map[string]interface{}); ok {
				track := SimTrack{Source: source, Timestamp: now, ForceType: "FRIEND", PlatformType: "interceptor"}
				if v, ok := im["id"].(string); ok { track.TrackID = v }
				if v, ok := im["name"].(string); ok { track.Name = v }
				if v, ok := im["type"].(string); ok { track.Type = v }
				if v, ok := im["latitude"].(float64); ok { track.Latitude = v }
				if v, ok := im["longitude"].(float64); ok { track.Longitude = v }
				if v, ok := im["altitude"].(float64); ok { track.Altitude = v }
				if v, ok := im["speed"].(float64); ok { track.Speed = v }
				if track.TrackID == "" { track.TrackID = fmt.Sprintf("%s-int-%d", source, len(tracks)) }
				tracks = append(tracks, track)
			}
		}
	}

	// Sensors array
	if sensors, ok := raw["sensors"].([]interface{}); ok {
		for _, s := range sensors {
			if sm, ok := s.(map[string]interface{}); ok {
				track := SimTrack{Source: source, Timestamp: now, ForceType: "FRIEND", PlatformType: "sensor"}
				if v, ok := sm["id"].(string); ok { track.TrackID = v }
				if v, ok := sm["name"].(string); ok { track.Name = v }
				if v, ok := sm["type"].(string); ok { track.Type = v }
				if v, ok := sm["latitude"].(float64); ok { track.Latitude = v }
				if v, ok := sm["longitude"].(float64); ok { track.Longitude = v }
				if track.TrackID == "" { track.TrackID = fmt.Sprintf("%s-sns-%d", source, len(tracks)) }
				tracks = append(tracks, track)
			}
		}
	}

	// Vessels/bases array
	if vessels, ok := raw["vessels"].([]interface{}); ok {
		for _, v := range vessels {
			if vm, ok := v.(map[string]interface{}); ok {
				track := SimTrack{Source: source, Timestamp: now, ForceType: "FRIEND", PlatformType: "vessel"}
				if id, ok := vm["id"].(string); ok { track.TrackID = id }
				if name, ok := vm["name"].(string); ok { track.Name = name }
				if lat, ok := vm["latitude"].(float64); ok { track.Latitude = lat }
				if lon, ok := vm["longitude"].(float64); ok { track.Longitude = lon }
				if track.TrackID == "" { track.TrackID = fmt.Sprintf("%s-vsl-%d", source, len(tracks)) }
				tracks = append(tracks, track)
			}
		}
	}

	// Detections array
	if detections, ok := raw["detections"].([]interface{}); ok {
		for _, d := range detections {
			if dm, ok := d.(map[string]interface{}); ok {
				track := SimTrack{Source: source, Timestamp: now, ForceType: "HOSTILE", PlatformType: "detection"}
				if v, ok := dm["threat_id"].(string); ok { track.TrackID = v }
				if v, ok := dm["latitude"].(float64); ok { track.Latitude = v }
				if v, ok := dm["longitude"].(float64); ok { track.Longitude = v }
				if v, ok := dm["altitude"].(float64); ok { track.Altitude = v }
				if track.TrackID == "" { track.TrackID = fmt.Sprintf("%s-det-%d", source, len(tracks)) }
				tracks = append(tracks, track)
			}
		}
	}

	return tracks
}

// RunAll executes all registered simulators and collects results
func (b *Bridge) RunAll(ctx context.Context) []*SimResult {
	var results []*SimResult
	var mu sync.Mutex
	var wg sync.WaitGroup

	for name, config := range b.configs {
		wg.Add(1)
		go func(n string, c *SimConfig) {
			defer wg.Done()
			result, err := b.RunSimulator(ctx, c)
			mu.Lock()
			if err != nil {
				results = append(results, &SimResult{Simulator: n, Error: err.Error(), Timestamp: time.Now()})
			} else {
				results = append(results, result)
			}
			mu.Unlock()
		}(name, config)
	}

	wg.Wait()
	return results
}

// Start begins periodic simulator execution
func (b *Bridge) Start(ctx context.Context) {
	b.mu.Lock()
	b.running = true
	b.mu.Unlock()

	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-b.stopCh:
			return
		case <-ticker.C:
			results := b.RunAll(ctx)
			for _, r := range results {
				if r.Error == "" && b.handler != nil {
					b.handler(r)
				}
			}
		}
	}
}

// Stop halts the bridge
func (b *Bridge) Stop() { close(b.stopCh) }

// DefaultConfigs returns default BMDS simulator configurations
func DefaultConfigs() map[string]*SimConfig {
	configs := make(map[string]*SimConfig)
	sims := []struct {
		name   string
		binary string
		args   []string
		period time.Duration
	}{
		{"icbm", "icbm", []string{"-scenario", "minuteman-3"}, 60 * time.Second},
		{"irbm", "irbm", []string{"-scenario", "df-26"}, 60 * time.Second},
		{"hgv", "hgv", []string{"-scenario", "hypersonic-glide"}, 60 * time.Second},
		{"sbirs", "sbirs", []string{"-scenario", "global-surveillance"}, 30 * time.Second},
		{"dsp", "dsp", []string{"-scenario", "global-surveillance"}, 30 * time.Second},
		{"stss", "stss", []string{"-scenario", "midcourse-tracking"}, 30 * time.Second},
		{"uewr", "uewr", []string{"-scenario", "early-warning"}, 30 * time.Second},
		{"lrdr", "lrdr", []string{"-scenario", "long-range-detection"}, 30 * time.Second},
		{"tpy2", "tpy2", []string{"-scenario", "tpy2-tp"}, 30 * time.Second},
		{"gbr", "gbr", []string{"-scenario", "gbr-tracking"}, 30 * time.Second},
		{"gmd", "gmd", []string{"-scenario", "gmd-icbm-midcourse"}, 60 * time.Second},
		{"sm3", "sm3", []string{"-scenario", "sm3-irbm"}, 60 * time.Second},
		{"sm6", "sm6", []string{"-scenario", "sm6-terminal"}, 60 * time.Second},
		{"thaad", "thaad", []string{"-scenario", "thaad-terminal"}, 60 * time.Second},
		{"patriot", "patriot", []string{"-scenario", "patriot-point"}, 60 * time.Second},
		{"aegis", "aegis", []string{"-scenario", "aegis-bmd"}, 60 * time.Second},
		{"c2bmc", "c2bmc", []string{"-scenario", "c2bmc-coordination"}, 30 * time.Second},
		{"hub", "hub", []string{"-scenario", "bmds-network"}, 30 * time.Second},
		{"wta", "wta", []string{"-scenario", "gmd-icbm-midcourse"}, 30 * time.Second},
		{"kill-assessment", "kill-assessment", []string{"-scenario", "gmd-icbm-midcourse"}, 30 * time.Second},
		{"kill-chain-rt", "kill-chain-rt", []string{"-scenario", "gmd-icbm-midcourse"}, 30 * time.Second},
		{"boost-intercept", "boost-intercept", []string{"-scenario", "kei-icbm-boost"}, 30 * time.Second},
		{"debris-field", "debris-field", []string{"-scenario", "gmd-icbm-400km"}, 30 * time.Second},
		{"tactical-net", "tactical-net", []string{"-scenario", "bmds-network"}, 30 * time.Second},
		{"air-combat", "air-combat", []string{"-scenario", "f22-vs-su57"}, 60 * time.Second},
		{"satellite-weapon", "satellite-weapon", []string{"-scenario", "sc19-starlink"}, 60 * time.Second},
	}
	for _, s := range sims {
		configs[s.name] = &SimConfig{
			Name: s.name, Binary: s.binary, Args: s.args,
			Period: s.period, Timeout: s.period + 30*time.Second,
		}
	}
	return configs
}

// BridgeStatus reports the current bridge status
type BridgeStatus struct {
	Running     bool              `json:"running"`
	Simulators  map[string]string `json:"simulators"`
	LastRun     time.Time         `json:"last_run"`
	TrackCount  int               `json:"track_count"`
}

// Status returns current bridge status
func (b *Bridge) Status() *BridgeStatus {
	b.mu.RLock()
	defer b.mu.RUnlock()
	status := &BridgeStatus{Running: b.running, Simulators: make(map[string]string)}
	for name := range b.configs {
		status.Simulators[name] = "registered"
	}
	return status
}

// FormatTrackAsJREAP converts a SimTrack to a J-Series message fragment
func FormatTrackAsJREAP(track *SimTrack) string {
	return fmt.Sprintf("J0,%s,%s,%.6f,%.6f,%.1f,%.1f,%.1f,%d,%s",
		track.TrackID, track.ForceType, track.Latitude, track.Longitude,
		track.Altitude, track.Speed, track.Heading, track.ThreatLevel, track.Source)
}

// FormatTrackAsDIS creates a DIS Entity State PDU fragment
func FormatTrackAsDIS(track *SimTrack) string {
	force := "Other"
	switch track.ForceType {
	case "FRIEND":
		force = "Friendly"
	case "HOSTILE":
		force = "Opposing"
	case "NEUTRAL":
		force = "Neutral"
	}
	return fmt.Sprintf("DIS_ES,%s,%.6f,%.6f,%.1f,%s,%s",
		track.TrackID, track.Latitude, track.Longitude, track.Altitude, force, track.PlatformType)
}

// ParseSimTracksFromJSON parses raw simulator JSON output into SimTracks
func ParseSimTracksFromJSON(data []byte, source string) ([]SimTrack, error) {
	var raw map[string]interface{}
	if err := json.Unmarshal(data, &raw); err != nil {
		var arr []map[string]interface{}
		if err2 := json.Unmarshal(data, &arr); err2 != nil {
			return nil, fmt.Errorf("invalid JSON: %w", err)
		}
		var tracks []SimTrack
		b := &Bridge{binDir: ""}
		for _, item := range arr {
			tracks = append(tracks, b.extractTracks(item, source)...)
		}
		return tracks, nil
	}
	b := &Bridge{binDir: ""}
	return b.extractTracks(raw, source), nil
}

// GetSimulatorNames returns all registered simulator names
func (b *Bridge) GetSimulatorNames() []string {
	b.mu.RLock()
	defer b.mu.RUnlock()
	names := make([]string, 0, len(b.configs))
	for name := range b.configs {
		names = append(names, name)
	}
	return names
}

// IsRegistered checks if a simulator is registered
func (b *Bridge) IsRegistered(name string) bool {
	b.mu.RLock()
	defer b.mu.RUnlock()
	_, ok := b.configs[name]
	return ok
}

// Ensure imports used
var _ = strings.TrimSpace("")
var _ = log.Printf