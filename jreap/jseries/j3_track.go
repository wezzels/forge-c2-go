package jseries

import (
	"time"
)

// J3TrackUpdate represents a J3.0 Track Update message (MIL-STD-6016).
// Confirmed track with full kinematic data, used after J2 surveillance correlation.
type J3TrackUpdate struct {
	TrackNumber  uint16           // 16 bits
	Time         time.Time        // 32 bits: milliseconds since epoch
	Latitude     float64          // degrees, -90 to 90 (24-bit NIPO)
	Longitude    float64          // degrees, -180 to 180 (24-bit NIPO)
	Altitude     float64          // meters WGS-84 (24-bit)
	Speed        float64          // m/s (16-bit, 0.1 m/s resolution)
	Heading      float64          // degrees 0-360 (16-bit, 0.0057 deg resolution)
	Status       uint8            // 8 bits: 0=UNKNOWN, 1=NEW, 2=ACTIVE, 3=UPDATED, 4=DROPPED
	ThreatLevel  uint8            // 8 bits: 1-5
	Quality      QualityIndicator // 8 bits: track quality indicator bits
	PlatformType uint8            // 8 bits: platform classification
	ForceType    uint8            // 8 bits: 1= FRIEND, 2=HOSTILE, 3=NEUTRAL, 4=UNKNOWN
}

// J3PayloadSize is the packed byte size of a J3.0 Track Update message.
const J3PayloadSize = 24

// PackJ3TrackUpdate packs a J3.0 Track Update message into buf.
func PackJ3TrackUpdate(t *J3TrackUpdate, buf []byte) {
	off := 0

	PackUint16(t.TrackNumber, buf, off)
	off += 2

	ms := PackMilliseconds(t.Time)
	PackUint32(ms, buf, off)
	off += 4

	latP := PackLatitude(t.Latitude)
	lonP := PackLongitude(t.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := uint32(t.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	speedP := PackVelocity(t.Speed)
	PackUint16(speedP, buf, off)
	off += 2

	hdgP := uint16(t.Heading / 0.0057)
	if hdgP > 0x3FFF {
		hdgP = 0x3FFF
	}
	PackUint16(hdgP, buf, off)
	off += 2

	buf[off] = t.Status
	off++
	buf[off] = t.ThreatLevel
	off++
	buf[off] = PackQuality(t.Quality)
	off++
	buf[off] = t.PlatformType
	off++
	buf[off] = t.ForceType
}

// UnpackJ3TrackUpdate unpacks a J3.0 Track Update message from buf.
func UnpackJ3TrackUpdate(buf []byte) *J3TrackUpdate {
	if len(buf) < J3PayloadSize {
		return nil
	}
	t := &J3TrackUpdate{}
	off := 0

	t.TrackNumber = UnpackUint16(buf, off)
	off += 2

	ms := UnpackUint32(buf, off)
	off += 4
	t.Time = UnpackMilliseconds(ms)

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	t.Latitude = UnpackLatitude(latP)
	t.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	t.Altitude = float64(altP)

	speedP := UnpackUint16(buf, off)
	off += 2
	t.Speed = UnpackVelocity(speedP)

	hdgP := UnpackUint16(buf, off)
	off += 2
	t.Heading = float64(hdgP&0x3FFF) * 0.0057

	t.Status = buf[off]
	off++
	t.ThreatLevel = buf[off]
	off++
	t.Quality = UnpackQuality(buf[off])
	off++
	t.PlatformType = buf[off]
	off++
	t.ForceType = buf[off]

	return t
}
