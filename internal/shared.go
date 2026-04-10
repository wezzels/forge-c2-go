package internal

import (
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// decodeForceType converts a J-series force type code to a string.
func decodeForceType(code uint8) string {
	switch code & 0x03 {
	case 1:
		return "FRIEND"
	case 2:
		return "HOSTILE"
	case 3:
		return "NEUTRAL"
	default:
		return "UNKNOWN"
	}
}

// qualityToFlags converts a jseries.QualityIndicator to mdpa quality flags.
func qualityToFlags(q jseries.QualityIndicator) uint8 {
	var flags uint8
	if q.Quality >= 1 {
		flags |= mdpa.QualityGood
	}
	if q.Derived {
		flags |= mdpa.QualityCorrelated
	}
	if q.Manual {
		flags |= mdpa.QualityGeomGood
	}
	if !q.Coasting {
		flags |= mdpa.QualityTimely
	}
	return flags
}
