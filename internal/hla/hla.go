// Package hla implements HLA (IEEE 1516) federation interface for FORGE-C2.
// HLA provides simulation interoperability for distributed military training.
package hla

import (
	"encoding/binary"
	"unsafe"
	"fmt"
	"strings"
	"time"
)

// HLA Object Model Types
const (
	FOMVersion  = "IEEE1516-2010"
	RTIVersion = "1516.2010"
)

// Federate Types
const (
	FederateTypeFORGE   = "FORGE-C2"
	FederateTypeSensor  = "SENSOR"
	FederateTypeWeapon  = "WEAPON"
	FederateTypeTracker = "TRACKER"
	FederateTypeGateway = "GATEWAY"
	FederateTypeCommand = "COMMAND"
)

// HLA Update Rate Designators
const (
	UpdateRateSimulated  = "Simulated"
	UpdateRateBestEffort = "Best Effort"
	UpdateRateDataDriven = "Data Driven"
	UpdateRateRealTime   = "RealTime"
)

// Object Class Handles
const (
	HandleObjectRoot       = 1
	HandleObjectEntity     = 2
	HandleObjectTrack      = 3
	HandleObjectEngagement = 4
	HandleObjectSensor     = 5
	HandleObjectWeapon     = 6
)

// Attribute Handles
const (
	HandleAttrEntityID       = 1
	HandleAttrPosition       = 2
	HandleAttrOrientation    = 3
	HandleAttrVelocity       = 4
	HandleAttrAcceleration   = 5
	HandleAttrEntityType     = 6
	HandleAttrForceID        = 7
	HandleAttrMarking        = 8
	HandleAttrDamageState   = 9
	HandleAttrTrackNumber    = 10
	HandleAttrTrackQuality   = 11
	HandleAttrCorrelationID   = 12
	HandleAttrEngagementID   = 13
	HandleAttrTargetID       = 14
	HandleAttrWeaponState    = 15
	HandleAttrMunitionType   = 16
)

// HLAObjectRoot is the base object class.
type HLAObjectRoot struct {
	ObjectInstanceHandle uint32
	Name                string
	Owner               string
	State               ObjectState
}

// ObjectState tracks publication/subscription state.
type ObjectState struct {
	Published  bool
	Subscribed bool
	Updated    bool
	UpdateRate string
	LastUpdate time.Time
}

// HLAEntity represents a generic simulation entity.
type HLAEntity struct {
	HLAObjectRoot
	EntityID      EntityID
	Position     CartesianCoordinates
	Orientation  Orientation
	Velocity     VelocityVector
	Acceleration AccelerationVector
	EntityType   EntityType
	ForceID      ForceIdentifier
	Marking      string
	DamageState  DamageState
}

// EntityID identifies an entity in the federation.
type EntityID struct {
	SiteNumber        uint16
	ApplicationNumber uint16
	EntityNumber      uint16
}

// CartesianCoordinates is a 3D position in meters.
type CartesianCoordinates struct {
	X float64
	Y float64
	Z float64
}

// Orientation is roll/pitch/yaw in radians.
type Orientation struct {
	Psi   float64
	Theta float64
	Phi   float64
}

// VelocityVector is velocity in m/s.
type VelocityVector struct {
	X float64
	Y float64
	Z float64
}

// AccelerationVector is acceleration in m/s².
type AccelerationVector struct {
	X float64
	Y float64
	Z float64
}

// EntityType classifies the entity.
type EntityType struct {
	Kind        uint8
	Domain      uint8
	Country     uint16
	Category    uint8
	Subcategory uint8
	Specific    uint8
	Extra       uint8
}

// ForceIdentifier identifies the force affiliation.
type ForceIdentifier uint8

const (
	ForceOther    ForceIdentifier = 0
	ForceFriendly ForceIdentifier = 1
	ForceOpposing ForceIdentifier = 2
	ForceNeutral  ForceIdentifier = 3
)

// DamageState describes entity damage.
type DamageState uint8

const (
	DamageNoDamage  DamageState = 0
	DamageSlight    DamageState = 1
	DamageModerate   DamageState = 2
	DamageDestroyed  DamageState = 3
	DamageUnknown    DamageState = 4
)

// HLAUpdateHeader is the standard HLA update message header.
type HLAUpdateHeader struct {
	Marks                   [4]byte
	MessageLength           uint32
	FederateHandle         uint32
	ObjectInstanceHandle   uint32
	AttributeCount         uint16
	SentTime               time.Time
}

// HLAMessageSize is the header size for an update.
const HLAMessageSize = 26

// PackHLAUpdateHeader packs an HLA update header.
func PackHLAUpdateHeader(h *HLAUpdateHeader, buf []byte) {
	off := 0
	copy(buf[off:], h.Marks[:])
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], h.MessageLength)
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], h.FederateHandle)
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], h.ObjectInstanceHandle)
	off += 4
	binary.LittleEndian.PutUint16(buf[off:], h.AttributeCount)
	off += 2
	ms := uint64(h.SentTime.UnixMilli())
	binary.LittleEndian.PutUint64(buf[off:], ms)
}

