package internal

import (
	"strings"
	"testing"
	"time"
)

func TestMetricsPrometheusFormat(t *testing.T) {
	m := &Metrics{StartTime: time.Now().UTC()}
	m.SensorEventsProcessed.Add(100)
	m.TracksCreated.Add(10)
	m.JREAPMessagesEncoded.Add(50)
	m.ActiveTracks.Store(5)

	output := m.PrometheusFormat()
	if !strings.Contains(output, "forge_c2_sensor_events_processed_total 100") {
		t.Error("missing sensor_events metric")
	}
	if !strings.Contains(output, "forge_c2_tracks_created_total 10") {
		t.Error("missing tracks_created metric")
	}
	if !strings.Contains(output, "forge_c2_jreap_messages_encoded_total 50") {
		t.Error("missing jreap_encoded metric")
	}
	if !strings.Contains(output, "forge_c2_active_tracks 5") {
		t.Error("missing active_tracks metric")
	}
	if !strings.Contains(output, "forge_c2_uptime_seconds") {
		t.Error("missing uptime metric")
	}
}

func TestMetricsLatency(t *testing.T) {
	m := &Metrics{StartTime: time.Now().UTC()}
	m.RecordEncodeLatency(5 * time.Millisecond)
	m.RecordEncodeLatency(15 * time.Millisecond)

	avg := m.AvgEncodeLatency()
	if avg < 9*time.Millisecond || avg > 11*time.Millisecond {
		t.Errorf("average encode latency: got %v, want ~10ms", avg)
	}
}

func TestGlobalMetrics(t *testing.T) {
	GlobalMetrics.SensorEventsProcessed.Add(1)
	if GlobalMetrics.SensorEventsProcessed.Load() == 0 {
		t.Error("GlobalMetrics not working")
	}
}

func TestMetricsUptime(t *testing.T) {
	m := &Metrics{StartTime: time.Now().UTC()}
	if m.Uptime() < 0 {
		t.Error("uptime should not be negative")
	}
}