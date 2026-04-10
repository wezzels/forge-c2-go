// Package hla implements HLA (IEEE 1516) federation interface for FORGE-C2.
// HLA provides simulation interoperability for distributed military training.
package hla

import (
	"encoding/binary"
	"unsafe"
	"fmt"
	"strings"
	"time"
)

// HLA Object Model Types
const (
	FOMVersion  = "IEEE1516-2010"
	RTIVersion = "1516.2010"
)

// Federate Types
const (
	FederateTypeFORGE   = "FORGE-C2"
	FederateTypeSensor  = "SENSOR"
	FederateTypeWeapon  = "WEAPON"
	FederateTypeTracker = "TRACKER"
	FederateTypeGateway = "GATEWAY"
	FederateTypeCommand = "COMMAND"
)

// HLA Update Rate Designators
const (
	UpdateRateSimulated  = "Simulated"
	UpdateRateBestEffort = "Best Effort"
	UpdateRateDataDriven = "Data Driven"
	UpdateRateRealTime   = "RealTime"
)

// Object Class Handles
const (
	HandleObjectRoot       = 1
	HandleObjectEntity     = 2
	HandleObjectTrack      = 3
	HandleObjectEngagement = 4
	HandleObjectSensor     = 5
	HandleObjectWeapon     = 6
)

// Attribute Handles
const (
	HandleAttrEntityID       = 1
	HandleAttrPosition       = 2
	HandleAttrOrientation    = 3
	HandleAttrVelocity       = 4
	HandleAttrAcceleration   = 5
	HandleAttrEntityType     = 6
	HandleAttrForceID        = 7
	HandleAttrMarking        = 8
	HandleAttrDamageState   = 9
	HandleAttrTrackNumber    = 10
	HandleAttrTrackQuality   = 11
	HandleAttrCorrelationID   = 12
	HandleAttrEngagementID   = 13
	HandleAttrTargetID       = 14
	HandleAttrWeaponState    = 15
	HandleAttrMunitionType   = 16
)

// HLAObjectRoot is the base object class.
type HLAObjectRoot struct {
	ObjectInstanceHandle uint32
	Name                string
	Owner               string
	State               ObjectState
}

// ObjectState tracks publication/subscription state.
type ObjectState struct {
	Published  bool
	Subscribed bool
	Updated    bool
	UpdateRate string
	LastUpdate time.Time
}

// HLAEntity represents a generic simulation entity.
type HLAEntity struct {
	HLAObjectRoot
	EntityID      EntityID
	Position     CartesianCoordinates
	Orientation  Orientation
	Velocity     VelocityVector
	Acceleration AccelerationVector
	EntityType   EntityType
	ForceID      ForceIdentifier
	Marking      string
	DamageState  DamageState
}

// EntityID identifies an entity in the federation.
type EntityID struct {
	SiteNumber        uint16
	ApplicationNumber uint16
	EntityNumber      uint16
}

// CartesianCoordinates is a 3D position in meters.
type CartesianCoordinates struct {
	X float64
	Y float64
	Z float64
}

// Orientation is roll/pitch/yaw in radians.
type Orientation struct {
	Psi   float64
	Theta float64
	Phi   float64
}

// VelocityVector is velocity in m/s.
type VelocityVector struct {
	X float64
	Y float64
	Z float64
}

// AccelerationVector is acceleration in m/s².
type AccelerationVector struct {
	X float64
	Y float64
	Z float64
}

// EntityType classifies the entity.
type EntityType struct {
	Kind        uint8
	Domain      uint8
	Country     uint16
	Category    uint8
	Subcategory uint8
	Specific    uint8
	Extra       uint8
}

// ForceIdentifier identifies the force affiliation.
type ForceIdentifier uint8

const (
	ForceOther    ForceIdentifier = 0
	ForceFriendly ForceIdentifier = 1
	ForceOpposing ForceIdentifier = 2
	ForceNeutral  ForceIdentifier = 3
)

// DamageState describes entity damage.
type DamageState uint8

const (
	DamageNoDamage  DamageState = 0
	DamageSlight    DamageState = 1
	DamageModerate   DamageState = 2
	DamageDestroyed  DamageState = 3
	DamageUnknown    DamageState = 4
)

