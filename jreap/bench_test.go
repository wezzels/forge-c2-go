package jreap

import (
	"testing"

	"forge-c2/jreap/jseries"
)

func BenchmarkJ0Encode(b *testing.B) {
	enc := NewEncoder("bench-node", "bench-app")
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 42,
		ForceType:   2,
		Latitude:    33.75,
		Longitude:   -117.85,
		Altitude:    10000,
		Speed:       300,
		Heading:     180,
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := enc.EncodeUsing(J0_TrackManagement, j0)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkJ0Decode(b *testing.B) {
	enc := NewEncoder("bench-node", "bench-app")
	dec := NewDecoder("bench-node", "bench-app")
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 42,
		ForceType:   2,
		Latitude:    33.75,
		Longitude:   -117.85,
		Altitude:    10000,
		Speed:       300,
		Heading:     180,
	}
	encoded, _ := enc.EncodeUsing(J0_TrackManagement, j0)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, err := dec.DecodeUsing(encoded)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkJ3Encode(b *testing.B) {
	enc := NewEncoder("bench-node", "bench-app")
	j3 := &jseries.J3TrackUpdate{
		TrackNumber: 100,
		Latitude:    38.0,
		Longitude:   -77.0,
		Altitude:    5000,
		Speed:       250,
		Heading:     90,
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := enc.EncodeUsing(J3_TrackUpdate, j3)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkJ12Encode(b *testing.B) {
	enc := NewEncoder("bench-node", "bench-app")
	j12 := &jseries.J12Alert{
		AlertID:     "ALERT-001",
		AlertType:   2,
		Severity:    3,
		Latitude:    33.75,
		Longitude:   -117.85,
		Altitude:    10000,
		Speed:       300,
		Heading:     180,
		TrackNumber: 42,
		ThreatLevel: 3,
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := enc.EncodeUsing(J12_Alert, j12)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkJ28Encode(b *testing.B) {
	enc := NewEncoder("bench-node", "bench-app")
	j28 := &jseries.J28SpaceTrack{
		TrackNumber: 1,
		Latitude:    33.75,
		Longitude:   -117.85,
		Altitude:    35786000,
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := enc.EncodeUsing(J28_SatelliteOPIR, j28)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkFullRoundtrip(b *testing.B) {
	enc := NewEncoder("bench-node", "bench-app")
	dec := NewDecoder("bench-node", "bench-app")
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 42,
		ForceType:   2,
		Latitude:    33.75,
		Longitude:   -117.85,
		Altitude:    10000,
		Speed:       300,
		Heading:     180,
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		encoded, err := enc.EncodeUsing(J0_TrackManagement, j0)
		if err != nil {
			b.Fatal(err)
		}
		_, _, err = dec.DecodeUsing(encoded)
		if err != nil {
			b.Fatal(err)
		}
	}
}