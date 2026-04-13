package hla

import (
	"testing"
	"time"
)

func TestSynchronizationPoint(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	label := "SyncPoint1"
	err := gateway.RegisterFederationSynchronizationPoint(label, []byte("tag"))
	if err != nil {
		t.Fatalf("RegisterFederationSynchronizationPoint failed: %v", err)
	}

	err = gateway.SynchronizationPointAchieved(label)
	if err != nil {
		t.Fatalf("SynchronizationPointAchieved failed: %v", err)
	}

	t.Logf("SynchronizationPoint: registered and achieved %s", label)
}

func TestFederationSaveRestore(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, err := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	if err != nil {
		t.Fatalf("JoinFederation failed: %v", err)
	}

	saveLabel := "Save1"
	err = gateway.RequestFederationSave(saveLabel, time.Now().Add(time.Second))
	if err != nil {
		t.Fatalf("RequestFederationSave failed: %v", err)
	}

	status, err := gateway.QueryFederationSaveStatus()
	if err != nil {
		t.Fatalf("QueryFederationSaveStatus failed: %v", err)
	}

	if status == nil {
		t.Fatal("SaveStatus should not be nil")
	}

	t.Logf("FederationSaveRestore: handle=%d save=%s", handle, saveLabel)
}

func TestSynchronizationPointCallbacks(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	gateway.RegisterFederationSynchronizationPoint("TestSync", []byte("syncTag"))
	gateway.AnnounceSynchronizationPoint("TestSync", []byte("syncTag"))
	gateway.SynchronizationPointRegistrationSucceeded("TestSync")

	t.Logf("SynchronizationPointCallbacks: OK")
}

func TestFederationRestoreRequest(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	_, err := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	if err != nil {
		t.Fatalf("JoinFederation failed: %v", err)
	}

	restoreLabel := "Restore1"
	err = gateway.RequestFederationRestore(restoreLabel)
	if err != nil {
		t.Fatalf("RequestFederationRestore failed: %v", err)
	}

	t.Logf("FederationRestoreRequest: label=%s", restoreLabel)
}

func TestPublishInteractionClass(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	err := gateway.PublishInteractionClass("WeaponFireInteraction")
	if err != nil {
		t.Fatalf("PublishInteractionClass failed: %v", err)
	}

	if !gateway.IsInteractionClassPublished("WeaponFireInteraction") {
		t.Error("WeaponFireInteraction should be published")
	}

	t.Log("PublishInteractionClass: published WeaponFireInteraction")
}

func TestUnpublishInteractionClass(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	gateway.PublishInteractionClass("TestInteraction")
	err := gateway.UnpublishInteractionClass("TestInteraction")
	if err != nil {
		t.Fatalf("UnpublishInteractionClass failed: %v", err)
	}

	if gateway.IsInteractionClassPublished("TestInteraction") {
		t.Error("TestInteraction should not be published after unpublish")
	}

	t.Log("UnpublishInteractionClass: unpublished TestInteraction")
}

func TestSubscribeInteractionClass(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	err := gateway.SubscribeInteractionClass("CollisionInteraction")
	if err != nil {
		t.Fatalf("SubscribeInteractionClass failed: %v", err)
	}

	if !gateway.IsInteractionClassSubscribed("CollisionInteraction") {
		t.Error("CollisionInteraction should be subscribed")
	}

	t.Log("SubscribeInteractionClass: subscribed to CollisionInteraction")
}

func TestUnsubscribeInteractionClass(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	gateway.SubscribeInteractionClass("TestInteraction")
	err := gateway.UnsubscribeInteractionClass("TestInteraction")
	if err != nil {
		t.Fatalf("UnsubscribeInteractionClass failed: %v", err)
	}

	if gateway.IsInteractionClassSubscribed("TestInteraction") {
		t.Error("TestInteraction should not be subscribed after unsubscribe")
	}

	t.Log("UnsubscribeInteractionClass: unsubscribed from TestInteraction")
}

func TestChangeAttributeTypes(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	err := gateway.ChangeAttributeTransportType("TankEntity", "Position", 1)
	if err != nil {
		t.Fatalf("ChangeAttributeTransportType failed: %v", err)
	}

	err = gateway.ChangeAttributeOrderType("TankEntity", "Position", 2)
	if err != nil {
		t.Fatalf("ChangeAttributeOrderType failed: %v", err)
	}

	t.Log("ChangeAttributeTypes: transport=1, order=2")
}

