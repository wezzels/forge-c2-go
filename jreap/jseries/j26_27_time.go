package jseries

import (
	"time"
)

// J26 subtypes
const (
	J26SubtypeTestMessage uint8 = 0 // Test message
	J26SubtypeDiagnostic  uint8 = 1 // Diagnostic message
)

// J26Test represents a J26 Test message.
// Used to send test and diagnostic messages on the Link 16 network.
type J26Test struct {
	Subtype           uint8  // 8 bits: test subtype
	TestID            uint16 // 16 bits: test identifier
	ParticipantNumber uint16 // 16 bits: sending participant
	TestData          string // up to 64 bytes: test data payload
	Time              time.Time
}

// J26PayloadSize is the packed byte size of a J26 Test message.
// Breakdown: Subtype(1)+TestID(2)+PartNum(2)+TestData(64)+Time(4) = 73
const J26PayloadSize = 73

// PackJ26Test packs a J26 Test message into buf.
func PackJ26Test(j26 *J26Test, buf []byte) {
	off := 0

	buf[off] = j26.Subtype
	off++
	PackUint16(j26.TestID, buf, off)
	off += 2
	PackUint16(j26.ParticipantNumber, buf, off)
	off += 2

	// Test data: 64 bytes, null-padded
	for i := 0; i < 64; i++ {
		if i < len(j26.TestData) {
			buf[off+i] = j26.TestData[i]
		} else {
			buf[off+i] = 0
		}
	}
	off += 64

	ms := PackMilliseconds(j26.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ26Test unpacks a J26 Test message from buf.
func UnpackJ26Test(buf []byte) *J26Test {
	if len(buf) < J26PayloadSize {
		return nil
	}
	j26 := &J26Test{}
	off := 0

	j26.Subtype = buf[off]
	off++
	j26.TestID = UnpackUint16(buf, off)
	off += 2
	j26.ParticipantNumber = UnpackUint16(buf, off)
	off += 2

	data := make([]byte, 0, 64)
	for i := 0; i < 64; i++ {
		if buf[off+i] != 0 {
			data = append(data, buf[off+i])
		}
	}
	j26.TestData = string(data)
	off += 64

	ms := UnpackUint32(buf, off)
	j26.Time = UnpackMilliseconds(ms)

	return j26
}

// J27 subtypes
const (
	J27SubtypeTimeTick       uint8 = 0 // Time tick / sync pulse
	J27SubtypeTimeCorrection uint8 = 1 // Time correction
	J27SubtypeDateTime       uint8 = 2 // Date/time broadcast
)

// J27Time represents a J27 Time message.
// Used for network time synchronization — time ticks, corrections, and date/time broadcasts.
type J27Time struct {
	Subtype        uint8     // 8 bits: time message subtype
	Time           time.Time // 64 bits: NTP-format timestamp
	TimeOffset     float64   // seconds: offset from network time
	TimeQuality    uint8     // 8 bits: time quality 0=best
	LeapSeconds    int8      // 8 bits: UTC leap seconds offset
	TimeZoneOffset int8      // 8 bits: local timezone offset from UTC (hours)
	DSTIndicator   uint8     // 8 bits: DST indicator (0=standard, 1=DST)
}

// J27PayloadSize is the packed byte size of a J27 Time message.
const J27PayloadSize = 15

// PackJ27Time packs a J27 Time message into buf.
func PackJ27Time(j27 *J27Time, buf []byte) {
	off := 0

	buf[off] = j27.Subtype
	off++

	ts := PackTimestampNTP(j27.Time)
	PackUint40(ts, buf, off)
	off += 5

	offP := int16(j27.TimeOffset * 1000)
	PackInt16(offP, buf, off)
	off += 2

	buf[off] = j27.TimeQuality
	off++
	buf[off] = byte(j27.LeapSeconds)
	off++
	buf[off] = byte(j27.TimeZoneOffset)
	off++
	buf[off] = j27.DSTIndicator
	off++

	// Already 12 bytes; pad to 15 with 3 spare
	ms := PackMilliseconds(j27.Time)
	PackUint24(ms, buf, off)
}

// UnpackJ27Time unpacks a J27 Time message from buf.
func UnpackJ27Time(buf []byte) *J27Time {
	if len(buf) < J27PayloadSize {
		return nil
	}
	j27 := &J27Time{}
	off := 0

	j27.Subtype = buf[off]
	off++

	ts := UnpackUint40(buf, off)
	j27.Time = UnpackTimestampNTP(ts)
	off += 5

	offP := UnpackInt16(buf, off)
	j27.TimeOffset = float64(offP) / 1000.0
	off += 2

	j27.TimeQuality = buf[off]
	off++
	j27.LeapSeconds = int8(buf[off])
	off++
	j27.TimeZoneOffset = int8(buf[off])
	off++
	j27.DSTIndicator = buf[off]
	off++

	ms := UnpackUint24(buf, off)
	j27.Time = UnpackMilliseconds(ms)

	return j27
}
