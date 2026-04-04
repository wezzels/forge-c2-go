package jseries

import (
	"encoding/binary"
)

// PackUint16 packs a uint16 value into a byte slice at the given offset (big-endian).
func PackUint16(value uint16, buf []byte, offset int) {
	binary.BigEndian.PutUint16(buf[offset:], value)
}

// UnpackUint16 unpacks a uint16 from a byte slice at the given offset (big-endian).
func UnpackUint16(buf []byte, offset int) uint16 {
	return binary.BigEndian.Uint16(buf[offset:])
}

// PackUint32 packs a uint32 value into a byte slice at the given offset (big-endian).
func PackUint32(value uint32, buf []byte, offset int) {
	binary.BigEndian.PutUint32(buf[offset:], value)
}

// UnpackUint32 unpacks a uint32 from a byte slice at the given offset (big-endian).
func UnpackUint32(buf []byte, offset int) uint32 {
	return binary.BigEndian.Uint32(buf[offset:])
}

// PackFloat24 packs a float64 into a 24-bit scaled integer.
func PackFloat24(value, scale, offset float64) uint32 {
	scaled := (value + offset) * scale
	if scaled < 0 {
		return 0
	}
	if scaled >= 0x1000000 {
		return 0xFFFFFF
	}
	return uint32(scaled)
}

// UnpackFloat24 unpacks a 24-bit scaled integer to float64.
func UnpackFloat24(data uint32, scale, offset float64) float64 {
	return (float64(data) * scale) + offset
}

// CRC16 returns the CRC-16 (Ethernet polynomial, 0x8005) of a byte slice.
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

// PackScaledFloat packs a float64 into a fixed-point integer with given scale.
func PackScaledFloat(value float64, scale float64) uint16 {
	scaled := value * scale
	if scaled < 0 {
		return 0
	}
	if scaled >= 0x10000 {
		return 0xFFFF
	}
	return uint16(scaled)
}

// UnpackScaledFloat unpacks a fixed-point integer to float64 with given scale.
func UnpackScaledFloat(data uint16, scale float64) float64 {
	return float64(data) * scale
}
