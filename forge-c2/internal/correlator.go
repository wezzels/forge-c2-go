package internal

import (
	"fmt"
	"math"
	"sort"
	"sync"
	"time"
)

// TrackCorrelator implements the VIMI track correlation algorithm
// Takes raw sensor events and correlates them into tracks using
// a nearest-neighbor association algorithm with multi-hypothesis tracking
type TrackCorrelator struct {
	mu           sync.RWMutex
	tracks       map[string]*Track
	nextTrackNum uint16

	// Correlation parameters
	GateDistance   float64 // km - association gate radius
	MaxTrackAge   time.Duration
	MinConfidence float64
	MaxSpeed      float64 // m/s - max realistic target speed

	// Associations store sensor event IDs per track
	associations map[string][]string
}

// NewTrackCorrelator creates a new VIMI correlator
func NewTrackCorrelator() *TrackCorrelator {
	return &TrackCorrelator{
		tracks:        make(map[string]*Track),
		nextTrackNum:  1,
		GateDistance:  50.0,  // 50km association gate
		MaxTrackAge:   30 * time.Second,
		MinConfidence: 0.3,
		MaxSpeed:      15000, // ~Mach 44 for hypersonics
		associations: make(map[string][]string),
	}
}

// ProcessEvent takes a raw sensor event and either associates it with
// an existing track or creates a new track
func (tc *TrackCorrelator) ProcessEvent(event *SensorEvent) (*Track, bool) {
	tc.mu.Lock()
	defer tc.mu.Unlock()

	// Check for association with existing tracks
	var bestMatch *Track
	bestDistance := math.MaxFloat64

	for _, track := range tc.tracks {
		// Calculate distance to predicted position
		dist := tc.haversineDistance(
			track.Latitude, track.Longitude,
			event.Latitude, event.Longitude,
		)

		// Check if within association gate
		if dist < tc.GateDistance && dist < bestDistance {
			// Check velocity feasibility
			if tc.isVelocityFeasible(track, event) {
				bestMatch = track
				bestDistance = dist
			}
		}
	}

	if bestMatch != nil {
		// Update existing track
		tc.updateTrack(bestMatch, event)
		tc.associations[bestMatch.TrackID] = append(
			tc.associations[bestMatch.TrackID], event.EventID,
		)
		return bestMatch, false
	}

	// Create new track
	track := tc.createTrack(event)
	tc.tracks[track.TrackID] = track
	tc.associations[track.TrackID] = []string{event.EventID}
	return track, true
}

// updateTrack updates an existing track with new sensor data
func (tc *TrackCorrelator) updateTrack(track *Track, event *SensorEvent) {
	// Simple Kalman-like update for position
	alpha := 0.3 // smoothing factor

	oldLat := track.Latitude
	oldLon := track.Longitude

	track.Latitude = track.Latitude + alpha*(event.Latitude-track.Latitude)
	track.Longitude = track.Longitude + alpha*(event.Longitude-track.Longitude)
	track.Altitude = track.Altitude + alpha*(event.Altitude-track.Altitude)

	// Update velocity
	if len(track.Trajectory) > 0 {
		last := track.Trajectory[len(track.Trajectory)-1]
		dt := event.Timestamp.Sub(last.Timestamp).Seconds()
		if dt > 0 {
			dlat := (track.Latitude - last.Lat) * 111000 // rough meters
			dlon := (track.Longitude - last.Lon) * 111000 * math.Cos(last.Lat*math.Pi/180)
			dalt := track.Altitude - last.Alt
			track.Speed = math.Sqrt(dlat*dlat+dlon*dlon+dalt*dalt) / dt
		}
	}

	// Update heading
	if len(track.Trajectory) > 0 {
		last := track.Trajectory[len(track.Trajectory)-1]
		dt := event.Timestamp.Sub(last.Timestamp).Seconds()
		if dt > 0 {
			dlat := (track.Latitude - last.Lat) * 111000
			dlon := (track.Longitude - last.Lon) * 111000 * math.Cos(last.Lat*math.Pi/180)
			track.Heading = math.Atan2(dlon, dlat) * 180 / math.Pi
			if track.Heading < 0 {
				track.Heading += 360
			}
		}
	}

	// Add to trajectory
	track.Trajectory = append(track.Trajectory, Position{
		Timestamp: event.Timestamp,
		Lat:       track.Latitude,
		Lon:       track.Longitude,
		Alt:       track.Altitude,
	})

	// Keep trajectory limited to last 20 points
	if len(track.Trajectory) > 20 {
		track.Trajectory = track.Trajectory[len(track.Trajectory)-20:]
	}

	track.LastUpdate = event.Timestamp
	track.Status = "UPDATED"

	// Update threat level based on speed and altitude
	track.ThreatLevel = tc.calculateThreatLevel(track)

	// Mark old tracks as stale
	_ = oldLat // suppress unused warning
	_ = oldLon
}

