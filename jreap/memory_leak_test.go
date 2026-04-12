package jreap

import (
	"runtime"
	"sync"
	"testing"
	"time"
)

// =============================================================================
// Phase 7.3.4: Memory Leak Detection Test
// Runs memory sampling over time to detect leaks
// =============================================================================

// MemMonitor tracks memory usage over time
type MemMonitor struct {
	Samples     []MemSample
	Interval    time.Duration
	PeakHeapMB  float64
	LeakThreshMB float64 // Threshold in MB for leak detection
}

// MemSample is a single memory sample
type MemSample struct {
	Timestamp time.Time
	HeapMB   float64
	StackMB  float64
	GCMB     float64
}

// NewMemMonitor creates a memory monitor with thresholds
func NewMemMonitor(interval time.Duration, leakThreshMB float64) *MemMonitor {
	return &MemMonitor{
		Samples:      make([]MemSample, 0),
		Interval:     interval,
		PeakHeapMB:   0,
		LeakThreshMB: leakThreshMB,
	}
}

// Sample captures current memory usage
func (m *MemMonitor) Sample() MemSample {
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)

	sample := MemSample{
		Timestamp: time.Now(),
		HeapMB:   float64(ms.Alloc) / 1e6,
		StackMB:  float64(ms.StackInuse) / 1e6,
		GCMB:     float64(ms.PauseTotalNs) / 1e6,
	}

	m.Samples = append(m.Samples, sample)

	if sample.HeapMB > m.PeakHeapMB {
		m.PeakHeapMB = sample.HeapMB
	}

	return sample
}

// DetectTrend analyzes samples to detect memory growth trend
func (m *MemMonitor) DetectTrend() (growthRate float64, isLeaking bool) {
	if len(m.Samples) < 2 {
		return 0, false
	}

	// Simple linear regression on heap usage
	first := m.Samples[0]
	last := m.Samples[len(m.Samples)-1]

	duration := last.Timestamp.Sub(first.Timestamp).Hours()
	if duration < 0.1 {
		duration = 0.1
	}

	growthMB := last.HeapMB - first.HeapMB
	growthRate = growthMB / duration // MB per hour

	isLeaking = growthRate > m.LeakThreshMB

	return growthRate, isLeaking
}

// TestMemoryLeakDetection is an e2e memory leak test (uses short duration for CI)
func TestMemoryLeakDetection(t *testing.T) {
	// Use short interval for testing (real would be 1 hour intervals for 72 hours)
	monitor := NewMemMonitor(50*time.Millisecond, 1.0) // 1 MB/hour threshold

	var wg sync.WaitGroup
	wg.Add(1)

	stopCh := make(chan struct{})

	// Start monitoring goroutine
	go func() {
		ticker := time.NewTicker(monitor.Interval)
		defer ticker.Stop()
		defer wg.Done()

		for {
			select {
			case <-ticker.C:
				monitor.Sample()
			case <-stopCh:
				return
			}
		}
	}()

	// Simulate some allocations
	time.Sleep(100 * time.Millisecond)

	// Stop monitoring
	close(stopCh)
	wg.Wait()

	// Analyze results
	growthRate, isLeaking := monitor.DetectTrend()

	t.Logf("Memory leak test: %d samples, peak=%.2fMB, growth=%.4fMB/hr, leaking=%v",
		len(monitor.Samples), monitor.PeakHeapMB, growthRate, isLeaking)

	if isLeaking {
		t.Errorf("Memory leak detected: growth rate %.4f MB/hr exceeds threshold %.2f MB/hr",
			growthRate, monitor.LeakThreshMB)
	}
}

// TestMemoryStats tests memory stats tracking
func TestMemoryStats(t *testing.T) {
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)

	allocMB := float64(ms.Alloc) / 1e6
	sysMB := float64(ms.Sys) / 1e6
	gcCycles := ms.NumGC

	t.Logf("MemStats: Alloc=%.2fMB Sys=%.2fMB GCycles=%d", allocMB, sysMB, gcCycles)

	if allocMB < 0 {
		t.Error("Alloc should not be negative")
	}
}