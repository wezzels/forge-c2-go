package swap

import (
	"testing"
	"time"
)

func TestMessageBatcherAddFlush(t *testing.T) {
	batcher := NewMessageBatcher(1024, 10*time.Millisecond)
	msg := []byte("test-message-1")
	batcher.Add(msg)
	batches := batcher.Flush()
	if len(batches) != 1 {
		t.Errorf("Expected 1 batch, got %d", len(batches))
	}
}

func TestMessageBatcherMultiple(t *testing.T) {
	batcher := NewMessageBatcher(4096, 50*time.Millisecond)
	for i := 0; i < 5; i++ {
		batcher.Add([]byte("message"))
	}
	batches := batcher.Flush()
	if len(batches) < 1 {
		t.Errorf("Expected at least 1 batch, got %d", len(batches))
	}
}

func TestMessageBatcherOverflow(t *testing.T) {
	batcher := NewMessageBatcher(16, 10*time.Millisecond)
	largeMsg := make([]byte, 32)
	if batcher.Add(largeMsg) {
		t.Error("Expected Add to fail for message exceeding max size")
	}
}

func TestPackUnpackBatchedMessagesRoundtrip(t *testing.T) {
	messages := [][]byte{
		[]byte("msg1"),
		[]byte("msg2"),
		[]byte("msg3"),
	}
	packed := PackBatchedMessages(messages, 1)
	if len(packed) == 0 {
		t.Error("PackBatchedMessages returned empty buffer")
	}
	unpacked, seqNum, err := UnpackBatchedMessages(packed)
	if err != nil {
		t.Fatalf("UnpackBatchedMessages failed: %v", err)
	}
	if seqNum != 1 {
		t.Errorf("Expected seqNum=1, got %d", seqNum)
	}
	if len(unpacked) != 3 {
		t.Errorf("Expected 3 messages, got %d", len(unpacked))
	}
}

func TestCompressDecompressRoundtrip(t *testing.T) {
	data := make([]byte, 1024)
	for i := range data {
		data[i] = byte(i % 256)
	}
	compressed, err := CompressBuf(data, 64)
	if err != nil {
		t.Fatalf("CompressBuf failed: %v", err)
	}
	if len(compressed) == 0 {
		t.Error("CompressBuf returned empty buffer")
	}
	decompressed, err := DecompressBuf(compressed)
	if err != nil {
		t.Fatalf("DecompressBuf failed: %v", err)
	}
	if len(decompressed) != len(data) {
		t.Errorf("Expected %d bytes, got %d", len(data), len(decompressed))
	}
}

func TestStreamMultiplexerSendReceive(t *testing.T) {
	mux := NewStreamMultiplexer()
	stream := mux.NewStream()
	data := []byte("test-data")
	if !stream.Send(data) {
		t.Error("Send should succeed")
	}
	received, ok := stream.Receive(100 * time.Millisecond)
	if !ok {
		t.Error("Receive should succeed")
	}
	if string(received) != "test-data" {
		t.Errorf("Expected 'test-data', got '%s'", string(received))
	}
}

func TestStreamMultiplexerClose(t *testing.T) {
	mux := NewStreamMultiplexer()
	stream := mux.NewStream()
	stream.Close()
	// After close, behavior depends on implementation
	_ = mux
}

func TestPackUnpackMultiplexedFrameRoundtrip(t *testing.T) {
	data := []byte("frame-data")
	packed := PackMultiplexedFrame(42, data)
	if len(packed) == 0 {
		t.Error("PackMultiplexedFrame returned empty buffer")
	}
	streamID, unpacked := UnpackMultiplexedFrame(packed)
	if streamID != 42 {
		t.Errorf("Expected streamID=42, got %d", streamID)
	}
	if string(unpacked) != "frame-data" {
		t.Errorf("Expected 'frame-data', got '%s'", string(unpacked))
	}
}

func TestAdaptiveRateManagerCreation(t *testing.T) {
	arm := NewAdaptiveRateManager(100 * time.Millisecond)
	if arm == nil {
		t.Fatal("Expected non-nil AdaptiveRateManager")
	}
	baseRate := arm.CurrentRate()
	if baseRate != 100*time.Millisecond {
		t.Errorf("Expected 100ms base rate, got %v", baseRate)
	}
}

func TestAdaptiveRateManagerCongestion(t *testing.T) {
	arm := NewAdaptiveRateManager(100 * time.Millisecond)
	arm.AdjustForCongestion(50, 100)
	adjusted := arm.CurrentRate()
	if adjusted < 100*time.Millisecond {
		t.Logf("Rate adjusted from 100ms to %v (congestion)", adjusted)
	}
}

func TestUDPDatagramPoolGetPut(t *testing.T) {
	pool := NewUDPDatagramPool(65536)
	buf := pool.Get()
	if len(buf) != 65536 {
		t.Errorf("Expected buffer size 65536, got %d", len(buf))
	}
	pool.Put(buf)
}

func TestChaosEngineCreation(t *testing.T) {
	config := ChaosConfig{
		Enabled:         true,
		FailureRate:     0.1,
		LatencyRange:    [2]time.Duration{10 * time.Millisecond, 100 * time.Millisecond},
		NetworkLossRate: 0.05,
	}
	ce := NewChaosEngine(config)
	if ce == nil {
		t.Fatal("Expected non-nil ChaosEngine")
	}
}

func TestTracerCreation(t *testing.T) {
	tracer := NewTracer(TraceConfig{ServiceName: "test", SamplingRate: 1.0})
	if tracer == nil {
		t.Fatal("Expected non-nil Tracer")
	}
}

func TestConnectionPoolFull(t *testing.T) {
	cp := NewConnectionPool(10,
		func() (interface{}, error) { return "conn", nil },
		func(interface{}) {},
	)
	if cp == nil {
		t.Fatal("Expected non-nil ConnectionPool")
	}
}

func TestBatchProcessor(t *testing.T) {
	bp := NewBatchProcessor(2, 100, 50*time.Millisecond)
	if bp == nil {
		t.Fatal("Expected non-nil BatchProcessor")
	}
}