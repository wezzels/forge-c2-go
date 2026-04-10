// Package tena implements TENA (Test and Training Enabling Architecture) for FORGE-C2.
// TENA provides a middleware for distributed testing and training exercises.
package tena

import (
	"encoding/binary"
	"fmt"
	"strings"
	"unsafe"
	"time"
)

// TENA Object Model Constants
const (
	TENAVersion          = "TENA-2022"
	TLVVersion         = 1
	MaxObjectName      = 64
	MaxAttributeName   = 64
	MaxMetadataEntries  = 16
)

// TENA Primitive Types
const (
	TypeBoolean      = 0x01
	TypeUInt8       = 0x02
	TypeInt8        = 0x03
	TypeUInt16      = 0x04
	TypeInt16       = 0x05
	TypeUInt32      = 0x06
	TypeInt32       = 0x07
	TypeUInt64      = 0x08
	TypeInt64       = 0x09
	TypeFloat       = 0x0A
	TypeDouble      = 0x0B
	TypeChar        = 0x0C
	TypeOctet       = 0x0D
	TypeString      = 0x0E
	TypeWString     = 0x0F
	TypeEnumerated  = 0x10
	TypeArray       = 0x11
	TypeFixedRecord = 0x12
	TypeVariableRecord = 0x13
	TypeByteVector  = 0x14
)

// TENA Message Types
const (
	MessageTypeHeartbeat    = 0x01
	MessageTypeObjectCreate = 0x02
	MessageTypeObjectUpdate = 0x03
	MessageTypeObjectDelete = 0x04
	MessageTypeInteraction  = 0x05
	MessageTypeDiscovery    = 0x06
	MessageTypeSync         = 0x07
)

// TENA Header Magic
var TENAMagic = [4]byte{'T', 'E', 'N', 'A'}

// TENAObjectHeader is the header for all TENA objects.
type TENAObjectHeader struct {
	Magic         [4]byte    // "TENA"
	Version       uint8      // TLV protocol version
	MessageType   uint8      // Message type
	SessionID     uint64     // Session identifier
	ObjectClass   uint32     // Object class handle
	ObjectInstance uint64    // Object instance handle
	Timestamp     time.Time  // Object timestamp
	SequenceNumber uint32    // Sequence number
}

// TENAObjectHeaderSize is the size of a TENA object header.
const TENAObjectHeaderSize = 38

// PackTENAObjectHeader packs a TENA object header.
func PackTENAObjectHeader(h *TENAObjectHeader, buf []byte) {
	off := 0
	copy(buf[off:], h.Magic[:])
	off += 4
	buf[off] = h.Version
	off++
	buf[off] = h.MessageType
	off++
	binary.LittleEndian.PutUint64(buf[off:], h.SessionID)
	off += 8
	binary.LittleEndian.PutUint32(buf[off:], h.ObjectClass)
	off += 4
	binary.LittleEndian.PutUint64(buf[off:], h.ObjectInstance)
	off += 8
	ms := uint64(h.Timestamp.UnixMilli())
	binary.LittleEndian.PutUint64(buf[off:], ms)
	off += 8
	binary.LittleEndian.PutUint32(buf[off:], h.SequenceNumber)
}

// UnpackTENAObjectHeader unpacks a TENA object header.
func UnpackTENAObjectHeader(buf []byte) *TENAObjectHeader {
	if len(buf) < TENAObjectHeaderSize {
		return nil
	}
	h := &TENAObjectHeader{}
	off := 0
	copy(h.Magic[:], buf[off:])
	off += 4
	h.Version = buf[off]
	off++
	h.MessageType = buf[off]
	off++
	h.SessionID = binary.LittleEndian.Uint64(buf[off:])
	off += 8
	h.ObjectClass = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.ObjectInstance = binary.LittleEndian.Uint64(buf[off:])
	off += 8
	ms := binary.LittleEndian.Uint64(buf[off:])
	h.Timestamp = time.UnixMilli(int64(ms))
	off += 8
	h.SequenceNumber = binary.LittleEndian.Uint32(buf[off:])
	return h
}

// TENAAttribute defines a single attribute.
type TENAAttribute struct {
	Name       string
	Type       uint8
	Value      interface{}
	ByteLength int
}

