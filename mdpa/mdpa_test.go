package mdpa

import (
	"testing"
	"time"
)

func TestMDPAFHeaderPackUnpack(t *testing.T) {
	h := &MDPAFHeader{
		Version:        1,
		CorrelationID:  12345,
		Timestamp:     time.Now(),
		Classification: ClassificationSecret,
		Integrity:     IntegrityHigh,
	}
	copy(h.Namespace[:], "forge-c2.test")

	buf := make([]byte, MDPAFHeaderSize)
	PackMDPAFHeader(h, buf)

	unpacked := UnpackMDPAFHeader(buf)
	if unpacked.Version != h.Version {
		t.Errorf("Version: got %d, want %d", unpacked.Version, h.Version)
	}
	if unpacked.CorrelationID != h.CorrelationID {
		t.Errorf("CorrelationID: got %d, want %d", unpacked.CorrelationID, h.CorrelationID)
	}
	if unpacked.Classification != h.Classification {
		t.Errorf("Classification: got %d, want %d", unpacked.Classification, h.Classification)
	}
}

func TestNewMDPAFTrackMetadata(t *testing.T) {
	m := NewMDPAFTrackMetadata(42, 999)
	if m.TrackNumber != 42 {
		t.Errorf("TrackNumber: got %d, want %d", m.TrackNumber, 42)
	}
	if m.Header.CorrelationID != 999 {
		t.Errorf("CorrelationID: got %d, want %d", m.Header.CorrelationID, 999)
	}
	if m.Status != TrackStatusTentative {
		t.Errorf("Status: got %d, want %d", m.Status, TrackStatusTentative)
	}
}

func TestMDPAFTrackMetadataSetLocation(t *testing.T) {
	m := NewMDPAFTrackMetadata(1, 1)
	m.SetLocation(33.7512, -117.8567, 10000)
	if m.Latitude != 33.7512 {
		t.Errorf("Latitude: got %f, want %f", m.Latitude, 33.7512)
	}
	if m.Longitude != -117.8567 {
		t.Errorf("Longitude: got %f, want %f", m.Longitude, -117.8567)
	}
	if m.Altitude != 10000 {
		t.Errorf("Altitude: got %v, want %v", m.Altitude, 10000)
	}
}

func TestMDPAFTrackMetadataSetMotion(t *testing.T) {
	m := NewMDPAFTrackMetadata(1, 1)
	m.SetMotion(90.0, 250.0, 10.0)
	if m.Heading != 90.0 {
		t.Errorf("Heading: got %f, want %f", m.Heading, 90.0)
	}
	if m.Speed != 250.0 {
		t.Errorf("Speed: got %f, want %f", m.Speed, 250.0)
	}
	if m.VerticalVelocity != 10.0 {
		t.Errorf("VerticalVelocity: got %f, want %f", m.VerticalVelocity, 10.0)
	}
}

func TestMDPAFTrackMetadataSetQuality(t *testing.T) {
	m := NewMDPAFTrackMetadata(1, 1)
	m.SetQuality(100.0, 95.5, 88.0)
	if m.TrackAccuracy != 100.0 {
		t.Errorf("TrackAccuracy: got %f, want %f", m.TrackAccuracy, 100.0)
	}
	if m.TrackConfidence != 95.5 {
		t.Errorf("TrackConfidence: got %f, want %f", m.TrackConfidence, 95.5)
	}
	if m.CorrelationScore != 88.0 {
		t.Errorf("CorrelationScore: got %f, want %f", m.CorrelationScore, 88.0)
	}
}

func TestMDPAFTrackMetadataConfirm(t *testing.T) {
	m := NewMDPAFTrackMetadata(1, 1)
	if m.Status != TrackStatusTentative {
		t.Errorf("Initial status: got %d, want %d", m.Status, TrackStatusTentative)
	}
	m.Confirm()
	if m.Status != TrackStatusConfirmed {
		t.Errorf("After confirm: got %d, want %d", m.Status, TrackStatusConfirmed)
	}
}

func TestMDPAFTrackMetadataJamming(t *testing.T) {
	m := NewMDPAFTrackMetadata(1, 1)
	if m.JammingFlag != false {
		t.Errorf("Initial jamming: got %v, want false", m.JammingFlag)
	}
	m.SetJamming(true)
	if m.JammingFlag != true {
		t.Errorf("After SetJamming: got %v, want true", m.JammingFlag)
	}
}

func TestMDPAFTrackMetadataFusion(t *testing.T) {
	m := NewMDPAFTrackMetadata(1, 1)
	if m.FusionFlag != false {
		t.Errorf("Initial fusion: got %v, want false", m.FusionFlag)
	}
	m.SetFusion(true)
	if m.FusionFlag != true {
		t.Errorf("After SetFusion: got %v, want true", m.FusionFlag)
	}
}

func TestMDPAFTrackMetadataRoundtrip(t *testing.T) {
	m := NewMDPAFTrackMetadata(42, 12345)
	m.Header.Classification = ClassificationSecret
	m.Header.Integrity = IntegrityHigh
	m.SetLocation(33.7512, -117.8567, 10000)
	m.SetMotion(45.0, 300.0, 5.0)
	m.SetQuality(50.0, 90.0, 85.0)
	m.Confirm()
	m.SetJamming(false)
	m.SetFusion(true)
	m.SensorID = "RADAR-1"
	m.SourceSystem = "FORGE-C2"
	m.PlatformType = 5
	m.CountryCode = 200

	buf := make([]byte, 512)
	n := PackMDPAFTrackMetadata(m, buf)

	unpacked := UnpackMDPAFTrackMetadata(buf[:n])

	if unpacked.TrackNumber != m.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, m.TrackNumber)
	}
	if unpacked.Header.CorrelationID != m.Header.CorrelationID {
		t.Errorf("CorrelationID: got %d, want %d", unpacked.Header.CorrelationID, m.Header.CorrelationID)
	}
	if unpacked.Latitude != m.Latitude {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, m.Latitude)
	}
	if unpacked.Speed != m.Speed {
		t.Errorf("Speed: got %f, want %f", unpacked.Speed, m.Speed)
	}
	if unpacked.Status != TrackStatusConfirmed {
		t.Errorf("Status: got %d, want %d", unpacked.Status, TrackStatusConfirmed)
	}
}

func TestMDPAFTrackMetadataString(t *testing.T) {
	m := NewMDPAFTrackMetadata(42, 999)
	m.Header.Classification = ClassificationSecret
	m.SetLocation(33.7512, -117.8567, 10000)
	m.SetMotion(90.0, 250.0, 0)

	s := m.String()
	if s == "" {
		t.Error("String() returned empty")
	}
	t.Logf("MDPAF String: %s", s)
}

func TestMDPAFHeaderSize(t *testing.T) {
	buf := make([]byte, MDPAFHeaderSize)
	h := &MDPAFHeader{}
	PackMDPAFHeader(h, buf)
	if len(buf) != MDPAFHeaderSize {
		t.Errorf("MDPAFHeaderSize: got %d, want %d", len(buf), MDPAFHeaderSize)
	}
}
