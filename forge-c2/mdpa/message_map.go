package mdpa

import (
	"fmt"

	"forge-c2/jreap"
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
	JSeriesType    jreap.MessageType
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
		JSeriesType:    jreap.J28_SatelliteOPIR,
		Category:       CategoryOPIR,
		Description:    "Raw OPIR satellite data - mapped to J18.x Space Track",
		RequiredFields: []string{"SatelliteID", "TimeStamp", "Latitude", "Longitude", "IRIntensity"},
	},

	// Track Management
	ForgeTrackInit: {
		ForgeType:      ForgeTrackInit,
		JSeriesType:    jreap.J3_TrackUpdate,
		Category:       CategoryTrackManagement,
		Description:    "Track initiation - mapped to J3.0 Track Update",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "TimeStamp"},
	},
	ForgeTrackUpdate: {
		ForgeType:      ForgeTrackUpdate,
		JSeriesType:    jreap.J3_TrackUpdate,
		Category:       CategoryTrackManagement,
		Description:    "Track update - mapped to J3.0 Track Update",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "Speed", "Heading", "TimeStamp"},
	},
	ForgeTrackFusion: {
		ForgeType:      ForgeTrackFusion,
		JSeriesType:    jreap.J2_Surveillance,
		Category:       CategoryTrackManagement,
		Description:    "Fused track - mapped to J2.x Surveillance/Fusion track",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "ForceType", "TimeStamp"},
	},
	ForgeSpaceTrack: {
		ForgeType:      ForgeSpaceTrack,
		JSeriesType:    jreap.J18_SpaceTrack,
		Category:       CategoryTrackManagement,
		Description:    "Space/satellite track - mapped to J18.x Space Track",
		RequiredFields: []string{"TrackNumber", "Latitude", "Longitude", "Altitude", "Velocity", "TimeStamp"},
	},

	// Engagement Management
	ForgeEngagementOrder: {
		ForgeType:      ForgeEngagementOrder,
		JSeriesType:    jreap.J4_EngagementOrder,
		Category:       CategoryEngagement,
		Description:    "Engagement order - mapped to J6.0 Engagement Order",
		RequiredFields: []string{"EngagementID", "TrackNumber", "WeaponOrder", "Priority", "TimeOnTarget"},
	},
	ForgeEngagementStatus: {
		ForgeType:      ForgeEngagementStatus,
		JSeriesType:    jreap.J5_EngagementStatus,
		Category:       CategoryEngagement,
		Description:    "Engagement status - mapped to J6.5 Engagement Status",
		RequiredFields: []string{"EngagementID", "TrackNumber", "Status", "Result"},
	},

	// Alert Dissemination
	ForgeAlertLaunch: {
		ForgeType:      ForgeAlertLaunch,
		JSeriesType:    jreap.J12_Alert,
		Category:       CategoryAlert,
		Description:    "Launch detection alert - mapped to J2.0 Alert/Notification",
		RequiredFields: []string{"AlertID", "TrackNumber", "AlertType", "Severity", "TimeStamp"},
	},
	ForgeAlertThreat: {
		ForgeType:      ForgeAlertThreat,
		JSeriesType:    jreap.J12_Alert,
		Category:       CategoryAlert,
		Description:    "Threat confirmation alert - mapped to J2.0 Alert/Notification",
		RequiredFields: []string{"AlertID", "TrackNumber", "AlertType", "Severity", "Confidence", "TimeStamp"},
	},

	// Network Management
	ForgeSensorRegister: {
		ForgeType:      ForgeSensorRegister,
		JSeriesType:    jreap.J6_SensorRegistration,
		Category:       CategoryNetwork,
		Description:    "Sensor registration - mapped to J7.1 Sensor Registration",
		RequiredFields: []string{"SensorID", "SensorType", "Location", "Capabilities"},
	},
	ForgeCommand: {
		ForgeType:      ForgeCommand,
		JSeriesType:    jreap.J15_Command,
		Category:       CategoryNetwork,
		Description:    "C2 command - mapped to J0.x Command",
		RequiredFields: []string{"CommandID", "CommandType", "TargetID", "Parameters"},
	},
}

// JSeriesToForgeMapping is the reverse mapping from J-series to FORGE types.
var JSeriesToForgeMapping = map[jreap.MessageType]ForgeMessageType{
	jreap.J3_TrackUpdate:       ForgeTrackUpdate,
	jreap.J2_Surveillance:      ForgeTrackFusion,
	jreap.J4_EngagementOrder:   ForgeEngagementOrder,
	jreap.J5_EngagementStatus:  ForgeEngagementStatus,
	jreap.J6_SensorRegistration: ForgeSensorRegister,
	jreap.J12_Alert:            ForgeAlertLaunch,
	jreap.J15_Command:          ForgeCommand,
	jreap.J18_SpaceTrack:       ForgeSpaceTrack,
	jreap.J28_SatelliteOPIR:    ForgeOPIRRawData,
}

// GetForgeType returns the FORGE message type for a J-series type.
func GetForgeType(jType jreap.MessageType) ForgeMessageType {
	if forgeType, ok := JSeriesToForgeMapping[jType]; ok {
		return forgeType
	}
	return 0 // Unknown
}

// MessageTypeInfo provides detailed information about a message type.
type MessageTypeInfo struct {
	ForgeType   ForgeMessageType
	JSeriesType jreap.MessageType
	Category    MessageCategory
	Description string
}

// GetMessageTypeInfo returns detailed information for all message types.
func GetMessageTypeInfo() []MessageTypeInfo {
	return []MessageTypeInfo{
		{ForgeOPIRRawData, jreap.J28_SatelliteOPIR, CategoryOPIR, "Raw OPIR satellite data ingestion"},
		{ForgeTrackInit, jreap.J3_TrackUpdate, CategoryTrackManagement, "Track initiation from sensor detection"},
		{ForgeTrackUpdate, jreap.J3_TrackUpdate, CategoryTrackManagement, "Track position/kinematic update"},
		{ForgeTrackFusion, jreap.J2_Surveillance, CategoryTrackManagement, "Fused track from multiple sensors"},
		{ForgeEngagementOrder, jreap.J4_EngagementOrder, CategoryEngagement, "Engagement order to weapon system"},
		{ForgeEngagementStatus, jreap.J5_EngagementStatus, CategoryEngagement, "Engagement status update"},
		{ForgeSensorRegister, jreap.J6_SensorRegistration, CategoryNetwork, "Sensor capability registration"},
		{ForgeAlertLaunch, jreap.J12_Alert, CategoryAlert, "Missile launch detection alert"},
		{ForgeAlertThreat, jreap.J12_Alert, CategoryAlert, "Threat confirmation alert"},
		{ForgeCommand, jreap.J15_Command, CategoryNetwork, "Command to C2BMC or sensor"},
		{ForgeSpaceTrack, jreap.J18_SpaceTrack, CategoryTrackManagement, "Space object/satellite track"},
	}
}