// UnpackHLAUpdateHeader unpacks an HLA update header.
func UnpackHLAUpdateHeader(buf []byte) *HLAUpdateHeader {
	if len(buf) < HLAMessageSize {
		return nil
	}
	h := &HLAUpdateHeader{}
	off := 0
	copy(h.Marks[:], buf[off:])
	off += 4
	h.MessageLength = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.FederateHandle = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.ObjectInstanceHandle = binary.LittleEndian.Uint32(buf[off:])
	off += 4
	h.AttributeCount = binary.LittleEndian.Uint16(buf[off:])
	off += 2
	ms := binary.LittleEndian.Uint64(buf[off:])
	h.SentTime = time.UnixMilli(int64(ms))
	return h
}

// HLAAttributeHeader is packed attribute data.
type HLAAttributeHeader struct {
	AttributeHandle uint32
	DataType        uint16
	Length          uint16
}

// PackHLAAttribute packs a single attribute.
func PackHLAAttribute(handle uint32, data []byte, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint32(buf[off:], handle)
	off += 4
	var dtype uint16 = 3
	if len(data) <= 8 {
		dtype = 2
	}
	binary.LittleEndian.PutUint16(buf[off:], dtype)
	off += 2
	binary.LittleEndian.PutUint16(buf[off:], uint16(len(data)))
	off += 2
	copy(buf[off:], data)
	return 4 + 2 + 2 + len(data)
}

// PackEntityAttributes packs entity attributes into a buffer.
func PackEntityAttributes(e *HLAEntity, buf []byte) int {
	off := 0

	// Entity ID (6 bytes)
	var entityIDData [6]byte
	binary.LittleEndian.PutUint16(entityIDData[0:2], e.EntityID.SiteNumber)
	binary.LittleEndian.PutUint16(entityIDData[2:4], e.EntityID.ApplicationNumber)
	binary.LittleEndian.PutUint16(entityIDData[4:6], e.EntityID.EntityNumber)
	n := PackHLAAttribute(HandleAttrEntityID, entityIDData[:], buf[off:])
	off += n

	// Position (24 bytes - 3 x 8-byte floats)
	var posData [24]byte
	binary.LittleEndian.PutUint64(posData[0:8], floatToBits(e.Position.X))
	binary.LittleEndian.PutUint64(posData[8:16], floatToBits(e.Position.Y))
	binary.LittleEndian.PutUint64(posData[16:24], floatToBits(e.Position.Z))
	n = PackHLAAttribute(HandleAttrPosition, posData[:], buf[off:])
	off += n

	// Velocity (24 bytes)
	var velData [24]byte
	binary.LittleEndian.PutUint64(velData[0:8], floatToBits(e.Velocity.X))
	binary.LittleEndian.PutUint64(velData[8:16], floatToBits(e.Velocity.Y))
	binary.LittleEndian.PutUint64(velData[16:24], floatToBits(e.Velocity.Z))
	n = PackHLAAttribute(HandleAttrVelocity, velData[:], buf[off:])
	off += n

	// Entity Type (8 bytes)
	var typeData [8]byte
	typeData[0] = e.EntityType.Kind
	typeData[1] = e.EntityType.Domain
	binary.LittleEndian.PutUint16(typeData[2:4], e.EntityType.Country)
	typeData[4] = e.EntityType.Category
	typeData[5] = e.EntityType.Subcategory
	typeData[6] = e.EntityType.Specific
	typeData[7] = e.EntityType.Extra
	n = PackHLAAttribute(HandleAttrEntityType, typeData[:], buf[off:])
	off += n

	// Marking (string)
	n = PackHLAAttribute(HandleAttrMarking, []byte(e.Marking), buf[off:])
	off += n

	return off
}

// UnpackEntityAttributes unpacks entity attributes from a buffer.
func UnpackEntityAttributes(buf []byte) *HLAEntity {
	e := &HLAEntity{}
	off := 0

	for off+8 < len(buf) {
		handle := binary.LittleEndian.Uint32(buf[off:])
		off += 4
		binary.LittleEndian.Uint16(buf[off:])
		off += 2
		length := binary.LittleEndian.Uint16(buf[off:])
		off += 2

		data := buf[off : off+int(length)]
		off += int(length)

		switch handle {
		case HandleAttrEntityID:
			if len(data) >= 6 {
				e.EntityID.SiteNumber = binary.LittleEndian.Uint16(data[0:2])
				e.EntityID.ApplicationNumber = binary.LittleEndian.Uint16(data[2:4])
				e.EntityID.EntityNumber = binary.LittleEndian.Uint16(data[4:6])
			}
		case HandleAttrPosition:
			if len(data) >= 24 {
				e.Position.X = bitsToFloat(binary.LittleEndian.Uint64(data[0:8]))
				e.Position.Y = bitsToFloat(binary.LittleEndian.Uint64(data[8:16]))
				e.Position.Z = bitsToFloat(binary.LittleEndian.Uint64(data[16:24]))
			}
		case HandleAttrEntityType:
			if len(data) >= 8 {
				e.EntityType.Kind = data[0]
				e.EntityType.Domain = data[1]
				e.EntityType.Country = binary.LittleEndian.Uint16(data[2:4])
				e.EntityType.Category = data[4]
				e.EntityType.Subcategory = data[5]
				e.EntityType.Specific = data[6]
				e.EntityType.Extra = data[7]
			}
		case HandleAttrMarking:
			e.Marking = strings.TrimRight(string(data), "\x00")
		}
	}

	return e
}

