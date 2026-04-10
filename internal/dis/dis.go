// Package dis implements DIS (IEEE 1278.1) PDU encoding/decoding for FORGE-C2.
// DIS is used to interoperate with legacy simulation systems.
package dis

import (
	"encoding/binary"
	"fmt"
	"math"
	"time"
)

// DIS Protocol Version
const DISProtocolVersion uint16 = 7

// PDU Families
const (
	FamilyEntityManagement    = 1
	FamilyWarfare             = 2
	FamilyLogistics           = 3
	FamilyRadioCommunications = 4
	FamilySimulationManagement = 5
	FamilyDistributedEmission = 6
	FamilyInfoOperations      = 7
	FamilyExperimental        = 8
)

// PDU Types (Entity Management Family)
const (
	TypeEntityState          = 1
	TypeEntityStateUpdate    = 2
	TypeFire                 = 3
	TypeDetonation           = 4
	TypeEntityLeave          = 5
	TypeEntityRecord         = 6
	TypeAcknowledge          = 7
	TypeActionAck            = 8
	TypeStartResume          = 9
	TypeStopFreeze           = 10
	TypeTransferControl      = 11
	TypeTransferOwnership    = 12
	TypeCreateEntity         = 13
	TypeRemoveEntity         = 14
	TypeStartResumeAck       = 15
	TypeStopFreezeAck        = 16
	TypeTransferControlAck   = 17
	TypeTransferOwnershipAck = 18
	TypeCollision            = 19
	TypeQuery                = 20
	TypeSetData              = 21
	TypeData                 = 22
	TypeEventReport          = 23
	TypeComment              = 24
	TypeRecordQuery          = 25
	TypeRecordAck            = 26
)

// Entity State PDU Dead Reckoning Algorithms
const (
	DRAlgorithmOther = 0
	DRAlgorithmStatic = 1
	DRAlgorithmFPW    = 2 // Fixed Position World
	DRAlgorithmRPW    = 3 // Rotating Position World
	DRAlgorithmVF     = 4 // Velocity Vector World
	DRAlgorithmRPV    = 5 // Rotating Position Velocity
	DRAlgorithmFPB    = 6 // Fixed Position Body
	DRAlgorithmRPB    = 7 // Rotating Position Body
	DRAlgorithmVFVB   = 8 // Velocity Vector Velocity Body
	DRAlgorithmFPWRPW = 9 // FPW and RPW
	DRAlgorithmFPWRVB = 10
	DRAlgorithmFPVRPB = 11
	DRAlgorithmRPVRVB = 12
	DRAlgorithmFPVFPW = 13
	DRAlgorithmFPVRPW = 14
	DRAlgorithmVPB    = 15
)

// Force IDs
const (
	ForceOther  = 0
	ForceFriendly = 1
	ForceOpposing = 2
	ForceNeutral = 3
	ForceFriendlySubsystem = 4
)

// EntityType represents the kind/realm/domain/specific entity type.
type EntityType struct {
	Kind         uint8  // 1=Platform, 2=Munition, 3=Lifeform, etc.
	Domain       uint8  // 1=Land, 2=Air, 3=Surface, 4=Subsurface, 5=Space
	Country      uint16 // NATO country code
	Category     uint8  // Entity category within domain
	Subcategory uint8  // Entity subcategory
	Specific     uint8  // Specific entity type
	Extra1       uint8  // Extra identification
}

// DISHeader is the 16-byte fixed header for all DIS PDUs.
type DISHeader struct {
	ProtocolVersion uint16  // 2 bytes: DIS protocol version (7)
	ExerciseID      uint8   // 1 byte: exercise identifier
	PDUHeaderLength uint16 // 2 bytes: header + PDU length in bytes
	PDUType        uint8   // 1 byte: PDU type
	Family         uint8   // 1 byte: PDU family
	Timestamp      uint32  // 4 bytes: time stamp (0-65535 x 10ms)
}

// DISEntityStatePDU represents an Entity State PDU (Type 1, Family 1).
// This is the most common DIS PDU, used to transmit entity position,
// orientation, velocity, and appearance.
type DISEntityStatePDU struct {
	Header DISHeader

	// Entity ID (3 x 16-bit)
	SiteNumber       uint16
	ApplicationNumber uint16
	EntityNumber     uint16

	// Entity type information
	EntityType EntityType

	// Alternative entity type (for changed identity)
	AlternativeType EntityType

	// Physical location and orientation
	Latitude  float64 // degrees
	Longitude float64 // degrees
	Altitude  float64 // meters above MSL

	Orientation RollPitchYaw // linear/angular orientation

	// Velocity (m/s in world coordinates)
	VelocityX float64
	VelocityY float64
	VelocityZ float64

	// Acceleration (m/s²)
	AngularVelocityX float64 // rad/s
	AngularVelocityY float64
	AngularVelocityZ float64

	// Entity appearance (platform-specific)
	Appearance uint32

	// Dead reckoning parameters
	DRAlgorithm  uint8          // Dead reckoning algorithm
	DRParameters [15]byte       // DR parameter data
	DRLinearVelocity [3]float32 // DR dead reckoning

	MarkingText [11]byte // 11 bytes: identification text

	Capabilities uint32 // Entity capabilities/camo state
}

