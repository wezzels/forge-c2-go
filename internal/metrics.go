// Package internal provides Prometheus metrics for FORGE-C2.
package internal

import (
	"sync/atomic"
	"time"
)

// Metrics holds Prometheus-compatible counters and gauges for FORGE-C2.
type Metrics struct {
	// Counters
	SensorEventsProcessed atomic.Int64
	TracksCreated         atomic.Int64
	TracksUpdated         atomic.Int64
	TracksDropped         atomic.Int64
	JREAPMessagesEncoded  atomic.Int64
	JREAPMessagesDecoded  atomic.Int64
	JREAPEncodeErrors     atomic.Int64
	JREAPDecodeErrors     atomic.Int64
	DISPDUsSent           atomic.Int64
	DISPDUsReceived       atomic.Int64
	HLAUpdatesSent        atomic.Int64
	HLAUpdatesReceived    atomic.Int64
	EngagementOrders      atomic.Int64
	EngagementComplete    atomic.Int64
	AlertsGenerated      atomic.Int64
	WSMessagesSent        atomic.Int64
	WSMessagesRecv        atomic.Int64
	HTTPRequests          atomic.Int64
	HTTPErrors            atomic.Int64

	// Gauges (use atomic value)
	ActiveTracks       atomic.Int64
	ActiveWSClients    atomic.Int64
	ActiveEngagements  atomic.Int64
	CorrelatorQueueLen atomic.Int64

	// Histogram-like (simplified: just track count and sum for averaging)
	EncodeLatencyNs  atomic.Int64
	EncodeLatencyCnt atomic.Int64
	DecodeLatencyNs  atomic.Int64
	DecodeLatencyCnt atomic.Int64

	// Uptime
	StartTime time.Time
}

// GlobalMetrics is the default metrics instance.
var GlobalMetrics = &Metrics{
	StartTime: time.Now().UTC(),
}

// RecordEncodeLatency records a JREAP encode latency measurement.
func (m *Metrics) RecordEncodeLatency(d time.Duration) {
	m.EncodeLatencyNs.Add(int64(d))
	m.EncodeLatencyCnt.Add(1)
}

// RecordDecodeLatency records a JREAP decode latency measurement.
func (m *Metrics) RecordDecodeLatency(d time.Duration) {
	m.DecodeLatencyNs.Add(int64(d))
	m.DecodeLatencyCnt.Add(1)
}

// AvgEncodeLatency returns the average encode latency.
func (m *Metrics) AvgEncodeLatency() time.Duration {
	cnt := m.EncodeLatencyCnt.Load()
	if cnt == 0 {
		return 0
	}
	return time.Duration(m.EncodeLatencyNs.Load() / cnt)
}

// AvgDecodeLatency returns the average decode latency.
func (m *Metrics) AvgDecodeLatency() time.Duration {
	cnt := m.DecodeLatencyCnt.Load()
	if cnt == 0 {
		return 0
	}
	return time.Duration(m.DecodeLatencyNs.Load() / cnt)
}

// Uptime returns the time since the server started.
func (m *Metrics) Uptime() time.Duration {
	return time.Since(m.StartTime)
}

// PrometheusFormat outputs metrics in Prometheus exposition format.
func (m *Metrics) PrometheusFormat() string {
	var b []byte

	writeMetric := func(name, mtype string, value int64, labels string) {
		b = append(b, "# TYPE forge_c2_"+name+" "+mtype+"\n"...)
		if labels != "" {
			b = append(b, "forge_c2_"+name+"{"+labels+"} "+itoa(value)+"\n"...)
		} else {
			b = append(b, "forge_c2_"+name+" "+itoa(value)+"\n"...)
		}
	}

	writeMetric("sensor_events_processed_total", "counter", m.SensorEventsProcessed.Load(), "")
	writeMetric("tracks_created_total", "counter", m.TracksCreated.Load(), "")
	writeMetric("tracks_updated_total", "counter", m.TracksUpdated.Load(), "")
	writeMetric("tracks_dropped_total", "counter", m.TracksDropped.Load(), "")
	writeMetric("jreap_messages_encoded_total", "counter", m.JREAPMessagesEncoded.Load(), "")
	writeMetric("jreap_messages_decoded_total", "counter", m.JREAPMessagesDecoded.Load(), "")
	writeMetric("jreap_encode_errors_total", "counter", m.JREAPEncodeErrors.Load(), "")
	writeMetric("jreap_decode_errors_total", "counter", m.JREAPDecodeErrors.Load(), "")
	writeMetric("dis_pdus_sent_total", "counter", m.DISPDUsSent.Load(), "")
	writeMetric("dis_pdus_received_total", "counter", m.DISPDUsReceived.Load(), "")
	writeMetric("hla_updates_sent_total", "counter", m.HLAUpdatesSent.Load(), "")
	writeMetric("hla_updates_received_total", "counter", m.HLAUpdatesReceived.Load(), "")
	writeMetric("engagement_orders_total", "counter", m.EngagementOrders.Load(), "")
	writeMetric("engagement_complete_total", "counter", m.EngagementComplete.Load(), "")
	writeMetric("alerts_generated_total", "counter", m.AlertsGenerated.Load(), "")
	writeMetric("ws_messages_sent_total", "counter", m.WSMessagesSent.Load(), "")
	writeMetric("ws_messages_received_total", "counter", m.WSMessagesRecv.Load(), "")
	writeMetric("http_requests_total", "counter", m.HTTPRequests.Load(), "")
	writeMetric("http_errors_total", "counter", m.HTTPErrors.Load(), "")

	writeMetric("active_tracks", "gauge", m.ActiveTracks.Load(), "")
	writeMetric("active_ws_clients", "gauge", m.ActiveWSClients.Load(), "")
	writeMetric("active_engagements", "gauge", m.ActiveEngagements.Load(), "")

	// Latency as microseconds
	avgEnc := m.AvgEncodeLatency().Microseconds()
	avgDec := m.AvgDecodeLatency().Microseconds()
	writeMetric("jreap_encode_latency_avg_us", "gauge", avgEnc, "")
	writeMetric("jreap_decode_latency_avg_us", "gauge", avgDec, "")

	// Uptime
	writeMetric("uptime_seconds", "gauge", int64(m.Uptime().Seconds()), "")

	return string(b)
}

func itoa(v int64) string {
	if v == 0 {
		return "0"
	}
	neg := false
	if v < 0 {
		neg = true
		v = -v
	}
	var buf [20]byte
	i := len(buf)
	for v > 0 {
		i--
		buf[i] = byte('0' + v%10)
		v /= 10
	}
	if neg {
		i--
		buf[i] = '-'
	}
	return string(buf[i:])
}