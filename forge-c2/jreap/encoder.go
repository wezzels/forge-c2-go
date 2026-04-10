package jreap

import (
	"fmt"
	"time"

	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// EncodedMessage holds JREAP-encoded bytes plus associated metadata
// that doesn't fit in the JREAP header (CorrelationID, Classification).
type EncodedMessage struct {
	Bytes    []byte
	Metadata *mdpa.MDPAMetadata
}

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
	// registry maps MessageType → encodeFn for data-driven encoding
	registry map[MessageType]encodeFn
}

// encodeFn is a function that encodes a specific J-series message type.
type encodeFn func(interface{}, []byte) // (struct, buf)

// NewEncoder creates a new JREAP encoder.
func NewEncoder(nodeID, appID string) *Encoder {
	e := &Encoder{
		nodeID:        nodeID,
		applicationID: appID,
		registry:      make(map[MessageType]encodeFn),
	}
	e.registerDefaults()
	return e
}

// Register adds an encoder function for a message type.
// This allows custom encoders to be registered at runtime.
func (e *Encoder) Register(msgType MessageType, fn encodeFn) {
	e.registry[msgType] = fn
}

// EncodeUsing encodes a message using the registered encoder for its type.
// Returns error if no encoder is registered for this message type.
func (e *Encoder) EncodeUsing(msgType MessageType, msg interface{}) ([]byte, error) {
	fn, ok := e.registry[msgType]
	if !ok {
		return nil, fmt.Errorf("no encoder registered for message type %s", msgType)
	}

	// Get payload size from registry
	size := msgType.PayloadSize()
	if size == 0 {
		return nil, fmt.Errorf("unknown payload size for message type %s", msgType)
	}

	buf := make([]byte, size)
	fn(msg, buf)
	return EncodeFull(buf, uint8(msgType), CRC16)
}

// registerDefaults registers all built-in J-series encoders.
func (e *Encoder) registerDefaults() {
	// J0-J31 encoders (straight pack + EncodeFull)
	e.registry[J0_TrackManagement] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J0TrackManagement); ok {
			jseries.PackJ0TrackManagement(m, buf)
		}
	}
	e.registry[J1_NetworkInitialize] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J1NetworkInit); ok {
			jseries.PackJ1NetworkInit(m, buf)
		}
	}
	e.registry[J2_Surveillance] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J2Surveillance); ok {
			jseries.PackJ2Surveillance(m, buf)
		}
	}
	e.registry[J4_EngagementOrder] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J4EngagementOrder); ok {
			jseries.PackJ4EngagementOrder(m, buf)
		}
	}
	e.registry[J5_EngagementStatus] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J5EngagementStatus); ok {
			jseries.PackJ5EngagementStatus(m, buf)
		}
	}
	e.registry[J6_SensorRegistration] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J6SensorRegistration); ok {
			jseries.PackJ6SensorRegistration(m, buf)
		}
	}
	e.registry[J7_Platform] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J7PlatformData); ok {
			jseries.PackJ7PlatformData(m, buf)
		}
	}
	e.registry[J8_Radio] = func(msg interface{}, buf []byte) {
		// J8 has variable length - handled separately
	}
	e.registry[J9_ElectronicAttack] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J9ElectronicAttack); ok {
			jseries.PackJ9ElectronicAttack(m, buf)
		}
	}
	e.registry[J10_Offset] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J10Offset); ok {
			jseries.PackJ10Offset(m, buf)
		}
	}
	e.registry[J11_DataTransfer] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J11DataTransfer); ok {
			jseries.PackJ11DataTransfer(m, buf)
		}
	}
	e.registry[J12_Alert] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J12Alert); ok {
			jseries.PackJ12Alert(m, buf)
		}
	}
	e.registry[J13_PreciseParticipant] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J13PrecisionParticipant); ok {
			jseries.PackJ13PrecisionParticipant(m, buf)
		}
	}
	e.registry[J14_ProcessSpec] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J14ProcessSpec); ok {
			jseries.PackJ14ProcessSpec(m, buf)
		}
	}
	e.registry[J15_Command] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J15Command); ok {
			jseries.PackJ15Command(m, buf)
		}
	}
	e.registry[J16_Acknowledge] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J16Acknowledge); ok {
			jseries.PackJ16Acknowledge(m, buf)
		}
	}
	e.registry[J17_InitiateTransfer] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J17InitiateTransfer); ok {
			jseries.PackJ17InitiateTransfer(m, buf)
		}
	}
	e.registry[J18_SpaceTrack] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J18SpaceTrack); ok {
			jseries.PackJ18SpaceTrack(m, buf)
		}
	}
	e.registry[J26_Test] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J26Test); ok {
			jseries.PackJ26Test(m, buf)
		}
	}
	e.registry[J27_Time] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J27Time); ok {
			jseries.PackJ27Time(m, buf)
		}
	}
	e.registry[J28_SatelliteOPIR] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J28SpaceTrack); ok {
			jseries.PackJ28SpaceTrack(m, buf)
		}
	}
	e.registry[J29_Symbology] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J29Symbology); ok {
			jseries.PackJ29Symbology(m, buf)
		}
	}
	e.registry[J30_IFF] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J30IFF); ok {
			jseries.PackJ30IFF(m, buf)
		}
	}
	e.registry[J31_FileTransfer] = func(msg interface{}, buf []byte) {
		if m, ok := msg.(*jseries.J31FileTransfer); ok {
			jseries.PackJ31FileTransfer(m, buf)
		}
	}
}