// RollPitchYaw represents entity orientation.
type RollPitchYaw struct {
	Phi   float64 // Roll angle (X-axis rotation) radians
	Theta float64 // Pitch angle (Y-axis rotation) radians
	Psi   float64 // Yaw angle (Z-axis rotation) radians
}

// EntityStatePDUSize is the packed size of a DIS Entity State PDU in bytes.
const EntityStatePDUSize = 224

// PackDISHeader packs a DIS header into buf (16 bytes).
func PackDISHeader(h *DISHeader, buf []byte) {
	off := 0
	binary.LittleEndian.PutUint16(buf[off:], h.ProtocolVersion)
	off += 2
	buf[off] = h.ExerciseID
	off++
	// Padding byte
	buf[off] = 0
	off++
	binary.LittleEndian.PutUint16(buf[off:], h.PDUHeaderLength)
	off += 2
	buf[off] = h.PDUType
	off++
	buf[off] = h.Family
	off++
	binary.LittleEndian.PutUint32(buf[off:], h.Timestamp)
	off += 4
	// Two padding bytes at end of header
	buf[off] = 0
	off++
	buf[off] = 0
}

// UnpackDISHeader unpacks a DIS header from buf (16 bytes).
func UnpackDISHeader(buf []byte) *DISHeader {
	if len(buf) < 16 {
		return nil
	}
	h := &DISHeader{}
	off := 0
	h.ProtocolVersion = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	h.ExerciseID = buf[off]
	off++
	// Skip padding
	off++
	h.PDUHeaderLength = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	h.PDUType = buf[off]
	off++
	h.Family = buf[off]
	off++
	h.Timestamp = binary.LittleEndian.Uint32(buf[off:])
	return h
}

// PackEntityStatePDU packs a DIS Entity State PDU into buf (144 bytes).
func PackEntityStatePDU(pdu *DISEntityStatePDU, buf []byte) {
	if len(buf) < EntityStatePDUSize {
		return
	}

	off := 0

	// Copy header (16 bytes)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Entity ID (6 bytes)
	binary.LittleEndian.PutUint16(buf[off:], pdu.SiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.ApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.EntityNumber)
	off += 2

	// Entity type (8 bytes)
	buf[off] = pdu.EntityType.Kind
	off++
	buf[off] = pdu.EntityType.Domain
	off++
	binary.LittleEndian.PutUint16(buf[off:], pdu.EntityType.Country)
	off += 2
	buf[off] = pdu.EntityType.Category
	off++
	buf[off] = pdu.EntityType.Subcategory
	off++
	buf[off] = pdu.EntityType.Specific
	off++
	buf[off] = pdu.EntityType.Extra1
	off++

	// Alternative type (8 bytes, all zeros for now)
	off += 8

	// Number of articulation parameters (2 bytes)
	binary.LittleEndian.PutUint16(buf[off:], 0)
	off += 2

	// Location: Lat/Lon/Alt (24 bytes total - 8 bytes each as int64)
	latVal := int64(pdu.Latitude * 10000000) // 0.0000001 degree resolution
	lonVal := int64(pdu.Longitude * 10000000)
	altVal := int64(pdu.Altitude * 1000) // millimeter resolution
	binary.LittleEndian.PutUint64(buf[off:], uint64(latVal))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], uint64(lonVal))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], uint64(altVal))
	off += 8

	// Orientation: Psi, Theta, Phi (24 bytes - 8 each as int64)
	psiVal := int64(pdu.Orientation.Psi * 10000) // 0.0001 rad resolution
	thetaVal := int64(pdu.Orientation.Theta * 10000)
	phiVal := int64(pdu.Orientation.Phi * 10000)
	binary.LittleEndian.PutUint64(buf[off:], uint64(psiVal))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], uint64(thetaVal))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], uint64(phiVal))
	off += 8

	// Velocity (12 bytes - 4 each as uint32 representing IEEE-754 bits)
	binary.LittleEndian.PutUint32(buf[off:], floatToBits(pdu.VelocityX))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], floatToBits(pdu.VelocityY))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], floatToBits(pdu.VelocityZ))
	off += 4

	// Acceleration (24 bytes - 8 each as doubles, set to 0)
	for i := 0; i < 24; i++ {
		buf[off+i] = 0
	}
	off += 24

	// Angular velocity (24 bytes - 8 each as doubles, set to 0)
	for i := 0; i < 24; i++ {
		buf[off+i] = 0
	}
	off += 24

	// Appearance (4 bytes)
	binary.LittleEndian.PutUint32(buf[off:], pdu.Appearance)
	off += 4

	// Dead reckoning algorithm (1 byte)
	buf[off] = pdu.DRAlgorithm
	off++

	// DR parameters (15 bytes, all zeros for now)
	for i := 0; i < 15; i++ {
		buf[off+i] = 0
	}
	off += 15

	// DR dead reckoning velocity (12 bytes - 4 each, zeros)
	for i := 0; i < 12; i++ {
		buf[off+i] = 0
	}
	off += 12

	// DR dead reckoning position (24 bytes - 8 each, zeros)
	for i := 0; i < 24; i++ {
		buf[off+i] = 0
	}
	off += 24

	// Marking text (11 bytes)
	copy(buf[off:off+11], pdu.MarkingText[:])
	off += 11

	// Capabilities (4 bytes)
	binary.LittleEndian.PutUint32(buf[off:], pdu.Capabilities)
}

