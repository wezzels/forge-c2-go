package mdpa

import (
	"fmt"
)

// FORGETrackExtension contains FORGE-specific extensions to the standard
// Link 16 track message. These fields capture OPIR (Overhead Persistent
// Infrared) sensor-specific data that is not part of the standard J-series
// message definitions but is required for FORGE missile defense processing.
//
// The fields in this struct are primarily derived from satellite-based
// infrared sensors (SBIRS, Next Gen OPIR) and provide additional track
// characterization beyond what Link 16 natively supports.
type FORGETrackExtension struct {
	// SatelliteID identifies the specific satellite/sensor that produced
	// this track. Format: "SBIRS-GEO-X", "NG-OPIR-X", or similar.
	SatelliteID string

	// SensorMode describes the operational mode of the sensor at the time
	// of detection. Valid values:
	//   - "STARE": Fixed stare mode, high sensitivity
	//   - "SURVEIL": Wide-area surveillance mode
	//   - "TRACK": Dedicated tracking mode
	//   - "SEARCH": Search mode
	SensorMode string

	// IRIntensity is the measured infrared intensity in Kelvin (K).
	// This represents the apparent blackbody temperature of the target
	// in the MWIR (Mid-Wave IR) or LWIR (Long-Wave IR) band.
	// Typical values:
	//   - Booster phase: 3000-5000 K
	//   - Midcourse: 1000-2000 K
	//   - Reentry: 2000-3000 K
	IRIntensity float64

	// BackgroundTemp is the estimated background/cold-space temperature
	// in Kelvin at the time of detection. Used for contrast calculation.
	// Typical value: ~100 K (cold space)
	BackgroundTemp float64

	// DetectionConfidence is the calculated probability of detection (Pd)
	// for this track, expressed as a value between 0.0 and 1.0.
	// This is NOT the same as track accuracy/confidence.
	// Typical: 0.7-0.99 for a valid detection
	DetectionConfidence float64

	// FalseAlarmRate is the estimated false alarm rate in false alarms
	// per hour (FA/h). Used for track quality assessment.
	// Lower is better. Good tracks typically have FAR < 0.1 FA/h.
	FalseAlarmRate float64

	// TrackQualityScore is an overall track quality metric (0-100) used
	// by FORGE for track selection and prioritization. Combines detection
	// confidence, FAR, geometric factors, and kinematic consistency.
	TrackQualityScore int

	// LaunchEvent indicates if this track is associated with a missile
	// launch event (bright rocket motor plume).
	LaunchEvent bool

	// BoostPhase indicates if the track is currently in boost phase.
	// Boost phase tracks have distinctive kinematic signatures.
	BoostPhase bool
}

// SensorMode constants
const (
	SensorModeStare  = "STARE"
	SensorModeSurveil = "SURVEIL"
	SensorModeTrack   = "TRACK"
	SensorModeSearch  = "SEARCH"
)

// NewFORGETrackExtension creates a new FORGETrackExtension with default values.
func NewFORGETrackExtension(satelliteID, sensorMode string) *FORGETrackExtension {
	return &FORGETrackExtension{
		SatelliteID:     satelliteID,
		SensorMode:      sensorMode,
		IRIntensity:     0, // Unknown
		BackgroundTemp:  100, // Cold space default
		DetectionConfidence: 0.5, // Default to 50%
		FalseAlarmRate:  1.0, // Default to 1 FA/h (acceptable)
		TrackQualityScore: 50, // Default to mid-range
		LaunchEvent:     false,
		BoostPhase:      false,
	}
}

// IsValidSensorMode returns true if the sensor mode is valid.
func IsValidSensorMode(mode string) bool {
	switch mode {
	case SensorModeStare, SensorModeSurveil, SensorModeTrack, SensorModeSearch:
		return true
	default:
		return false
	}
}

// IRContrast calculates the IR contrast ratio (target vs background).
func (f *FORGETrackExtension) IRContrast() float64 {
	if f.BackgroundTemp <= 0 {
		return 0
	}
	return (f.IRIntensity - f.BackgroundTemp) / f.BackgroundTemp
}

// String implements fmt.Stringer for FORGETrackExtension.
func (f *FORGETrackExtension) String() string {
	boostStr := ""
	if f.BoostPhase {
		boostStr = " BOOST"
	}
	launchStr := ""
	if f.LaunchEvent {
		launchStr = " LAUNCH"
	}
	return fmt.Sprintf("FORGE[Sat=%s Mode=%s IR=%.1fK BG=%.1fK Pd=%.2f FAR=%.3f Q=%d%s%s]",
		f.SatelliteID, f.SensorMode, f.IRIntensity, f.BackgroundTemp,
		f.DetectionConfidence, f.FalseAlarmRate, f.TrackQualityScore,
		boostStr, launchStr)
}

// Validate checks if the track extension has valid values.
func (f *FORGETrackExtension) Validate() error {
	if f.SatelliteID == "" {
		return fmt.Errorf("SatelliteID is required for FORGE tracks")
	}
	if !IsValidSensorMode(f.SensorMode) {
		return fmt.Errorf("invalid SensorMode: %s", f.SensorMode)
	}
	if f.IRIntensity < 0 {
		return fmt.Errorf("IRIntensity cannot be negative")
	}
	if f.BackgroundTemp < 0 {
		return fmt.Errorf("BackgroundTemp cannot be negative")
	}
	if f.DetectionConfidence < 0 || f.DetectionConfidence > 1 {
		return fmt.Errorf("DetectionConfidence must be between 0 and 1")
	}
	if f.FalseAlarmRate < 0 {
		return fmt.Errorf("FalseAlarmRate cannot be negative")
	}
	if f.TrackQualityScore < 0 || f.TrackQualityScore > 100 {
		return fmt.Errorf("TrackQualityScore must be between 0 and 100")
	}
	return nil
}

// EstimateThreatCategory returns an estimated threat category based on
// IR characteristics. This is for display/advisory purposes only.
func (f *FORGETrackExtension) EstimateThreatCategory() string {
	switch {
	case f.BoostPhase:
		return "BALLISTIC_MISSILE_BOOST"
	case f.IRIntensity > 3000:
		return "POSSIBLE_LAUNCH"
	case f.IRIntensity > 2000:
		return "REENTRY_VEHICLE_CANDIDATE"
	case f.IRIntensity > 1000:
		return "MIDCOURSE_OBJECT"
	default:
		return "UNKNOWN"
	}
}
