package jseries

import (
	"time"
)

// J5EngagementStatus represents a J5 Engagement Status message (MIL-STD-6016).
// Reports the outcome of an engagement attempt against a track.
type J5EngagementStatus struct {
	EngagementID     uint32    // 32 bits: unique engagement identifier
	TrackNumber      uint16    // 16 bits: track being engaged
	WeaponSystem     uint8     // 8 bits: weapon type (GBI, SM-3, THAAD, PATRIOT, etc.)
	EngagementStage  uint8     // 8 bits: 1=WEAPON_ASSIGNED, 2=WEAPON_LAUNCHED, 3=FLIGHT_TERMINATED, 4=INTERCEPT_SUCCESSFUL, 5=INTERCEPT_FAILED, 6=CANCELLED
	Priority         uint8     // 8 bits: engagement priority 1-5
	TimeOnTarget     time.Time // UTC time of intercept attempt
	TimeLaunched     time.Time // UTC time weapon was launched
	TimeCompleted    time.Time // UTC time engagement completed
	InterceptResult  uint8     // 8 bits: 0=UNKNOWN, 1=INTERCEPT_SUCCESS, 2=INTERCEPT_FAILED, 3=RADAR_MISS, 4=NO_INTERCEPT, 5=ABORT
	HitAssessment    uint8     // 8 bits: bitfield — NEAR_MISS, DIRECT_HIT, FRAGMENTATION, KINETIC
	GroundTrack      string    // engagement location descriptor
	CEPSlot          uint8     // 8 bits: communication slot used
	NetworkID        uint16    // 16 bits: Link 16 network ID
	ParticipantNumber uint16   // 16 bits: shooter platform participant number
}

// J5PayloadSize is the packed size of a J5 Engagement Status message.
const J5PayloadSize = 25

// PackJ5EngagementStatus packs a J5 Engagement Status message.
func PackJ5EngagementStatus(j5 *J5EngagementStatus, buf []byte) {
	off := 0

	PackUint32(j5.EngagementID, buf, off); off += 32
	PackUint16(j5.TrackNumber, buf, off); off += 16
	buf[off/8] = j5.WeaponSystem; off += 8
	buf[off/8] = j5.EngagementStage; off += 8
	buf[off/8] = j5.Priority; off += 8

	tot := PackMilliseconds(j5.TimeOnTarget)
	PackUint32(tot, buf, off); off += 32

	tl := PackMilliseconds(j5.TimeLaunched)
	PackUint32(tl, buf, off); off += 32

	tc := PackMilliseconds(j5.TimeCompleted)
	PackUint32(tc, buf, off); off += 32

	buf[off/8] = j5.InterceptResult; off += 8
	buf[off/8] = j5.HitAssessment; off += 8
	buf[off/8] = j5.CEPSlot; off += 8
	PackUint16(j5.NetworkID, buf, off); off += 16
	PackUint16(j5.ParticipantNumber, buf, off)
}

// UnpackJ5EngagementStatus unpacks a J5 Engagement Status message.
func UnpackJ5EngagementStatus(buf []byte) *J5EngagementStatus {
	if len(buf) < J5PayloadSize {
		return nil
	}
	j5 := &J5EngagementStatus{}
	off := 0

	j5.EngagementID = UnpackUint32(buf, off); off += 32
	j5.TrackNumber = UnpackUint16(buf, off); off += 16
	j5.WeaponSystem = buf[off/8]; off += 8
	j5.EngagementStage = buf[off/8]; off += 8
	j5.Priority = buf[off/8]; off += 8

	tot := UnpackUint32(buf, off); off += 32
	j5.TimeOnTarget = UnpackMilliseconds(tot)

	tl := UnpackUint32(buf, off); off += 32
	j5.TimeLaunched = UnpackMilliseconds(tl)

	tc := UnpackUint32(buf, off); off += 32
	j5.TimeCompleted = UnpackMilliseconds(tc)

	j5.InterceptResult = buf[off/8]; off += 8
	j5.HitAssessment = buf[off/8]; off += 8
	j5.CEPSlot = buf[off/8]; off += 8
	j5.NetworkID = UnpackUint16(buf, off); off += 16
	j5.ParticipantNumber = UnpackUint16(buf, off)

	return j5
}

// J5 Engagement stage constants.
const (
	J5StageWeaponAssigned  = 1
	J5StageWeaponLaunched  = 2
	J5StageFlightTerminated = 3
	J5StageInterceptSuccess = 4
	J5StageInterceptFailed  = 5
	J5StageCancelled        = 6
)

// J5 Intercept result constants.
const (
	J5ResultUnknown         = 0
	J5ResultInterceptSuccess = 1
	J5ResultInterceptFailed = 2
	J5ResultRadarMiss       = 3
	J5ResultNoIntercept     = 4
	J5ResultAbort           = 5
)

// J5 Hit assessment bitfield constants.
const (
	J5HitNearMiss      = 1 << 0
	J5HitDirectHit     = 1 << 1
	J5HitFragmentation = 1 << 2
	J5HitKinetic       = 1 << 3
)
