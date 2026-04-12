package jreap

import (
	"fmt"
	"net"
	"sync"
	"time"
)

// =============================================================================
// Phase 0.1.10: Inter-Site Gateway Transport
// Forwards packets between Link 16 network numbers
// =============================================================================

// NetworkNumber represents a Link 16 network number (0-63)
type NetworkNumber uint8

// NetNumber constants
const (
	Net0  NetworkNumber = 0
	Net1  NetworkNumber = 1
	Net2  NetworkNumber = 2
	Net3  NetworkNumber = 3
	Net4  NetworkNumber = 4
	Net5  NetworkNumber = 5
	Net6  NetworkNumber = 6
	Net7  NetworkNumber = 7
	Net8  NetworkNumber = 8
	Net9  NetworkNumber = 9
	Net10 NetworkNumber = 10
	Net11 NetworkNumber = 11
	Net12 NetworkNumber = 12
	Net13 NetworkNumber = 13
	Net14 NetworkNumber = 14
	Net15 NetworkNumber = 15
	Net16 NetworkNumber = 16
	Net17 NetworkNumber = 17
	Net18 NetworkNumber = 18
	Net19 NetworkNumber = 19
	Net20 NetworkNumber = 20
	Net21 NetworkNumber = 21
	Net22 NetworkNumber = 22
	Net23 NetworkNumber = 23
)

// InterSiteGateway forwards Link 16 packets between network numbers.
// This enables multi-net exercises where participants on different networks need to communicate.
type InterSiteGateway struct {
	// Networks maps network numbers to their multicast configurations
	Networks map[NetworkNumber]*MulticastConfig

	// Forwarders maps source network to forwarder for each destination
	Forwarders map[NetworkNumber]map[NetworkNumber]*InterSiteForwarder

	// RegisteredHandlers are called when packets are received
	Handlers map[NetworkNumber][]PacketHandler

	// Statistics
	Stats map[NetworkNumber]GatewayStats

	mu sync.RWMutex
}

// GatewayStats tracks gateway statistics
type GatewayStats struct {
	PacketsForwarded uint64
	PacketsReceived  uint64
	PacketsDropped   uint64
	LastForwardTime  int64
}

// InterSiteForwarder forwards packets from one network to another
type InterSiteForwarder struct {
	SourceNet    NetworkNumber
	DestNet      NetworkNumber
	FilterPolicy ForwardFilterPolicy
}

// ForwardFilterPolicy defines filtering rules for forwarding
type ForwardFilterPolicy struct {
	AllowAll          bool
	AllowedTypes      []uint8 // PDU types to forward
	BlockedTypes      []uint8 // PDU types to block
	AllowedSources    []uint32 // Source IDs to forward
	AllowedDestinations []uint32 // Destination IDs to forward
}

// NewInterSiteGateway creates a new inter-site gateway
func NewInterSiteGateway() *InterSiteGateway {
	return &InterSiteGateway{
		Networks:   make(map[NetworkNumber]*MulticastConfig),
		Forwarders: make(map[NetworkNumber]map[NetworkNumber]*InterSiteForwarder),
		Handlers:   make(map[NetworkNumber][]PacketHandler),
		Stats:      make(map[NetworkNumber]GatewayStats),
	}
}

// RegisterNetwork registers a network number with its multicast config
func (g *InterSiteGateway) RegisterNetwork(net NetworkNumber, config *MulticastConfig) error {
	g.mu.Lock()
	defer g.mu.Unlock()

	if _, exists := g.Networks[net]; exists {
		return fmt.Errorf("network %d already registered", net)
	}

	g.Networks[net] = config
	g.Stats[net] = GatewayStats{}
	return nil
}

// ConfigureForwarder configures forwarding between two networks
func (g *InterSiteGateway) ConfigureForwarder(source, dest NetworkNumber, policy ForwardFilterPolicy) {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.Forwarders[source] == nil {
		g.Forwarders[source] = make(map[NetworkNumber]*InterSiteForwarder)
	}

	g.Forwarders[source][dest] = &InterSiteForwarder{
		SourceNet:    source,
		DestNet:      dest,
		FilterPolicy: policy,
	}
}