// NewEntity creates a new HLA entity with defaults.
func NewEntity(site, app, entity uint16) *HLAEntity {
	return &HLAEntity{
		HLAObjectRoot: HLAObjectRoot{
			ObjectInstanceHandle: uint32(site<<16 | app),
			Name:                fmt.Sprintf("Entity-%d-%d-%d", site, app, entity),
			State: ObjectState{
				Published:  true,
				Subscribed: true,
				UpdateRate: UpdateRateSimulated,
			},
		},
		EntityID: EntityID{
			SiteNumber:        site,
			ApplicationNumber: app,
			EntityNumber:      entity,
		},
		EntityType: EntityType{
			Kind:    1,
			Domain:  2,
			Country: 200,
		},
		ForceID: ForceFriendly,
	}
}

// SetLocation sets the entity position.
func (e *HLAEntity) SetLocation(x, y, z float64) {
	e.Position = CartesianCoordinates{X: x, Y: y, Z: z}
}

// SetOrientation sets the entity orientation in radians.
func (e *HLAEntity) SetOrientation(phi, theta, psi float64) {
	e.Orientation = Orientation{Phi: phi, Theta: theta, Psi: psi}
}

// SetVelocity sets the entity velocity in m/s.
func (e *HLAEntity) SetVelocity(x, y, z float64) {
	e.Velocity = VelocityVector{X: x, Y: y, Z: z}
}

// String implements fmt.Stringer.
func (e *HLAEntity) String() string {
	return fmt.Sprintf("HLAEntity[%s @ (%.2f, %.2f, %.2f)]",
		e.Name, e.Position.X, e.Position.Y, e.Position.Z)
}

// Helper functions for float <-> uint64 conversion
func floatToBits(f float64) uint64 {
	return binary.LittleEndian.Uint64((*[8]byte)(unsafe.Pointer(&f))[:])
}

func bitsToFloat(bits uint64) float64 {
	var f float64
	binary.LittleEndian.PutUint64((*[8]byte)(unsafe.Pointer(&f))[:], bits)
	return f
}

var _ = fmt.Sprintf

// =============================================================================
// RTI Ambassador Interface (IEEE 1516)
// =============================================================================

// RTI Ambassador provides federation management services.
// This is the "fed ambassadors" side - the interface federates use to talk to the RTI.

// FederationExecutionData tracks a running federation
type FederationExecutionData struct {
	Name              string
	FederateHandle    uint32
	FederationName    string
	FederateType      string
	FederateName      string
	RTIVersion        string
	JoinTime          time.Time
	IsAnnounced       bool
	IsConstrained     bool
	IsRegulating      bool
	SyncPoints       map[string]*SynchronizationPoint
	SaveStatus       *SaveStatus
}

// SynchronizationPoint tracks sync point state
type SynchronizationPoint struct {
	Label          string
	Tag            []byte
	Federates      []string
	State          SyncState
}

// SyncState tracks synchronization point progress
type SyncState uint8

const (
	SyncStatePending SyncState = iota
	SyncStateAnnounced
	SyncStateAchieved
	SyncStateRegistered
)

// SaveStatus tracks federation save progress
type SaveStatus struct {
	Label       string
	Time        time.Time
	Initiating  bool
	InProgress   bool
	Complete     bool
	Failed      bool
	ErrorReason string
}

// RTI Ambassador Interface - Federation Management
type RTIAmbase interface {
	// CreateFederationExecution creates a new federation execution
	CreateFederationExecution(name, fom string, params map[string]string) error

	// DestroyFederationExecution destroys a federation execution
	DestroyFederationExecution(name string) error

	// JoinFederationExecution joins an existing federation
	JoinFederationExecution(name, federateType, federateName string) (uint32, error)

	// ResignFederationExecution resigns from the federation
	ResignFederationExecution(joinHandle uint32, reason ResignAction) error

	// RegisterFederationSynchronizationPoint registers a sync point
	RegisterFederationSynchronizationPoint(label string, tag []byte) error

	// SynchronizationPointAchieved indicates sync point reached
	SynchronizationPointAchieved(label string) error

	// RequestFederationSave requests a save
	RequestFederationSave(label string, timeStamp time.Time) error

	// QueryFederationSaveStatus queries save status
	QueryFederationSaveStatus() (*SaveStatus, error)
}

