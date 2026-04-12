package swap

import (
	"encoding/binary"
	"errors"
	"sync"
	"time"
)

// =============================================================================
// Phase 6.3: Network Optimization - Message Batching & Compression
// =============================================================================

// MessageBatcher batches multiple messages into a single network packet.
type MessageBatcher struct {
	maxBatchSize int
	maxDelay     time.Duration
	messages     [][]byte
	mu           sync.Mutex
	lastFlush    time.Time
}

// NewMessageBatcher creates a new message batcher.
func NewMessageBatcher(maxSize int, maxDelay time.Duration) *MessageBatcher {
	return &MessageBatcher{
		maxBatchSize: maxSize,
		maxDelay:     maxDelay,
		messages:     make([][]byte, 0, maxSize),
		lastFlush:    time.Now(),
	}
}

// Add adds a message to the batch. Returns true if batch should be flushed.
func (b *MessageBatcher) Add(msg []byte) bool {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.messages = append(b.messages, msg)
	shouldFlush := len(b.messages) >= b.maxBatchSize ||
		time.Since(b.lastFlush) >= b.maxDelay

	return shouldFlush
}

// Flush returns the batched messages and resets the batch.
func (b *MessageBatcher) Flush() [][]byte {
	b.mu.Lock()
	defer b.mu.Unlock()

	if len(b.messages) == 0 {
		return nil
	}

	msgs := b.messages
	b.messages = make([][]byte, 0, b.maxBatchSize)
	b.lastFlush = time.Now()

	return msgs
}

// BatchedHeader marks a batched message set.
type BatchedHeader struct {
	Count        uint16
	Timestamp    uint32
	SequenceNum  uint32
}

// PackBatchedMessages packs multiple messages with a batch header.
func PackBatchedMessages(messages [][]byte, seqNum uint32) []byte {
	if len(messages) == 0 {
		return nil
	}

	// Calculate buffer size: header (2+4+4=10) + per-message (4-byte length + data)
	headerSize := 10
	msgOverhead := 4 // 4-byte length prefix per message
	dataSize := 0
	for _, m := range messages {
		dataSize += len(m)
	}
	totalSize := headerSize + len(messages)*msgOverhead + dataSize

	buf := make([]byte, totalSize)
	off := 0

	// Pack header
	binary.LittleEndian.PutUint16(buf[off:], uint16(len(messages)))
	off += 2
	binary.LittleEndian.PutUint32(buf[off:], uint32(time.Now().Unix()))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], seqNum)
	off += 4

	// Pack each message with length prefix
	for _, msg := range messages {
		binary.LittleEndian.PutUint32(buf[off:], uint32(len(msg)))
		off += 4
		copy(buf[off:], msg)
		off += len(msg)
	}

	return buf
}

// UnpackBatchedMessages unpacks a batched message set.
func UnpackBatchedMessages(buf []byte) (messages [][]byte, seqNum uint32, err error) {
	if len(buf) < 8 {
		return nil, 0, errors.New("buffer too small for batch header")
	}

	off := 0
	count := binary.LittleEndian.Uint16(buf[off:])
	off += 2
	off += 4 // timestamp
	seqNum = binary.LittleEndian.Uint32(buf[off:])
	off += 4

	messages = make([][]byte, 0, count)

	for i := uint16(0); i < count; i++ {
		if off+4 > len(buf) {
			break
		}

		msgLen := binary.LittleEndian.Uint32(buf[off:])
		off += 4

		if off+int(msgLen) > len(buf) {
			break
		}

		msg := make([]byte, msgLen)
		copy(msg, buf[off:off+int(msgLen)])
		messages = append(messages, msg)
		off += int(msgLen)
	}

	return messages, seqNum, nil
}

// =============================================================================
// Compression (zstd for large messages)
// =============================================================================

// CompressedHeader marks a compressed payload.
type CompressedHeader struct {
	OriginalSize uint32
	Algorithm    uint8 // 0=none, 1=zstd, 2=gzip
}

// CompressBuf compresses data using simple length-prefix encoding.
// For production, integrate github.com/klauspost/compress/zstd.
func CompressBuf(data []byte, minSize int) ([]byte, error) {
	if len(data) < minSize {
		return data, nil
	}

	// Simple uncompressed marker + original size + data
	// For production: use zstd or gzip
	buf := make([]byte, 5+len(data))
	buf[0] = 0 // Algorithm: 0 = uncompressed
	binary.LittleEndian.PutUint32(buf[1:], uint32(len(data)))
	copy(buf[5:], data)
	return buf, nil
}

// DecompressBuf decompresses data.
func DecompressBuf(data []byte) ([]byte, error) {
	if len(data) < 5 {
		return nil, errors.New("buffer too small")
	}

	algorithm := data[0]
	originalSize := binary.LittleEndian.Uint32(data[1:])

	if algorithm == 0 {
		// Uncompressed
		if len(data)-5 != int(originalSize) {
			return nil, errors.New("size mismatch")
		}
		return data[5:], nil
	}

	// For production: add zstd/gzip decompression here
	return data[5 : 5+originalSize], nil
}

// =============================================================================
// Connection Multiplexing
// =============================================================================

// StreamMultiplexer multiplexes multiple logical streams over one connection.
type StreamMultiplexer struct {
	nextStreamID uint32
	mu           sync.Map // map[uint32]*Stream
	conn         interface{}
}

// Stream represents a logical stream within a multiplexed connection.
type Stream struct {
	ID      uint32
	ch      chan []byte
	closeCh chan struct{}
}

// NewStreamMultiplexer creates a new stream multiplexer.
func NewStreamMultiplexer() *StreamMultiplexer {
	return &StreamMultiplexer{}
}

