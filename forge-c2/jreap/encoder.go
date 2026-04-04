package jreap

import (
	"time"
)

// SensorEventLike is an interface for sensor events that can be JREAP-encoded.
type SensorEventLike interface {
	GetEventID() string
	GetTimestamp() time.Time
	GetSensorID() string
	GetLatitude() float64
	GetLongitude() float64
	GetAltitude() float64
	GetIntensity() float64
}

// TrackLike is an interface for tracks that can be JREAP-encoded.
type TrackLike interface {
	GetTrackID() string
	GetTrackNumber() uint16
	GetLatitude() float64
	GetLongitude() float64
	GetAltitude() float64
	GetSpeed() float64
	GetHeading() float64
	GetThreatLevel() int
	GetStatus() string
	GetLastUpdate() time.Time
	GetAssociations() []string
}

// EngagementOrderLike is an interface for engagement orders that can be JREAP-encoded.
type EngagementOrderLike interface {
	GetOrderID() string
	GetTrackID() string
	GetPriority() int
	GetWeaponSystem() string
	GetTimeOnTarget() time.Time
	GetInterceptProb() float64
	GetStatus() string
}

// Encoder handles JREAP-C encoding of FORGE messages.
type Encoder struct {
	nodeID        string
	applicationID string
}

// NewEncoder creates a new JREAP encoder.
func NewEncoder(nodeID, appID string) *Encoder {
	return &Encoder{
		nodeID:        nodeID,
		applicationID: appID,
	}
}

// EncodeSensorEvent encodes a SensorEvent as a JREAP J-series message.
// Returns the full JREAP message bytes (header + payload + CRC).
func (e *Encoder) EncodeSensorEvent(event SensorEventLike) ([]byte, error) {
	// Build J-series payload for J28 (Satellite/OPIR)
	payload := e.packOPIRMessage(event)

	// Encode as JREAP
	return EncodeFull(payload, uint8(J28_SatelliteOPIR), CRC16)
}

// EncodeTrack encodes a Track as a JREAP J-series message (J3.0).
func (e *Encoder) EncodeTrack(track TrackLike) ([]byte, error) {
	// Pack as J3.0 Track Update
	payload := e.packTrackUpdate(track)

	return EncodeFull(payload, uint8(J3_TrackUpdate), CRC16)
}

// EncodeEngagementOrder encodes an EngagementOrder as JREAP J-series (J6.0).
func (e *Encoder) EncodeEngagementOrder(order EngagementOrderLike) ([]byte, error) {
	// Pack as J4.0 Engagement Order
	payload := e.packEngagementOrder(order)

	return EncodeFull(payload, uint8(J4_EngagementOrder), CRC16)
}

// packOPIRMessage packs an OPIR/Sensor event into a simplified J18.x format.
func (e *Encoder) packOPIRMessage(event SensorEventLike) []byte {
	// J18.x simplified format (FORGE simulation)
	buf := make([]byte, 17)

	// TrackNumber (16 bits) - use sensor ID hash
	trackNum := uint16(hashString(event.GetSensorID()) & 0xFFFE)
	buf[0] = byte(trackNum >> 8)
	buf[1] = byte(trackNum)

	// Time (32 bits) - milliseconds since epoch
	ms := uint32(event.GetTimestamp().UnixMilli())
	buf[2] = byte(ms >> 24)
	buf[3] = byte(ms >> 16)
	buf[4] = byte(ms >> 8)
	buf[5] = byte(ms)

	// Latitude (24 bits) - scale -90 to 90 into 0 to 0xFFFFFF
	lat := int64((event.GetLatitude() + 90.0) / 180.0 * float64(0xFFFFFF))
	if lat < 0 {
		lat = 0
	} else if lat > 0xFFFFFF {
		lat = 0xFFFFFF
	}
	latVal := uint32(lat)
	buf[6] = byte(latVal >> 16)
	buf[7] = byte(latVal >> 8)
	buf[8] = byte(latVal)

	// Longitude (24 bits) - scale -180 to 180 into 0 to 0xFFFFFF
	lon := int64((event.GetLongitude() + 180.0) / 360.0 * float64(0xFFFFFF))
	if lon < 0 {
		lon = 0
	} else if lon > 0xFFFFFF {
		lon = 0xFFFFFF
	}
	lonVal := uint32(lon)
	buf[9] = byte(lonVal >> 16)
	buf[10] = byte(lonVal >> 8)
	buf[11] = byte(lonVal)

	// Altitude (24 bits)
	alt := uint32(event.GetAltitude()) & 0xFFFFFF
	buf[12] = byte(alt >> 16)
	buf[13] = byte(alt >> 8)
	buf[14] = byte(alt)

	// IR Intensity (16 bits)
	ir := uint16(event.GetIntensity() * 10)
	buf[15] = byte(ir >> 8)
	buf[16] = byte(ir)

	return buf
}

