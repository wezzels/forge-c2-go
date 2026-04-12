package dis

import (
	"math"
	"encoding/binary"
)

// DISSignalPDU - Signal PDU (PduType 25)
// Used for radio transmissions and data communications
type DISSignalPDU struct {
	Header DISHeader

	EntityID           EntityID
	EmitterKind       uint8
	EmitterNumber     uint8
	ISSCC             uint16
	ISSRC             uint16
	CCIR              uint16
	Priority          uint8
	PDUStatus         uint8
	Padding1          uint8
	ProtocolMode      uint16
	SampleRateHz      uint32
	SampleCount       uint16
	CompressedData    []byte
}

// SignalPDUSize is the fixed header size
const SignalPDUSize = 44

// PackDISSignalPDU packs the Signal PDU
func PackDISSignalPDU(pdu *DISSignalPDU, buf []byte) int {
	if len(buf) < SignalPDUSize {
		return 0
	}
	off := 0

	// Header (16)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Entity ID (6)
	off += PackEntityID(&pdu.EntityID, buf[off:])

	buf[off] = pdu.EmitterKind
	off++
	buf[off] = pdu.EmitterNumber
	off++

	binary.LittleEndian.PutUint16(buf[off:], pdu.ISSCC)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.ISSRC)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.CCIR)
	off += 2
	buf[off] = pdu.Priority
	off++
	buf[off] = pdu.PDUStatus
	off++
	buf[off] = pdu.Padding1
	off++
	binary.LittleEndian.PutUint16(buf[off:], pdu.ProtocolMode)
	off += 2
	binary.LittleEndian.PutUint32(buf[off:], pdu.SampleRateHz)
	off += 4
	binary.LittleEndian.PutUint16(buf[off:], pdu.SampleCount)
	off += 2

	if len(pdu.CompressedData) > 0 {
		copy(buf[off:], pdu.CompressedData)
		off += len(pdu.CompressedData)
	}
	return off
}

// UnpackDISSignalPDU unpacks a Signal PDU
func UnpackDISSignalPDU(buf []byte) *DISSignalPDU {
	if len(buf) < SignalPDUSize {
		return nil
	}
	p := &DISSignalPDU{}
	off := 0

	p.Header = *UnpackDISHeader(buf[off:])
	off += 16

	var entityID EntityID
	off += UnpackEntityID(buf[off:], &entityID)
	p.EntityID = entityID

	p.EmitterKind = buf[off]
	off++
	p.EmitterNumber = buf[off]
	off++

	p.ISSCC = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.ISSRC = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.CCIR = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.Priority = buf[off]
	off++
	p.PDUStatus = buf[off]
	off++
	p.Padding1 = buf[off]
	off++
	p.ProtocolMode = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.SampleRateHz = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	p.SampleCount = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	remaining := len(buf) - off
	if remaining > 0 {
		p.CompressedData = make([]byte, remaining)
		copy(p.CompressedData, buf[off:])
	}

	return p
}

// DISTransmitterPDU - Transmitter PDU (PduType 26)
// Describes the state of a radio transmitter
type DISTransmitterPDU struct {
	Header DISHeader

	EntityID            EntityID
	RadioID            uint16
	RadioKind          uint8
	PrimaryMode        uint8
	SecondaryMode      uint8
	Padding1           uint8
	AntennaLocation    EntityID
	AntennaPatternType uint8
	Padding2           uint8
	Frequency          uint64
	Bandwidth          uint32
	SpreadSpectrum     uint8
	JQJ                uint8
	KEK                uint8
	ISSRC               uint8
	MajorChannel       uint16
	MinorChannel       uint16
}

// TransmitterPDUSize is the fixed size
const TransmitterPDUSize = 66

// PackDISTransmitterPDU packs the Transmitter PDU
func PackDISTransmitterPDU(pdu *DISTransmitterPDU, buf []byte) int {
	if len(buf) < TransmitterPDUSize {
		return 0
	}
	off := 0

	// Header (16)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Entity ID (6)
	off += PackEntityID(&pdu.EntityID, buf[off:])

	binary.LittleEndian.PutUint16(buf[off:], pdu.RadioID)
	off += 2
	buf[off] = pdu.RadioKind
	off++
	buf[off] = pdu.PrimaryMode
	off++
	buf[off] = pdu.SecondaryMode
	off++
	buf[off] = pdu.Padding1
	off++

	// Antenna Location (6)
	off += PackEntityID(&pdu.AntennaLocation, buf[off:])

	buf[off] = pdu.AntennaPatternType
	off++
	buf[off] = pdu.Padding2
	off++
	binary.LittleEndian.PutUint64(buf[off:], pdu.Frequency)
	off += 8
	binary.LittleEndian.PutUint32(buf[off:], pdu.Bandwidth)
	off += 4
	buf[off] = pdu.SpreadSpectrum
	off++
	buf[off] = pdu.JQJ
	off++
	buf[off] = pdu.KEK
	off++
	buf[off] = pdu.ISSRC
	off++
	binary.LittleEndian.PutUint16(buf[off:], pdu.MajorChannel)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.MinorChannel)
	off += 2

	return off
}

