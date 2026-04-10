package jreap

import (
	"bytes"
	"testing"
)

func TestHeader_EncodeDecode(t *testing.T) {
	tests := []struct {
		name    string
		hdr     Header
		wantBuf []byte
	}{
		{
			name: "J3.0 Track Update",
			hdr: Header{
				ProtocolFlags: ProtocolJREAPC,
				MessageType:   3,
				Reserved:      0,
				Length:        21,
			},
			wantBuf: []byte{0x00, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00, 0x15},
		},
		{
			name: "J4.0 Engagement Order",
			hdr: Header{
				ProtocolFlags: ProtocolJREAPC,
				MessageType:   4,
				Reserved:      0,
				Length:        15,
			},
			wantBuf: []byte{0x00, 0x01, 0x04, 0x00, 0x00, 0x00, 0x00, 0x0F},
		},
		{
			name: "J28 Satellite/OPIR",
			hdr: Header{
				ProtocolFlags: ProtocolJREAPC,
				MessageType:   28,
				Reserved:      0,
				Length:        17,
			},
			wantBuf: []byte{0x00, 0x01, 0x1C, 0x00, 0x00, 0x00, 0x00, 0x11},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			buf := make([]byte, HeaderSize)
			err := tt.hdr.Encode(buf)
			if err != nil {
				t.Fatalf("Encode failed: %v", err)
			}

			if !bytes.Equal(buf, tt.wantBuf) {
				t.Errorf("Encode = %v, want %v", buf, tt.wantBuf)
			}

			// Decode and verify
			decoded := &Header{}
			err = decoded.Decode(buf)
			if err != nil {
				t.Fatalf("Decode failed: %v", err)
			}

			if decoded.ProtocolFlags != tt.hdr.ProtocolFlags {
				t.Errorf("ProtocolFlags = %d, want %d", decoded.ProtocolFlags, tt.hdr.ProtocolFlags)
			}
			if decoded.MessageType != tt.hdr.MessageType {
				t.Errorf("MessageType = %d, want %d", decoded.MessageType, tt.hdr.MessageType)
			}
			if decoded.Length != tt.hdr.Length {
				t.Errorf("Length = %d, want %d", decoded.Length, tt.hdr.Length)
			}
		})
	}
}

func TestHeader_Encode_BufferTooSmall(t *testing.T) {
	hdr := Header{
		ProtocolFlags: ProtocolJREAPC,
		MessageType:   3,
		Length:        21,
	}

	buf := make([]byte, 7) // Too small
	err := hdr.Encode(buf)
	if err != ErrBufferTooSmall {
		t.Errorf("Expected ErrBufferTooSmall, got %v", err)
	}
}

func TestHeader_Decode_BufferTooSmall(t *testing.T) {
	hdr := &Header{}
	err := hdr.Decode([]byte{0x00, 0x01})
	if err != ErrInvalidHeader {
		t.Errorf("Expected ErrInvalidHeader, got %v", err)
	}
}

func TestHeader_Decode_InvalidFlags(t *testing.T) {
	// Wrong protocol flags
	buf := []byte{0x00, 0x02, 0x03, 0x00, 0x00, 0x00, 0x00, 0x15}
	hdr := &Header{}
	err := hdr.Decode(buf)
	if err == nil {
		t.Error("Expected error for invalid protocol flags")
	}
}

func TestHeader_Decode_MessageTooLarge(t *testing.T) {
	// Length > MaxMessageSize
	buf := []byte{0x00, 0x01, 0x03, 0x00, 0x00, 0x00, 0xFF, 0xFF}
	hdr := &Header{}
	err := hdr.Decode(buf)
	if err == nil {
		t.Error("Expected error for message too large")
	}
}

func TestCRCIDX(t *testing.T) {
	tests := []struct {
		payloadLen int
		want       int
	}{
		{0, HeaderSize},
		{17, HeaderSize + 17},
		{21, HeaderSize + 21},
		{100, HeaderSize + 100},
	}

	for _, tt := range tests {
		got := CRCIDX(tt.payloadLen)
		if got != tt.want {
			t.Errorf("CRCIDX(%d) = %d, want %d", tt.payloadLen, got, tt.want)
		}
	}
}

func TestHeader_TotalSize(t *testing.T) {
	hdr := Header{
		Length: 21,
	}
	want := HeaderSize + 21 + 2 // header + payload + CRC
	if got := hdr.TotalSize(); got != want {
		t.Errorf("TotalSize() = %d, want %d", got, want)
	}
}

func TestProtocolConstant(t *testing.T) {
	if ProtocolJREAPC != 0x0001 {
		t.Errorf("ProtocolJREAPC = 0x%04X, want 0x0001", ProtocolJREAPC)
	}
}

func TestHeaderSizeConstant(t *testing.T) {
	if HeaderSize != 8 {
		t.Errorf("HeaderSize = %d, want 8", HeaderSize)
	}
}
