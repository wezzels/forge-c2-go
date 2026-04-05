package internal

import (
	"encoding/json"
	"fmt"
	"math"
	"net"
	"testing"
	"time"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
)

// TestJREAPE2E tests the full pipeline:
// 1. Encode sensor event via JREAP encoder
// 2. Decode via JREAP decoder
// 3. Feed decoded message through JREAPConsumer
// 4. Verify track is created and stored
func TestJREAPE2E(t *testing.T) {
	correlator := NewTrackCorrelator()
	c2bmc := NewC2BMCInterface("mock://")
	trackStore := NewTrackStore()
	consumer := NewJREAPConsumer(correlator, c2bmc, trackStore)

	// --- Test 1: J3 Track Update round-trip ---
	t.Run("J3TrackUpdate_RoundTrip", func(t *testing.T) {
		original := &Track{
			TrackID:    "TRK-0042",
			TrackNumber: 42,
			Status:     "ACTIVE",
			Latitude:   34.0522,
			Longitude: -118.2437,
			Altitude:  15000,
			Speed:     2500,
			Heading:   45.0,
			ThreatLevel: 4,
		}

		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		msg, err := encoder.EncodeTrack(original)
		if err != nil {
			t.Fatalf("EncodeTrack failed: %v", err)
		}

		decoder := jreap.NewDecoder("FORGE-NODE-0001", "TEST")
		decoded, err := decoder.DecodeTrackUpdate(msg)
		if err != nil {
			t.Fatalf("DecodeTrackUpdate failed: %v", err)
		}

		if decoded.TrackNumber != original.TrackNumber {
			t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, original.TrackNumber)
		}
		if math.Abs(decoded.Latitude-original.Latitude) > 0.01 {
			t.Errorf("Latitude: got %.4f, want %.4f", decoded.Latitude, original.Latitude)
		}
		if math.Abs(decoded.Longitude-original.Longitude) > 0.01 {
			t.Errorf("Longitude: got %.4f, want %.4f", decoded.Longitude, original.Longitude)
		}
		if math.Abs(decoded.Altitude-original.Altitude) > 1 {
			t.Errorf("Altitude: got %.1f, want %.1f", decoded.Altitude, original.Altitude)
		}
		if math.Abs(decoded.Speed-original.Speed) > 1 {
			t.Errorf("Speed: got %.1f, want %.1f", decoded.Speed, original.Speed)
		}
		if decoded.ThreatLevel != int(original.ThreatLevel) {
			t.Errorf("ThreatLevel: got %d, want %d", decoded.ThreatLevel, original.ThreatLevel)
		}
	})

	// --- Test 2: JREAPConsumer J3 track creation ---
	t.Run("JREAPConsumer_J3_CreatesTrack", func(t *testing.T) {
		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		track := &Track{
			TrackID:    "TRK-0099",
			TrackNumber: 99,
			Status:     "NEW",
			Latitude:   40.7128,
			Longitude: -74.0060,
			Altitude:  30000,
			Speed:     3000,
			Heading:   90.0,
			ThreatLevel: 3,
		}
		trackMsg, _ := encoder.EncodeTrack(track)

		err := consumer.ProcessMessage(trackMsg)
		if err != nil {
			t.Fatalf("ProcessMessage failed: %v", err)
		}

		found, ok := trackStore.GetTrack(track.TrackID)
		if !ok {
			t.Errorf("Track %s not found in store", track.TrackID)
		}
		if found != nil && found.TrackNumber != 99 {
			t.Errorf("TrackNumber: got %d, want 99", found.TrackNumber)
		}
	})

	// --- Test 3: J2 Surveillance ---
	t.Run("JREAPConsumer_J2_NewDetection", func(t *testing.T) {
		j2 := &jseries.J2Surveillance{
			TrackNumber:       77,
			ParticipantNumber: 5,
			TrackStatus:      1,
			Latitude:         36.0,
			Longitude:       -115.5,
			Altitude:        25000,
			Speed:           500.0,
			Heading:         180.0,
			CourseOverGround: 180.0,
			RadialVelocity:  0.0,
			SignalIntensity: 12.5,
			Frequency:      1.0e9,
			SNR:            0.85,
			Confidence:     0.95,
			Timestamp:      time.Now(),
			ForceType:      3,
			PlatformType:   256,
			SensorID:       "SN-001",
		}
		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		j2Msg, _ := encoder.EncodeJ2(j2)

		err := consumer.ProcessMessage(j2Msg)
		if err != nil {
			t.Fatalf("ProcessMessage J2 failed: %v", err)
		}
	})

	// --- Test 4: J28 Space Track ---
	t.Run("JREAPConsumer_J28_SpaceTrack", func(t *testing.T) {
		j28 := &jseries.J28SpaceTrack{
			TrackNumber:     201,
			Time:            time.Now(),
			Latitude:        36.8441,
			Longitude:      -121.2869,
			Altitude:       400000,
			VelocityX:      7600.0,
			VelocityY:      0.0,
			VelocityZ:      0.0,
			SatelliteID:    "USA-289",
			OrbitalPeriod:  92.5,
			Inclination:   97.6,
			SemiMajorAxis: 6878.0,
			Eccentricity:  0.0003,
			RightAscension: 200.0,
			ArgPerigee:    45.0,
			TrueAnomaly:   135.0,
			IRIntensity:   280.0,
			BackgroundTemp: 3.0,
			DetectionConf: 0.92,
			SNR:           15.0,
			Quality:       jseries.QualityIndicator{Quality: 2},
			ThreatLevel:   2,
			Status:        2,
			PlatformType:  1,
		}
		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		j28Msg, _ := encoder.EncodeJ28(j28)

		err := consumer.ProcessMessage(j28Msg)
		if err != nil {
			t.Fatalf("ProcessMessage J28 failed: %v", err)
		}

		tracks := correlator.GetTracks()
		if len(tracks) == 0 {
			t.Error("Expected at least one track after J28")
		}
	})

	// --- Test 5: J4 Engagement Order ---
	t.Run("JREAPConsumer_J4_Engagement", func(t *testing.T) {
		j4 := &jseries.J4EngagementOrder{
			EngagementID:  12345,
			TrackNumber:   42,
			Priority:      3,
			WeaponSystem: jseries.J4WeaponSystem_GMD,
			TimeOnTarget: time.Now().Add(60 * time.Second),
			InterceptProb: 0.87,
			TrackStatus: jseries.TrackStatus_Active,
		}
		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		j4Msg, _ := encoder.EncodeJ4(j4)

		err := consumer.ProcessMessage(j4Msg)
		if err != nil {
			t.Fatalf("ProcessMessage J4 failed: %v", err)
		}
	})

	// --- Test 6: J12 Alert ---
	t.Run("JREAPConsumer_J12_Alert", func(t *testing.T) {
		j12 := &jseries.J12Alert{
			AlertID:     "ALT-001",
			AlertType: 1,
			Severity:   4,
			Latitude:   36.0,
			Longitude: -115.5,
			Altitude:   0,
			Speed:     0,
			Heading:   0,
			TrackNumber: 42,
			ThreatLevel: 3,
			Classification: 2,
			SourceID:  "SN-ID-001",
			Timestamp: time.Now(),
		}
		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		j12Msg, _ := encoder.EncodeJ12(j12)

		err := consumer.ProcessMessage(j12Msg)
		if err != nil {
			t.Fatalf("ProcessMessage J12 failed: %v", err)
		}

		alerts := c2bmc.GetAlerts()
		if len(alerts) == 0 {
			t.Error("Expected at least one alert after J12")
		}
	})

	// --- Test 7: J5 Engagement Status ---
	t.Run("JREAPConsumer_J5_EngagementStatus", func(t *testing.T) {
		j5 := &jseries.J5EngagementStatus{
			EngagementID:    12345,
			TrackNumber:    42,
			WeaponSystem:   1,
			EngagementStage: 2,
			Priority:       3,
			TimeOnTarget:   time.Now(),
			TimeLaunched:   time.Now(),
			TimeCompleted:  time.Now(),
			InterceptResult: 1,
			HitAssessment:  0,
			GroundTrack:   0,
			CEPSlot:       0,
			NetworkID:     256,
			ParticipantNumber: 10,
		}
		encoder := jreap.NewEncoder("FORGE-NODE-0001", "TEST")
		j5Msg, _ := encoder.EncodeJ5(j5)

		err := consumer.ProcessMessage(j5Msg)
		if err != nil {
			t.Fatalf("ProcessMessage J5 failed: %v", err)
		}
	})

	// --- Test 8: Invalid message ---
	t.Run("InvalidMessage_Rejected", func(t *testing.T) {
		err := consumer.ProcessMessage([]byte{0x00, 0x01})
		if err == nil {
			t.Error("Expected error for short message")
		}
	})

	// --- Test 9: JSON round-trip ---
	t.Run("Track_JSONRoundTrip", func(t *testing.T) {
		track := &Track{
			TrackID:     "TRK-0077",
			TrackNumber: 77,
			Status:      "ACTIVE",
			Latitude:    51.5074,
			Longitude:   -0.1278,
			Altitude:    12000,
			Speed:       1800,
			Heading:     270.0,
			ThreatLevel: 5,
			TrackSource: "OPIR",
			Trajectory: []Position{
				{Timestamp: time.Now(), Lat: 51.5, Lon: -0.1, Alt: 12000},
			},
		}
		data, err := json.Marshal(track)
		if err != nil {
			t.Fatalf("Marshal failed: %v", err)
		}
		var rt Track
		if err := json.Unmarshal(data, &rt); err != nil {
			t.Fatalf("Unmarshal failed: %v", err)
		}
		if rt.TrackID != track.TrackID {
			t.Errorf("TrackID: got %s, want %s", rt.TrackID, track.TrackID)
		}
	})
}

