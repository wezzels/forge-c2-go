package dis

// Logistics & Simulation Management PDU Types

// Service Request PDU (Type 5) - logistics
type DISServiceRequestPDU struct {
	Header DISHeader
	RequestingEntityID EntityID
	Services uint16
	ServiceTypeRequestID uint16
	NumberOfSupplyTypes uint8
	Pad uint8
}

// Resupply Offer PDU (Type 8)
type DISResupplyOfferPDU struct {
	Header DISHeader
	OfferingEntityID EntityID
	ReceivingEntityID EntityID
	Services uint16
	SupplyTypes [30]SupplyType
	Pad uint8
}

// SupplyType describes a supply type for resupply
type SupplyType struct {
	SupplyType uint16
	Quantity   float32
}

// Resupply Received PDU (Type 9)
type DISResupplyReceivedPDU struct {
	Header DISHeader
	ReceivingEntityID EntityID
	SupplyingEntityID EntityID
	Services uint16
	Pad uint8
	NumberOfSupplyTypes uint8
	FillLevel [6]float32
}

// Resupply Cancel PDU (Type 10)
type DISResupplyCancelPDU struct {
	Header DISHeader
	ReceivingEntityID EntityID
	OfferingEntityID EntityID
	Services uint16
}

// Repair Response PDU (Type 11)
type DISRepairResponsePDU struct {
	Header DISHeader
	ReceivingEntityID EntityID
	RepairingEntityID EntityID
	RepairResult uint16
	Pad uint8
}

// Create Entity PDU (Type 12)
type DISCreateEntityPDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	EntityIDCreated EntityID
	NumberOfCreateResult uint8
	CreateResult uint8
	Pad uint8
}

// Remove Entity PDU (Type 13)
type DISRemoveEntityPDU struct {
	Header DISHeader
	RequestingEntityID EntityID
	EntityIDRemoved EntityID
	NumberOfRemoveResult uint8
	RemoveResult uint8
	Pad uint8
}

// Start Resume PDU (Type 14)
type DISStartResumePDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	ReceiveInfo EntityID
	RealWorldTime Timestamp
	SimulationTime Timestamp
	Level uint8
	Pad [3]uint8
}

// Stop Freeze PDU (Type 15)
type DISStopFreezePDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	ReceiveInfo EntityID
	RealWorldTime Timestamp
	NumberOfRIDs uint8
	Pad [3]uint8
}

// Timestamp for DIS
type Timestamp struct {
	Absolute uint32
	Seconds  uint32
	Hour uint8
	Minute uint8
	PartTenThousandths uint16
}

// Action Request PDU (Type 17)
type DISActionRequestPDU struct {
	Header DISHeader
	RequestingEntityID EntityID
	ReceiveInfo EntityID
	ActionID ActionIdentifier
	NumFixedData uint32
	NumVariableData uint32
	FixedData [448]byte
}

// Action Identifier
type ActionIdentifier struct {
	ActionType uint16
	EntityID EntityID
}

// Data Query PDU (Type 19)
type DISDataQueryPDU struct {
	Header DISHeader
	RequestingEntityID EntityID
	ReceivingEntityID EntityID
	Clock uint32
	NumFixedData uint16
	NumVariableData uint16
	DataFilter [56]uint32
}

// Set Data PDU (Type 20)
type DISSetDataPDU struct {
	Header DISHeader
	RequestingEntityID EntityID
	ReceivingEntityID EntityID
	NumFixedData uint32
	NumVariableData uint32
	OffsetUInt uint32
	DataLength uint32
	VariableData []byte
}

// Data PDU (Type 21)
type DISDataPDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	ReceiveInfo EntityID
	NumFixedData uint32
	NumVariableData uint32
	FixedData [172]byte
	VariableData []byte
}

// Event Report PDU (Type 22)
type DISEventReportPDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	EventType uint32
	NumFixedData uint32
	NumVariableData uint32
	FixedDatav [60]byte
	VariableData []byte
}

