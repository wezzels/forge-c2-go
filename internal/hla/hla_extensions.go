package hla

import (
	"fmt"
)

// =============================================================================
// Phase 3.2: Declaration Management - Interaction Class Pub/Sub
// Extends DeclarationManager with interaction publication/subscription
// =============================================================================

// PublishInteractionClass publishes an interaction class
func (d *DeclarationManager) PublishInteractionClass(classHandle uint32, parameters []uint32) error {
	d.interactionPublications[classHandle] = &InteractionPublication{
		ClassHandle:    classHandle,
		ParameterCount: uint32(len(parameters)),
	}
	return nil
}

// UnpublishInteractionClass unpublishes an interaction class
func (d *DeclarationManager) UnpublishInteractionClass(classHandle uint32) error {
	delete(d.interactionPublications, classHandle)
	return nil
}

// SubscribeInteractionClass subscribes to an interaction class
func (d *DeclarationManager) SubscribeInteractionClass(classHandle uint32, parameters []uint32) error {
	d.interactionSubscriptions[classHandle] = &InteractionSubscription{
		ClassHandle: classHandle,
		Parameters:  parameters,
	}
	return nil
}

// UnsubscribeInteractionClass unsubscribes from an interaction class
func (d *DeclarationManager) UnsubscribeInteractionClass(classHandle uint32) error {
	delete(d.interactionSubscriptions, classHandle)
	return nil
}

// IsInteractionPublished checks if an interaction class is published
func (d *DeclarationManager) IsInteractionPublished(classHandle uint32) bool {
	_, ok := d.interactionPublications[classHandle]
	return ok
}

// IsInteractionSubscribed checks if an interaction class is subscribed
func (d *DeclarationManager) IsInteractionSubscribed(classHandle uint32) bool {
	_, ok := d.interactionSubscriptions[classHandle]
	return ok
}

// ChangeAttributeTransportType changes the transport type for attributes
func (d *DeclarationManager) ChangeAttributeTransportType(classHandle uint32, attributes []uint32, transportType TransportType) error {
	if d.transportTypes == nil {
		d.transportTypes = make(map[uint32]map[uint32]TransportType)
	}
	if d.transportTypes[classHandle] == nil {
		d.transportTypes[classHandle] = make(map[uint32]TransportType)
	}
	for _, attr := range attributes {
		d.transportTypes[classHandle][attr] = transportType
	}
	return nil
}

// ChangeAttributeOrderType changes the order type for attributes
func (d *DeclarationManager) ChangeAttributeOrderType(classHandle uint32, attributes []uint32, orderType OrderType) error {
	if d.orderTypes == nil {
		d.orderTypes = make(map[uint32]map[uint32]OrderType)
	}
	if d.orderTypes[classHandle] == nil {
		d.orderTypes[classHandle] = make(map[uint32]OrderType)
	}
	for _, attr := range attributes {
		d.orderTypes[classHandle][attr] = orderType
	}
	return nil
}

// =============================================================================
// Phase 3.3: Object Instance Management - RemoveObjectInstance Callback
// =============================================================================

// RemoveObjectInstanceCallback is called when an object instance is removed
type RemoveObjectInstanceCallback func(objectHandle uint32, objectName string, reason RemoveReason)

// RemoveReason defines why an object was removed
type RemoveReason uint8

const (
	RemoveReasonInternal   RemoveReason = 0
	RemoveReasonDeleted    RemoveReason = 1
	RemoveReasonUnregistered RemoveReason = 2
	RemoveReasonTimeout    RemoveReason = 3
)

// RemoveObjectInstance invokes registered remove callbacks for an object
func (m *ObjectManager) RemoveObjectInstance(objectHandle uint32, reason RemoveReason) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	instance, ok := m.instances[objectHandle]
	if !ok {
		return fmt.Errorf("object handle %d not found", objectHandle)
	}

	objectName := instance.Name

	// Remove from instances map
	delete(m.instances, objectHandle)
	delete(m.names, instance.Name)

	// Invoke callbacks
	for _, cb := range m.removeObjectInstanceCallbacks {
		cb(objectHandle, objectName, reason)
	}

	return nil
}

// RegisterRemoveObjectInstanceCallback registers a remove object instance callback
func (m *ObjectManager) RegisterRemoveObjectInstanceCallback(cb RemoveObjectInstanceCallback) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.removeObjectInstanceCallbacks = append(m.removeObjectInstanceCallbacks, cb)
}

// =============================================================================
// Phase 3.4: Ownership - Additional Callbacks
// =============================================================================

// RegisterAttributeOwnershipUnavailableCallback registers the callback
func (m *OwnershipManager) RegisterAttributeOwnershipUnavailableCallback(cb AttributeOwnershipUnavailableCallback) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.attrUnavailableCallbacks = append(m.attrUnavailableCallbacks, cb)
}

