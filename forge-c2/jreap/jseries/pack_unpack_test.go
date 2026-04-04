package jseries

import (
	"bytes"
	"testing"
)

// TestCRC16 tests the CRC-16 implementation.
func TestCRC16(t *testing.T) {
	tests := []struct {
		name string
		data []byte
	}{
		{"empty", []byte{}},
		{"single byte", []byte{0x01}},
		{"hello", []byte("hello")},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := CRC16(tt.data)
			// Just verify it's deterministic and non-zero for non-empty
			if len(tt.data) == 0 {
				if got != 0xFFFF {
					t.Errorf("CRC16(empty) = 0x%04X, want 0xFFFF", got)
				}
			} else {
				if got == 0 {
					t.Errorf("CRC16(%v) = 0, should be non-zero", tt.data)
				}
				// Verify deterministic
				if got != CRC16(tt.data) {
					t.Errorf("CRC16 not deterministic")
				}
			}
		})
	}
}

// TestPackUint16 tests packing a uint16 into bytes.
func TestPackUint16(t *testing.T) {
	tests := []struct {
		name     string
		value    uint16
		expected []byte
		offset   int
	}{
		{
			name:     "zero",
			value:    0,
			expected: []byte{0x00, 0x00},
			offset:   0,
		},
		{
			name:     "max",
			value:    0xFFFF,
			expected: []byte{0xFF, 0xFF},
			offset:   0,
		},
		{
			name:     "mixed",
			value:    0x1234,
			expected: []byte{0x12, 0x34},
			offset:   0,
		},
		{
			name:     "with offset",
			value:    0xABCD,
			expected: []byte{0x00, 0xAB, 0xCD},
			offset:   1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			buf := make([]byte, len(tt.expected))
			PackUint16(tt.value, buf, tt.offset)
			if !bytes.Equal(buf, tt.expected) {
				t.Errorf("PackUint16(0x%04X) = %v, want %v", tt.value, buf, tt.expected)
			}
		})
	}
}

// TestUnpackUint16 tests unpacking a uint16 from bytes.
func TestUnpackUint16(t *testing.T) {
	tests := []struct {
		name     string
		data     []byte
		offset   int
		expected uint16
	}{
		{
			name:     "zero",
			data:     []byte{0x00, 0x00},
			offset:   0,
			expected: 0,
		},
		{
			name:     "max",
			data:     []byte{0xFF, 0xFF},
			offset:   0,
			expected: 0xFFFF,
		},
		{
			name:     "mixed",
			data:     []byte{0x12, 0x34},
			offset:   0,
			expected: 0x1234,
		},
		{
			name:     "with offset",
			data:     []byte{0x00, 0xAB, 0xCD},
			offset:   1,
			expected: 0xABCD,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := UnpackUint16(tt.data, tt.offset)
			if got != tt.expected {
				t.Errorf("UnpackUint16(%v, %d) = 0x%04X, want 0x%04X", tt.data, tt.offset, got, tt.expected)
			}
		})
	}
}

// TestRoundTripUint16 tests round-trip packing and unpacking.
func TestRoundTripUint16(t *testing.T) {
	tests := []uint16{0, 1, 127, 128, 255, 256, 1000, 0x8000, 0xFFFF}

	for _, want := range tests {
		buf := make([]byte, 2)
		PackUint16(want, buf, 0)
		got := UnpackUint16(buf, 0)
		if got != want {
			t.Errorf("RoundTripUint16(%d): packed %v, got back %d", want, buf, got)
		}
	}
}

// TestPackUint32 tests packing a uint32 into bytes.
func TestPackUint32(t *testing.T) {
	tests := []struct {
		name     string
		value    uint32
		expected []byte
		offset   int
	}{
		{
			name:     "zero",
			value:    0,
			expected: []byte{0x00, 0x00, 0x00, 0x00},
			offset:   0,
		},
		{
			name:     "max",
			value:    0xFFFFFFFF,
			expected: []byte{0xFF, 0xFF, 0xFF, 0xFF},
			offset:   0,
		},
		{
			name:     "mixed",
			value:    0x12345678,
			expected: []byte{0x12, 0x34, 0x56, 0x78},
			offset:   0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			buf := make([]byte, len(tt.expected))
			PackUint32(tt.value, buf, tt.offset)
			if !bytes.Equal(buf, tt.expected) {
				t.Errorf("PackUint32(0x%08X) = %v, want %v", tt.value, buf, tt.expected)
			}
		})
	}
}