// ResignAction specifies how to resign from federation
type ResignAction uint8

const (
	ResignNoAction = iota
	ResignDeleteObjects
	ResignDeleteObjectsAndReleaseAttributes
	ResignReleaseAttributes
	ResignNothing
)

// RTI Ambassador Interface - Declaration Management
type RTIDeclarationAmbassador interface {
	// PublishObjectClassAttributes publishes attributes
	PublishObjectClass(classHandle uint32, attributes []uint32) error

	// UnpublishObjectClassAttributes unpublishes
	UnpublishObjectClassAttributes(classHandle uint32, attributes []uint32) error

	// SubscribeObjectClassAttributes subscribes
	SubscribeObjectClassAttributes(classHandle uint32, attributes []uint32) error

	// UnsubscribeObjectClassAttributes unsubscribes
	UnsubscribeObjectClassAttributes(classHandle uint32, attributes []uint32) error
}

// RTI Ambassador Interface - Object Management
type RTIObjectAmbassador interface {
	// RegisterObjectInstance registers a new object
	RegisterObjectInstance(classHandle uint32, name string) (uint32, error)

	// UpdateAttributeValues updates object attributes
	UpdateAttributeValues(handle uint32, attributes map[uint32][]byte, tag []byte) error

	// DeleteObjectInstance deletes an object
	DeleteObjectInstance(handle uint32, tag []byte) error

	// RequestAttributeValueUpdate requests update
	RequestAttributeValueUpdate(handle uint32, attributes []uint32, tag []byte) error
}

// RTI Ambassador Interface - Time Management
type RTITimeAmbassador interface {
	// EnableTimeRegulation enables time regulation
	EnableTimeRegulation(lookahead time.Duration) error

	// DisableTimeRegulation disables time regulation
	DisableTimeRegulation() error

	// EnableTimeConstrained enables time constrained
	EnableTimeConstrained() error

	// DisableTimeConstrained disables time constrained
	DisableTimeConstrained() error

	// TimeAdvanceRequest requests time advance
	TimeAdvanceRequest(time time.Time) error

	// QueryLogicalTime queries current logical time
	QueryLogicalTime() (time.Time, error)
}

// RTIFederateAmbassador is the callback interface federates implement
type RTIFederateAmbassador interface {
	// SynchronizationPointRegistrationSucceeded sync point registered
	SynchronizationPointRegistrationSucceeded(label string)

	// SynchronizationPointRegistrationFailed sync point failed
	SynchronizationPointRegistrationFailed(label string)

	// AnnounceSynchronizationPoint sync point announced
	AnnounceSynchronizationPoint(label string, tag []byte)

	// SynchronizationPointAchieved sync point achieved
	SynchronizationPointAchieved(label string)

	// ProvideAttributeValueUpdate attribute update requested
	ProvideAttributeValueUpdate(object uint32, attributes []uint32)

	// DiscoverObjectInstance object discovered
	DiscoverObjectInstance(object uint32, classHandle uint32, name string)

	// ReflectAttributeValues attributes updated
	ReflectAttributeValues(object uint32, attributes map[uint32][]byte, tag []byte)

	// RemoveObjectInstance object removed
	RemoveObjectInstance(object uint32, tag []byte)
}

// SOM (Simulation Object Model) describes what a federate publishes/subscribes
type SOM struct {
	Name              string
	PublishesClasses  []ObjectClassDescriptor
	SubscribesClasses []ObjectClassDescriptor
}

// ObjectClassDescriptor describes an object class in the SOM
type ObjectClassDescriptor struct {
	Name          string
	Handle        uint32
	Attributes    []AttributeDescriptor
	ParentHandle  uint32
}

// AttributeDescriptor describes an attribute in the SOM
type AttributeDescriptor struct {
	Name    string
	Handle  uint32
	Type    string
	TupleSpace bool
}

// FOM (Federation Object Model) for the entire federation
type FOM struct {
	Name          string
	Version       string
	Objects       []ObjectClassDescriptor
	Interactions  []InteractionClassDescriptor
}

// InteractionClassDescriptor describes an interaction class
type InteractionClassDescriptor struct {
	Name         string
	Handle       uint32
	Parameters   []ParameterDescriptor
	ParentHandle uint32
}

// ParameterDescriptor describes an interaction parameter
type ParameterDescriptor struct {
	Name  string
	Handle uint32
	Type  string
}

// RTIGateway provides RTI proxy services for FORGE-C2
type RTIGateway struct {
	federations map[string]*FederationExecutionData
	som        *SOM
	fom        *FOM
	localFederate *HLALocalFederate
}

