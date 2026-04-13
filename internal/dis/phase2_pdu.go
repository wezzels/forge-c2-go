package dis

import (
	"encoding/binary"
	"math"
	"time"
)

// =============================================================================
// Phase 2.2: Additional DIS PDUs
// Missing: Action Response (2.2.14), World State (2.2.25), Object State (2.2.26),
//          Distributed Emissions Regeneration (2.2.27)
// =============================================================================

// PDU Type constants
const (
	TypeActionResponse             = 16
	TypeWorldState                 = 30
	TypeObjectState               = 31
	TypeDistributedEmissionsRegen = 33
)

// Action Response PDU (Type 16) - Result of action
type DISActionResponsePDU struct {
	Header              DISHeader
	RequestingEntityID   EntityID
	ReceivingEntityID    EntityID
	ActionID             ActionIdentifier
	ResponseResult       uint32
	NumFixedData         uint32
	NumVariableData      uint32
}

// Action Response results
const (
	ActionResponseAccepted = 0
	ActionResponseRejected = 1
	ActionResponsePending  = 2
)

// NewActionResponsePDU creates an action response PDU
func NewActionResponsePDU(reqEntity, recvEntity EntityID, action ActionIdentifier, result uint32) *DISActionResponsePDU {
	pdu := &DISActionResponsePDU{}
	pdu.Header.PDUType = TypeActionResponse
	pdu.Header.Family = FamilyEntityManagement
	pdu.RequestingEntityID = reqEntity
	pdu.ReceivingEntityID = recvEntity
	pdu.ActionID = action
	pdu.ResponseResult = result
	return pdu
}

// =============================================================================
// World State PDU (Type 30) - Aggregated entity state for entire federation
// =============================================================================

// WorldStatePDU represents the overall state of the simulation world
// Uses existing Vector3Double, Vector3Float from pdu_helpers.go
type WorldStatePDU struct {
	Header              DISHeader
	WorldStateOptions   uint32
	NumAggregates       uint16
	NumObjects          uint16
	NumEvents           uint16
	Pad                 uint16
	AggregateStates     []AggregateState
	ObjectStateRecords  []ObjectStateRecord
	EventStateRecords   []EventStateRecord
}

// AggregateState represents an aggregate entity
type AggregateState struct {
	AggregateEntityID     EntityID
	AggregateType         EntityType
	FormationIndex        uint16
	Pad                   uint8
	NumberOfChildren      uint16
	ChildEntityIDs        []EntityID
	Position              Vector3Double
	Orientation           EulerAngles
	Velocity              Vector3Float
	AggregateStateOptions uint32
}

// ObjectStateRecord represents a non-entity object in the world
type ObjectStateRecord struct {
	ObjectID           EntityID
	ObjectType         EntityType
	ObjectPosition     Vector3Double
	ObjectOrientation  EulerAngles
	ObjectVelocity     Vector3Float
	ObjectStateOptions uint32
}

// EventStateRecord represents an event in the world
type EventStateRecord struct {
	EventID       uint32
	EventType     uint16
	Pad           uint16
	EventTime     Timestamp
	EventLocation Vector3Double
	EventData     []byte
}

// EulerAngles represents entity orientation (roll, pitch, yaw)
type EulerAngles struct {
	Phi   float32 // Roll (rotation about X axis)
	Theta float32 // Pitch (rotation about Y axis)
	Psi   float32 // Yaw (rotation about Z axis)
}

// PackEulerAngles packs EulerAngles
func PackEulerAngles(e *EulerAngles, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(e.Phi))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(e.Theta))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(e.Psi))
	off += 4
	return off
}

// UnpackEulerAngles unpacks EulerAngles
func UnpackEulerAngles(buf []byte) EulerAngles {
	e := EulerAngles{}
	e.Phi = Float32FromBits(binary.LittleEndian.Uint32(buf[0:]))
	e.Theta = Float32FromBits(binary.LittleEndian.Uint32(buf[4:]))
	e.Psi = Float32FromBits(binary.LittleEndian.Uint32(buf[8:]))
	return e
}

// NewWorldStatePDU creates a new world state PDU
func NewWorldStatePDU() *WorldStatePDU {
	pdu := &WorldStatePDU{}
	pdu.Header.PDUType = TypeWorldState
	pdu.Header.Family = FamilyEntityManagement // Use existing family constant
	return pdu
}

// =============================================================================
// Object State PDU (Type 31) - Non-entity object state
// =============================================================================

