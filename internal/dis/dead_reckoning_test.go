package dis

import (
	"math"
	"testing"
)

func TestDeadReckoningStatic(t *testing.T) {
	pos := [3]float64{100, 200, 300}
	vel := [3]float64{10, 20, 30}

	newPos := DeadReckoning(pos, vel, DRAlgorithmStatic, 1.0)

	if newPos != pos {
		t.Errorf("Static DR should not move: got %v, want %v", newPos, pos)
	}
}

func TestDeadReckoningVelocity(t *testing.T) {
	pos := [3]float64{0, 0, 0}
	vel := [3]float64{100, 200, 300}

	newPos := DeadReckoning(pos, vel, DRAlgorithmVF, 1.0)

	expected := [3]float64{100, 200, 300}
	for i := 0; i < 3; i++ {
		if math.Abs(newPos[i]-expected[i]) > 0.001 {
			t.Errorf("Position[%d]: got %f, want %f", i, newPos[i], expected[i])
		}
	}
}

func TestDeadReckoningVelocityWorld(t *testing.T) {
	pos := [3]float64{1000, 2000, 3000}
	vel := [3]float64{50, 100, 150}

	newPos := DeadReckoning(pos, vel, DRAlgorithmRPW, 2.0)

	expected := [3]float64{1100, 2200, 3300}
	for i := 0; i < 3; i++ {
		if math.Abs(newPos[i]-expected[i]) > 0.001 {
			t.Errorf("Position[%d]: got %f, want %f", i, newPos[i], expected[i])
		}
	}
}

func TestDeadReckoningOrientation(t *testing.T) {
	ori := [3]float64{0, 0, 0}
	angVel := [3]float64{0.1, 0.2, 0.3}

	newOri := DeadReckoningOrientation(ori, angVel, DRAlgorithmRPW, 1.0)

	for i := 0; i < 3; i++ {
		if math.Abs(newOri[i]-ori[i]-angVel[i]) > 0.001 {
			t.Errorf("Orientation[%d]: got %f, want %f", i, newOri[i], ori[i]+angVel[i])
		}
	}
}

func TestCalculateVelocityMagnitude(t *testing.T) {
	vel := [3]float64{3, 4, 0}
	mag := CalculateVelocityMagnitude(vel)

	if math.Abs(mag-5.0) > 0.001 {
		t.Errorf("Magnitude: got %f, want 5.0", mag)
	}
}