// TestCorrelatorE2E tests that the correlator correctly associates
// events from the same track and rejects events too far away.
func TestCorrelatorE2E(t *testing.T) {
	correlator := NewTrackCorrelator()
	baseTime := time.Date(2026, 4, 5, 12, 0, 0, 0, time.UTC)

	// Create two close events from the same sensor (should correlate)
	e1 := &SensorEvent{EventID: "E1", Timestamp: baseTime, SensorID: "OPIR-1",
		SensorType: "OPIR", Latitude: 34.0, Longitude: -118.0, Altitude: 10000}
	e2 := &SensorEvent{EventID: "E2", Timestamp: baseTime.Add(5 * time.Second),
		SensorID: "OPIR-1", SensorType: "OPIR", Latitude: 34.1, Longitude: -117.8, Altitude: 9500}

	track1, isNew1 := correlator.ProcessEvent(e1)
	if !isNew1 {
		t.Error("First event should create new track")
	}

	track2, isNew2 := correlator.ProcessEvent(e2)
	if isNew2 {
		t.Error("Close second event should update existing track, not create new")
	}
	if track1 != track2 {
		t.Error("Should return same track for correlated events")
	}

	// Create a far-away event (should NOT correlate)
	e3 := &SensorEvent{EventID: "E3", Timestamp: baseTime.Add(10 * time.Second),
		SensorID: "OPIR-1", SensorType: "OPIR",
		Latitude: 40.0, Longitude: -74.0, Altitude: 10000} // ~3700km away

	track3, isNew3 := correlator.ProcessEvent(e3)
	if !isNew3 {
		t.Error("Far-away event should create new track, not reuse existing")
	}
	if track1 == track3 {
		t.Error("Far-away event should not reuse existing track")
	}

	tracks := correlator.GetTracks()
	if len(tracks) != 2 {
		t.Errorf("Expected 2 tracks (close pair + far), got %d", len(tracks))
	}
}

