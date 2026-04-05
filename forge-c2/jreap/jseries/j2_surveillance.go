package jseries

import (
	"time"
)

// J2Surveillance represents a J2 Surveillance message (Link 16 Track Initiation).
// Used when a new track is first detected by a sensor, before it becomes a confirmed track.
// J2 is the initial detection message that starts the track correlation process.
type J2Surveillance struct {
	TrackNumber       uint16    // 16 bits: unique track number
	ParticipantNumber  uint16    // 16 bits: network participant number
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
	SensorID          string    // originating sensor identifier
}

// J2PayloadSize is the packed size of a J2 Surveillance message in bytes.
const J2PayloadSize = 40

// PackJ2Surveillance packs a J2 Surveillance message into a byte buffer.
// buf must be at least J2PayloadSize bytes.
func PackJ2Surveillance(j2 *J2Surveillance, buf []byte) {
	off := 0

	PackUint16(j2.TrackNumber, buf, off); off += 2
	PackUint16(j2.ParticipantNumber, buf, off); off += 2
	buf[off] = j2.TrackStatus; off++

	latP := PackLatitudePacked(j2.Latitude)
	lonP := PackLongitudePacked(j2.Longitude)
	PackUint32(latP, buf, off); off += 4
	PackUint32(lonP, buf, off); off += 4

	PackUint24(uint32(j2.Altitude), buf, off); off += 3

	// Speed: 24 bits, 0.1 m/s resolution, max ~1.6M m/s
	speedVal := uint32(j2.Speed * 10)
	PackUint24(speedVal, buf, off); off += 3

	// Heading: 14 bits used out of 24 bits, 0.0057 deg resolution
	hdgVal := uint32(j2.Heading / 0.0057)
	if hdgVal > 0x3FFF {
		hdgVal = 0x3FFF
	}
	PackUint24(hdgVal, buf, off); off += 3

	// Radial velocity: 24 bits, offset -819.2 m/s, 0.1 m/s resolution
	rvVal := uint32((j2.RadialVelocity + 8192) / 0.1)
	PackUint24(rvVal, buf, off); off += 3

	// Signal intensity: 16 bits, 0.1 dBsm resolution
	sigVal := uint16(j2.SignalIntensity * 10)
	PackUint16(sigVal, buf, off); off += 2

	// Frequency: 16 bits, kHz resolution
	freqVal := uint16(j2.Frequency / 1000)
	PackUint16(freqVal, buf, off); off += 2

	// SNR: 16 bits, 0.1 dB resolution
	snrVal := uint16(j2.SNR * 10)
	PackUint16(snrVal, buf, off); off += 2

	// Confidence: 8 bits, 0-100 -> 0-255
	confVal := uint8(j2.Confidence * 100)
	buf[off] = confVal; off++

	ms := PackMilliseconds(j2.Timestamp)
	PackUint32(ms, buf, off); off += 4

	buf[off] = j2.ForceType; off++

	PackUint16(j2.PlatformType, buf, off)
}

// UnpackJ2Surveillance unpacks a J2 Surveillance message from a byte buffer.
func UnpackJ2Surveillance(buf []byte) *J2Surveillance {
	if len(buf) < J2PayloadSize {
		return nil
	}
	j2 := &J2Surveillance{}
	off := 0

	j2.TrackNumber = UnpackUint16(buf, off); off += 2
	j2.ParticipantNumber = UnpackUint16(buf, off); off += 2
	j2.TrackStatus = buf[off]; off++

	latP := UnpackUint32(buf, off); off += 4
	lonP := UnpackUint32(buf, off); off += 4
	j2.Latitude = UnpackLatitudePacked(latP)
	j2.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackUint24(buf, off); off += 3
	j2.Altitude = float64(altP)

	speedP := UnpackUint24(buf, off); off += 3
	j2.Speed = float64(speedP) / 10.0

	hdgP := UnpackUint24(buf, off); off += 3
	j2.Heading = float64(hdgP&0x3FFF) * 0.0057

	radVelP := UnpackUint24(buf, off); off += 3
	j2.RadialVelocity = float64(radVelP)*0.1 - 819.2

	sigP := UnpackUint16(buf, off); off += 2
	j2.SignalIntensity = float64(sigP) / 10.0

	freqP := UnpackUint16(buf, off); off += 2
	j2.Frequency = float64(freqP) * 1000

	snrP := UnpackUint16(buf, off); off += 2
	j2.SNR = float64(snrP) / 10.0

	j2.Confidence = float64(buf[off]) / 100.0; off++

	ms := UnpackUint32(buf, off); off += 4
	j2.Timestamp = UnpackMilliseconds(ms)

	j2.ForceType = buf[off]; off++

	j2.PlatformType = UnpackUint16(buf, off)

	return j2
}
