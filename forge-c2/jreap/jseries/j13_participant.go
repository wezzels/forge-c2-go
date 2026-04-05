package jseries

import (
	"time"
)

// J13 subtypes
const (
	J13SubtypeParticipantLocation uint8 = 0 // Precise participant location
	J13SubtypeParticipantStatus  uint8 = 1 // Participant status
	J13SubtypeTimeSync           uint8 = 2 // Time synchronization data
)

// J13PrecisionParticipant represents a J13 Precise Participant message.
// Used for high-precision participant location, velocity, time sync, and participation status.
type J13PrecisionParticipant struct {
	TrackNumber       uint16    // 16 bits: track/participant number
	Subtype          uint8     // 8 bits: J13 subtype
	ParticipantNumber uint16    // 16 bits: Link 16 participant number
	Latitude         float64   // degrees: precise latitude
	Longitude        float64   // degrees: precise longitude
	Altitude         float64   // meters: precise altitude
	VelocityX        float64   // m/s: velocity in X (east)
	VelocityY        float64   // m/s: velocity in Y (north)
	VelocityZ        float64   // m/s: velocity in Z (up)
	Time             time.Time // 32 bits: timestamp
	TimeQuality      uint8     // 8 bits: time quality (0=best)
	ClockBias        float64   // seconds: clock bias relative to network
	ClockDrift       float64   // seconds/s: clock drift rate
}

// J13PayloadSize is the packed byte size of a J13 Precise Participant message.
const J13PayloadSize = 50

// PackJ13PrecisionParticipant packs a J13 message into buf.
func PackJ13PrecisionParticipant(j13 *J13PrecisionParticipant, buf []byte) {
	off := 0

	PackUint16(j13.TrackNumber, buf, off); off += 2
	buf[off] = j13.Subtype; off++

	latP := PackLatitudePacked(j13.Latitude)
	lonP := PackLongitudePacked(j13.Longitude)
	PackUint24(latP, buf, off); off += 3
	PackUint24(lonP, buf, off); off += 3

	altP := int32(j13.Altitude * 10)
	PackInt24(altP, buf, off); off += 3

	// Velocity XYZ: 16 bits each, 0.01 m/s resolution, offset 327.68 m/s
	vx := uint16((j13.VelocityX + 327.68) * 100)
	vy := uint16((j13.VelocityY + 327.68) * 100)
	vz := uint16((j13.VelocityZ + 327.68) * 100)
	PackUint16(vx, buf, off); off += 2
	PackUint16(vy, buf, off); off += 2
	PackUint16(vz, buf, off); off += 2

	ms := PackMilliseconds(j13.Time)
	PackUint32(ms, buf, off); off += 4

	buf[off] = j13.TimeQuality; off++

	// Clock bias: 16 bits, 0.01s resolution, offset -327.68s
	cb := int16(j13.ClockBias * 100)
	PackInt16(cb, buf, off); off += 2

	// Clock drift: 16 bits, 0.001 s/s resolution, offset -32.768 s/s
	cd := int16(j13.ClockDrift * 1000)
	PackInt16(cd, buf, off); off += 2

	// Participant number: 16 bits
	PackUint16(j13.ParticipantNumber, buf, off)
}

// UnpackJ13PrecisionParticipant unpacks a J13 message from buf.
func UnpackJ13PrecisionParticipant(buf []byte) *J13PrecisionParticipant {
	if len(buf) < J13PayloadSize {
		return nil
	}
	j13 := &J13PrecisionParticipant{}
	off := 0

	j13.TrackNumber = UnpackUint16(buf, off); off += 2
	j13.Subtype = buf[off]; off++

	latP := UnpackUint24(buf, off); off += 3
	lonP := UnpackUint24(buf, off); off += 3
	j13.Latitude = UnpackLatitudePacked(latP)
	j13.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackInt24(buf, off); off += 3
	j13.Altitude = float64(altP) / 10.0

	vx := UnpackUint16(buf, off); off += 2
	vy := UnpackUint16(buf, off); off += 2
	vz := UnpackUint16(buf, off); off += 2
	j13.VelocityX = float64(vx)/100.0 - 327.68
	j13.VelocityY = float64(vy)/100.0 - 327.68
	j13.VelocityZ = float64(vz)/100.0 - 327.68

	ms := UnpackUint32(buf, off); off += 4
	j13.Time = UnpackMilliseconds(ms)

	j13.TimeQuality = buf[off]; off++

	cb := UnpackInt16(buf, off); off += 2
	j13.ClockBias = float64(cb) / 100.0

	cd := UnpackInt16(buf, off); off += 2
	j13.ClockDrift = float64(cd) / 1000.0

	j13.ParticipantNumber = UnpackUint16(buf, off)

	return j13
}
