package jseries

import (
	"time"
)

// J5EngagementStatus represents a J5.0 Engagement Status message.
// Transmitted from shooter platform back to C2BMC to report engagement outcome.
type J5EngagementStatus struct {
	EngagementID      uint32    // 32 bits: unique engagement identifier
	TrackNumber       uint16    // 16 bits: track being engaged
	WeaponSystem      uint8     // 8 bits: weapon type
	EngagementStage   uint8     // 8 bits: engagement stage
	Priority          uint8     // 8 bits: engagement priority 1-5
	TimeOnTarget      time.Time // 40 bits: UTC time of intercept attempt
	TimeLaunched      time.Time // 40 bits: UTC time weapon was launched
	TimeCompleted     time.Time // 40 bits: UTC time engagement completed
	InterceptResult   uint8     // 8 bits: outcome code
	HitAssessment     uint8     // 8 bits: hit assessment bits
	GroundTrack       uint8     // 8 bits: engagement location slot
	CEPSlot           uint8     // 8 bits: CEP slot used
	NetworkID         uint16    // 16 bits: Link 16 network ID
	ParticipantNumber uint16    // 16 bits: shooter platform participant number
}

// J5PayloadSize is the packed size of a J5 Engagement Status message.
const J5PayloadSize = 32 // 256 bits

// PackJ5EngagementStatus packs a J5 Engagement Status message into buf (32 bytes).
// Bit layout:
//
//	0-31:   Engagement ID (uint32)
//
// 32-47:   Track number (uint16)
// 48-55:   Weapon system (uint8)
// 56-63:   Engagement stage (uint8)
// 64-71:   Priority (uint8)
// 72-111:  Time on target (40-bit milliseconds)
// 112-151: Time launched (40-bit milliseconds)
// 152-191: Time completed (40-bit milliseconds)
// 192-199: Intercept result (uint8)
// 200-207: Hit assessment (uint8)
// 208-215: Ground track (uint8)
// 216-223: CEP slot (uint8)
// 224-239: Network ID (uint16)
// 240-255: Participant number (uint16)
func PackJ5EngagementStatus(j5 *J5EngagementStatus, buf []byte) {
	off := 0

	PackUint32(j5.EngagementID, buf, off)
	off += 4

	PackUint16(j5.TrackNumber, buf, off)
	off += 2

	buf[off] = j5.WeaponSystem
	off++
	buf[off] = j5.EngagementStage
	off++
	buf[off] = j5.Priority
	off++

	tot := PackMilliseconds(j5.TimeOnTarget)
	PackUint40(uint64(tot), buf, off)
	off += 5

	tl := PackMilliseconds(j5.TimeLaunched)
	PackUint40(uint64(tl), buf, off)
	off += 5

	tc := PackMilliseconds(j5.TimeCompleted)
	PackUint40(uint64(tc), buf, off)
	off += 5

	buf[off] = j5.InterceptResult
	off++
	buf[off] = j5.HitAssessment
	off++
	buf[off] = j5.GroundTrack
	off++
	buf[off] = j5.CEPSlot
	off++

	PackUint16(j5.NetworkID, buf, off)
	off += 2

	PackUint16(j5.ParticipantNumber, buf, off)
}

// UnpackJ5EngagementStatus unpacks a J5 Engagement Status message from buf (32 bytes).
func UnpackJ5EngagementStatus(buf []byte) *J5EngagementStatus {
	if len(buf) < J5PayloadSize {
		return nil
	}
	off := 0

	j5 := &J5EngagementStatus{}

	j5.EngagementID = UnpackUint32(buf, off)
	off += 4

	j5.TrackNumber = UnpackUint16(buf, off)
	off += 2

	j5.WeaponSystem = buf[off]
	off++
	j5.EngagementStage = buf[off]
	off++
	j5.Priority = buf[off]
	off++

	tot := UnpackUint40(buf, off)
	j5.TimeOnTarget = UnpackMilliseconds(uint32(tot))
	off += 5

	tl := UnpackUint40(buf, off)
	j5.TimeLaunched = UnpackMilliseconds(uint32(tl))
	off += 5

	tc := UnpackUint40(buf, off)
	j5.TimeCompleted = UnpackMilliseconds(uint32(tc))
	off += 5

	j5.InterceptResult = buf[off]
	off++
	j5.HitAssessment = buf[off]
	off++
	j5.GroundTrack = buf[off]
	off++
	j5.CEPSlot = buf[off]
	off++

	j5.NetworkID = UnpackUint16(buf, off)
	off += 2

	j5.ParticipantNumber = UnpackUint16(buf, off)

	return j5
}

// J5 Stage constants.
const (
	J5StageWeaponAssigned   = 1
	J5StageWeaponLaunched   = 2
	J5StageFlightTerminated = 3
	J5StageInterceptSuccess = 4
	J5StageInterceptFailed  = 5
	J5StageCancelled        = 6
)

// J5 Intercept result constants.
const (
	J5ResultUnknown          = 0
	J5ResultInterceptSuccess = 1
	J5ResultInterceptFailed  = 2
	J5ResultRadarMiss        = 3
	J5ResultNoIntercept      = 4
	J5ResultAbort            = 5
)

// J5 Hit assessment bitfield constants.
const (
	J5HitNearMiss      = 1 << 0
	J5HitDirectHit     = 1 << 1
	J5HitFragmentation = 1 << 2
	J5HitKinetic       = 1 << 3
)
