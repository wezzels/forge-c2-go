package jseries

import (
	"time"
)

// J10 subtypes
const (
	J10SubtypePositionOffset   uint8 = 0 // Position offset from track
	J10SubtypeVelocityOffset   uint8 = 1 // Velocity offset
	J10SubtypeAreaOffset       uint8 = 2 // Area offset (search pattern center)
	J10SubtypeEngagementOffset uint8 = 3 // Engagement offset point
)

// J10Offset represents a J10 Offset message.
// Used to designate an offset point relative to a track — for engagement timing,
// search pattern centering, or track initiation offset.
type J10Offset struct {
	TrackNumber uint16  // 16 bits: associated track (0 if standalone)
	Subtype     uint8   // 8 bits: J10 subtype
	Latitude    float64 // degrees: offset center latitude
	Longitude   float64 // degrees: offset center longitude
	Altitude    float64 // meters: offset center altitude
	OffsetX     float64 // meters: offset in X (east) direction
	OffsetY     float64 // meters: offset in Y (north) direction
	OffsetZ     float64 // meters: offset in Z (vertical)
	Radius      float64 // meters: offset radius (for area subtypes)
	Angle       float64 // degrees: offset angle (for area subtypes)
	OffsetValid uint32  // 32 bits: validity flags (bit0=X, bit1=Y, bit2=Z, bit3=radius)
	Time        time.Time
}

// J10PayloadSize is the packed byte size of a J10 Offset message.
const J10PayloadSize = 36

// PackJ10Offset packs a J10 Offset message into buf.
func PackJ10Offset(j10 *J10Offset, buf []byte) {
	off := 0

	PackUint16(j10.TrackNumber, buf, off)
	off += 2
	buf[off] = j10.Subtype
	off++

	latP := PackLatitudePacked(j10.Latitude)
	lonP := PackLongitudePacked(j10.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := int32(j10.Altitude)
	PackInt24(altP, buf, off)
	off += 3

	offX := int16(j10.OffsetX / 10)
	PackInt16(offX, buf, off)
	off += 2

	offY := int16(j10.OffsetY / 10)
	PackInt16(offY, buf, off)
	off += 2

	offZ := int16(j10.OffsetZ / 10)
	PackInt16(offZ, buf, off)
	off += 2

	radiusP := uint16(j10.Radius / 10)
	PackUint16(radiusP, buf, off)
	off += 2

	angleP := uint16(j10.Angle / 0.0057)
	PackUint16(angleP, buf, off)
	off += 2

	PackUint32(j10.OffsetValid, buf, off)
	off += 4

	ms := PackMilliseconds(j10.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ10Offset unpacks a J10 Offset message from buf.
func UnpackJ10Offset(buf []byte) *J10Offset {
	if len(buf) < J10PayloadSize {
		return nil
	}
	j10 := &J10Offset{}
	off := 0

	j10.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j10.Subtype = buf[off]
	off++

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j10.Latitude = UnpackLatitudePacked(latP)
	j10.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackInt24(buf, off)
	off += 3
	j10.Altitude = float64(altP)

	offX := UnpackInt16(buf, off)
	off += 2
	j10.OffsetX = float64(offX) * 10

	offY := UnpackInt16(buf, off)
	off += 2
	j10.OffsetY = float64(offY) * 10

	offZ := UnpackInt16(buf, off)
	off += 2
	j10.OffsetZ = float64(offZ) * 10

	radiusP := UnpackUint16(buf, off)
	off += 2
	j10.Radius = float64(radiusP) * 10

	angleP := UnpackUint16(buf, off)
	off += 2
	j10.Angle = float64(angleP) * 0.0057

	j10.OffsetValid = UnpackUint32(buf, off)
	off += 4

	ms := UnpackUint32(buf, off)
	j10.Time = UnpackMilliseconds(ms)

	return j10
}
