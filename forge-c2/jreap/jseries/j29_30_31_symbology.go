package jseries

import (
	"time"
)

// J29 subtypes
const (
	J29SubtypeSymbolData    uint8 = 0 // Symbol data
	J29SubtypeSymbolPattern uint8 = 1 // Symbol pattern
	J29SubtypeLabel         uint8 = 2 // Label/sublabel text
)

// J29Symbology represents a J29 Symbology message (MIL-STD-6016).
// Used to disseminate tactical symbology — symbols, patterns, labels for display.
type J29Symbology struct {
	TrackNumber   uint16  // 16 bits: associated track (0 if standalone)
	Subtype       uint8   // 8 bits: symbology subtype
	SymbolCode    uint16  // 16 bits: MIL-STD-2525 symbol code
	PatternType   uint8   // 8 bits: 1=POINT, 2=LINE, 3=AREA
	FrameColor    uint8   // 8 bits: RGB frame color (bits 7-6=blue, 5-3=green, 2-0=red)
	FillColor     uint8   // 8 bits: RGB fill color
	LineStyle     uint8   // 8 bits: 1=SOLID, 2=DASH, 3=DOT
	LineThickness uint8   // 8 bits: 0.1mm increments
	AltitudeType  uint8   // 8 bits: 0=MSL, 1=AGL, 2=FL
	Latitude      float64 // degrees: symbol center latitude
	Longitude     float64 // degrees: symbol center longitude
	Altitude      float64 // meters: altitude
	Label         string  // up to 32 bytes: label text (null-padded)
	Time          time.Time
}

// J29PayloadSize is the packed byte size of a J29 Symbology message.
const J29PayloadSize = 58