// RegisterHandler registers a packet handler for a network
func (g *InterSiteGateway) RegisterHandler(net NetworkNumber, handler PacketHandler) {
	g.mu.Lock()
	defer g.mu.Unlock()

	g.Handlers[net] = append(g.Handlers[net], handler)
}

// ShouldForward determines if a packet should be forwarded based on filter policy
func (f *InterSiteForwarder) ShouldForward(pdu []byte) bool {
	if f.FilterPolicy.AllowAll {
		return true
	}

	if len(f.FilterPolicy.AllowedTypes) > 0 {
		if len(pdu) < 1 {
			return false
		}
		pduType := pdu[0]
		for _, allowed := range f.FilterPolicy.AllowedTypes {
			if pduType == allowed {
				return true
			}
		}
		return false
	}

	return true
}

// GetForwarder returns the forwarder for a source/destination pair
func (g *InterSiteGateway) GetForwarder(source, dest NetworkNumber) *InterSiteForwarder {
	g.mu.RLock()
	defer g.mu.RUnlock()

	if g.Forwarders[source] == nil {
		return nil
	}
	return g.Forwarders[source][dest]
}

// UpdateStats updates gateway statistics
func (g *InterSiteGateway) UpdateStats(net NetworkNumber, forwarded, received, dropped uint64) {
	g.mu.Lock()
	defer g.mu.Unlock()

	stats := &GatewayStats{}
	*stats = g.Stats[net] // Copy current stats
	stats.PacketsForwarded += forwarded
	stats.PacketsReceived += received
	stats.PacketsDropped += dropped
	stats.LastForwardTime = int64(time.Now().Unix())
	g.Stats[net] = *stats
}

// GetStats returns statistics for a network
func (g *InterSiteGateway) GetStats(net NetworkNumber) (GatewayStats, bool) {
	g.mu.RLock()
	defer g.mu.RUnlock()

	stats, ok := g.Stats[net]
	return stats, ok
}

// PacketHandler is called when packets are received
type PacketHandler interface {
	HandlePacket(net NetworkNumber, pdu []byte, from *net.UDPAddr) error
}

// ForwardPacket forwards a packet from one network to another
func (g *InterSiteGateway) ForwardPacket(sourceNet NetworkNumber, destNet NetworkNumber, pdu []byte) error {
	g.mu.RLock()
	forwarder := g.Forwarders[sourceNet][destNet]
	sourceExists := g.Networks[sourceNet] != nil
	destExists := g.Networks[destNet] != nil
	g.mu.RUnlock()

	if !sourceExists || !destExists {
		return fmt.Errorf("network not registered")
	}

	if forwarder == nil {
		return fmt.Errorf("no forwarder configured for %d -> %d", sourceNet, destNet)
	}

	if !forwarder.ShouldForward(pdu) {
		g.UpdateStats(sourceNet, 0, 1, 1)
		return nil // Dropped by filter
	}

	// In real implementation, this would send via the destination's sender
	g.UpdateStats(sourceNet, 1, 0, 0)

	return nil
}

// BroadcastToAllNetworks sends a packet to all registered networks
func (g *InterSiteGateway) BroadcastToAllNetworks(sourceNet NetworkNumber, pdu []byte) error {
	g.mu.RLock()
	destinations := make([]NetworkNumber, 0, len(g.Networks))
	for net := range g.Networks {
		if net != sourceNet {
			destinations = append(destinations, net)
		}
	}
	g.mu.RUnlock()

	for _, dest := range destinations {
		if err := g.ForwardPacket(sourceNet, dest, pdu); err != nil {
			// Log but continue
			continue
		}
	}

	return nil
}

// GetRegisteredNetworks returns all registered network numbers
func (g *InterSiteGateway) GetRegisteredNetworks() []NetworkNumber {
	g.mu.RLock()
	defer g.mu.RUnlock()

	nets := make([]NetworkNumber, 0, len(g.Networks))
	for net := range g.Networks {
		nets = append(nets, net)
	}
	return nets
}
