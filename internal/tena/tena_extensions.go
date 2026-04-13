package tena

import (
	"encoding/xml"
	"fmt"
	"io"
	"strings"
	"sync"
	"time"
)

// =============================================================================
// Phase 4.1.1: TENA Object Model Schema Parser
// =============================================================================

// ObjectModel represents a TENA Object Model
type ObjectModel struct {
	Name           string
	Version        string
	ObjectClasses  []ObjectClassDefinition
	InteractionClasses []InteractionClassDefinition
	Datatypes      []DatatypeDefinition
}

// ObjectClassDefinition defines a TENA object class
type ObjectClassDefinition struct {
	Name       string
	FullName   string
	Parent     string
	Attributes []AttributeDefinition
	Methods    []MethodDefinition
}

// AttributeDefinition defines an object attribute
type AttributeDefinition struct {
	Name       string
	Datatype   string
	Access     AttributeAccess
	Optional   bool
	UpdateType UpdateType
}

// AttributeAccess enumerates attribute access types
type AttributeAccess uint8

const (
	AttributeAccessReadOnly AttributeAccess = 0
	AttributeAccessReadWrite AttributeAccess = 1
	AttributeAccessWriteOnly AttributeAccess = 2
)

// UpdateType defines when attributes are updated
type UpdateType uint8

const (
	UpdateTypePeriodic UpdateType = 0
	UpdateTypeOnChange UpdateType = 1
	UpdateTypeManual   UpdateType = 2
)

// MethodDefinition defines an object method
type MethodDefinition struct {
	Name       string
	Parameters []ParameterDefinition
	ReturnType string
}

// ParameterDefinition defines a method parameter
type ParameterDefinition struct {
	Name     string
	Datatype string
}

// InteractionClassDefinition defines a TENA interaction class
type InteractionClassDefinition struct {
	Name       string
	FullName   string
	Parent     string
	Parameters []ParameterDefinition
}

// DatatypeDefinition defines a TENA datatype
type DatatypeDefinition struct {
	Name     string
	Kind     DatatypeKind
	BaseType string
	Fields   []FieldDefinition
}

// FieldDefinition defines a record field
type FieldDefinition struct {
	Name     string
	Datatype string
	Offset   int
}

// DatatypeKind enumerates TENA datatype kinds
type DatatypeKind uint8

const (
	DatatypeKindSimple    DatatypeKind = 0
	DatatypeKindEnumerated DatatypeKind = 1
	DatatypeKindArray      DatatypeKind = 2
	DatatypeKindRecord     DatatypeKind = 3
	DatatypeKindUnion      DatatypeKind = 4
)

// SchemaParser parses TENA Object Model XML schemas
type SchemaParser struct {
	model *ObjectModel
}

// NewSchemaParser creates a new schema parser
func NewSchemaParser() *SchemaParser {
	return &SchemaParser{
		model: &ObjectModel{
			ObjectClasses:     make([]ObjectClassDefinition, 0),
			InteractionClasses: make([]InteractionClassDefinition, 0),
			Datatypes:         make([]DatatypeDefinition, 0),
		},
	}
}

