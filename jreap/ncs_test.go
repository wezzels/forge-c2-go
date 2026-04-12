package jreap

import (
	"sync"
	"testing"
	"time"
)

type mockHandler struct {
	msgs  [][]byte
	froms []string
	mu    sync.Mutex
}

func (h *mockHandler) HandleMessage(msg []byte, from string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.msgs = append(h.msgs, msg)
	h.froms = append(h.froms, from)
}

func (h *mockHandler) Count() int {
	h.mu.Lock()
	defer h.mu.Unlock()
	return len(h.msgs)
}

func TestNCSBasicQueue(t *testing.T) {
	config := NCSConfig{
		QueueDepth: 100,
	}
	
	ncs := NewNCS(config)
	handler := &mockHandler{}
	ncs.Start(handler)
	defer ncs.Stop()
	
	// Enqueue some messages
	for i := 0; i < 5; i++ {
		ncs.Enqueue([]byte("test"), "sender1")
	}
	
	// Wait for processing
	time.Sleep(100 * time.Millisecond)
	
	if handler.Count() != 5 {
		t.Errorf("Expected 5 messages, got %d", handler.Count())
	}
}

func TestNCSPacketLoss(t *testing.T) {
	config := NCSConfig{
		PacketLossPercent: 100, // 100% loss
		QueueDepth:        100,
	}
	
	ncs := NewNCS(config)
	handler := &mockHandler{}
	ncs.Start(handler)
	defer ncs.Stop()
	
	ncs.Enqueue([]byte("test"), "sender1")
	
	time.Sleep(100 * time.Millisecond)
	
	if handler.Count() != 0 {
		t.Errorf("Expected 0 messages (100%% loss), got %d", handler.Count())
	}
}

func TestNCSQueueDepth(t *testing.T) {
	config := NCSConfig{
		QueueDepth: 5,
	}
	
	ncs := NewNCS(config)
	handler := &mockHandler{}
	ncs.Start(handler)
	defer ncs.Stop()
	
	// Enqueue more than queue depth
	for i := 0; i < 10; i++ {
		ncs.Enqueue([]byte("test"), "sender1")
	}
	
	time.Sleep(50 * time.Millisecond)
	
	count := handler.Count()
	if count > 5 {
		t.Errorf("Expected max 5 messages due to queue depth, got %d", count)
	}
}

func TestPacketForwarder(t *testing.T) {
	forwarder := NewPacketForwarder()
	
	ncs1 := NewNCS(NCSConfig{QueueDepth: 100})
	ncs2 := NewNCS(NCSConfig{QueueDepth: 100})
	
	forwarder.RegisterNode("node1", ncs1)
	forwarder.RegisterNode("node2", ncs2)
	
	h1 := &mockHandler{}
	h2 := &mockHandler{}
	ncs1.Start(h1)
	ncs2.Start(h2)
	defer ncs1.Stop()
	defer ncs2.Stop()
	
	// Forward from node1 to node2
	forwarder.Forward("node1", []byte("hello"))
	
	time.Sleep(100 * time.Millisecond)
	
	if h2.Count() != 1 {
		t.Errorf("Expected node2 to receive 1 message, got %d", h2.Count())
	}
	
	// node1 should not receive its own message
	if h1.Count() != 0 {
		t.Errorf("Expected node1 to receive 0 messages, got %d", h1.Count())
	}
}

func TestNCSJitter(t *testing.T) {
	config := NCSConfig{
		Jitter:     20 * time.Millisecond,
		BaseLatency: 10 * time.Millisecond,
		QueueDepth: 100,
	}
	
	ncs := NewNCS(config)
	handler := &mockHandler{}
	ncs.Start(handler)
	defer ncs.Stop()
	
	start := time.Now()
	ncs.Enqueue([]byte("test"), "sender1")
	time.Sleep(50 * time.Millisecond)
	elapsed := time.Since(start)
	
	// With 10ms base + 0-20ms jitter, should take at least 10ms
	if elapsed < 10*time.Millisecond {
		t.Errorf("Message processed too quickly: %v", elapsed)
	}
}