// createTrack creates a new track from a sensor event
func (tc *TrackCorrelator) createTrack(event *SensorEvent) *Track {
	trackNum := tc.nextTrackNum
	tc.nextTrackNum++

	track := &Track{
		TrackID:      fmt.Sprintf("TRK-%04d", trackNum),
		TrackNumber:  trackNum,
		Status:       "NEW",
		Latitude:     event.Latitude,
		Longitude:    event.Longitude,
		Altitude:     event.Altitude,
		Speed:        0,
		Heading:      0,
		ThreatLevel:  tc.calculateThreatLevelFromEvent(event),
		TrackSource:  event.SensorType,
		PlatformType: tc.inferPlatformType(event),
		ForceType:    "UNKNOWN",
		LastUpdate:   event.Timestamp,
		Associations: []string{},
		Trajectory: []Position{
			{
				Timestamp: event.Timestamp,
				Lat:       event.Latitude,
				Lon:       event.Longitude,
				Alt:       event.Altitude,
			},
		},
	}

	return track
}

// calculateThreatLevel estimates threat level from track characteristics
func (tc *TrackCorrelator) calculateThreatLevel(track *Track) int {
	// Simple heuristic
	threat := 1

	// Speed factor (faster = higher threat)
	if track.Speed > 1000 { // > 1 km/s = hypersonic
		threat = 5
	} else if track.Speed > 500 {
		threat = 4
	} else if track.Speed > 200 {
		threat = 3
	}

	// Altitude factor (lower = potentially more dangerous)
	if track.Altitude < 50000 && track.Altitude > 10000 {
		threat = int(math.Min(float64(threat+1), 5))
	}

	return threat
}

// calculateThreatLevelFromEvent estimates threat from single sensor event
func (tc *TrackCorrelator) calculateThreatLevelFromEvent(event *SensorEvent) int {
	threat := 1

	// Signal intensity
	if event.Intensity > 80 {
		threat = 4
	} else if event.Intensity > 60 {
		threat = 3
	}

	// SNR
	if event.SNR > 20 {
		threat = int(math.Min(float64(threat+1), 5))
	}

	// Confidence
	if event.Confidence > 0.9 {
		threat = int(math.Min(float64(threat+1), 5))
	}

	return threat
}

// inferPlatformType guesses platform type from sensor data
func (tc *TrackCorrelator) inferPlatformType(event *SensorEvent) string {
	switch event.SensorType {
	case "OPIR":
		return "BALLISTIC_MISSILE" // Default for space-based IR
	case "RADAR":
		return "AIR_TRACK"
	case "SEISMIC":
		return "GROUND_VEHICLE"
	case "ACOUSTIC":
		return "AIRCRAFT"
	default:
		return "UNKNOWN"
	}
}

// isVelocityFeasible checks if the update respects max speed
func (tc *TrackCorrelator) isVelocityFeasible(track *Track, event *SensorEvent) bool {
	if len(track.Trajectory) == 0 {
		return true
	}

	last := track.Trajectory[len(track.Trajectory)-1]
	dt := event.Timestamp.Sub(last.Timestamp).Seconds()

	if dt <= 0 {
		return false
	}

	// Calculate distance
	dist := tc.haversineDistance(
		last.Lat, last.Lon,
		event.Latitude, event.Longitude,
	) * 1000 // km to m

	speed := dist / dt

	return speed <= tc.MaxSpeed
}

// haversineDistance calculates distance between two points in km
func (tc *TrackCorrelator) haversineDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Earth radius in km

	dLat := (lat2 - lat1) * math.Pi / 180
	dLon := (lon2 - lon1) * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}

// GetTracks returns all current tracks
func (tc *TrackCorrelator) GetTracks() []*Track {
	tc.mu.RLock()
	defer tc.mu.RUnlock()

	tracks := make([]*Track, 0, len(tc.tracks))
	for _, t := range tc.tracks {
		tracks = append(tracks, t)
	}

	// Sort by threat level descending
	sort.Slice(tracks, func(i, j int) bool {
		return tracks[i].ThreatLevel > tracks[j].ThreatLevel
	})

	return tracks
}

// GetTrack returns a specific track
func (tc *TrackCorrelator) GetTrack(id string) *Track {
	tc.mu.RLock()
	defer tc.mu.RUnlock()
	return tc.tracks[id]
}

// DropStaleTracks removes tracks that haven't been updated
func (tc *TrackCorrelator) DropStaleTracks() []string {
	tc.mu.Lock()
	defer tc.mu.Unlock()

	now := time.Now()
	dropped := []string{}

	for id, track := range tc.tracks {
		if now.Sub(track.LastUpdate) > tc.MaxTrackAge {
			track.Status = "DROPPED"
			dropped = append(dropped, id)
			delete(tc.tracks, id)
			delete(tc.associations, id)
		}
	}

	return dropped
}

// GetStats returns correlator statistics
func (tc *TrackCorrelator) GetStats() map[string]interface{} {
	tc.mu.RLock()
	defer tc.mu.RUnlock()

	return map[string]interface{}{
		"active_tracks":    len(tc.tracks),
		"next_track_num":   tc.nextTrackNum,
		"gate_distance_km": tc.GateDistance,
		"max_track_age":    tc.MaxTrackAge.String(),
	}
}
