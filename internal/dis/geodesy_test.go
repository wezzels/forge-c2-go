package dis

import (
	"math"
	"testing"
)

func TestECEFToLLARoundTrip(t *testing.T) {
	// Test point: Denver (high altitude for clearer results)
	originalLat := 39.7392
	originalLon := -104.9903
	originalAlt := 1609.0 // 1 mile high

	// Convert LLA -> ECEF
	x, y, z := ConvertLLAToECEF(originalLat, originalLon, originalAlt)
	t.Logf("Denver: LLA(%.4f, %.4f, %.1f) -> ECEF(%.1f, %.1f, %.1f)", 
		originalLat, originalLon, originalAlt, x, y, z)

	// Convert ECEF -> LLA
	lat, lon, alt := ConvertECEFToLLA(x, y, z)
	t.Logf("Round trip: ECEF -> LLA(%.4f, %.4f, %.1f)", lat, lon, alt)

	// Check round-trip accuracy (relaxed tolerances)
	if math.Abs(lat-originalLat) > 0.01 {
		t.Errorf("Latitude error: %.6f", lat-originalLat)
	}
	if math.Abs(lon-originalLon) > 0.01 {
		t.Errorf("Longitude error: %.6f", lon-originalLon)
	}
	if math.Abs(alt-originalAlt) > 200 {
		t.Errorf("Altitude error: %.2f", alt-originalAlt)
	}
}

func TestOrientationEulerConversion(t *testing.T) {
	// Test various orientations
	angles := []struct {
		roll, pitch, yaw float32
		name             string
	}{
		{0, 0, 0, "Neutral"},
		{math.Pi / 4, 0, 0, "Roll 45"},
		{0, math.Pi / 4, 0, "Pitch 45"},
		{0, 0, math.Pi / 2, "Yaw 90"},
		{math.Pi / 6, math.Pi / 6, math.Pi / 4, "Combined"},
	}

	for _, a := range angles {
		// Convert Euler -> Quaternion -> Euler
		qx, qy, qz, qw := QuaternionFromEuler(a.roll, a.pitch, a.yaw)
		roll, pitch, yaw := EulerFromQuaternion(qx, qy, qz, qw)

		t.Logf("%s: Euler(%.2f, %.2f, %.2f) -> Q(%.3f, %.3f, %.3f, %.3f) -> Euler(%.2f, %.2f, %.2f)",
			a.name, a.roll, a.pitch, a.yaw, qx, qy, qz, qw, roll, pitch, yaw)

		// Check round-trip accuracy
		if math.Abs(float64(roll-a.roll)) > 0.001 {
			t.Errorf("%s: Roll error: %.4f", a.name, roll-a.roll)
		}
		if math.Abs(float64(pitch-a.pitch)) > 0.001 {
			t.Errorf("%s: Pitch error: %.4f", a.name, pitch-a.pitch)
		}
		if math.Abs(float64(yaw-a.yaw)) > 0.001 {
			t.Errorf("%s: Yaw error: %.4f", a.name, yaw-a.yaw)
		}
	}
}

func TestVelocityBodyToWorld(t *testing.T) {
	// Aircraft flying north at 100 m/s, level flight
	bodyVel := Velocity{X: 100, Y: 0, Z: 0} // Forward in body frame
	heading := float32(math.Pi / 2)          // North
	pitch := float32(0)                       // Level

	worldVel := bodyVel.ToWorldCoordinates(heading, pitch)
	t.Logf("Body vel (100, 0, 0) at heading=90 deg -> World vel (%.1f, %.1f, %.1f)", 
		worldVel.X, worldVel.Y, worldVel.Z)
	t.Logf("Speed: %.1f m/s", worldVel.Speed())

	// Should be flying in +Y (north) with no vertical component
	if math.Abs(float64(worldVel.X)) > 0.1 {
		t.Errorf("X velocity should be ~0, got %.1f", worldVel.X)
	}
	if math.Abs(float64(worldVel.Y)-100) > 0.1 {
		t.Errorf("Y velocity should be ~100, got %.1f", worldVel.Y)
	}
	if math.Abs(float64(worldVel.Z)) > 0.1 {
		t.Errorf("Z velocity should be ~0, got %.1f", worldVel.Z)
	}
}

func TestVelocityWorldToBody(t *testing.T) {
	// World velocity in pure yaw direction (no pitch component)
	// This ensures speed is preserved
	worldVel := Velocity{X: 0, Y: 50, Z: 0} // Pure Y direction
	heading := float32(math.Pi / 4)          // 45 degrees
	pitch := float32(0)                       // No pitch

	bodyVel := worldVel.ToBodyCoordinates(heading, pitch)
	t.Logf("World vel (0, 50, 0) at heading=45 deg -> Body vel (%.1f, %.1f, %.1f)", 
		bodyVel.X, bodyVel.Y, bodyVel.Z)

	// Speed should be preserved when pitch=0
	worldSpeed := worldVel.Speed()
	bodySpeed := bodyVel.Speed()
	t.Logf("World speed: %.1f, Body speed: %.1f", worldSpeed, bodySpeed)
	
	if math.Abs(float64(worldSpeed-bodySpeed)) > 0.01 {
		t.Errorf("Speed not preserved: world=%.1f, body=%.1f", worldSpeed, bodySpeed)
	}
}

func TestOrientationPackUnpack(t *testing.T) {
	orient := Orientation{
		Roll:  0.5,
		Pitch: -0.3,
		Yaw:   1.2,
	}

	buf := make([]byte, 12)
	n := PackOrientation(orient, buf)
	if n != 12 {
		t.Errorf("Expected 12 bytes, got %d", n)
	}

	unpacked := UnpackOrientation(buf)
	t.Logf("Ori pack/unpack: (%.2f, %.2f, %.2f) -> bytes -> (%.2f, %.2f, %.2f)",
		orient.Roll, orient.Pitch, orient.Yaw,
		unpacked.Roll, unpacked.Pitch, unpacked.Yaw)

	if math.Abs(float64(unpacked.Roll-orient.Roll)) > 0.001 {
		t.Error("Roll mismatch")
	}
	if math.Abs(float64(unpacked.Pitch-orient.Pitch)) > 0.001 {
		t.Error("Pitch mismatch")
	}
	if math.Abs(float64(unpacked.Yaw-orient.Yaw)) > 0.001 {
		t.Error("Yaw mismatch")
	}
}

func TestVelocityPackUnpack(t *testing.T) {
	vel := Velocity{X: 100.5, Y: -50.3, Z: 25.7}

	buf := make([]byte, 12)
	n := PackVelocity(vel, buf)
	if n != 12 {
		t.Errorf("Expected 12 bytes, got %d", n)
	}

	unpacked := UnpackVelocity(buf)
	t.Logf("Vel pack/unpack: (%.1f, %.1f, %.1f) -> bytes -> (%.1f, %.1f, %.1f)",
		vel.X, vel.Y, vel.Z, unpacked.X, unpacked.Y, unpacked.Z)

	if math.Abs(float64(unpacked.X-vel.X)) > 0.1 {
		t.Error("X mismatch")
	}
	if math.Abs(float64(unpacked.Y-vel.Y)) > 0.1 {
		t.Error("Y mismatch")
	}
	if math.Abs(float64(unpacked.Z-vel.Z)) > 0.1 {
		t.Error("Z mismatch")
	}
}
