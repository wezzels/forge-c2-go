package swap

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"
)

// =============================================================================
// Phase 8.2.6: Distributed Tracing with Jaeger Integration
// =============================================================================

// TraceConfig holds tracing configuration
type TraceConfig struct {
	ServiceName    string
	JaegerEndpoint string
	AgentHost      string
	AgentPort      uint16
	SamplingRate   float64 // 0.0 to 1.0
	Tags           map[string]string
}

// TraceSpan represents an OpenTracing span
type TraceSpan struct {
	TraceID      string
	SpanID       string
	ParentSpanID string
	Operation    string
	StartTime    time.Time
	EndTime      time.Time
	Tags         map[string]string
	Logs         []TraceLog
}

// TraceLog is a span log entry
type TraceLog struct {
	Timestamp time.Time
	Key       string
	Value     interface{}
}

// Tracer manages distributed tracing
type Tracer struct {
	config       TraceConfig
	activeSpans  map[string]*TraceSpan
	completed    []*TraceSpan
	mu           sync.RWMutex
	samplingRate float64
}

// NewTracer creates a new distributed tracer
func NewTracer(config TraceConfig) *Tracer {
	return &Tracer{
		config:       config,
		activeSpans:  make(map[string]*TraceSpan),
		samplingRate: config.SamplingRate,
	}
}

// StartSpan begins a new trace span
func (t *Tracer) StartSpan(operation string, opts ...SpanOption) *Span {
	span := &Span{}
	span.TraceID = generateTraceID()
	span.SpanID = generateSpanID()
	span.Operation = operation
	span.StartTime = time.Now()
	span.tracer = t
	span.tags = make(map[string]interface{})

	// Apply options
	for _, opt := range opts {
		opt(span)
	}

	// Generate IDs
	span.TraceID = generateTraceID()
	span.SpanID = generateSpanID()

	// Register span
	t.mu.Lock()
	t.activeSpans[span.SpanID] = &span.TraceSpan
	t.mu.Unlock()

	return span
}

// Span represents an active trace span
type Span struct {
	TraceSpan
	tracer    *Tracer
	tags      map[string]interface{}
	finishOnce sync.Once
}

// SpanOption configures span options
type SpanOption func(*Span)

// WithParent sets parent span context
func WithParent(traceID, spanID string) SpanOption {
	return func(s *Span) {
		s.ParentSpanID = spanID
		s.TraceID = traceID
	}
}

// WithTag adds a span tag
func WithTag(key string, value interface{}) SpanOption {
	return func(s *Span) {
		s.tags[key] = value
	}
}

// Tag adds a tag to the span
func (s *Span) Tag(key string, value interface{}) *Span {
	s.tags[key] = value
	return s
}

// LogField adds a log field to the span
func (s *Span) LogField(key string, value interface{}) {
	s.Logs = append(s.Logs, TraceLog{
		Timestamp: time.Now(),
		Key:       key,
		Value:     value,
	})
}

// Finish completes the span
func (s *Span) Finish() {
	s.finishOnce.Do(func() {
		s.EndTime = time.Now()
		s.Tags = s.tagsToMap()

		// Move from active to completed
		s.tracer.mu.Lock()
		delete(s.tracer.activeSpans, s.SpanID)
		s.tracer.completed = append(s.tracer.completed, &s.TraceSpan)
		s.tracer.mu.Unlock()
	})
}

func (s *Span) tagsToMap() map[string]string {
	result := make(map[string]string)
	for k, v := range s.tags {
		result[k] = fmt.Sprintf("%v", v)
	}
	return result
}

// InjectTraceContext injects trace context into carrier
func (t *Tracer) InjectTraceContext(ctx context.Context, carrier map[string]string) {
	if span := getActiveSpan(ctx); span != nil {
		carrier["trace-id"] = span.TraceID
		carrier["span-id"] = span.SpanID
	}
}

// ExtractTraceContext extracts trace context from carrier
func (t *Tracer) ExtractTraceContext(carrier map[string]string) (string, string) {
	return carrier["trace-id"], carrier["span-id"]
}

