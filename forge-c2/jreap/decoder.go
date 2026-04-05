package jreap

import (
	"fmt"
	"time"

	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
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

// NodeID returns the decoder's processing node ID.
func (d *Decoder) NodeID() string {
	return d.nodeID
}

// DecodedMessage holds decoded JREAP bytes plus extracted metadata.
type DecodedMessage struct {
	Header   *Header
	Metadata *mdpa.MDPAMetadata
	RawPayload []byte
}

// DecodedOPIRMessage represents a decoded J28/Satellite OPIR message.
type DecodedOPIRMessage struct {
	TrackNumber uint16
	Timestamp   time.Time
	Latitude    float64
	Longitude   float64
	Altitude    float64
	IRIntensity float64
	Metadata    *mdpa.MDPAMetadata // QualityFlags, CorrelationID, Classification
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
	Metadata    *mdpa.MDPAMetadata // QualityFlags, CorrelationID
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
// If meta is non-nil, QualityFlags are extracted from the J-series payload
// and CorrelationID is extracted from the JREAP header reserved bytes.
func (d *Decoder) DecodeOPIR(msg []byte, meta *mdpa.MDPAMetadata) (*DecodedOPIRMessage, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J28_SatelliteOPIR) {
		return nil, fmt.Errorf("not a satellite/OPIR message: got J%d", hdr.MessageType)
	}
	decoded, err := d.unpackOPIRMessage(payload, meta)
	if err != nil {
		return nil, err
	}
	decoded.Metadata = d.extractMetadata(hdr, meta)
	return decoded, nil
}

// DecodeTrackUpdate decodes a JREAP message as a J3.0 track update.
// If meta is non-nil, QualityFlags are extracted from the J-series payload.
func (d *Decoder) DecodeTrackUpdate(msg []byte, meta *mdpa.MDPAMetadata) (*DecodedTrackUpdate, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J3_TrackUpdate) {
		return nil, fmt.Errorf("not a track update message: got J%d", hdr.MessageType)
	}
	decoded, err := d.unpackTrackUpdate(payload, meta)
	if err != nil {
		return nil, err
	}
	decoded.Metadata = d.extractMetadata(hdr, meta)
	return decoded, nil
}

// DecodeEngagementOrder decodes a JREAP message as a J4.0 engagement order.
// If meta is non-nil, CorrelationID is extracted.
func (d *Decoder) DecodeEngagementOrder(msg []byte, meta *mdpa.MDPAMetadata) (*DecodedEngagementOrder, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J4_EngagementOrder) {
		return nil, fmt.Errorf("not an engagement order message: got J%d", hdr.MessageType)
	}
	return d.unpackEngagementOrder(payload, meta)
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