// HLALocalFederate represents our federate in a federation
type HLALocalFederate struct {
	Handle            uint32
	Name              string
	Type              string
	JoinedFederation  string
	SupportsLRC       bool
}

// NewRTIGateway creates a new RTI gateway
func NewRTIGateway() *RTIGateway {
	return &RTIGateway{
		federations: make(map[string]*FederationExecutionData),
	}
}

// CreateFederation creates a new federation execution
func (r *RTIGateway) CreateFederation(name, fom string) error {
	r.federations[name] = &FederationExecutionData{
		Name:       name,
		RTIVersion: RTIVersion,
		JoinTime:   time.Now(),
	}
	return nil
}

// JoinFederation joins an existing federation
func (r *RTIGateway) JoinFederation(name, federateType, federateName string) (uint32, error) {
	exec, ok := r.federations[name]
	if !ok {
		return 0, fmt.Errorf("federation %s not found", name)
	}

	handle := uint32(time.Now().UnixNano())
	exec.FederateHandle = handle
	exec.FederateType = federateType
	exec.FederateName = federateName
	exec.JoinTime = time.Now()

	return handle, nil
}

// ResignFederation resigns from a federation
func (r *RTIGateway) ResignFederation(handle uint32, action ResignAction) error {
	for name, exec := range r.federations {
		if exec.FederateHandle == handle {
			delete(r.federations, name)
			return nil
		}
	}
	return fmt.Errorf("federate handle %d not found", handle)
}

// =============================================================================
// HLA Synchronization Point Management (IEEE 1516)
// =============================================================================

// RegisterFederationSynchronizationPoint registers a sync point
func (r *RTIGateway) RegisterFederationSynchronizationPoint(label string, tag []byte) error {
	for _, exec := range r.federations {
		if exec.SyncPoints == nil {
			exec.SyncPoints = make(map[string]*SynchronizationPoint)
		}
		exec.SyncPoints[label] = &SynchronizationPoint{
			Label: label,
			Tag:   tag,
		}
	}
	return nil
}

// SynchronizationPointAchieved indicates sync point reached
func (r *RTIGateway) SynchronizationPointAchieved(label string) error {
	for _, exec := range r.federations {
		if sp, ok := exec.SyncPoints[label]; ok {
			sp.State = SyncStateAchieved
			return nil
		}
	}
	return fmt.Errorf("synchronization point %s not found", label)
}

// RequestFederationSave requests a save
func (r *RTIGateway) RequestFederationSave(label string, timeStamp time.Time) error {
	for _, exec := range r.federations {
		exec.SaveStatus = &SaveStatus{
			Label:      label,
			Time:       timeStamp,
			Initiating: true,
			InProgress: true,
		}
	}
	return nil
}

// QueryFederationSaveStatus queries save status
func (r *RTIGateway) QueryFederationSaveStatus() (*SaveStatus, error) {
	for _, exec := range r.federations {
		if exec.SaveStatus != nil {
			return exec.SaveStatus, nil
		}
	}
	return nil, nil
}

// SynchronizationPointRegistrationSucceeded sync point registered
func (r *RTIGateway) SynchronizationPointRegistrationSucceeded(label string) {
	// No-op stub for callback
}

// SynchronizationPointRegistrationFailed sync point failed
func (r *RTIGateway) SynchronizationPointRegistrationFailed(label string) {
	// No-op stub for callback
}

// AnnounceSynchronizationPoint sync point announced
func (r *RTIGateway) AnnounceSynchronizationPoint(label string, tag []byte) {
	for _, exec := range r.federations {
		if exec.SyncPoints == nil {
			exec.SyncPoints = make(map[string]*SynchronizationPoint)
		}
		exec.SyncPoints[label] = &SynchronizationPoint{
			Label: label,
			Tag:   tag,
			State: SyncStateAnnounced,
		}
	}
}

// RequestFederationRestore requests a restore
func (r *RTIGateway) RequestFederationRestore(label string) error {
	for _, exec := range r.federations {
		exec.SaveStatus = &SaveStatus{
			Label: label,
		}
	}
	return nil
}

// =============================================================================
// HLA Declaration Management Implementation
// =============================================================================

// Publication tracks what a federate publishes
type Publication struct {
	ClassHandle   uint32
	Attributes    []uint32
	SubscribedBy  []uint32 // federate handles
}

// Subscription tracks what a federate subscribes to
type Subscription struct {
	ClassHandle   uint32
	Attributes    []uint32
	PublishedBy   []uint32 // federate handles
}

// DeclarationManager handles HLA pub/sub
type DeclarationManager struct {
	publications  map[uint32]*Publication
	subscriptions map[uint32]*Subscription
	objectClasses map[uint32]*ObjectClassDescriptor
}

// NewDeclarationManager creates a new declaration manager
func NewDeclarationManager() *DeclarationManager {
	return &DeclarationManager{
		publications:  make(map[uint32]*Publication),
		subscriptions: make(map[uint32]*Subscription),
		objectClasses: make(map[uint32]*ObjectClassDescriptor),
	}
}