// TENAObject represents a TENA object instance.
type TENAObject struct {
	Header      TENAObjectHeader
	Name       string
	ClassName  string
	Attributes []TENAAttribute
	Metadata   map[string]string
}

// TENAMetadataEntry is a key-value metadata entry.
type TENAMetadataEntry struct {
	Key   string
	Value string
}

// NewTENAObject creates a new TENA object.
func NewTENAObject(class uint32, instance uint64) *TENAObject {
	return &TENAObject{
		Header: TENAObjectHeader{
			Magic:         TENAMagic,
			Version:       TLVVersion,
			ObjectClass:   class,
			ObjectInstance: instance,
			Timestamp:    time.Now(),
		},
		Metadata: make(map[string]string),
	}
}

// SetAttribute sets an attribute value.
func (o *TENAObject) SetAttribute(name string, dtype uint8, value interface{}) {
	for i := range o.Attributes {
		if o.Attributes[i].Name == name {
			o.Attributes[i].Value = value
			return
		}
	}
	o.Attributes = append(o.Attributes, TENAAttribute{
		Name:  name,
		Type:  dtype,
		Value: value,
	})
}

// GetAttribute gets an attribute value.
func (o *TENAObject) GetAttribute(name string) interface{} {
	for _, a := range o.Attributes {
		if a.Name == name {
			return a.Value
		}
	}
	return nil
}

// PackAttributes packs all attributes into a buffer.
func PackAttributes(obj *TENAObject, buf []byte) int {
	off := 0

	// Number of attributes
	binary.LittleEndian.PutUint16(buf[off:], uint16(len(obj.Attributes)))
	off += 2

	for _, attr := range obj.Attributes {
		// Attribute name length + name
		nameBytes := []byte(attr.Name)
		buf[off] = byte(len(nameBytes))
		off++
		copy(buf[off:], nameBytes)
		off += len(nameBytes)

		// Type
		buf[off] = attr.Type
		off++

		// Value based on type
		switch v := attr.Value.(type) {
		case float64:
			binary.LittleEndian.PutUint64(buf[off:], mathFloatToBits(v))
			off += 8
		case float32:
			bits := uint32(mathFloat32bits(v))
			binary.LittleEndian.PutUint32(buf[off:], bits)
			off += 4
		case uint64:
			binary.LittleEndian.PutUint64(buf[off:], v)
			off += 8
		case uint32:
			binary.LittleEndian.PutUint32(buf[off:], v)
			off += 4
		case uint16:
			binary.LittleEndian.PutUint16(buf[off:], v)
			off += 2
		case uint8:
			buf[off] = v
			off++
		case int64:
			binary.LittleEndian.PutUint64(buf[off:], uint64(v))
			off += 8
		case int32:
			binary.LittleEndian.PutUint32(buf[off:], uint32(v))
			off += 4
		case string:
			strBytes := []byte(v)
			binary.LittleEndian.PutUint16(buf[off:], uint16(len(strBytes)))
			off += 2
			copy(buf[off:], strBytes)
			off += len(strBytes)
		case []byte:
			binary.LittleEndian.PutUint16(buf[off:], uint16(len(v)))
			off += 2
			copy(buf[off:], v)
			off += len(v)
		}
	}

	return off
}

// UnpackAttributes unpacks attributes from a buffer.
func UnpackAttributes(buf []byte) ([]TENAAttribute, int) {
	attrs := []TENAAttribute{}
	off := 0

	count := binary.LittleEndian.Uint16(buf[off:])
	off += 2

	for i := 0; i < int(count); i++ {
		attr := TENAAttribute{}

		// Name
		nameLen := int(buf[off])
		off++
		attr.Name = string(buf[off : off+nameLen])
		off += nameLen

		// Type
		attr.Type = buf[off]
		off++

		// Value
		switch attr.Type {
		case TypeDouble:
			val := bitsToMathFloat(binary.LittleEndian.Uint64(buf[off:]))
			attr.Value = val
			off += 8
		case TypeFloat:
			bits := binary.LittleEndian.Uint32(buf[off:])
			attr.Value = mathFloatFromBits(bits)
			off += 4
		case TypeUInt64, TypeInt64:
			attr.Value = int64(binary.LittleEndian.Uint64(buf[off:]))
			off += 8
		case TypeUInt32, TypeInt32, TypeEnumerated:
			attr.Value = int32(binary.LittleEndian.Uint32(buf[off:]))
			off += 4
		case TypeUInt16, TypeInt16:
			attr.Value = int16(binary.LittleEndian.Uint16(buf[off:]))
			off += 2
		case TypeUInt8, TypeInt8:
			attr.Value = int8(buf[off])
			off++
		case TypeString, TypeWString:
			strLen := binary.LittleEndian.Uint16(buf[off:])
			off += 2
			attr.Value = string(buf[off : off+int(strLen)])
			off += int(strLen)
		case TypeByteVector:
			vecLen := binary.LittleEndian.Uint16(buf[off:])
			off += 2
			attr.Value = buf[off : off+int(vecLen)]
			off += int(vecLen)
		}

		attrs = append(attrs, attr)
	}

	return attrs, off
}

