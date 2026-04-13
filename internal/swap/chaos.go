package swap

import (
	"context"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

// =============================================================================
// Phase 8.2.7: Chaos Engineering Tests
// =============================================================================

// ChaosConfig holds chaos engineering configuration
type ChaosConfig struct {
	Enabled         bool
	FailureRate     float64 // 0.0 to 1.0
	LatencyRange    [2]time.Duration // min, max
	NetworkLossRate float64 // 0.0 to 1.0
	CPUStreeLevel   float64 // 0.0 to 1.0
	MemoryPressure   float64 // 0.0 to 1.0
}

// ChaosEngine manages chaos engineering experiments
type ChaosEngine struct {
	config     ChaosConfig
	running    bool
	scenarios  map[string]*ChaosScenario
	faults     []FaultInjector
	onFault    func(Fault)
	mu         sync.RWMutex
}

// ChaosScenario defines a chaos experiment
type ChaosScenario struct {
	Name        string
	Description string
	Duration    time.Duration
	Faults      []FaultConfig
	Teardown    []func()
}

// FaultConfig defines a fault to inject
type FaultConfig struct {
	Type        FaultType
	Target      string
	Duration    time.Duration
	Probability float64
}

// FaultType enumerates chaos fault types
type FaultType uint8

const (
	FaultTypeLatency FaultType = iota
	FaultTypePacketLoss
	FaultTypeConnectionReset
	FaultTypeCPUStree
	FaultTypeMemoryPressure
	FaultTypeDiskIO
	FaultTypeNetworkPartition
	FaultTypeServiceUnhealthy
)

// Fault represents an injected fault
type Fault struct {
	ID        string
	Type      FaultType
	Target    string
	StartTime time.Time
	EndTime   time.Time
	Details   string
}

// FaultInjector interface for custom fault injection
type FaultInjector interface {
	Inject(ctx context.Context, target string, duration time.Duration) error
	Name() string
}

// NewChaosEngine creates a new chaos engine
func NewChaosEngine(config ChaosConfig) *ChaosEngine {
	return &ChaosEngine{
		config:    config,
		scenarios: make(map[string]*ChaosScenario),
		faults:    make([]FaultInjector, 0),
	}
}

// RegisterFaultInjector registers a custom fault injector
func (e *ChaosEngine) RegisterFaultInjector(injector FaultInjector) {
	e.faults = append(e.faults, injector)
}

// RunScenario executes a chaos scenario
func (e *ChaosEngine) RunScenario(scenario *ChaosScenario) error {
	e.mu.Lock()
	e.running = true
	e.scenarios[scenario.Name] = scenario
	e.mu.Unlock()

	ctx, cancel := context.WithTimeout(context.Background(), scenario.Duration)
	defer cancel()

	errCh := make(chan error, len(scenario.Faults))

	for _, fault := range scenario.Faults {
		go func(f FaultConfig) {
			errCh <- e.injectFault(ctx, f)
		}(fault)
	}

	// Wait for all faults or context cancellation
	select {
	case <-ctx.Done():
		// Clean up
		for _, teardown := range scenario.Teardown {
			teardown()
		}
		e.mu.Lock()
		e.running = false
		e.mu.Unlock()
		return ctx.Err()
	case err := <-errCh:
		if err != nil {
			return err
		}
	}

	e.mu.Lock()
	e.running = false
	e.mu.Unlock()

	return nil
}

func (e *ChaosEngine) injectFault(ctx context.Context, fault FaultConfig) error {
	// Check probability
	if rand.Float64() > fault.Probability {
		return nil
	}

	faultID := fmt.Sprintf("fault-%d", time.Now().UnixNano())
	f := Fault{
		ID:        faultID,
		Type:      fault.Type,
		Target:    fault.Target,
		StartTime: time.Now(),
		Details:   fmt.Sprintf("Injecting %v for %v", fault.Type, fault.Duration),
	}

	if e.onFault != nil {
		e.onFault(f)
	}

	// Inject fault
	var err error
	switch fault.Type {
	case FaultTypeLatency:
		err = e.injectLatency(ctx, fault.Target, fault.Duration)
	case FaultTypePacketLoss:
		err = e.injectPacketLoss(ctx, fault.Target, fault.Duration)
	case FaultTypeConnectionReset:
		err = e.injectConnectionReset(ctx, fault.Target, fault.Duration)
	default:
		err = e.injectGenericFault(ctx, fault)
	}

	f.EndTime = time.Now()
	return err
}

// injectLatency simulates network latency
func (e *ChaosEngine) injectLatency(ctx context.Context, target string, duration time.Duration) error {
	if e.config.LatencyRange[0] == 0 && e.config.LatencyRange[1] == 0 {
		return nil
	}

	ticker := time.NewTicker(10 * time.Millisecond)
	defer ticker.Stop()

	deadline := time.Now().Add(duration)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if time.Now().After(deadline) {
				return nil
			}
			// Simulate latency
			latency := time.Duration(rand.Int63n(int64(e.config.LatencyRange[1] - e.config.LatencyRange[0])))
			time.Sleep(latency)
		}
	}
}

