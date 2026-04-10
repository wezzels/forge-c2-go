package jreap

import (
	"fmt"
	"time"
)

// ComplianceReport holds the result of a message compliance check.
type ComplianceReport struct {
	Valid       bool // true if all checks passed
	MessageType MessageType
	Errors      []string // list of validation failures
	Warnings    []string // non-critical issues
	CheckedAt   time.Time
}

// FieldViolation records a single field that failed validation.
type FieldViolation struct {
	Field  string
	Value  interface{}
	Reason string
}

// ValidateJ3 validates a J3.0 Track Update message against MIL-STD-6016 requirements.
func ValidateJ3(trackNum uint16, lat, lon, alt, speed, heading float64) *ComplianceReport {
	r := &ComplianceReport{MessageType: J3_TrackUpdate, CheckedAt: time.Now()}

	if trackNum > 0xFFFE {
		r.Errors = append(r.Errors, "TrackNumber must be 0-65534")
	}
	if lat < -90 || lat > 90 {
		r.Errors = append(r.Errors, fmt.Sprintf("Latitude out of range [-90,90]: %f", lat))
	}
	if lon < -180 || lon > 180 {
		r.Errors = append(r.Errors, fmt.Sprintf("Longitude out of range [-180,180]: %f", lon))
	}
	if alt < 0 || alt > 16_777_215 {
		r.Errors = append(r.Errors, fmt.Sprintf("Altitude out of NIPO range [0,16777215]m: %f", alt))
	}
	if speed < 0 || speed > 65_535 {
		r.Warnings = append(r.Warnings, fmt.Sprintf("Speed %.1f m/s exceeds Link 16 max (6553.5 m/s) or negative", speed))
	}
	if heading < 0 || heading > 360 {
		r.Errors = append(r.Errors, fmt.Sprintf("Heading out of range [0,360]: %f", heading))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateJ4 validates a J4.0 Engagement Order message.
func ValidateJ4(priority int, prob float64, weapon string) *ComplianceReport {
	r := &ComplianceReport{MessageType: J4_EngagementOrder, CheckedAt: time.Now()}

	if priority < 1 || priority > 5 {
		r.Errors = append(r.Errors, fmt.Sprintf("Priority must be 1-5, got %d", priority))
	}
	if prob < 0 || prob > 1 {
		r.Errors = append(r.Errors, fmt.Sprintf("Intercept probability must be [0,1], got %f", prob))
	}
	if !validWeapon(weapon) {
		r.Warnings = append(r.Warnings, fmt.Sprintf("Unknown weapon system: %s", weapon))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateJ2 validates a J2 Surveillance message.
func ValidateJ2(trackNum uint16, lat, lon, alt float64) *ComplianceReport {
	r := &ComplianceReport{MessageType: J2_Surveillance, CheckedAt: time.Now()}

	if trackNum > 0xFFFE {
		r.Errors = append(r.Errors, "TrackNumber must be 0-65534")
	}
	if lat < -90 || lat > 90 {
		r.Errors = append(r.Errors, fmt.Sprintf("Latitude out of range [-90,90]: %f", lat))
	}
	if lon < -180 || lon > 180 {
		r.Errors = append(r.Errors, fmt.Sprintf("Longitude out of range [-180,180]: %f", lon))
	}
	if alt < 0 || alt > 16_777_215 {
		r.Errors = append(r.Errors, fmt.Sprintf("Altitude out of NIPO range: %f", alt))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateJ5 validates a J5 Engagement Status message.
func ValidateJ5(stage, result uint8) *ComplianceReport {
	r := &ComplianceReport{MessageType: J5_EngagementStatus, CheckedAt: time.Now()}

	if stage < 1 || stage > 6 {
		r.Errors = append(r.Errors, fmt.Sprintf("EngagementStage must be 1-6, got %d", stage))
	}
	if result > 5 {
		r.Errors = append(r.Errors, fmt.Sprintf("InterceptResult must be 0-5, got %d", result))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateJ6 validates a J6 Sensor Registration message.
func ValidateJ6(sensorType, platformType, status uint8, lat, lon, maxRange float64) *ComplianceReport {
	r := &ComplianceReport{MessageType: J6_SensorRegistration, CheckedAt: time.Now()}

	if sensorType < 1 || sensorType > 4 {
		r.Errors = append(r.Errors, fmt.Sprintf("SensorType must be 1-4, got %d", sensorType))
	}
	if platformType < 1 || platformType > 4 {
		r.Errors = append(r.Errors, fmt.Sprintf("PlatformType must be 1-4, got %d", platformType))
	}
	if status < 1 || status > 3 {
		r.Errors = append(r.Errors, fmt.Sprintf("Status must be 1-3, got %d", status))
	}
	if lat < -90 || lat > 90 {
		r.Errors = append(r.Errors, fmt.Sprintf("Latitude out of range: %f", lat))
	}
	if lon < -180 || lon > 180 {
		r.Errors = append(r.Errors, fmt.Sprintf("Longitude out of range: %f", lon))
	}
	if maxRange < 0 || maxRange > 65_535 {
		r.Warnings = append(r.Warnings, fmt.Sprintf("MaxRange %.1f km exceeds 16-bit range", maxRange))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateJ12 validates a J12 Alert message.
func ValidateJ12(alertType, severity uint8, lat, lon float64) *ComplianceReport {
	r := &ComplianceReport{MessageType: J12_Alert, CheckedAt: time.Now()}

	if alertType < 1 || alertType > 5 {
		r.Errors = append(r.Errors, fmt.Sprintf("AlertType must be 1-5, got %d", alertType))
	}
	if severity < 1 || severity > 5 {
		r.Errors = append(r.Errors, fmt.Sprintf("Severity must be 1-5, got %d", severity))
	}
	if lat < -90 || lat > 90 {
		r.Errors = append(r.Errors, fmt.Sprintf("Latitude out of range: %f", lat))
	}
	if lon < -180 || lon > 180 {
		r.Errors = append(r.Errors, fmt.Sprintf("Longitude out of range: %f", lon))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateJ28 validates a J28 Space Track message.
func ValidateJ28(trackNum uint16, lat, lon, alt, ir, bgTemp float64) *ComplianceReport {
	r := &ComplianceReport{MessageType: J28_SatelliteOPIR, CheckedAt: time.Now()}

	if trackNum > 0xFFFE {
		r.Errors = append(r.Errors, "TrackNumber must be 0-65534")
	}
	// Space tracks: lat/lon can exceed normal range for ground tracks in some specs
	// but we'll use normal bounds for now
	if lat < -90 || lat > 90 {
		r.Errors = append(r.Errors, fmt.Sprintf("Latitude out of range: %f", lat))
	}
	if lon < -180 || lon > 180 {
		r.Errors = append(r.Errors, fmt.Sprintf("Longitude out of range: %f", lon))
	}
	if alt < 0 {
		r.Errors = append(r.Errors, fmt.Sprintf("Altitude cannot be negative: %f", alt))
	}
	if ir < 0 {
		r.Errors = append(r.Errors, fmt.Sprintf("IR intensity cannot be negative: %f", ir))
	}
	if bgTemp < 0 || bgTemp > 500 {
		r.Warnings = append(r.Warnings, fmt.Sprintf("Background temp %.1f K unusual (expected ~3-50 K for space)", bgTemp))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// ValidateHeader checks that a JREAP-C header is well-formed.
func ValidateHeader(protocolFlags uint16, msgType uint8, length uint32) *ComplianceReport {
	r := &ComplianceReport{CheckedAt: time.Now()}

	if protocolFlags != ProtocolJREAPC {
		r.Errors = append(r.Errors, fmt.Sprintf("Invalid JREAP-C protocol flags: expected 0x0001, got 0x%04X", protocolFlags))
	}
	if length > MaxMessageSize {
		r.Errors = append(r.Errors, fmt.Sprintf("Payload length %d exceeds maximum %d", length, MaxMessageSize))
	}

	r.Valid = len(r.Errors) == 0
	return r
}

// validWeapon checks if a weapon system code is recognized.
func validWeapon(w string) bool {
	switch w {
	case "GBI", "SM-3", "SM-6", "THAAD", "PATRIOT", "AEGIS", "IRON_DOME":
		return true
	}
	return false
}