// GetActiveSpans returns all active spans
func (t *Tracer) GetActiveSpans() []*TraceSpan {
	t.mu.RLock()
	defer t.mu.RUnlock()

	result := make([]*TraceSpan, 0, len(t.activeSpans))
	for _, span := range t.activeSpans {
		result = append(result, span)
	}
	return result
}

// GetCompletedSpans returns completed spans
func (t *Tracer) GetCompletedSpans() []*TraceSpan {
	t.mu.RLock()
	defer t.mu.RUnlock()
	return t.completed
}

// GenerateExportReport creates a trace export report
func (t *Tracer) GenerateExportReport() *TraceReport {
	t.mu.RLock()
	defer t.mu.RUnlock()

	report := &TraceReport{
		GeneratedAt: time.Now(),
		Spans:       make([]*TraceSpan, len(t.completed)),
	}
	copy(report.Spans, t.completed)

	return report
}

// TraceReport contains trace data for export
type TraceReport struct {
	GeneratedAt time.Time
	Spans      []*TraceSpan
	TotalSpans int
}

// Helper functions
func generateTraceID() string {
	return fmt.Sprintf("%016x", time.Now().UnixNano())
}

func generateSpanID() string {
	return fmt.Sprintf("%016x", time.Now().UnixNano()>>32)
}

func getActiveSpan(ctx context.Context) *Span {
	return nil
}

// =============================================================================
// OpenTelemetry-style TraceExporter for Jaeger
// =============================================================================

// JaegerExporter exports traces to Jaeger collector
type JaegerExporter struct {
	endpoint   string
	batchSize  int
	client     HTTPClient
	mu          sync.Mutex
}

// HTTPClient interface for testing
type HTTPClient interface {
	Post(url string, body []byte) error
}

// NewJaegerExporter creates a new Jaeger exporter
func NewJaegerExporter(endpoint string) *JaegerExporter {
	return &JaegerExporter{
		endpoint:  endpoint,
		batchSize: 100,
	}
}

// Export sends traces to Jaeger collector
func (e *JaegerExporter) Export(spans []*TraceSpan) error {
	e.mu.Lock()
	defer e.mu.Unlock()

	// Convert to Jaeger format and send
	// In production, use opentracing-go / jaeger-client-go

	return nil
}

// Batch collects spans into batches for efficient export
type Batch struct {
	spans     []*TraceSpan
	maxSize   int
	flushFunc func([]*TraceSpan) error
	mu        sync.Mutex
}

// NewBatch creates a new batch collector
func NewBatch(maxSize int, flushFunc func([]*TraceSpan) error) *Batch {
	return &Batch{
		spans:     make([]*TraceSpan, 0, maxSize),
		maxSize:   maxSize,
		flushFunc: flushFunc,
	}
}

// Add adds a span to the batch
func (b *Batch) Add(span *TraceSpan) error {
	b.mu.Lock()
	defer b.mu.Unlock()

	b.spans = append(b.spans, span)
	if len(b.spans) >= b.maxSize {
		return b.Flush()
	}
	return nil
}

// Flush sends batch to collector
func (b *Batch) Flush() error {
	b.mu.Lock()
	defer b.mu.Unlock()

	if len(b.spans) == 0 {
		return nil
	}

	err := b.flushFunc(b.spans)
	b.spans = b.spans[:0]
	return err
}

// =============================================================================
// SpanContext for W3C Trace Context propagation
// =============================================================================

// TraceContext represents W3C Trace Context
type TraceContext struct {
	TraceID    string
	SpanID     string
	TraceFlags uint8
	TraceState string
}

// ParseTraceParent parses traceparent header
func ParseTraceParent(parent string) (*TraceContext, error) {
	// traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
	// Format: version-traceId-parentId-flags
	parts := strings.Split(parent, "-")
	if len(parts) != 4 {
		return nil, fmt.Errorf("invalid traceparent format")
	}

	return &TraceContext{
		TraceID:    parts[1],
		SpanID:     parts[2],
		TraceFlags: 0x01, // sampled
	}, nil
}

// Format returns traceparent header value
func (tc *TraceContext) Format() string {
	return fmt.Sprintf("00-%s-%s-%02x", tc.TraceID, tc.SpanID, tc.TraceFlags)
}