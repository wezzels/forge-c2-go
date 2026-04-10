package jseries

import (
	"time"
)

// Platform/sensor subtypes
const (
	J7SubtypePlatformData uint8 = 0 // Platform position/status data
	J7SubtypeSensorData   uint8 = 1 // Sensor measurement data
	J7SubtypeTrackQuality uint8 = 2 // Track quality report
	J7SubtypeSystemStatus uint8 = 3 // System status report
)

// J7PlatformData represents a J7 Platform/Sensor Data message.
// Used to disseminate platform position, velocity, attitude, and sensor health.
type J7PlatformData struct {
	TrackNumber     uint16  // 16 bits: associated track number
	Subtype         uint8   // 8 bits: J7 subtype
	Latitude        float64 // degrees
	Longitude       float64 // degrees
	Altitude        float64 // meters
	Speed           float64 // m/s
	Heading         float64 // degrees 0-360
	Roll            float64 // degrees
	Pitch           float64 // degrees
	Yaw             float64 // degrees
	AngularVelocity float64 // rad/s
	PlatformType    uint16  // 16 bits: platform classification
	ForceType       uint8   // 8 bits: FRIEND/HOSTILE/NEUTRAL/UNKNOWN
	SignalType      uint8   // 8 bits: 1=RF, 2=IR, 3=EO, 4=ACOUSTIC
	Frequency       float64 // Hz (sensor center frequency)
	Bandwidth       float64 // Hz (sensor bandwidth)
	SNR             float64 // dB
	Timestamp       time.Time
}

// J7PayloadSize is the packed byte size of a J7 Platform/Sensor Data message.
const J7PayloadSize = 47

// PackJ7PlatformData packs a J7 Platform/Sensor Data message into buf.
func PackJ7PlatformData(j7 *J7PlatformData, buf []byte) {
	off := 0

	PackUint16(j7.TrackNumber, buf, off)
	off += 2
	buf[off] = j7.Subtype
	off++

	latP := PackLatitudePacked(j7.Latitude)
	lonP := PackLongitudePacked(j7.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := uint32(j7.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	speedP := PackVelocity(j7.Speed)
	PackUint16(speedP, buf, off)
	off += 2

	hdgP := uint16(j7.Heading / 0.0057)
	if hdgP > 0x3FFF {
		hdgP = 0x3FFF
	}
	PackUint16(hdgP, buf, off)
	off += 2

	rollP := int16(j7.Roll / 0.0057)
	PackInt16(rollP, buf, off)
	off += 2

	pitchP := int16(j7.Pitch / 0.0057)
	PackInt16(pitchP, buf, off)
	off += 2

	yawP := uint16(j7.Yaw / 0.0057)
	PackUint16(yawP, buf, off)
	off += 2

	angVelP := uint16((j7.AngularVelocity + 32.767) * 1000)
	PackUint16(angVelP, buf, off)
	off += 2

	PackUint16(j7.PlatformType, buf, off)
	off += 2
	buf[off] = j7.ForceType
	off++
	buf[off] = j7.SignalType
	off++

	freqP := uint16(j7.Frequency / 1000)
	PackUint16(freqP, buf, off)
	off += 2

	bwP := uint16(j7.Bandwidth / 1000)
	PackUint16(bwP, buf, off)
	off += 2

	snrP := uint16(j7.SNR * 10)
	PackUint16(snrP, buf, off)
	off += 2

	ms := PackMilliseconds(j7.Timestamp)
	PackUint32(ms, buf, off)
}

// UnpackJ7PlatformData unpacks a J7 Platform/Sensor Data message from buf.
func UnpackJ7PlatformData(buf []byte) *J7PlatformData {
	if len(buf) < J7PayloadSize {
		return nil
	}
	j7 := &J7PlatformData{}
	off := 0

	j7.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j7.Subtype = buf[off]
	off++

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j7.Latitude = UnpackLatitudePacked(latP)
	j7.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	j7.Altitude = float64(altP)

	speedP := UnpackUint16(buf, off)
	off += 2
	j7.Speed = UnpackVelocity(speedP)

	hdgP := UnpackUint16(buf, off)
	off += 2
	j7.Heading = float64(hdgP&0x3FFF) * 0.0057

	rollP := UnpackInt16(buf, off)
	off += 2
	j7.Roll = float64(rollP) * 0.0057

	pitchP := UnpackInt16(buf, off)
	off += 2
	j7.Pitch = float64(pitchP) * 0.0057

	yawP := UnpackUint16(buf, off)
	off += 2
	j7.Yaw = float64(yawP) * 0.0057

	angVelP := UnpackUint16(buf, off)
	off += 2
	j7.AngularVelocity = (float64(angVelP) / 1000) - 32.767

	j7.PlatformType = UnpackUint16(buf, off)
	off += 2
	j7.ForceType = buf[off]
	off++
	j7.SignalType = buf[off]
	off++

	freqP := UnpackUint16(buf, off)
	off += 2
	j7.Frequency = float64(freqP) * 1000

	bwP := UnpackUint16(buf, off)
	off += 2
	j7.Bandwidth = float64(bwP) * 1000

	snrP := UnpackUint16(buf, off)
	off += 2
	j7.SNR = float64(snrP) / 10.0

	ms := UnpackUint32(buf, off)
	j7.Timestamp = UnpackMilliseconds(ms)

	return j7
}
