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

// TestJ2SurveillanceRoundtrip tests J2 Surveillance pack/unpack.
func TestJ2SurveillanceRoundtrip(t *testing.T) {
	orig := &J2Surveillance{
		TrackNumber:       12345,
		ParticipantNumber: 6789,
		TrackStatus:       1,
		Latitude:          33.7512,
		Longitude:         -117.8567,
		Altitude:          10000,
		Speed:             250.4,
		Heading:           315.0,
		CourseOverGround:  310.5,
		RadialVelocity:    -150.0,
		SignalIntensity:   -10.0,
		Frequency:         3000000000,
		SNR:              15.0,
		Confidence:        0.85,
		Timestamp:         time.Now(),
		ForceType:         2,
		PlatformType:      100,
		SensorID:          "RADAR-01",
	}
	buf := make([]byte, J2PayloadSize)
	PackJ2Surveillance(orig, buf)
	unpacked := UnpackJ2Surveillance(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.ParticipantNumber != orig.ParticipantNumber {
		t.Errorf("ParticipantNumber: got %d, want %d", unpacked.ParticipantNumber, orig.ParticipantNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J2 Latitude: PASS (%.6f ~= %.6f)", unpacked.Latitude, orig.Latitude)
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
	if floatApproxEq(unpacked.Longitude, orig.Longitude, 0.01) {
		t.Logf("J2 Longitude: PASS (%.6f ~= %.6f)", unpacked.Longitude, orig.Longitude)
	} else {
		t.Errorf("Longitude: got %f, want %f", unpacked.Longitude, orig.Longitude)
	}
	if floatApproxEq(unpacked.Speed, orig.Speed, 0.1) {
		t.Logf("J2 Speed: PASS")
	} else {
		t.Errorf("Speed: got %f, want %f", unpacked.Speed, orig.Speed)
	}
	if unpacked.SensorID != orig.SensorID {
		t.Errorf("SensorID: got %s, want %s", unpacked.SensorID, orig.SensorID)
	}
}

// TestJ3TrackUpdateRoundtrip tests J3 Track Update pack/unpack.
func TestJ3TrackUpdateRoundtrip(t *testing.T) {
	orig := &J3TrackUpdate{
		TrackNumber:  12345,
		Time:        time.Now(),
		Latitude:    33.7512,
		Longitude:   -117.8567,
		Altitude:   10000,
		Speed:      250.4,
		Heading:    315.0,
		Status:     2, // ACTIVE
		ThreatLevel: 3,
		Quality:    QualityIndicator{Quality: 2},
		PlatformType: 1,
		ForceType:  2,
	}
	buf := make([]byte, J3PayloadSize)
	PackJ3TrackUpdate(orig, buf)
	unpacked := UnpackJ3TrackUpdate(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J3 Latitude: PASS (%.6f ~= %.6f)", unpacked.Latitude, orig.Latitude)
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
	if floatApproxEq(unpacked.Longitude, orig.Longitude, 0.01) {
		t.Logf("J3 Longitude: PASS (%.6f ~= %.6f)", unpacked.Longitude, orig.Longitude)
	} else {
		t.Errorf("Longitude: got %f, want %f", unpacked.Longitude, orig.Longitude)
	}
	if floatApproxEq(unpacked.Speed, orig.Speed, 0.1) {
		t.Logf("J3 Speed: PASS")
	} else {
		t.Errorf("Speed: got %f, want %f", unpacked.Speed, orig.Speed)
	}
}

// TestJ4EngagementOrderRoundtrip tests J4 Engagement Order pack/unpack.
func TestJ4EngagementOrderRoundtrip(t *testing.T) {
	orig := &J4EngagementOrder{
		EngagementID:   12345,
		TrackNumber:   6789,
		Priority:      1,
		WeaponSystem:  2,
		TimeOnTarget:  time.Now(),
		InterceptProb: 0.75,
		TrackStatus:   TrackStatus_Active,
	}
	buf := make([]byte, J4PayloadSize)
	PackJ4EngagementOrder(orig, buf)
	unpacked := UnpackJ4EngagementOrder(buf)

	if unpacked.EngagementID != orig.EngagementID {
		t.Errorf("EngagementID: got %d, want %d", unpacked.EngagementID, orig.EngagementID)
	}
	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.Priority != orig.Priority {
		t.Errorf("Priority: got %d, want %d", unpacked.Priority, orig.Priority)
	}
	if floatApproxEq(unpacked.InterceptProb, orig.InterceptProb, 0.01) {
		t.Logf("J4 InterceptProb: PASS")
	} else {
		t.Errorf("InterceptProb: got %f, want %f", unpacked.InterceptProb, orig.InterceptProb)
	}
}

// TestJ8RadioRoundtrip tests J8 Radio pack/unpack with variable length.
func TestJ8RadioRoundtrip(t *testing.T) {
	for _, textLen := range []int{0, 10} {
		msgText := make([]byte, textLen)
		for i := range msgText {
			msgText[i] = byte(i % 256)
		}
		orig := &J8Radio{
			TrackNumber:       1234,
			Subtype:           1,
			RadioStatus:       J8RadioActive,
			ParticipantNumber: 111,
			NetworkID:         222,
			Frequency:         300000000,
			Modulation:        3,
			Bandwidth:         25000,
			SignalStrength:    -45.0,
			SNR:              20.0,
			Latitude:         33.7512,
			Longitude:        -117.8567,
			Altitude:         5000,
			MessageLength:     uint16(textLen),
			MessageText:       string(msgText),
		}
		
		buf := make([]byte, J8PayloadSize(textLen))
		PackJ8Radio(orig, buf)
		unpacked := UnpackJ8Radio(buf)

		if unpacked.ParticipantNumber != orig.ParticipantNumber {
			t.Errorf("[len=%d] ParticipantNumber: got %d, want %d", textLen, unpacked.ParticipantNumber, orig.ParticipantNumber)
		}
		if unpacked.MessageLength != orig.MessageLength {
			t.Errorf("[len=%d] MessageLength: got %d, want %d", textLen, unpacked.MessageLength, orig.MessageLength)
		}
	}
	t.Logf("J8 Radio: PASS (0, 10 byte variants)")
}

// TestJ14ProcessSpecRoundtrip tests J14 Process Specification pack/unpack.
func TestJ14ProcessSpecRoundtrip(t *testing.T) {
	orig := &J14ProcessSpec{
		TrackNumber:       1234,
		Subtype:          1,
		ProcessMode:       1, // AUTO
		QualityMin:        50,
		UpdateRate:        2.5,
		CorrelationWindow: 5.0,
		FilterGain:        0.75,
		MaxAge:            30.0,
		Latitude:          33.7512,
		Longitude:        -117.8567,
		Time:             time.Now(),
	}
	buf := make([]byte, J14PayloadSize)
	PackJ14ProcessSpec(orig, buf)
	unpacked := UnpackJ14ProcessSpec(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J14 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ15CommandRoundtrip tests J15 Command pack/unpack.
func TestJ15CommandRoundtrip(t *testing.T) {
	orig := &J15Command{
		CommandID:   1234,
		Subtype:     1,
		CommandCode: 5,
		TargetID:    6789,
		Priority:    2, // ROUTINE
		Latitude:    33.7512,
		Longitude:  -117.8567,
		Altitude:   5000,
		Time:       time.Now(),
	}
	buf := make([]byte, J15PayloadSize)
	PackJ15Command(orig, buf)
	unpacked := UnpackJ15Command(buf)

	if unpacked.CommandID != orig.CommandID {
		t.Errorf("CommandID: got %d, want %d", unpacked.CommandID, orig.CommandID)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J15 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ16AcknowledgeRoundtrip tests J16 Acknowledge pack/unpack.
func TestJ16AcknowledgeRoundtrip(t *testing.T) {
	orig := &J16Acknowledge{
		AckID:             1234,
		Subtype:          1,
		AckStatus:        1, // ACK
		OriginalID:       6789,
		ParticipantNumber: 111,
		ReasonCode:       0,
		Time:             time.Now(),
	}
	buf := make([]byte, J16PayloadSize)
	PackJ16Acknowledge(orig, buf)
	unpacked := UnpackJ16Acknowledge(buf)

	if unpacked.AckID != orig.AckID {
		t.Errorf("AckID: got %d, want %d", unpacked.AckID, orig.AckID)
	}
	if unpacked.ParticipantNumber != orig.ParticipantNumber {
		t.Errorf("ParticipantNumber: got %d, want %d", unpacked.ParticipantNumber, orig.ParticipantNumber)
	}
}

// TestJ17InitiateTransferRoundtrip tests J17 Initiate Transfer pack/unpack.
func TestJ17InitiateTransferRoundtrip(t *testing.T) {
	orig := &J17InitiateTransfer{
		TransferID:     1234,
		Subtype:        1,
		FileType:       2,
		FileSize:       1024000,
		Checksum:       0xDEADBEEF,
		ParticipantSrc: 111,
		ParticipantDst: 222,
		Filename:       "data.bin",
		Time:           time.Now(),
	}
	buf := make([]byte, J17PayloadSize)
	PackJ17InitiateTransfer(orig, buf)
	unpacked := UnpackJ17InitiateTransfer(buf)

	if unpacked.TransferID != orig.TransferID {
		t.Errorf("TransferID: got %d, want %d", unpacked.TransferID, orig.TransferID)
	}
	if unpacked.FileSize != orig.FileSize {
		t.Errorf("FileSize: got %d, want %d", unpacked.FileSize, orig.FileSize)
	}
	if unpacked.Filename != orig.Filename {
		t.Errorf("Filename: got %s, want %s", unpacked.Filename, orig.Filename)
	}
}

// TestJ18SpaceTrackRoundtrip tests J18 Space Track pack/unpack.
func TestJ18SpaceTrackRoundtrip(t *testing.T) {
	orig := &J18SpaceTrack{
		TrackNumber:      1234,
		Subtype:         1,
		ObjectID:        "1998-054A",
		Latitude:        33.7512,
		Longitude:      -117.8567,
		Altitude:        400000,
		VelocityX:       3100.0,
		VelocityY:       -1200.0,
		VelocityZ:       500.0,
		Speed:           3400.0,
		CourseOverGround: 135.0,
		RadialVelocity:   -500.0,
		OrbitalPeriod:   96.7,
		Apogee:          40000,
		Perigee:         400,
		Inclination:     28.5,
		SemiMajorAxis:   24300,
		Eccentricity:    0.950,
		MeanAnomaly:     180.0,
		Time:            time.Now(),
	}
	buf := make([]byte, J18PayloadSize)
	PackJ18SpaceTrack(orig, buf)
	unpacked := UnpackJ18SpaceTrack(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.ObjectID != orig.ObjectID {
		t.Errorf("ObjectID: got %s, want %s", unpacked.ObjectID, orig.ObjectID)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J18 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ28SpaceTrackRoundtrip tests J28 Satellite OPIR pack/unpack.
func TestJ28SpaceTrackRoundtrip(t *testing.T) {
	orig := &J28SpaceTrack{
		TrackNumber:     1234,
		Time:           time.Now(),
		Latitude:       33.7512,
		Longitude:      -117.8567,
		Altitude:       36000,
		VelocityX:      3100.0,
		VelocityY:      -1200.0,
		VelocityZ:      500.0,
		SatelliteID:    "26463",
		OrbitalPeriod:  96.7,
		Inclination:    28.5,
		SemiMajorAxis:  24300,
		Eccentricity:   0.001,
		RightAscension: 180.0,
		ArgPerigee:     90.0,
		TrueAnomaly:    45.0,
		IRIntensity:    300.0,
		BackgroundTemp: 4.0,
		DetectionConf:  0.95,
		SNR:            15.0,
	}
	buf := make([]byte, J28PayloadSize)
	PackJ28SpaceTrack(orig, buf)
	unpacked := UnpackJ28SpaceTrack(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.SatelliteID != orig.SatelliteID {
		t.Errorf("SatelliteID: got %s, want %s", unpacked.SatelliteID, orig.SatelliteID)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J28 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
}

// TestJ29SymbologyRoundtrip tests J29 Symbology pack/unpack.
func TestJ29SymbologyRoundtrip(t *testing.T) {
	orig := &J29Symbology{
		TrackNumber:   1234,
		Subtype:      1,
		SymbolCode:   0xFFFF,
		PatternType:  1,
		FrameColor:   0x1F,
		FillColor:    0x03,
		LineStyle:    1,
		LineThickness: 2,
		AltitudeType: 0,
		Latitude:     33.7512,
		Longitude:   -117.8567,
		Altitude:    5000,
		Label:       "TEST",
		Time:        time.Now(),
	}
	buf := make([]byte, J29PayloadSize)
	PackJ29Symbology(orig, buf)
	unpacked := UnpackJ29Symbology(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if floatApproxEq(unpacked.Latitude, orig.Latitude, 0.01) {
		t.Logf("J29 Latitude: PASS")
	} else {
		t.Errorf("Latitude: got %f, want %f", unpacked.Latitude, orig.Latitude)
	}
	if unpacked.Label != orig.Label {
		t.Errorf("Label: got %s, want %s", unpacked.Label, orig.Label)
	}
}

// TestJ30IFFRoundtrip tests J30 IFF pack/unpack.
func TestJ30IFFRoundtrip(t *testing.T) {
	orig := &J30IFF{
		TrackNumber:  1234,
		Subtype:       1,
		IFFCode:       0xA5A5A5A5,
		FriendlyCode: 1,
		Mode5Level:    2,
		SatelliteID:   5678,
		Latitude:     33.7512,
		Longitude:    -117.8567,
		Altitude:     10000,
		ResponseTime: 0.5,
		Confidence:   0.95,
		Time:         time.Now(),
	}
	buf := make([]byte, J30PayloadSize)
	PackJ30IFF(orig, buf)
	unpacked := UnpackJ30IFF(buf)

	if unpacked.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", unpacked.TrackNumber, orig.TrackNumber)
	}
	if unpacked.Mode5Level != orig.Mode5Level {
		t.Errorf("Mode5Level: got %d, want %d", unpacked.Mode5Level, orig.Mode5Level)
	}
	if unpacked.IFFCode != orig.IFFCode {
		t.Errorf("IFFCode: got %08x, want %08x", unpacked.IFFCode, orig.IFFCode)
	}
}

// TestJ31FileTransferRoundtrip tests J31 File Transfer pack/unpack.
// TestJ31FileTransferRoundtrip tests J31 File Transfer pack/unpack.
func TestJ31FileTransferRoundtrip(t *testing.T) {
	orig := &J31FileTransfer{
		TransferID:  1234,
		Subtype:     1,
		ChunkIndex:  1,
		ChunkSize:   16,
		TotalChunks: 10,
		FileSize:    1024000,
		Checksum:    0xDEADBEEF,
		Filename:    "data.bin",
		Time:        time.Now(),
	}
	buf := make([]byte, J31HeaderSize)
	PackJ31FileTransfer(orig, buf)
	unpacked := UnpackJ31FileTransfer(buf)

	if unpacked.TransferID != orig.TransferID {
		t.Errorf("TransferID: got %d, want %d", unpacked.TransferID, orig.TransferID)
	}
	if unpacked.ChunkIndex != orig.ChunkIndex {
		t.Errorf("ChunkIndex: got %d, want %d", unpacked.ChunkIndex, orig.ChunkIndex)
	}
	if unpacked.Filename != orig.Filename {
		t.Errorf("Filename: got %s, want %s", unpacked.Filename, orig.Filename)
	}
}

// =============================================================================
// J19-J25 Special Track Type Roundtrip Tests
// =============================================================================

func TestJ19ComponentRoundtrip(t *testing.T) {
	orig := &J19Component{
		TrackNumber:   1234,
		ComponentID:  5,
		ComponentType: 3,
		Latitude:     33.7512,
		Longitude:    -117.8567,
		Altitude:     1000,
		VelocityX:    100.5,
		VelocityY:    200.3,
		VelocityZ:    50.0,
		AccelerationX: 9.8,
		AccelerationY: 0.1,
		AccelerationZ: -0.2,
		EntityType:  0x12345678,
		Time:        time.Now(),
	}

	buf := make([]byte, J19PayloadSize)
	n := PackJ19Component(orig, buf)
	if n > J19PayloadSize {
		t.Errorf("Packed size: got %d, want <=%d", n, J19PayloadSize)
	}

	decoded := UnpackJ19Component(buf[:n])

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.ComponentID != orig.ComponentID {
		t.Errorf("ComponentID: got %d, want %d", decoded.ComponentID, orig.ComponentID)
	}
}

func TestJ20AirTrackRoundtrip(t *testing.T) {
	orig := &J20AirTrack{
		TrackNumber:       5678,
		Time:            time.Now(),
		Latitude:        34.0522,
		Longitude:       -118.2437,
		Altitude:        10000,
		Speed:           250.0,
		Heading:         90.0,
		VerticalVelocity: 50.0,
		SpeedType:       1,
		AltitudeType:    2,
		IFF:             0x15,
		IFFData:         0x12345678,
		TrackQuality:   3,
		ParticipantNumber: 1,
		ForceType:       2,
	}

	buf := make([]byte, J20PayloadSize)
	n := PackJ20AirTrack(orig, buf)
	if n > J20PayloadSize {
		t.Errorf("Packed size: got %d, want %d", n, J20PayloadSize)
	}

	decoded := UnpackJ20AirTrack(buf)

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.SpeedType != orig.SpeedType {
		t.Errorf("SpeedType: got %d, want %d", decoded.SpeedType, orig.SpeedType)
	}
}

func TestJ21SurfaceTrackRoundtrip(t *testing.T) {
	orig := &J21SurfaceTrack{
		TrackNumber:        9999,
		Time:              time.Now(),
		Latitude:          21.3069,
		Longitude:         -157.8583,
		Altitude:          0,
		Speed:             15.0,
		Heading:           180.0,
		CourseOverGround:  175.0,
		SpeedOverGround:   14.5,
		TurnRate:          2.5,
		ShipType:         101,
		VesselID:         0xDEADBEEF,
		TrackQuality:     2,
		ParticipantNumber: 5,
		ForceType:        1,
	}

	buf := make([]byte, J21PayloadSize)
	n := PackJ21SurfaceTrack(orig, buf)
	if n > J21PayloadSize {
		t.Errorf("Packed size: got %d, want %d", n, J21PayloadSize)
	}

	decoded := UnpackJ21SurfaceTrack(buf)

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.ShipType != orig.ShipType {
		t.Errorf("ShipType: got %d, want %d", decoded.ShipType, orig.ShipType)
	}
}

func TestJ22SubsurfaceTrackRoundtrip(t *testing.T) {
	orig := &J22SubsurfaceTrack{
		TrackNumber:        8888,
		Time:              time.Now(),
		Latitude:          32.7157,
		Longitude:         -117.1611,
		Depth:             -100.0,
		Speed:             10.0,
		Heading:           270.0,
		CourseOverGround:  265.0,
		SpeedOverGround:   9.5,
		SonarType:        5,
		DetectionMethod:   2,
		SubmarineType:    201,
		VesselID:         0xCAFEBABE,
		TrackQuality:     3,
		ParticipantNumber: 7,
		ForceType:        3,
	}

	buf := make([]byte, J22PayloadSize)
	n := PackJ22SubsurfaceTrack(orig, buf)
	if n > J22PayloadSize {
		t.Errorf("Packed size: got %d, want %d", n, J22PayloadSize)
	}

	decoded := UnpackJ22SubsurfaceTrack(buf)

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.Depth != orig.Depth {
		t.Errorf("Depth: got %f, want %f", decoded.Depth, orig.Depth)
	}
}

func TestJ23LandTrackRoundtrip(t *testing.T) {
	orig := &J23LandTrack{
		TrackNumber:        7777,
		Time:              time.Now(),
		Latitude:          38.9072,
		Longitude:         -77.0369,
		Altitude:          20.0,
		Speed:             20.0,
		Heading:           45.0,
		Course:            42.0,
		VehicleType:      301,
		VehicleID:        0x12345678,
		Formation:        1,
		UnitSize:         3,
		TrackQuality:     2,
		ParticipantNumber: 10,
		ForceType:        1,
	}

	buf := make([]byte, J23PayloadSize)
	n := PackJ23LandTrack(orig, buf)
	if n > J23PayloadSize {
		t.Errorf("Packed size: got %d, want %d", n, J23PayloadSize)
	}

	decoded := UnpackJ23LandTrack(buf)

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.VehicleType != orig.VehicleType {
		t.Errorf("VehicleType: got %d, want %d", decoded.VehicleType, orig.VehicleType)
	}
}

func TestJ24ForeignEquipmentRoundtrip(t *testing.T) {
	orig := &J24ForeignEquipment{
		TrackNumber:        6666,
		Time:              time.Now(),
		EquipmentType:     7,
		Nation:            826, // UK
		EquipmentCode:     1234,
		AdditionalInfo:    0xABCDEF00,
		Latitude:          51.5074,
		Longitude:         -0.1278,
		Altitude:          50.0,
		TrackQuality:     2,
		ParticipantNumber: 15,
		ForceType:        4,
	}

	buf := make([]byte, J24PayloadSize)
	n := PackJ24ForeignEquipment(orig, buf)
	if n > J24PayloadSize {
		t.Errorf("Packed size: got %d, want %d", n, J24PayloadSize)
	}

	decoded := UnpackJ24ForeignEquipment(buf)

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.Nation != orig.Nation {
		t.Errorf("Nation: got %d, want %d", decoded.Nation, orig.Nation)
	}
}

func TestJ25ProductionLevelRoundtrip(t *testing.T) {
	orig := &J25ProductionLevel{
		TrackNumber:        5555,
		Time:              time.Now(),
		SystemType:        3,
		ProductionType:    1,
		CurrentLevel:      50000,
		MaximumLevel:      100000,
		Utilization:       50,
		QueueDepth:        100,
		Latency:           25,
		Throughput:        2000,
		TrackQuality:     1,
		ParticipantNumber: 20,
		ForceType:        1,
	}

	buf := make([]byte, J25PayloadSize)
	n := PackJ25ProductionLevel(orig, buf)
	if n > J25PayloadSize {
		t.Errorf("Packed size: got %d, want %d", n, J25PayloadSize)
	}

	decoded := UnpackJ25ProductionLevel(buf)

	if decoded.TrackNumber != orig.TrackNumber {
		t.Errorf("TrackNumber: got %d, want %d", decoded.TrackNumber, orig.TrackNumber)
	}
	if decoded.CurrentLevel != orig.CurrentLevel {
		t.Errorf("CurrentLevel: got %d, want %d", decoded.CurrentLevel, orig.CurrentLevel)
	}
	if decoded.Utilization != orig.Utilization {
		t.Errorf("Utilization: got %d, want %d", decoded.Utilization, orig.Utilization)
	}
}

// =============================================================================
// Validation & Edge Case Tests
// =============================================================================

func TestValidateLatitude(t *testing.T) {
	tests := []struct {
		lat   float64
		valid bool
	}{
		{0, true},
		{45.0, true},
		{-45.0, true},
		{90.0, true},
		{-90.0, true},
		{91.0, false},
		{-91.0, false},
		{180.0, false},
	}

	for _, tc := range tests {
		err := ValidateLatitude(tc.lat)
		if (err == nil) != tc.valid {
			t.Errorf("ValidateLatitude(%f): got error=%v, want valid=%v", tc.lat, err, tc.valid)
		}
	}
}

func TestValidateLongitude(t *testing.T) {
	tests := []struct {
		lon   float64
		valid bool
	}{
		{0, true},
		{90.0, true},
		{-90.0, true},
		{180.0, true},
		{-180.0, true},
		{181.0, false},
		{-181.0, false},
	}

	for _, tc := range tests {
		err := ValidateLongitude(tc.lon)
		if (err == nil) != tc.valid {
			t.Errorf("ValidateLongitude(%f): got error=%v, want valid=%v", tc.lon, err, tc.valid)
		}
	}
}

func TestValidateTrackNumber(t *testing.T) {
	tests := []struct {
		tn    uint16
		valid bool
	}{
		{1, true},
		{100, true},
		{0xFFFB, true},
		{0, false},
		{0xFFFC, false},
		{0xFFFF, false},
	}

	for _, tc := range tests {
		err := ValidateTrackNumber(tc.tn)
		if (err == nil) != tc.valid {
			t.Errorf("ValidateTrackNumber(0x%X): got error=%v, want valid=%v", tc.tn, err, tc.valid)
		}
	}
}

func TestJ8Reassembler(t *testing.T) {
	r := NewJ8Reassembler()

	// Fragment a message
	sessionID := uint16(1234)
	totalFragments := uint8(3)

	frag1 := &J8Fragment{SessionID: sessionID, FragmentIndex: 0, TotalFragments: totalFragments, Data: []byte("Hello ")}
	frag2 := &J8Fragment{SessionID: sessionID, FragmentIndex: 1, TotalFragments: totalFragments, Data: []byte("World ")}
	frag3 := &J8Fragment{SessionID: sessionID, FragmentIndex: 2, TotalFragments: totalFragments, Data: []byte("!")}

	// Add first two fragments - not complete
	data, complete := r.AddFragment(frag1)
	if complete || data != nil {
		t.Errorf("After 1 frag: complete=%v, data=%v - want nil/false", complete, data)
	}

	data, complete = r.AddFragment(frag2)
	if complete || data != nil {
		t.Errorf("After 2 frag: complete=%v, data=%v - want nil/false", complete, data)
	}

	// Add third - should complete
	data, complete = r.AddFragment(frag3)
	if !complete {
		t.Errorf("After 3 frag: complete=%v - want true", complete)
	}
	if string(data) != "Hello World !" {
		t.Errorf("Got %q, want %q", string(data), "Hello World !")
	}

	// Session should be cleared
	if len(r.fragments) != 0 {
		t.Errorf("Session not cleared: %v", r.fragments)
	}
}

func TestJ31Reassembler(t *testing.T) {
	r := NewJ31Reassembler()

	transferID := uint16(5678)
	totalChunks := uint16(2)

	chunk1 := &J31Chunk{TransferID: transferID, ChunkIndex: 0, TotalChunks: totalChunks, Data: []byte("File data part 1 ")}
	chunk2 := &J31Chunk{TransferID: transferID, ChunkIndex: 1, TotalChunks: totalChunks, Data: []byte("part 2")}

	// Add first chunk
	complete, _ := r.AddChunk(chunk1)
	if complete {
		t.Errorf("After 1 chunk: complete=%v - want false", complete)
	}

	// Add second - should complete
	complete, _ = r.AddChunk(chunk2)
	if !complete {
		t.Errorf("After 2 chunks: complete=%v - want true", complete)
	}

	// Session should be cleared
	chunks := r.GetChunks(transferID)
	if len(chunks) != 0 {
		t.Errorf("Session not cleared: %d chunks", len(chunks))
	}
}
