package dis

import "math"

// =============================================================================
// Phase 2.1.7: Fire PDU - Fuse Type Encoding
// =============================================================================

// FuseType encodes the type of fuse on a munition
type FuseType uint16

const (
	FuseTypeNone FuseType = iota
	FuseTypeImpact
	FuseTypeTimed
	FuseTypeProximity
	FuseTypeAdaptive
)

// PackFuseType packs fuse type into 2 bytes
func PackFuseType(ft FuseType) []byte {
	buf := make([]byte, 2)
	buf[0] = byte(ft >> 8)
	buf[1] = byte(ft & 0xFF)
	return buf
}

// UnpackFuseType unpacks fuse type from 2 bytes
func UnpackFuseType(data []byte) FuseType {
	return FuseType(data[0])<<8 | FuseType(data[1])
}

// =============================================================================
// Phase 2.1.9: Detonation PDU - Exploding Equipment
// =============================================================================

// ExplodingEquipmentType encodes types of equipment that can explode
type ExplodingEquipmentType uint16

const (
	ExplodingEquipmentNone ExplodingEquipmentType = iota
	ExplodingEquipmentAmmunition
	ExplodingEquipmentFuel
	ExplodingEquipmentHazmat
	ExplodingEquipmentNuclear
)

// DetonationPDUExtended is a Detonation PDU with exploding equipment info
type DetonationPDUExtended struct {
	FiringEntityID    EntityID
	TargetEntityID    EntityID
	Location          Vector3Float
	ExplodingEquipment ExplodingEquipmentType
	ExplosionResult    uint8
}

// NewDetonationPDUWithExplosion creates a Detonation PDU with explosion data
func NewDetonationPDUWithExplosion(firing, target EntityID, loc Vector3Float, explType ExplodingEquipmentType) *DetonationPDUExtended {
	return &DetonationPDUExtended{
		FiringEntityID:     firing,
		TargetEntityID:     target,
		Location:           loc,
		ExplodingEquipment: explType,
		ExplosionResult:     0,
	}
}

// =============================================================================
// Phase 2.1.10: Detonation PDU - Spatial Relationship of Munition to Target
// =============================================================================

// SpatialRelation describes the spatial relationship between munition and target
type SpatialRelation struct {
	MissDistance      float32
	MissDirectionAz   float32
	MissDirectionEl   float32
}

// MunitionTargetSpatial contains spatial data for munition-target relationship
type MunitionTargetSpatial struct {
	TargetLocation      Vector3Float
	MunitionLocation    Vector3Float
	SpatialRelation
}

// PackSpatialRelation packs spatial relation to bytes
func (s *MunitionTargetSpatial) Pack() []byte {
	buf := make([]byte, 28)
	offset := 0
	
	// Target location (12 bytes)
	offset += putFloat32(buf[offset:], s.TargetLocation.X)
	offset += putFloat32(buf[offset:], s.TargetLocation.Y)
	offset += putFloat32(buf[offset:], s.TargetLocation.Z)
	
	// Munition location (12 bytes)
	offset += putFloat32(buf[offset:], s.MunitionLocation.X)
	offset += putFloat32(buf[offset:], s.MunitionLocation.Y)
	offset += putFloat32(buf[offset:], s.MunitionLocation.Z)
	
	// Miss distance (4 bytes)
	offset += putFloat32(buf[offset:], s.MissDistance)
	
	return buf
}

// putFloat32 writes a float32 into bytes
func putFloat32(buf []byte, f float32) int {
	bits := math.Float32bits(f)
	buf[0] = byte(bits >> 24)
	buf[1] = byte(bits >> 16)
	buf[2] = byte(bits >> 8)
	buf[3] = byte(bits)
	return 4
}
