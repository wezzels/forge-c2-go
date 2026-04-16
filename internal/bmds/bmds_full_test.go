package bmds

import (
	"bytes"
	"testing"
	"time"
)

func TestBMDSConnectionCreation(t *testing.T) {
	conn := NewBMDSConnection("localhost", 5002, false)
	if conn == nil {
		t.Fatal("Expected non-nil connection")
	}
	if conn.IsAuthenticated() {
		t.Error("Expected not authenticated initially")
	}
	// Connect will fail since there's no server, but it shouldn't panic
	_ = conn.Connect()
}

func TestBMDSConnectionTLS(t *testing.T) {
	conn := NewBMDSConnection("bmds.example.com", 443, true)
	if conn == nil {
		t.Fatal("Expected non-nil connection with TLS")
	}
}

func TestBMDSHeartbeat(t *testing.T) {
	conn := NewBMDSConnection("localhost", 5002, false)
	// Heartbeat will fail without a connection
	_ = conn.Heartbeat()
}

func TestTrackManagerAddGet(t *testing.T) {
	tm := NewTrackManager()
	track := &BMDSTrack{
		TrackID:  1,
		Latitude: 33.75,
		Longitude: -117.85,
		Altitude: 10000,
		Velocity: 300,
		Heading:  180,
	}
	if err := tm.AddTrack(track); err != nil {
		t.Fatalf("AddTrack failed: %v", err)
	}
	got, ok := tm.GetTrack(1)
	if !ok {
		t.Fatal("Expected to find track 1")
	}
	if got.TrackID != 1 {
		t.Errorf("Expected TrackID=1, got %d", got.TrackID)
	}
	if got.Latitude != 33.75 {
		t.Errorf("Expected Latitude=33.75, got %f", got.Latitude)
	}
}

func TestTrackManagerNilTrack(t *testing.T) {
	tm := NewTrackManager()
	if err := tm.AddTrack(nil); err == nil {
		t.Error("Expected error for nil track")
	}
}

func TestTrackManagerGetMissing(t *testing.T) {
	tm := NewTrackManager()
	_, ok := tm.GetTrack(999)
	if ok {
		t.Error("Expected track 999 to not exist")
	}
}

func TestTrackManagerGetAll(t *testing.T) {
	tm := NewTrackManager()
	for i := uint32(1); i <= 5; i++ {
		tm.AddTrack(&BMDSTrack{TrackID: i, Latitude: float64(i) * 10})
	}
	tracks := tm.GetAllTracks()
	if len(tracks) != 5 {
		t.Errorf("Expected 5 tracks, got %d", len(tracks))
	}
}

func TestTrackManagerOverwrite(t *testing.T) {
	tm := NewTrackManager()
	track1 := &BMDSTrack{TrackID: 1, Latitude: 33.75}
	tm.AddTrack(track1)
	// AddTrack overwrites if same ID
	track2 := &BMDSTrack{TrackID: 1, Latitude: 34.0}
	tm.AddTrack(track2)
	got, _ := tm.GetTrack(1)
	if got.Latitude != 34.0 {
		t.Errorf("Expected Latitude=34.0 after overwrite, got %f", got.Latitude)
	}
}

func TestEngagementManagerWithAuth(t *testing.T) {
	em := NewEngagementManager()
	order := &EngagementOrder{
		OrderID:  1,
		TrackID:  100,
		WeaponID: "THAAD",
		ShooterID: "SH-01",
		Authorization: EngagementAuthorization{
			AuthorizationLevel: 1,
			CommandAuthority:   "C2BMC",
			ValidUntil:         time.Now().Add(time.Hour),
		},
	}
	if err := em.SubmitEngagementOrder(order); err != nil {
		t.Fatalf("SubmitEngagementOrder failed: %v", err)
	}
}