// Parse reads and parses a TENA schema from XML
func (p *SchemaParser) Parse(xmlData []byte) (*ObjectModel, error) {
	p.model = &ObjectModel{
		ObjectClasses:      make([]ObjectClassDefinition, 0),
		InteractionClasses: make([]InteractionClassDefinition, 0),
		Datatypes:          make([]DatatypeDefinition, 0),
	}

	decoder := xml.NewDecoder(strings.NewReader(string(xmlData)))
	var objectStack []ObjectClassDefinition
	var interactionStack []InteractionClassDefinition

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		switch elem := token.(type) {
		case xml.StartElement:
			switch strings.ToLower(elem.Name.Local) {
			case "objectclass":
				obj := ObjectClassDefinition{
					Name:       getXMLAttr(elem.Attr, "Name"),
					FullName:   getXMLAttr(elem.Attr, "FullName"),
					Parent:     getXMLAttr(elem.Attr, "Parent"),
					Attributes: make([]AttributeDefinition, 0),
					Methods:    make([]MethodDefinition, 0),
				}
				objectStack = append(objectStack, obj)

			case "interactionclass":
				ic := InteractionClassDefinition{
					Name:       getXMLAttr(elem.Attr, "Name"),
					FullName:   getXMLAttr(elem.Attr, "FullName"),
					Parent:     getXMLAttr(elem.Attr, "Parent"),
					Parameters: make([]ParameterDefinition, 0),
				}
				interactionStack = append(interactionStack, ic)

			case "attribute":
				if len(objectStack) > 0 {
					obj := &objectStack[len(objectStack)-1]
					access := AttributeAccessReadWrite
					if getXMLAttr(elem.Attr, "Access") == "ReadOnly" {
						access = AttributeAccessReadOnly
					}
					obj.Attributes = append(obj.Attributes, AttributeDefinition{
						Name:     getXMLAttr(elem.Attr, "Name"),
						Datatype: getXMLAttr(elem.Attr, "DataType"),
						Access:   access,
						Optional: getXMLAttr(elem.Attr, "Optional") == "true",
					})
				}

			case "parameter":
				if len(interactionStack) > 0 {
					ic := &interactionStack[len(interactionStack)-1]
					ic.Parameters = append(ic.Parameters, ParameterDefinition{
						Name:     getXMLAttr(elem.Attr, "Name"),
						Datatype: getXMLAttr(elem.Attr, "DataType"),
					})
				}

			case "datatype":
				dt := DatatypeDefinition{
					Name:   getXMLAttr(elem.Attr, "Name"),
					Kind:   DatatypeKindSimple,
					Fields: make([]FieldDefinition, 0),
				}
				p.model.Datatypes = append(p.model.Datatypes, dt)
			}

		case xml.EndElement:
			switch strings.ToLower(elem.Name.Local) {
			case "objectclass":
				if len(objectStack) > 0 {
					obj := objectStack[len(objectStack)-1]
					objectStack = objectStack[:len(objectStack)-1]
					p.model.ObjectClasses = append(p.model.ObjectClasses, obj)
				}
			case "interactionclass":
				if len(interactionStack) > 0 {
					ic := interactionStack[len(interactionStack)-1]
					interactionStack = interactionStack[:len(interactionStack)-1]
					p.model.InteractionClasses = append(p.model.InteractionClasses, ic)
				}
			}
		}
	}

	return p.model, nil
}

// getXMLAttr does case-insensitive attribute lookup
func getXMLAttr(attrs []xml.Attr, name string) string {
	lowerName := strings.ToLower(name)
	for _, a := range attrs {
		if strings.ToLower(a.Name.Local) == lowerName {
			return a.Value
		}
	}
	return ""
}

// GetObjectClass returns an object class by name
func (m *ObjectModel) GetObjectClass(name string) *ObjectClassDefinition {
	for i := range m.ObjectClasses {
		if m.ObjectClasses[i].Name == name || m.ObjectClasses[i].FullName == name {
			return &m.ObjectClasses[i]
		}
	}
	return nil
}

// GetInteractionClass returns an interaction class by name
func (m *ObjectModel) GetInteractionClass(name string) *InteractionClassDefinition {
	for i := range m.InteractionClasses {
		if m.InteractionClasses[i].Name == name || m.InteractionClasses[i].FullName == name {
			return &m.InteractionClasses[i]
		}
	}
	return nil
}

// =============================================================================
// Phase 4.1.7: TENA Object Reflection (late joining support)
// =============================================================================

// ReflectionManager handles late-join object reflection
type ReflectionManager struct {
	schema          *ObjectModel
	cache           map[uint64]*TENAObject
	pendingObjects  map[uint64]*PendingObject
	onReflection    func(obj *TENAObject)
	mu              sync.RWMutex
}

// PendingObject tracks objects pending reflection
type PendingObject struct {
	Instance  uint64
	ClassHandle uint32
	Timestamp time.Time
	State     ObjectState
}

// ObjectState tracks current object state
type ObjectState struct {
	Attributes map[string]interface{}
	Metadata  map[string]string
}

// NewReflectionManager creates a new reflection manager
func NewReflectionManager(schema *ObjectModel) *ReflectionManager {
	return &ReflectionManager{
		schema:         schema,
		cache:          make(map[uint64]*TENAObject),
		pendingObjects: make(map[uint64]*PendingObject),
	}
}

// RegisterPending registers an object for late join reflection
func (rm *ReflectionManager) RegisterPending(instance uint64, classHandle uint32) {
	rm.mu.Lock()
	defer rm.mu.Unlock()
	rm.pendingObjects[instance] = &PendingObject{
		Instance:    instance,
		ClassHandle: classHandle,
		Timestamp:  time.Now(),
		State: ObjectState{
			Attributes: make(map[string]interface{}),
			Metadata:  make(map[string]string),
		},
	}
}

// CompleteReflection marks an object as reflected
func (rm *ReflectionManager) CompleteReflection(instance uint64, obj *TENAObject) {
	rm.mu.Lock()
	defer rm.mu.Unlock()
	delete(rm.pendingObjects, instance)
	rm.cache[instance] = obj
	if rm.onReflection != nil {
		rm.onReflection(obj)
	}
}

