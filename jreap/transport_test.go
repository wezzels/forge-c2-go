package jreap

import (
	"net"
	"testing"
	"time"
)

func TestMulticastReceiver(t *testing.T) {
	config := MulticastConfig{
		GroupAddress: "239.1.2.3",
		Port:         5000,
	}

	recv, err := NewMulticastReceiver(config)
	if err != nil {
		t.Fatalf("NewMulticastReceiver failed: %v", err)
	}
	defer recv.Close()

	buf := make([]byte, 1024)
	recv.conn.SetReadDeadline(time.Now().Add(100 * time.Millisecond))

	_, _, err = recv.Receive(buf)
	if err == nil {
		t.Log("Receive returned (expected timeout)")
	} else if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
		t.Log("Receive timed out (expected - no sender)")
	} else {
		t.Logf("Receive error: %v", err)
	}
}

func TestMulticastSender(t *testing.T) {
	config := MulticastSenderConfig{
		GroupAddress: "239.1.2.3",
		Port:         5000,
	}

	sender, err := NewMulticastSender(config)
	if err != nil {
		t.Fatalf("NewMulticastSender failed: %v", err)
	}
	defer sender.Close()

	n, err := sender.Send([]byte("test"))
	if n > 0 || err != nil {
		t.Logf("Send: %d bytes, err=%v", n, err)
	}
}