// TENAHeartbeat is a TENA heartbeat message.
type TENAHeartbeat struct {
	Header TENAObjectHeader
}

// NewHeartbeat creates a new heartbeat message.
func NewHeartbeat(sessionID uint64) *TENAHeartbeat {
	return &TENAHeartbeat{
		Header: TENAObjectHeader{
			Magic:       TENAMagic,
			Version:     TLVVersion,
			MessageType: MessageTypeHeartbeat,
			SessionID:   sessionID,
			Timestamp:  time.Now(),
		},
	}
}

// PackHeartbeat packs a heartbeat message.
func PackHeartbeat(hb *TENAHeartbeat, buf []byte) int {
	hb.Header.MessageType = MessageTypeHeartbeat
	hb.Header.Timestamp = time.Now()
	PackTENAObjectHeader(&hb.Header, buf)
	return TENAObjectHeaderSize
}

// UnpackHeartbeat unpacks a heartbeat message.
func UnpackHeartbeat(buf []byte) *TENAHeartbeat {
	if len(buf) < TENAObjectHeaderSize {
		return nil
	}
	return &TENAHeartbeat{
		Header: *UnpackTENAObjectHeader(buf),
	}
}

// TENADiscovery is a TENA discovery message.
type TENADiscovery struct {
	Header TENAObjectHeader
	FederateName string
	FederateType string
}

// NewDiscovery creates a new discovery message.
func NewDiscovery(sessionID uint64, name, federateType string) *TENADiscovery {
	return &TENADiscovery{
		Header: TENAObjectHeader{
			Magic:       TENAMagic,
			Version:     TLVVersion,
			MessageType: MessageTypeDiscovery,
			SessionID:   sessionID,
			Timestamp:  time.Now(),
		},
		FederateName: name,
		FederateType: federateType,
	}
}

// String implements fmt.Stringer.
func (o *TENAObject) String() string {
	return fmt.Sprintf("TENAObject[class=%d, instance=%d, attrs=%d]",
		o.Header.ObjectClass, o.Header.ObjectInstance, len(o.Attributes))
}

// TENA Object Class Handles
const (
	HandleObjectRoot     = 0
	HandleTrack          = 1001
	HandleEngagement     = 1002
	HandleWeapon         = 1003
	HandleSensor         = 1004
	HandlePlatform       = 1005
	HandleMission        = 1006
)

// Helper functions for float conversion
func mathFloatToBits(f float64) uint64 {
	return float64bits(f)
}

func bitsToMathFloat(bits uint64) float64 {
	return float64frombits(bits)
}

func mathFloat32bits(f float32) uint32 {
	return float32tobits(f)
}

func mathFloatFromBits(bits uint32) float32 {
	return float32frombits(bits)
}

// Use encoding/binary for float conversion
func float64bits(f float64) uint64 {
	return binary.LittleEndian.Uint64((*[8]byte)(unsafe.Pointer(&f))[:])
}

func float64frombits(bits uint64) float64 {
	var f float64
	binary.LittleEndian.PutUint64((*[8]byte)(unsafe.Pointer(&f))[:], bits)
	return f
}

func float32tobits(f float32) uint32 {
	return uint32(binary.LittleEndian.Uint32((*[4]byte)(unsafe.Pointer(&f))[:]))
}

func float32frombits(bits uint32) float32 {
	var f float32
	binary.LittleEndian.PutUint32((*[4]byte)(unsafe.Pointer(&f))[:], bits)
	return f
}

var _ = strings.TrimSpace
