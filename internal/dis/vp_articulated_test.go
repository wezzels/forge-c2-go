package dis

import (
	"bytes"
	"encoding/binary"
	"testing"
)

func TestArticulatedPartAnimation(t *testing.T) {
	ap := &ArticulatedPart{
		ChangeIndicator: 1,
		PartAttachedTo:  0,
		ParameterType:   ArticulatedTypeAzimuth,
		ParameterValue1: 45.0,
		ParameterValue2: 0,
	}

	vp := &ArticulatedPartVP{ArticulatedPart: *ap}
	buf := make([]byte, 20)
	n := PackVariableParameter(vp, buf)
	
	if n != 13 {
		t.Errorf("Expected 11 bytes, got %d", n)
	}
	if buf[0] != VPArticulatedPart {
		t.Errorf("Expected VP type 0, got %d", buf[0])
	}

	t.Logf("Articulated part packed: %02x (len=%d)", buf[:n], n)
}

func TestArticulatedPartsAnimationSequence(t *testing.T) {
	animations := []struct {
		azimuth float32
		rate    float32
	}{
		{0, 10},
		{45, 10},
		{90, 10},
		{90, 5},
		{90, -10},
		{0, -10},
	}

	for i, anim := range animations {
		ap := &ArticulatedPart{
			ChangeIndicator: 1,
			PartAttachedTo:  0,
			ParameterType:   ArticulatedTypeAzimuth,
			ParameterValue1: anim.azimuth,
			ParameterValue2: anim.rate,
		}

		vp := &ArticulatedPartVP{ArticulatedPart: *ap}
		buf := make([]byte, 20)
		n := PackVariableParameter(vp, buf)
		t.Logf("Frame %d: azimuth=%.1f, rate=%.1f, bytes=%02x (len=%d)", 
			i, anim.azimuth, anim.rate, buf[:n], n)
	}
}

func TestMultipleArticulatedParts(t *testing.T) {
	parts := []*ArticulatedPart{
		{1, 0, ArticulatedTypeAzimuth, 180, 0},
		{1, 1, ArticulatedTypeElevation, 30, 0},
		{1, 1, ArticulatedTypeXOffset, 2.5, 0},
	}

	for i, part := range parts {
		vp := &ArticulatedPartVP{ArticulatedPart: *part}
		buf := make([]byte, 20)
		n := PackVariableParameter(vp, buf)
		t.Logf("Part %d: VP type=%d, size=%d", i, buf[0], n)
	}
}

func TestAttachedPartsSimulation(t *testing.T) {
	attachedParts := []struct {
		name     string
		specific uint8
	}{
		{"External Fuel Tank", 128},
		{"Reactive Armor", 64},
		{"ERA Panel", 65},
	}

	for i, part := range attachedParts {
		ap := &AttachedPart{
			ChangeIndicator: 1,
			PartAttachedTo:  0,
			PartType: EntityType{
				Kind: 1, Domain: 1, Country: 225, Category: 1,
				Specific: part.specific,
			},
		}

		vp := &AttachedPartVP{AttachedPart: *ap}
		buf := make([]byte, 20)
		n := PackVariableParameter(vp, buf)
		t.Logf("Part %d (%s): %d bytes", i, part.name, n)
		if n != 11 {
			t.Errorf("Expected 11 bytes, got %d", n)
		}
	}
}

func TestVariableParameterSequence(t *testing.T) {
	var params []VariableParameter

	params = append(params, &ArticulatedPartVP{
		ArticulatedPart: ArticulatedPart{
			ChangeIndicator: 1, PartAttachedTo: 0,
			ParameterType: ArticulatedTypeAzimuth, ParameterValue1: 90,
		},
	})

	params = append(params, &AttachedPartVP{
		AttachedPart: AttachedPart{
			ChangeIndicator: 1, PartAttachedTo: 0,
			PartType: EntityType{Kind: 1, Domain: 1, Country: 225, Category: 1},
		},
	})

	var buf bytes.Buffer
	for _, vp := range params {
		tmp := make([]byte, 20)
		n := PackVariableParameter(vp, tmp)
		buf.Write(tmp[:n])
	}

	t.Logf("Packed %d variable parameters into %d bytes", len(params), buf.Len())
	// Articulated = 13 bytes (1 VP type + 12 data), Attached = 15 bytes (1 VP type + 14 data)
	if buf.Len() != 24 {
		t.Errorf("Expected 24 bytes, got %d", buf.Len())
	}
}

func packArticulatedPart(ap *ArticulatedPart, buf []byte) int {
	off := 0
	buf[off] = VPArticulatedPart
	off++
	buf[off] = ap.ChangeIndicator
	off++
	buf[off] = ap.PartAttachedTo
	off++
	binary.LittleEndian.PutUint16(buf[off:], uint16(ap.ParameterType))
	off += 2
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ap.ParameterValue1))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(ap.ParameterValue2))
	off += 4
	return off
}
