package jreap

import (
	"encoding/binary"
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
	binary.BigEndian.PutUint16(buf[0:2], trackNum)

	// Time (32 bits) - milliseconds since epoch
	ms := uint32(event.GetTimestamp().UnixMilli())
	binary.BigEndian.PutUint32(buf[2:6], ms)

	// Latitude (24 bits)
	lat := int32((event.GetLatitude() + 90.0) / 180.0 * float64(0xFFFFFF))
	binary.BigEndian.PutUint32(buf[6:9], uint32(lat)&0xFFFFFF)

	// Longitude (24 bits)
	lon := int32((event.GetLongitude() + 180.0) / 360.0 * float64(0xFFFFFF))
	binary.BigEndian.PutUint32(buf[9:12], uint32(lon)&0xFFFFFF)

	// Altitude (24 bits)
	alt := uint32(event.GetAltitude()) & 0xFFFFFF
	binary.BigEndian.PutUint32(buf[12:15], alt)

	// IR Intensity (16 bits)
	ir := uint16(event.GetIntensity() * 10)
	binary.BigEndian.PutUint16(buf[15:17], ir)

	return buf
}

// packTrackUpdate packs a Track into J3.0 format.
func (e *Encoder) packTrackUpdate(track TrackLike) []byte {
	buf := make([]byte, 21)

	binary.BigEndian.PutUint16(buf[0:2], track.GetTrackNumber())

	ms := uint32(track.GetLastUpdate().UnixMilli())
	binary.BigEndian.PutUint32(buf[2:6], ms)

	lat := int32((track.GetLatitude() + 90.0) / 180.0 * float64(0xFFFFFF))
	binary.BigEndian.PutUint32(buf[6:9], uint32(lat)&0xFFFFFF)

	lon := int32((track.GetLongitude() + 180.0) / 360.0 * float64(0xFFFFFF))
	binary.BigEndian.PutUint32(buf[9:12], uint32(lon)&0xFFFFFF)

	alt := uint32(track.GetAltitude()) & 0xFFFFFF
	binary.BigEndian.PutUint32(buf[12:15], alt)

	speed := uint16(track.GetSpeed() * 10)
	binary.BigEndian.PutUint16(buf[15:17], speed)

	heading := uint16(track.GetHeading() * 100)
	binary.BigEndian.PutUint16(buf[17:19], heading)

	buf[19] = trackStatusCode(track.GetStatus())
	buf[20] = uint8(track.GetThreatLevel())

	return buf
}

// packEngagementOrder packs an EngagementOrder into J4.0 format.
func (e *Encoder) packEngagementOrder(order EngagementOrderLike) []byte {
	buf := make([]byte, 15)

	orderHash := hashString(order.GetOrderID())
	binary.BigEndian.PutUint32(buf[0:4], orderHash)

	binary.BigEndian.PutUint16(buf[4:6], 0)

	buf[6] = uint8(order.GetPriority())
	buf[7] = weaponCode(order.GetWeaponSystem())

	tot := uint32(order.GetTimeOnTarget().UnixMilli())
	binary.BigEndian.PutUint32(buf[8:12], tot)

	prob := uint16(order.GetInterceptProb() * 10000)
	binary.BigEndian.PutUint16(buf[12:14], prob)

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
