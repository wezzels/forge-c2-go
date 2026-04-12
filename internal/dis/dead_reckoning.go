package dis

import (
	"math"
)

// DeadReckoningParameters for entity state PDU.
type DeadReckoningParameters struct {
	LinearVelocity  [3]float64
	AngularVelocity [3]float64
	Parameters      [15]float64
}

// DeadReckoning calculates entity position using DIS dead reckoning.
// algo: DRAlgorithmStatic, DRAlgorithmFPW, DRAlgorithmVF, DRAlgorithmRPW, etc.
func DeadReckoning(pos [3]float64, vel [3]float64, algo uint8, timeDelta float64) [3]float64 {
	var newPos [3]float64

	switch algo {
	case DRAlgorithmStatic:
		newPos = pos

	case DRAlgorithmFPW, DRAlgorithmFPWRPW, DRAlgorithmFPWRVB, DRAlgorithmFPVFPW:
		newPos = pos

	case DRAlgorithmVF, DRAlgorithmVFVB, DRAlgorithmRPW:
		for i := 0; i < 3; i++ {
			newPos[i] = pos[i] + vel[i]*timeDelta
		}

	case DRAlgorithmRPV, DRAlgorithmFPVRPB, DRAlgorithmFPVRPW, DRAlgorithmRPVRVB:
		for i := 0; i < 3; i++ {
			newPos[i] = pos[i] + vel[i]*timeDelta
		}

	default:
		for i := 0; i < 3; i++ {
			newPos[i] = pos[i] + vel[i]*timeDelta
		}
	}

	return newPos
}

// DeadReckoningOrientation calculates entity orientation.
func DeadReckoningOrientation(orientation [3]float64, angularVel [3]float64, algo uint8, timeDelta float64) [3]float64 {
	var newOri [3]float64

	switch algo {
	case DRAlgorithmStatic, DRAlgorithmFPW, DRAlgorithmVF:
		newOri = orientation

	case DRAlgorithmRPW, DRAlgorithmRPV, DRAlgorithmRPVRVB, DRAlgorithmFPVRPB, DRAlgorithmFPVRPW:
		for i := 0; i < 3; i++ {
			newOri[i] = orientation[i] + angularVel[i]*timeDelta
		}

	default:
		newOri = orientation
	}

	return newOri
}

// CalculateVelocityMagnitude calculates speed from velocity vector.
func CalculateVelocityMagnitude(vel [3]float64) float64 {
	return math.Sqrt(vel[0]*vel[0] + vel[1]*vel[1] + vel[2]*vel[2])
}
