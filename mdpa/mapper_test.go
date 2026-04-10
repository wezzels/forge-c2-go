package mdpa

import (
	"forge-c2/jreap/jseries"
	"math"
	"testing"
)

func floatApproxEq(a, b, tol float64) bool {
	return math.Abs(a-b) <= tol
}

func TestJSeriesToMDPAF(t *testing.T) {
	j0 := &jseries.J0TrackManagement{
		TrackNumber:  42,
		Latitude:     33.7512,
		Longitude:   -117.8567,
		Altitude:    10000,
		Heading:     90.0,
		Speed:       250.0,
		ForceType:   2,
		Quality:     jseries.QualityIndicator{Quality: 3},
		SensorID:   "RADAR-1",
	}

	m := JSeriesToMDPAF(j0)

	if m.TrackNumber != 42 {
		t.Errorf("TrackNumber: got %d, want %d", m.TrackNumber, 42)
	}
	if m.Latitude != 33.7512 {
		t.Errorf("Latitude: got %f, want %f", m.Latitude, 33.7512)
	}
	if m.SensorID != "RADAR-1" {
		t.Errorf("SensorID: got %s, want %s", m.SensorID, "RADAR-1")
	}
	if m.Header.Classification != ClassificationConfidential {
		t.Errorf("Classification: got %d, want %d", m.Header.Classification, ClassificationConfidential)
	}
}

func TestMDPAFToJSeries(t *testing.T) {
	m := NewMDPAFTrackMetadata(42, 0)
	m.Header.Classification = ClassificationSecret
	m.SetLocation(33.7512, -117.8567, 10000)
	m.SetMotion(90.0, 250.0, 0)

	trackNum, lat, _, _, heading, _, forceType := MDPAFToJSeries(m)

	if trackNum != 42 {
		t.Errorf("TrackNumber: got %d, want %d", trackNum, 42)
	}
	if lat != 33.7512 {
		t.Errorf("Latitude: got %f, want %f", lat, 33.7512)
	}
	if forceType != 3 {
		t.Errorf("ForceType: got %d, want %d", forceType, 3)
	}
	if heading != 90.0 {
		t.Errorf("Heading: got %f, want %f", heading, 90.0)
	}
}

func TestMDPAFRoundtrip(t *testing.T) {
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 100,
		Latitude:   40.7128,
		Longitude:  -74.0060,
		Altitude:   5000,
		Heading:    180.0,
		Speed:      300.0,
		ForceType:  3,
		Quality:    jseries.QualityIndicator{Quality: 2},
		SensorID:  "SENSOR-A",
	}

	m := JSeriesToMDPAF(j0)
	trackNum, lat, _, _, heading, _, forceType := MDPAFToJSeries(m)

	if trackNum != j0.TrackNumber {
		t.Errorf("TrackNumber roundtrip: got %d, want %d", trackNum, j0.TrackNumber)
	}
	if lat != j0.Latitude {
		t.Errorf("Latitude roundtrip: got %f, want %f", lat, j0.Latitude)
	}
	if heading != j0.Heading {
		t.Errorf("Heading roundtrip: got %f, want %f", heading, j0.Heading)
	}
	if forceType != j0.ForceType {
		t.Errorf("ForceType roundtrip: got %d, want %d", forceType, j0.ForceType)
	}
}

func TestMDPAFQualityMapping(t *testing.T) {
	tests := []struct {
		qi     jseries.QualityIndicator
		expect float64
	}{
		{jseries.QualityIndicator{Quality: 0}, 0.0},
		{jseries.QualityIndicator{Quality: 1}, 33.33},
		{jseries.QualityIndicator{Quality: 2}, 66.67},
		{jseries.QualityIndicator{Quality: 3}, 100.0},
	}

	for _, tt := range tests {
		j0 := &jseries.J0TrackManagement{Quality: tt.qi}
		m := JSeriesToMDPAF(j0)
		if !floatApproxEq(m.TrackConfidence, tt.expect, 0.1) {
			t.Errorf("Quality %d: got %f, want %f", tt.qi.Quality, m.TrackConfidence, tt.expect)
		}
	}
}
