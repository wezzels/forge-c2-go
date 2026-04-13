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
