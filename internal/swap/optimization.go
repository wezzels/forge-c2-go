package swap

import (
	"sync"
	"sync/atomic"
	"time"
)

// ObjectPool provides pre-allocated objects to reduce GC pressure
type ObjectPool struct {
	pool sync.Pool
}

// NewObjectPool creates a new object pool
func NewObjectPool(factory func() interface{}) *ObjectPool {
	return &ObjectPool{
		pool: sync.Pool{New: factory},
	}
}

// Get retrieves an object from the pool
func (p *ObjectPool) Get() interface{} {
	return p.pool.Get()
}

// Put returns an object to the pool
func (p *ObjectPool) Put(obj interface{}) {
	p.pool.Put(obj)
}

// RingBuffer is a lock-free ring buffer for streaming data
type RingBuffer struct {
	buffer []byte
	size   int
	mask   int
	head   atomic.Int64
	tail   atomic.Int64
}

// NewRingBuffer creates a new ring buffer
func NewRingBuffer(capacity int) *RingBuffer {
	size := 1
	for size < capacity {
		size *= 2
	}
	return &RingBuffer{
		buffer: make([]byte, size),
		size:   size,
		mask:   size - 1,
	}
}

// Write writes data to the ring buffer
func (r *RingBuffer) Write(data []byte) int {
	head := r.head.Load()
	tail := r.tail.Load()
	avail := r.size - int(head-tail)
	if len(data) > avail {
		data = data[:avail]
	}
	copy(r.buffer[int(head)&r.mask:], data)
	r.head.Store(head + int64(len(data)))
	return len(data)
}

// Read reads data from the ring buffer
func (r *RingBuffer) Read(buf []byte) int {
	tail := r.tail.Load()
	head := r.head.Load()
	avail := int(head - tail)
	if len(buf) > avail {
		buf = buf[:avail]
	}
	copy(buf, r.buffer[int(tail)&r.mask:])
	r.tail.Store(tail + int64(len(buf)))
	return len(buf)
}

// Available returns bytes available to read
func (r *RingBuffer) Available() int {
	return int(r.head.Load() - r.tail.Load())
}

// WorkerPool manages a pool of goroutines for parallel processing
type WorkerPool struct {
	jobs    chan func()
	wg      sync.WaitGroup
	workers int
}

// NewWorkerPool creates a new worker pool
func NewWorkerPool(workers int) *WorkerPool {
	wp := &WorkerPool{
		jobs:    make(chan func(), workers*2),
		workers: workers,
	}
	for i := 0; i < workers; i++ {
		wp.wg.Add(1)
		go func() {
			defer wp.wg.Done()
			for job := range wp.jobs {
				job()
			}
		}()
	}
	return wp
}

// Submit submits a job to the worker pool
func (wp *WorkerPool) Submit(job func()) {
	wp.jobs <- job
}

// Shutdown waits for all workers to complete
func (wp *WorkerPool) Shutdown() {
	close(wp.jobs)
	wp.wg.Wait()
}

// MessageBatch holds a batch of messages for processing
type MessageBatch struct {
	messages [][]byte
	maxSize  int
}

// NewMessageBatch creates a new message batch
func NewMessageBatch(maxSize int) *MessageBatch {
	return &MessageBatch{
		messages: make([][]byte, 0, maxSize),
		maxSize:  maxSize,
	}
}

// Add adds a message to the batch
func (b *MessageBatch) Add(msg []byte) bool {
	if len(b.messages) >= b.maxSize {
		return false
	}
	b.messages = append(b.messages, msg)
	return true
}

// IsFull returns true if batch is full
func (b *MessageBatch) IsFull() bool {
	return len(b.messages) >= b.maxSize
}

// Clear resets the batch
func (b *MessageBatch) Clear() {
	b.messages = b.messages[:0]
}

// ConnectionPool manages a pool of connections
type ConnectionPool struct {
	connections chan interface{}
	maxSize     int
	factory     func() (interface{}, error)
	cleanup     func(interface{})
}

// NewConnectionPool creates a new connection pool
func NewConnectionPool(maxSize int, factory func() (interface{}, error), cleanup func(interface{})) *ConnectionPool {
	pool := &ConnectionPool{
		connections: make(chan interface{}, maxSize),
		maxSize:     maxSize,
		factory:     factory,
		cleanup:     cleanup,
	}
	for i := 0; i < maxSize/2; i++ {
		if conn, err := factory(); err == nil {
			pool.connections <- conn
		}
	}
	return pool
}

// Get retrieves a connection from the pool
func (p *ConnectionPool) Get(timeout time.Duration) (interface{}, error) {
	select {
	case conn := <-p.connections:
		return conn, nil
	case <-time.After(timeout):
		return nil, ErrPoolExhausted
	}
}

// Put returns a connection to the pool
func (p *ConnectionPool) Put(conn interface{}) {
	select {
	case p.connections <- conn:
	default:
		if p.cleanup != nil {
			p.cleanup(conn)
		}
	}
}

// ErrPoolExhausted is returned when pool is exhausted
var ErrPoolExhausted = &PoolError{msg: "connection pool exhausted"}

type PoolError struct {
	msg string
}

func (e *PoolError) Error() string {
	return e.msg
}

// BatchProcessor processes items in batches for efficiency
type BatchProcessor struct {
	pool          *WorkerPool
	batchSize     int
	flushInterval time.Duration
}

// NewBatchProcessor creates a new batch processor
func NewBatchProcessor(workers int, batchSize int, flushInterval time.Duration) *BatchProcessor {
	return &BatchProcessor{
		pool:          NewWorkerPool(workers),
		batchSize:     batchSize,
		flushInterval: flushInterval,
	}
}