// packTrackUpdate packs a Track into J3.0 format.
func (e *Encoder) packTrackUpdate(track TrackLike) []byte {
	buf := make([]byte, 21)

	// TrackNumber (16 bits)
	tn := track.GetTrackNumber()
	buf[0] = byte(tn >> 8)
	buf[1] = byte(tn)

	// Time (32 bits)
	ms := uint32(track.GetLastUpdate().UnixMilli())
	buf[2] = byte(ms >> 24)
	buf[3] = byte(ms >> 16)
	buf[4] = byte(ms >> 8)
	buf[5] = byte(ms)

	// Latitude (24 bits)
	lat := int64((track.GetLatitude() + 90.0) / 180.0 * float64(0xFFFFFF))
	if lat < 0 {
		lat = 0
	} else if lat > 0xFFFFFF {
		lat = 0xFFFFFF
	}
	latVal := uint32(lat)
	buf[6] = byte(latVal >> 16)
	buf[7] = byte(latVal >> 8)
	buf[8] = byte(latVal)

	// Longitude (24 bits)
	lon := int64((track.GetLongitude() + 180.0) / 360.0 * float64(0xFFFFFF))
	if lon < 0 {
		lon = 0
	} else if lon > 0xFFFFFF {
		lon = 0xFFFFFF
	}
	lonVal := uint32(lon)
	buf[9] = byte(lonVal >> 16)
	buf[10] = byte(lonVal >> 8)
	buf[11] = byte(lonVal)

	// Altitude (24 bits)
	alt := uint32(track.GetAltitude()) & 0xFFFFFF
	buf[12] = byte(alt >> 16)
	buf[13] = byte(alt >> 8)
	buf[14] = byte(alt)

	// Speed (16 bits) - m/s, 0.1 m/s resolution
	speed := uint16(track.GetSpeed() * 10)
	buf[15] = byte(speed >> 8)
	buf[16] = byte(speed)

	// Heading (16 bits) - degrees, 0.01 degree resolution
	heading := uint16(track.GetHeading() * 100)
	buf[17] = byte(heading >> 8)
	buf[18] = byte(heading)

	// Status (8 bits)
	buf[19] = trackStatusCode(track.GetStatus())

	// Threat Level (8 bits)
	buf[20] = uint8(track.GetThreatLevel())

	return buf
}

// packEngagementOrder packs an EngagementOrder into J4.0 format.
func (e *Encoder) packEngagementOrder(order EngagementOrderLike) []byte {
	buf := make([]byte, 15)

	orderHash := hashString(order.GetOrderID())
	buf[0] = byte(orderHash >> 24)
	buf[1] = byte(orderHash >> 16)
	buf[2] = byte(orderHash >> 8)
	buf[3] = byte(orderHash)

	// Track Number placeholder (16 bits)
	buf[4] = 0
	buf[5] = 0

	// Priority (8 bits)
	buf[6] = uint8(order.GetPriority())

	// Weapon System (8 bits)
	buf[7] = weaponCode(order.GetWeaponSystem())

	// Time on Target (32 bits)
	tot := uint32(order.GetTimeOnTarget().UnixMilli())
	buf[8] = byte(tot >> 24)
	buf[9] = byte(tot >> 16)
	buf[10] = byte(tot >> 8)
	buf[11] = byte(tot)

	// Intercept Probability (16 bits)
	prob := uint16(order.GetInterceptProb() * 10000)
	buf[12] = byte(prob >> 8)
	buf[13] = byte(prob)

	// Status (8 bits)
	buf[14] = engagementStatusCode(order.GetStatus())

	return buf
}

// hashString computes a simple hash for IDs.
func hashString(s string) uint32 {
	h := uint32(2166136261)
	for _, c := range s {
		h ^= uint32(c)
		h *= 16777619
	}
	return h
}

// trackStatusCode encodes track status as a byte.
func trackStatusCode(status string) uint8 {
	switch status {
	case "NEW":
		return 0x01
	case "ACTIVE":
		return 0x02
	case "UPDATED":
		return 0x03
	case "DROPPED":
		return 0x04
	default:
		return 0x00
	}
}

// weaponCode encodes weapon system as a byte.
func weaponCode(weapon string) uint8 {
	switch weapon {
	case "GBI":
		return 0x01
	case "SM-3":
		return 0x02
	case "THAAD":
		return 0x03
	case "PATRIOT":
		return 0x04
	default:
		return 0x00
	}
}

// engagementStatusCode encodes engagement status as a byte.
func engagementStatusCode(status string) uint8 {
	switch status {
	case "PENDING":
		return 0x01
	case "LAUNCHED":
		return 0x02
	case "INTERCEPTED":
		return 0x03
	case "FAILED":
		return 0x04
	case "CANCELLED":
		return 0x05
	default:
		return 0x00
	}
}