// HLAUpdateHeader is the standard HLA update message header.
type HLAUpdateHeader struct {
	Marks                   [4]byte
	MessageLength           uint32
	FederateHandle         uint32
	ObjectInstanceHandle   uint32
	AttributeCount         uint16
	SentTime               time.Time
}

// HLAMessageSize is the header size for an update.
const HLAMessageSize = 26

// PackHLAUpdateHeader packs an HLA update header.
func PackHLAUpdateHeader(h *HLAUpdateHeader, buf []byte) {
	off := 0
	copy(buf[off:], h.Marks[:])
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], h.MessageLength)
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], h.FederateHandle)
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], h.ObjectInstanceHandle)
	off += 4
	binary.LittleEndian.PutUint16(buf[off:], h.AttributeCount)
	off += 2
	ms := uint64(h.SentTime.UnixMilli())
	binary.LittleEndian.PutUint64(buf[off:], ms)
}

// UnpackHLAUpdateHeader unpacks an HLA update header.
func UnpackHLAUpdateHeader(buf []byte) *HLAUpdateHeader {
	if len(buf) < HLAMessageSize {
		return nil
	}
	h := &HLAUpdateHeader{}
	off := 0
	copy(h.Marks[:], buf[off:])
	off += 4
	h.MessageLength = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.FederateHandle = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.ObjectInstanceHandle = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.AttributeCount = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	ms := binary.LittleEndian.Uint64(buf[off:])
	h.SentTime = time.UnixMilli(int64(ms))
	return h
}

// HLAAttributeHeader is packed attribute data.
type HLAAttributeHeader struct {
	AttributeHandle uint32
	DataType        uint16
	Length          uint16
}

// PackHLAAttribute packs a single attribute.
func PackHLAAttribute(handle uint32, data []byte, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint32(buf[off:], handle)
	off += 4
	var dtype uint16 = 3
	if len(data) <= 8 {
		dtype = 2
	}
	binary.LittleEndian.PutUint16(buf[off:], dtype)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], uint16(len(data)))
	off += 2
	copy(buf[off:], data)
	return 4 + 2 + 2 + len(data)
}

// PackEntityAttributes packs entity attributes into a buffer.
func PackEntityAttributes(e *HLAEntity, buf []byte) int {
	off := 0

	// Entity ID (6 bytes)
	var entityIDData [6]byte
	binary.LittleEndian.PutUint16(entityIDData[0:2], e.EntityID.SiteNumber)
	binary.LittleEndian.PutUint16(entityIDData[2:4], e.EntityID.ApplicationNumber)
	binary.LittleEndian.PutUint16(entityIDData[4:6], e.EntityID.EntityNumber)
	n := PackHLAAttribute(HandleAttrEntityID, entityIDData[:], buf[off:])
	off += n

	// Position (24 bytes - 3 x 8-byte floats)
	var posData [24]byte
	binary.LittleEndian.PutUint64(posData[0:8], floatToBits(e.Position.X))
	binary.LittleEndian.PutUint64(posData[8:16], floatToBits(e.Position.Y))
	binary.LittleEndian.PutUint64(posData[16:24], floatToBits(e.Position.Z))
	n = PackHLAAttribute(HandleAttrPosition, posData[:], buf[off:])
	off += n

	// Velocity (24 bytes)
	var velData [24]byte
	binary.LittleEndian.PutUint64(velData[0:8], floatToBits(e.Velocity.X))
	binary.LittleEndian.PutUint64(velData[8:16], floatToBits(e.Velocity.Y))
	binary.LittleEndian.PutUint64(velData[16:24], floatToBits(e.Velocity.Z))
	n = PackHLAAttribute(HandleAttrVelocity, velData[:], buf[off:])
	off += n

	// Entity Type (8 bytes)
	var typeData [8]byte
	typeData[0] = e.EntityType.Kind
	typeData[1] = e.EntityType.Domain
	binary.LittleEndian.PutUint16(typeData[2:4], e.EntityType.Country)
	typeData[4] = e.EntityType.Category
	typeData[5] = e.EntityType.Subcategory
	typeData[6] = e.EntityType.Specific
	typeData[7] = e.EntityType.Extra
	n = PackHLAAttribute(HandleAttrEntityType, typeData[:], buf[off:])
	off += n

	// Marking (string)
	n = PackHLAAttribute(HandleAttrMarking, []byte(e.Marking), buf[off:])
	off += n

	return off
}

