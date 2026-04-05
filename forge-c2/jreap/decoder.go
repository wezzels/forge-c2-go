package jreap

import (
	"fmt"
	"time"

	"forge-c2/jreap/jseries"
)

// Decoder handles JREAP-C decoding of FORGE messages.
type Decoder struct {
	nodeID        string
	applicationID string
}

// NewDecoder creates a new JREAP decoder.
func NewDecoder(nodeID, appID string) *Decoder {
	return &Decoder{
		nodeID:        nodeID,
		applicationID: appID,
	}
}

// DecodedOPIRMessage represents a decoded J28/Satellite OPIR message.
type DecodedOPIRMessage struct {
	TrackNumber uint16
	Timestamp   time.Time
	Latitude    float64
	Longitude   float64
	Altitude    float64
	IRIntensity float64
}

// DecodedTrackUpdate represents a decoded J3.0 track message.
type DecodedTrackUpdate struct {
	TrackNumber uint16
	Timestamp   time.Time
	Latitude    float64
	Longitude   float64
	Altitude    float64
	Speed       float64
	Heading     float64
	Status      string
	ThreatLevel int
}

// DecodedEngagementOrder represents a decoded J4.0 engagement order.
type DecodedEngagementOrder struct {
	OrderID       string
	TrackID       string
	Priority      int
	WeaponSystem  string
	TimeOnTarget  time.Time
	InterceptProb float64
	Status        string
}

// DecodeOPIR decodes a JREAP message as an OPIR/Sensor event.
func (d *Decoder) DecodeOPIR(msg []byte) (*DecodedOPIRMessage, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J28_SatelliteOPIR) {
		return nil, fmt.Errorf("not a satellite/OPIR message: got J%d", hdr.MessageType)
	}
	return d.unpackOPIRMessage(payload)
}

// DecodeTrackUpdate decodes a JREAP message as a J3.0 track update.
func (d *Decoder) DecodeTrackUpdate(msg []byte) (*DecodedTrackUpdate, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J3_TrackUpdate) {
		return nil, fmt.Errorf("not a track update message: got J%d", hdr.MessageType)
	}
	return d.unpackTrackUpdate(payload)
}

// DecodeEngagementOrder decodes a JREAP message as a J4.0 engagement order.
func (d *Decoder) DecodeEngagementOrder(msg []byte) (*DecodedEngagementOrder, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J4_EngagementOrder) {
		return nil, fmt.Errorf("not an engagement order message: got J%d", hdr.MessageType)
	}
	return d.unpackEngagementOrder(payload)
}

