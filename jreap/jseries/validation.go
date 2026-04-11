package jseries

import (
	"errors"
	"time"
)

// Validation errors
var (
	ErrLatitudeRange = errors.New("latitude out of range: -90 to 90")
	ErrLongitudeRange = errors.New("longitude out of range: -180 to 180")
	ErrAltitudeRange = errors.New("altitude out of range")
	ErrSpeedRange = errors.New("speed out of valid range")
	ErrHeadingRange = errors.New("heading out of range: 0-360")
	ErrDepthRange = errors.New("depth must be negative (below surface)")
	ErrTimeSkew = errors.New("timestamp too far from current time")
	ErrTrackNumber = errors.New("invalid track number")
)

// ValidateLatitude checks if latitude is in valid range
func ValidateLatitude(lat float64) error {
	if lat < -90.0 || lat > 90.0 {
		return ErrLatitudeRange
	}
	return nil
}

// ValidateLongitude checks if longitude is in valid range
func ValidateLongitude(lon float64) error {
	if lon < -180.0 || lon > 180.0 {
		return ErrLongitudeRange
	}
	return nil
}

// TrackDomain defines the operational domain
type TrackDomain uint8

const (
	DomainAir TrackDomain = 0
	DomainSurface TrackDomain = 1
	DomainSubsurface TrackDomain = 2
	DomainLand TrackDomain = 3
	DomainSpace TrackDomain = 4
)

// ValidateAltitude checks altitude based on domain
func ValidateAltitude(alt float64, domain TrackDomain) error {
	switch domain {
	case DomainAir:
		if alt < 0 || alt > 30000 {
			return ErrAltitudeRange
		}
	case DomainSurface:
		if alt < -10 || alt > 100 {
			return ErrAltitudeRange
		}
	case DomainSubsurface:
		if alt > 0 {
			return ErrDepthRange
		}
		if alt < -12000 {
			return ErrAltitudeRange
		}
	case DomainLand:
		if alt < -500 || alt > 10000 {
			return ErrAltitudeRange
		}
	}
	return nil
}

// ValidateHeading checks if heading is valid
func ValidateHeading(hdg float64) error {
	if hdg < 0 || hdg > 360 {
		return ErrHeadingRange
	}
	return nil
}

// ValidateSpeed checks if speed is valid for domain
func ValidateSpeed(speed float64, domain TrackDomain) error {
	if speed < 0 {
		return ErrSpeedRange
	}
	switch domain {
	case DomainAir:
		if speed > 3000 {
			return ErrSpeedRange
		}
	case DomainSurface:
		if speed > 100 {
			return ErrSpeedRange
		}
	case DomainSubsurface:
		if speed > 50 {
			return ErrSpeedRange
		}
	case DomainLand:
		if speed > 150 {
			return ErrSpeedRange
		}
	}
	return nil
}

// ValidateTimestamp checks for clock skew
func ValidateTimestamp(ts time.Time, maxSkew time.Duration) error {
	now := time.Now()
	diff := now.Sub(ts)
	if diff < 0 {
		diff = -diff
	}
	if diff > maxSkew {
		return ErrTimeSkew
	}
	return nil
}

// ValidateTrackNumber validates track number range
func ValidateTrackNumber(tn uint16) error {
	if tn == 0 || tn > 0xFFFB {
		return ErrTrackNumber
	}
	return nil
}

// DropReason describes why a track was dropped
type DropReason uint8

const (
	DropManual DropReason = iota
	DropTimeout
	DropOutOfBounds
	DropCollision
	DropDuplicate
	DropSensorLoss
)

// LeaveReason describes why a participant left
type LeaveReason uint8

const (
	LeaveNormal LeaveReason = iota
	LeaveTimeout
	LeaveKicked
	LeaveNetworkError
)

// J8Fragment holds a fragment of a J8 message
type J8Fragment struct {
	FragmentIndex uint8
	TotalFragments uint8
	Data []byte
	SessionID uint16
}

// J8Reassembler reassembles fragmented J8 radio messages
type J8Reassembler struct {
	fragments map[uint16]map[uint8]*J8Fragment
}

// NewJ8Reassembler creates a new J8 reassembler
func NewJ8Reassembler() *J8Reassembler {
	return &J8Reassembler{
		fragments: make(map[uint16]map[uint8]*J8Fragment),
	}
}

// AddFragment adds a fragment and returns complete message if all received
func (r *J8Reassembler) AddFragment(frag *J8Fragment) ([]byte, bool) {
	if r.fragments[frag.SessionID] == nil {
		r.fragments[frag.SessionID] = make(map[uint8]*J8Fragment)
	}

	r.fragments[frag.SessionID][frag.FragmentIndex] = frag

	if uint8(len(r.fragments[frag.SessionID])) == frag.TotalFragments {
		result := make([]byte, 0, int(frag.TotalFragments)*256)
		for i := uint8(0); i < frag.TotalFragments; i++ {
			if f, ok := r.fragments[frag.SessionID][i]; ok {
				result = append(result, f.Data...)
			} else {
				return nil, false
			}
		}
		delete(r.fragments, frag.SessionID)
		return result, true
	}
	return nil, false
}

// J31Chunk holds a chunk for file transfer reassembly
type J31Chunk struct {
	TransferID uint16
	ChunkIndex uint16
	TotalChunks uint16
	Data []byte
}

// J31Reassembler reassembles J31 file transfers
type J31Reassembler struct {
	chunks map[uint16]map[uint16]*J31Chunk
}

// NewJ31Reassembler creates a new J31 reassembler
func NewJ31Reassembler() *J31Reassembler {
	return &J31Reassembler{
		chunks: make(map[uint16]map[uint16]*J31Chunk),
	}
}

// AddChunk adds a chunk and returns true if complete
func (r *J31Reassembler) AddChunk(chunk *J31Chunk) (bool, error) {
	if r.chunks[chunk.TransferID] == nil {
		r.chunks[chunk.TransferID] = make(map[uint16]*J31Chunk)
	}

	r.chunks[chunk.TransferID][chunk.ChunkIndex] = chunk

	if uint16(len(r.chunks[chunk.TransferID])) == chunk.TotalChunks {
		delete(r.chunks, chunk.TransferID)
		return true, nil
	}
	return false, nil
}

// GetChunks returns all chunks for a transfer
func (r *J31Reassembler) GetChunks(transferID uint16) []*J31Chunk {
	var result []*J31Chunk
	if chunks, ok := r.chunks[transferID]; ok {
		for _, c := range chunks {
			result = append(result, c)
		}
	}
	return result
}
