package jseries

import (
	"time"
)

// J11 subtypes
const (
	J11SubtypeFileTransfer   uint8 = 0 // File transfer
	J11SubtypeDataBaseQuery  uint8 = 1 // Database query/response
	J11SubtypeTacticalData   uint8 = 2 // Tactical data block
	J11SubtypeCoordinateData uint8 = 3 // Coordinate/position data set
)

// J11TransferStatus indicates the state of a data transfer.
type J11TransferStatus uint8

const (
	J11TransferPending  J11TransferStatus = 0 // Transfer pending
	J11TransferActive   J11TransferStatus = 1 // Transfer in progress
	J11TransferComplete J11TransferStatus = 2 // Transfer complete
	J11TransferFailed   J11TransferStatus = 3 // Transfer failed/cancelled
)

// J11DataTransfer represents a J11 Data Transfer message.
// Used to transfer files, database records, tactical data, and coordinate data sets.
type J11DataTransfer struct {
	TransferID     uint16            // 16 bits: transfer session ID
	Subtype        uint8             // 8 bits: J11 subtype
	TransferStatus J11TransferStatus // 8 bits: transfer state
	RecordCount    uint16            // 16 bits: number of records/items
	DataLength     uint32            // 32 bits: total data length in bytes
	Offset         uint32            // 32 bits: byte offset in transfer
	Checksum       uint32            // 32 bits: CRC-32 of data block
	DataType       uint8             // 8 bits: data type code
	Filler         uint8             // 8 bits: spare
	ParticipantSrc uint16            // 16 bits: source participant
	ParticipantDst uint16            // 16 bits: destination participant
	Latitude       float64           // degrees: reference point latitude
	Longitude      float64           // degrees: reference point longitude
	Altitude       float64           // meters: reference point altitude
	Time           time.Time
	// Variable data block follows header
}

// J11PayloadSize is the packed byte size of a J11 header (without data block).
const J11PayloadSize = 32

// PackJ11DataTransfer packs a J11 Data Transfer header into buf.
// The data block must be appended separately.
func PackJ11DataTransfer(j11 *J11DataTransfer, buf []byte) {
	off := 0

	PackUint16(j11.TransferID, buf, off)
	off += 2
	buf[off] = j11.Subtype
	off++
	buf[off] = uint8(j11.TransferStatus)
	off++

	PackUint16(j11.RecordCount, buf, off)
	off += 2

	PackUint32(j11.DataLength, buf, off)
	off += 4
	PackUint32(j11.Offset, buf, off)
	off += 4
	PackUint32(j11.Checksum, buf, off)
	off += 4

	buf[off] = j11.DataType
	off++
	buf[off] = 0
	off++ // filler

	PackUint16(j11.ParticipantSrc, buf, off)
	off += 2
	PackUint16(j11.ParticipantDst, buf, off)
	off += 2

	latP := PackLatitudePacked(j11.Latitude)
	lonP := PackLongitudePacked(j11.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := uint32(j11.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	ms := PackMilliseconds(j11.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ11DataTransfer unpacks a J11 Data Transfer header from buf.
// The data block (if present) follows the header and is not parsed here.
func UnpackJ11DataTransfer(buf []byte) *J11DataTransfer {
	if len(buf) < J11PayloadSize {
		return nil
	}
	j11 := &J11DataTransfer{}
	off := 0

	j11.TransferID = UnpackUint16(buf, off)
	off += 2
	j11.Subtype = buf[off]
	off++
	j11.TransferStatus = J11TransferStatus(buf[off])
	off++

	j11.RecordCount = UnpackUint16(buf, off)
	off += 2

	j11.DataLength = UnpackUint32(buf, off)
	off += 4
	j11.Offset = UnpackUint32(buf, off)
	off += 4
	j11.Checksum = UnpackUint32(buf, off)
	off += 4

	j11.DataType = buf[off]
	off++
	off++ // filler

	j11.ParticipantSrc = UnpackUint16(buf, off)
	off += 2
	j11.ParticipantDst = UnpackUint16(buf, off)
	off += 2

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j11.Latitude = UnpackLatitudePacked(latP)
	j11.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	j11.Altitude = float64(altP)

	ms := UnpackUint32(buf, off)
	j11.Time = UnpackMilliseconds(ms)

	return j11
}

// String implements fmt.Stringer for J11TransferStatus.
func (s J11TransferStatus) String() string {
	switch s {
	case J11TransferPending:
		return "PENDING"
	case J11TransferActive:
		return "ACTIVE"
	case J11TransferComplete:
		return "COMPLETE"
	case J11TransferFailed:
		return "FAILED"
	default:
		return "UNKNOWN"
	}
}