// DecodeJ2 decodes a JREAP message as a J2 Surveillance message.
func (d *Decoder) DecodeJ2(msg []byte) (*jseries.J2Surveillance, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J2_Surveillance) {
		return nil, fmt.Errorf("not a surveillance message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ2Surveillance(payload), nil
}

// DecodeJ5 decodes a JREAP message as a J5 Engagement Status message.
func (d *Decoder) DecodeJ5(msg []byte) (*jseries.J5EngagementStatus, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J5_EngagementStatus) {
		return nil, fmt.Errorf("not an engagement status message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ5EngagementStatus(payload), nil
}

// DecodeJ6 decodes a JREAP message as a J6 Sensor Registration message.
func (d *Decoder) DecodeJ6(msg []byte) (*jseries.J6SensorRegistration, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J6_SensorRegistration) {
		return nil, fmt.Errorf("not a sensor registration message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ6SensorRegistration(payload), nil
}

// DecodeJ12 decodes a JREAP message as a J12 Alert message.
func (d *Decoder) DecodeJ12(msg []byte) (*jseries.J12Alert, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J12_Alert) {
		return nil, fmt.Errorf("not an alert message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ12Alert(payload), nil
}

// DecodeJ28 decodes a JREAP message as a J28 Space Track message.
func (d *Decoder) DecodeJ28(msg []byte) (*jseries.J28SpaceTrack, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J28_SatelliteOPIR) {
		return nil, fmt.Errorf("not a space track message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ28SpaceTrack(payload), nil
}

// unpackOPIRMessage unpacks a J28 OPIR message payload (17 bytes).
func (d *Decoder) unpackOPIRMessage(payload []byte) (*DecodedOPIRMessage, error) {
	if len(payload) < 17 {
		return nil, fmt.Errorf("payload too small for OPIR: %d bytes", len(payload))
	}
	trackNum := uint16(payload[0])<<8 | uint16(payload[1])
	ms := uint32(payload[2])<<24 | uint32(payload[3])<<16 | uint32(payload[4])<<8 | uint32(payload[5])
	latVal := uint32(payload[6])<<16 | uint32(payload[7])<<8 | uint32(payload[8])
	lonVal := uint32(payload[9])<<16 | uint32(payload[10])<<8 | uint32(payload[11])
	altVal := uint32(payload[12])<<16 | uint32(payload[13])<<8 | uint32(payload[14])
	irVal := uint16(payload[15])<<8 | uint16(payload[16])

	return &DecodedOPIRMessage{
		TrackNumber: trackNum,
		Timestamp:   time.UnixMilli(int64(ms)).UTC(),
		Latitude:    (float64(latVal)/float64(0xFFFFFF))*180.0 - 90.0,
		Longitude:   (float64(lonVal)/float64(0xFFFFFF))*360.0 - 180.0,
		Altitude:    float64(altVal),
		IRIntensity: float64(irVal) / 10.0,
	}, nil
}

// unpackTrackUpdate unpacks a J3.0 Track Update payload (21 bytes).
func (d *Decoder) unpackTrackUpdate(payload []byte) (*DecodedTrackUpdate, error) {
	if len(payload) < 21 {
		return nil, fmt.Errorf("payload too small for track update: %d bytes", len(payload))
	}
	trackNum := uint16(payload[0])<<8 | uint16(payload[1])
	ms := uint32(payload[2])<<24 | uint32(payload[3])<<16 | uint32(payload[4])<<8 | uint32(payload[5])
	latVal := uint32(payload[6])<<16 | uint32(payload[7])<<8 | uint32(payload[8])
	lonVal := uint32(payload[9])<<16 | uint32(payload[10])<<8 | uint32(payload[11])
	altVal := uint32(payload[12])<<16 | uint32(payload[13])<<8 | uint32(payload[14])
	speedVal := uint16(payload[15])<<8 | uint16(payload[16])
	headingVal := uint16(payload[17])<<8 | uint16(payload[18])

	return &DecodedTrackUpdate{
		TrackNumber: trackNum,
		Timestamp:   time.UnixMilli(int64(ms)).UTC(),
		Latitude:    (float64(latVal)/float64(0xFFFFFF))*180.0 - 90.0,
		Longitude:   (float64(lonVal)/float64(0xFFFFFF))*360.0 - 180.0,
		Altitude:    float64(altVal),
		Speed:      float64(speedVal) / 10.0,
		Heading:    float64(headingVal) / 100.0,
		Status:     decodeTrackStatus(payload[19]),
		ThreatLevel: int(payload[20]),
	}, nil
}

// unpackEngagementOrder unpacks a J4.0 Engagement Order payload (15 bytes).
func (d *Decoder) unpackEngagementOrder(payload []byte) (*DecodedEngagementOrder, error) {
	if len(payload) < 15 {
		return nil, fmt.Errorf("payload too small for engagement order: %d bytes", len(payload))
	}
	tot := uint32(payload[8])<<24 | uint32(payload[9])<<16 | uint32(payload[10])<<8 | uint32(payload[11])
	probVal := uint16(payload[12])<<8 | uint16(payload[13])

	return &DecodedEngagementOrder{
		Priority:     int(payload[6]),
		WeaponSystem: decodeWeapon(payload[7]),
		TimeOnTarget: time.UnixMilli(int64(tot)).UTC(),
		InterceptProb: float64(probVal) / 10000.0,
		Status:       decodeEngagementStatus(payload[14]),
	}, nil
}

func decodeTrackStatus(b uint8) string {
	switch b {
	case 0x01:
		return "NEW"
	case 0x02:
		return "ACTIVE"
	case 0x03:
		return "UPDATED"
	case 0x04:
		return "DROPPED"
	default:
		return "UNKNOWN"
	}
}

func decodeWeapon(b uint8) string {
	switch b {
	case 0x01:
		return "GBI"
	case 0x02:
		return "SM-3"
	case 0x03:
		return "THAAD"
	case 0x04:
		return "PATRIOT"
	default:
		return "UNKNOWN"
	}
}

func decodeEngagementStatus(b uint8) string {
	switch b {
	case 0x01:
		return "PENDING"
	case 0x02:
		return "LAUNCHED"
	case 0x03:
		return "INTERCEPTED"
	case 0x04:
		return "FAILED"
	case 0x05:
		return "CANCELLED"
	default:
		return "UNKNOWN"
	}
}
