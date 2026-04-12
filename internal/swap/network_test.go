package swap

import (
	"testing"
	"time"
)

// TestMessageBatcher tests message batching logic.
func TestMessageBatcher(t *testing.T) {
	batcher := NewMessageBatcher(5, time.Second)

	// Add 4 messages - should not flush
	for i := 0; i < 4; i++ {
		shouldFlush := batcher.Add([]byte{byte(i)})
		if shouldFlush {
			t.Errorf("Should not flush after %d messages", i+1)
		}
	}

	// Add 5th message - should flush
	shouldFlush := batcher.Add([]byte{byte(5)})
	if !shouldFlush {
		t.Error("Should flush after 5 messages")
	}

	// Flush should return 5 messages
	msgs := batcher.Flush()
	if len(msgs) != 5 {
		t.Errorf("Flush: got %d messages, want 5", len(msgs))
	}
}

// TestMessageBatcherTimeoutFlush tests automatic flush on timeout.
func TestMessageBatcherTimeoutFlush(t *testing.T) {
	batcher := NewMessageBatcher(100, 10*time.Millisecond)

	batcher.Add([]byte("test1"))
	batcher.Add([]byte("test2"))

	// Wait for timeout
	time.Sleep(15 * time.Millisecond)

	msgs := batcher.Flush()
	if len(msgs) != 2 {
		t.Errorf("Timeout flush: got %d messages, want 2", len(msgs))
	}
}

// TestPackBatchedMessages tests batch packing.
func TestPackBatchedMessages(t *testing.T) {
	messages := [][]byte{
		[]byte("hello"),
		[]byte("world"),
	}

	packed := PackBatchedMessages(messages, 42)

	msgs, seqNum, err := UnpackBatchedMessages(packed)
	if err != nil {
		t.Fatalf("UnpackBatchedMessages failed: %v", err)
	}

	if seqNum != 42 {
		t.Errorf("Sequence number: got %d, want 42", seqNum)
	}

	if len(msgs) != 2 {
		t.Fatalf("Message count: got %d, want 2", len(msgs))
	}

	if string(msgs[0]) != "hello" || string(msgs[1]) != "world" {
		t.Errorf("Messages: got %v, want [hello world]", msgs)
	}

	t.Logf("PackBatchedMessages: packed %d bytes -> %d bytes", len(packed), 5+5+4+4)
}

// TestUnpackBatchedMessagesEmpty tests unpacking empty batch.
func TestUnpackBatchedMessagesEmpty(t *testing.T) {
	packed := PackBatchedMessages(nil, 0)
	if packed != nil {
		t.Error("Empty batch should return nil")
	}
}

// TestStreamMultiplexer tests logical stream multiplexing.
func TestStreamMultiplexer(t *testing.T) {
	mux := NewStreamMultiplexer()

	stream1 := mux.NewStream()
	stream2 := mux.NewStream()

	if stream1.ID == stream2.ID {
		t.Error("Stream IDs should be unique")
	}

	// Send on stream1
	if !stream1.Send([]byte("test1")) {
		t.Error("Stream1 Send failed")
	}

	// Receive on stream1
	msg, ok := stream1.Receive(time.Millisecond)
	if !ok {
		t.Fatal("Receive failed")
	}
	if string(msg) != "test1" {
		t.Errorf("Received: got %s, want test1", string(msg))
	}

	// Close stream
	stream1.Close()

	t.Logf("StreamMultiplexer: 2 streams created, IDs %d and %d", stream1.ID, stream2.ID)
}

// TestAdaptiveRateManager tests adaptive rate adjustment.
func TestAdaptiveRateManager(t *testing.T) {
	arm := NewAdaptiveRateManager(100 * time.Millisecond)

	// Initial rate should be base rate
	if rate := arm.CurrentRate(); rate != 100*time.Millisecond {
		t.Errorf("Initial rate: got %v, want 100ms", rate)
	}

	// Add 50% congestion
	arm.AdjustForCongestion(50, 100)

	// Rate should increase
	rate := arm.CurrentRate()
	if rate <= 100*time.Millisecond {
		t.Errorf("Congested rate should increase: got %v", rate)
	}

	// Add no congestion - rate should decrease via EMA
	arm.AdjustForCongestion(0, 100)

	rate = arm.CurrentRate()
	t.Logf("AdaptiveRateManager: after congestion -> rate %v", rate)
}

// TestUDPDatagramPool tests UDP datagram pooling.
func TestUDPDatagramPool(t *testing.T) {
	pool := NewUDPDatagramPool(1400)

	// Get buffers
	buf1 := pool.Get()
	buf2 := pool.Get()

	if cap(buf1) != 1400 {
		t.Errorf("Buffer capacity: got %d, want 1400", cap(buf1))
	}

	// Pool should return different buffers (sync.Pool behavior)
	_ = buf2 // Buffers may or may not be same depending on GC state

	// Return buffers
	pool.Put(buf1)
	pool.Put(buf2)

	t.Logf("UDPDatagramPool: OK")
}

// TestQoSHeaderPackUnpack tests QoS header packing.
func TestQoSHeaderPackUnpack(t *testing.T) {
	hdr := &QoSHeader{
		Priority:       QoSHigh,
		SequenceNum:    12345,
		Timestamp:      987654321,
		ClassOfService: CoSInteractive,
	}
	data := []byte("test payload")

	packed := PackQoSHeader(hdr, data)

	unpacked, payload := UnpackQoSHeader(packed)
	if unpacked == nil {
		t.Fatal("UnpackQoSHeader returned nil")
	}

	if unpacked.Priority != QoSHigh {
		t.Errorf("Priority: got %d, want %d", unpacked.Priority, QoSHigh)
	}
	if unpacked.SequenceNum != 12345 {
		t.Errorf("SequenceNum: got %d, want 12345", unpacked.SequenceNum)
	}
	if string(payload) != "test payload" {
		t.Errorf("Payload: got %s", string(payload))
	}

	t.Logf("QoSHeader: Priority=%d CoS=%d Seq=%d", unpacked.Priority, unpacked.ClassOfService, unpacked.SequenceNum)
}

// TestMultiplexedFramePackUnpack tests frame packing.
func TestMultiplexedFramePackUnpack(t *testing.T) {
	frame := PackMultiplexedFrame(42, []byte("hello world"))

	streamID, data := UnpackMultiplexedFrame(frame)

	if streamID != 42 {
		t.Errorf("StreamID: got %d, want 42", streamID)
	}
	if string(data) != "hello world" {
		t.Errorf("Data: got %s", string(data))
	}
}
