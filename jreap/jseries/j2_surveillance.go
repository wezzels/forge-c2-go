package jseries

import (
	"time"
)

// J2Surveillance represents a J2 Surveillance message (Link 16 Track Initiation).
// Used when a new track is first detected by a sensor, before it becomes a confirmed track.
// J2 is the initial detection message that starts the track correlation process.
type J2Surveillance struct {
	TrackNumber       uint16    // 16 bits: unique track number
	ParticipantNumber uint16    // 16 bits: network participant number
	TrackStatus       uint8     // 8 bits: track quality/status
	Latitude          float64   // degrees, -90 to 90
	Longitude         float64   // degrees, -180 to 180
	Altitude          float64   // meters WGS-84
	Speed             float64   // m/s
	Heading           float64   // degrees 0-360
	CourseOverGround  float64   // degrees
	RadialVelocity    float64   // m/s (positive = approaching)
	SignalIntensity   float64   // dBsm (radar) or K (IR)
	Frequency         float64   // Hz (radar frequency)
	SNR               float64   // dB
	Confidence        float64   // 0-1 detection confidence
	Timestamp         time.Time // milliseconds since epoch
	ForceType         uint8     // 8 bits: FRIEND/HOSTILE/NEUTRAL/UNKNOWN
	PlatformType      uint16    // 16 bits: platform classification code
	SensorID          string    // 8 bytes: originating sensor identifier (null-padded)
}

// J2PayloadSize is the packed size of a J2 Surveillance message in bytes.
// Breakdown: TrackNum(2)+PartNum(2)+Status(1)+Lat(3)+Lon(3)+Alt(3)+Speed(3)+
// Heading(2)+RadialVel(3)+SignalInt(2)+Freq(2)+SNR(2)+Conf(1)+Time(4)+
// ForceType(1)+PlatformType(2)+SensorID(8) = 44
const J2PayloadSize = 44

// PackJ2Surveillance packs a J2 Surveillance message into a byte buffer.
// buf must be at least J2PayloadSize bytes.
func PackJ2Surveillance(j2 *J2Surveillance, buf []byte) {
	off := 0

	// Track number: 16 bits
	PackUint16(j2.TrackNumber, buf, off)
	off += 2

	// Participant number: 16 bits
	PackUint16(j2.ParticipantNumber, buf, off)
	off += 2

	// Track status: 8 bits
	buf[off] = j2.TrackStatus
	off++

	// Latitude: 24-bit NIPO packed (-90 to 90)
	latP := PackLatitudePacked(j2.Latitude)
	PackUint24(latP, buf, off)
	off += 3

	// Longitude: 24-bit NIPO packed (-180 to 180)
	lonP := PackLongitudePacked(j2.Longitude)
	PackUint24(lonP, buf, off)
	off += 3

	// Altitude: 24 bits, meters
	PackUint24(uint32(j2.Altitude), buf, off)
	off += 3

	// Speed: 24 bits, 0.1 m/s resolution, max ~1.6M m/s
	speedVal := uint32(j2.Speed * 10)
	PackUint24(speedVal, buf, off)
	off += 3

	// Heading: 16 bits, 0.0057 deg resolution, max 359.99° (14 bits)
	hdgVal := uint16(j2.Heading / 0.0057)
	if hdgVal > 0x3FFF {
		hdgVal = 0x3FFF
	}
	PackUint16(hdgVal, buf, off)
	off += 2

	// Radial velocity: 24 bits, offset -819.2 m/s, 0.1 m/s resolution
	rvVal := uint32((j2.RadialVelocity + 8192) / 0.1)
	PackUint24(rvVal, buf, off)
	off += 3

	// Signal intensity: 16 bits, 0.1 dBsm resolution
	sigVal := uint16(j2.SignalIntensity * 10)
	PackUint16(sigVal, buf, off)
	off += 2

	// Frequency: 16 bits, kHz resolution
	freqVal := uint16(j2.Frequency / 1000)
	PackUint16(freqVal, buf, off)
	off += 2

	// SNR: 16 bits, 0.1 dB resolution
	snrVal := uint16(j2.SNR * 10)
	PackUint16(snrVal, buf, off)
	off += 2

	// Confidence: 8 bits, 0-100 -> 0-255
	confVal := uint8(j2.Confidence * 100)
	buf[off] = confVal
	off++

	// Timestamp: 32 bits, milliseconds since epoch
	ms := PackMilliseconds(j2.Timestamp)
	PackUint32(ms, buf, off)
	off += 4

	// Force type: 8 bits
	buf[off] = j2.ForceType
	off++

	// Platform type: 16 bits
	PackUint16(j2.PlatformType, buf, off)
	off += 2

	// Sensor ID: 8 bytes, null-padded
	for i := 0; i < 8; i++ {
		if i < len(j2.SensorID) {
			buf[off+i] = j2.SensorID[i]
		} else {
			buf[off+i] = 0
		}
	}
}

// UnpackJ2Surveillance unpacks a J2 Surveillance message from a byte buffer.
func UnpackJ2Surveillance(buf []byte) *J2Surveillance {
	if len(buf) < J2PayloadSize {
		return nil
	}
	j2 := &J2Surveillance{}
	off := 0

	// Track number: 16 bits
	j2.TrackNumber = UnpackUint16(buf, off)
	off += 2

	// Participant number: 16 bits
	j2.ParticipantNumber = UnpackUint16(buf, off)
	off += 2

	// Track status: 8 bits
	j2.TrackStatus = buf[off]
	off++

	// Latitude: 24-bit NIPO
	latP := UnpackUint24(buf, off)
	off += 3
	j2.Latitude = UnpackLatitudePacked(latP)

	// Longitude: 24-bit NIPO
	lonP := UnpackUint24(buf, off)
	off += 3
	j2.Longitude = UnpackLongitudePacked(lonP)

	// Altitude: 24 bits
	altP := UnpackUint24(buf, off)
	off += 3
	j2.Altitude = float64(altP)

	// Speed: 24 bits
	speedP := UnpackUint24(buf, off)
	off += 3
	j2.Speed = float64(speedP) / 10.0

	// Heading: 16 bits
	hdgP := UnpackUint16(buf, off)
	off += 2
	j2.Heading = float64(hdgP&0x3FFF) * 0.0057

	// Radial velocity: 24 bits
	radVelP := UnpackUint24(buf, off)
	off += 3
	j2.RadialVelocity = float64(radVelP)*0.1 - 819.2

	// Signal intensity: 16 bits
	sigP := UnpackUint16(buf, off)
	off += 2
	j2.SignalIntensity = float64(sigP) / 10.0

	// Frequency: 16 bits
	freqP := UnpackUint16(buf, off)
	off += 2
	j2.Frequency = float64(freqP) * 1000

	// SNR: 16 bits
	snrP := UnpackUint16(buf, off)
	off += 2
	j2.SNR = float64(snrP) / 10.0

	// Confidence: 8 bits
	j2.Confidence = float64(buf[off]) / 100.0
	off++

	// Timestamp: 32 bits
	ms := UnpackUint32(buf, off)
	off += 4
	j2.Timestamp = UnpackMilliseconds(ms)

	// Force type: 8 bits
	j2.ForceType = buf[off]
	off++

	// Platform type: 16 bits
	j2.PlatformType = UnpackUint16(buf, off)
	off += 2

	// Sensor ID: 8 bytes, null-terminated string
	sensorID := make([]byte, 0, 8)
	for i := 0; i < 8; i++ {
		if buf[off+i] != 0 {
			sensorID = append(sensorID, buf[off+i])
		}
	}
	j2.SensorID = string(sensorID)

	return j2
}