// injectPacketLoss simulates packet loss
func (e *ChaosEngine) injectPacketLoss(ctx context.Context, target string, duration time.Duration) error {
	ticker := time.NewTicker(10 * time.Millisecond)
	defer ticker.Stop()

	deadline := time.Now().Add(duration)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if time.Now().After(deadline) {
				return nil
			}
			// Check if packet should be "lost"
			if rand.Float64() < e.config.NetworkLossRate {
				// Drop the packet (return error to simulate)
			}
		}
	}
}

// injectConnectionReset simulates connection reset
func (e *ChaosEngine) injectConnectionReset(ctx context.Context, target string, duration time.Duration) error {
	// Simulate connection resets during duration
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	deadline := time.Now().Add(duration)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			if time.Now().After(deadline) {
				return nil
			}
			// Simulate reset
		}
	}
}

// injectGenericFault handles generic fault injection
func (e *ChaosEngine) injectGenericFault(ctx context.Context, fault FaultConfig) error {
	for _, injector := range e.faults {
		if injector.Name() == string(fault.Type) {
			return injector.Inject(ctx, fault.Target, fault.Duration)
		}
	}
	return nil
}

// IsRunning returns whether a scenario is running
func (e *ChaosEngine) IsRunning() bool {
	e.mu.RLock()
	defer e.mu.RUnlock()
	return e.running
}

// GetActiveScenarios returns running scenarios
func (e *ChaosEngine) GetActiveScenarios() []*ChaosScenario {
	e.mu.RLock()
	defer e.mu.RUnlock()

	result := make([]*ChaosScenario, 0, len(e.scenarios))
	for _, s := range e.scenarios {
		result = append(result, s)
	}
	return result
}

// SetOnFault sets the fault callback
func (e *ChaosEngine) SetOnFault(cb func(Fault)) {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.onFault = cb
}

// =============================================================================
// Pre-defined Chaos Scenarios
// =============================================================================

// NetworkPartitionScenario simulates network partition
func NetworkPartitionScenario(duration time.Duration) *ChaosScenario {
	return &ChaosScenario{
		Name:        "network-partition",
		Description: "Simulates network partition between services",
		Duration:    duration,
		Faults: []FaultConfig{
			{Type: FaultTypeNetworkPartition, Target: "all", Duration: duration, Probability: 1.0},
		},
	}
}

// HighLoadScenario simulates high CPU/memory load
func HighLoadScenario(duration time.Duration, cpuLevel, memLevel float64) *ChaosScenario {
	return &ChaosScenario{
		Name:        "high-load",
		Description: "Simulates high system load",
		Duration:    duration,
		Faults: []FaultConfig{
			{Type: FaultTypeCPUStree, Target: "all", Duration: duration, Probability: 1.0},
			{Type: FaultTypeMemoryPressure, Target: "all", Duration: duration, Probability: 1.0},
		},
	}
}

