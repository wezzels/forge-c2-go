package jseries

import (
	"time"
)

// J6SensorRegistration represents a J6/J7.1 Sensor Registration message.
// Used to register and announce sensor capabilities (OPIR, RADAR, etc.) on the Link 16 network.
type J6SensorRegistration struct {
	SensorID       string    // sensor identifier (e.g. "SBIRS-GEO-1", "TPY-2-1")
	SensorType     uint8     // 8 bits: 1=OPIR, 2=RADAR, 3=SEISMIC, 4=ACOUSTIC
	PlatformType   uint8     // 8 bits: 1=SATELLITE, 2=GROUND, 3=SHIP, 4=AIR
	Capability     uint8     // 8 bits: capability flags (bit0=TRACK, bit1=ENGAGE, bit2=SURVEIL)
	Latitude       float64   // degrees
	Longitude      float64   // degrees
	Altitude       float64   // meters
	Azimuth        float64   // degrees 0-360 (min azimuth)
	Elevation      float64   // degrees -90 to 90 (min elevation)
	MaxRange       float64   // km
	ScanRate       float64   // scans per minute
	NetworkID      uint16    // 16 bits: Link 16 network ID
	ParticipantNum uint16    // 16 bits: participant number on network
	Status         uint8     // 8 bits: 1=ACTIVE, 2=STANDBY, 3=OFFLINE
	Timestamp      time.Time // registration time
}

// J6PayloadSize is the packed byte size of a J6 Sensor Registration message.
const J6PayloadSize = 42

// PackJ6SensorRegistration packs a J6 Sensor Registration message.
func PackJ6SensorRegistration(s *J6SensorRegistration, buf []byte) {
	off := 0

	// Sensor ID: first 8 bytes of name, padded with zeros
	for i := 0; i < 8; i++ {
		if i < len(s.SensorID) {
			buf[off] = s.SensorID[i]
		} else {
			buf[off] = 0
		}
		off++
	}

	buf[off] = s.SensorType
	off++
	buf[off] = s.PlatformType
	off++
	buf[off] = s.Capability
	off++

	latP := PackLatitude(s.Latitude)
	lonP := PackLongitude(s.Longitude)
	PackUint32(latP, buf, off)
	off += 3
	PackUint32(lonP, buf, off)
	off += 3

	altP := uint32(s.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	azP := uint16(s.Azimuth / 0.0057)
	PackUint16(azP, buf, off)
	off += 2

	elP := int16(s.Elevation / 0.0057)
	PackInt16(elP, buf, off)
	off += 2

	rangeP := uint16(s.MaxRange)
	PackUint16(rangeP, buf, off)
	off += 2

	scanP := uint16(s.ScanRate * 10)
	PackUint16(scanP, buf, off)
	off += 2

	PackUint16(s.NetworkID, buf, off)
	off += 2
	PackUint16(s.ParticipantNum, buf, off)
	off += 2

	buf[off] = s.Status
	off++

	ms := PackMilliseconds(s.Timestamp)
	PackUint32(ms, buf, off)
}

// UnpackJ6SensorRegistration unpacks a J6 Sensor Registration message.
func UnpackJ6SensorRegistration(buf []byte) *J6SensorRegistration {
	if len(buf) < J6PayloadSize {
		return nil
	}
	s := &J6SensorRegistration{}
	off := 0

	name := make([]byte, 0, 8)
	for i := 0; i < 8; i++ {
		if buf[off] != 0 {
			name = append(name, buf[off])
		}
		off++
	}
	s.SensorID = string(name)

	s.SensorType = buf[off]
	off++
	s.PlatformType = buf[off]
	off++
	s.Capability = buf[off]
	off++

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	s.Latitude = UnpackLatitude(latP)
	s.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	s.Altitude = float64(altP)

	azP := UnpackUint16(buf, off)
	off += 2
	s.Azimuth = float64(azP) * 0.0057

	elP := UnpackInt16(buf, off)
	off += 2
	s.Elevation = float64(elP) * 0.0057

	rangeP := UnpackUint16(buf, off)
	off += 2
	s.MaxRange = float64(rangeP)

	scanP := UnpackUint16(buf, off)
	off += 2
	s.ScanRate = float64(scanP) / 10.0

	s.NetworkID = UnpackUint16(buf, off)
	off += 2
	s.ParticipantNum = UnpackUint16(buf, off)
	off += 2

	s.Status = buf[off]
	off++

	ms := UnpackUint32(buf, off)
	s.Timestamp = UnpackMilliseconds(ms)

	return s
}

// PackInt16 packs a signed 16-bit integer into buf at byte offset bo (big-endian).
func PackInt16(value int16, buf []byte, bo int) {
	PackUint16(uint16(value), buf, bo)
}

// UnpackInt16 unpacks a signed 16-bit integer from buf at byte offset bo.
func UnpackInt16(buf []byte, bo int) int16 {
	return int16(UnpackUint16(buf, bo))
}
