package jreap

import (
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"net"
	"sync"
	"time"
)

// Transport protocol type.
type Protocol string

const (
	ProtocolUDP Protocol = "udp"
	ProtocolTCP Protocol = "tcp"
)

// Config holds JREAP transport configuration.
type Config struct {
	// LocalAddr is the local address to bind to (e.g., ":5000").
	LocalAddr string

	// RemoteAddr is the remote address to send to (e.g., "192.168.1.100:5000").
	RemoteAddr string

	// Protocol is the transport protocol ("udp" or "tcp").
	Protocol Protocol

	// BufSize is the receive buffer size for UDP (default 8192).
	BufSize int

	// TCPTimeout is the read timeout for TCP connections.
	TCPTimeout time.Duration

	// MaxConnections is the maximum number of TCP connections (default 10).
	MaxConnections int
}

// DefaultConfig returns a Config with sensible defaults.
func DefaultConfig() *Config {
	return &Config{
		Protocol:       ProtocolUDP,
		BufSize:       8192,
		TCPTimeout:    30 * time.Second,
		MaxConnections: 10,
	}
}

// Errors for transport layer.
var (
	ErrNotConnected    = errors.New("not connected")
	ErrConnectionFailed = errors.New("connection failed")
	ErrWriteFailed      = errors.New("write failed")
	ErrReadFailed       = errors.New("read failed")
	ErrInvalidAddress   = errors.New("invalid address")
	ErrListenerClosed   = errors.New("listener closed")
)

// JREAPUDPConn is a UDP connection for JREAP-C messages.
type JREAPUDPConn struct {
	conn   *net.UDPConn
	config *Config
	mu     sync.RWMutex
}

// NewJREAPUDPConn creates a new UDP JREAP connection.
// If localAddr is empty, binds to a random available port.
func NewJREAPUDPConn(localAddr string, bufSize int) (*JREAPUDPConn, error) {
	if bufSize <= 0 {
		bufSize = 8192
	}

	var addr *net.UDPAddr
	var err error

	if localAddr != "" {
		addr, err = net.ResolveUDPAddr("udp", localAddr)
		if err != nil {
			return nil, fmt.Errorf("%w: %v", ErrInvalidAddress, err)
		}
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrConnectionFailed, err)
	}

	if err := conn.SetReadBuffer(bufSize); err != nil {
		conn.Close()
		return nil, fmt.Errorf("failed to set read buffer: %w", err)
	}

	return &JREAPUDPConn{
		conn:   conn,
		config: &Config{LocalAddr: conn.LocalAddr().String(), BufSize: bufSize, Protocol: ProtocolUDP},
	}, nil
}

// Encode encodes a JREAP message (header + payload + CRC) and returns the bytes.
// This is a convenience wrapper around EncodeFull.
func (c *JREAPUDPConn) Encode(payload []byte, messageType uint8) ([]byte, error) {
	return EncodeFull(payload, messageType, CRC16)
}

// Decode decodes a JREAP message from bytes and returns the header, payload, and CRC.
// This is a convenience wrapper around DecodeFull.
func (c *JREAPUDPConn) Decode(buf []byte) (*Header, []byte, uint16, error) {
	return DecodeFull(buf)
}

// SendTo sends an encoded JREAP message to a specific address.
func (c *JREAPUDPConn) SendTo(addr string, msg []byte) error {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if c.conn == nil {
		return ErrNotConnected
	}

	udpAddr, err := net.ResolveUDPAddr("udp", addr)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidAddress, err)
	}

	n, err := c.conn.WriteToUDP(msg, udpAddr)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrWriteFailed, err)
	}
	if n != len(msg) {
		return fmt.Errorf("%w: partial write", ErrWriteFailed)
	}

	return nil
}

// ReadFrom reads a JREAP message and returns it along with the sender's address.
func (c *JREAPUDPConn) ReadFrom() ([]byte, *net.UDPAddr, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if c.conn == nil {
		return nil, nil, ErrNotConnected
	}

	buf := make([]byte, c.config.BufSize)
	n, addr, err := c.conn.ReadFromUDP(buf)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %v", ErrReadFailed, err)
	}

	msg := make([]byte, n)
	copy(msg, buf[:n])
	return msg, addr, nil
}