// UnpackDISTransmitterPDU unpacks a Transmitter PDU
func UnpackDISTransmitterPDU(buf []byte) *DISTransmitterPDU {
	if len(buf) < TransmitterPDUSize {
		return nil
	}
	p := &DISTransmitterPDU{}
	off := 0

	p.Header = *UnpackDISHeader(buf[off:])
	off += 16

	var entityID EntityID
	off += UnpackEntityID(buf[off:], &entityID)
	p.EntityID = entityID

	p.RadioID = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.RadioKind = buf[off]
	off++
	p.PrimaryMode = buf[off]
	off++
	p.SecondaryMode = buf[off]
	off++
	p.Padding1 = buf[off]
	off++

	var antennaLoc EntityID
	off += UnpackEntityID(buf[off:], &antennaLoc)
	p.AntennaLocation = antennaLoc

	p.AntennaPatternType = buf[off]
	off++
	p.Padding2 = buf[off]
	off++
	p.Frequency = binary.LittleEndian.Uint64(buf[off:])
	off += 8
	p.Bandwidth = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	p.SpreadSpectrum = buf[off]
	off++
	p.JQJ = buf[off]
	off++
	p.KEK = buf[off]
	off++
	p.ISSRC = buf[off]
	off++
	p.MajorChannel = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.MinorChannel = binary.LittleEndian.Uint16(buf[off:])

	return p
}

// DISReceiverPDU - Receiver PDU (PduType 27)
// Describes the state of a radio receiver
type DISReceiverPDU struct {
	Header DISHeader

	EntityID             EntityID
	RadioID             uint16
	ReceiverState       uint8
	Padding1            uint8
	Padding2            uint8
	Padding3            uint8
	ISSRC                uint8
	TransmitterEntityID EntityID
	TransmitterRadioID  uint16
	TransmitterSignal   int16
}

// ReceiverPDUSize is the fixed size
const ReceiverPDUSize = 36

// PackDISReceiverPDU packs the Receiver PDU
func PackDISReceiverPDU(pdu *DISReceiverPDU, buf []byte) int {
	if len(buf) < ReceiverPDUSize {
		return 0
	}
	off := 0

	// Header (16)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Entity ID (6)
	off += PackEntityID(&pdu.EntityID, buf[off:])

	binary.LittleEndian.PutUint16(buf[off:], pdu.RadioID)
	off += 2
	buf[off] = pdu.ReceiverState
	off++
	buf[off] = pdu.Padding1
	off++
	buf[off] = pdu.Padding2
	off++
	buf[off] = pdu.Padding3
	off++
	buf[off] = pdu.ISSRC
	off++

	// Transmitter Entity ID (6)
	off += PackEntityID(&pdu.TransmitterEntityID, buf[off:])

	binary.LittleEndian.PutUint16(buf[off:], pdu.TransmitterRadioID)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], uint16(pdu.TransmitterSignal))
	off += 2

	return off
}

// UnpackDISReceiverPDU unpacks a Receiver PDU
func UnpackDISReceiverPDU(buf []byte) *DISReceiverPDU {
	if len(buf) < ReceiverPDUSize {
		return nil
	}
	p := &DISReceiverPDU{}
	off := 0

	p.Header = *UnpackDISHeader(buf[off:])
	off += 16

	var entityID EntityID
	off += UnpackEntityID(buf[off:], &entityID)
	p.EntityID = entityID

	p.RadioID = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.ReceiverState = buf[off]
	off++
	p.Padding1 = buf[off]
	off++
	p.Padding2 = buf[off]
	off++
	p.Padding3 = buf[off]
	off++
	p.ISSRC = buf[off]
	off++

	var txEntityID EntityID
	off += UnpackEntityID(buf[off:], &txEntityID)
	p.TransmitterEntityID = txEntityID

	p.TransmitterRadioID = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.TransmitterSignal = int16(binary.LittleEndian.Uint16(buf[off:]))

	return p
}

// DISAudioHeaderPDU - Audio Header PDU (PduType 28)
// Describes audio format for subsequent Audio PDUs
type DISAudioHeaderPDU struct {
	Header DISHeader

	EntityID         EntityID
	RadioID         uint16
	EncodingScheme  uint16
	SampleRateHz    uint32
	SampleBitWidth  uint8
	Channels        uint8
	AudioBlockSize  uint16
	ReferenceSystem uint8
	Padding1        uint8
	AudioDataFormat uint16
	Padding2        uint16
}