func TestEngagementManagerNoAuth(t *testing.T) {
	em := NewEngagementManager()
	order := &EngagementOrder{
		OrderID:  1,
		TrackID:  100,
		WeaponID: "THAAD",
	}
	if err := em.SubmitEngagementOrder(order); err == nil {
		t.Error("Expected error for missing authorization")
	}
}

func TestEngagementManagerNoTrackID(t *testing.T) {
	em := NewEngagementManager()
	order := &EngagementOrder{
		OrderID:  1,
		TrackID:  0,
	}
	if err := em.SubmitEngagementOrder(order); err == nil {
		t.Error("Expected error for zero track ID")
	}
}

func TestEngagementCallback(t *testing.T) {
	em := NewEngagementManager()
	called := false
	em.OnEngagement(func(o *EngagementOrder) error {
		called = true
		return nil
	})
	em.SubmitEngagementOrder(&EngagementOrder{
		OrderID: 2, TrackID: 200,
		Authorization: EngagementAuthorization{AuthorizationLevel: 1},
	})
	_ = called
}

func TestEngagementResult(t *testing.T) {
	em := NewEngagementManager()
	em.SubmitEngagementOrder(&EngagementOrder{
		OrderID: 1, TrackID: 100,
		Authorization: EngagementAuthorization{AuthorizationLevel: 1},
	})
	result := &EngagementResult{
		OrderID:      1,
		TrackID:      100,
		Interception: true,
	}
	em.RecordEngagementResult(result)
}

func TestMessageAuthenticator(t *testing.T) {
	key := []byte("test-secret-key-32-bytes-long!!!")
	ma := NewMessageAuthenticator(key)
	msg := []byte("test message")
	mac := ma.GenerateMAC(msg)
	if len(mac) == 0 {
		t.Error("Expected non-empty MAC")
	}
	if !ma.VerifyMAC(msg, mac) {
		t.Error("MAC verification failed for correct MAC")
	}
	if ma.VerifyMAC([]byte("wrong"), mac) {
		t.Error("MAC should not verify for wrong message")
	}
}

func TestMessageAuthenticatorDifferentKeys(t *testing.T) {
	ma1 := NewMessageAuthenticator([]byte("key-1-key-1-key-1-key-1-key-1!"))
	ma2 := NewMessageAuthenticator([]byte("key-2-key-2-key-2-key-2-key-2!"))
	msg := []byte("same message")
	mac1 := ma1.GenerateMAC(msg)
	mac2 := ma2.GenerateMAC(msg)
	if bytes.Equal(mac1, mac2) {
		t.Error("Different keys should produce different MACs")
	}
}

func TestEncodeTrack(t *testing.T) {
	track := &BMDSTrack{
		TrackID:  42,
		Latitude: 33.75,
		Longitude: -117.85,
		Altitude: 10000,
		Velocity: 300,
		Heading:  180,
	}
	buf := make([]byte, 256)
	n := EncodeTrack(track, buf)
	if n == 0 {
		t.Error("EncodeTrack returned 0 bytes")
	}
}

func TestEmulatorCreation(t *testing.T) {
	tpy2 := NewTPY2Emulator()
	if tpy2 == nil {
		t.Fatal("Expected non-nil TPY2Emulator")
	}
	gbr := NewGBREmulator()
	if gbr == nil {
		t.Fatal("Expected non-nil GBREmulator")
	}
	aegis := NewAegisEmulator()
	if aegis == nil {
		t.Fatal("Expected non-nil AegisEmulator")
	}
	thaad := NewTHAADEmulator()
	if thaad == nil {
		t.Fatal("Expected non-nil THAADEmulator")
	}
	patriot := NewPatriotEmulator()
	if patriot == nil {
		t.Fatal("Expected non-nil PatriotEmulator")
	}
	c2bmc := NewC2BMCEmulator()
	if c2bmc == nil {
		t.Fatal("Expected non-nil C2BMCEmulator")
	}
	bmds := NewBMDSEmulator()
	if bmds == nil {
		t.Fatal("Expected non-nil BMDSEmulator")
	}
}