// ReadFromWithTimeout reads a JREAP message with a timeout.
func (c *JREAPUDPConn) ReadFromWithTimeout(timeout time.Duration) ([]byte, *net.UDPAddr, error) {
	c.mu.RLock()
	conn := c.conn
	c.mu.RUnlock()

	if conn == nil {
		return nil, nil, ErrNotConnected
	}

	conn.SetReadDeadline(time.Now().Add(timeout))

	buf := make([]byte, c.config.BufSize)
	n, addr, err := conn.ReadFromUDP(buf)
	if err != nil {
		if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
			return nil, nil, nil // Timeout, not an error
		}
		return nil, nil, fmt.Errorf("%w: %v", ErrReadFailed, err)
	}

	msg := make([]byte, n)
	copy(msg, buf[:n])
	return msg, addr, nil
}

// LocalAddr returns the local UDP address.
func (c *JREAPUDPConn) LocalAddr() net.Addr {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if c.conn == nil {
		return nil
	}
	return c.conn.LocalAddr()
}

// Close closes the UDP connection.
func (c *JREAPUDPConn) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.conn != nil {
		err := c.conn.Close()
		c.conn = nil
		return err
	}
	return nil
}

// JREAPTCPConn is a TCP connection for JREAP-C messages.
type JREAPTCPConn struct {
	conn   net.Conn
	config *Config
	mu     sync.RWMutex
}

// NewJREAPTCPConn connects to a remote JREAP endpoint over TCP.
func NewJREAPTCPConn(remoteAddr string, timeout time.Duration) (*JREAPTCPConn, error) {
	conn, err := net.DialTimeout("tcp", remoteAddr, timeout)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrConnectionFailed, err)
	}

	return &JREAPTCPConn{
		conn:   conn,
		config: &Config{RemoteAddr: remoteAddr, Protocol: ProtocolTCP},
	}, nil
}

// Encode encodes a JREAP message (header + payload + CRC) and returns the bytes.
func (c *JREAPTCPConn) Encode(payload []byte, messageType uint8) ([]byte, error) {
	return EncodeFull(payload, messageType, CRC16)
}

// Decode decodes a JREAP message from bytes and returns the header, payload, and CRC.
func (c *JREAPTCPConn) Decode(buf []byte) (*Header, []byte, uint16, error) {
	return DecodeFull(buf)
}

// Write writes a JREAP message to the TCP connection.
func (c *JREAPTCPConn) Write(msg []byte) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.conn == nil {
		return ErrNotConnected
	}

	n, err := c.conn.Write(msg)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrWriteFailed, err)
	}
	if n != len(msg) {
		return fmt.Errorf("%w: partial write", ErrWriteFailed)
	}

	return nil
}

// WriteWithTimeout writes with a timeout.
func (c *JREAPTCPConn) WriteWithTimeout(msg []byte, timeout time.Duration) error {
	c.mu.RLock()
	conn := c.conn
	c.mu.RUnlock()

	if conn == nil {
		return ErrNotConnected
	}

	if err := conn.SetWriteDeadline(time.Now().Add(timeout)); err != nil {
		return err
	}

	return c.Write(msg)
}

// ReadFrame reads a JREAP message frame from TCP.
// TCP JREAP uses a 4-byte length prefix (network byte order) before each message.
func (c *JREAPTCPConn) ReadFrame() ([]byte, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if c.conn == nil {
		return nil, ErrNotConnected
	}

	// Read 4-byte length prefix
	lenBuf := make([]byte, 4)
	if _, err := io.ReadFull(c.conn, lenBuf); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrReadFailed, err)
	}

	msgLen := binary.BigEndian.Uint32(lenBuf)
	if msgLen > MaxMessageSize+HeaderSize+2 {
		return nil, fmt.Errorf("%w: message too large: %d", ErrReadFailed, msgLen)
	}

	// Read the message
	msg := make([]byte, msgLen)
	if _, err := io.ReadFull(c.conn, msg); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrReadFailed, err)
	}

	return msg, nil
}

// ReadFrameWithTimeout reads with a timeout.
func (c *JREAPTCPConn) ReadFrameWithTimeout(timeout time.Duration) ([]byte, error) {
	c.mu.RLock()
	conn := c.conn
	c.mu.RUnlock()

	if conn == nil {
		return nil, ErrNotConnected
	}

	if err := conn.SetReadDeadline(time.Now().Add(timeout)); err != nil {
		return nil, err
	}

	return c.ReadFrame()
}

