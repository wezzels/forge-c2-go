package dis

import (
	"encoding/binary"
)

// Variable Parameter types for Entity State PDU
const (
	VPArticulatedPart uint8 = 0
	VPAuthoritativeammu uint8 = 1 // Note: misspelled per spec
	VPAttachedPart uint8 = 2
	VPArticulatedPoints uint8 = 3
)

// ArticulatedPart represents an articulated part of an entity (IEEE 1278.1)
type ArticulatedPart struct {
	ChangeIndicator  uint8           // 0=no change, 1=changed
	PartAttachedTo   uint8           // Index of parent part (0=base entity)
	ParameterType    ArticulatedType // Articulated/attached type
	ParameterValue1  float32         // Type-specific value 1
	ParameterValue2  float32         // Type-specific value 2
}

// ArticulatedType is the enumeration for articulated part types
type ArticulatedType uint16

// Common articulated types (from SISO-STD-001)
const (
	ArticulatedTypeAzimuth    ArticulatedType = 1
	ArticulatedTypeElevation  ArticulatedType = 2
	ArticulatedTypeRotation   ArticulatedType = 3
	ArticulatedTypeXOffset    ArticulatedType = 4
	ArticulatedTypeYOffset    ArticulatedType = 5
	ArticulatedTypeZOffset    ArticulatedType = 6
	ArticulatedTypeXRate      ArticulatedType = 7
	ArticulatedTypeYRate      ArticulatedType = 8
	ArticulatedTypeZRate      ArticulatedType = 9
)

// AttachedPart represents an attached part to an entity
type AttachedPart struct {
	ChangeIndicator uint8      // 0=no change, 1=changed
	PartAttachedTo  uint8      // Index (0=base entity)
	PartType        EntityType // Entity type of attached part
}

// VariableParameter is a union type for VP
type VariableParameter interface {
	VPType() uint8
}

// ArticulatedPartVP implements VariableParameter for articulated parts
type ArticulatedPartVP struct {
	ArticulatedPart ArticulatedPart
}

func (v *ArticulatedPartVP) VPType() uint8 { return VPArticulatedPart }

// AttachedPartVP implements VariableParameter for attached parts
type AttachedPartVP struct {
	AttachedPart AttachedPart
}

func (v *AttachedPartVP) VPType() uint8 { return VPAttachedPart }

// PackVariableParameter packs a variable parameter into buf
// Returns the number of bytes written
func PackVariableParameter(vp VariableParameter, buf []byte) int {
	off := 0

	switch v := vp.(type) {
	case *ArticulatedPartVP:
		buf[off] = VPArticulatedPart
		off++
		buf[off] = v.ArticulatedPart.ChangeIndicator
		off++
		buf[off] = v.ArticulatedPart.PartAttachedTo
		off++
		binary.LittleEndian.PutUint16(buf[off:], uint16(v.ArticulatedPart.ParameterType))
		off += 2
		bits1 := float32ToBits(v.ArticulatedPart.ParameterValue1)
		binary.LittleEndian.PutUint32(buf[off:], bits1)
		off += 4
		bits2 := float32ToBits(v.ArticulatedPart.ParameterValue2)
		binary.LittleEndian.PutUint32(buf[off:], bits2)
		off += 4
		return off // 12 bytes total

	case *AttachedPartVP:
		buf[off] = VPAttachedPart
		off++
		buf[off] = v.AttachedPart.ChangeIndicator
		off++
		buf[off] = v.AttachedPart.PartAttachedTo
		off++
		// Pack EntityType (8 bytes)
		buf[off] = v.AttachedPart.PartType.Kind
		off++
		buf[off] = v.AttachedPart.PartType.Domain
		off++
		binary.LittleEndian.PutUint16(buf[off:], v.AttachedPart.PartType.Country)
		off += 2
		buf[off] = v.AttachedPart.PartType.Category
		off++
		buf[off] = v.AttachedPart.PartType.Subcategory
		off++
		buf[off] = v.AttachedPart.PartType.Specific
		off++
		buf[off] = v.AttachedPart.PartType.Extra1
		off++
		return off // 13 bytes total
	}

	return 0
}

// UnpackVariableParameter unpacks a variable parameter from buf
func UnpackVariableParameter(buf []byte) (VariableParameter, int) {
	if len(buf) < 1 {
		return nil, 0
	}

	vpType := buf[0]
	off := 1

	switch vpType {
	case VPArticulatedPart:
		if len(buf) < 12 {
			return nil, 0
		}
		vp := &ArticulatedPartVP{}
		vp.ArticulatedPart.ChangeIndicator = buf[off]
		off++
		vp.ArticulatedPart.PartAttachedTo = buf[off]
		off++
		vp.ArticulatedPart.ParameterType = ArticulatedType(binary.LittleEndian.Uint16(buf[off:]))
		off += 2
		bits1 := binary.LittleEndian.Uint32(buf[off:])
		vp.ArticulatedPart.ParameterValue1 = bitsToFloat32(bits1)
		off += 4
		bits2 := binary.LittleEndian.Uint32(buf[off:])
		vp.ArticulatedPart.ParameterValue2 = bitsToFloat32(bits2)
		off += 4
		return vp, off

	case VPAttachedPart:
		if len(buf) < 13 {
			return nil, 0
		}
		vp := &AttachedPartVP{}
		vp.AttachedPart.ChangeIndicator = buf[off]
		off++
		vp.AttachedPart.PartAttachedTo = buf[off]
		off++
		vp.AttachedPart.PartType.Kind = buf[off]
		off++
		vp.AttachedPart.PartType.Domain = buf[off]
		off++
		vp.AttachedPart.PartType.Country = binary.LittleEndian.Uint16(buf[off:])
		off += 2
		vp.AttachedPart.PartType.Category = buf[off]
		off++
		vp.AttachedPart.PartType.Subcategory = buf[off]
		off++
		vp.AttachedPart.PartType.Specific = buf[off]
		off++
		vp.AttachedPart.PartType.Extra1 = buf[off]
		off++
		return vp, off
	}

	return nil, off
}

// float32ToBits converts float32 to its bit representation

// bitsToFloat32 converts bit representation back to float32