// UnpackEntityStatePDU unpacks a DIS Entity State PDU from buf (144 bytes).
func UnpackEntityStatePDU(buf []byte) *DISEntityStatePDU {
	if len(buf) < EntityStatePDUSize {
		return nil
	}
	pdu := &DISEntityStatePDU{}
	off := 0

	// Header
	pdu.Header = *UnpackDISHeader(buf[off:])
	off += 16

	// Entity ID
	pdu.SiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.ApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.EntityNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Entity type
	pdu.EntityType.Kind = buf[off]
	off++
	pdu.EntityType.Domain = buf[off]
	off++
	pdu.EntityType.Country = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.EntityType.Category = buf[off]
	off++
	pdu.EntityType.Subcategory = buf[off]
	off++
	pdu.EntityType.Specific = buf[off]
	off++
	pdu.EntityType.Extra1 = buf[off]
	off++

	// Skip alternative type
	off += 8

	// Number of articulation parameters
	off += 2

	// Location
	latVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Latitude = float64(latVal) / 10000000
	off += 8
	lonVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Longitude = float64(lonVal) / 10000000
	off += 8
	altVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Altitude = float64(altVal) / 1000
	off += 8

	// Orientation
	psiVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Orientation.Psi = float64(psiVal) / 10000
	off += 8
	thetaVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Orientation.Theta = float64(thetaVal) / 10000
	off += 8
	phiVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Orientation.Phi = float64(phiVal) / 10000
	off += 8

	// Velocity
	pdu.VelocityX = bitsToFloat(binary.LittleEndian.Uint32(buf[off:]))
	off += 4
	pdu.VelocityY = bitsToFloat(binary.LittleEndian.Uint32(buf[off:]))
	off += 4
	pdu.VelocityZ = bitsToFloat(binary.LittleEndian.Uint32(buf[off:]))
	off += 4

	// Skip acceleration, angular velocity
	off += 8 * 6

	// Appearance
	pdu.Appearance = binary.LittleEndian.Uint32(buf[off:])
	off += 4

	// DR algorithm
	pdu.DRAlgorithm = buf[off]
	off++

	// Skip DR parameters
	off += 15

	// Skip DR velocity
	off += 12

	// Skip DR position
	off += 24

	// Marking text
	copy(pdu.MarkingText[:], buf[off:off+11])
	off += 11

	// Capabilities
	pdu.Capabilities = binary.LittleEndian.Uint32(buf[off:])

	return pdu
}

// NewEntityStatePDU creates a new DIS Entity State PDU with defaults.
func NewEntityStatePDU(site, app, entity uint16) *DISEntityStatePDU {
	now := time.Now()
	timestamp := uint32(now.UnixMilli() / 10) // 10ms ticks

	return &DISEntityStatePDU{
		Header: DISHeader{
			ProtocolVersion: DISProtocolVersion,
			ExerciseID:      1,
			PDUHeaderLength: 16,
			PDUType:        TypeEntityState,
			Family:         FamilyEntityManagement,
			Timestamp:      timestamp,
		},
		SiteNumber:        site,
		ApplicationNumber: app,
		EntityNumber:     entity,
		DRAlgorithm:      DRAlgorithmStatic,
		Appearance:      0,
		Capabilities:    0,
	}
}

