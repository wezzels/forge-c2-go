package jseries

import (
	"time"
)

// J14 subtypes
const (
	J14SubtypeAir        uint8 = 0 // Air track processing specification
	J14SubtypeGround     uint8 = 1 // Ground track processing specification
	J14SubtypeSea        uint8 = 2 // Sea track processing specification
	J14SubtypeSubsurface uint8 = 3 // Subsurface track processing specification
)

// J14ProcessSpec represents a J14 Process Specification message.
// Used to disseminate processing rules for specific track types —air, ground, sea, subsurface.
type J14ProcessSpec struct {
	TrackNumber       uint16  // 16 bits: associated track (0 for default spec)
	Subtype           uint8   // 8 bits: domain subtype
	ProcessMode       uint8   // 8 bits: 1=AUTO, 2=SEMI, 3=MANUAL
	QualityMin        uint8   // 8 bits: minimum quality threshold 0-100
	UpdateRate        float64 // seconds: required update rate
	CorrelationWindow float64 // seconds: correlation window size
	FilterGain        float64 // 0-1: Kalman filter gain
	MaxAge            float64 // seconds: max track age before drop
	Latitude          float64 // degrees: spec origin latitude
	Longitude         float64 // degrees: spec origin longitude
	Time              time.Time
}

// J14PayloadSize is the packed byte size of a J14 Process Specification message.
const J14PayloadSize = 30