// EncodeSensorEvent encodes a SensorEvent as a JREAP J-series message (J28).
// Returns the full JREAP message bytes (header + payload + CRC).
func (e *Encoder) EncodeSensorEvent(event SensorEventLike, meta *mdpa.MDPAMetadata) ([]byte, error) {
	payload := e.packOPIRMessage(event, meta)
	return EncodeFull(payload, uint8(J28_SatelliteOPIR), CRC16)
}

// EncodeSensorEventWithMetadata encodes a SensorEvent as JREAP and returns
// both the bytes and metadata (including CorrelationID).
func (e *Encoder) EncodeSensorEventWithMetadata(event SensorEventLike, meta *mdpa.MDPAMetadata) (*EncodedMessage, error) {
	buf, err := e.EncodeSensorEvent(event, meta)
	return &EncodedMessage{Bytes: buf, Metadata: meta}, err
}

// EncodeTrack encodes a Track as a JREAP J3.0 Track Update message.
// meta carries QualityFlags (wired into J3.Quality) and CorrelationID (returned).
func (e *Encoder) EncodeTrack(track TrackLike, meta *mdpa.MDPAMetadata) ([]byte, error) {
	payload := e.packTrackUpdate(track, meta)
	return EncodeFull(payload, uint8(J3_TrackUpdate), CRC16)
}

// EncodeTrackWithMetadata encodes a Track as JREAP and returns both bytes and metadata.
func (e *Encoder) EncodeTrackWithMetadata(track TrackLike, meta *mdpa.MDPAMetadata) (*EncodedMessage, error) {
	buf, err := e.EncodeTrack(track, meta)
	return &EncodedMessage{Bytes: buf, Metadata: meta}, err
}

// EncodeEngagementOrder encodes an EngagementOrder as a JREAP J4.0 Engagement Order message.
func (e *Encoder) EncodeEngagementOrder(order EngagementOrderLike, meta *mdpa.MDPAMetadata) ([]byte, error) {
	payload := e.packEngagementOrder(order)
	return EncodeFull(payload, uint8(J4_EngagementOrder), CRC16)
}

