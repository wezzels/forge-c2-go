package jreap

import (
	"sync"
	"time"

	"math/rand"
)

// PartitionConfig holds network partition configuration.
type PartitionConfig struct {
	// PartitionID is the unique ID of this network partition.
	PartitionID string

	// ConnectedPartitions is the set of partition IDs this partition can communicate with.
	ConnectedPartitions map[string]bool

	// PartitionProbability is the chance (0-1) that a partition split occurs per message.
	PartitionProbability float64

	// SplitDuration is how long a partition split lasts.
	SplitDurationMs int64
}

// NetworkPartition manages network partitioning simulation.
// Partitions can be isolated from each other while still being logically "the same network."
type NetworkPartition struct {
	config    PartitionConfig
	mu        sync.RWMutex
	split     bool
	splitUntil int64
}

// NewNetworkPartition creates a new network partition manager.
func NewNetworkPartition(config PartitionConfig) *NetworkPartition {
	if config.ConnectedPartitions == nil {
		config.ConnectedPartitions = make(map[string]bool)
	}
	return &NetworkPartition{
		config: config,
	}
}

// CanCommunicateWith checks if this partition can send messages to another partition.
func (p *NetworkPartition) CanCommunicateWith(otherID string) bool {
	p.mu.RLock()
	defer p.mu.RUnlock()

	// Check if we're in a split state
	if p.split && p.splitUntil > 0 {
		if now := nowMs(); now < p.splitUntil {
			return false // Still in split
		}
		// Split expired
		p.mu.RUnlock()
		p.mu.Lock()
		p.split = false
		p.splitUntil = 0
		p.mu.Unlock()
		p.mu.RLock()
	}

	return p.config.ConnectedPartitions[otherID]
}

// TriggerSplit causes an intentional network partition for testing.
// Duration is in milliseconds.
func (p *NetworkPartition) TriggerSplit(durationMs int64) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.split = true
	p.splitUntil = nowMs() + durationMs
}

// ResolveSplit manually resolves a network partition.
func (p *NetworkPartition) ResolveSplit() {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.split = false
	p.splitUntil = 0
}

// IsSplit returns true if the partition is currently in a split state.
func (p *NetworkPartition) IsSplit() bool {
	p.mu.RLock()
	defer p.mu.RUnlock()
	if !p.split {
		return false
	}
	if p.splitUntil > 0 && nowMs() >= p.splitUntil {
		return false
	}
	return true
}

// ShouldPartitionProbabilistically evaluates if a random partition should occur.
// Uses the PartitionProbability setting.
func (p *NetworkPartition) ShouldPartitionProbabilistically() bool {
	p.mu.RLock()
	prob := p.config.PartitionProbability
	p.mu.RUnlock()

	if prob <= 0 {
		return false
	}
	return rand.Float64() < prob
}

// SetConnectedPartitions updates the set of reachable partitions.
func (p *NetworkPartition) SetConnectedPartitions(partitions map[string]bool) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.config.ConnectedPartitions = partitions
}

// AddConnectedPartition adds a partition to the reachable set.
func (p *NetworkPartition) AddConnectedPartition(id string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.config.ConnectedPartitions[id] = true
}

// RemoveConnectedPartition removes a partition from the reachable set (network issue).
func (p *NetworkPartition) RemoveConnectedPartition(id string) {
	p.mu.Lock()
	defer p.mu.Unlock()
	delete(p.config.ConnectedPartitions, id)
}

// PartitionManager manages multiple network partitions and their connectivity.
type PartitionManager struct {
	partitions map[string]*NetworkPartition
	mu         sync.RWMutex
}

// NewPartitionManager creates a new partition manager.
func NewPartitionManager() *PartitionManager {
	return &PartitionManager{
		partitions: make(map[string]*NetworkPartition),
	}
}

// RegisterPartition registers a partition with the manager.
func (m *PartitionManager) RegisterPartition(partition *NetworkPartition) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.partitions[partition.config.PartitionID] = partition
}

// UnregisterPartition removes a partition from the manager.
func (m *PartitionManager) UnregisterPartition(partitionID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.partitions, partitionID)
}

// GetPartition retrieves a partition by ID.
func (m *PartitionManager) GetPartition(partitionID string) *NetworkPartition {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.partitions[partitionID]
}

// CanCommunicate checks if two partitions can communicate.
// Returns true only if both partitions have each other in their connected set.
func (m *PartitionManager) CanCommunicate(partitionA, partitionB string) bool {
	pA := m.GetPartition(partitionA)
	pB := m.GetPartition(partitionB)
	if pA == nil || pB == nil {
		return false
	}

	// Bidirectional check: A must be able to reach B, and B must be able to reach A
	return pA.CanCommunicateWith(partitionB) && pB.CanCommunicateWith(partitionA)
}

// TriggerSplitOnPartition triggers a network split on a specific partition.
func (m *PartitionManager) TriggerSplitOnPartition(partitionID string, durationMs int64) {
	p := m.GetPartition(partitionID)
	if p != nil {
		p.TriggerSplit(durationMs)
	}
}

// SplitAllPartitions triggers splits on all registered partitions simultaneously.
// This simulates a catastrophic network event.
func (m *PartitionManager) SplitAllPartitions(durationMs int64) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for _, p := range m.partitions {
		p.TriggerSplit(durationMs)
	}
}

// ResolveAllPartitions resolves all network splits.
func (m *PartitionManager) ResolveAllPartitions() {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for _, p := range m.partitions {
		p.ResolveSplit()
	}
}

// CreatePartitionGraph creates a fully connected network of partitions.
// size is the number of partitions; each partition can communicate with all others.
func (m *PartitionManager) CreatePartitionGraph(size int) {
	m.mu.Lock()
	defer m.mu.Unlock()

	for i := 0; i < size; i++ {
		id := partitionID(i)
		config := PartitionConfig{
			PartitionID: id,
			ConnectedPartitions: make(map[string]bool),
		}
		// Connect to all other partitions
		for j := 0; j < size; j++ {
			if i != j {
				config.ConnectedPartitions[partitionID(j)] = true
			}
		}
		m.partitions[id] = NewNetworkPartition(config)
	}
}

func partitionID(i int) string {
	return string(rune('A' + i%26)) // A, B, C, ... Z, then A1, B1...
}

// nowMs returns current time in milliseconds.
func nowMs() int64 {
	return nowUnixNano() / 1e6
}

// nowUnixNano returns current time in nanoseconds.
func nowUnixNano() int64 {
	return time.Now().UnixNano()
}