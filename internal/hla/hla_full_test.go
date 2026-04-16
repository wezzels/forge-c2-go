package hla

import (
	"testing"
)

func TestEntityCreationFull(t *testing.T) {
	entity := NewEntity(1, 2, 42)
	if entity == nil {
		t.Fatal("Expected non-nil entity")
	}
	if entity.EntityID.SiteNumber != 1 {
		t.Errorf("Expected SiteNumber=1, got %d", entity.EntityID.SiteNumber)
	}
	if entity.EntityID.ApplicationNumber != 2 {
		t.Errorf("Expected ApplicationNumber=2, got %d", entity.EntityID.ApplicationNumber)
	}
	if entity.EntityID.EntityNumber != 42 {
		t.Errorf("Expected EntityNumber=42, got %d", entity.EntityID.EntityNumber)
	}
}

func TestEntitySetLocationVelocityOrientation(t *testing.T) {
	entity := NewEntity(1, 1, 1)
	entity.SetLocation(38.0, -77.0, 10000)
	if entity.Position.X != 38.0 {
		t.Errorf("Expected X=38.0, got %f", entity.Position.X)
	}
	entity.SetVelocity(300, 0, 0)
	if entity.Velocity.X != 300 {
		t.Errorf("Expected VX=300, got %f", entity.Velocity.X)
	}
	entity.SetOrientation(0, 0, 180)
	if entity.Orientation.Psi != 180 {
		t.Errorf("Expected Psi=180, got %f", entity.Orientation.Psi)
	}
}

func TestPackUnpackEntityAttributesRoundtrip(t *testing.T) {
	entity := NewEntity(1, 2, 42)
	entity.SetLocation(33.75, -117.85, 10000)
	entity.SetVelocity(300, 0, 0)
	entity.ForceID = ForceOther

	buf := make([]byte, 1024)
	n := PackEntityAttributes(entity, buf)
	if n == 0 {
		t.Error("PackEntityAttributes returned 0 bytes")
	}

	got := UnpackEntityAttributes(buf[:n])
	if got == nil {
		t.Fatal("UnpackEntityAttributes returned nil")
	}
	if got.EntityID.SiteNumber != 1 {
		t.Errorf("Expected SiteNumber=1, got %d", got.EntityID.SiteNumber)
	}
	if got.EntityID.EntityNumber != 42 {
		t.Errorf("Expected EntityNumber=42, got %d", got.EntityID.EntityNumber)
	}
}

func TestPackHLAAttributeFull(t *testing.T) {
	data := []byte{0x01, 0x02, 0x03, 0x04}
	buf := make([]byte, 256)
	n := PackHLAAttribute(42, data, buf)
	if n == 0 {
		t.Error("PackHLAAttribute returned 0 bytes")
	}
}

func TestRTIGatewayCreation(t *testing.T) {
	rti := NewRTIGateway()
	if rti == nil {
		t.Fatal("Expected non-nil RTIGateway")
	}
}

func TestForceIdentifiers(t *testing.T) {
	tests := []struct {
		id   ForceIdentifier
		name string
	}{
		{ForceOther, "Other"},
		{ForceFriendly, "Friendly"},
		{ForceOther, "Hostile"},
		{ForceNeutral, "Neutral"},
	}
	for _, tt := range tests {
		if tt.id < 0 || tt.id > 3 {
			t.Errorf("ForceIdentifier %s has unexpected value %d", tt.name, tt.id)
		}
	}
}

func TestEntityType(t *testing.T) {
	et := EntityType{
		Kind:       1,
		Domain:     2,
		Country:    225,
		Category:   1,
		Subcategory: 1,
		Specific:   1,
	}
	if et.Kind != 1 {
		t.Errorf("Expected Kind=1, got %d", et.Kind)
	}
	if et.Country != 225 {
		t.Errorf("Expected Country=225, got %d", et.Country)
	}
}

func TestHLAEntityString(t *testing.T) {
	entity := NewEntity(1, 1, 1)
	s := entity.String()
	if s == "" {
		t.Error("Expected non-empty string representation")
	}
}

func TestMultipleEntityAttributes(t *testing.T) {
	for i := 0; i < 10; i++ {
		entity := NewEntity(1, 1, uint16(i+1))
		entity.SetLocation(float64(i)*10, float64(i)*-10, 1000)
		buf := make([]byte, 1024)
		n := PackEntityAttributes(entity, buf)
		if n == 0 {
			t.Errorf("PackEntityAttributes(%d) returned 0 bytes", i)
		}
		got := UnpackEntityAttributes(buf[:n])
		if got == nil {
			t.Errorf("UnpackEntityAttributes(%d) returned nil", i)
		}
	}
}

func TestPackUnpackHLAUpdateHeaderRoundtrip(t *testing.T) {
	buf := make([]byte, 256)
	PackHLAUpdateHeader(&HLAUpdateHeader{
		AttributeCount: 3,
	}, buf)
	got := UnpackHLAUpdateHeader(buf)
	if got == nil {
		t.Fatal("UnpackHLAUpdateHeader returned nil")
	}
	if got.AttributeCount != 3 {
		t.Errorf("Expected AttributeCount=3, got %d", got.AttributeCount)
	}
}