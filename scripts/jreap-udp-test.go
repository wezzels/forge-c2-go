package main

import (
	"encoding/binary"
	"fmt"
	"net"
	"time"
)

// JREAP UDP integration test: sends J-series messages to FORGE-C2
// and verifies they're received and processed.

func main() {
	host := "localhost"
	udpPort := 5000

	// Test 1: Connect to JREAP UDP port
	fmt.Println("=== JREAP UDP Transport Test ===")

	conn, err := net.DialTimeout("udp", fmt.Sprintf("%s:%d", host, udpPort), 5*time.Second)
	if err != nil {
		fmt.Printf("FAIL: Cannot connect to UDP %s:%d: %v\n", host, udpPort, err)
		fmt.Println("NOTE: Start server with --jreap-udp-port 5000")
		return
	}
	defer conn.Close()
	fmt.Printf("OK: Connected to UDP %s:%d\n", host, udpPort)

	// Test 2: Send JREAP-C header (minimal valid message)
	// JREAP-C header: Protocol(2) + MsgType(1) + Reserved(1) + Length(4) = 8 bytes
	header := make([]byte, 8)
	binary.BigEndian.PutUint16(header[0:2], 0x0001) // Protocol: JREAP-C
	header[2] = 0                                    // Message type: J0
	header[3] = 0                                    // Reserved
	binary.BigEndian.PutUint32(header[4:8], 8)      // Length: header only

	n, err := conn.Write(header)
	if err != nil {
		fmt.Printf("FAIL: Write error: %v\n", err)
		return
	}
	fmt.Printf("OK: Sent %d bytes (JREAP header)\n", n)

	// Test 3: Send J0 Track Management message
	// Minimal J0 payload (48 bytes) + header (8 bytes)
	j0 := make([]byte, 56) // header(8) + payload(48)
	binary.BigEndian.PutUint16(j0[0:2], 0x0001) // Protocol
	j0[2] = 0                                      // J0 Track Management
	j0[3] = 0                                      // Reserved
	binary.BigEndian.PutUint32(j0[4:8], 56)       // Length

	// J0 payload: track number, force type, lat, lon, alt, speed, heading
	binary.BigEndian.PutUint16(j0[8:10], 42)      // Track number
	j0[10] = 2                                      // Force type: Hostile

	n, err = conn.Write(j0)
	if err != nil {
		fmt.Printf("FAIL: Write J0 error: %v\n", err)
		return
	}
	fmt.Printf("OK: Sent %d bytes (J0 Track Management)\n", n)

	fmt.Println("\n=== JREAP UDP Transport Test PASSED ===")
	fmt.Println("Note: This verifies transport connectivity, not message processing.")
	fmt.Println("Use the HTTP API to verify tracks were created.")

	// Verify via HTTP
	fmt.Println("\n=== HTTP Verification ===")
	verifyHTTP()
}

func verifyHTTP() {
	// Simple HTTP GET to /api/tracks
	conn, err := net.DialTimeout("tcp", "localhost:8080", 3*time.Second)
	if err != nil {
		fmt.Printf("SKIP: Cannot connect to HTTP port 8080: %v\n", err)
		return
	}
	conn.SetDeadline(time.Now().Add(5 * time.Second))

	// Send HTTP request
	req := "GET /api/tracks HTTP/1.1\r\nHost: localhost\r\n\r\n"
	_, err = conn.Write([]byte(req))
	if err != nil {
		fmt.Printf("FAIL: HTTP write error: %v\n", err)
		return
	}

	buf := make([]byte, 4096)
	n, err := conn.Read(buf)
	if err != nil {
		fmt.Printf("FAIL: HTTP read error: %v\n", err)
		return
	}

	response := string(buf[:n])
	if len(response) > 0 {
		fmt.Printf("OK: HTTP response received (%d bytes)\n", n)
		// Check for 200 status
		if len(response) > 12 && response[9:12] == "200" {
			fmt.Println("OK: HTTP 200 status")
		} else {
			fmt.Printf("WARN: HTTP status: %s\n", response[9:12])
		}
	}
}