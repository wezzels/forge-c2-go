package bmds

import (
	"testing"
	"time"
)

func TestBMDSConnection(t *testing.T) {
	conn := NewBMDSConnection("localhost", 8443, true)

	if conn.IsAuthenticated() {
		t.Error("Should not be authenticated initially")
	}

	if err := conn.Connect(); err != nil {
		t.Fatalf("Connect failed: %v", err)
	}

	if err := conn.Heartbeat(); err != nil {
		t.Fatalf("Heartbeat failed: %v", err)
	}
}

func TestTrackManager(t *testing.T) {
	tm := NewTrackManager()

	track := &BMDSTrack{
		TrackID:  1234,
		Latitude: 35.5,
		Longitude: -120.5,
		Altitude: 10000,
		Quality:  TrackQuality{DetectionConfidence: 0.9, TrackAccuracy: 0.8},
		ThreatType: ThreatSRBM,
	}

	if err := tm.AddTrack(track); err != nil {
		t.Fatalf("AddTrack failed: %v", err)
	}

	got, ok := tm.GetTrack(1234)
	if !ok {
		t.Fatal("Track should exist")
	}
	if got.Latitude != 35.5 {
		t.Errorf("Latitude: got %f, want 35.5", got.Latitude)
	}

	tracks := tm.GetAllTracks()
	if len(tracks) != 1 {
		t.Errorf("GetAllTracks: got %d, want 1", len(tracks))
	}
}

func TestTrackQuality(t *testing.T) {
	q := TrackQuality{
		DetectionConfidence: 0.95,
		TrackAccuracy:       0.85,
		SourceReliability:   4,
	}

	if q.DetectionConfidence != 0.95 {
		t.Error("DetectionConfidence mismatch")
	}
	if q.SourceReliability != 4 {
		t.Error("SourceReliability mismatch")
	}
}

func TestEngagementManager(t *testing.T) {
	em := NewEngagementManager()

	order := &EngagementOrder{
		OrderID:  1,
		TrackID:  1234,
		WeaponID: "THAAD-1",
		Authorization: EngagementAuthorization{
			AuthorizationLevel: 2,
			CommandAuthority:   "C2BMC",
			ValidUntil:         time.Now().Add(5 * time.Minute),
		},
		Priority:  100,
		Timestamp: time.Now(),
	}

	if err := em.SubmitEngagementOrder(order); err != nil {
		t.Fatalf("SubmitEngagementOrder failed: %v", err)
	}

	result := &EngagementResult{
		OrderID:      1,
		TrackID:      1234,
		Status:       EngagementComplete,
		Interception: true,
		MissDistance:  0,
		Timestamp:    time.Now(),
	}

	em.RecordEngagementResult(result)
}

func TestMessageAuthenticator(t *testing.T) {
	key := []byte("secret-key-12345")
	ma := NewMessageAuthenticator(key)

	message := []byte("BMDS track update")
	mac := ma.GenerateMAC(message)

	if !ma.VerifyMAC(message, mac) {
		t.Error("MAC should verify")
	}

	if ma.VerifyMAC([]byte("tampered"), mac) {
		t.Error("Tampered message should not verify")
	}
}

func TestThreatTypes(t *testing.T) {
	if ThreatSRBM != 1 {
		t.Errorf("ThreatSRBM: got %d, want 1", ThreatSRBM)
	}
	if ThreatICBM != 4 {
		t.Errorf("ThreatICBM: got %d, want 4", ThreatICBM)
	}
}

func TestEncodeTrack(t *testing.T) {
	track := &BMDSTrack{
		TrackID:  42,
		Latitude: 40.0,
		Longitude: -75.0,
		Altitude: 50000,
		Quality:  TrackQuality{DetectionConfidence: 0.9},
		ThreatType: ThreatSRBM,
	}

	buf := make([]byte, 256)
	n := EncodeTrack(track, buf)
	if n == 0 {
		t.Fatal("EncodeTrack returned 0")
	}
}
