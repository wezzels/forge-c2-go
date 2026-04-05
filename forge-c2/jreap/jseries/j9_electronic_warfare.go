package jseries

import (
	"time"
)

// J9 subtypes
const (
	J9SubtypeElectronicAttack    uint8 = 0 // Electronic attack (jamming)
	J9SubtypeElectronicSupport  uint8 = 1 // Electronic support (ESM)
	J9SubtypeElectronicProtection uint8 = 2 // Electronic protection
	J9SubtypeEmitterData         uint8 = 3 // Emitter data report
)

// J9 EAStatus indicates the state of an electronic attack.
type J9EAStatus uint8

const (
	J9EAActive   J9EAStatus = 0 // EA active
	J9EAStandby J9EAStatus = 1 // EA on standby
	J9EAOff     J9EAStatus = 2 // EA off
)

// J9ElectronicAttack represents a J9 Electronic Warfare message.
// Used to disseminate electronic attack status, emitter data, and EW sensor reports.
type J9ElectronicAttack struct {
	TrackNumber      uint16       // 16 bits: associated track
	Subtype         uint8        // 8 bits: J9 subtype
	EAStatus        J9EAStatus   // 8 bits: EA status
	EmitterType     uint16       // 16 bits: emitter classification code
	Frequency       float64      // Hz (center frequency)
	Bandwidth       float64      // Hz
	PulseWidth      float64      // microseconds
	PRF             float64      // Hz (pulse repetition frequency)
	PulseCount      uint16       // number of pulses detected
	SignalStrength  float64      // dBm
	Latitude        float64      // degrees
	Longitude       float64      // degrees
	Altitude        float64      // meters
	Azimuth         float64      // degrees 0-360
	Elevation       float64      // degrees -90 to 90
	TargetTrack     uint16       // 16 bits: targeted track number (0 if none)
	JammerType      uint8        // 8 bits: jamming technique code
	Effectiveness   uint8        // 8 bits: jamming effectiveness 0-100
	Timestamp       time.Time
}

// J9PayloadSize is the packed byte size of a J9 Electronic Attack message.
const J9PayloadSize = 52

// PackJ9ElectronicAttack packs a J9 Electronic Attack message into buf.
func PackJ9ElectronicAttack(j9 *J9ElectronicAttack, buf []byte) {
	off := 0

	PackUint16(j9.TrackNumber, buf, off); off += 2
	buf[off] = j9.Subtype; off++
	buf[off] = uint8(j9.EAStatus); off++

	PackUint16(j9.EmitterType, buf, off); off += 2

	freqP := uint32(j9.Frequency / 10)
	PackUint24(freqP, buf, off); off += 3

	bwP := uint16(j9.Bandwidth / 1000)
	PackUint16(bwP, buf, off); off += 2

	pwP := uint16(j9.PulseWidth)
	PackUint16(pwP, buf, off); off += 2

	prfP := uint16(j9.PRF / 10)
	PackUint16(prfP, buf, off); off += 2

	PackUint16(j9.PulseCount, buf, off); off += 2

	ssP := int16(j9.SignalStrength * 10)
	PackInt16(ssP, buf, off); off += 2

	latP := PackLatitude(j9.Latitude)
	lonP := PackLongitude(j9.Longitude)
	PackUint24(latP, buf, off); off += 3
	PackUint24(lonP, buf, off); off += 3

	altP := uint32(j9.Altitude)
	PackUint24(altP, buf, off); off += 3

	azP := uint16(j9.Azimuth / 0.0057)
	PackUint16(azP, buf, off); off += 2

	elP := int16(j9.Elevation / 0.0057)
	PackInt16(elP, buf, off); off += 2

	PackUint16(j9.TargetTrack, buf, off); off += 2
	buf[off] = j9.JammerType; off++
	buf[off] = j9.Effectiveness; off++

	ms := PackMilliseconds(j9.Timestamp)
	PackUint32(ms, buf, off)
}

// UnpackJ9ElectronicAttack unpacks a J9 Electronic Attack message from buf.
func UnpackJ9ElectronicAttack(buf []byte) *J9ElectronicAttack {
	if len(buf) < J9PayloadSize {
		return nil
	}
	j9 := &J9ElectronicAttack{}
	off := 0

	j9.TrackNumber = UnpackUint16(buf, off); off += 2
	j9.Subtype = buf[off]; off++
	j9.EAStatus = J9EAStatus(buf[off]); off++

	j9.EmitterType = UnpackUint16(buf, off); off += 2

	freqP := UnpackUint24(buf, off); off += 3
	j9.Frequency = float64(freqP) * 10

	bwP := UnpackUint16(buf, off); off += 2
	j9.Bandwidth = float64(bwP) * 1000

	pwP := UnpackUint16(buf, off); off += 2
	j9.PulseWidth = float64(pwP)

	prfP := UnpackUint16(buf, off); off += 2
	j9.PRF = float64(prfP) * 10

	j9.PulseCount = UnpackUint16(buf, off); off += 2

	ssP := UnpackInt16(buf, off); off += 2
	j9.SignalStrength = float64(ssP) / 10

	latP := UnpackUint24(buf, off); off += 3
	lonP := UnpackUint24(buf, off); off += 3
	j9.Latitude = UnpackLatitude(latP)
	j9.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off); off += 3
	j9.Altitude = float64(altP)

	azP := UnpackUint16(buf, off); off += 2
	j9.Azimuth = float64(azP) * 0.0057

	elP := UnpackInt16(buf, off); off += 2
	j9.Elevation = float64(elP) * 0.0057

	j9.TargetTrack = UnpackUint16(buf, off); off += 2
	j9.JammerType = buf[off]; off++
	j9.Effectiveness = buf[off]; off++

	ms := UnpackUint32(buf, off)
	j9.Timestamp = UnpackMilliseconds(ms)

	return j9
}

// String implements fmt.Stringer for J9EAStatus.
func (s J9EAStatus) String() string {
	switch s {
	case J9EAActive:
		return "ACTIVE"
	case J9EAStandby:
		return "STANDBY"
	case J9EAOff:
		return "OFF"
	default:
		return "UNKNOWN"
	}
}
