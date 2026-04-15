package jreap

import (
	"forge-c2/jreap/jseries"
)

// MessageType represents a J-series message type number.
// These are the standard Link 16 / MIL-STD-6016 message types relevant to FORGE.
//
// Categories:
//   - J0.x: Network Management
//   - J2.x: Surveillance / Track Management
//   - J3.x: Track Update / Position
//   - J4.x: Weapon / Engagement Management
//   - J5.x: Engagement Status
//   - J6.x: Engagement Coordination
//   - J7.x: Sensor / Platform Management
//   - J12.x: Information Management
//   - J18.x: Space / Satellite
type MessageType uint8

//go:generate stringer -type=MessageType -linecomment

// J-series message types relevant to FORGE missile defense.
const (
	J0_TrackManagement     MessageType = 0  // Track Management
	J1_NetworkInitialize   MessageType = 1  // Network Initialization
	J2_Surveillance        MessageType = 2  // Surveillance
	J3_TrackUpdate         MessageType = 3  // Track Update (J3.0)
	J4_EngagementOrder     MessageType = 4  // Engagement Order (J6.0)
	J5_EngagementStatus    MessageType = 5  // Engagement Status (J6.5)
	J6_SensorRegistration  MessageType = 6  // Sensor Registration (J7.1)
	J7_Platform            MessageType = 7  // Platform/Sensor Data
	J8_Radio               MessageType = 8  // Radio (Voice/Data)
	J9_ElectronicAttack    MessageType = 9  // Electronic Warfare
	J10_Offset             MessageType = 10 // Offset
	J11_DataTransfer       MessageType = 11 // Data Transfer
	J12_Alert              MessageType = 12 // Alert/Notification (J2.0)
	J13_PreciseParticipant MessageType = 13 // Precise Participant
	J14_ProcessSpec        MessageType = 14 // Process Spec
	J15_Command            MessageType = 15 // Command
	J16_Acknowledge        MessageType = 16 // Acknowledge
	J17_InitiateTransfer   MessageType = 17 // Initiate Transfer
	J18_SpaceTrack         MessageType = 18 // Space Track (J18.x)
	J19_Component          MessageType = 19 // Component/Part
	J20_AirTrack           MessageType = 20 // Air Track
	J21_SurfaceTrack       MessageType = 21 // Surface Track
	J22_SubsurfaceTrack    MessageType = 22 // Subsurface Track
	J23_LandTrack          MessageType = 23 // Land Track
	J24_ForeignEquipment   MessageType = 24 // Foreign Equipment
	J25_ProductionLevel    MessageType = 25 // Production Level
	J26_Test               MessageType = 26 // Test
	J27_Time               MessageType = 27 // Time
	J28_SatelliteOPIR      MessageType = 28 // Satellite / OPIR Track (J18.x extended)
	J29_Symbology          MessageType = 29 // Symbology
	J30_IFF                MessageType = 30 // IFF
	J31_FileTransfer       MessageType = 31 // File Transfer
)

// String implements fmt.Stringer for MessageType.
func (m MessageType) String() string {
	switch m {
	case J0_TrackManagement:
		return "J0-TrackManagement"
	case J1_NetworkInitialize:
		return "J1-NetworkInitialize"
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
	case J7_Platform:
		return "J7-Platform"
	case J8_Radio:
		return "J8-Radio"
	case J9_ElectronicAttack:
		return "J9-ElectronicAttack"
	case J10_Offset:
		return "J10-Offset"
	case J11_DataTransfer:
		return "J11-DataTransfer"
	case J12_Alert:
		return "J12-Alert"
	case J13_PreciseParticipant:
		return "J13-PreciseParticipant"
	case J14_ProcessSpec:
		return "J14-ProcessSpec"
	case J15_Command:
		return "J15-Command"
	case J16_Acknowledge:
		return "J16-Acknowledge"
	case J17_InitiateTransfer:
		return "J17-InitiateTransfer"
	case J18_SpaceTrack:
		return "J18-SpaceTrack"
	case J19_Component:
		return "J19-Component"
	case J20_AirTrack:
		return "J20-AirTrack"
	case J21_SurfaceTrack:
		return "J21-SurfaceTrack"
	case J22_SubsurfaceTrack:
		return "J22-SubsurfaceTrack"
	case J23_LandTrack:
		return "J23-LandTrack"
	case J24_ForeignEquipment:
		return "J24-ForeignEquipment"
	case J25_ProductionLevel:
		return "J25-ProductionLevel"
	case J26_Test:
		return "J26-Test"
	case J27_Time:
		return "J27-Time"
	case J28_SatelliteOPIR:
		return "J28-SatelliteOPIR"
	case J29_Symbology:
		return "J29-Symbology"
	case J30_IFF:
		return "J30-IFF"
	case J31_FileTransfer:
		return "J31-FileTransfer"
	default:
		return "J?-Unknown"
	}
}