// SetLocation sets the lat/lon/alt position.
func (p *DISEntityStatePDU) SetLocation(lat, lon, alt float64) {
	p.Latitude = lat
	p.Longitude = lon
	p.Altitude = alt
}

// SetOrientation sets the roll/pitch/yaw orientation in degrees.
func (p *DISEntityStatePDU) SetOrientation(roll, pitch, yaw float64) {
	// Convert degrees to radians
	p.Orientation.Phi = roll * (math.Pi / 180)
	p.Orientation.Theta = pitch * (math.Pi / 180)
	p.Orientation.Psi = yaw * (math.Pi / 180)
}

// SetVelocity sets the velocity vector in m/s.
func (p *DISEntityStatePDU) SetVelocity(vx, vy, vz float64) {
	p.VelocityX = vx
	p.VelocityY = vy
	p.VelocityZ = vz
}

// SetEntityType sets the entity type information.
func (p *DISEntityStatePDU) SetEntityType(kind, domain, category, subcategory, specific uint8, country uint16) {
	p.EntityType = EntityType{
		Kind:         kind,
		Domain:       domain,
		Country:      country,
		Category:     category,
		Subcategory: subcategory,
		Specific:     specific,
	}
}

// SetMarking sets the identification text (max 11 chars).
func (p *DISEntityStatePDU) SetMarking(text string) {
	clear(p.MarkingText[:])
	n := copy(p.MarkingText[:], text)
	if n > 11 {
		n = 11
	}
}

// String implements fmt.Stringer.
func (p *DISEntityStatePDU) String() string {
	return fmt.Sprintf("DIS Entity State: Site=%d App=%d Entity=%d Lat=%.6f Lon=%.6f Alt=%.1f",
		p.SiteNumber, p.ApplicationNumber, p.EntityNumber, p.Latitude, p.Longitude, p.Altitude)
}

// floatToBits converts a float64 to a float32 IEEE-754 representation.
// DIS uses 32-bit floats for velocity fields.
func floatToBits(f float64) uint32 {
	f32 := float32(f)
	bits := math.Float32bits(f32)
	return bits
}

// bitsToFloat converts IEEE-754 bits to float64.
func bitsToFloat(bits uint32) float64 {
	return float64(math.Float32frombits(bits))
}

// Ensure fmt is used
var _ = fmt.Sprintf

// DISFirePDU represents a Fire PDU (Type 3, Family 2).
// Used when an entity fires a munition.
type DISFirePDU struct {
	Header DISHeader

	// Firing Entity ID
	FiringSiteNumber       uint16
	FiringApplicationNumber uint16
	FiringEntityNumber     uint16

	// Target Entity ID
	TargetSiteNumber       uint16
	TargetApplicationNumber uint16
	TargetEntityNumber     uint16

	// Munition Entity ID
	MunitionSiteNumber     uint16
	MunitionApplicationNumber uint16
	MunitionEntityNumber   uint16

	// Event ID (for receipt confirmation)
	EventSiteNumber        uint16
	EventApplicationNumber uint16
	EventNumber           uint16

	// Fire Mission Index (mapping to engagement)
	FireMissionIndex uint32

	// Munition type
	MunitionType EntityType

	// Munition quantity and accounting
	MunitionQuantity uint16
	MunitionTypeCount uint16

	// Speed/velocity of fired munition
	Velocity float64 // m/s (float32 in wire format)

	// Range to target (meters)
	Range float64 // float32 in wire format

	// Location where munition was fired (firing entity location)
	Latitude  float64
	Longitude float64
	Altitude float64
}

// FirePDUSize is the packed size of a DIS Fire PDU.
const FirePDUSize = 151 // Approximate

