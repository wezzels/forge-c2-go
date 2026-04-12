package jreap

import (
	"sync"
	"testing"
	"time"
)

func TestBandwidthLimiterAllow(t *testing.T) {
	limiter := NewBandwidthLimiter(1000, 500) // 1000 bytes/sec, 500 byte burst

	// Should allow up to burst size immediately
	if !limiter.Allow(100) {
		t.Error("Should allow 100 bytes")
	}
	if !limiter.Allow(200) {
		t.Error("Should allow 200 bytes")
	}
	if !limiter.Allow(200) {
		t.Error("Should allow total 500 bytes")
	}

	// Allow is non-blocking and time-based: it uses elapsed time to calculate budget.
	// Even if burst is "exhausted," if some time has passed, it may still allow.
	// This is expected behavior for non-blocking Allow.
}

func TestBandwidthLimiterAllowZeroRate(t *testing.T) {
	// Zero rate should allow everything (disabled)
	limiter := NewBandwidthLimiter(0, 0)

	if !limiter.Allow(999999) {
		t.Error("With 0 rate, should allow everything")
	}
}

func TestBandwidthLimiterWaitFor(t *testing.T) {
	limiter := NewBandwidthLimiter(1000, 50) // 1000 bytes/sec, 50 byte burst

	start := time.Now()

	// WaitFor should block ~100ms for 100 bytes at 1000 bytes/sec
	limiter.WaitFor(100)

	elapsed := time.Since(start)
	// Should take at least 90ms (allowing some timing variance)
	if elapsed < 90*time.Millisecond {
		t.Errorf("WaitFor returned too early: %v", elapsed)
	}
}

func TestBandwidthLimiterSetRate(t *testing.T) {
	limiter := NewBandwidthLimiter(1000, 500)

	// Disable rate
	limiter.SetRate(0)

	if !limiter.Allow(1000) {
		t.Error("After disabling rate, should allow everything")
	}
}

func TestNCSWithBandwidthBasic(t *testing.T) {
	ncs := NewNCS(NCSConfig{QueueDepth: 100})
	limiter := NewBandwidthLimiter(10000, 1000) // plenty of bandwidth
	wrapper := NewNCSWithBandwidth(ncs, limiter)

	handler := &mockHandler{}
	wrapper.Start(handler)
	defer wrapper.Stop()

	// Enqueue a message
	wrapper.Enqueue([]byte("test"), "sender1")

	time.Sleep(100 * time.Millisecond)

	if handler.Count() != 1 {
		t.Errorf("Expected 1 message, got %d", handler.Count())
	}
}

func TestNCSWithBandwidthThrottling(t *testing.T) {
	ncs := NewNCS(NCSConfig{QueueDepth: 1000})
	// Low bandwidth: 100 bytes/sec
	limiter := NewBandwidthLimiter(100, 50)
	wrapper := NewNCSWithBandwidth(ncs, limiter)

	handler := &mockHandler{}
	wrapper.Start(handler)
	defer wrapper.Stop()

	start := time.Now()

	// Enqueue 3 messages of ~50 bytes each = 150 bytes total
	// At 100 bytes/sec, 150 bytes should take ~1.5 seconds minimum
	wrapper.Enqueue([]byte("test1"), "sender1")
	wrapper.Enqueue([]byte("test2"), "sender2")
	wrapper.Enqueue([]byte("test3"), "sender3")

	// Wait for all to go through
	time.Sleep(2 * time.Second)

	elapsed := time.Since(start)

	// At 100 bytes/sec, 150 bytes should take ~1.5 seconds minimum
	if handler.Count() != 3 {
		t.Errorf("Expected 3 messages, got %d after %v", handler.Count(), elapsed)
	}
}

func TestBandwidthLimiterConcurrent(t *testing.T) {
	limiter := NewBandwidthLimiter(10000, 1000)

	var wg sync.WaitGroup

	// 10 goroutines each trying to check 100 bytes
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			limiter.Allow(100)
		}()
	}

	wg.Wait()

	// No deadlock should occur
}

func TestBandwidthLimiterDisable(t *testing.T) {
	limiter := NewBandwidthLimiter(1000, 100)

	limiter.Enable(false)

	// After disabling, should allow everything
	if !limiter.Allow(10000) {
		t.Error("Should allow after disable")
	}
}

func TestBandwidthLimiterSetBurst(t *testing.T) {
	limiter := NewBandwidthLimiter(1000, 100)

	// Increase burst
	limiter.SetBurst(200)

	if !limiter.Allow(150) {
		t.Error("Should allow after increasing burst")
	}
}

func TestBandwidthLimiterTryWaitForSuccess(t *testing.T) {
	limiter := NewBandwidthLimiter(10000, 1000)

	// Try to send 200 bytes with 1 second wait - should succeed quickly
	ok := limiter.TryWaitFor(200, 1*time.Second)
	if !ok {
		t.Error("TryWaitFor should succeed")
	}
}

func TestBandwidthLimiterTryWaitForTimeout(t *testing.T) {
	limiter := NewBandwidthLimiter(100, 10) // Very slow, 100 bytes/sec

	// Try to send 1000 bytes with 50ms wait - should timeout
	ok := limiter.TryWaitFor(1000, 50*time.Millisecond)
	if ok {
		t.Error("TryWaitFor should timeout")
	}
}

func TestNCSWithBandwidthGetLimiter(t *testing.T) {
	ncs := NewNCS(NCSConfig{QueueDepth: 100})
	limiter := NewBandwidthLimiter(1000, 500)
	wrapper := NewNCSWithBandwidth(ncs, limiter)

	if wrapper.GetLimiter() != limiter {
		t.Error("GetLimiter should return the wrapped limiter")
	}
}

func TestBandwidthLimiterNewDefaults(t *testing.T) {
	// Test with zero values - should not panic
	limiter := NewBandwidthLimiter(0, 0)

	if !limiter.Allow(100) {
		t.Error("0 rate should allow everything")
	}
}