// PackJ14ProcessSpec packs a J14 message into buf.
func PackJ14ProcessSpec(j14 *J14ProcessSpec, buf []byte) {
	off := 0

	PackUint16(j14.TrackNumber, buf, off)
	off += 2
	buf[off] = j14.Subtype
	off++
	buf[off] = j14.ProcessMode
	off++
	buf[off] = j14.QualityMin
	off++

	updP := uint16(j14.UpdateRate * 10)
	PackUint16(updP, buf, off)
	off += 2

	cwP := uint16(j14.CorrelationWindow * 10)
	PackUint16(cwP, buf, off)
	off += 2

	gainP := uint16(j14.FilterGain * 100)
	PackUint16(gainP, buf, off)
	off += 2

	maxP := uint16(j14.MaxAge)
	PackUint16(maxP, buf, off)
	off += 2

	latP := PackLatitude(j14.Latitude)
	lonP := PackLongitude(j14.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	ms := PackMilliseconds(j14.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ14ProcessSpec unpacks a J14 message from buf.
func UnpackJ14ProcessSpec(buf []byte) *J14ProcessSpec {
	if len(buf) < J14PayloadSize {
		return nil
	}
	j14 := &J14ProcessSpec{}
	off := 0

	j14.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j14.Subtype = buf[off]
	off++
	j14.ProcessMode = buf[off]
	off++
	j14.QualityMin = buf[off]
	off++

	updP := UnpackUint16(buf, off)
	off += 2
	j14.UpdateRate = float64(updP) / 10.0

	cwP := UnpackUint16(buf, off)
	off += 2
	j14.CorrelationWindow = float64(cwP) / 10.0

	gainP := UnpackUint16(buf, off)
	off += 2
	j14.FilterGain = float64(gainP) / 100.0

	maxP := UnpackUint16(buf, off)
	off += 2
	j14.MaxAge = float64(maxP)

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j14.Latitude = UnpackLatitude(latP)
	j14.Longitude = UnpackLongitude(lonP)

	ms := UnpackUint32(buf, off)
	j14.Time = UnpackMilliseconds(ms)

	return j14
}

// J15 subtypes
const (
	J15SubtypeCommand    uint8 = 0 // General command
	J15SubtypeControl    uint8 = 1 // Control directive
	J15SubtypeModeChange uint8 = 2 // Operating mode change
)

// J15Command represents a J15 Command message.
// Used to issue commands, control directives, and mode changes to network participants.
type J15Command struct {
	CommandID   uint16  // 16 bits: command ID
	Subtype     uint8   // 8 bits: command subtype
	CommandCode uint8   // 8 bits: specific command code
	TargetID    uint16  // 16 bits: target participant/track
	Priority    uint8   // 8 bits: 1=HIGH, 2=ROUTINE, 3=FLASH
	Latitude    float64 // degrees: command origin latitude
	Longitude   float64 // degrees: command origin longitude
	Altitude    float64 // meters: command origin altitude
	Time        time.Time
	CommandData []byte // variable: command-specific data
}

// J15PayloadSize is the fixed header size of a J15 Command message.
const J15PayloadSize = 22

// PackJ15Command packs a J15 header into buf.
// CommandData must be appended separately if present.
func PackJ15Command(j15 *J15Command, buf []byte) {
	off := 0

	PackUint16(j15.CommandID, buf, off)
	off += 2
	buf[off] = j15.Subtype
	off++
	buf[off] = j15.CommandCode
	off++
	PackUint16(j15.TargetID, buf, off)
	off += 2
	buf[off] = j15.Priority
	off++

	latP := PackLatitude(j15.Latitude)
	lonP := PackLongitude(j15.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := uint32(j15.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	ms := PackMilliseconds(j15.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ15Command unpacks a J15 header from buf.
func UnpackJ15Command(buf []byte) *J15Command {
	if len(buf) < J15PayloadSize {
		return nil
	}
	j15 := &J15Command{}
	off := 0

	j15.CommandID = UnpackUint16(buf, off)
	off += 2
	j15.Subtype = buf[off]
	off++
	j15.CommandCode = buf[off]
	off++
	j15.TargetID = UnpackUint16(buf, off)
	off += 2
	j15.Priority = buf[off]
	off++

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j15.Latitude = UnpackLatitude(latP)
	j15.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	j15.Altitude = float64(altP)

	ms := UnpackUint32(buf, off)
	j15.Time = UnpackMilliseconds(ms)

	if len(buf) > J15PayloadSize {
		j15.CommandData = buf[J15PayloadSize:]
	}

	return j15
}

// J16 subtypes
const (
	J16SubtypeGeneral      uint8 = 0 // General acknowledge
	J16SubtypeReceipt      uint8 = 1 // Message receipt acknowledge
	J16SubtypeCompletion   uint8 = 2 // Command completion acknowledge
	J16SubtypeCancellation uint8 = 3 // Cancel acknowledgment
)

// J16Acknowledge represents a J16 Acknowledge message.
// Used to acknowledge receipt, completion, or cancellation of commands and messages.
type J16Acknowledge struct {
	AckID             uint16 // 16 bits: acknowledge ID (matches command/message ID)
	Subtype           uint8  // 8 bits: ack subtype
	AckStatus         uint8  // 8 bits: 1=ACK, 2=NACK, 3=REFUSED
	OriginalID        uint16 // 16 bits: original message/command ID being acknowledged
	ParticipantNumber uint16 // 16 bits: acknowledging participant
	ReasonCode        uint8  // 8 bits: reason code (for NACK/REFUSED)
	Time              time.Time
}

// J16PayloadSize is the packed byte size of a J16 Acknowledge message.
const J16PayloadSize = 13

// PackJ16Acknowledge packs a J16 message into buf.
func PackJ16Acknowledge(j16 *J16Acknowledge, buf []byte) {
	off := 0

	PackUint16(j16.AckID, buf, off)
	off += 2
	buf[off] = j16.Subtype
	off++
	buf[off] = j16.AckStatus
	off++
	PackUint16(j16.OriginalID, buf, off)
	off += 2
	PackUint16(j16.ParticipantNumber, buf, off)
	off += 2
	buf[off] = j16.ReasonCode
	off++

	ms := PackMilliseconds(j16.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ16Acknowledge unpacks a J16 message from buf.
func UnpackJ16Acknowledge(buf []byte) *J16Acknowledge {
	if len(buf) < J16PayloadSize {
		return nil
	}
	j16 := &J16Acknowledge{}
	off := 0

	j16.AckID = UnpackUint16(buf, off)
	off += 2
	j16.Subtype = buf[off]
	off++
	j16.AckStatus = buf[off]
	off++
	j16.OriginalID = UnpackUint16(buf, off)
	off += 2
	j16.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	j16.ReasonCode = buf[off]
	off++

	ms := UnpackUint32(buf, off)
	j16.Time = UnpackMilliseconds(ms)

	return j16
}

// J17 subtypes
const (
	J17SubtypeInitiate uint8 = 0 // Initiate transfer request
	J17SubtypeAccept   uint8 = 1 // Accept transfer
	J17SubtypeReject   uint8 = 2 // Reject transfer
	J17SubtypeCancel   uint8 = 3 // Cancel transfer
)

// J17InitiateTransfer represents a J17 Initiate Transfer message.
// Used to request, accept, reject, or cancel file and data transfers between participants.
type J17InitiateTransfer struct {
	TransferID     uint16 // 16 bits: transfer session ID
	Subtype        uint8  // 8 bits: initiate/accept/reject/cancel
	FileType       uint8  // 8 bits: file type code
	FileSize       uint32 // 32 bits: file size in bytes
	Checksum       uint32 // 32 bits: CRC-32 of file
	ParticipantSrc uint16 // 16 bits: source participant
	ParticipantDst uint16 // 16 bits: destination participant
	Filename       string // up to 24 bytes: filename (null-padded)
	Time           time.Time
}

// J17PayloadSize is the packed byte size of a J17 Initiate Transfer message.
const J17PayloadSize = 23

// PackJ17InitiateTransfer packs a J17 message into buf.
func PackJ17InitiateTransfer(j17 *J17InitiateTransfer, buf []byte) {
	off := 0

	PackUint16(j17.TransferID, buf, off)
	off += 2
	buf[off] = j17.Subtype
	off++
	buf[off] = j17.FileType
	off++

	PackUint32(j17.FileSize, buf, off)
	off += 4
	PackUint32(j17.Checksum, buf, off)
	off += 4

	PackUint16(j17.ParticipantSrc, buf, off)
	off += 2
	PackUint16(j17.ParticipantDst, buf, off)
	off += 2

	// Filename: 24 bytes, null-padded
	for i := 0; i < 24; i++ {
		if i < len(j17.Filename) {
			buf[off+i] = j17.Filename[i]
		} else {
			buf[off+i] = 0
		}
	}
	off += 24

	ms := PackMilliseconds(j17.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ17InitiateTransfer unpacks a J17 message from buf.
func UnpackJ17InitiateTransfer(buf []byte) *J17InitiateTransfer {
	if len(buf) < J17PayloadSize {
		return nil
	}
	j17 := &J17InitiateTransfer{}
	off := 0

	j17.TransferID = UnpackUint16(buf, off)
	off += 2
	j17.Subtype = buf[off]
	off++
	j17.FileType = buf[off]
	off++

	j17.FileSize = UnpackUint32(buf, off)
	off += 4
	j17.Checksum = UnpackUint32(buf, off)
	off += 4

	j17.ParticipantSrc = UnpackUint16(buf, off)
	off += 2
	j17.ParticipantDst = UnpackUint16(buf, off)
	off += 2

	name := make([]byte, 0, 24)
	for i := 0; i < 24; i++ {
		if buf[off+i] != 0 {
			name = append(name, buf[off+i])
		}
	}
	j17.Filename = string(name)
	off += 24

	ms := UnpackUint32(buf, off)
	j17.Time = UnpackMilliseconds(ms)

	return j17
}