// PackDISFirePDU packs a Fire PDU.
func PackDISFirePDU(pdu *DISFirePDU, buf []byte) {
	if len(buf) < FirePDUSize {
		return
	}
	off := 0

	// Header (16)
	hbuf := make([]byte, 16)
	PackDISHeader(&pdu.Header, hbuf)
	copy(buf[off:], hbuf)
	off += 16

	// Firing Entity ID (6)
	binary.LittleEndian.PutUint16(buf[off:], pdu.FiringSiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.FiringApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.FiringEntityNumber)
	off += 2

	// Target Entity ID (6)
	binary.LittleEndian.PutUint16(buf[off:], pdu.TargetSiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.TargetApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.TargetEntityNumber)
	off += 2

	// Munition Entity ID (6)
	binary.LittleEndian.PutUint16(buf[off:], pdu.MunitionSiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.MunitionApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.MunitionEntityNumber)
	off += 2

	// Event ID (6)
	binary.LittleEndian.PutUint16(buf[off:], pdu.EventSiteNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.EventApplicationNumber)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], pdu.EventNumber)
	off += 2

	// Fire Mission Index (4)
	binary.LittleEndian.PutUint32(buf[off:], pdu.FireMissionIndex)
	off += 4

	// Munition Type (8)
	buf[off] = pdu.MunitionType.Kind
	off++
	buf[off] = pdu.MunitionType.Domain
	off++
	binary.LittleEndian.PutUint16(buf[off:], pdu.MunitionType.Country)
	off += 2
	buf[off] = pdu.MunitionType.Category
	off++
	buf[off] = pdu.MunitionType.Subcategory
	off++
	buf[off] = pdu.MunitionType.Specific
	off++
	buf[off] = pdu.MunitionType.Extra1
	off++

	// Munition Quantity (2)
	binary.LittleEndian.PutUint16(buf[off:], pdu.MunitionQuantity)
	off += 2

	// Munition Type Count (2)
	binary.LittleEndian.PutUint16(buf[off:], pdu.MunitionTypeCount)
	off += 2

	// Velocity (4)
	binary.LittleEndian.PutUint32(buf[off:], floatToBits(pdu.Velocity))
	off += 4

	// Range (4)
	binary.LittleEndian.PutUint32(buf[off:], floatToBits(pdu.Range))
	off += 4

	// Location (24)
	latVal := int64(pdu.Latitude * 10000000)
	binary.LittleEndian.PutUint64(buf[off:], uint64(latVal))
	off += 8
	lonVal := int64(pdu.Longitude * 10000000)
	binary.LittleEndian.PutUint64(buf[off:], uint64(lonVal))
	off += 8
	altVal := int64(pdu.Altitude * 1000)
	binary.LittleEndian.PutUint64(buf[off:], uint64(altVal))
	off += 8
}

// UnpackDISFirePDU unpacks a Fire PDU.
func UnpackDISFirePDU(buf []byte) *DISFirePDU {
	if len(buf) < FirePDUSize {
		return nil
	}
	pdu := &DISFirePDU{}
	off := 0

	pdu.Header = *UnpackDISHeader(buf[off:])
	off += 16

	// Firing Entity ID
	pdu.FiringSiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.FiringApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.FiringEntityNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Target Entity ID
	pdu.TargetSiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.TargetApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.TargetEntityNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Munition Entity ID
	pdu.MunitionSiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.MunitionApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.MunitionEntityNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Event ID
	pdu.EventSiteNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.EventApplicationNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.EventNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Fire Mission Index
	pdu.FireMissionIndex = binary.LittleEndian.Uint32(buf[off:])
	off += 4

	// Munition Type
	pdu.MunitionType.Kind = buf[off]
	off++
	pdu.MunitionType.Domain = buf[off]
	off++
	pdu.MunitionType.Country = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	pdu.MunitionType.Category = buf[off]
	off++
	pdu.MunitionType.Subcategory = buf[off]
	off++
	pdu.MunitionType.Specific = buf[off]
	off++
	pdu.MunitionType.Extra1 = buf[off]
	off++

	// Munition Quantity
	pdu.MunitionQuantity = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Munition Type Count
	pdu.MunitionTypeCount = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Velocity
	pdu.Velocity = bitsToFloat(binary.LittleEndian.Uint32(buf[off:]))
	off += 4

	// Range
	pdu.Range = bitsToFloat(binary.LittleEndian.Uint32(buf[off:]))
	off += 4

	// Location
	latVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Latitude = float64(latVal) / 10000000
	off += 8
	lonVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Longitude = float64(lonVal) / 10000000
	off += 8
	altVal := int64(binary.LittleEndian.Uint64(buf[off:]))
	pdu.Altitude = float64(altVal) / 1000
	off += 8

	return pdu
}

// NewFirePDU creates a new Fire PDU.
func NewFirePDU(firingSite, firingApp, firingEntity uint16) *DISFirePDU {
	now := time.Now()
	return &DISFirePDU{
		Header: DISHeader{
			ProtocolVersion: DISProtocolVersion,
			ExerciseID:      1,
			PDUHeaderLength: 16,
			PDUType:        TypeFire,
			Family:         FamilyWarfare,
			Timestamp:      uint32(now.UnixMilli() / 10),
		},
		FiringSiteNumber:       firingSite,
		FiringApplicationNumber: firingApp,
		FiringEntityNumber:     firingEntity,
	}
}