// Comment PDU (Type 23)
type DISCommentPDU struct {
	Header DISHeader
	OriginatingEntityID EntityID
	NumFixedData uint32
	NumVariableData uint32
	VariableData []byte
}

// Supply type codes
const (
	SupplyClass1Ammo = 1
	SupplyClass2Fuel = 2
	SupplyClass3Goods = 3
	SupplyClass4Material = 4
	SupplyClass5Repair = 5
)

// Repair type codes
const (
	RepairNoAction = 0
	RepairOther = 1
	RepairEngine = 2
	RepairTransmission = 3
	RepairFuel = 4
)

// Create/Remove result codes
const (
	CreateResultSuccess = 0
	CreateResultFail = 1
	RemoveResultSuccess = 0
	RemoveResultFail = 1
)



// NewResupplyOfferPDU creates a resupply offer
func NewResupplyOfferPDU(offerEntity, receiveEntity EntityID) *DISResupplyOfferPDU {
	pdu := &DISResupplyOfferPDU{}
	pdu.Header.PDUType = 8
	pdu.Header.Family = FamilyEntityManagement
	pdu.OfferingEntityID = offerEntity
	pdu.ReceivingEntityID = receiveEntity
	return pdu
}

// NewResupplyReceivedPDU creates a resupply received
func NewResupplyReceivedPDU(recv, supply EntityID) *DISResupplyReceivedPDU {
	pdu := &DISResupplyReceivedPDU{}
	pdu.Header.PDUType = 9
	pdu.Header.Family = FamilyEntityManagement
	pdu.ReceivingEntityID = recv
	pdu.SupplyingEntityID = supply
	return pdu
}

// NewResupplyCancelPDU creates a resupply cancel
func NewResupplyCancelPDU(recv, offer EntityID) *DISResupplyCancelPDU {
	pdu := &DISResupplyCancelPDU{}
	pdu.Header.PDUType = 10
	pdu.Header.Family = FamilyEntityManagement
	pdu.ReceivingEntityID = recv
	pdu.OfferingEntityID = offer
	return pdu
}

// NewRepairResponsePDU creates a repair response
func NewRepairResponsePDU(recv, repair EntityID, result uint16) *DISRepairResponsePDU {
	pdu := &DISRepairResponsePDU{}
	pdu.Header.PDUType = 11
	pdu.Header.Family = FamilyEntityManagement
	pdu.ReceivingEntityID = recv
	pdu.RepairingEntityID = repair
	pdu.RepairResult = result
	return pdu
}

// NewCreateEntityPDU creates a create entity PDU
func NewCreateEntityPDU(origEntity EntityID) *DISCreateEntityPDU {
	pdu := &DISCreateEntityPDU{}
	pdu.Header.PDUType = TypeCreateEntity
	pdu.Header.Family = FamilyEntityManagement
	pdu.OriginatingEntityID = origEntity
	pdu.CreateResult = CreateResultSuccess
	return pdu
}

// NewRemoveEntityPDU creates a remove entity PDU
func NewRemoveEntityPDU(reqEntity EntityID) *DISRemoveEntityPDU {
	pdu := &DISRemoveEntityPDU{}
	pdu.Header.PDUType = TypeRemoveEntity
	pdu.Header.Family = FamilyEntityManagement
	pdu.RequestingEntityID = reqEntity
	pdu.RemoveResult = RemoveResultSuccess
	return pdu
}

// NewStartResumePDU creates a start/resume PDU
func NewStartResumePDU(orig EntityID) *DISStartResumePDU {
	pdu := &DISStartResumePDU{}
	pdu.Header.PDUType = TypeStartResume
	pdu.Header.Family = FamilyEntityManagement
	pdu.OriginatingEntityID = orig
	return pdu
}

// NewStopFreezePDU creates a stop/freeze PDU
func NewStopFreezePDU(orig EntityID) *DISStopFreezePDU {
	pdu := &DISStopFreezePDU{}
	pdu.Header.PDUType = TypeStopFreeze
	pdu.Header.Family = FamilyEntityManagement
	pdu.OriginatingEntityID = orig
	return pdu
}
