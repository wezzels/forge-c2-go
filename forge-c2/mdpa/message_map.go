package mdpa

import (
	"fmt"
)

// MessageCategory categorizes FORGE/MDPAF messages by functional area.
type MessageCategory int

const (
	CategoryOPIR          MessageCategory = iota // Raw satellite/OPIR data ingestion
	CategoryTrackManagement                      // Track initiation, update, fusion
	CategoryEngagement                           // Engagement orders and coordination
	CategoryAlert                                // Launch warnings, threat alerts
	CategoryNetwork                             // Link status, sensor registration
)

// String returns the category name.
func (c MessageCategory) String() string {
	switch c {
	case CategoryOPIR:
		return "OPIR Processing"
	case CategoryTrackManagement:
		return "Track Management"
	case CategoryEngagement:
		return "Engagement Management"
	case CategoryAlert:
		return "Alert Dissemination"
	case CategoryNetwork:
		return "Network Management"
	default:
		return "Unknown"
	}
}

// JSeriesType represents a J-series message type number.
// These values are defined per MIL-STD-6016.
type JSeriesType uint8

// J-series message type constants (per MIL-STD-6016).
const (
	J3_TrackUpdate       JSeriesType = 3  // Track Update (J3.0)
	J4_EngagementOrder  JSeriesType = 4  // Engagement Order (J6.0)
	J5_EngagementStatus JSeriesType = 5  // Engagement Status (J6.5)
	J6_SensorRegistration JSeriesType = 6  // Sensor Registration (J7.1)
	J12_Alert           JSeriesType = 12 // Alert/Notification (J2.0)
	J15_Command         JSeriesType = 15 // Command
	J18_SpaceTrack      JSeriesType = 18 // Space Track (J18.x)
	J28_SatelliteOPIR   JSeriesType = 28 // Satellite / OPIR Track (J18.x extended)
	J2_Surveillance     JSeriesType = 2  // Surveillance/Fusion
)

// String returns the J-series type name.
func (j JSeriesType) String() string {
	switch j {
	case J2_Surveillance:
		return "J2-Surveillance"
	case J3_TrackUpdate:
		return "J3-TrackUpdate"
	case J4_EngagementOrder:
		return "J4-EngagementOrder"
	case J5_EngagementStatus:
		return "J5-EngagementStatus"
	case J6_SensorRegistration:
		return "J6-SensorRegistration"
	case J12_Alert:
		return "J12-Alert"
	case J15_Command:
		return "J15-Command"
	case J18_SpaceTrack:
		return "J18-SpaceTrack"
	case J28_SatelliteOPIR:
		return "J28-SatelliteOPIR"
	default:
		return fmt.Sprintf("J%d-Unknown", j)
	}
}

// ForgeMessageType represents a FORGE message type.
type ForgeMessageType int

// FORGE message type constants.
const (
	ForgeOPIRRawData      ForgeMessageType = 100 // Raw OPIR sensor data
	ForgeTrackInit        ForgeMessageType = 101 // Track initiation
	ForgeTrackUpdate      ForgeMessageType = 102 // Track update
	ForgeTrackFusion      ForgeMessageType = 103 // Track fusion output
	ForgeEngagementOrder  ForgeMessageType = 104 // Engagement order
	ForgeEngagementStatus ForgeMessageType = 105 // Engagement status update
	ForgeSensorRegister   ForgeMessageType = 106 // Sensor registration
	ForgeAlertLaunch      ForgeMessageType = 107 // Launch detection alert
	ForgeAlertThreat      ForgeMessageType = 108 // Threat confirmation
	ForgeCommand          ForgeMessageType = 109 // C2 command
	ForgeSpaceTrack       ForgeMessageType = 110 // Space/satellite track
)

