package dis

import (
	"encoding/binary"
	"unsafe"
)

// EntityID identifies an entity in DIS
type EntityID struct {
	SiteNumber       uint16
	ApplicationNumber uint16
	EntityNumber     uint16
}

// EventID for PDU correlation
type EventID struct {
	SiteNumber       uint16
	ApplicationNumber uint16
	EventNumber      uint16
}

// Vector3Double is a 3D vector with double precision
type Vector3Double struct {
	X float64
	Y float64
	Z float64
}

// Vector3Float is a 3D vector with single precision
type Vector3Float struct {
	X float32
	Y float32
	Z float32
}

// Collision PDU (Type 4)
type DISCollisionPDU struct {
	Header DISHeader
	EntityID EntityID
	CollisionType uint8
	TargetEntityID EntityID
	Location Vector3Double
	CollisionMass    float32
	CollisionVelocity Vector3Float
}

// Acknowledge PDU (Type 16)
type DISAcknowledgePDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	ReceivingEntityID EntityID
	AcknowledgeFlag uint16
	ResponseFlag uint16
	EventID EventID
}

// PackEntityID packs an EntityID into buf (6 bytes)
func PackEntityID(id *EntityID, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint16(buf[off:], id.SiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], id.ApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], id.EntityNumber)
	off += 2
	return off
}

// UnpackEntityID unpacks an EntityID from buf
func UnpackEntityID(buf []byte, id *EntityID) int {
	off := 0
	id.SiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	id.ApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	id.EntityNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	return off
}

// float32ToBits converts float32 to its bit representation
func float32ToBits(f float32) uint32 {
	return *(*uint32)(unsafe.Pointer(&f))
}

// bitsToFloat32 converts bit representation back to float32
func bitsToFloat32(b uint32) float32 {
	return *(*float32)(unsafe.Pointer(&b))
}

// Detonation result codes
const (
	DetonationResultEntityImpact = 1
	DetonationResultGroundImpact = 2
	DetonationResultObjectImpact = 3
	DetonationResultGroundMiss = 4
	DetonationResultAirMiss = 5
	DetonationResultMiss = 6
	DetonationResultNone = 7
)

// Collision type codes
const (
	CollisionEntityEntity = 1
	CollisionEntityEnvironment = 2
	CollisionEntityStatic = 3
)
