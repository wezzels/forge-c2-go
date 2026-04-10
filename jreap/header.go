package jreap

import (
	"encoding/binary"
	"errors"
	"fmt"
)

// Protocol constant for JREAP-C
const ProtocolJREAPC = 0x0001

// MaxMessageSize is the maximum JREAP-C message size (65,535 octets minus headers)
const MaxMessageSize = 65507 // 65535 - 8 (JREAP header) - 2 (CRC)

// Errors
var (
	ErrInvalidHeader   = errors.New("invalid JREAP header")
	ErrInvalidFlags    = errors.New("invalid protocol flags")
	ErrInvalidLength   = errors.New("invalid message length")
	ErrBufferTooSmall  = errors.New("buffer too small for message")
	ErrCRCFailed       = errors.New("CRC verification failed")
	ErrMessageTooLarge = errors.New("message exceeds maximum size")
)

// Header represents the JREAP-C fixed header (8 octets)
type Header struct {
	ProtocolFlags uint16 // Octets 0-1: 0x0001 for JREAP-C
	MessageType   uint8  // Octet 2: J-series message type number
	Reserved      uint8  // Octet 3: reserved, set to 0
	Length        uint32 // Octets 4-7: payload length (network byte order)
}

// HeaderSize is the fixed JREAP-C header size in octets
const HeaderSize = 8

// CRCIDX is the index of the first CRC octet relative to the start of the JREAP message
// CRC occupies the last 2 octets of the JREAP message
func CRCIDX(msgLen int) int {
	return HeaderSize + msgLen
}

// TotalSize returns the total message size including header and CRC
func (h *Header) TotalSize() int {
	return HeaderSize + int(h.Length) + 2
}

// Encode writes the JREAP-C header to a byte slice (big-endian / network byte order)
// Requires at least HeaderSize bytes. Returns an error if the buffer is too small.
func (h *Header) Encode(buf []byte) error {
	if len(buf) < HeaderSize {
		return ErrBufferTooSmall
	}

	binary.BigEndian.PutUint16(buf[0:2], h.ProtocolFlags)
	buf[2] = h.MessageType
	buf[3] = h.Reserved
	binary.BigEndian.PutUint32(buf[4:8], h.Length)

	return nil
}

// Decode reads the JREAP-C header from a byte slice.
// Returns an error if the buffer is too small or contains invalid values.
func (h *Header) Decode(buf []byte) error {
	if len(buf) < HeaderSize {
		return ErrInvalidHeader
	}

	h.ProtocolFlags = binary.BigEndian.Uint16(buf[0:2])
	h.MessageType = buf[2]
	h.Reserved = buf[3]
	h.Length = binary.BigEndian.Uint32(buf[4:8])

	if h.ProtocolFlags != ProtocolJREAPC {
		return fmt.Errorf("%w: expected 0x%04X, got 0x%04X", ErrInvalidFlags, ProtocolJREAPC, h.ProtocolFlags)
	}

	if h.Length > MaxMessageSize {
		return fmt.Errorf("%w: %d > %d", ErrInvalidLength, h.Length, MaxMessageSize)
	}

	return nil
}

// EncodeFull encodes a complete JREAP-C message (header + payload + CRC)
// The payload should already be packed J-series data.
// Returns the total message length including header, payload, and CRC.
func EncodeFull(payload []byte, messageType uint8, crc16 func([]byte) uint16) ([]byte, error) {
	payloadLen := len(payload)
	totalSize := HeaderSize + payloadLen + 2

	if totalSize > HeaderSize+MaxMessageSize+2 {
		return nil, ErrMessageTooLarge
	}

	buf := make([]byte, totalSize)

	h := Header{
		ProtocolFlags: ProtocolJREAPC,
		MessageType:   messageType,
		Reserved:      0,
		Length:        uint32(payloadLen),
	}

	if err := h.Encode(buf); err != nil {
		return nil, err
	}

	copy(buf[HeaderSize:HeaderSize+payloadLen], payload)

	// CRC covers header + payload
	crc := crc16(buf[:HeaderSize+payloadLen])
	binary.BigEndian.PutUint16(buf[totalSize-2:], crc)

	return buf, nil
}

// DecodeFull decodes a complete JREAP-C message.
// Verifies the CRC and returns the header, payload, and CRC value.
// The caller can inspect header.MessageType and header.Length.
func DecodeFull(buf []byte) (hdr *Header, payload []byte, crc uint16, err error) {
	if len(buf) < HeaderSize+2 {
		return nil, nil, 0, ErrInvalidHeader
	}

	hdr = &Header{}
	if err := hdr.Decode(buf); err != nil {
		return nil, nil, 0, err
	}

	payloadLen := int(hdr.Length)
	if len(buf) < HeaderSize+payloadLen+2 {
		return nil, nil, 0, ErrBufferTooSmall
	}

	payload = make([]byte, payloadLen)
	copy(payload, buf[HeaderSize:HeaderSize+payloadLen])

	// Extract received CRC
	recvCRC := binary.BigEndian.Uint16(buf[CRCIDX(payloadLen) : CRCIDX(payloadLen)+2])

	// Compute CRC over header + payload
	computedCRC := CRC16(buf[:CRCIDX(payloadLen)])

	if recvCRC != computedCRC {
		return hdr, payload, recvCRC, fmt.Errorf("%w: computed 0x%04X, received 0x%04X", ErrCRCFailed, computedCRC, recvCRC)
	}

	crc = recvCRC
	return hdr, payload, crc, nil
}

// CRC16 returns the CRC-16 (Ethernet polynomial, 0x8005) of a byte slice.
// This matches the CRC defined in MIL-STD-3011 for JREAP.
func CRC16(data []byte) uint16 {
	crc := uint16(0xFFFF)
	for _, b := range data {
		crc ^= uint16(b)
		for i := 0; i < 8; i++ {
			if crc&1 != 0 {
				crc = (crc >> 1) ^ 0xA001 // 0x8005 reflected
			} else {
				crc >>= 1
			}
		}
	}
	return crc
}