// String returns the FORGE message type name.
func (f ForgeMessageType) String() string {
	switch f {
	case ForgeOPIRRawData:
		return "ForgeOPIRRawData"
	case ForgeTrackInit:
		return "ForgeTrackInit"
	case ForgeTrackUpdate:
		return "ForgeTrackUpdate"
	case ForgeTrackFusion:
		return "ForgeTrackFusion"
	case ForgeEngagementOrder:
		return "ForgeEngagementOrder"
	case ForgeEngagementStatus:
		return "ForgeEngagementStatus"
	case ForgeSensorRegister:
		return "ForgeSensorRegister"
	case ForgeAlertLaunch:
		return "ForgeAlertLaunch"
	case ForgeAlertThreat:
		return "ForgeAlertThreat"
	case ForgeCommand:
		return "ForgeCommand"
	case ForgeSpaceTrack:
		return "ForgeSpaceTrack"
	default:
		return fmt.Sprintf("ForgeUnknown(%d)", f)
	}
}

// JSeriesMapping maps a FORGE message type to its corresponding J-series message type
// and provides additional mapping metadata.
type JSeriesMapping struct {
	ForgeType      ForgeMessageType
	JSeriesType    JSeriesType
	Category       MessageCategory
	Description    string
	RequiredFields []string // List of required J-series fields for this message type
}

// GetMapping returns the J-series mapping for a FORGE message type.
func GetMapping(forgeType ForgeMessageType) *JSeriesMapping {
	if mapping, ok := forgeToJSeriesMap[forgeType]; ok {
		return mapping
	}
	return nil
}

// GetAllMappings returns all FORGE to J-series mappings.
func GetAllMappings() []*JSeriesMapping {
	mappings := make([]*JSeriesMapping, 0, len(forgeToJSeriesMap))
	for _, m := range forgeToJSeriesMap {
		mappings = append(mappings, m)
	}
	return mappings
}

// forgeToJSeriesMap is the master mapping from FORGE message types to J-series.
var forgeToJSeriesMap = map[ForgeMessageType]*JSeriesMapping{
	// OPIR Processing
	ForgeOPIRRawData: {
		ForgeType:      ForgeOPIRRawData,
		JSeriesType:    J28_SatelliteOPIR,
		Category:       CategoryOPIR,
		Description:    "Raw OPIR satellite data - mapped to J18.x Space Track",
		RequiredFields: []string{"SatelliteID", "TimeStamp", "Latitude", "Longitude", "IRIntensity"},
	},

	// Track Management
	ForgeTrackInit: {
		ForgeType:      ForgeTrackInit,
		JSeriesType:    J3_TrackUpdate,
		Category:       CategoryTrackManagement,
		Description:    "Track initiation - mapped to J3.0 Track Update",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "TimeStamp"},
	},
	ForgeTrackUpdate: {
		ForgeType:      ForgeTrackUpdate,
		JSeriesType:    J3_TrackUpdate,
		Category:       CategoryTrackManagement,
		Description:    "Track update - mapped to J3.0 Track Update",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "Speed", "Heading", "TimeStamp"},
	},
	ForgeTrackFusion: {
		ForgeType:      ForgeTrackFusion,
		JSeriesType:    J2_Surveillance,
		Category:       CategoryTrackManagement,
		Description:    "Fused track - mapped to J2.x Surveillance/Fusion track",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "ForceType", "TimeStamp"},
	},
	ForgeSpaceTrack: {
		ForgeType:      ForgeSpaceTrack,
		JSeriesType:    J18_SpaceTrack,
		Category:       CategoryTrackManagement,
		Description:    "Space/satellite track - mapped to J18.x Space Track",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "Velocity", "TimeStamp"},
	},

	// Engagement Management
	ForgeEngagementOrder: {
		ForgeType:      ForgeEngagementOrder,
		JSeriesType:    J4_EngagementOrder,
		Category:       CategoryEngagement,
		Description:    "Engagement order - mapped to J6.0 Engagement Order",
		RequiredFields: []string{"EngagementID", "TrackNumber", "WeaponOrder", "Priority", "TimeOnTarget"},
	},
	ForgeEngagementStatus: {
		ForgeType:      ForgeEngagementStatus,
		JSeriesType:    J5_EngagementStatus,
		Category:       CategoryEngagement,
		Description:    "Engagement status - mapped to J6.5 Engagement Status",
		RequiredFields: []string{"EngagementID", "TrackNumber", "Status", "Result"},
	},

	// Alert Dissemination
	ForgeAlertLaunch: {
		ForgeType:      ForgeAlertLaunch,
		JSeriesType:    J12_Alert,
		Category:       CategoryAlert,
		Description:    "Launch detection alert - mapped to J2.0 Alert/Notification",
		RequiredFields: []string{"AlertID", "TrackNumber", "AlertType", "Severity", "TimeStamp"},
	},
	ForgeAlertThreat: {
		ForgeType:      ForgeAlertThreat,
		JSeriesType:    J12_Alert,
		Category:       CategoryAlert,
		Description:    "Threat confirmation alert - mapped to J2.0 Alert/Notification",
		RequiredFields: []string{"AlertID", "TrackNumber", "AlertType", "Severity", "Confidence", "TimeStamp"},
	},

	// Network Management
	ForgeSensorRegister: {
		ForgeType:      ForgeSensorRegister,
		JSeriesType:    J6_SensorRegistration,
		Category:       CategoryNetwork,
		Description:    "Sensor registration - mapped to J7.1 Sensor Registration",
		RequiredFields: []string{"SensorID", "SensorType", "Location", "Capabilities"},
	},
	ForgeCommand: {
		ForgeType:      ForgeCommand,
		JSeriesType:    J15_Command,
		Category:       CategoryNetwork,
		Description:    "C2 command - mapped to J0.x Command",
		RequiredFields: []string{"CommandID", "CommandType", "TargetID", "Parameters"},
	},
}