// TestJREAPHeaderValidation checks header encoding.
func TestJREAPHeaderValidation(t *testing.T) {
	encoder := jreap.NewEncoder("NODE-A", "APP-1")

	msg, err := encoder.EncodeSensorEvent(&testSensorEvent{
		id: "TEST-001", ts: time.Now(), lat: 34.0, lon: -118.0, alt: 10000, intensity: 80,
	})
	if err != nil {
		t.Fatalf("Encode failed: %v", err)
	}

	if len(msg) < 10 {
		t.Fatalf("Message too short: %d bytes", len(msg))
	}

	if msg[0] != 0x00 || msg[1] != 0x01 {
		t.Errorf("Flags: got 0x%02x 0x%02x, want 0x00 0x01", msg[0], msg[1])
	}

	if msg[2] != uint8(jreap.J28_SatelliteOPIR) {
		t.Errorf("Message type: got %d, want %d", msg[2], jreap.J28_SatelliteOPIR)
	}

	length := uint32(msg[4])<<24 | uint32(msg[5])<<16 | uint32(msg[6])<<8 | uint32(msg[7])
	if length != uint32(len(msg)-10) {
		t.Errorf("Length field %d != actual length %d", length, len(msg))
	}

	crcComputed := jreap.CRC16(msg[:len(msg)-2])
	crcStored := uint16(msg[len(msg)-2])<<8 | uint16(msg[len(msg)-1])
	if crcComputed != crcStored {
		t.Errorf("CRC mismatch: computed 0x%04x, stored 0x%04x", crcComputed, crcStored)
	}
}

