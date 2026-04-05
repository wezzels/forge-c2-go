package jseries

import (
	"math"
	"time"
)

// PackUint16 packs a uint16 into buf at byte offset bo (big-endian, network byte order).
// buf must have at least bo+2 bytes.
func PackUint16(value uint16, buf []byte, bo int) {
	buf[bo] = byte(value >> 8)
	buf[bo+1] = byte(value)
}

// UnpackUint16 unpacks a uint16 from buf starting at byte offset bo (big-endian).
func UnpackUint16(buf []byte, bo int) uint16 {
	return uint16(buf[bo])<<8 | uint16(buf[bo+1])
}

// PackUint32 packs a uint32 into buf at byte offset bo (big-endian).
// buf must have at least bo+4 bytes.
func PackUint32(value uint32, buf []byte, bo int) {
	PackUint16(uint16(value>>16), buf, bo)
	PackUint16(uint16(value), buf, bo+2)
}

// UnpackUint32 unpacks a uint32 from buf starting at byte offset bo (big-endian).
func UnpackUint32(buf []byte, bo int) uint32 {
	return uint32(UnpackUint16(buf, bo))<<16 | uint32(UnpackUint16(buf, bo+2))
}

// PackUint24 packs a 24-bit unsigned integer into buf at byte offset bo (big-endian).
// buf must have at least bo+3 bytes.
func PackUint24(value uint32, buf []byte, bo int) {
	buf[bo] = byte(value >> 16)
	buf[bo+1] = byte(value >> 8)
	buf[bo+2] = byte(value)
}

// UnpackUint24 unpacks a 24-bit unsigned integer from buf at byte offset bo (big-endian).
func UnpackUint24(buf []byte, bo int) uint32 {
	return uint32(buf[bo])<<16 | uint32(buf[bo+1])<<8 | uint32(buf[bo+2])
}

// PackFloat24 packs a float64 into 24 bits using range and maxValue.
// The value is scaled such that (min,max) maps to (0,maxValue).
// For lat: range=180 (covers -90 to 90), maxValue=0xFFFFFF
// For lon: range=360 (covers -180 to 180), maxValue=0xFFFFFF
func PackFloat24(value, range_, maxValue float64) uint32 {
	v := (value + range_/2.0) / range_ * maxValue
	if v < 0 {
		v = 0
	}
	if v > maxValue {
		v = maxValue
	}
	return uint32(v)
}

// UnpackFloat24 unpacks a 24-bit float using range and maxValue.
// The inverse of PackFloat24.
func UnpackFloat24(data uint32, range_, maxValue float64) float64 {
	return float64(data)/maxValue*range_ - range_/2.0
}

// PackScaledFloat packs a float64 into a uint16 using a linear scale.
func PackScaledFloat(value float64, scale float64) uint16 {
	v := uint16(value * scale)
	return v
}

// UnpackScaledFloat unpacks a uint16 into a float64 using a linear scale.
func UnpackScaledFloat(data uint16, scale float64) float64 {
	return float64(data) / scale
}

// CRC16 computes CRC-16 (Ethernet polynomial 0x8005, reflected) over data.
func CRC16(data []byte) uint16 {
	crc := uint16(0xFFFF)
	for _, b := range data {
		crc ^= uint16(b)
		for i := 0; i < 8; i++ {
			if crc&1 != 0 {
				crc = (crc >> 1) ^ 0xA001
			} else {
				crc >>= 1
			}
		}
	}
	return crc
}

// PackLatitude packs a latitude in degrees to 24-bit NIPO format.
// Range: -90 to +90 degrees.
func PackLatitude(lat float64) uint32 {
	return PackFloat24(lat, 180.0, -90.0)
}

// UnpackLatitude unpacks a 24-bit latitude from NIPO format to degrees.
func UnpackLatitude(data uint32) float64 {
	return UnpackFloat24(data, 180.0, -90.0)
}

// PackLongitude packs a longitude in degrees to 24-bit NIPO format.
// Range: -180 to +180 degrees.
func PackLongitude(lon float64) uint32 {
	return PackFloat24(lon, 360.0, -180.0)
}

// UnpackLongitude unpacks a 24-bit longitude from NIPO format to degrees.
func UnpackLongitude(data uint32) float64 {
	return UnpackFloat24(data, 360.0, -180.0)
}