// Category returns the broad functional category for this message type.
func (m MessageType) Category() string {
	switch {
	case m >= 0 && m <= 1:
		return "Network"
	case m >= 2 && m <= 3:
		return "Surveillance/Track"
	case m >= 4 && m <= 5:
		return "Engagement"
	case m >= 6 && m <= 7:
		return "Sensor/Platform"
	case m >= 8 && m <= 9:
		return "EW/Radio"
	case m >= 10 && m <= 11:
		return "Data/Transfer"
	case m == 12:
		return "Alert"
	case m >= 13 && m <= 19:
		return "Special"
	case m >= 20 && m <= 25:
		return "Track (Domain)"
	case m >= 26 && m <= 27:
		return "Test/Time"
	case m >= 28 && m <= 31:
		return "Space/Symbology"
	default:
		return "Unknown"
	}
}

// PayloadSize returns the fixed payload size for this message type in bytes.
// Returns 0 for variable-length messages (J8, J31).
func (m MessageType) PayloadSize() int {
	switch m {
	case J0_TrackManagement:
		return jseries.J0PayloadSize
	case J1_NetworkInitialize:
		return jseries.J1PayloadSize
	case J2_Surveillance:
		return jseries.J2PayloadSize
	case J3_TrackUpdate:
		return jseries.J3PayloadSize
	case J4_EngagementOrder:
		return jseries.J4PayloadSize
	case J5_EngagementStatus:
		return jseries.J5PayloadSize
	case J6_SensorRegistration:
		return jseries.J6PayloadSize
	case J7_Platform:
		return jseries.J7PayloadSize
	case J8_Radio:
		return -1 // variable length
	case J9_ElectronicAttack:
		return jseries.J9PayloadSize
	case J10_Offset:
		return jseries.J10PayloadSize
	case J11_DataTransfer:
		return jseries.J11PayloadSize
	case J12_Alert:
		return jseries.J12PayloadSize
	case J13_PreciseParticipant:
		return jseries.J13PayloadSize
	case J14_ProcessSpec:
		return jseries.J14PayloadSize
	case J15_Command:
		return jseries.J15PayloadSize
	case J16_Acknowledge:
		return jseries.J16PayloadSize
	case J17_InitiateTransfer:
		return jseries.J17PayloadSize
	case J18_SpaceTrack:
		return jseries.J18PayloadSize
	case J19_Component:
		return jseries.J19PayloadSize
	case J20_AirTrack:
		return jseries.J20PayloadSize
	case J21_SurfaceTrack:
		return jseries.J21PayloadSize
	case J22_SubsurfaceTrack:
		return jseries.J22PayloadSize
	case J23_LandTrack:
		return jseries.J23PayloadSize
	case J24_ForeignEquipment:
		return jseries.J24PayloadSize
	case J25_ProductionLevel:
		return jseries.J25PayloadSize
	case J26_Test:
		return jseries.J26PayloadSize
	case J27_Time:
		return jseries.J27PayloadSize
	case J28_SatelliteOPIR:
		return jseries.J28PayloadSize
	case J29_Symbology:
		return jseries.J29PayloadSize
	case J30_IFF:
		return jseries.J30PayloadSize
	case J31_FileTransfer:
		return -1 // variable length
	default:
		return 0
	}
}