// UnpackEntityAttributes unpacks entity attributes from a buffer.
func UnpackEntityAttributes(buf []byte) *HLAEntity {
	e := &HLAEntity{}
	off := 0

	for off+8 < len(buf) {
		handle := binary.LittleEndian.Uint32(buf[off:])
		off += 4
		binary.LittleEndian.Uint16(buf[off:])
		off += 2
		length := binary.LittleEndian.Uint16(buf[off:])
		off += 2

		data := buf[off : off+int(length)]
		off += int(length)

		switch handle {
		case HandleAttrEntityID:
			if len(data) >= 6 {
				e.EntityID.SiteNumber = binary.LittleEndian.Uint16(data[0:2])
				e.EntityID.ApplicationNumber = binary.LittleEndian.Uint16(data[2:4])
				e.EntityID.EntityNumber = binary.LittleEndian.Uint16(data[4:6])
			}
		case HandleAttrPosition:
			if len(data) >= 24 {
				e.Position.X = bitsToFloat(binary.LittleEndian.Uint64(data[0:8]))
				e.Position.Y = bitsToFloat(binary.LittleEndian.Uint64(data[8:16]))
				e.Position.Z = bitsToFloat(binary.LittleEndian.Uint64(data[16:24]))
			}
		case HandleAttrEntityType:
			if len(data) >= 8 {
				e.EntityType.Kind = data[0]
				e.EntityType.Domain = data[1]
				e.EntityType.Country = binary.LittleEndian.Uint16(data[2:4])
				e.EntityType.Category = data[4]
				e.EntityType.Subcategory = data[5]
				e.EntityType.Specific = data[6]
				e.EntityType.Extra = data[7]
			}
		case HandleAttrMarking:
			e.Marking = strings.TrimRight(string(data), "\x00")
		}
	}

	return e
}

// NewEntity creates a new HLA entity with defaults.
func NewEntity(site, app, entity uint16) *HLAEntity {
	return &HLAEntity{
		HLAObjectRoot: HLAObjectRoot{
			ObjectInstanceHandle: uint32(site<<16 | app),
			Name:                fmt.Sprintf("Entity-%d-%d-%d", site, app, entity),
			State: ObjectState{
				Published:  true,
				Subscribed: true,
				UpdateRate: UpdateRateSimulated,
			},
		},
		EntityID: EntityID{
			SiteNumber:        site,
			ApplicationNumber: app,
			EntityNumber:      entity,
		},
		EntityType: EntityType{
			Kind:    1,
			Domain:  2,
			Country: 200,
		},
		ForceID: ForceFriendly,
	}
}

// SetLocation sets the entity position.
func (e *HLAEntity) SetLocation(x, y, z float64) {
	e.Position = CartesianCoordinates{X: x, Y: y, Z: z}
}

// SetOrientation sets the entity orientation in radians.
func (e *HLAEntity) SetOrientation(phi, theta, psi float64) {
	e.Orientation = Orientation{Phi: phi, Theta: theta, Psi: psi}
}

// SetVelocity sets the entity velocity in m/s.
func (e *HLAEntity) SetVelocity(x, y, z float64) {
	e.Velocity = VelocityVector{X: x, Y: y, Z: z}
}

// String implements fmt.Stringer.
func (e *HLAEntity) String() string {
	return fmt.Sprintf("HLAEntity[%s @ (%.2f, %.2f, %.2f)]",
		e.Name, e.Position.X, e.Position.Y, e.Position.Z)
}

// Helper functions for float <-> uint64 conversion
func floatToBits(f float64) uint64 {
	return binary.LittleEndian.Uint64((*[8]byte)(unsafe.Pointer(&f))[:])
}

func bitsToFloat(bits uint64) float64 {
	var f float64
	binary.LittleEndian.PutUint64((*[8]byte)(unsafe.Pointer(&f))[:], bits)
	return f
}

var _ = fmt.Sprintf
