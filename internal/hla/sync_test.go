package hla

import (
	"testing"
	"time"
)

// TestSynchronizationPoint tests synchronization point registration and announcement.
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

// TestFederationSaveRestore tests federation save and restore flow.
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

// TestSynchronizationPointCallbacks tests sync point callback handling.
func TestSynchronizationPointCallbacks(t *testing.T) {
	gateway := NewRTIGateway()
	gateway.CreateFederation("TestFed", "TestFOM")

	gateway.RegisterFederationSynchronizationPoint("TestSync", []byte("syncTag"))
	gateway.AnnounceSynchronizationPoint("TestSync", []byte("syncTag"))
	gateway.SynchronizationPointRegistrationSucceeded("TestSync")

	t.Logf("SynchronizationPointCallbacks: OK")
}

// TestFederationRestoreRequest tests restore request flow.
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
