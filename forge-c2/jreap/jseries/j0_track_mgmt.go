package jseries

import (
	"time"
)

// TrackManagement family

// TrackManagementStatus indicates the state of a track in the track management protocol.
type TrackManagementStatus uint8

const (
	TrackMgmtInitiating   TrackManagementStatus = 0 // Track being initiated
	TrackMgmtConfirmed    TrackManagementStatus = 1 // Track confirmed
	TrackMgmtUncorrelated TrackManagementStatus = 2 // Uncorrelated detection
	TrackMgmtDropping     TrackManagementStatus = 3 // Track being dropped
	TrackMgmtDropped      TrackManagementStatus = 4 // Track dropped
)

// TrackManagementType distinguishes the subtype of J0 message.
type TrackManagementType uint8

const (
	J0TrackData       TrackManagementType = 0 // Track Data
	J0TrackInitiation TrackManagementType = 1 // Track Initiation Request
	J0TrackDrop       TrackManagementType = 2 // Track Drop
	J0TrackGroup      TrackManagementType = 3 // Track Group Management
)

// J0TrackManagement represents a J0 Track Management message (MIL-STD-6016).
// Used for track initiation, confirmation, correlation, and drop — the lifecycle
// messages that bracket a J3 Track Update series.
type J0TrackManagement struct {
	TrackNumber       uint16                // 16 bits: track number
	TrackStatus       TrackManagementStatus // 4 bits: track state
	MgtType           TrackManagementType   // 4 bits: subtype
	ForceType         uint8                 // 4 bits: FRIEND/HOSTILE/NEUTRAL/UNKNOWN
	Classification    uint8                 // 4 bits: classification level
	Time              time.Time             // 32 bits: milliseconds since epoch
	Latitude          float64               // degrees
	Longitude         float64               // degrees
	Altitude          float64               // meters
	Speed             float64               // m/s
	Heading           float64               // degrees 0-360
	Quality           QualityIndicator      // 8 bits: track quality bits
	ParticipantNumber uint16                // 16 bits: network participant
	SensorID          string                // originating sensor ID
	CorrelationID     string                // MDPAF end-to-end tracking ID
}

// J0PayloadSize is the packed byte size of a J0 Track Management message.
const J0PayloadSize = 36

// PackJ0TrackManagement packs a J0 Track Management message into buf.
func PackJ0TrackManagement(j0 *J0TrackManagement, buf []byte) {
	off := 0

	// Track number: 16 bits
	PackUint16(j0.TrackNumber, buf, off)
	off += 2

	// Status nibble (4 bits) + Type nibble (4 bits)
	statusType := (uint8(j0.TrackStatus) & 0x0F) | ((uint8(j0.MgtType) & 0x0F) << 4)
	buf[off] = statusType
	off++

	// Force type (4 bits) + Classification (4 bits)
	forceClass := (j0.ForceType & 0x0F) | ((j0.Classification & 0x0F) << 4)
	buf[off] = forceClass
	off++

	// Timestamp: 32 bits ms
	ms := PackMilliseconds(j0.Time)
	PackUint32(ms, buf, off)
	off += 4

	// Latitude: 24-bit signed NIPO (-90 to 90)
	latP := PackLatitudePacked(j0.Latitude)
	PackUint24(latP, buf, off)
	off += 3

	// Longitude: 24-bit signed NIPO (-180 to 180)
	lonP := PackLongitudePacked(j0.Longitude)
	PackUint24(lonP, buf, off)
	off += 3

	// Altitude: 24 bits meters
	altP := uint32(j0.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	// Speed: 16 bits, 0.1 m/s resolution
	speedP := PackVelocity(j0.Speed)
	PackUint16(speedP, buf, off)
	off += 2

	// Heading: 16 bits, 0.0057 deg resolution
	hdgP := uint16(j0.Heading / 0.0057)
	if hdgP > 0x3FFF {
		hdgP = 0x3FFF
	}
	PackUint16(hdgP, buf, off)
	off += 2

	// Quality: 8 bits
	buf[off] = PackQuality(j0.Quality)
	off++

	// Participant number: 16 bits
	PackUint16(j0.ParticipantNumber, buf, off)
	off += 2

	// Sensor ID: 8 bytes, null-padded
	for i := 0; i < 8; i++ {
		if i < len(j0.SensorID) {
			buf[off+i] = j0.SensorID[i]
		} else {
			buf[off+i] = 0
		}
	}
	off += 8

	// Correlation ID: 16 bytes, null-padded
	for i := 0; i < 16; i++ {
		if i < len(j0.CorrelationID) {
			buf[off+i] = j0.CorrelationID[i]
		} else {
			buf[off+i] = 0
		}
	}
}

// UnpackJ0TrackManagement unpacks a J0 Track Management message from buf.
func UnpackJ0TrackManagement(buf []byte) *J0TrackManagement {
	if len(buf) < J0PayloadSize {
		return nil
	}
	j0 := &J0TrackManagement{}
	off := 0

	j0.TrackNumber = UnpackUint16(buf, off)
	off += 2

	statusType := buf[off]
	off++
	j0.TrackStatus = TrackManagementStatus(statusType & 0x0F)
	j0.MgtType = TrackManagementType((statusType >> 4) & 0x0F)

	forceClass := buf[off]
	off++
	j0.ForceType = forceClass & 0x0F
	j0.Classification = (forceClass >> 4) & 0x0F

	ms := UnpackUint32(buf, off)
	off += 4
	j0.Time = UnpackMilliseconds(ms)

	latP := UnpackUint24(buf, off)
	off += 3
	j0.Latitude = UnpackLatitudePacked(latP)

	lonP := UnpackUint24(buf, off)
	off += 3
	j0.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	j0.Altitude = float64(altP)

	speedP := UnpackUint16(buf, off)
	off += 2
	j0.Speed = UnpackVelocity(speedP)

	hdgP := UnpackUint16(buf, off)
	off += 2
	j0.Heading = float64(hdgP&0x3FFF) * 0.0057

	j0.Quality = UnpackQuality(buf[off])
	off++

	j0.ParticipantNumber = UnpackUint16(buf, off)
	off += 2

	sensorID := make([]byte, 0, 8)
	for i := 0; i < 8; i++ {
		if buf[off+i] != 0 {
			sensorID = append(sensorID, buf[off+i])
		}
	}
	j0.SensorID = string(sensorID)
	off += 8

	corrID := make([]byte, 0, 16)
	for i := 0; i < 16; i++ {
		if buf[off+i] != 0 {
			corrID = append(corrID, buf[off+i])
		}
	}
	j0.CorrelationID = string(corrID)

	return j0
}

// StatusString returns a human-readable track management status.
func (s TrackManagementStatus) String() string {
	switch s {
	case TrackMgmtInitiating:
		return "INITIATING"
	case TrackMgmtConfirmed:
		return "CONFIRMED"
	case TrackMgmtUncorrelated:
		return "UNCORRELATED"
	case TrackMgmtDropping:
		return "DROPPING"
	case TrackMgmtDropped:
		return "DROPPED"
	default:
		return "UNKNOWN"
	}
}
