package dis

import (
	"encoding/binary"
	"math"
)

// =============================================================================
// Phase 1.3.5: PPLI (Position Point Location Indicator) Variable Parameter
// =============================================================================

// VPPositionPointLocation is the variable parameter type for PPLI
const VPPositionPointLocation uint8 = 11

// PositionPointLocationIndicator provides precise entity position via variable parameter
type PositionPointLocationIndicator struct {
	ChangeIndicator     uint8    // 0=no change, 1=changed
	PositionEncodingType uint8    // 0=WorldCoordinates, 1=WorldCoordinates+Velocity
	Position            Vector3Double
	Orientation         EulerAngles
	Velocity            Vector3Float // Optional, present if PositionEncodingType==1
}

// PackPPLI packs a PPLI variable parameter
func PackPPLI(ppli *PositionPointLocationIndicator, buf []byte) int {
	off := 0
	buf[off] = VPPositionPointLocation
	off++
	buf[off] = ppli.ChangeIndicator
	off++
	buf[off] = ppli.PositionEncodingType
	off++

	// Position (24 bytes)
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(ppli.Position.X))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(ppli.Position.Y))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], math.Float64bits(ppli.Position.Z))
	off += 8

	// Orientation (12 bytes)
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ppli.Orientation.Phi))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ppli.Orientation.Theta))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ppli.Orientation.Psi))
	off += 4

	// Velocity if encoding type indicates it (12 bytes)
	if ppli.PositionEncodingType == 1 {
		binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ppli.Velocity.X))
		off += 4
		binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ppli.Velocity.Y))
		off += 4
		binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ppli.Velocity.Z))
		off += 4
	}

	return off
}

// PPLIBufferSize returns the packed size of a PPLI
func PPLIBufferSize(hasVelocity bool) int {
	if hasVelocity {
		return 3 + 24 + 12 + 12 // header + pos + orient + vel
	}
	return 3 + 24 + 12 // header + pos + orient
}

// =============================================================================
// Phase 2.1.6: Fire PDU Burst Descriptor for Area Fire
// =============================================================================

// BurstDescriptor describes the munitions burst for Fire PDU
type BurstDescriptor struct {
	MunitionType EntityType
	WarheadType  uint16
	FuseType     uint16
	Quantity     uint16
	BurstHeight  float32
	BurstWidth   float32
	BurstDepth   float32
}

// PackBurstDescriptor packs a burst descriptor
func (fd *BurstDescriptor) Pack(buf []byte) int {
	off := 0
	// MunitionType (8 bytes)
	buf[off] = fd.MunitionType.Kind
	off++
	buf[off] = fd.MunitionType.Domain
	off++
	binary.LittleEndian.PutUint16(buf[off:], fd.MunitionType.Country)
	off += 2
	buf[off] = fd.MunitionType.Category
	off++
	buf[off] = fd.MunitionType.Subcategory
	off++
	buf[off] = fd.MunitionType.Specific
	off++

	// Warhead and Fuse (4 bytes)
	binary.LittleEndian.PutUint16(buf[off:], fd.WarheadType)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], fd.FuseType)
	off += 2

	// Quantity and burst dimensions (14 bytes)
	binary.LittleEndian.PutUint16(buf[off:], fd.Quantity)
	off += 2
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(fd.BurstHeight))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(fd.BurstWidth))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(fd.BurstDepth))
	off += 4

	return off // 22 bytes total
}

// BurstDescriptorSize is the packed size
const BurstDescriptorSize = 22

// WarheadType constants (from SISO-STD-001)
const (
	WarheadHE       uint16 = 1
	WarheadArmor    uint16 = 2
	WarheadFragment uint16 = 3
	WarheadNuclear  uint16 = 4
	WarheadChem     uint16 = 5
	WarheadBio      uint16 = 6
	WarheadEMP      uint16 = 7
)

// FuseType constants
const (
	FuseImpact    uint16 = 1
	FuseTimed     uint16 = 2
	FuseProximity uint16 = 3
	FuseAltitude  uint16 = 4
)