// AudioHeaderPDUSize is the fixed size
const AudioHeaderPDUSize = 36

// DISAudioPDU - Audio PDU (PduType 29)
// Contains compressed audio data
type DISAudioPDU struct {
	Header DISHeader

	EntityID       EntityID
	RadioID        uint16
	SequenceNumber uint16
	AudioData      []byte
}

// AudioPDUSize is the fixed header size
const AudioPDUSize = 28

// PackDISCollisionPDU packs a Collision PDU
func PackDISCollisionPDU(pdu *DISCollisionPDU, buf []byte) int {
	if len(buf) < 68 {
		return 0
	}
	off := 0

	// Header (16)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Entity ID (6)
	off += PackEntityID(&pdu.EntityID, buf[off:])

	buf[off] = pdu.CollisionType
	off++

	// Padding (3 bytes)
	buf[off] = 0
	off++
	buf[off] = 0
	off++
	buf[off] = 0
	off++

	// Target Entity ID (6)
	off += PackEntityID(&pdu.TargetEntityID, buf[off:])

	// Location (24)
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(pdu.Location.X))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(pdu.Location.Y))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(pdu.Location.Z))
	off += 8

	// Collision Mass (4)
	binary.LittleEndian.PutUint32(buf[off:], math.Float32bits(pdu.CollisionMass))
	off += 4

	// Collision Velocity (12)
	binary.LittleEndian.PutUint32(buf[off:], math.Float32bits(pdu.CollisionVelocity.X))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], math.Float32bits(pdu.CollisionVelocity.Y))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], math.Float32bits(pdu.CollisionVelocity.Z))
	off += 4

	return off
}

// UnpackDISCollisionPDU unpacks a Collision PDU
func UnpackDISCollisionPDU(buf []byte) *DISCollisionPDU {
	if len(buf) < 68 {
		return nil
	}
	p := &DISCollisionPDU{}
	off := 0

	p.Header = *UnpackDISHeader(buf[off:])
	off += 16

	var entityID EntityID
	off += UnpackEntityID(buf[off:], &entityID)
	p.EntityID = entityID

	p.CollisionType = buf[off]
	off++

	// Skip padding
	off += 3

	var targetID EntityID
	off += UnpackEntityID(buf[off:], &targetID)
	p.TargetEntityID = targetID

	p.Location.X = math.Float64frombits(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	p.Location.Y = math.Float64frombits(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	p.Location.Z = math.Float64frombits(binary.LittleEndian.Uint64(buf[off:]))
	off += 8

	p.CollisionMass = math.Float32frombits(binary.LittleEndian.Uint32(buf[off:]))
	off += 4

	p.CollisionVelocity.X = math.Float32frombits(binary.LittleEndian.Uint32(buf[off:]))
	off += 4
	p.CollisionVelocity.Y = math.Float32frombits(binary.LittleEndian.Uint32(buf[off:]))
	off += 4
	p.CollisionVelocity.Z = math.Float32frombits(binary.LittleEndian.Uint32(buf[off:]))

	return p
}

// PackDISAcknowledgePDU packs an Acknowledge PDU
func PackDISAcknowledgePDU(pdu *DISAcknowledgePDU, buf []byte) int {
	if len(buf) < 36 {
		return 0
	}
	off := 0

	// Header (16)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Originating Entity ID (6)
	off += PackEntityID(&pdu.OriginatingEntityID, buf[off:])

	// Receiving Entity ID (6)
	off += PackEntityID(&pdu.ReceivingEntityID, buf[off:])

	binary.LittleEndian.PutUint16(buf[off:], pdu.AcknowledgeFlag)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.ResponseFlag)
	off += 2

	// Event ID (6)
	binary.LittleEndian.PutUint16(buf[off:], pdu.EventID.SiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.EventID.ApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.EventID.EventNumber)
	off += 2

	return off
}

// UnpackDISAcknowledgePDU unpacks an Acknowledge PDU
func UnpackDISAcknowledgePDU(buf []byte) *DISAcknowledgePDU {
	if len(buf) < 36 {
		return nil
	}
	p := &DISAcknowledgePDU{}
	off := 0

	p.Header = *UnpackDISHeader(buf[off:])
	off += 16

	var origID EntityID
	off += UnpackEntityID(buf[off:], &origID)
	p.OriginatingEntityID = origID

	var recvID EntityID
	off += UnpackEntityID(buf[off:], &recvID)
	p.ReceivingEntityID = recvID

	p.AcknowledgeFlag = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.ResponseFlag = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	p.EventID.SiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.EventID.ApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	p.EventID.EventNumber = binary.LittleEndian.Uint16(buf[off:])

	return p
}