// RemoteAddr returns the remote TCP address.
func (c *JREAPTCPConn) RemoteAddr() net.Addr {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if c.conn == nil {
		return nil
	}
	return c.conn.RemoteAddr()
}

// Close closes the TCP connection.
func (c *JREAPTCPConn) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.conn != nil {
		err := c.conn.Close()
		c.conn = nil
		return err
	}
	return nil
}

// Listener is a JREAP-C transport listener that accepts TCP connections.
type Listener struct {
	tcpListener *net.TCPListener
	config      *Config
	mu          sync.Mutex
	done        chan struct{}
}

// NewListener creates a new JREAP listener on the given address.
func NewListener(addr string, protocol Protocol) (*Listener, error) {
	if protocol != ProtocolTCP {
		return nil, fmt.Errorf("unsupported protocol for listener: %s (use tcp)", protocol)
	}

	tcpAddr, err := net.ResolveTCPAddr("tcp", addr)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidAddress, err)
	}

	tcpListener, err := net.ListenTCP("tcp", tcpAddr)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrListenerClosed, err)
	}

	return &Listener{
		tcpListener: tcpListener,
		config:      &Config{LocalAddr: addr, Protocol: protocol},
		done:        make(chan struct{}),
	}, nil
}

// Accept accepts a new TCP connection.
func (l *Listener) Accept() (*JREAPTCPConn, error) {
	select {
	case <-l.done:
		return nil, ErrListenerClosed
	default:
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	if l.tcpListener == nil {
		return nil, ErrListenerClosed
	}

	conn, err := l.tcpListener.Accept()
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrReadFailed, err)
	}

	return &JREAPTCPConn{
		conn:   conn,
		config: l.config,
	}, nil
}

// AcceptWithTimeout accepts with a timeout.
func (l *Listener) AcceptWithTimeout(timeout time.Duration) (*JREAPTCPConn, error) {
	l.mu.Lock()
	if l.tcpListener == nil {
		l.mu.Unlock()
		return nil, ErrListenerClosed
	}
	l.mu.Unlock()

	// Set deadline on TCP listener
	if err := l.tcpListener.SetDeadline(time.Now().Add(timeout)); err != nil {
		return nil, err
	}

	return l.Accept()
}

// Addr returns the listener's address.
func (l *Listener) Addr() net.Addr {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.tcpListener == nil {
		return nil
	}
	return l.tcpListener.Addr()
}

// Close closes the listener.
func (l *Listener) Close() error {
	l.mu.Lock()
	defer l.mu.Unlock()

	select {
	case <-l.done:
		return nil
	default:
		close(l.done)
	}

	if l.tcpListener != nil {
		return l.tcpListener.Close()
	}
	return nil
}

// TransportManager manages multiple JREAP transports.
type TransportManager struct {
	udpConn  *JREAPUDPConn
	listener *Listener
	config   *Config
	mu       sync.RWMutex
}

// NewTransportManager creates a new transport manager.
func NewTransportManager(config *Config) (*TransportManager, error) {
	if config == nil {
		config = DefaultConfig()
	}

	tm := &TransportManager{config: config}

	var err error

	if config.Protocol == ProtocolUDP && config.LocalAddr != "" {
		// Create UDP listener/client
		// Parse buf size from config
		bufSize := config.BufSize
		if bufSize <= 0 {
			bufSize = 8192
		}
		tm.udpConn, err = NewJREAPUDPConn(config.LocalAddr, bufSize)
		if err != nil {
			return nil, err
		}
	} else if config.Protocol == ProtocolTCP && config.LocalAddr != "" {
		// Create TCP listener
		tm.listener, err = NewListener(config.LocalAddr, ProtocolTCP)
		if err != nil {
			return nil, err
		}
	}

	return tm, nil
}

// UDP returns the UDP connection if available.
func (tm *TransportManager) UDP() *JREAPUDPConn {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	return tm.udpConn
}

// Listener returns the TCP listener if available.
func (tm *TransportManager) Listener() *Listener {
	tm.mu.RLock()
	defer tm.mu.RUnlock()
	return tm.listener
}

// Close closes all transports.
func (tm *TransportManager) Close() error {
	tm.mu.Lock()
	defer tm.mu.Unlock()

	var errs []error

	if tm.udpConn != nil {
		if err := tm.udpConn.Close(); err != nil {
			errs = append(errs, err)
		}
	}

	if tm.listener != nil {
		if err := tm.listener.Close(); err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return errs[0]
	}
	return nil
}
