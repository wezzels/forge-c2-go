package gateway

import (
	"sync"
	"time"
)

// =============================================================================
// Phase 1.3.4: Duplicate Message Detection via sequence numbers
// =============================================================================

// SequenceNumberTracker tracks sequence numbers per participant
type SequenceNumberTracker struct {
	mu         sync.Mutex
	sequences  map[uint32]uint32
	lastSeqNum uint32
}

// NewSequenceNumberTracker creates a new sequence tracker
func NewSequenceNumberTracker() *SequenceNumberTracker {
	return &SequenceNumberTracker{
		sequences: make(map[uint32]uint32),
	}
}

// CheckAndUpdate checks if sequence number is valid and updates tracker
// Returns true if message is NOT a duplicate
func (t *SequenceNumberTracker) CheckAndUpdate(participantID uint32, seqNum uint32) bool {
	t.mu.Lock()
	defer t.mu.Unlock()

	lastSeq, exists := t.sequences[participantID]
	if !exists {
		t.sequences[participantID] = seqNum
		return true
	}

	if seqNum <= lastSeq {
		return false // Duplicate or out-of-order
	}

	t.sequences[participantID] = seqNum
	return true
}

// GetLastSequence returns the last valid sequence number for a participant
func (t *SequenceNumberTracker) GetLastSequence(participantID uint32) uint32 {
	t.mu.Lock()
	defer t.mu.Unlock()

	if seq, ok := t.sequences[participantID]; ok {
		return seq
	}
	return 0
}

// =============================================================================
// Phase 1.3.6: Track Number Allocation and Deconfliction
// =============================================================================

// TrackNumberAllocator manages track number allocation
type TrackNumberAllocator struct {
	mu           sync.Mutex
	allocated    map[uint32]bool
	nextNumber   uint32
	maxTrackNum   uint32
}

// NewTrackNumberAllocator creates a new track allocator
func NewTrackNumberAllocator() *TrackNumberAllocator {
	return &TrackNumberAllocator{
		allocated:  make(map[uint32]bool),
		nextNumber: 1,
		maxTrackNum: 9999,
	}
}

// Allocate assigns a new track number
func (a *TrackNumberAllocator) Allocate() uint32 {
	a.mu.Lock()
	defer a.mu.Unlock()

	start := a.nextNumber
	for {
		if a.nextNumber > a.maxTrackNum {
			a.nextNumber = 1
		}
		if !a.allocated[a.nextNumber] {
			a.allocated[a.nextNumber] = true
			num := a.nextNumber
			a.nextNumber++
			return num
		}
		a.nextNumber++
		if a.nextNumber == start {
			return 0 // No available numbers
		}
	}
}

// Release frees a track number
func (a *TrackNumberAllocator) Release(trackNum uint32) {
	a.mu.Lock()
	defer a.mu.Unlock()
	delete(a.allocated, trackNum)
}

// IsAllocated checks if a track number is in use
func (a *TrackNumberAllocator) IsAllocated(trackNum uint32) bool {
	a.mu.Lock()
	defer a.mu.Unlock()
	return a.allocated[trackNum]
}

// =============================================================================
// Phase 1.3.7: Participant ID Validation
// =============================================================================

// ParticipantRegistry validates participant IDs against network membership
type ParticipantRegistry struct {
	mu            sync.Mutex
	participants  map[uint32]*ParticipantInfo
	networkMembers map[uint32]bool
}

// ParticipantInfo contains participant details
type ParticipantInfo struct {
	ID        uint32
	Name      string
	IPAddress string
	JoinedAt  time.Time
	IsActive  bool
}

// NewParticipantRegistry creates a new registry
func NewParticipantRegistry() *ParticipantRegistry {
	return &ParticipantRegistry{
		participants:  make(map[uint32]*ParticipantInfo),
		networkMembers: make(map[uint32]bool),
	}
}

// AddNetworkMember adds a participant to the network
func (r *ParticipantRegistry) AddNetworkMember(id uint32, name, ip string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.networkMembers[id] = true
	r.participants[id] = &ParticipantInfo{
		ID:        id,
		Name:      name,
		IPAddress: ip,
		JoinedAt:  time.Now(),
		IsActive:  true,
	}
}

// RemoveNetworkMember removes a participant from the network
func (r *ParticipantRegistry) RemoveNetworkMember(id uint32) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.networkMembers, id)
	if p, ok := r.participants[id]; ok {
		p.IsActive = false
	}
}

// ValidateParticipant checks if participant is in network
func (r *ParticipantRegistry) ValidateParticipant(id uint32) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.networkMembers[id]
}

// GetParticipantInfo returns info about a participant
func (r *ParticipantRegistry) GetParticipantInfo(id uint32) *ParticipantInfo {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.participants[id]
}

// =============================================================================
// Phase 1.3.8: Message Rate Limiting per participant
// =============================================================================

// RateLimiter implements per-participant message rate limiting
type RateLimiter struct {
	mu           sync.Mutex
	limits       map[uint32]*RateLimitConfig
	messageCounts map[uint32]*RollingCounter
}

// RateLimitConfig defines rate limits
type RateLimitConfig struct {
	MaxMessages  int
	WindowSize   time.Duration
}

// RollingCounter tracks messages in a time window
type RollingCounter struct {
	mu      sync.Mutex
	times   []time.Time
	maxSize int
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter() *RateLimiter {
	return &RateLimiter{
		limits:       make(map[uint32]*RateLimitConfig),
		messageCounts: make(map[uint32]*RollingCounter),
	}
}

// SetLimit sets rate limit for a participant
func (r *RateLimiter) SetLimit(participantID uint32, maxMsgs int, window time.Duration) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.limits[participantID] = &RateLimitConfig{
		MaxMessages: maxMsgs,
		WindowSize:  window,
	}
	r.messageCounts[participantID] = &RollingCounter{maxSize: maxMsgs}
}

// CheckLimit checks if message is within rate limit
func (r *RateLimiter) CheckLimit(participantID uint32) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	config, hasConfig := r.limits[participantID]
	if !hasConfig {
		return true // No limit set, allow
	}

	counter, hasCounter := r.messageCounts[participantID]
	if !hasCounter {
		return true
	}

	counter.mu.Lock()
	defer counter.mu.Unlock()

	// Remove old messages
	cutoff := time.Now().Add(-config.WindowSize)
	idx := 0
	for i, t := range counter.times {
		if t.After(cutoff) {
			break
		}
		idx = i + 1
	}
	counter.times = counter.times[idx:]

	// Check limit
	if len(counter.times) >= config.MaxMessages {
		return false
	}

	counter.times = append(counter.times, time.Now())
	return true
}

// GetMessageCount returns current message count for a participant
func (r *RateLimiter) GetMessageCount(participantID uint32) int {
	r.mu.Lock()
	defer r.mu.Unlock()

	config, hasConfig := r.limits[participantID]
	if !hasConfig {
		return 0
	}

	counter, hasCounter := r.messageCounts[participantID]
	if !hasCounter {
		return 0
	}

	counter.mu.Lock()
	defer counter.mu.Unlock()

	cutoff := time.Now().Add(-config.WindowSize)
	count := 0
	for _, t := range counter.times {
		if t.After(cutoff) {
			count++
		}
	}
	return count
}