// PublishObjectClass publishes an object class
func (d *DeclarationManager) PublishObjectClass(classHandle uint32, attributes []uint32) error {
	d.publications[classHandle] = &Publication{
		ClassHandle: classHandle,
		Attributes:  attributes,
	}
	return nil
}

// UnpublishObjectClass unpublishes an object class
func (d *DeclarationManager) UnpublishObjectClass(classHandle uint32) error {
	delete(d.publications, classHandle)
	return nil
}

// SubscribeObjectClassAttributes subscribes to attributes
func (d *DeclarationManager) SubscribeObjectClassAttributes(classHandle uint32, attributes []uint32) error {
	d.subscriptions[classHandle] = &Subscription{
		ClassHandle: classHandle,
		Attributes:  attributes,
	}
	return nil
}

// UnsubscribeObjectClassAttributes unsubscribes
func (d *DeclarationManager) UnsubscribeObjectClassAttributes(classHandle uint32) error {
	delete(d.subscriptions, classHandle)
	return nil
}

// IsPublished checks if a class is published
func (d *DeclarationManager) IsPublished(classHandle uint32) bool {
	_, ok := d.publications[classHandle]
	return ok
}

// IsSubscribed checks if a class is subscribed
func (d *DeclarationManager) IsSubscribed(classHandle uint32) bool {
	_, ok := d.subscriptions[classHandle]
	return ok
}

// =============================================================================
// HLA Object Management Implementation
// =============================================================================

// ObjectInstance represents a registered object in the federation
type ObjectInstance struct {
	Handle         uint32
	ClassHandle    uint32
	Name           string
	Owner          uint32
	Attributes     map[uint32][]byte
	LastUpdateTime time.Time
}

// ObjectManager handles HLA object instances
type ObjectManager struct {
	instances       map[uint32]*ObjectInstance
	names           map[string]uint32 // name -> handle
	classToInstances map[uint32][]uint32
	discoveryCB     func(object uint32, classHandle uint32, name string)
	reflectionCB    func(object uint32, attributes map[uint32][]byte, tag []byte)
}

// NewObjectManager creates a new object manager
func NewObjectManager() *ObjectManager {
	return &ObjectManager{
		instances:        make(map[uint32]*ObjectInstance),
		names:            make(map[string]uint32),
		classToInstances: make(map[uint32][]uint32),
	}
}

// RegisterObjectInstance registers a new object
func (m *ObjectManager) RegisterObjectInstance(classHandle uint32, name string) (uint32, error) {
	// Generate a unique handle
	handle := uint32(time.Now().UnixNano())

	obj := &ObjectInstance{
		Handle:         handle,
		ClassHandle:    classHandle,
		Name:           name,
		Attributes:     make(map[uint32][]byte),
		LastUpdateTime: time.Now(),
	}

	m.instances[handle] = obj
	m.names[name] = handle
	m.classToInstances[classHandle] = append(m.classToInstances[classHandle], handle)

	// Fire discovery callback if set
	if m.discoveryCB != nil {
		m.discoveryCB(handle, classHandle, name)
	}

	return handle, nil
}

// UpdateAttributeValues updates object attributes
func (m *ObjectManager) UpdateAttributeValues(handle uint32, attributes map[uint32][]byte, tag []byte) error {
	obj, ok := m.instances[handle]
	if !ok {
		return fmt.Errorf("object %d not found", handle)
	}

	for attrHandle, value := range attributes {
		obj.Attributes[attrHandle] = value
	}
	obj.LastUpdateTime = time.Now()

	// Fire reflection callback if set
	if m.reflectionCB != nil {
		m.reflectionCB(handle, attributes, tag)
	}

	return nil
}

// DeleteObjectInstance deletes an object
func (m *ObjectManager) DeleteObjectInstance(handle uint32, tag []byte) error {
	obj, ok := m.instances[handle]
	if !ok {
		return fmt.Errorf("object %d not found", handle)
	}

	delete(m.names, obj.Name)
	delete(m.instances, handle)

	// Remove from class index
	handles := m.classToInstances[obj.ClassHandle]
	for i, h := range handles {
		if h == handle {
			m.classToInstances[obj.ClassHandle] = append(handles[:i], handles[i+1:]...)
			break
		}
	}

	return nil
}

// GetObjectByHandle retrieves an object by handle
func (m *ObjectManager) GetObjectByHandle(handle uint32) (*ObjectInstance, bool) {
	obj, ok := m.instances[handle]
	return obj, ok
}

// GetObjectByName retrieves an object by name
func (m *ObjectManager) GetObjectByName(name string) (*ObjectInstance, bool) {
	handle, ok := m.names[name]
	if !ok {
		return nil, false
	}
	return m.instances[handle], true
}

