package jreap

import (
	"container/list"
	"context"
	"math/rand"
	"sync"
	"time"
)

// NCSConfig holds Network Communication Service configuration.
type NCSConfig struct {
	// Jitter is the random delay range (+/-) in milliseconds.
	Jitter time.Duration
	
	// BaseLatency is the base network delay.
	BaseLatency time.Duration
	
	// PacketLossPercent is the percentage of packets to drop (0-100).
	PacketLossPercent float64
	
	// BandwidthLimit is the max bandwidth in bytes/sec (0 = unlimited).
	BandwidthLimit int64
	
	// QueueDepth is the max messages to queue.
	QueueDepth int
}

// NCS implements Network Communication Service simulation.
type NCS struct {
	config   NCSConfig
	queue    *list.List
	queueMu  sync.Mutex
	ctx      context.Context
	cancel   context.CancelFunc
	handler  MessageHandler
	forwarder *PacketForwarder
}

// MessageHandler is called when messages are ready to deliver.
type MessageHandler interface {
	HandleMessage(msg []byte, from string)
}

// PacketForwarder handles multi-node Link 16 network.
type PacketForwarder struct {
	nodes map[string]*NCS
	mu    sync.RWMutex
}

// NewNCS creates a new NCS instance.
func NewNCS(config NCSConfig) *NCS {
	if config.QueueDepth == 0 {
		config.QueueDepth = 1000
	}
	
	ctx, cancel := context.WithCancel(context.Background())
	return &NCS{
		config:   config,
		queue:    list.New(),
		ctx:      ctx,
		cancel:   cancel,
	}
}

// NewPacketForwarder creates a new packet forwarder.
func NewPacketForwarder() *PacketForwarder {
	return &PacketForwarder{
		nodes: make(map[string]*NCS),
	}
}

// RegisterNode registers a node with the forwarder.
func (f *PacketForwarder) RegisterNode(id string, ncs *NCS) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.nodes[id] = ncs
}

// UnregisterNode removes a node from the forwarder.
func (f *PacketForwarder) UnregisterNode(id string) {
	f.mu.Lock()
	defer f.mu.Unlock()
	delete(f.nodes, id)
}

// Forward sends a message to all registered nodes.
func (f *PacketForwarder) Forward(fromID string, msg []byte) {
	f.mu.RLock()
	defer f.mu.RUnlock()
	
	for id, ncs := range f.nodes {
		if id != fromID {
			ncs.Enqueue(msg, fromID)
		}
	}
}

// Enqueue adds a message to the queue with simulated network conditions.
func (n *NCS) Enqueue(msg []byte, fromID string) {
	n.queueMu.Lock()
	defer n.queueMu.Unlock()
	
	// Check queue depth
	if n.queue.Len() >= n.config.QueueDepth {
		return // Drop if queue full
	}
	
	n.queue.PushBack(&queuedMessage{
		Data:     msg,
		FromID:   fromID,
		QueuedAt: time.Now(),
	})
}

// Start begins processing the queue.
func (n *NCS) Start(handler MessageHandler) {
	n.handler = handler
	
	go n.processQueue()
}

// processQueue handles messages with configured network conditions.
func (n *NCS) processQueue() {
	for {
		select {
		case <-n.ctx.Done():
			return
		default:
			n.processNext()
		}
	}
}

func (n *NCS) processNext() {
	n.queueMu.Lock()
	if n.queue.Len() == 0 {
		n.queueMu.Unlock()
		time.Sleep(10 * time.Millisecond)
		return
	}
	
	el := n.queue.Front()
	n.queue.Remove(el)
	n.queueMu.Unlock()
	
	msg := el.Value.(*queuedMessage)
	
	// Apply packet loss
	if n.config.PacketLossPercent > 0 {
		if rand.Float64()*100 < n.config.PacketLossPercent {
			return // Drop packet
		}
	}
	
	// Calculate delay with jitter
	delay := n.config.BaseLatency
	if n.config.Jitter > 0 {
		jitter := time.Duration(rand.Int63n(int64(n.config.Jitter*2)) - int64(n.config.Jitter))
		delay += jitter
	}
	
	select {
	case <-n.ctx.Done():
		return
	case <-time.After(delay):
		if n.handler != nil {
			n.handler.HandleMessage(msg.Data, msg.FromID)
		}
	}
}

// Stop stops the NCS processing.
func (n *NCS) Stop() {
	n.cancel()
}

type queuedMessage struct {
	Data     []byte
	FromID   string
	QueuedAt time.Time
}

// SetJitter configures the jitter range.
func (n *NCS) SetJitter(jitter time.Duration) {
	n.config.Jitter = jitter
}

// SetLatency configures the base latency.
func (n *NCS) SetLatency(latency time.Duration) {
	n.config.BaseLatency = latency
}

// SetPacketLoss configures the packet loss percentage.
func (n *NCS) SetPacketLoss(percent float64) {
	n.config.PacketLossPercent = percent
}

// SetBandwidthLimit configures bandwidth throttling.
func (n *NCS) SetBandwidthLimit(bytesPerSec int64) {
	n.config.BandwidthLimit = bytesPerSec
}