func TestOwnershipCallbacks(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	// Test ownership callbacks
	err := gateway.AttributeOwnershipUnavailableCallback(1, []uint32{1, 2, 3})
	if err != nil {
		t.Fatalf("AttributeOwnershipUnavailableCallback failed: %v", err)
	}

	err = gateway.AttributeOwnershipDivestitureNotificationCallback(1, []uint32{1})
	if err != nil {
		t.Fatalf("AttributeOwnershipDivestitureNotificationCallback failed: %v", err)
	}

	err = gateway.ConfirmAttributeOwnershipAcquisitionCallback(1, []uint32{1}, []byte("tag"))
	if err != nil {
		t.Fatalf("ConfirmAttributeOwnershipAcquisitionCallback failed: %v", err)
	}

	t.Log("Ownership callbacks: OK")
}

func TestTimeCallbacks(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	err := gateway.TimeAdvanceGrantCallback(time.Now().Add(time.Second))
	if err != nil {
		t.Fatalf("TimeAdvanceGrantCallback failed: %v", err)
	}

	err = gateway.EnableAsynchronousDelivery()
	if err != nil {
		t.Fatalf("EnableAsynchronousDelivery failed: %v", err)
	}

	if !gateway.IsAsynchronousDeliveryEnabled() {
		t.Error("AsynchronousDelivery should be enabled")
	}

	err = gateway.DisableAsynchronousDelivery()
	if err != nil {
		t.Fatalf("DisableAsynchronousDelivery failed: %v", err)
	}

	t.Log("Time callbacks: OK")
}

func TestRegionSubscriptions(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	err := gateway.SubscribeObjectClassAttributesWithRegion("TankEntity", []uint32{1, 2, 3}, 100)
	if err != nil {
		t.Fatalf("SubscribeObjectClassAttributesWithRegion failed: %v", err)
	}

	err = gateway.UnsubscribeObjectClassAttributesWithRegion("TankEntity", 100)
	if err != nil {
		t.Fatalf("UnsubscribeObjectClassAttributesWithRegion failed: %v", err)
	}

	t.Log("Region subscriptions: OK")
}

func TestTimeRegulationCallbacks(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	handle, _ := gateway.JoinFederation("TestFed", "FORGE-C2", "TestFederate")
	_ = handle

	err := gateway.TimeRegulationEnabledCallback(handle)
	if err != nil {
		t.Fatalf("TimeRegulationEnabledCallback failed: %v", err)
	}

	err = gateway.TimeConstrainedEnabledCallback(handle)
	if err != nil {
		t.Fatalf("TimeConstrainedEnabledCallback failed: %v", err)
	}

	t.Log("Time regulation callbacks: OK")
}

func TestObjectClassHandles(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	gateway.RegisterObjectClass("TankEntity", 1)
	gateway.RegisterObjectClass("AircraftEntity", 2)

	if gateway.GetObjectClass("TankEntity") != 1 {
		t.Error("TankEntity should have handle 1")
	}
	if gateway.GetObjectClass("AircraftEntity") != 2 {
		t.Error("AircraftEntity should have handle 2")
	}
	if gateway.GetObjectClass("Unknown") != 0 {
		t.Error("Unknown should have handle 0")
	}

	t.Log("Object class handles: OK")
}

func TestVariableRateTransmission(t *testing.T) {
	SetTransmissionRate("track-update", 10.0)
	SetTransmissionRate("status-update", 1.0)

	if GetTransmissionRate("track-update") != 10.0 {
		t.Error("track-update should be 10.0")
	}
	if GetTransmissionRate("status-update") != 1.0 {
		t.Error("status-update should be 1.0")
	}
	if GetTransmissionRate("unknown") != 1.0 {
		t.Error("unknown should default to 1.0")
	}

	t.Log("Variable rate transmission: OK")
}

func TestC3WarfareSimulation(t *testing.T) {
	c3 := &C3System{
		Domain: DomainLand,
		UnitID: "BattalionHQ",
		Connected: []string{"CompanyA", "CompanyB", "CompanyC"},
	}

	err := c3.SendC3Message("CompanyA", "Orders", []byte("Advance"))
	if err != nil {
		t.Fatalf("SendC3Message failed: %v", err)
	}

	err = c3.BroadcastC3Message("SitRep", []byte("All units report"))
	if err != nil {
		t.Fatalf("BroadcastC3Message failed: %v", err)
	}

	t.Logf("C3 system: %s connected to %d units", c3.UnitID, len(c3.Connected))
}