// GetCachedObject returns a cached object by instance
func (rm *ReflectionManager) GetCachedObject(instance uint64) (*TENAObject, bool) {
	rm.mu.RLock()
	defer rm.mu.RUnlock()
	obj, ok := rm.cache[instance]
	return obj, ok
}

// SetOnReflection sets the reflection callback
func (rm *ReflectionManager) SetOnReflection(cb func(obj *TENAObject)) {
	rm.mu.Lock()
	defer rm.mu.Unlock()
	rm.onReflection = cb
}

// =============================================================================
// Phase 4.1.9: TENA Exception Handling
// =============================================================================

// ExceptionType enumerates TENA exception types
type ExceptionType uint8

const (
	ExceptionConnection ExceptionType = 0
	ExceptionTimeout    ExceptionType = 1
	ExceptionSchema     ExceptionType = 2
	ExceptionObject     ExceptionType = 3
	ExceptionSync       ExceptionType = 4
)

// TENAException represents a TENA-specific exception
type TENAException struct {
	Type      ExceptionType
	Message   string
	Details   string
	Timestamp time.Time
}

func (e *TENAException) Error() string {
	return fmt.Sprintf("TENA %s: %s (%s)", exceptionTypeString(e.Type), e.Message, e.Details)
}

func exceptionTypeString(t ExceptionType) string {
	switch t {
	case ExceptionConnection:
		return "ConnectionError"
	case ExceptionTimeout:
		return "TimeoutError"
	case ExceptionSchema:
		return "SchemaError"
	case ExceptionObject:
		return "ObjectError"
	case ExceptionSync:
		return "SyncError"
	default:
		return "UnknownError"
	}
}

// ExceptionHandler handles TENA exceptions
type ExceptionHandler struct {
	onException func(*TENAException)
	onConnectionLost func(sessionID uint64)
	onObjectError func(instance uint64, err error)
}

// NewExceptionHandler creates a new exception handler
func NewExceptionHandler() *ExceptionHandler {
	return &ExceptionHandler{}
}

// HandleException processes an exception
func (eh *ExceptionHandler) HandleException(ex *TENAException) {
	if eh.onException != nil {
		eh.onException(ex)
	}
}

// Throw raises a TENA exception
func (eh *ExceptionHandler) Throw(exType ExceptionType, msg, details string) *TENAException {
	ex := &TENAException{
		Type:      exType,
		Message:   msg,
		Details:   details,
		Timestamp: time.Now(),
	}
	eh.HandleException(ex)
	return ex
}

// SetOnException sets the exception callback
func (eh *ExceptionHandler) SetOnException(cb func(*TENAException)) {
	eh.onException = cb
}

// SetOnConnectionLost sets the connection lost callback
func (eh *ExceptionHandler) SetOnConnectionLost(cb func(sessionID uint64)) {
	eh.onConnectionLost = cb
}

// SetOnObjectError sets the object error callback
func (eh *ExceptionHandler) SetOnObjectError(cb func(instance uint64, err error)) {
	eh.onObjectError = cb
}

// =============================================================================
// Phase 4.1.10: TENA Object Pooling (performance optimization)
// =============================================================================

// ObjectPool provides pooling for TENA objects to reduce GC pressure
type ObjectPool struct {
	pool        sync.Pool
	maxSize     int
	currentSize int
	onEvict     func(*TENAObject)
	mu          sync.Mutex
}

// NewObjectPool creates a new object pool
func NewObjectPool(maxSize int) *ObjectPool {
	return &ObjectPool{
		maxSize: maxSize,
		onEvict: nil,
	}
}

// Acquire gets an object from the pool (or creates new)
func (p *ObjectPool) Acquire() *TENAObject {
	p.mu.Lock()
	defer p.mu.Unlock()
	if obj, ok := p.pool.Get().(*TENAObject); ok {
		p.currentSize--
		return obj
	}
	return nil // Caller should create new
}

// Release returns an object to the pool
func (p *ObjectPool) Release(obj *TENAObject) {
	p.mu.Lock()
	defer p.mu.Unlock()
	if p.currentSize < p.maxSize {
		obj.reset() // Clear for reuse
		p.pool.Put(obj)
		p.currentSize++
	}
}

// SetOnEvict sets the eviction callback
func (p *ObjectPool) SetOnEvict(cb func(*TENAObject)) {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.onEvict = cb
}

// Size returns current pool size
func (p *ObjectPool) Size() int {
	p.mu.Lock()
	defer p.mu.Unlock()
	return p.currentSize
}

// reset clears an object for reuse
func (o *TENAObject) reset() {
	o.Attributes = nil
	for k := range o.Metadata {
		delete(o.Metadata, k)
	}
	o.Header.ObjectClass = 0
	o.Header.ObjectInstance = 0
}