// NewStream creates a new logical stream.
func (m *StreamMultiplexer) NewStream() *Stream {
	stream := &Stream{
		ID:      m.nextStreamID,
		ch:      make(chan []byte, 100),
		closeCh: make(chan struct{}),
	}
	m.nextStreamID++
	m.mu.Store(stream.ID, stream)
	return stream
}

// Send sends a message on a stream.
func (s *Stream) Send(data []byte) bool {
	select {
	case s.ch <- data:
		return true
	case <-s.closeCh:
		return false
	default:
		return false
	}
}

// Receive receives a message from a stream.
func (s *Stream) Receive(timeout time.Duration) ([]byte, bool) {
	select {
	case msg := <-s.ch:
		return msg, true
	case <-s.closeCh:
		return nil, false
	case <-time.After(timeout):
		return nil, false
	}
}

// Close closes a stream.
func (s *Stream) Close() {
	close(s.closeCh)
}

// PackMultiplexedFrame packs a frame with stream ID header.
func PackMultiplexedFrame(streamID uint32, data []byte) []byte {
	frame := make([]byte, 4+len(data))
	binary.LittleEndian.PutUint32(frame[0:], streamID)
	copy(frame[4:], data)
	return frame
}

// UnpackMultiplexedFrame unpacks a stream frame.
func UnpackMultiplexedFrame(frame []byte) (streamID uint32, data []byte) {
	if len(frame) < 4 {
		return 0, nil
	}
	streamID = binary.LittleEndian.Uint32(frame[0:])
	data = frame[4:]
	return
}

// =============================================================================
// Adaptive Update Rates
// =============================================================================

// AdaptiveRateManager adjusts update rates based on network congestion.
type AdaptiveRateManager struct {
	baseRate     time.Duration
	currentRate  time.Duration
	congestion   float64 // 0.0 to 1.0
	mu           sync.RWMutex
}

// NewAdaptiveRateManager creates a new adaptive rate manager.
func NewAdaptiveRateManager(baseRate time.Duration) *AdaptiveRateManager {
	return &AdaptiveRateManager{
		baseRate:    baseRate,
		currentRate: baseRate,
	}
}

// AdjustForCongestion adjusts the update rate based on observed congestion.
func (m *AdaptiveRateManager) AdjustForCongestion(packetsDropped, packetsTotal int) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if packetsTotal == 0 {
		return
	}

	dropRate := float64(packetsDropped) / float64(packetsTotal)
	m.congestion = m.congestion*0.7 + dropRate*0.3 // EMA

	// Increase interval as congestion increases (1x to 4x)
	multiplier := 1.0 + m.congestion*3.0
	m.currentRate = time.Duration(float64(m.baseRate) * multiplier)
}

// CurrentRate returns the current update rate.
func (m *AdaptiveRateManager) CurrentRate() time.Duration {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.currentRate
}

// =============================================================================
// UDP Datagram Pooling
// =============================================================================

// UDPDatagramPool pools UDP datagrams to reduce allocations.
type UDPDatagramPool struct {
	pool sync.Pool
	size int
}

// NewUDPDatagramPool creates a new UDP datagram pool.
func NewUDPDatagramPool(size int) *UDPDatagramPool {
	return &UDPDatagramPool{
		size: size,
		pool: sync.Pool{
			New: func() interface{} {
				return make([]byte, size)
			},
		},
	}
}

// Get retrieves a datagram buffer.
func (p *UDPDatagramPool) Get() []byte {
	return p.pool.Get().([]byte)
}

// Put returns a datagram buffer to the pool.
func (p *UDPDatagramPool) Put(buf []byte) {
	if cap(buf) >= p.size {
		p.pool.Put(buf[:p.size])
	}
}

// GetWriteBuf gets a buffer for writing.
func (p *UDPDatagramPool) GetWriteBuf() []byte {
	return make([]byte, p.size)
}

// =============================================================================
// QoS Tagging
// =============================================================================

// QoSPriority represents message priority levels.
type QoSPriority uint8

const (
	QoSCritical  QoSPriority = 0 // Highest priority
	QoSHigh      QoSPriority = 1
	QoSNormal    QoSPriority = 2
	QoSLow       QoSPriority = 3 // Lowest priority
)

// QoSHeader tags a message with QoS information.
type QoSHeader struct {
	Priority    QoSPriority
	SequenceNum uint32
	Timestamp   uint32
	ClassOfService uint8
}

// PackQoSHeader packs a QoS header.
func PackQoSHeader(hdr *QoSHeader, data []byte) []byte {
	buf := make([]byte, 10+len(data))
	buf[0] = byte(hdr.Priority)
	binary.LittleEndian.PutUint32(buf[1:], hdr.SequenceNum)
	binary.LittleEndian.PutUint32(buf[5:], hdr.Timestamp)
	buf[9] = hdr.ClassOfService
	copy(buf[10:], data)
	return buf
}

// UnpackQoSHeader unpacks a QoS header.
func UnpackQoSHeader(buf []byte) (*QoSHeader, []byte) {
	if len(buf) < 10 {
		return nil, nil
	}
	return &QoSHeader{
		Priority:       QoSPriority(buf[0]),
		SequenceNum:    binary.LittleEndian.Uint32(buf[1:]),
		Timestamp:     binary.LittleEndian.Uint32(buf[5:]),
		ClassOfService: buf[9],
	}, buf[10:]
}

// ClassOfService constants for DIS traffic.
const (
	CoSNetworkControl   = 0x1E // Network control traffic
	CoSInteractive      = 0x12 // Interactive traffic
	CoSBulkTransfer     = 0x08 // Bulk data transfer
	CoSBestEffort       = 0x04 // Best effort
)