// PackAltitudeNIPO packs altitude in meters to 24-bit NIPO/meters format.
// Range: 0 to 16,777,215 m (~16,777 km, well beyond space).
func PackAltitudeNIPO(altMeters float64) uint32 {
	v := uint32(altMeters)
	if v > 0xFFFFFF {
		v = 0xFFFFFF
	}
	return v
}

// UnpackAltitudeNIPO unpacks a 24-bit altitude in meters.
func UnpackAltitudeNIPO(data uint32) float64 {
	return float64(data)
}

// PackVelocity packs a velocity in m/s to 16-bit format.
// Scale: 0.1 m/s resolution, max ~6553 m/s (~Mach 19).
func PackVelocity(mps float64) uint16 {
	v := uint16(mps * 10)
	return v
}

// UnpackVelocity unpacks a 16-bit velocity to m/s.
func UnpackVelocity(data uint16) float64 {
	return float64(data) / 10.0
}

// PackHeading packs a heading angle in degrees to 16-bit.
// Scale: 0.01 degrees, max 359.99 degrees.
func PackHeading(deg float64) uint16 {
	if deg < 0 {
		deg += 360
	}
	if deg >= 360 {
		deg = 0
	}
	v := uint16(deg * 100)
	return v
}

// UnpackHeading unpacks a 16-bit heading to degrees.
func UnpackHeading(data uint16) float64 {
	return float64(data) / 100.0
}

// PackMilliseconds packs a time.Time to 32-bit milliseconds since Unix epoch.
func PackMilliseconds(t time.Time) uint32 {
	return uint32(t.UnixMilli())
}

// UnpackMilliseconds unpacks 32-bit milliseconds to time.Time.
func UnpackMilliseconds(data uint32) time.Time {
	return time.UnixMilli(int64(data)).UTC()
}

// PackTimestampNTP packs a timestamp to 64-bit NTP format (seconds + fraction).
// Used for Link 16 network time synchronization.
func PackTimestampNTP(t time.Time) uint64 {
	sec := uint64(t.Unix() + 2208988800) // NTP epoch offset
	ms := uint64(t.UnixMilli() % 1000)
	frac := (ms * 0xFFFFFFFF) / 1000
	return sec<<32 | frac
}

// UnpackTimestampNTP unpacks a 64-bit NTP timestamp to time.Time.
func UnpackTimestampNTP(data uint64) time.Time {
	sec := int64(data>>32) - 2208988800
	ms := int64((data&0xFFFFFFFF)*1000/0xFFFFFFFF) * 1_000_000
	return time.Unix(sec, ms).UTC()
}

// PackLatitudePacked packs latitude using Link 16 24-bit signed integer format.
// Range: -90 to +90 degrees.
func PackLatitudePacked(lat float64) uint32 {
	v := int64(lat * (float64(0xFFFFFF) / 2.0 / 90.0))
	if v < 0 {
		v += 0x1000000
	}
	return uint32(v & 0xFFFFFF)
}

// UnpackLatitudePacked unpacks a 24-bit signed latitude to degrees.
func UnpackLatitudePacked(data uint32) float64 {
	v := int32(data)
	if v >= 0x800000 {
		v -= 0x1000000
	}
	return float64(v) * 90.0 / float64(0x7FFFFF)
}

// PackLongitudePacked packs longitude using Link 16 24-bit signed integer format.
// Range: -180 to +180 degrees.
func PackLongitudePacked(lon float64) uint32 {
	v := int64(lon * (float64(0xFFFFFF) / 2.0 / 180.0))
	if v < 0 {
		v += 0x1000000
	}
	return uint32(v & 0xFFFFFF)
}

// UnpackLongitudePacked unpacks a 24-bit signed longitude to degrees.
func UnpackLongitudePacked(data uint32) float64 {
	v := int32(data)
	if v >= 0x800000 {
		v -= 0x1000000
	}
	return float64(v) * 180.0 / float64(0x7FFFFF)
}

// PackCOVE packs a Course Over Ground / Velocity value.
// Format: bit 31 = validity, bits 30-16 = direction (0.0057 deg), bits 15-0 = speed (0.1 m/s).
func PackCOVE(valid bool, directionDeg, speedMPS float64) uint32 {
	var v uint32
	if valid {
		v |= 1 << 31
	}
	dir := uint32(directionDeg / 0.0057)
	if dir > 0x3FFF {
		dir = 0x3FFF
	}
	v |= dir << 16
	speed := uint32(speedMPS * 10)
	if speed > 0xFFFF {
		speed = 0xFFFF
	}
	v |= speed
	return v
}

