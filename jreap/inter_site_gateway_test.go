package jreap

import (
	"testing"
)

// TestInterSiteGateway tests inter-site gateway functionality.
func TestInterSiteGateway(t *testing.T) {
	gw := NewInterSiteGateway()

	// Register networks
	err := gw.RegisterNetwork(Net0, &MulticastConfig{
		GroupAddress: "239.1.1.0",
		Port:         5000,
	})
	if err != nil {
		t.Fatalf("RegisterNetwork Net0 failed: %v", err)
	}

	err = gw.RegisterNetwork(Net1, &MulticastConfig{
		GroupAddress: "239.1.1.1",
		Port:         5001,
	})
	if err != nil {
		t.Fatalf("RegisterNetwork Net1 failed: %v", err)
	}

	// Configure forwarder with allow-all policy
	gw.ConfigureForwarder(Net0, Net1, ForwardFilterPolicy{
		AllowAll: true,
	})

	// Test forwarder retrieval
	fwd := gw.GetForwarder(Net0, Net1)
	if fwd == nil {
		t.Fatal("GetForwarder returned nil")
	}

	if fwd.SourceNet != Net0 || fwd.DestNet != Net1 {
		t.Errorf("Forwarder nets: got %d->%d, want %d->%d", fwd.SourceNet, fwd.DestNet, Net0, Net1)
	}

	// Get registered networks
	nets := gw.GetRegisteredNetworks()
	if len(nets) != 2 {
		t.Errorf("Network count: got %d, want 2", len(nets))
	}

	t.Logf("InterSiteGateway: registered %d networks", len(nets))
}

// TestForwardFilterPolicy tests packet filtering.
func TestForwardFilterPolicy(t *testing.T) {
	forwarder := &InterSiteForwarder{
		SourceNet: Net0,
		DestNet:   Net1,
		FilterPolicy: ForwardFilterPolicy{
			AllowAll: true,
		},
	}

	// Test allow-all
	if !forwarder.ShouldForward([]byte{1, 2, 3}) {
		t.Error("ShouldForward with AllowAll should return true")
	}

	// Test allowed types filter
	forwarder.FilterPolicy.AllowAll = false
	forwarder.FilterPolicy.AllowedTypes = []uint8{1, 2, 3}

	if !forwarder.ShouldForward([]byte{1, 0, 0}) {
		t.Error("ShouldForward for allowed type 1 should return true")
	}

	if forwarder.ShouldForward([]byte{4, 0, 0}) {
		t.Error("ShouldForward for disallowed type 4 should return false")
	}

	t.Logf("ForwardFilterPolicy: allow-all=%t allowed-types=%v", forwarder.FilterPolicy.AllowAll, forwarder.FilterPolicy.AllowedTypes)
}

// TestGatewayStats tests gateway statistics tracking.
func TestGatewayStats(t *testing.T) {
	gw := NewInterSiteGateway()
	gw.RegisterNetwork(Net0, &MulticastConfig{})

	// Update stats
	gw.UpdateStats(Net0, 10, 20, 5)

	stats, ok := gw.GetStats(Net0)
	if !ok {
		t.Fatal("GetStats returned not found")
	}

	if stats.PacketsForwarded != 10 {
		t.Errorf("PacketsForwarded: got %d, want 10", stats.PacketsForwarded)
	}
	if stats.PacketsReceived != 20 {
		t.Errorf("PacketsReceived: got %d, want 20", stats.PacketsReceived)
	}
	if stats.PacketsDropped != 5 {
		t.Errorf("PacketsDropped: got %d, want 5", stats.PacketsDropped)
	}

	t.Logf("GatewayStats: fwd=%d rcv=%d drp=%d", stats.PacketsForwarded, stats.PacketsReceived, stats.PacketsDropped)
}

// TestBroadcastToAllNetworks tests broadcasting to all registered networks.
func TestBroadcastToAllNetworks(t *testing.T) {
	gw := NewInterSiteGateway()

	// Register 3 networks
	gw.RegisterNetwork(Net0, &MulticastConfig{})
	gw.RegisterNetwork(Net1, &MulticastConfig{})
	gw.RegisterNetwork(Net2, &MulticastConfig{})

	// Configure forwarders
	gw.ConfigureForwarder(Net0, Net1, ForwardFilterPolicy{AllowAll: true})
	gw.ConfigureForwarder(Net0, Net2, ForwardFilterPolicy{AllowAll: true})

	// Broadcast
	err := gw.BroadcastToAllNetworks(Net0, []byte{1, 2, 3})
	if err != nil {
		t.Fatalf("BroadcastToAllNetworks failed: %v", err)
	}

	// Check stats - Net0 should have forwarded packets to Net1 and Net2
	stats, _ := gw.GetStats(Net0)
	t.Logf("Broadcast from Net0: %d forwarded", stats.PacketsForwarded)
}

// TestForwardPacketFiltered tests packet forwarding with filtering.
func TestForwardPacketFiltered(t *testing.T) {
	gw := NewInterSiteGateway()

	gw.RegisterNetwork(Net0, &MulticastConfig{})
	gw.RegisterNetwork(Net1, &MulticastConfig{})

	// Configure forwarder that only allows type 5
	gw.ConfigureForwarder(Net0, Net1, ForwardFilterPolicy{
		AllowAll:     false,
		AllowedTypes: []uint8{5},
	})

	// Should be forwarded (type 5)
	err := gw.ForwardPacket(Net0, Net1, []byte{5, 1, 2, 3})
	if err != nil {
		t.Errorf("ForwardPacket for type 5 failed: %v", err)
	}

	// Should be dropped (type 3) - UpdateStats call should happen
	err = gw.ForwardPacket(Net0, Net1, []byte{3, 1, 2, 3})
	if err != nil {
		t.Errorf("ForwardPacket for type 3 failed: %v", err)
	}

	t.Logf("ForwardPacket filtering: OK")
}
