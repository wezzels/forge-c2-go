package swap

import (
	"sync"
	"testing"
	"time"
)

func TestObjectPool(t *testing.T) {
	pool := NewObjectPool(func() interface{} {
		return make([]byte, 1024)
	})

	obj := pool.Get()
	if obj == nil {
		t.Fatal("Get returned nil")
	}
	pool.Put(obj)

	for i := 0; i < 100; i++ {
		obj := pool.Get()
		pool.Put(obj)
	}
}

func TestRingBuffer(t *testing.T) {
	rb := NewRingBuffer(1024)

	data := []byte("Hello, World!")
	n := rb.Write(data)
	if n != len(data) {
		t.Errorf("Write: got %d, want %d", n, len(data))
	}

	buf := make([]byte, 100)
	n = rb.Read(buf)
	if n != len(data) {
		t.Errorf("Read: got %d, want %d", n, len(data))
	}
	if string(buf[:n]) != "Hello, World!" {
		t.Error("Data mismatch")
	}
}

func TestWorkerPool(t *testing.T) {
	wp := NewWorkerPool(4)
	defer wp.Shutdown()

	var count int
	var mu sync.Mutex

	for i := 0; i < 100; i++ {
		wp.Submit(func() {
			mu.Lock()
			count++
			mu.Unlock()
		})
	}

	time.Sleep(100 * time.Millisecond)

	if count != 100 {
		t.Errorf("Count: got %d, want 100", count)
	}
}

func TestMessageBatch(t *testing.T) {
	batch := NewMessageBatch(10)

	for i := 0; i < 10; i++ {
		msg := []byte{byte(i)}
		if !batch.Add(msg) {
			t.Error("Should be able to add 10 messages")
		}
	}

	if !batch.IsFull() {
		t.Error("Should be full")
	}

	batch.Clear()
	if batch.IsFull() {
		t.Error("Should not be full after clear")
	}
}

func TestConnectionPoolBasic(t *testing.T) {
	pool := NewConnectionPool(3,
		func() (interface{}, error) {
			return "conn", nil
		},
		func(conn interface{}) {},
	)

	// Get a connection
	conn, err := pool.Get(time.Second)
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}
	pool.Put(conn)

	// Get another
	conn, err = pool.Get(time.Second)
	if err != nil {
		t.Fatalf("Get2 failed: %v", err)
	}
	pool.Put(conn)
}