// =============================================================================
// Phase 4.2.2: DIS-to-TENA Object Mapping
// =============================================================================

// DISMapper handles DIS to TENA object mapping
type DISMapper struct {
	registry map[uint64]DISEntityMapping
	onMap    func(disID uint64, tenaInstance uint64)
	mu       sync.RWMutex
}

// DISEntityMapping tracks DIS entity to TENA object mapping
type DISEntityMapping struct {
	DISID           uint64
	TENAInstance    uint64
	ClassHandle     uint32
	LastUpdate      time.Time
	EntityState     interface{} // DISEntityStatePDU
}

// NewDISMapper creates a new DIS mapper
func NewDISMapper() *DISMapper {
	return &DISMapper{
		registry: make(map[uint64]DISEntityMapping),
	}
}

// Register maps a DIS entity to a TENA instance
func (m *DISMapper) Register(disID uint64, tenaInstance uint64, classHandle uint32) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.registry[disID] = DISEntityMapping{
		DISID:        disID,
		TENAInstance: tenaInstance,
		ClassHandle:  classHandle,
		LastUpdate:   time.Now(),
	}
}

// Unregister removes a DIS-TENA mapping
func (m *DISMapper) Unregister(disID uint64) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.registry, disID)
}

// GetTENAFromDIS returns TENA instance for a DIS ID
func (m *DISMapper) GetTENAFromDIS(disID uint64) (uint64, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if mapping, ok := m.registry[disID]; ok {
		return mapping.TENAInstance, true
	}
	return 0, false
}

// GetDISFromTENA returns DIS ID for a TENA instance
func (m *DISMapper) GetDISFromTENA(tenaInstance uint64) (uint64, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for disID, mapping := range m.registry {
		if mapping.TENAInstance == tenaInstance {
			return disID, true
		}
	}
	return 0, false
}

// SetOnMap sets the mapping callback
func (m *DISMapper) SetOnMap(cb func(disID uint64, tenaInstance uint64)) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.onMap = cb
}

// =============================================================================
// Phase 4.2.4: HLA-to-TENA Object Mapping
// =============================================================================

// HLAMapper handles HLA to TENA object mapping
type HLAMapper struct {
	registry map[uint32]HLAMapping
	onMap    func(hlaHandle uint32, tenaInstance uint64)
	mu       sync.RWMutex
}

// HLAMapping tracks HLA object handle to TENA instance mapping
type HLAMapping struct {
	HLAHandle     uint32
	TENAInstance  uint64
	ClassHandle   uint32
	Attributes    map[uint32][]byte
	LastSync      time.Time
}

// NewHLAMapper creates a new HLA mapper
func NewHLAMapper() *HLAMapper {
	return &HLAMapper{
		registry: make(map[uint32]HLAMapping),
	}
}

// Register maps an HLA handle to a TENA instance
func (m *HLAMapper) Register(hlaHandle uint32, tenaInstance uint64, classHandle uint32) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.registry[hlaHandle] = HLAMapping{
		HLAHandle:    hlaHandle,
		TENAInstance: tenaInstance,
		ClassHandle:  classHandle,
		Attributes:   make(map[uint32][]byte),
		LastSync:    time.Now(),
	}
}

// Unregister removes an HLA-TENA mapping
func (m *HLAMapper) Unregister(hlaHandle uint32) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.registry, hlaHandle)
}

// GetTENAFromHLA returns TENA instance for an HLA handle
func (m *HLAMapper) GetTENAFromHLA(hlaHandle uint32) (uint64, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	if mapping, ok := m.registry[hlaHandle]; ok {
		return mapping.TENAInstance, true
	}
	return 0, false
}

// GetHLAFromTENA returns HLA handle for a TENA instance
func (m *HLAMapper) GetHLAFromTENA(tenaInstance uint64) (uint32, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	for hlaHandle, mapping := range m.registry {
		if mapping.TENAInstance == tenaInstance {
			return hlaHandle, true
		}
	}
	return 0, false
}

// UpdateAttributes updates HLA attributes for a mapping
func (m *HLAMapper) UpdateAttributes(hlaHandle uint32, attrs map[uint32][]byte) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if mapping, ok := m.registry[hlaHandle]; ok {
		mapping.Attributes = attrs
		mapping.LastSync = time.Now()
		m.registry[hlaHandle] = mapping
		return nil
	}
	return fmt.Errorf("hla handle %d not found", hlaHandle)
}

// SetOnMap sets the mapping callback
func (m *HLAMapper) SetOnMap(cb func(hlaHandle uint32, tenaInstance uint64)) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.onMap = cb
}