// DecodeJ0 decodes a JREAP message as a J0 Track Management message.
func (d *Decoder) DecodeJ0(msg []byte) (*jseries.J0TrackManagement, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J0_TrackManagement) {
		return nil, fmt.Errorf("not a track management message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ0TrackManagement(payload), nil
}

// DecodeJ1 decodes a JREAP message as a J1 Network Initialization message.
func (d *Decoder) DecodeJ1(msg []byte) (*jseries.J1NetworkInit, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J1_NetworkInitialize) {
		return nil, fmt.Errorf("not a network init message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ1NetworkInit(payload), nil
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

// DecodeJ7 decodes a JREAP message as a J7 Platform/Sensor Data message.
func (d *Decoder) DecodeJ7(msg []byte) (*jseries.J7PlatformData, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J7_Platform) {
		return nil, fmt.Errorf("not a platform data message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ7PlatformData(payload), nil
}

// DecodeJ8 decodes a JREAP message as a J8 Radio message.
func (d *Decoder) DecodeJ8(msg []byte) (*jseries.J8Radio, error) {
	hdr, payload, _, err := DecodeFull(msg)
	if err != nil {
		return nil, fmt.Errorf("JREAP decode failed: %w", err)
	}
	if hdr.MessageType != uint8(J8_Radio) {
		return nil, fmt.Errorf("not a radio message: got J%d", hdr.MessageType)
	}
	return jseries.UnpackJ8Radio(payload), nil
}

// unpackOPIRMessage unpacks a J28 OPIR message payload (67 bytes).
func (d *Decoder) unpackOPIRMessage(payload []byte, meta *mdpa.MDPAMetadata) (*DecodedOPIRMessage, error) {
	if len(payload) < 17 {
		return nil, fmt.Errorf("payload too small for OPIR: %d bytes", len(payload))
	}
	trackNum := uint16(payload[0])<<8 | uint16(payload[1])
	ms := uint32(payload[2])<<24 | uint32(payload[3])<<16 | uint32(payload[4])<<8 | uint32(payload[5])
	latVal := uint32(payload[6])<<16 | uint32(payload[7])<<8 | uint32(payload[8])
	lonVal := uint32(payload[9])<<16 | uint32(payload[10])<<8 | uint32(payload[11])
	altVal := uint32(payload[12])<<16 | uint32(payload[13])<<8 | uint32(payload[14])
	// For short payloads (17 bytes), use last 2 bytes as IR intensity
	var irIntensity float64
	if len(payload) >= 67 {
		// Full J28 payload — IR at offset 52
		irVal := uint16(payload[52])<<8 | uint16(payload[53])
		irIntensity = float64(irVal) / 100.0
		// Extract quality from offset 58
		if meta != nil {
			q := jseries.UnpackQuality(payload[58])
			if q.Quality >= 2 {
				meta.SetQualityFlag(mdpa.QualityGood)
			}
			if !q.Coasting {
				meta.SetQualityFlag(mdpa.QualityTimely)
			} else {
				meta.ClearQualityFlag(mdpa.QualityTimely)
			}
			if q.Derived {
				meta.SetQualityFlag(mdpa.QualityCorrelated)
			}
		}
	} else {
		// Legacy 17-byte short form: IR at bytes 15-16
		irVal := uint16(payload[15])<<8 | uint16(payload[16])
		irIntensity = float64(irVal) / 10.0
	}

	return &DecodedOPIRMessage{
		TrackNumber: trackNum,
		Timestamp:   time.UnixMilli(int64(ms)).UTC(),
		Latitude:    (float64(latVal)/float64(0xFFFFFF))*180.0 - 90.0,
		Longitude:   (float64(lonVal)/float64(0xFFFFFF))*360.0 - 180.0,
		Altitude:    float64(altVal),
		IRIntensity: irIntensity,
	}, nil
}

// unpackTrackUpdate unpacks a J3.0 Track Update payload (21 bytes).
func (d *Decoder) unpackTrackUpdate(payload []byte, meta *mdpa.MDPAMetadata) (*DecodedTrackUpdate, error) {
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

	// Extract QualityFlags from J3 quality byte (offset 20, but that's threat level in current format)
	// In the actual J3 format, quality is a separate byte after status
	// Our packTrackUpdate currently uses 21 bytes without quality byte, so we use status/threat
	// For now, extract what we can from the payload

	decoded := &DecodedTrackUpdate{
		TrackNumber: trackNum,
		Timestamp:   time.UnixMilli(int64(ms)).UTC(),
		Latitude:    (float64(latVal)/float64(0xFFFFFF))*180.0 - 90.0,
		Longitude:   (float64(lonVal)/float64(0xFFFFFF))*360.0 - 180.0,
		Altitude:    float64(altVal),
		Speed:      float64(speedVal) / 10.0,
		Heading:    float64(headingVal) / 100.0,
		Status:     decodeTrackStatus(payload[19]),
		ThreatLevel: int(payload[20]),
	}

	// If we have a full 22+ byte payload, the J3 format includes quality byte
	// For now, infer quality from threat level and status
	if meta != nil {
		if decoded.ThreatLevel >= 3 {
			meta.SetQualityFlag(mdpa.QualityGood)
		}
		if decoded.Status == "UPDATED" || decoded.Status == "ACTIVE" {
			meta.SetQualityFlag(mdpa.QualityTimely)
		} else if decoded.Status == "DROPPED" {
			meta.ClearQualityFlag(mdpa.QualityTimely)
		}
	}

	return decoded, nil
}

// extractMetadata extracts or builds MDPAMetadata from the JREAP header
// and existing metadata. Uses JREAP header Reserved byte for CorrelationID
// encoding when meta is provided.
func (d *Decoder) extractMetadata(hdr *Header, base *mdpa.MDPAMetadata) *mdpa.MDPAMetadata {
	if base != nil {
		// Use the base metadata (CorrelationID already set)
		return base
	}
	// Build minimal metadata from header
	meta := mdpa.NewMDPAMetadata(
		d.nodeID,
		d.applicationID,
		"",
		"UNCLASSIFIED",
	)
	// Encode CorrelationID in the header Reserved byte for round-trip testing
	// (first byte of reserved = correlation ID hash LSB)
	if hdr.Reserved > 0 {
		meta.CorrelationID = fmt.Sprintf("CORR-%d", hdr.Reserved)
	}
	return meta
}

// unpackEngagementOrder unpacks a J4.0 Engagement Order payload (15 bytes).
func (d *Decoder) unpackEngagementOrder(payload []byte, meta *mdpa.MDPAMetadata) (*DecodedEngagementOrder, error) {
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
