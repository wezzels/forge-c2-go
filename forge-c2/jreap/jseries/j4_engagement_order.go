package jseries

import (
	"time"
)

// J4EngagementOrder represents a J4.0 Engagement Order message.
// This is transmitted from C2BMC to weapon systems to initiate engagements.
type J4EngagementOrder struct {
	EngagementID  uint32        // 32 bits: unique engagement ID
	TrackNumber   uint16        // 16 bits: track being engaged
	Priority      uint8         // 8 bits: 1=highest
	WeaponSystem  J4WeaponSystem // 8 bits
	TimeOnTarget  time.Time     // 40 bits: milliseconds since epoch
	InterceptProb float64       // 0-1 intercept probability (packed as uint16 * 10000)
	TrackStatus   TrackStatus   // 8 bits
}

// TrackStatus represents the status of a track in the BMD system.
type TrackStatus uint8

const (
	TrackStatus_New     TrackStatus = 1
	TrackStatus_Active  TrackStatus = 2
	TrackStatus_Updated TrackStatus = 3
	TrackStatus_Dropped TrackStatus = 4
)

// J4WeaponSystem is the weapon system selected for the engagement.
type J4WeaponSystem uint8

const (
	J4WeaponSystem_GMD     J4WeaponSystem = 1 // Ground-based Midcourse Defense
	J4WeaponSystem_Aegis   J4WeaponSystem = 2 // Aegis Ballistic Missile Defense
	J4WeaponSystem_THAAD   J4WeaponSystem = 3 // Terminal High Altitude Area Defense
	J4WeaponSystem_Patriot  J4WeaponSystem = 4 // Patriot Defense System
)

// J4PayloadSize is the packed byte size of a J4 Engagement Order message.
const J4PayloadSize = 17 // ceil(136 bits / 8)

// PackJ4EngagementOrder packs a J4 Engagement Order message into buf (17 bytes).
// Bit layout:
//  0-31:   Engagement ID (uint32)
// 32-47:   Track number (uint16)
// 48-55:   Priority (uint8)
// 56-63:   Weapon system (uint8)
// 64-103:  Time on target (40-bit milliseconds since epoch)
// 104-111: Track status (uint8)
// 112-127: Intercept probability (uint16 scaled by 10000, 0-9999)
func PackJ4EngagementOrder(o *J4EngagementOrder, buf []byte) {
	off := 0

	// Engagement ID (bytes 0-3)
	PackUint32(o.EngagementID, buf, off)
	off += 4

	// Track number (bytes 4-5)
	PackUint16(o.TrackNumber, buf, off)
	off += 2

	// Priority (byte 6)
	buf[off] = o.Priority
	off++

	// Weapon system (byte 7)
	buf[off] = uint8(o.WeaponSystem)
	off++

	// Time on target - 40-bit milliseconds (bytes 8-12)
	ms := uint64(o.TimeOnTarget.UnixMilli())
	buf[off] = byte(ms >> 32)
	off++
	buf[off] = byte(ms >> 24)
	off++
	buf[off] = byte(ms >> 16)
	off++
	buf[off] = byte(ms >> 8)
	off++
	buf[off] = byte(ms)
	off++

	// Track status (byte 13)
	buf[off] = uint8(o.TrackStatus)
	off++

	// Intercept probability: scaled uint16 (value = prob * 10000)
	probScaled := uint16(o.InterceptProb * 10000)
	PackUint16(probScaled, buf, off)
}

// UnpackJ4EngagementOrder unpacks a J4 Engagement Order from buf (17 bytes).
func UnpackJ4EngagementOrder(buf []byte) *J4EngagementOrder {
	if len(buf) < J4PayloadSize {
		return nil
	}
	off := 0

	engID := UnpackUint32(buf, off)
	off += 4

	trackNum := UnpackUint16(buf, off)
	off += 2

	priority := buf[off]
	off++

	weapon := J4WeaponSystem(buf[off])
	off++

	ms := uint64(buf[off])<<32 | uint64(buf[off+1])<<24 |
		uint64(buf[off+2])<<16 | uint64(buf[off+3])<<8 | uint64(buf[off+4])
	off += 5

	tot := time.UnixMilli(int64(ms))

	status := TrackStatus(buf[off])
	off++

	probScaled := UnpackUint16(buf, off)
	prob := float64(probScaled) / 10000.0

	return &J4EngagementOrder{
		EngagementID:  engID,
		TrackNumber:  trackNum,
		Priority:    priority,
		WeaponSystem: weapon,
		TimeOnTarget: tot,
		TrackStatus: status,
		InterceptProb: prob,
	}
}
