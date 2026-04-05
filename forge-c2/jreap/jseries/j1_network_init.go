package jseries

import (
	"time"
)

// Network status constants
const (
	NetworkStatusActive   uint8 = 1
	NetworkStatusStandby uint8 = 2
	NetworkStatusOffline uint8 = 3
)

// Network message types
const (
	J1NetworkInitialize  uint8 = 0 // Network initialization
	J1NetworkJoin       uint8 = 1 // Participant joining
	J1NetworkLeave      uint8 = 2 // Participant leaving
	J1NetworkHeartbeat  uint8 = 3 // Keep-alive
	J1NetworkReinitialize uint8 = 4 // Reinitialize
)

// Participant status on the network
const (
	ParticipantActive   uint8 = 1
	ParticipantStandby uint8 = 2
	ParticipantOffline uint8 = 3
)

// J1NetworkInit represents a J1 Network Initialization message (MIL-STD-6016).
// Used to manage participation in the Link 16 network — join, leave, heartbeat,
// and initialization of network members.
type J1NetworkInit struct {
	NetworkID         uint16    // 16 bits: Link 16 network ID
	MessageType       uint8     // 8 bits: J1 subtype (join/leave/heartbeat/init)
	NetworkStatus     uint8     // 8 bits: overall network status
	ParticipantCount  uint8     // 8 bits: number of active participants
	NodeID           uint16    // 16 bits: this node's ID
	ParticipantNumber uint16    // 16 bits: this participant's number
	Latitude         float64   // degrees
	Longitude        float64   // degrees
	Altitude         float64   // meters
	Time             time.Time // timestamp
	CapabilityFlags   uint32    // 32 bits: capability bits
	SoftwareVersion   string    // software version string
}

// J1PayloadSize is the packed byte size of a J1 Network Init message.
const J1PayloadSize = 40

// PackJ1NetworkInit packs a J1 Network Init message into buf.
func PackJ1NetworkInit(j1 *J1NetworkInit, buf []byte) {
	off := 0

	// Network ID: 16 bits
	PackUint16(j1.NetworkID, buf, off); off += 2

	// Message type + network status: 8 bits each
	buf[off] = j1.MessageType; off++
	buf[off] = j1.NetworkStatus; off++

	// Participant count + spare: 8 bits each
	buf[off] = j1.ParticipantCount; off++
	buf[off] = 0; off++ // spare

	// Node ID: 16 bits
	PackUint16(j1.NodeID, buf, off); off += 2

	// Participant number: 16 bits
	PackUint16(j1.ParticipantNumber, buf, off); off += 2

	// Latitude: 24-bit NIPO
	latP := PackLatitude(j1.Latitude)
	PackUint24(latP, buf, off); off += 3

	// Longitude: 24-bit NIPO
	lonP := PackLongitude(j1.Longitude)
	PackUint24(lonP, buf, off); off += 3

	// Altitude: 24 bits meters
	altP := uint32(j1.Altitude)
	PackUint24(altP, buf, off); off += 3

	// Timestamp: 32 bits ms
	ms := PackMilliseconds(j1.Time)
	PackUint32(ms, buf, off); off += 4

	// Capability flags: 32 bits
	PackUint32(j1.CapabilityFlags, buf, off); off += 4

	// Software version: 8 bytes, null-padded
	for i := 0; i < 8; i++ {
		if i < len(j1.SoftwareVersion) {
			buf[off+i] = j1.SoftwareVersion[i]
		} else {
			buf[off+i] = 0
		}
	}
}

// UnpackJ1NetworkInit unpacks a J1 Network Init message from buf.
func UnpackJ1NetworkInit(buf []byte) *J1NetworkInit {
	if len(buf) < J1PayloadSize {
		return nil
	}
	j1 := &J1NetworkInit{}
	off := 0

	j1.NetworkID = UnpackUint16(buf, off); off += 2

	j1.MessageType = buf[off]; off++
	j1.NetworkStatus = buf[off]; off++
	j1.ParticipantCount = buf[off]; off++
	off++ // spare

	j1.NodeID = UnpackUint16(buf, off); off += 2
	j1.ParticipantNumber = UnpackUint16(buf, off); off += 2

	latP := UnpackUint24(buf, off); off += 3
	j1.Latitude = UnpackLatitude(latP)

	lonP := UnpackUint24(buf, off); off += 3
	j1.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off); off += 3
	j1.Altitude = float64(altP)

	ms := UnpackUint32(buf, off); off += 4
	j1.Time = UnpackMilliseconds(ms)

	j1.CapabilityFlags = UnpackUint32(buf, off); off += 4

	ver := make([]byte, 0, 8)
	for i := 0; i < 8; i++ {
		if buf[off+i] != 0 {
			ver = append(ver, buf[off+i])
		}
	}
	j1.SoftwareVersion = string(ver)

	return j1
}
