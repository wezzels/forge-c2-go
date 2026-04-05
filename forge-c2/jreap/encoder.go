package jreap

import (
	"time"

	"forge-c2/jreap/jseries"
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

// EncodeSensorEvent encodes a SensorEvent as a JREAP J-series message (J28).
// Returns the full JREAP message bytes (header + payload + CRC).
func (e *Encoder) EncodeSensorEvent(event SensorEventLike) ([]byte, error) {
	payload := e.packOPIRMessage(event)
	return EncodeFull(payload, uint8(J28_SatelliteOPIR), CRC16)
}

// EncodeTrack encodes a Track as a JREAP J3.0 Track Update message.
func (e *Encoder) EncodeTrack(track TrackLike) ([]byte, error) {
	payload := e.packTrackUpdate(track)
	return EncodeFull(payload, uint8(J3_TrackUpdate), CRC16)
}

// EncodeEngagementOrder encodes an EngagementOrder as a JREAP J4.0 Engagement Order message.
func (e *Encoder) EncodeEngagementOrder(order EngagementOrderLike) ([]byte, error) {
	payload := e.packEngagementOrder(order)
	return EncodeFull(payload, uint8(J4_EngagementOrder), CRC16)
}

// EncodeJ2 encodes a J2 Surveillance message (new track detection).
func (e *Encoder) EncodeJ2(j2 *jseries.J2Surveillance) ([]byte, error) {
	buf := make([]byte, jseries.J2PayloadSize)
	jseries.PackJ2Surveillance(j2, buf)
	return EncodeFull(buf, uint8(J2_Surveillance), CRC16)
}

// EncodeJ5 encodes a J5 Engagement Status message.
func (e *Encoder) EncodeJ5(j5 *jseries.J5EngagementStatus) ([]byte, error) {
	buf := make([]byte, jseries.J5PayloadSize)
	jseries.PackJ5EngagementStatus(j5, buf)
	return EncodeFull(buf, uint8(J5_EngagementStatus), CRC16)
}

// EncodeJ6 encodes a J6 Sensor Registration message.
func (e *Encoder) EncodeJ6(j6 *jseries.J6SensorRegistration) ([]byte, error) {
	buf := make([]byte, jseries.J6PayloadSize)
	jseries.PackJ6SensorRegistration(j6, buf)
	return EncodeFull(buf, uint8(J6_SensorRegistration), CRC16)
}

// EncodeJ4 encodes a J4 Engagement Order message.
func (e *Encoder) EncodeJ4(j4 *jseries.J4EngagementOrder) ([]byte, error) {
	buf := make([]byte, jseries.J4PayloadSize)
	jseries.PackJ4EngagementOrder(j4, buf)
	return EncodeFull(buf, uint8(J4_EngagementOrder), CRC16)
}

// EncodeJ12 encodes a J12 Alert message.
func (e *Encoder) EncodeJ12(j12 *jseries.J12Alert) ([]byte, error) {
	buf := make([]byte, jseries.J12PayloadSize)
	jseries.PackJ12Alert(j12, buf)
	return EncodeFull(buf, uint8(J12_Alert), CRC16)
}

// EncodeJ28 encodes a J28 Space Track message.
func (e *Encoder) EncodeJ28(j28 *jseries.J28SpaceTrack) ([]byte, error) {
	buf := make([]byte, jseries.J28PayloadSize)
	jseries.PackJ28SpaceTrack(j28, buf)
	return EncodeFull(buf, uint8(J28_SatelliteOPIR), CRC16)
}

// packOPIRMessage packs an OPIR/Sensor event into J28/Satellite format (17 bytes).
func (e *Encoder) packOPIRMessage(event SensorEventLike) []byte {
	buf := make([]byte, 17)

	trackNum := uint16(hashString(event.GetSensorID()) & 0xFFFE)
	buf[0] = byte(trackNum >> 8)
	buf[1] = byte(trackNum)

	ms := uint32(event.GetTimestamp().UnixMilli())
	buf[2] = byte(ms >> 24)
	buf[3] = byte(ms >> 16)
	buf[4] = byte(ms >> 8)
	buf[5] = byte(ms)

	lat := int64((event.GetLatitude() + 90.0) / 180.0 * float64(0xFFFFFF))
	if lat < 0 {
		lat = 0
	} else if lat > 0xFFFFFF {
		lat = 0xFFFFFF
	}
	buf[6] = byte(lat >> 16)
	buf[7] = byte(lat >> 8)
	buf[8] = byte(lat)

	lon := int64((event.GetLongitude() + 180.0) / 360.0 * float64(0xFFFFFF))
	if lon < 0 {
		lon = 0
	} else if lon > 0xFFFFFF {
		lon = 0xFFFFFF
	}
	buf[9] = byte(lon >> 16)
	buf[10] = byte(lon >> 8)
	buf[11] = byte(lon)

	alt := uint32(event.GetAltitude()) & 0xFFFFFF
	buf[12] = byte(alt >> 16)
	buf[13] = byte(alt >> 8)
	buf[14] = byte(alt)

	ir := uint16(event.GetIntensity() * 10)
	buf[15] = byte(ir >> 8)
	buf[16] = byte(ir)

	return buf
}

// packTrackUpdate packs a Track into J3.0 format (21 bytes).
func (e *Encoder) packTrackUpdate(track TrackLike) []byte {
	buf := make([]byte, 21)

	tn := track.GetTrackNumber()
	buf[0] = byte(tn >> 8)
	buf[1] = byte(tn)

	ms := uint32(track.GetLastUpdate().UnixMilli())
	buf[2] = byte(ms >> 24)
	buf[3] = byte(ms >> 16)
	buf[4] = byte(ms >> 8)
	buf[5] = byte(ms)

	lat := int64((track.GetLatitude() + 90.0) / 180.0 * float64(0xFFFFFF))
	if lat < 0 {
		lat = 0
	} else if lat > 0xFFFFFF {
		lat = 0xFFFFFF
	}
	buf[6] = byte(lat >> 16)
	buf[7] = byte(lat >> 8)
	buf[8] = byte(lat)

	lon := int64((track.GetLongitude() + 180.0) / 360.0 * float64(0xFFFFFF))
	if lon < 0 {
		lon = 0
	} else if lon > 0xFFFFFF {
		lon = 0xFFFFFF
	}
	buf[9] = byte(lon >> 16)
	buf[10] = byte(lon >> 8)
	buf[11] = byte(lon)

	alt := uint32(track.GetAltitude()) & 0xFFFFFF
	buf[12] = byte(alt >> 16)
	buf[13] = byte(alt >> 8)
	buf[14] = byte(alt)

	speed := uint16(track.GetSpeed() * 10)
	buf[15] = byte(speed >> 8)
	buf[16] = byte(speed)

	heading := uint16(track.GetHeading() * 100)
	buf[17] = byte(heading >> 8)
	buf[18] = byte(heading)

	buf[19] = trackStatusCode(track.GetStatus())
	buf[20] = uint8(track.GetThreatLevel())

	return buf
}

// packEngagementOrder packs an EngagementOrder into J4.0 format (15 bytes).
func (e *Encoder) packEngagementOrder(order EngagementOrderLike) []byte {
	buf := make([]byte, 15)

	orderHash := hashString(order.GetOrderID())
	buf[0] = byte(orderHash >> 24)
	buf[1] = byte(orderHash >> 16)
	buf[2] = byte(orderHash >> 8)
	buf[3] = byte(orderHash)

	buf[4] = 0
	buf[5] = 0

	buf[6] = uint8(order.GetPriority())
	buf[7] = weaponCode(order.GetWeaponSystem())

	tot := uint32(order.GetTimeOnTarget().UnixMilli())
	buf[8] = byte(tot >> 24)
	buf[9] = byte(tot >> 16)
	buf[10] = byte(tot >> 8)
	buf[11] = byte(tot)

	prob := uint16(order.GetInterceptProb() * 10000)
	buf[12] = byte(prob >> 8)
	buf[13] = byte(prob)

	buf[14] = engagementStatusCode(order.GetStatus())

	return buf
}

// hashString computes FNV-1a hash for IDs.
func hashString(s string) uint32 {
	h := uint32(2166136261)
	for _, c := range s {
		h ^= uint32(c)
		h *= 16777619
	}
	return h
}

// trackStatusCode encodes track status.
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

// weaponCode encodes weapon system.
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

// engagementStatusCode encodes engagement status.
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
