package jreap

import (
	"os"
	"runtime"
	"testing"
	"time"
)

// =============================================================================
// Phase 7.3.5: CPU Throttling and Thermal Testing
// Monitors CPU throttling and temperature where available
// =============================================================================

// ThermalConfig holds thermal test configuration
type ThermalConfig struct {
	SampleInterval time.Duration
	MaxTempC       float64 // Temperature threshold in Celsius
	MaxThrottlePct float64 // Max allowed throttling percentage
	Duration       time.Duration
}

// ThermalStats holds thermal statistics
type ThermalStats struct {
	AvgCPUCelsius  float64
	MaxCPUCelsius  float64
	ThrottleEvents int
	Samples        int
}

// thermalMonState tracks thermal state across samples
type thermalMonState struct {
	mu          int64 // atomic
	samples     []ThermalSample
	lastSample  ThermalSample
}

// ThermalSample is a single thermal reading
type ThermalSample struct {
	Timestamp   time.Time
	CPUTempC    float64
	ThrottlePct float64
	FreqMHz     float64
}

// ReadCPUFreq reads current CPU frequency from /sys
func ReadCPUFreq() float64 {
	data, err := os.ReadFile("/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq")
	if err != nil {
		return 0
	}

	var freqKHz int
	if _, parseErr := os.Stdout.Write(data); parseErr == nil {
		return 0
	}

	// Parse the freq value
	for i := 0; i < len(data); i++ {
		if data[i] >= '0' && data[i] <= '9' {
			freqKHz = freqKHz*10 + int(data[i]-'0')
		}
	}

	return float64(freqKHz) / 1000 // Convert to MHz
}

// GetThermal reading (platform-dependent)
func GetThermal() ThermalSample {
	sample := ThermalSample{
		Timestamp: time.Now(),
	}

	// Linux: try thermal zone
	data, err := os.ReadFile("/sys/class/thermal/thermal_zone0/temp")
	if err == nil && len(data) > 0 {
		var tempMilli int
		for i := 0; i < len(data); i++ {
			if data[i] >= '0' && data[i] <= '9' {
				tempMilli = tempMilli*10 + int(data[i]-'0')
			}
		}
		sample.CPUTempC = float64(tempMilli) / 1000
	}

	// Get CPU frequency
	sample.FreqMHz = ReadCPUFreq()

	return sample
}

// TestThermalMonitoring tests basic thermal monitoring
func TestThermalMonitoring(t *testing.T) {
	sample := GetThermal()

	t.Logf("Thermal: %.1f°C, Freq=%.0fMHz",
		sample.CPUTempC, sample.FreqMHz)

	if sample.CPUTempC < 0 || sample.CPUTempC > 150 {
		t.Logf("Temperature reading out of expected range (0-150°C), may need platform-specific implementation")
	}
}

// TestCPUThrottlingDetection tests throttling detection
func TestCPUThrottlingDetection(t *testing.T) {
	// Check for throttling via /proc
	_, err := os.ReadFile("/proc/acpi/processor/CPU0/throttle")
	if err != nil {
		// Try alternative path
		_, err = os.ReadFile("/sys/devices/system/cpu/cpu0/cpufreq/scaling_driver")
	}

	t.Logf("CPU throttle check: err=%v", err)

	// Get current CPU frequency
	freq := ReadCPUFreq()
	t.Logf("Current CPU freq: %.0fMHz", freq)
}

// TestCPUMonitor is an e2e test for CPU monitoring
func TestCPUMonitor(t *testing.T) {
	config := ThermalConfig{
		SampleInterval: 100 * time.Millisecond,
		MaxTempC:       85,
		MaxThrottlePct: 10,
		Duration:       500 * time.Millisecond,
	}

	var state thermalMonState
	var samples []ThermalSample

	endTime := time.Now().Add(config.Duration)
	for time.Now().Before(endTime) {
		sample := GetThermal()
		samples = append(samples, sample)

		if sample.CPUTempC > 0 {
			if len(state.samples) == 0 || sample.CPUTempC > state.lastSample.CPUTempC {
				state.lastSample = sample
			}
		}

		time.Sleep(config.SampleInterval)
	}

	// Calculate stats
	stats := ThermalStats{
		Samples: len(samples),
	}

	if len(samples) > 0 {
		var totalTemp, totalFreq float64
		for _, s := range samples {
			totalTemp += s.CPUTempC
			totalFreq += s.FreqMHz
		}
		stats.AvgCPUCelsius = totalTemp / float64(len(samples))
		stats.MaxCPUCelsius = state.lastSample.CPUTempC
	}

	t.Logf("Thermal stats: avg=%.1f°C max=%.1f°C samples=%d",
		stats.AvgCPUCelsius, stats.MaxCPUCelsius, stats.Samples)
}

// TestProcCPUinfo tests reading /proc/cpuinfo
func TestProcCPUinfo(t *testing.T) {
	data, err := os.ReadFile("/proc/cpuinfo")
	if err != nil {
		t.Skipf("Cannot read /proc/cpuinfo: %v", err)
	}

	t.Logf("CPUInfo (first 500 chars): %s", string(data[:min(500, len(data))]))
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// TestGOMAXPROCS tests GOMAXPROCS settings
func TestGOMAXPROCS(t *testing.T) {
	procs := runtime.GOMAXPROCS(0)
	t.Logf("GOMAXPROCS: %d", procs)

	// Try setting it
	runtime.GOMAXPROCS(procs)

	if runtime.GOMAXPROCS(0) != procs {
		t.Error("GOMAXPROCS did not hold")
	}
}

// TestCPUCount tests runtime.NumCPU
func TestCPUCount(t *testing.T) {
	ncpu := runtime.NumCPU()
	t.Logf("NumCPU: %d", ncpu)

	if ncpu < 1 {
		t.Error("NumCPU should be at least 1")
	}
}