// JSeriesToForgeMapping is the reverse mapping from J-series to FORGE types.
var JSeriesToForgeMapping = map[JSeriesType]ForgeMessageType{
	J3_TrackUpdate:        ForgeTrackUpdate,
	J2_Surveillance:      ForgeTrackFusion,
	J4_EngagementOrder:   ForgeEngagementOrder,
	J5_EngagementStatus:  ForgeEngagementStatus,
	J6_SensorRegistration: ForgeSensorRegister,
	J12_Alert:            ForgeAlertLaunch,
	J15_Command:          ForgeCommand,
	J18_SpaceTrack:       ForgeSpaceTrack,
	J28_SatelliteOPIR:   ForgeOPIRRawData,
}

// GetForgeType returns the FORGE message type for a J-series type.
func GetForgeType(jType JSeriesType) ForgeMessageType {
	if forgeType, ok := JSeriesToForgeMapping[jType]; ok {
		return forgeType
	}
	return 0 // Unknown
}

// MessageTypeInfo provides detailed information about a message type.
type MessageTypeInfo struct {
	ForgeType   ForgeMessageType
	JSeriesType JSeriesType
	Category    MessageCategory
	Description string
}

// GetMessageTypeInfo returns detailed information for all message types.
func GetMessageTypeInfo() []MessageTypeInfo {
	return []MessageTypeInfo{
		{ForgeOPIRRawData, J28_SatelliteOPIR, CategoryOPIR, "Raw OPIR satellite data ingestion"},
		{ForgeTrackInit, J3_TrackUpdate, CategoryTrackManagement, "Track initiation from sensor detection"},
		{ForgeTrackUpdate, J3_TrackUpdate, CategoryTrackManagement, "Track position/kinematic update"},
		{ForgeTrackFusion, J2_Surveillance, CategoryTrackManagement, "Fused track from multiple sensors"},
		{ForgeEngagementOrder, J4_EngagementOrder, CategoryEngagement, "Engagement order to weapon system"},
		{ForgeEngagementStatus, J5_EngagementStatus, CategoryEngagement, "Engagement status update"},
		{ForgeSensorRegister, J6_SensorRegistration, CategoryNetwork, "Sensor capability registration"},
		{ForgeAlertLaunch, J12_Alert, CategoryAlert, "Missile launch detection alert"},
		{ForgeAlertThreat, J12_Alert, CategoryAlert, "Threat confirmation alert"},
		{ForgeCommand, J15_Command, CategoryNetwork, "Command to C2BMC or sensor"},
		{ForgeSpaceTrack, J18_SpaceTrack, CategoryTrackManagement, "Space object/satellite track"},
	}
}
