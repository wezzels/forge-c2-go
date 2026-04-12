package jreap

import (
	"fmt"
	"net"
	"sync"
	"time"
)

// MulticastConfig holds multicast receiver configuration.
type MulticastConfig struct {
	GroupAddress   string
	Port           int
	Interface      string
	MaxPacketSize  int
	TTL            int
}

// MulticastReceiver handles true IP multicast reception.
type MulticastReceiver struct {
	config MulticastConfig
	conn   *net.UDPConn
	closed bool
	closeMu sync.Mutex
}

// NewMulticastReceiver creates a new multicast receiver.
func NewMulticastReceiver(config MulticastConfig) (*MulticastReceiver, error) {
	if config.MaxPacketSize == 0 {
		config.MaxPacketSize = 65536
	}

	addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", config.GroupAddress, config.Port))
	if err != nil {
		return nil, fmt.Errorf("resolve address: %w", err)
	}

	conn, err := net.ListenMulticastUDP("udp", nil, addr)
	if err != nil {
		return nil, fmt.Errorf("listen multicast: %w", err)
	}

	return &MulticastReceiver{
		config: config,
		conn:   conn,
	}, nil
}

// Receive reads a multicast packet.
func (r *MulticastReceiver) Receive(buf []byte) (n int, from *net.UDPAddr, err error) {
	r.closeMu.Lock()
	defer r.closeMu.Unlock()

	if r.closed {
		return 0, nil, fmt.Errorf("receiver closed")
	}

	r.conn.SetReadDeadline(time.Now().Add(5 * time.Second))
	n, from, err = r.conn.ReadFromUDP(buf)
	return n, from, err
}

// Close closes the receiver.
func (r *MulticastReceiver) Close() error {
	r.closeMu.Lock()
	defer r.closeMu.Unlock()

	if r.closed {
		return nil
	}
	r.closed = true
	return r.conn.Close()
}
