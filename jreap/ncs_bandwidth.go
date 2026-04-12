package jreap

import (
	"sync"
	"time"
)

// BandwidthLimiter implements rate-based bandwidth throttling.
// It uses time-based rate limiting without token accumulation,
// ensuring messages are sent no faster than the configured rate.
type BandwidthLimiter struct {
	bytesPerSec int64
	burstSize   int64
	lastSend    time.Time
	mu          sync.Mutex
	enabled     bool
}

// NewBandwidthLimiter creates a bandwidth limiter.
// bytesPerSec is the sustained rate; burstSize is the max burst in bytes.
func NewBandwidthLimiter(bytesPerSec int64, burstSize int64) *BandwidthLimiter {
	if bytesPerSec <= 0 {
		bytesPerSec = 0
	}
	if burstSize <= 0 {
		burstSize = bytesPerSec / 10
	}
	return &BandwidthLimiter{
		bytesPerSec: bytesPerSec,
		burstSize:   burstSize,
		lastSend:    time.Now(),
		enabled:     true,
	}
}

// Allow checks if a message of size bytes can be sent immediately.
// Note: This is a best-effort non-blocking check based on elapsed time.
// For accurate rate limiting, use WaitFor instead.
func (b *BandwidthLimiter) Allow(size int64) bool {
	if !b.enabled || b.bytesPerSec == 0 {
		return true
	}

	b.mu.Lock()
	defer b.mu.Unlock()

	elapsed := time.Since(b.lastSend)
	budget := b.burstSize + (b.bytesPerSec * int64(elapsed.Milliseconds()) / 1000)
	return budget >= size
}

// WaitFor blocks until a message of size bytes can be sent at the configured rate.
func (b *BandwidthLimiter) WaitFor(size int64) {
	if !b.enabled || b.bytesPerSec == 0 {
		return
	}

	b.mu.Lock()
	defer b.mu.Unlock()

	// Calculate minimum interval between sends
	// at the configured rate: size bytes / rate bytes-per-second
	intervalNs := (size * 1e9) / b.bytesPerSec
	interval := time.Duration(intervalNs)

	elapsed := time.Since(b.lastSend)
	if remaining := interval - elapsed; remaining > 0 {
		b.lastSend = b.lastSend.Add(interval)
		time.Sleep(remaining)
	} else {
		// We can send now; reset lastSend to allow immediate sending (burst)
		b.lastSend = time.Now()
	}
}

// WaitForUnlocked is the internal non-locking version.
// Caller must hold the mutex.
func (b *BandwidthLimiter) WaitForUnlocked(size int64) {
	if !b.enabled || b.bytesPerSec == 0 {
		return
	}

	// Calculate minimum interval between sends
	intervalNs := (size * 1e9) / b.bytesPerSec
	interval := time.Duration(intervalNs)

	elapsed := time.Since(b.lastSend)
	if remaining := interval - elapsed; remaining > 0 {
		b.lastSend = b.lastSend.Add(interval)
		time.Sleep(remaining)
	} else {
		b.lastSend = time.Now()
	}
}

// TryWaitFor attempts to wait up to maxWait for size bytes to be sendable.
// Returns true if the message was sent (or can be sent immediately),
// false if it timed out.
func (b *BandwidthLimiter) TryWaitFor(size int64, maxWait time.Duration) bool {
	if !b.enabled || b.bytesPerSec == 0 {
		return true
	}

	intervalNs := (size * 1e9) / b.bytesPerSec
	interval := time.Duration(intervalNs)

	b.mu.Lock()
	elapsed := time.Since(b.lastSend)
	b.mu.Unlock()

	if elapsed >= interval {
		// Can send now
		b.mu.Lock()
		b.lastSend = time.Now()
		b.mu.Unlock()
		return true
	}

	remaining := interval - elapsed
	if remaining > maxWait {
		return false
	}

	b.WaitFor(size)
	return true
}

// SetRate updates the bandwidth limit dynamically.
func (b *BandwidthLimiter) SetRate(bytesPerSec int64) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.bytesPerSec = bytesPerSec
	if bytesPerSec == 0 {
		b.enabled = false
	} else {
		b.enabled = true
	}
}

// SetBurst updates the burst size.
func (b *BandwidthLimiter) SetBurst(burstSize int64) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.burstSize = burstSize
}

// Enable enables or disables the limiter.
func (b *BandwidthLimiter) Enable(enabled bool) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.enabled = enabled
}

// NCSWithBandwidth wraps an NCS with bandwidth throttling.
type NCSWithBandwidth struct {
	ncs             *NCS
	limiter         *BandwidthLimiter
	originalHandler MessageHandler
}

// NewNCSWithBandwidth creates an NCS wrapped with bandwidth throttling.
func NewNCSWithBandwidth(ncs *NCS, limiter *BandwidthLimiter) *NCSWithBandwidth {
	return &NCSWithBandwidth{
		ncs:     ncs,
		limiter: limiter,
	}
}

// HandleMessage rate-limits then forwards the message.
func (w *NCSWithBandwidth) HandleMessage(msg []byte, from string) {
	if w.limiter != nil {
		w.limiter.WaitFor(int64(len(msg)))
	}
	if w.originalHandler != nil {
		w.originalHandler.HandleMessage(msg, from)
	}
}

// SetHandler sets the final message handler.
func (w *NCSWithBandwidth) SetHandler(handler MessageHandler) {
	w.originalHandler = handler
}

// Enqueue enqueues a message for delivery.
func (w *NCSWithBandwidth) Enqueue(msg []byte, fromID string) {
	if w.limiter != nil {
		w.limiter.WaitFor(int64(len(msg)))
	}
	w.ncs.Enqueue(msg, fromID)
}

// Start starts the NCS with the wrapped handler.
func (w *NCSWithBandwidth) Start(handler MessageHandler) {
	w.originalHandler = handler
	w.ncs.Start(w)
}

// Stop stops the NCS.
func (w *NCSWithBandwidth) Stop() {
	w.ncs.Stop()
}

// GetLimiter returns the bandwidth limiter for configuration.
func (w *NCSWithBandwidth) GetLimiter() *BandwidthLimiter {
	return w.limiter
}