// UnpackCOVE unpacks a COVE value to direction (deg) and speed (m/s).
func UnpackCOVE(data uint32) (valid bool, directionDeg, speedMPS float64) {
	valid = (data & (1 << 31)) != 0
	dirRaw := (data >> 16) & 0x3FFF
	speedRaw := data & 0xFFFF
	directionDeg = float64(dirRaw) * 0.0057
	speedMPS = float64(speedRaw) / 10.0
	return
}

// PackGeodeticAltitude packs altitude above WGS-84 ellipsoid.
// Bits: sign(1) + units(2) + value(21) = 24 bits.
// unit codes: 0=meters, 1=feet, 2=kilometers, 3=fathoms.
func PackGeodeticAltitude(altMeters float64, unitCode uint8) uint32 {
	v := uint32(unitCode & 0x03)
	if altMeters < 0 {
		v |= 1 << 23
		altMeters = -altMeters
	}
	altVal := uint32(altMeters)
	if altVal > 0x1FFFFF {
		altVal = 0x1FFFFF
	}
	v |= altVal
	return v
}

// UnpackGeodeticAltitude unpacks geodetic altitude. Returns unit code and meters.
func UnpackGeodeticAltitude(data uint32) (altMeters float64, unitCode uint8) {
	unitCode = uint8(data >> 23)
	sign := (data & (1 << 23)) != 0
	altVal := data & 0x7FFFFF
	altMeters = float64(altVal)
	if sign {
		altMeters = -altMeters
	}
	switch unitCode {
	case 1:
		altMeters *= 0.3048
	case 2:
		altMeters *= 1000
	case 3:
		altMeters *= 1.8288
	}
	return
}

// QualityIndicator holds Link 16 track quality bits.
type QualityIndicator struct {
	Quality    uint8 // 0-3: track quality (low to high)
	Jamming    bool  // jammed
	MultiPath  bool  // multipath interference
	Invalid    bool  // invalid track
	Coasting   bool  // coasting (no recent update)
	Manual     bool  // manually plotted
	Derived    bool  // derived from correlation
	Ambiguous  bool  // ambiguous association
}

// PackQuality packs quality indicator bits into a byte.
func PackQuality(q QualityIndicator) uint8 {
	var b uint8
	b |= q.Quality & 0x03
	if q.Jamming {
		b |= 1 << 2
	}
	if q.MultiPath {
		b |= 1 << 3
	}
	if q.Invalid {
		b |= 1 << 4
	}
	if q.Coasting {
		b |= 1 << 5
	}
	if q.Manual {
		b |= 1 << 6
	}
	if q.Derived {
		b |= 1 << 7
	}
	return b
}

// UnpackQuality unpacks a quality byte into a QualityIndicator.
func UnpackQuality(b uint8) QualityIndicator {
	return QualityIndicator{
		Quality:   b & 0x03,
		Jamming:   (b & (1 << 2)) != 0,
		MultiPath: (b & (1 << 3)) != 0,
		Invalid:   (b & (1 << 4)) != 0,
		Coasting:  (b & (1 << 5)) != 0,
		Manual:    (b & (1 << 6)) != 0,
		Derived:   (b & (1 << 7)) != 0,
	}
}

// RoundTripFloat24 is a helper to test lat/lon packing round-trips.
func RoundTripFloat24(lat float64, scale, offset float64) float64 {
	packed := PackFloat24(lat, scale, offset)
	return UnpackFloat24(packed, scale, offset)
}

// HaversineDistanceMeters computes great-circle distance between two points in meters.
func HaversineDistanceMeters(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371000 // Earth radius in meters
	dLat := (lat2 - lat1) * math.Pi / 180
	dLon := (lon2 - lon1) * math.Pi / 180
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}

// PackUint40 packs a 40-bit unsigned integer into buf at byte offset bo (big-endian).
// buf must have at least bo+5 bytes.
func PackUint40(value uint64, buf []byte, bo int) {
	buf[bo] = byte(value >> 32)
	buf[bo+1] = byte(value >> 24)
	buf[bo+2] = byte(value >> 16)
	buf[bo+3] = byte(value >> 8)
	buf[bo+4] = byte(value)
}

// UnpackUint40 unpacks a 40-bit unsigned integer from buf at byte offset bo (big-endian).
func UnpackUint40(buf []byte, bo int) uint64 {
	return uint64(buf[bo])<<32 | uint64(buf[bo+1])<<24 |
		uint64(buf[bo+2])<<16 | uint64(buf[bo+3])<<8 | uint64(buf[bo+4])
}