// RegisterAttributeOwnershipDivestitureNotificationCallback registers the callback
func (m *OwnershipManager) RegisterAttributeOwnershipDivestitureNotificationCallback(cb AttributeOwnershipDivestitureNotificationCallback) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.attrDivestitureCallbacks = append(m.attrDivestitureCallbacks, cb)
}

// RegisterConfirmAttributeOwnershipAcquisitionCallback registers the callback
func (m *OwnershipManager) RegisterConfirmAttributeOwnershipAcquisitionCallback(cb ConfirmAttributeOwnershipAcquisitionCallback) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.confirmAcquisitionCallbacks = append(m.confirmAcquisitionCallbacks, cb)
}

// InvokeAttributeOwnershipUnavailable invokes unavailable callbacks
func (m *OwnershipManager) InvokeAttributeOwnershipUnavailable(objectHandle uint32, attributes []uint32) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, cb := range m.attrUnavailableCallbacks {
		cb(objectHandle, attributes) // owner=0 means unavailable - not passed to callback
	}
}

// InvokeAttributeOwnershipDivestitureNotification invokes divestiture callbacks
func (m *OwnershipManager) InvokeAttributeOwnershipDivestitureNotification(objectHandle uint32, attributes []uint32, owner uint32) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, cb := range m.attrDivestitureCallbacks {
		cb(objectHandle, attributes, owner)
	}
}

// ConfirmAttributeOwnershipAcquisition confirms acquisition if callback returns true
func (m *OwnershipManager) ConfirmAttributeOwnershipAcquisition(objectHandle uint32, attributes []uint32, owner uint32) bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, cb := range m.confirmAcquisitionCallbacks {
		if !cb(objectHandle, attributes, owner) {
			return false
		}
	}
	return true
}

// AttributeOwnershipDivestitureNotificationCallback type (add missing callback)
type AttributeOwnershipDivestitureNotificationCallback func(objectHandle uint32, attributes []uint32, owner uint32)

// =============================================================================
// Phase 3.5: Time Management - Enable/Disable Asynchronous Delivery
// =============================================================================

// EnableAsynchronousDelivery enables asynchronous delivery of updates
func (t *TimeManager) EnableAsynchronousDelivery() error {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.AsyncDeliveryEnabled = true
	return nil
}

// DisableAsynchronousDelivery disables asynchronous delivery
func (t *TimeManager) DisableAsynchronousDelivery() error {
	t.mu.Lock()
	defer t.mu.Unlock()
	t.AsyncDeliveryEnabled = false
	return nil
}

// IsAsynchronousDeliveryEnabled returns current async delivery state
func (t *TimeManager) IsAsynchronousDeliveryEnabled() bool {
	t.mu.Lock()
	defer t.mu.Unlock()
	return t.AsyncDeliveryEnabled
}

// =============================================================================
// Phase 3.6: DDM Region-based Subscription Extensions
// =============================================================================

// UnsubscribeObjectClassAttributesWithRegion unsubscribes with a region
func (m *DDMManager) UnsubscribeObjectClassAttributesWithRegion(classHandle, regionHandle uint32) error {
	if m.objectClassRegions != nil && m.objectClassRegions[classHandle] != nil {
		delete(m.objectClassRegions[classHandle], regionHandle)
	}
	return nil
}

// UnsubscribeInteractionWithRegion unsubscribes from interactions with a region
func (m *DDMManager) UnsubscribeInteractionWithRegion(classHandle, regionHandle uint32) error {
	if m.interactionRegions != nil && m.interactionRegions[classHandle] != nil {
		delete(m.interactionRegions[classHandle], regionHandle)
	}
	return nil
}

// GetObjectClass returns the object class for a handle
func (m *DDMManager) GetObjectClass(objectHandle uint32) (uint32, error) {
	// This would normally look up the object instance's class
	// For now, return a placeholder
	return 0, nil
}

// RegionSubscriptionCallback is called when region subscription changes occur
type RegionSubscriptionCallback func(regionHandle uint32, classHandle uint32, action RegionAction)

// RegionAction defines what happened to the region subscription
type RegionAction uint8

const (
	RegionActionSubscribe   RegionAction = 0
	RegionActionUnsubscribe RegionAction = 1
	RegionActionModify      RegionAction = 2
)

// RegisterRegionSubscriptionCallback registers a region callback
func (m *DDMManager) RegisterRegionSubscriptionCallback(cb RegionSubscriptionCallback) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.regionCallbacks = append(m.regionCallbacks, cb)
}

// InvokeRegionSubscription invokes region callbacks
func (m *DDMManager) InvokeRegionSubscription(regionHandle, classHandle uint32, action RegionAction) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, cb := range m.regionCallbacks {
		cb(regionHandle, classHandle, action)
	}
}