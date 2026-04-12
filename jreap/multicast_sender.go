package jreap

import (
	"fmt"
	"net"
)

// MulticastSender handles true IP multicast transmission.
type MulticastSender struct {
	conn   *net.UDPConn
	addr   *net.UDPAddr
	closed bool
}

// MulticastSenderConfig holds sender configuration.
type MulticastSenderConfig struct {
	GroupAddress  string
	Port         int
	SourceAddress string
	TTL          int
	Interface    string
}

// NewMulticastSender creates a new multicast sender.
func NewMulticastSender(config MulticastSenderConfig) (*MulticastSender, error) {
	dest := fmt.Sprintf("%s:%d", config.GroupAddress, config.Port)
	addr, err := net.ResolveUDPAddr("udp", dest)
	if err != nil {
		return nil, fmt.Errorf("resolve address: %w", err)
	}

	var laddr *net.UDPAddr
	if config.SourceAddress != "" {
		laddr, err = net.ResolveUDPAddr("udp", config.SourceAddress)
		if err != nil {
			return nil, fmt.Errorf("resolve source: %w", err)
		}
	}

	conn, err := net.DialUDP("udp", laddr, addr)
	if err != nil {
		return nil, fmt.Errorf("dial: %w", err)
	}

	return &MulticastSender{
		conn: conn,
		addr: addr,
	}, nil
}

// Send transmits a multicast packet.
func (s *MulticastSender) Send(buf []byte) (int, error) {
	if s.closed {
		return 0, fmt.Errorf("sender closed")
	}
	return s.conn.Write(buf)
}

// Close closes the sender.
func (s *MulticastSender) Close() error {
	if s.closed {
		return nil
	}
	s.closed = true
	return s.conn.Close()
}
