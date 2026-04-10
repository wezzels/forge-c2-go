package jseries

import (
	"testing"
	"time"
)

// floatApproxEq returns true if a and b are approximately equal within tolerance.
func floatApproxEq(a, b, tol float64) bool {
	diff := a - b
	if diff < 0 {
		diff = -diff
	}
	return diff <= tol
}

// TestJ0TrackManagementRoundtrip tests J0 Track Management pack/unpack.
func TestJ0TrackManagementRoundtrip(t *testing.T) {
	orig := &J0TrackManagement{
		TrackNumber:       12345,
		TrackStatus:       TrackMgmtConfirmed,
		MgtType:           J0TrackInitiation,
		ForceType:         2,
		Classification:    3,
		Time:              time.Now(),
		Latitude:          33.7512,
		Longitude:         -117.8567,
		Altitude:          10000,
		Speed:             250.4,
		Heading:           315.0,
		Quality:           QualityIndicator{Quality: 2},
		ParticipantNumber: 6789,
		SensorID:          "RADAR-01",
		CorrelationID:     "CORR-001",
	}
	buf := make([]byte, J0PayloadSize)
	PackJ0TrackManagement(orig, buf)
	unpacked := UnpackJ0TrackManagement(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J0 Latitude: PASS (%.6f ~= %.6f)", unpacked.Latitude, orig.Latitude)
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ1NetworkInitRoundtrip tests J1 Network Initialization pack/unpack.
func TestJ1NetworkInitRoundtrip(t *testing.T) {
	orig := &J1NetworkInit{
		NetworkID:         100,
		MessageType:      1,
		NetworkStatus:     2,
		ParticipantCount:  5,
		NodeID:           10,
		ParticipantNumber: 1001,
		Latitude:          33.7512,
		Longitude:         -117.8567,
		Altitude:          100,
		Time:             time.Now(),
		CapabilityFlags:   0x0F,
		SoftwareVersion:   "v1.0.0",
	}
	buf := make([]byte, J1PayloadSize)
	PackJ1NetworkInit(orig, buf)
	unpacked := UnpackJ1NetworkInit(buf)

	if unpacked.NetworkID != orig.NetworkID {
		t.Errorf("NetworkID: got %d, want %d", unpacked.NetworkID, orig.NetworkID)
	}
	if unpacked.NodeID != orig.NodeID {
		t.Errorf("NodeID: got %d, want %d", unpacked.NodeID, orig.NodeID)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.001) {
		t.Logf("J1 Latitude: PASS (%.6f ~= %.6f)", unpacked.Latitude, orig.Latitude)
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ5EngagementStatusRoundtrip tests J5 Engagement Status pack/unpack.
func TestJ5EngagementStatusRoundtrip(t *testing.T) {
	orig := &J5EngagementStatus{
		EngagementID:     12345,
		TrackNumber:      6789,
		WeaponSystem:     2,
		EngagementStage:  3,
		Priority:         2,
		TimeOnTarget:     time.Now().Add(30 * time.Minute),
		TimeLaunched:     time.Now(),
		TimeCompleted:   time.Now().Add(2 * time.Minute),
		InterceptResult:  1,
		HitAssessment:    0x04,
		GroundTrack:      1,
		CEPSlot:          0,
		NetworkID:        100,
		ParticipantNumber: 1001,
	}
	buf := make([]byte, J5PayloadSize)
	PackJ5EngagementStatus(orig, buf)
	unpacked := UnpackJ5EngagementStatus(buf)

	if unpacked.EngagementID != orig.EngagementID {
		t.Errorf("EngagementID: got %d, want %d", unpacked.EngagementID, orig.EngagementID)
	}
	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.Priority != orig.Priority {
		t.Errorf("Priority: got %d, want %d", unpacked.Priority, orig.Priority)
	}
}

// TestJ6SensorRegistrationRoundtrip tests J6 Sensor Registration pack/unpack.
func TestJ6SensorRegistrationRoundtrip(t *testing.T) {
	orig := &J6SensorRegistration{
		SensorID:       "TPY-2-1",
		SensorType:     2, // RADAR
		PlatformType:   1, // GROUND
		Capability:     0x07, // TRACK | ENGAGE | SURVEIL
		Latitude:       33.7512,
		Longitude:      -117.8567,
		Altitude:       1000,
		Azimuth:        45.0,
		Elevation:      30.0,
		MaxRange:       2500,
		ScanRate:       10.0,
		NetworkID:      100,
		ParticipantNum: 1001,
		Status:         1, // ACTIVE
		Timestamp:      time.Now(),
	}
	buf := make([]byte, J6PayloadSize)
	PackJ6SensorRegistration(orig, buf)
	unpacked := UnpackJ6SensorRegistration(buf)

	if unpacked.NetworkID != orig.NetworkID {
		t.Errorf("NetworkID: got %d, want %d", unpacked.NetworkID, orig.NetworkID)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J6 Latitude: PASS (%.6f ~= %.6f)", unpacked.Latitude, orig.Latitude)
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ7PlatformDataRoundtrip tests J7 Platform Data pack/unpack.
func TestJ7PlatformDataRoundtrip(t *testing.T) {
	orig := &J7PlatformData{
		TrackNumber:     12345,
		Subtype:        1,
		Latitude:       33.7512,
		Longitude:      -117.8567,
		Altitude:       10000,
		Speed:          250.4,
		Heading:        315.0,
		Roll:           5.0,
		Pitch:          2.0,
		Yaw:            180.0,
		AngularVelocity: 0.1,
	}
	buf := make([]byte, J7PayloadSize)
	PackJ7PlatformData(orig, buf)
	unpacked := UnpackJ7PlatformData(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J7 Latitude: PASS (%.6f ~= %.6f)", unpacked.Latitude, orig.Latitude)
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
	if floatApproxEq(unpacked.Speed, orig.Speed, 0.1) {
		t.Logf("J7 Speed: PASS")
	} else {
		t.Errorf("Speed: got %f, want %f", unpacked.Speed, orig.Speed)
	}
}

// TestJ9ElectronicWarfareRoundtrip tests J9 Electronic Warfare pack/unpack.
func TestJ9ElectronicWarfareRoundtrip(t *testing.T) {
	orig := &J9ElectronicAttack{
		TrackNumber:  12345,
		Subtype:    1,
		EAStatus:   J9EAActive,
		EmitterType: 10,
		Frequency:   3000000000, // 3 GHz
		Bandwidth:   1000000,   // 1 MHz
		PulseWidth:  100,       // microseconds
		PRF:         1000,      // Hz
	}
	buf := make([]byte, J9PayloadSize)
	PackJ9ElectronicAttack(orig, buf)
	unpacked := UnpackJ9ElectronicAttack(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.EmitterType != orig.EmitterType {
		t.Errorf("EmitterType: got %d, want %d", unpacked.EmitterType, orig.EmitterType)
	}
}

// TestJ10OffsetRoundtrip tests J10 Offset pack/unpack.
func TestJ10OffsetRoundtrip(t *testing.T) {
	orig := &J10Offset{
		TrackNumber: 12345,
		Subtype:    1,
		Latitude:   33.7512,
		Longitude:  -117.8567,
		Altitude:   1000,
		OffsetX:    100.5,
		OffsetY:    -200.3,
		OffsetZ:    50.0,
		Radius:     25.0,
		Angle:      45.0,
		OffsetValid: 0x0F,
		Time:       time.Now(),
	}
	buf := make([]byte, J10PayloadSize)
	PackJ10Offset(orig, buf)
	unpacked := UnpackJ10Offset(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.OffsetValid != orig.OffsetValid {
		t.Errorf("OffsetValid: got %d, want %d", unpacked.OffsetValid, orig.OffsetValid)
	}
}

// TestJ11DataTransferRoundtrip tests J11 Data Transfer pack/unpack.
func TestJ11DataTransferRoundtrip(t *testing.T) {
	orig := &J11DataTransfer{
		TransferID:     12345,
		Subtype:        1,
		TransferStatus: 1,
		RecordCount:    10,
		DataLength:     1000,
		Offset:         0,
		Checksum:       0x12345678,
		DataType:       1,
		Filler:         0,
		ParticipantSrc: 1001,
		ParticipantDst: 2002,
		Latitude:       33.7512,
		Longitude:      -117.8567,
		Altitude:       1000,
		Time:          time.Now(),
	}
	buf := make([]byte, J11PayloadSize)
	PackJ11DataTransfer(orig, buf)
	unpacked := UnpackJ11DataTransfer(buf)

	if unpacked.TransferID != orig.TransferID {
		t.Errorf("TransferID: got %d, want %d", unpacked.TransferID, orig.TransferID)
	}
	if unpacked.RecordCount != orig.RecordCount {
		t.Errorf("RecordCount: got %d, want %d", unpacked.RecordCount, orig.RecordCount)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J11 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ12AlertRoundtrip tests J12 Alert pack/unpack.
func TestJ12AlertRoundtrip(t *testing.T) {
	orig := &J12Alert{
		AlertID:       "ALT-12345",
		AlertType:     1, // LAUNCH_DETECTED
		Severity:      3, // HIGH
		Latitude:      33.7512,
		Longitude:     -117.8567,
		Altitude:      10000,
		Speed:        500.0,
		Heading:      90.0,
		TrackNumber:  6789,
		ThreatLevel:  4,
		Classification: 2,
		SourceID:     "TPY-2-1",
		Timestamp:    time.Now(),
	}
	buf := make([]byte, J12PayloadSize)
	PackJ12Alert(orig, buf)
	unpacked := UnpackJ12Alert(buf)

	if unpacked.AlertType != orig.AlertType {
		t.Errorf("AlertType: got %d, want %d", unpacked.AlertType, orig.AlertType)
	}
	if unpacked.Severity != orig.Severity {
		t.Errorf("Severity: got %d, want %d", unpacked.Severity, orig.Severity)
	}
}

// TestJ13PrecisionParticipantRoundtrip tests J13 Precision Participant pack/unpack.
func TestJ13PrecisionParticipantRoundtrip(t *testing.T) {
	orig := &J13PrecisionParticipant{
		TrackNumber:       12345,
		Subtype:         1,
		ParticipantNumber: 6789,
		Latitude:        33.7512,
		Longitude:       -117.8567,
		Altitude:        1000,
		VelocityX:       100.5,
		VelocityY:       -200.3,
		VelocityZ:       50.0,
		Time:           time.Now(),
	}
	buf := make([]byte, J13PayloadSize)
	PackJ13PrecisionParticipant(orig, buf)
	unpacked := UnpackJ13PrecisionParticipant(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.001) {
		t.Logf("J13 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ26TestRoundtrip tests J26 Test pack/unpack.
func TestJ26TestRoundtrip(t *testing.T) {
	orig := &J26Test{
		Subtype:           1,
		TestID:            12345,
		ParticipantNumber: 6789,
		TestData:          "TESTDATA",
		Time:              time.Now(),
	}
	buf := make([]byte, J26PayloadSize)
	PackJ26Test(orig, buf)
	unpacked := UnpackJ26Test(buf)

	if unpacked.TestID != orig.TestID {
		t.Errorf("TestID: got %d, want %d", unpacked.TestID, orig.TestID)
	}
	if unpacked.Subtype != orig.Subtype {
		t.Errorf("Subtype: got %d, want %d", unpacked.Subtype, orig.Subtype)
	}
}

// TestJ27TimeRoundtrip tests J27 Time pack/unpack.
func TestJ27TimeRoundtrip(t *testing.T) {
	orig := &J27Time{
		Subtype:        1,
		Time:           time.Now(),
		TimeOffset:     0.5,
		TimeQuality:    5,
		LeapSeconds:    37,
		TimeZoneOffset: -8,
		DSTIndicator:   0,
	}
	buf := make([]byte, J27PayloadSize)
	PackJ27Time(orig, buf)
	unpacked := UnpackJ27Time(buf)

	if unpacked.TimeQuality != orig.TimeQuality {
		t.Errorf("TimeQuality: got %d, want %d", unpacked.TimeQuality, orig.TimeQuality)
	}
	if unpacked.LeapSeconds != orig.LeapSeconds {
		t.Errorf("LeapSeconds: got %d, want %d", unpacked.LeapSeconds, orig.LeapSeconds)
	}
}