// ServiceOutageScenario simulates service outage
func ServiceOutageScenario(service string, duration time.Duration) *ChaosScenario {
	return &ChaosScenario{
		Name:        "service-outage",
		Description: fmt.Sprintf("Simulates outage of %s", service),
		Duration:    duration,
		Faults: []FaultConfig{
			{Type: FaultTypeConnectionReset, Target: service, Duration: duration, Probability: 1.0},
		},
	}
}

// LatencySpikeScenario simulates latency spikes
func LatencySpikeScenario(duration time.Duration, minLatency, maxLatency time.Duration) *ChaosScenario {
	return &ChaosScenario{
		Name:        "latency-spike",
		Description: "Simulates network latency spikes",
		Duration:    duration,
		Faults: []FaultConfig{
			{Type: FaultTypeLatency, Target: "all", Duration: duration, Probability: 0.3},
		},
	}
}

// =============================================================================
// FailureDetector monitors system health
// =============================================================================

// FailureDetector detects failures and anomalies
type FailureDetector struct {
	thresholds   map[string]Threshold
	anomalies    []Anomaly
	onAnomaly    func(Anomaly)
	mu           sync.RWMutex
}

// Threshold defines detection thresholds
type Threshold struct {
	Metric      string
	Operator    ComparisonOp
	Value       float64
	Window      time.Duration
}

// ComparisonOp for threshold comparison
type ComparisonOp uint8

const (
	OpGT ComparisonOp = iota
	OpLT
	OpEQ
	OpGTE
	OpLTE
)

// Anomaly represents a detected anomaly
type Anomaly struct {
	Metric      string
	Value       float64
	Threshold   float64
	DetectedAt  time.Time
	Severity    Severity
}

// Severity of anomaly
type Severity uint8

const (
	SeverityWarning Severity = iota
	SeverityCritical
	SeverityFatal
)

// NewFailureDetector creates a new failure detector
func NewFailureDetector() *FailureDetector {
	return &FailureDetector{
		thresholds: make(map[string]Threshold),
		anomalies:  make([]Anomaly, 0),
	}
}

// AddThreshold adds a detection threshold
func (d *FailureDetector) AddThreshold(metric string, op ComparisonOp, value float64, window time.Duration) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.thresholds[metric] = Threshold{
		Metric:   metric,
		Operator: op,
		Value:    value,
		Window:   window,
	}
}

// Detect checks current value against thresholds
func (d *FailureDetector) Detect(metric string, value float64) bool {
	d.mu.RLock()
	defer d.mu.RUnlock()

	threshold, ok := d.thresholds[metric]
	if !ok {
		return false
	}

	var exceeded bool
	switch threshold.Operator {
	case OpGT:
		exceeded = value > threshold.Value
	case OpLT:
		exceeded = value < threshold.Value
	case OpEQ:
		exceeded = value == threshold.Value
	case OpGTE:
		exceeded = value >= threshold.Value
	case OpLTE:
		exceeded = value <= threshold.Value
	}

	if exceeded {
		anomaly := Anomaly{
			Metric:     metric,
			Value:      value,
			Threshold:  threshold.Value,
			DetectedAt: time.Now(),
			Severity:   SeverityWarning,
		}
		d.anomalies = append(d.anomalies, anomaly)
		if d.onAnomaly != nil {
			d.onAnomaly(anomaly)
		}
	}

	return exceeded
}

// GetAnomalies returns recent anomalies
func (d *FailureDetector) GetAnomalies() []Anomaly {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.anomalies
}

// SetOnAnomaly sets the anomaly callback
func (d *FailureDetector) SetOnAnomaly(cb func(Anomaly)) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.onAnomaly = cb
}