// TestJREAPTransportUDPE2E tests that a JREAP UDP sender and receiver
// can communicate on the same machine. Skip if UDP ports are unavailable.
func TestJREAPTransportUDPE2E(t *testing.T) {
	// Use a pre-bound connection to avoid "address already in use" issues
	conn, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.ParseIP("127.0.0.1"), Port: 0})
	if err != nil {
		t.Skipf("UDP not available: %v", err)
	}
	// Immediately close listener and rebind on a fresh port
	conn.Close()
	conn2, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.ParseIP("127.0.0.1"), Port: 0})
	if err != nil {
		t.Skipf("UDP rebind failed: %v", err)
	}
	conn = conn2
	localAddr := conn.LocalAddr().(*net.UDPAddr)

	sender, err := jreap.NewJREAPUDPConn("127.0.0.1:"+fmt.Sprintf("%d", localAddr.Port), 8192)
	if err != nil {
		t.Skipf("NewJREAPUDPConn failed: %v", err)
	}
	defer sender.Close()

	encoder := jreap.NewEncoder("NODE-A", "TEST")
	event := &testSensorEvent{id: "UDP-TEST", ts: time.Now(), lat: 40.0, lon: -74.0, alt: 20000, intensity: 90}
	msg, _ := encoder.EncodeSensorEvent(event)

	err = sender.SendTo("127.0.0.1:"+fmt.Sprintf("%d", localAddr.Port), msg)
	if err != nil {
		t.Fatalf("SendTo failed: %v", err)
	}

	conn.SetReadDeadline(time.Now().Add(3 * time.Second))
	buf := make([]byte, 8192)
	n, _, err := conn.ReadFromUDP(buf)
	if err != nil {
		t.Fatalf("ReadFromUDP failed: %v", err)
	}

	if n != len(msg) {
		t.Errorf("Received %d bytes, sent %d", n, len(msg))
	}

	hdr, _, _, err := jreap.DecodeFull(buf[:n])
	if err != nil {
		t.Fatalf("DecodeFull failed: %v", err)
	}
	if hdr.MessageType != uint8(jreap.J28_SatelliteOPIR) {
		t.Errorf("MessageType: got %d, want %d", hdr.MessageType, jreap.J28_SatelliteOPIR)
	}
}

// testSensorEvent implements jreap.SensorEventLike for testing.
type testSensorEvent struct {
	id        string
	ts        time.Time
	sensorID  string
	lat       float64
	lon       float64
	alt       float64
	intensity float64
}

func (e *testSensorEvent) GetEventID() string     { return e.id }
func (e *testSensorEvent) GetTimestamp() time.Time { return e.ts }
func (e *testSensorEvent) GetSensorID() string    { return e.sensorID }
func (e *testSensorEvent) GetLatitude() float64   { return e.lat }
func (e *testSensorEvent) GetLongitude() float64  { return e.lon }
func (e *testSensorEvent) GetAltitude() float64   { return e.alt }
func (e *testSensorEvent) GetIntensity() float64  { return e.intensity }