// GetObjectsByClass returns all objects of a class
func (m *ObjectManager) GetObjectsByClass(classHandle uint32) []*ObjectInstance {
	var result []*ObjectInstance
	for _, h := range m.classToInstances[classHandle] {
		if obj, ok := m.instances[h]; ok {
			result = append(result, obj)
		}
	}
	return result
}

// SetDiscoveryCallback sets the discovery callback
func (m *ObjectManager) SetDiscoveryCallback(cb func(object uint32, classHandle uint32, name string)) {
	m.discoveryCB = cb
}

// SetReflectionCallback sets the reflection callback
func (m *ObjectManager) SetReflectionCallback(cb func(object uint32, attributes map[uint32][]byte, tag []byte)) {
	m.reflectionCB = cb
}

// =============================================================================
// HLA Time Management Implementation
// =============================================================================

// TimeManager handles HLA logical time
type TimeManager struct {
	lookahead       time.Duration
	LBTS           time.Time // Lower Bound on Times Stamp
	currentTime     time.Time
	isRegulating    bool
	isConstrained   bool
	isAdvancing     bool
	federateHandle  uint32
}

// NewTimeManager creates a new time manager
func NewTimeManager() *TimeManager {
	return &TimeManager{
		LBTS:       time.Time{},
		currentTime: time.Time{},
		lookahead:  10 * time.Millisecond,
	}
}

// EnableTimeRegulation enables time regulation
func (t *TimeManager) EnableTimeRegulation(lookahead time.Duration) error {
	t.isRegulating = true
	t.lookahead = lookahead
	return nil
}

// DisableTimeRegulation disables time regulation
func (t *TimeManager) DisableTimeRegulation() error {
	t.isRegulating = false
	return nil
}

// EnableTimeConstrained enables time constrained
func (t *TimeManager) EnableTimeConstrained() error {
	t.isConstrained = true
	return nil
}

// DisableTimeConstrained disables time constrained
func (t *TimeManager) DisableTimeConstrained() error {
	t.isConstrained = false
	return nil
}

// TimeAdvanceRequest requests time advance
func (t *TimeManager) TimeAdvanceRequest(requestedTime time.Time) error {
	t.isAdvancing = true
	t.currentTime = requestedTime
	return nil
}

// QueryLogicalTime returns the current logical time
func (t *TimeManager) QueryLogicalTime() time.Time {
	return t.currentTime
}

// ModifyLBTS modifies the Lower Bound on Times Stamp
func (t *TimeManager) ModifyLBTS(newLBTS time.Time) {
	t.LBTS = newLBTS
}

// FlushQueueRequest requests queue flush at time
func (t *TimeManager) FlushQueueRequest(requestedTime time.Time) error {
	return nil
}

// =============================================================================
// HLA Ownership Management Implementation
// =============================================================================

// OwnershipEntry tracks attribute ownership state
type OwnershipEntry struct {
	AttributeHandle uint32
	Owner          uint32 // federate handle, 0 = unowned
	Valid          bool
}

// OwnershipManager handles HLA attribute ownership
type OwnershipManager struct {
	ownerships map[uint32]map[uint32]*OwnershipEntry // object -> attr -> entry
}

// NewOwnershipManager creates a new ownership manager
func NewOwnershipManager() *OwnershipManager {
	return &OwnershipManager{
		ownerships: make(map[uint32]map[uint32]*OwnershipEntry),
	}
}

// QueryAttributeOwnership queries who owns an attribute
func (m *OwnershipManager) QueryAttributeOwnership(objectHandle, attrHandle uint32) (uint32, bool) {
	if obj, ok := m.ownerships[objectHandle]; ok {
		if entry, ok := obj[attrHandle]; ok && entry.Valid {
			return entry.Owner, true
		}
	}
	return 0, false
}

// AttributeIsOwnedByFederate checks if a federate owns an attribute
func (m *OwnershipManager) AttributeIsOwnedByFederate(objectHandle, attrHandle, federateHandle uint32) bool {
	owner, ok := m.QueryAttributeOwnership(objectHandle, attrHandle)
	return ok && owner == federateHandle
}

// NominateAttributeOwnership nominates a new owner for attributes
func (m *OwnershipManager) NominateAttributeOwnership(objectHandle, attrHandle, nominatedOwner uint32) error {
	if m.ownerships[objectHandle] == nil {
		m.ownerships[objectHandle] = make(map[uint32]*OwnershipEntry)
	}
	m.ownerships[objectHandle][attrHandle] = &OwnershipEntry{
		AttributeHandle: attrHandle,
		Owner:          nominatedOwner,
		Valid:          true,
	}
	return nil
}

// AcquireAttributeOwnership acquires ownership
func (m *OwnershipManager) AcquireAttributeOwnership(objectHandle, attrHandle, newOwner uint32) error {
	return m.NominateAttributeOwnership(objectHandle, attrHandle, newOwner)
}

