package dis

import (
	"testing"
)

func TestFuseType(t *testing.T) {
	ft := FuseTypeProximity
	packed := PackFuseType(ft)
	unpacked := UnpackFuseType(packed)
	if unpacked != ft {
		t.Errorf("FuseType: expected %d, got %d", ft, unpacked)
	}
	t.Logf("FuseType: %d -> %d bytes -> %d", ft, packed, unpacked)
}

func TestDetonationPDUExtended(t *testing.T) {
	pdu := NewDetonationPDUWithExplosion(
		EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 100},
		EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 200},
		Vector3Float{X: 100.0, Y: 200.0, Z: 300.0},
		ExplodingEquipmentFuel,
	)
	if pdu.ExplodingEquipment != ExplodingEquipmentFuel {
		t.Errorf("ExplodingEquipment: expected %d, got %d", ExplodingEquipmentFuel, pdu.ExplodingEquipment)
	}
	t.Logf("DetonationPDUExtended: equipment=%d", pdu.ExplodingEquipment)
}

func TestMunitionTargetSpatial(t *testing.T) {
	s := &MunitionTargetSpatial{
		TargetLocation:   Vector3Float{X: 100.0, Y: 200.0, Z: 300.0},
		MunitionLocation: Vector3Float{X: 105.0, Y: 198.0, Z: 295.0},
		SpatialRelation: SpatialRelation{
			MissDistance:    10.5,
			MissDirectionAz: 45.0,
		},
	}
	packed := s.Pack()
	if len(packed) != 28 {
		t.Errorf("Packed size: expected 28, got %d", len(packed))
	}
	t.Logf("MunitionTargetSpatial: packed to %d bytes", len(packed))
}
