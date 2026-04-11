package dis

// Electromagnetic Emission PDU (Type 24) - EW device state
type DISElectromagneticEmissionPDU struct {
	Header DISHeader
	EmitterID EntityID
	StateUpdateIndicator uint8
	NumberOfSystems uint8
	Pad uint16
	Systems [30]EmitterSystem
}

// EmitterSystem describes an EW system
type EmitterSystem struct {
	EmitterName [24]byte
	EmitterFunction uint8
	EmitterStatus uint8
	EmissionType uint8
	Location Vector3Float
}

// Designator PDU (Type 25) - laser designator state
type DISDesignatorPDU struct {
	Header DISHeader
	DesignatingEntityID EntityID
	TargetEntityID EntityID
	DesignatorCode uint16
	DesignatorOutput uint16
	SpotTargetID EntityID
	DesignatedLocation Vector3Double
	DesignatorSpotX float32
	DesignatorSpotY float32
}

// Launcher PDU (Type 29) - launcher state on vehicle
type DISLauncherPDU struct {
	Header DISHeader
	LauncherID EntityID
	LoadingType uint16
	NumberOfLauncherStationStatus uint8
	Pad uint8
	LauncherStationStatus [4]LauncherStation
}

// LauncherStation describes a single launcher station
type LauncherStation struct {
	LocationType uint8
	LauncherStationStatus uint8
	MissileType EntityType
	Quantity uint8
	Pad [3]uint8
}

// Small Arm PDU (Type 34) - infantry weapon state
type DISSmallArmPDU struct {
	Header DISHeader
	FiringEntityID EntityID
	TargetEntityID EntityID
	MuzzleVelocity float32
	FireType uint8
	NumberOfRounds uint8
	Pad uint8
	ProjectileType EntityType
}

// Supply Quantity PDU (Type 40) - resupply detail
type DISSupplyQuantityPDU struct {
	Header DISHeader
	SupplyingEntityID EntityID
	ReceivingEntityID EntityID
	SupplyType uint16
	Quantity float32
	Units uint8
	Pad [3]uint8
}

// Environmental Process PDU (Type 41) - weather/terrain
type DISEnvironmentalProcessPDU struct {
	Header DISHeader
	EnvironmentalID EntityID
	EnvironmentalSequence uint16
	StateUpdateIndicator uint8
	NumberOfEnvironmentStatus uint8
	Pad uint16
	EnvironmentStatus [6]EnvironmentStatus
	NumCoordination [3]uint16
	RequestStatus uint8
	Pad2 [3]uint8
}

// EnvironmentStatus describes environmental state
type EnvironmentStatus struct {
	StateType uint8
	StateValue float32
	StateScale uint8
	StateWrap uint8
	LocationCoord1 float32
	LocationCoord2 float32
	LocationCoord3 float32
	Orientation [3]float32
}

// Attribute PDU (Type 47) - update entity/object attributes
type DISAttributePDU struct {
	Header DISHeader
	AttributeID EntityID
	AttributeType uint16
	NumberOfAttributes uint32
	Attributes [128]Attribute
}

// Attribute is a key-value attribute
type Attribute struct {
	AttributeType uint32
	AttributeSize uint32
	AttributeValue [40]byte
}

// Sequence Segmented Data PDU (Type 55) - large data transfer
type DISSequenceSegmentedDataPDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	DataType uint32
	SequenceNumber uint16
	SegementNumber uint16
	NumberOfSegments uint16
	TotalSegments uint16
	OffsetUInt uint32
	TotalDataLength uint32
	DataSignature [48]byte
	VariableData []byte
}

// EW System Function codes
const (
	EmitterFunctionRadar = 0
	EmitterFunctionJammer = 1
	EmitterFunctionESM = 2
	EmitterFunctionAcoustic = 3
	EmitterFunctionSonar = 4
)

// Designator codes
const (
	DesignatorOther = 0
	DesignatorLaser = 1
	DesignatorIR = 2
	DesignatorEO = 3
)