// EncodeEngagementOrderWithMetadata encodes an EngagementOrder as JREAP and returns both bytes and metadata.
func (e *Encoder) EncodeEngagementOrderWithMetadata(order EngagementOrderLike, meta *mdpa.MDPAMetadata) (*EncodedMessage, error) {
	buf, err := e.EncodeEngagementOrder(order, meta)
	return &EncodedMessage{Bytes: buf, Metadata: meta}, err
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

// EncodeJ0 encodes a J0 Track Management message.
func (e *Encoder) EncodeJ0(j0 *jseries.J0TrackManagement) ([]byte, error) {
	buf := make([]byte, jseries.J0PayloadSize)
	jseries.PackJ0TrackManagement(j0, buf)
	return EncodeFull(buf, uint8(J0_TrackManagement), CRC16)
}

// EncodeJ1 encodes a J1 Network Initialization message.
func (e *Encoder) EncodeJ1(j1 *jseries.J1NetworkInit) ([]byte, error) {
	buf := make([]byte, jseries.J1PayloadSize)
	jseries.PackJ1NetworkInit(j1, buf)
	return EncodeFull(buf, uint8(J1_NetworkInitialize), CRC16)
}

// EncodeJ9 encodes a J9 Electronic Warfare message.
func (e *Encoder) EncodeJ9(j9 *jseries.J9ElectronicAttack) ([]byte, error) {
	buf := make([]byte, jseries.J9PayloadSize)
	jseries.PackJ9ElectronicAttack(j9, buf)
	return EncodeFull(buf, uint8(J9_ElectronicAttack), CRC16)
}

// EncodeJ10 encodes a J10 Offset message.
func (e *Encoder) EncodeJ10(j10 *jseries.J10Offset) ([]byte, error) {
	buf := make([]byte, jseries.J10PayloadSize)
	jseries.PackJ10Offset(j10, buf)
	return EncodeFull(buf, uint8(J10_Offset), CRC16)
}

// EncodeJ11 encodes a J11 Data Transfer message.
func (e *Encoder) EncodeJ11(j11 *jseries.J11DataTransfer) ([]byte, error) {
	buf := make([]byte, jseries.J11PayloadSize)
	jseries.PackJ11DataTransfer(j11, buf)
	return EncodeFull(buf, uint8(J11_DataTransfer), CRC16)
}

// EncodeJ13 encodes a J13 Precise Participant message.
func (e *Encoder) EncodeJ13(j13 *jseries.J13PrecisionParticipant) ([]byte, error) {
	buf := make([]byte, jseries.J13PayloadSize)
	jseries.PackJ13PrecisionParticipant(j13, buf)
	return EncodeFull(buf, uint8(J13_PreciseParticipant), CRC16)
}

// EncodeJ14 encodes a J14 Process Specification message.
func (e *Encoder) EncodeJ14(j14 *jseries.J14ProcessSpec) ([]byte, error) {
	buf := make([]byte, jseries.J14PayloadSize)
	jseries.PackJ14ProcessSpec(j14, buf)
	return EncodeFull(buf, uint8(J14_ProcessSpec), CRC16)
}

// EncodeJ15 encodes a J15 Command message.
func (e *Encoder) EncodeJ15(j15 *jseries.J15Command) ([]byte, error) {
	buf := make([]byte, jseries.J15PayloadSize)
	jseries.PackJ15Command(j15, buf)
	return EncodeFull(buf, uint8(J15_Command), CRC16)
}

// EncodeJ16 encodes a J16 Acknowledge message.
func (e *Encoder) EncodeJ16(j16 *jseries.J16Acknowledge) ([]byte, error) {
	buf := make([]byte, jseries.J16PayloadSize)
	jseries.PackJ16Acknowledge(j16, buf)
	return EncodeFull(buf, uint8(J16_Acknowledge), CRC16)
}

// EncodeJ17 encodes a J17 Initiate Transfer message.
func (e *Encoder) EncodeJ17(j17 *jseries.J17InitiateTransfer) ([]byte, error) {
	buf := make([]byte, jseries.J17PayloadSize)
	jseries.PackJ17InitiateTransfer(j17, buf)
	return EncodeFull(buf, uint8(J17_InitiateTransfer), CRC16)
}

// EncodeJ18 encodes a J18 Space Track message.
func (e *Encoder) EncodeJ18(j18 *jseries.J18SpaceTrack) ([]byte, error) {
	buf := make([]byte, jseries.J18PayloadSize)
	jseries.PackJ18SpaceTrack(j18, buf)
	return EncodeFull(buf, uint8(J18_SpaceTrack), CRC16)
}

// EncodeJ26 encodes a J26 Test message.
func (e *Encoder) EncodeJ26(j26 *jseries.J26Test) ([]byte, error) {
	buf := make([]byte, jseries.J26PayloadSize)
	jseries.PackJ26Test(j26, buf)
	return EncodeFull(buf, uint8(J26_Test), CRC16)
}

// EncodeJ27 encodes a J27 Time message.
func (e *Encoder) EncodeJ27(j27 *jseries.J27Time) ([]byte, error) {
	buf := make([]byte, jseries.J27PayloadSize)
	jseries.PackJ27Time(j27, buf)
	return EncodeFull(buf, uint8(J27_Time), CRC16)
}

// EncodeJ29 encodes a J29 Symbology message.
func (e *Encoder) EncodeJ29(j29 *jseries.J29Symbology) ([]byte, error) {
	buf := make([]byte, jseries.J29PayloadSize)
	jseries.PackJ29Symbology(j29, buf)
	return EncodeFull(buf, uint8(J29_Symbology), CRC16)
}

// EncodeJ30 encodes a J30 IFF message.
func (e *Encoder) EncodeJ30(j30 *jseries.J30IFF) ([]byte, error) {
	buf := make([]byte, jseries.J30PayloadSize)
	jseries.PackJ30IFF(j30, buf)
	return EncodeFull(buf, uint8(J30_IFF), CRC16)
}

// EncodeJ31 encodes a J31 File Transfer message.
func (e *Encoder) EncodeJ31(j31 *jseries.J31FileTransfer) ([]byte, error) {
	buf := make([]byte, jseries.J31HeaderSize)
	jseries.PackJ31FileTransfer(j31, buf)
	return EncodeFull(buf, uint8(J31_FileTransfer), CRC16)
}

// EncodeJ28 encodes a J28 Space Track message.
func (e *Encoder) EncodeJ28(j28 *jseries.J28SpaceTrack) ([]byte, error) {
	buf := make([]byte, jseries.J28PayloadSize)
	jseries.PackJ28SpaceTrack(j28, buf)
	return EncodeFull(buf, uint8(J28_SatelliteOPIR), CRC16)
}

// EncodeJ7 encodes a J7 Platform/Sensor Data message.
func (e *Encoder) EncodeJ7(j7 *jseries.J7PlatformData) ([]byte, error) {
	buf := make([]byte, jseries.J7PayloadSize)
	jseries.PackJ7PlatformData(j7, buf)
	return EncodeFull(buf, uint8(J7_Platform), CRC16)
}

// EncodeJ8 encodes a J8 Radio message.
func (e *Encoder) EncodeJ8(j8 *jseries.J8Radio) ([]byte, error) {
	buf := make([]byte, jseries.J8PayloadSize(len(j8.MessageText)))
	jseries.PackJ8Radio(j8, buf)
	return EncodeFull(buf, uint8(J8_Radio), CRC16)
}

// packOPIRMessage packs an OPIR/Sensor event into J28/Satellite format (67 bytes).
func (e *Encoder) packOPIRMessage(event SensorEventLike, meta *mdpa.MDPAMetadata) []byte {
	buf := make([]byte, jseries.J28PayloadSize)

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

	// Velocity (placeholder — set to 0 for raw sensor events)
	for i := 15; i < 24; i++ {
		buf[i] = 0
	}

	// Satellite ID (12 bytes, null-padded)
	satID := event.GetSensorID()
	for i := 0; i < 12; i++ {
		if i < len(satID) {
			buf[24+i] = satID[i]
		} else {
			buf[24+i] = 0
		}
	}

	// Orbital elements (set to 0 for raw detection)
	off := 36
	for i := 0; i < 16; i++ {
		buf[off+i] = 0
	}
	off += 16

	// IR intensity (saturation at 655.35K to avoid overflow)
	irVal := event.GetIntensity() * 100
	if irVal > 65535 {
		irVal = 65535
	}
	ir := uint16(irVal)
	buf[off] = byte(ir >> 8)
	buf[off+1] = byte(ir)
	off += 2

	// Background temp (0 for raw detection)
	buf[off] = 0
	buf[off+1] = 0
	off += 2

	// Detection confidence (from event intensity as proxy)
	conf := uint8(event.GetIntensity() / 2.0 * 255)
	if conf > 255 {
		conf = 255
	}
	buf[off] = conf
	off++

	// SNR (from event intensity as proxy)
	snr := uint8(event.GetIntensity() / 5.0)
	if snr > 255 {
		snr = 255
	}
	buf[off] = snr
	off++

	// Quality from metadata
	quality := e.metadataToQuality(meta)
	buf[off] = jseries.PackQuality(quality)
	off++

	// Threat level (from sensor type heuristic)
	buf[off] = 0
	off++

	// Status (NEW for raw detection)
	buf[off] = 1
	off++

	// Platform type (SATELLITE for OPIR)
	buf[off] = 1

	return buf
}

// packTrackUpdate packs a Track into J3.0 format (21 bytes).
func (e *Encoder) packTrackUpdate(track TrackLike, meta *mdpa.MDPAMetadata) []byte {
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

// metadataToQuality converts MDPAMetadata.QualityFlags to jseries.QualityIndicator.
// MDPAMetadata bits: 0=Good, 1=SNR, 2=Geom, 3=Timely, 4=Correlated, 5=Fused
// jseries QualityIndicator: 0-1=quality level, jamming, multipath, invalid, coasting, manual, derived
func (e *Encoder) metadataToQuality(meta *mdpa.MDPAMetadata) jseries.QualityIndicator {
	q := jseries.QualityIndicator{}
	if meta == nil {
		return q
	}
	flags := meta.QualityFlags
	// Quality level: 0=poor, 1=normal, 2=good, 3=excellent
	if flags&mdpa.QualityGood != 0 {
		if flags&mdpa.QualitySNRAdequate != 0 {
			q.Quality = 2 // good
		} else {
			q.Quality = 1 // normal
		}
	}
	if flags&mdpa.QualityTimely == 0 {
		q.Coasting = true // stale → coasting
	}
	if flags&mdpa.QualityCorrelated != 0 {
		q.Derived = true // correlated → derived track
	}
	return q
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