// ObjectStatePDU represents state of a non-entity object
type ObjectStatePDU struct {
	Header              DISHeader
	ObjectID            EntityID
	ObjectType          EntityType
	ObjectName          [64]byte
	ObjectPosition      Vector3Double
	ObjectOrientation   EulerAngles
	ObjectVelocity      Vector3Float
	ObjectAcceleration  Vector3Float
	ObjectAppearance    uint32
	ObjectStateOptions  uint32
	NumSpecificIDs      uint16
	Pad                 uint16
	SpecificIDs         []uint32
}

// NewObjectStatePDU creates a new object state PDU
func NewObjectStatePDU() *ObjectStatePDU {
	pdu := &ObjectStatePDU{}
	pdu.Header.PDUType = TypeObjectState
	pdu.Header.Family = FamilyEntityManagement
	return pdu
}

// =============================================================================
// Distributed Emissions Regeneration PDU (Type 33) - Emission state update
// =============================================================================

// DistributedEmissionsRegenerationPDU updates emissions from multiple sources
type DistributedEmissionsRegenerationPDU struct {
	Header                  DISHeader
	EmittingEntityID        EntityID
	EventID                 EventIdentifier
	StateChangeIndicator    uint8
	Pad                     [3]uint8
	EmissionEngineCount     uint16
	NumLocationUpdates      uint16
	EmissionEngines         []EmissionEngineData
	LocationUpdates         []Vector3Float
}

// EmissionEngineData describes state of an emission engine
type EmissionEngineData struct {
	EngineID       uint8
	EngineType     EmitterCategory
	EngineActive   bool
	EngineStatus   uint8
	Location       Vector3Float
	Velocity       Vector3Float
	EmissionType   uint16
	BeamDefinition  BeamData
}

// BeamData describes an emission beam
type BeamData struct {
	BeamID             uint8
	BeamActive         bool
	BeamParameterIndex  uint16
	FieldOfView         float32
	FieldOfViewRotation float32
	EffectiveRadius     float32
	PeakGain            float32
	AveragePower        float32
	PropagationLoss     float32
	Pad                 uint16
}

// EventIdentifier combines site/app/entity/event IDs
type EventIdentifier struct {
	SiteNumber        uint16
	ApplicationNumber uint16
	EntityNumber      uint16
	EventNumber       uint16
}

// EmitterCategory for emission type classification
type EmitterCategory uint8

const (
	EmitterRadar    EmitterCategory = 0
	EmitterJammer   EmitterCategory = 1
	EmitterSonar   EmitterCategory = 2
	EmitterInfrared EmitterCategory = 3
	EmitterOptic   EmitterCategory = 4
)

// NewDistributedEmissionsRegenerationPDU creates a new emissions regen PDU
func NewDistributedEmissionsRegenerationPDU() *DistributedEmissionsRegenerationPDU {
	pdu := &DistributedEmissionsRegenerationPDU{}
	pdu.Header.PDUType = TypeDistributedEmissionsRegen
	pdu.Header.Family = FamilyDistributedEmission // Use existing constant
	return pdu
}

// =============================================================================
// Phase 2.3: ERP, NPG, IAP Implementation
// =============================================================================

// EntityRecoveryProtocol handles entity state recovery after network issues
type EntityRecoveryProtocol struct {
	RecoveryTimeout    time.Duration
	MaxRetries        uint8
	PendingRecoveries map[EntityID]*RecoveryState
}

// RecoveryState tracks entity recovery state
type RecoveryState struct {
	EntityID     EntityID
	Attempts     uint8
	LastAttempt  time.Time
	State        EntityState
	MissingPDUs  []uint32 // sequence numbers of missing PDUs
}

// EntityRecoveryResult for recovery operations
type EntityRecoveryResult uint8

const (
	RecoverySuccess EntityRecoveryResult = 0
	RecoveryFailed  EntityRecoveryResult = 1
	RecoveryPending  EntityRecoveryResult = 2
)

// NPGManager handles Network Performance Group operations
type NPGManager struct {
	ActiveNPGs         map[uint8]*NPG
	NextNPGID          uint8
	PerformanceMetrics NPGMetrics
}

// NPG represents a Network Performance Group
type NPG struct {
	ID               uint8
	Name             string
	ParticipantCount uint16
	BandwidthLimit   uint32
	UpdateRate       time.Duration
	Priority         uint8
}

// NPGMetrics tracks NPG performance
type NPGMetrics struct {
	TotalBandwidth  uint64
	AverageLatency  time.Duration
	PacketLossRate   float32
	ActiveNPGs      uint8
}

// NewNPGManager creates a new NPG manager
func NewNPGManager() *NPGManager {
	return &NPGManager{
		ActiveNPGs: make(map[uint8]*NPG),
		NextNPGID:  1,
	}
}