// PackJ29Symbology packs a J29 Symbology message into buf.
func PackJ29Symbology(j29 *J29Symbology, buf []byte) {
	off := 0

	PackUint16(j29.TrackNumber, buf, off)
	off += 2
	buf[off] = j29.Subtype
	off++
	PackUint16(j29.SymbolCode, buf, off)
	off += 2
	buf[off] = j29.PatternType
	off++
	buf[off] = j29.FrameColor
	off++
	buf[off] = j29.FillColor
	off++
	buf[off] = j29.LineStyle
	off++
	buf[off] = j29.LineThickness
	off++
	buf[off] = j29.AltitudeType
	off++

	latP := PackLatitudePacked(j29.Latitude)
	lonP := PackLongitudePacked(j29.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := int32(j29.Altitude)
	PackInt24(altP, buf, off)
	off += 3

	// Label: 32 bytes, null-padded
	for i := 0; i < 32; i++ {
		if i < len(j29.Label) {
			buf[off+i] = j29.Label[i]
		} else {
			buf[off+i] = 0
		}
	}
	off += 32

	ms := PackMilliseconds(j29.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ29Symbology unpacks a J29 Symbology message from buf.
func UnpackJ29Symbology(buf []byte) *J29Symbology {
	if len(buf) < J29PayloadSize {
		return nil
	}
	j29 := &J29Symbology{}
	off := 0

	j29.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j29.Subtype = buf[off]
	off++
	j29.SymbolCode = UnpackUint16(buf, off)
	off += 2
	j29.PatternType = buf[off]
	off++
	j29.FrameColor = buf[off]
	off++
	j29.FillColor = buf[off]
	off++
	j29.LineStyle = buf[off]
	off++
	j29.LineThickness = buf[off]
	off++
	j29.AltitudeType = buf[off]
	off++

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j29.Latitude = UnpackLatitudePacked(latP)
	j29.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackInt24(buf, off)
	off += 3
	j29.Altitude = float64(altP)

	lbl := make([]byte, 0, 32)
	for i := 0; i < 32; i++ {
		if buf[off+i] != 0 {
			lbl = append(lbl, buf[off+i])
		}
	}
	j29.Label = string(lbl)
	off += 32

	ms := UnpackUint32(buf, off)
	j29.Time = UnpackMilliseconds(ms)

	return j29
}

// J30 subtypes
const (
	J30SubtypeIFFResponse uint8 = 0 // IFF response (Mode 5/S)
	J30SubtypeIFFInterrog uint8 = 1 // IFF interrogation
	J30SubtypeSIFF        uint8 = 2 // Simplified IFF
)

// J30IFF represents a J30 IFF (Identification Friend or Foe) message.
// Used to disseminate IFF responses, interrogations, and Mode 5/S data.
type J30IFF struct {
	TrackNumber  uint16  // 16 bits: associated track
	Subtype      uint8   // 8 bits: IFF subtype
	IFFCode      uint32  // 32 bits: IFF code (Mode 5/S code)
	FriendlyCode uint8   // 8 bits: 1=FRIEND, 2=HOSTILE, 3=NEUTRAL, 4=UNKNOWN
	Mode5Level   uint8   // 8 bits: Mode 5 classification level
	SatelliteID  uint16  // 16 bits: satellite platform ID (for space IFF)
	Latitude     float64 // degrees
	Longitude    float64 // degrees
	Altitude     float64 // meters
	ResponseTime float64 // seconds: IFF response time
	Confidence   float64 // 0-1: IFF confidence
	Time         time.Time
}

// J30PayloadSize is the packed byte size of a J30 IFF message.
const J30PayloadSize = 31

// PackJ30IFF packs a J30 IFF message into buf.
func PackJ30IFF(j30 *J30IFF, buf []byte) {
	off := 0

	PackUint16(j30.TrackNumber, buf, off)
	off += 2
	buf[off] = j30.Subtype
	off++

	// IFF code: 40 bits total packed into 5 bytes (32-bit code + 8-bit spare)
	PackUint40(uint64(j30.IFFCode), buf, off)
	off += 5

	buf[off] = j30.FriendlyCode
	off++
	buf[off] = j30.Mode5Level
	off++

	PackUint16(j30.SatelliteID, buf, off)
	off += 2

	latP := PackLatitude(j30.Latitude)
	lonP := PackLongitude(j30.Longitude)
	PackUint24(latP, buf, off)
	off += 3
	PackUint24(lonP, buf, off)
	off += 3

	altP := uint32(j30.Altitude)
	PackUint24(altP, buf, off)
	off += 3

	// Response time: 16 bits, 0.001s resolution, offset -32.768s
	rtP := int16((j30.ResponseTime + 32.768) * 1000)
	PackInt16(rtP, buf, off)
	off += 2

	// Confidence: 8 bits, 0-255
	buf[off] = uint8(j30.Confidence * 100)
	off++

	ms := PackMilliseconds(j30.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ30IFF unpacks a J30 IFF message from buf.
func UnpackJ30IFF(buf []byte) *J30IFF {
	if len(buf) < J30PayloadSize {
		return nil
	}
	j30 := &J30IFF{}
	off := 0

	j30.TrackNumber = UnpackUint16(buf, off)
	off += 2
	j30.Subtype = buf[off]
	off++

	j30.IFFCode = uint32(UnpackUint40(buf, off))
	off += 5

	j30.FriendlyCode = buf[off]
	off++
	j30.Mode5Level = buf[off]
	off++

	j30.SatelliteID = UnpackUint16(buf, off)
	off += 2

	latP := UnpackUint24(buf, off)
	off += 3
	lonP := UnpackUint24(buf, off)
	off += 3
	j30.Latitude = UnpackLatitude(latP)
	j30.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off)
	off += 3
	j30.Altitude = float64(altP)

	rtP := UnpackInt16(buf, off)
	off += 2
	j30.ResponseTime = float64(rtP)/1000.0 - 32.768

	j30.Confidence = float64(buf[off]) / 100.0
	off++

	ms := UnpackUint32(buf, off)
	j30.Time = UnpackMilliseconds(ms)

	return j30
}

// J31 subtypes
const (
	J31SubtypeFileData     uint8 = 0 // File data chunk
	J31SubtypeFileHeader   uint8 = 1 // File transfer header
	J31SubtypeFileComplete uint8 = 2 // File transfer complete
	J31SubtypeFileCancel   uint8 = 3 // Cancel file transfer
)

// J31FileTransfer represents a J31 File Transfer message.
// Used to transfer files over Link 16 — chunked data transfer with flow control.
type J31FileTransfer struct {
	TransferID  uint16 // 16 bits: transfer session ID
	Subtype     uint8  // 8 bits: J31 subtype
	ChunkIndex  uint16 // 16 bits: chunk sequence number
	ChunkSize   uint16 // 16 bits: data size in this chunk
	TotalChunks uint16 // 16 bits: total expected chunks
	FileSize    uint32 // 32 bits: total file size in bytes
	Checksum    uint32 // 32 bits: CRC-32 of entire file
	Filename    string // up to 24 bytes: filename (null-padded)
	Data        []byte // variable: chunk data (up to 256 bytes)
	Time        time.Time
}

// J31HeaderSize is the fixed header size of a J31 message.
const J31HeaderSize = 15

// PackJ31FileTransfer packs a J31 message header into buf.
// Data must be appended separately.
func PackJ31FileTransfer(j31 *J31FileTransfer, buf []byte) {
	off := 0

	PackUint16(j31.TransferID, buf, off)
	off += 2
	buf[off] = j31.Subtype
	off++

	PackUint16(j31.ChunkIndex, buf, off)
	off += 2
	PackUint16(j31.ChunkSize, buf, off)
	off += 2
	PackUint16(j31.TotalChunks, buf, off)
	off += 2

	PackUint32(j31.FileSize, buf, off)
	off += 4
	PackUint32(j31.Checksum, buf, off)
	off += 4

	// Filename: 24 bytes, null-padded
	for i := 0; i < 24; i++ {
		if i < len(j31.Filename) {
			buf[off+i] = j31.Filename[i]
		} else {
			buf[off+i] = 0
		}
	}
	off += 24

	ms := PackMilliseconds(j31.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ31FileTransfer unpacks a J31 message header from buf.
func UnpackJ31FileTransfer(buf []byte) *J31FileTransfer {
	if len(buf) < J31HeaderSize {
		return nil
	}
	j31 := &J31FileTransfer{}
	off := 0

	j31.TransferID = UnpackUint16(buf, off)
	off += 2
	j31.Subtype = buf[off]
	off++

	j31.ChunkIndex = UnpackUint16(buf, off)
	off += 2
	j31.ChunkSize = UnpackUint16(buf, off)
	off += 2
	j31.TotalChunks = UnpackUint16(buf, off)
	off += 2

	j31.FileSize = UnpackUint32(buf, off)
	off += 4
	j31.Checksum = UnpackUint32(buf, off)
	off += 4

	name := make([]byte, 0, 24)
	for i := 0; i < 24; i++ {
		if buf[off+i] != 0 {
			name = append(name, buf[off+i])
		}
	}
	j31.Filename = string(name)
	off += 24

	ms := UnpackUint32(buf, off)
	j31.Time = UnpackMilliseconds(ms)

	if len(buf) > J31HeaderSize {
		j31.Data = buf[J31HeaderSize:]
	}

	return j31
}