// TestUnpackUint32 tests unpacking a uint32 from bytes.
func TestUnpackUint32(t *testing.T) {
	tests := []struct {
		name     string
		data     []byte
		offset   int
		expected uint32
	}{
		{
			name:     "zero",
			data:     []byte{0x00, 0x00, 0x00, 0x00},
			offset:   0,
			expected: 0,
		},
		{
			name:     "max",
			data:     []byte{0xFF, 0xFF, 0xFF, 0xFF},
			offset:   0,
			expected: 0xFFFFFFFF,
		},
		{
			name:     "mixed",
			data:     []byte{0x12, 0x34, 0x56, 0x78},
			offset:   0,
			expected: 0x12345678,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := UnpackUint32(tt.data, tt.offset)
			if got != tt.expected {
				t.Errorf("UnpackUint32(%v, %d) = 0x%08X, want 0x%08X", tt.data, tt.offset, got, tt.expected)
			}
		})
	}
}

// TestRoundTripUint32 tests round-trip packing and unpacking.
func TestRoundTripUint32(t *testing.T) {
	tests := []uint32{0, 1, 1000, 0x80000000, 0xFFFFFFFF}

	for _, want := range tests {
		buf := make([]byte, 4)
		PackUint32(want, buf, 0)
		got := UnpackUint32(buf, 0)
		if got != want {
			t.Errorf("RoundTripUint32(%d): packed %v, got back %d", want, buf, got)
		}
	}
}

// TestPackFloat24 tests packing a float64 into 24-bit scaled integer.
func TestPackFloat24(t *testing.T) {
	// Just verify PackFloat24 produces values in valid range and is deterministic
	tests := []struct {
		name   string
		value  float64
		scale  float64
		offset float64
	}{
		{"zero", 0.0, 1e6, 0},
		{"positive", 100.0, 1000.0, 0},
		{"with offset", 45.0, 1.0, -90.0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := PackFloat24(tt.value, tt.scale, tt.offset)
			// Should be in valid 24-bit range
			if got > 0xFFFFFF {
				t.Errorf("PackFloat24 result > 24-bit max: 0x%06X", got)
			}
			// Should be deterministic
			if got != PackFloat24(tt.value, tt.scale, tt.offset) {
				t.Error("PackFloat24 not deterministic")
			}
		})
	}
}

// TestUnpackFloat24 tests unpacking a 24-bit scaled integer to float64.
func TestUnpackFloat24(t *testing.T) {
	tests := []struct {
		name     string
		data     uint32
		scale    float64
		offset   float64
		expected float64
		approx   bool // approximate match
	}{
		{
			name:     "zero",
			data:     0,
			scale:    1e6,
			offset:   0,
			expected: 0,
		},
		{
			name:     "max latitude",
			data:     0xFFFFFF,
			scale:    180.0 / 16777215.0,
			offset:   -90.0,
			expected: 90.0,
			approx:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := UnpackFloat24(tt.data, tt.scale, tt.offset)
			if tt.approx {
				if abs(got-tt.expected) > 0.001 {
					t.Errorf("UnpackFloat24(0x%06X, %f, %f) = %f, want ~%f", tt.data, tt.scale, tt.offset, got, tt.expected)
				}
			} else {
				if got != tt.expected {
					t.Errorf("UnpackFloat24(0x%06X, %f, %f) = %f, want %f", tt.data, tt.scale, tt.offset, got, tt.expected)
				}
			}
		})
	}
}

func abs(x float64) float64 {
	if x < 0 {
		return -x
	}
	return x
}