// CreateNPG creates a new NPG
func (m *NPGManager) CreateNPG(name string, bandwidthLimit uint32, updateRate time.Duration) *NPG {
	npg := &NPG{
		ID:             m.NextNPGID,
		Name:           name,
		BandwidthLimit: bandwidthLimit,
		UpdateRate:     updateRate,
		Priority:       1,
	}
	m.ActiveNPGs[m.NextNPGID] = npg
	m.NextNPGID++
	m.PerformanceMetrics.ActiveNPGs++
	return npg
}

// GetNPG retrieves an NPG by ID
func (m *NPGManager) GetNPG(id uint8) *NPG {
	return m.ActiveNPGs[id]
}

// InterAgentProtocol handles inter-federate communication
type InterAgentProtocol struct {
	AgentID         uint32
	ChannelCache    map[uint32]*AgentChannel
	PendingMessages []*AgentMessage
}

// AgentChannel represents a communication channel to another agent
type AgentChannel struct {
	RemoteAgentID uint32
	Protocol      string
	Latency       time.Duration
	MessageCount  uint64
}

// AgentMessage represents a message between agents
type AgentMessage struct {
	SourceAgentID uint32
	DestAgentID   uint32
	MessageType   uint16
	Payload       []byte
	Timestamp     time.Time
}

// =============================================================================
// Phase 2.4: Coordinate System and Orientation Encoding
// =============================================================================

// WorldCoordinateSystem handles coordinate transformations
type WorldCoordinateSystem struct {
	CoordinateSystemType CoordinateSystemType
	ReferenceOrigin      Vector3Double
	ReferenceEpoch       time.Time
}

// CoordinateSystemType enumerates supported coordinate systems
type CoordinateSystemType uint8

const (
	CoordinateSystemGeocentric   CoordinateSystemType = 0
	CoordinateSystemGeodetic     CoordinateSystemType = 1
	CoordinateSystemLocalTangent CoordinateSystemType = 2
	CoordinateSystemBodyFixed    CoordinateSystemType = 3
)

// RotationMatrix represents a 3x3 rotation matrix for orientation
type RotationMatrix [3][3]float32

// ToEulerAngles converts rotation matrix to Euler angles
func (r *RotationMatrix) ToEulerAngles() EulerAngles {
	e := EulerAngles{}
	e.Phi = float32(math.Atan2(float64(r[2][1]), float64(r[2][2])))
	e.Theta = float32(math.Asin(-float64(r[2][0])))
	e.Psi = float32(math.Atan2(float64(r[1][0]), float64(r[0][0])))
	return e
}

// FromEulerAngles creates rotation matrix from Euler angles
func RotationMatrixFromEulerAngles(e *EulerAngles) RotationMatrix {
	cp := float32(math.Cos(float64(e.Phi)))
	sp := float32(math.Sin(float64(e.Phi)))
	ct := float32(math.Cos(float64(e.Theta)))
	st := float32(math.Sin(float64(e.Theta)))
	cs := float32(math.Cos(float64(e.Psi)))
	ss := float32(math.Sin(float64(e.Psi)))

	var r RotationMatrix
	r[0][0] = ct*cs
	r[0][1] = ct*ss
	r[0][2] = -st
	r[1][0] = sp*st*cs - cp*ss
	r[1][1] = sp*st*ss + cp*cs
	r[1][2] = sp*ct
	r[2][0] = cp*st*cs + sp*ss
	r[2][1] = cp*st*ss - sp*cs
	r[2][2] = cp*ct

	return r
}

// TransformToWorld transforms a body-relative vector to world coordinates
func TransformToWorld(bodyVec *Vector3Float, orientation *EulerAngles) *Vector3Float {
	rm := RotationMatrixFromEulerAngles(orientation)

	result := &Vector3Float{}
	result.X = rm[0][0]*bodyVec.X + rm[0][1]*bodyVec.Y + rm[0][2]*bodyVec.Z
	result.Y = rm[1][0]*bodyVec.X + rm[1][1]*bodyVec.Y + rm[1][2]*bodyVec.Z
	result.Z = rm[2][0]*bodyVec.X + rm[2][1]*bodyVec.Y + rm[2][2]*bodyVec.Z

	return result
}

// VelocityRepresentation defines how velocity is encoded
type VelocityRepresentation uint8

const (
	VelocityWorldCoordinate VelocityRepresentation = 0
	VelocityBodyCoordinate  VelocityRepresentation = 1
)

// Float32ToBits converts float32 to uint32 bits
func Float32ToBits(f float32) uint32 {
	return math.Float32bits(f)
}

// Float32FromBits converts uint32 bits to float32
func Float32FromBits(b uint32) float32 {
	return math.Float32frombits(b)
}