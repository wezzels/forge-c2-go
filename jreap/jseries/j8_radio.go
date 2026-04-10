package jseries

import (
	"time"
)

// J8 subtypes
const (
	J8SubtypeVoice     uint8 = 0 // Voice communication
	J8SubtypeData      uint8 = 1 // Data message
	J8SubtypeRelay     uint8 = 2 // Relay message
	J8SubtypeBroadcast uint8 = 3 // Network broadcast
)

// J8RadioStatus indicates the state of a radio transmission.
type J8RadioStatus uint8

const (
	J8RadioActive    J8RadioStatus = 0 // Transmitting
	J8RadioStandby   J8RadioStatus = 1 // Standby
	J8RadioReceiving J8RadioStatus = 2 // Receiving
	J8RadioOff       J8RadioStatus = 3 // Off
)

// J8Radio represents a J8 Radio message.
// Used for voice/data communications relay and network participation status.
type J8Radio struct {
	TrackNumber       uint16        // 16 bits: associated track (0 if no track)
	Subtype           uint8         // 8 bits: J8 subtype (voice/data/relay/broadcast)
	RadioStatus       J8RadioStatus // 8 bits: radio state
	ParticipantNumber uint16        // 16 bits: sender participant number
	NetworkID         uint16        // 16 bits: Link 16 network ID
	Frequency         float64       // Hz (transmit frequency)
	Modulation        uint8         // 8 bits: modulation type code
	Bandwidth         float64       // Hz
	SignalStrength    float64       // dBm (received signal strength)
	SNR               float64       // dB
	Latitude          float64       // degrees (sender position)
	Longitude         float64       // degrees
	Altitude          float64       // meters
	MessageLength     uint16        // 16 bits: length of message text in bytes
	MessageText       string        // up to 128 bytes of message content
	Timestamp         time.Time
}

// J8PayloadSizeWithoutMessage is the fixed header size (without message text).
const J8PayloadSizeWithoutMessage = 33

// MaxMessageText is the maximum length of the message text field.
const MaxMessageText = 128

// J8PayloadSize returns the total packed size for a J8 message with a given text length.
func J8PayloadSize(textLen int) int {
	if textLen > MaxMessageText {
		textLen = MaxMessageText
	}
	return J8PayloadSizeWithoutMessage + textLen
}

// PackJ8Radio packs a J8 Radio message into buf.
func PackJ8Radio(j8 *J8Radio, buf []byte) {
	off := 0

	PackUint16(j8.TrackNumber, buf, off)
	off += 2
	buf[off] = j8.Subtype
	off++
	buf[off] = uint8(j8.RadioStatus)
	off++

	PackUint16(j8.ParticipantNumber, buf, off)
	off += 2
	PackUint16(j8.NetworkID, buf, off)
	off += 2

	freqP := uint32(j8.Frequency / 10)
	PackUint24(freqP, buf, off)
	off += 3

	buf[off] = j8.Modulation
	off++

	bwP := uint16(j8.Bandwidth / 1000)
	PackUint16(bwP, buf, off)
	off += 2

	ssP := int16(j8.SignalStrength * 10)
	PackInt16(ssP, buf, off)
	off += 2

	snrP := uint16(j8.SNR * 10)
	PackUint16(snrP, buf, off)
	off += 2

	latP := PackLatitude(j8.Latitude)
	lonP := PackLongitude(j8.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := uint32(j8.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	// Message length + text (up to MaxMessageText)
	textLen := len(j8.MessageText)
	if textLen > MaxMessageText {
		textLen = MaxMessageText
	}
	PackUint16(uint16(textLen), buf, off)
	off += 2
	for i := 0; i < textLen; i++ {
		buf[off+i] = j8.MessageText[i]
	}
	off += textLen

	ms := PackMilliseconds(j8.Timestamp)
	PackUint32(ms, buf, off)
}

// UnpackJ8Radio unpacks a J8 Radio message from buf.
func UnpackJ8Radio(buf []byte) *J8Radio {
	if len(buf) < J8PayloadSizeWithoutMessage {
		return nil
	}
	j8 := &J8Radio{}
	off := 0

	j8.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j8.Subtype = buf[off]
	off++
	j8.RadioStatus = J8RadioStatus(buf[off])
	off++

	j8.ParticipantNumber = UnpackUint16(buf, off)
	off += 2
	j8.NetworkID = UnpackUint16(buf, off)
	off += 2

	freqP := UnpackUint24(buf, off)
	off += 3
	j8.Frequency = float64(freqP) * 10

	j8.Modulation = buf[off]
	off++

	bwP := UnpackUint16(buf, off)
	off += 2
	j8.Bandwidth = float64(bwP) * 1000

	ssP := UnpackInt16(buf, off)
	off += 2
	j8.SignalStrength = float64(ssP) / 10

	snrP := UnpackUint16(buf, off)
	off += 2
	j8.SNR = float64(snrP) / 10

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j8.Latitude = UnpackLatitude(latP)
	j8.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	j8.Altitude = float64(altP)

	msgLen := UnpackUint16(buf, off)
	off += 2
	if int(msgLen) > MaxMessageText {
		msgLen = MaxMessageText
	}
	if len(buf) >= off+int(msgLen) {
		j8.MessageLength = msgLen
		j8.MessageText = string(buf[off : off+int(msgLen)])
		off += int(msgLen)
	} else {
		j8.MessageLength = 0
		j8.MessageText = ""
	}

	if len(buf) >= off+4 {
		ms := UnpackUint32(buf, off)
		j8.Timestamp = UnpackMilliseconds(ms)
	}

	return j8
}

// StatusString implements fmt.Stringer for J8RadioStatus.
func (s J8RadioStatus) String() string {
	switch s {
	case J8RadioActive:
		return "ACTIVE"
	case J8RadioStandby:
		return "STANDBY"
	case J8RadioReceiving:
		return "RECEIVING"
	case J8RadioOff:
		return "OFF"
	default:
		return "UNKNOWN"
	}
}