// AcquireAttributeOwnershipIfAvailable acquires if available
func (m *OwnershipManager) AcquireAttributeOwnershipIfAvailable(objectHandle, attrHandle, newOwner uint32) (bool, error) {
	currentOwner, isOwned := m.QueryAttributeOwnership(objectHandle, attrHandle)
	if isOwned && currentOwner != 0 {
		return false, nil // not available
	}
	m.NominateAttributeOwnership(objectHandle, attrHandle, newOwner)
	return true, nil
}

// UnconditionalAttributeOwnershipDivestiture divests without callback
func (m *OwnershipManager) UnconditionalAttributeOwnershipDivestiture(objectHandle uint32, attributes []uint32) error {
	for _, attr := range attributes {
		if obj, ok := m.ownerships[objectHandle]; ok {
			if entry, ok := obj[attr]; ok {
				entry.Owner = 0 // unowned
			}
		}
	}
	return nil
}

// GetOwnedAttributes returns all attributes owned by a federate
func (m *OwnershipManager) GetOwnedAttributes(objectHandle, federateHandle uint32) []uint32 {
	var result []uint32
	if obj, ok := m.ownerships[objectHandle]; ok {
		for attr, entry := range obj {
			if entry.Owner == federateHandle && entry.Valid {
				result = append(result, attr)
			}
		}
	}
	return result
}

// AttributeOwnershipAcquisitionNotification callback type
type AttributeOwnershipAcquisitionNotificationCallback func(objectHandle uint32, attributes []uint32, owner uint32)

// AttributeOwnershipUnavailable callback type
type AttributeOwnershipUnavailableCallback func(objectHandle uint32, attributes []uint32)

// ConfirmAttributeOwnershipAcquisition callback type
type ConfirmAttributeOwnershipAcquisitionCallback func(objectHandle uint32, attributes []uint32, owner uint32) bool

// =============================================================================
// HLA Data Distribution Management (DDM)
// =============================================================================

// Region represents a routing space region
type Region struct {
	Handle         uint32
	RoutingSpace   uint32
	Extent         [6]float64 // [xmin, xmax, ymin, ymax, zmin, zmax]
	Subscriptions  []uint32
}

// RoutingSpace defines a dimension for DDM
type RoutingSpace struct {
	Handle       uint32
	Name         string
	Dimensions   []Dimension
	AddressSpace uint32
}

// Dimension defines a single dimension of a routing space
type Dimension struct {
	Handle        uint32
	Name          string
	UpperBound    float64
	LowerBound    float64
	Units         string
}

// DDMManager handles data distribution management
type DDMManager struct {
	regions      map[uint32]*Region
	routingSpaces map[uint32]*RoutingSpace
	nextRegionHandle uint32
}

// NewDDMManager creates a new DDM manager
func NewDDMManager() *DDMManager {
	return &DDMManager{
		regions:       make(map[uint32]*Region),
		routingSpaces: make(map[uint32]*RoutingSpace),
		nextRegionHandle: 1,
	}
}

// CreateRegion creates a new region
func (m *DDMManager) CreateRegion(routingSpace uint32, extent [6]float64) (*Region, error) {
	region := &Region{
		Handle:       m.nextRegionHandle,
		RoutingSpace: routingSpace,
		Extent:       extent,
		Subscriptions: []uint32{},
	}
	m.nextRegionHandle++
	m.regions[region.Handle] = region
	return region, nil
}

// DeleteRegion deletes a region
func (m *DDMManager) DeleteRegion(handle uint32) error {
	delete(m.regions, handle)
	return nil
}

// RegisterObjectInstanceWithRegion registers with DDM region
func (m *DDMManager) RegisterObjectInstanceWithRegion(objectHandle, classHandle, regionHandle uint32) error {
	return nil // Simplified implementation
}

// UpdateAttributeValuesWithRegion updates with DDM
func (m *DDMManager) UpdateAttributeValuesWithRegion(objectHandle uint32, attributes map[uint32][]byte, regionHandle uint32, tag []byte) error {
	return nil // Simplified implementation
}

// SubscribeObjectClassAttributesWithRegion subscribes with region
func (m *DDMManager) SubscribeObjectClassAttributesWithRegion(classHandle, regionHandle uint32, attributes []uint32) error {
	if region, ok := m.regions[regionHandle]; ok {
		region.Subscriptions = append(region.Subscriptions, classHandle)
	}
	return nil
}

// GetRegion returns a region by handle
func (m *DDMManager) GetRegion(handle uint32) (*Region, bool) {
	region, ok := m.regions[handle]
	return region, ok
}

// RegisterRoutingSpace registers a routing space
func (m *DDMManager) RegisterRoutingSpace(name string, dims []Dimension) (*RoutingSpace, error) {
	handle := uint32(len(m.routingSpaces) + 1)
	rs := &RoutingSpace{
		Handle:       handle,
		Name:         name,
		Dimensions:   dims,
		AddressSpace: 0,
	}
	m.routingSpaces[handle] = rs
	return rs, nil
}
