package jseries

import (
	"time"
)

// J12Alert represents a J12 Alert / Notification message (equivalent to J2.0).
// Used for launch detection alerts, threat warnings, and time-critical notifications.
type J12Alert struct {
	AlertID        string    // alert identifier
	AlertType      uint8     // 8 bits: 1=LAUNCH_DETECTED, 2=THREAT_CONFIRMED, 3=ENGAGEMENT_ORDER, 4=INTERCEPT_COMPLETE, 5=SYSTEM_STATUS
	Severity       uint8     // 8 bits: 1-5 (1=LOW, 5=CRITICAL)
	Latitude       float64   // degrees
	Longitude      float64   // degrees
	Altitude       float64   // meters
	Speed          float64   // m/s (estimated)
	Heading        float64   // degrees
	TrackNumber    uint16    // associated track number
	ThreatLevel    uint8     // 8 bits: 1-5
	Classification uint8     // 8 bits: 1=SECRET, 2=TOP_SECRET, 3=TOP_SECRET//SCI
	SourceID       string    // originating system/sensor ID
	Timestamp      time.Time // alert generation time
}

// J12PayloadSize is the packed byte size of a J12 Alert message.
const J12PayloadSize = 39

// PackJ12Alert packs a J12 Alert message into buf.
func PackJ12Alert(a *J12Alert, buf []byte) {
	off := 0

	// Alert ID: first 12 bytes, null-padded
	for i := 0; i < 12; i++ {
		if i < len(a.AlertID) {
			buf[off] = a.AlertID[i]
		} else {
			buf[off] = 0
		}
		off++
	}

	buf[off] = a.AlertType; off++
	buf[off] = a.Severity; off++

	latP := PackLatitude(a.Latitude)
	lonP := PackLongitude(a.Longitude)
	PackUint32(latP, buf, off); off += 3
	PackUint32(lonP, buf, off); off += 3

	altP := uint32(a.Altitude)
	PackUint24(altP, buf, off); off += 3

	speedP := PackVelocity(a.Speed)
	PackUint16(speedP, buf, off); off += 2

	hdgP := uint16(a.Heading / 0.0057)
	PackUint16(hdgP, buf, off); off += 2

	PackUint16(a.TrackNumber, buf, off); off += 2
	buf[off] = a.ThreatLevel; off++
	buf[off] = a.Classification; off++

	// Source ID: first 8 bytes, null-padded
	for i := 0; i < 8; i++ {
		if i < len(a.SourceID) {
			buf[off] = a.SourceID[i]
		} else {
			buf[off] = 0
		}
		off++
	}

	ms := PackMilliseconds(a.Timestamp)
	PackUint32(ms, buf, off)
}

// UnpackJ12Alert unpacks a J12 Alert message from buf.
func UnpackJ12Alert(buf []byte) *J12Alert {
	if len(buf) < J12PayloadSize {
		return nil
	}
	a := &J12Alert{}
	off := 0

	id := make([]byte, 0, 12)
	for i := 0; i < 12; i++ {
		if buf[off] != 0 {
			id = append(id, buf[off])
		}
		off++
	}
	a.AlertID = string(id)

	a.AlertType = buf[off]; off++
	a.Severity = buf[off]; off++

	latP := UnpackUint24(buf, off); off += 3
	lonP := UnpackUint24(buf, off); off += 3
	a.Latitude = UnpackLatitude(latP)
	a.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off); off += 3
	a.Altitude = float64(altP)

	speedP := UnpackUint16(buf, off); off += 2
	a.Speed = UnpackVelocity(speedP)

	hdgP := UnpackUint16(buf, off); off += 2
	a.Heading = float64(hdgP) * 0.0057

	a.TrackNumber = UnpackUint16(buf, off); off += 2
	a.ThreatLevel = buf[off]; off++
	a.Classification = buf[off]; off++

	src := make([]byte, 0, 8)
	for i := 0; i < 8; i++ {
		if buf[off] != 0 {
			src = append(src, buf[off])
		}
		off++
	}
	a.SourceID = string(src)

	ms := UnpackUint32(buf, off)
	a.Timestamp = UnpackMilliseconds(ms)

	return a
}

// J12 alert type constants.
const (
	J12AlertLaunchDetected    = 1
	J12AlertThreatConfirmed   = 2
	J12AlertEngagementOrder   = 3
	J12AlertInterceptComplete = 4
	J12AlertSystemStatus      = 5
)

// J12 severity constants.
const (
	J12SeverityLow      = 1
	J12SeverityMedium   = 2
	J12SeverityHigh     = 3
	J12SeverityCritical  = 4
	J12SeverityExtreme   = 5
)
