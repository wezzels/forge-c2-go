package main

import (
	"fmt"
	"math"
	"sort"
	"sync"
	"time"
)

// TrackCorrelator implements VIMI track correlation
type TrackCorrelator struct {
	mu           sync.RWMutex
	tracks       map[string]*Track
	nextTrackNum uint16
	GateDistance float64
	MaxTrackAge  time.Duration
	MaxSpeed     float64
}

type Track struct {
	TrackID      string     `json:"track_id"`
	TrackNumber  uint16     `json:"track_number"`
	Status       string     `json:"status"`
	Latitude     float64   `json:"latitude"`
	Longitude    float64    `json:"longitude"`
	Altitude     float64    `json:"altitude"`
	Speed        float64    `json:"speed"`
	Heading      float64    `json:"heading"`
	ThreatLevel  int        `json:"threat_level"`
	TrackSource  string     `json:"track_source"`
	PlatformType string     `json:"platform_type"`
	ForceType    string     `json:"force_type"`
	LastUpdate   time.Time  `json:"last_update"`
	Trajectory   []Position `json:"trajectory"`
}

type Position struct {
	Timestamp time.Time `json:"timestamp"`
	Lat      float64   `json:"lat"`
	Lon      float64   `json:"lon"`
	Alt      float64   `json:"alt"`
}

func NewTrackCorrelator() *TrackCorrelator {
	return &TrackCorrelator{
		tracks:       make(map[string]*Track),
		nextTrackNum: 1,
		GateDistance:  50.0,
		MaxTrackAge:  30 * time.Second,
		MaxSpeed:     15000,
	}
}

func (tc *TrackCorrelator) ProcessEvent(event *SensorEvent) (*Track, bool) {
	tc.mu.Lock()
	defer tc.mu.Unlock()

	var bestMatch *Track
	bestDist := math.MaxFloat64

	for _, track := range tc.tracks {
		dist := tc.haversine(track.Latitude, track.Longitude, event.Latitude, event.Longitude)
		if dist < tc.GateDistance && dist < bestDist && tc.isVelocityFeasible(track, event) {
			bestMatch = track
			bestDist = dist
		}
	}

	if bestMatch != nil {
		tc.updateTrack(bestMatch, event)
		return bestMatch, false
	}

	track := tc.createTrack(event)
	tc.tracks[track.TrackID] = track
	return track, true
}

func (tc *TrackCorrelator) updateTrack(track *Track, event *SensorEvent) {
	alpha := 0.3
	track.Latitude = track.Latitude + alpha*(event.Latitude-track.Latitude)
	track.Longitude = track.Longitude + alpha*(event.Longitude-track.Longitude)
	track.Altitude = track.Altitude + alpha*(event.Altitude-track.Altitude)

	if len(track.Trajectory) > 0 {
		last := track.Trajectory[len(track.Trajectory)-1]
		dt := event.Timestamp.Sub(last.Timestamp).Seconds()
		if dt > 0 {
			dlat := (track.Latitude - last.Lat) * 111000
			dlon := (track.Longitude - last.Lon) * 111000 * math.Cos(last.Lat*math.Pi/180)
			dalt := track.Altitude - last.Alt
			track.Speed = math.Sqrt(dlat*dlat+dlon*dlon+dalt*dalt) / dt
			track.Heading = math.Atan2(dlon, dlat) * 180 / math.Pi
			if track.Heading < 0 {
				track.Heading += 360
			}
		}
	}

	track.Trajectory = append(track.Trajectory, Position{
		Timestamp: event.Timestamp,
		Lat:       track.Latitude,
		Lon:       track.Longitude,
		Alt:       track.Altitude,
	})
	if len(track.Trajectory) > 20 {
		track.Trajectory = track.Trajectory[len(track.Trajectory)-20:]
	}

	track.LastUpdate = event.Timestamp
	track.Status = "UPDATED"
	track.ThreatLevel = tc.calcThreat(track)
}

func (tc *TrackCorrelator) createTrack(event *SensorEvent) *Track {
	num := tc.nextTrackNum
	tc.nextTrackNum++
	return &Track{
		TrackID:      fmt.Sprintf("TRK-%04d", num),
		TrackNumber:  num,
		Status:       "NEW",
		Latitude:     event.Latitude,
		Longitude:    event.Longitude,
		Altitude:     event.Altitude,
		Speed:        0,
		Heading:      0,
		ThreatLevel:  tc.calcThreatEvent(event),
		TrackSource:  event.SensorType,
		PlatformType: tc.inferPlatform(event),
		ForceType:    "UNKNOWN",
		LastUpdate:   event.Timestamp,
		Trajectory: []Position{{
			Timestamp: event.Timestamp,
			Lat:       event.Latitude,
			Lon:       event.Longitude,
			Alt:       event.Altitude,
		}},
	}
}

func (tc *TrackCorrelator) calcThreat(t *Track) int {
	threat := 1
	if t.Speed > 1000 {
		threat = 5
	} else if t.Speed > 500 {
		threat = 4
	} else if t.Speed > 200 {
		threat = 3
	}
	if t.Altitude < 50000 && t.Altitude > 10000 {
		threat = int(math.Min(float64(threat+1), 5))
	}
	return threat
}

func (tc *TrackCorrelator) calcThreatEvent(e *SensorEvent) int {
	threat := 1
	if e.Intensity > 80 {
		threat = 4
	} else if e.Intensity > 60 {
		threat = 3
	}
	if e.SNR > 20 {
		threat = int(math.Min(float64(threat+1), 5))
	}
	return threat
}

func (tc *TrackCorrelator) inferPlatform(e *SensorEvent) string {
	switch e.SensorType {
	case "OPIR":
		return "BALLISTIC_MISSILE"
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

func (tc *TrackCorrelator) isVelocityFeasible(t *Track, e *SensorEvent) bool {
	if len(t.Trajectory) == 0 {
		return true
	}
	last := t.Trajectory[len(t.Trajectory)-1]
	dt := e.Timestamp.Sub(last.Timestamp).Seconds()
	if dt <= 0 {
		return false
	}
	dist := tc.haversine(last.Lat, last.Lon, e.Latitude, e.Longitude) * 1000
	return (dist / dt) <= tc.MaxSpeed
}

func (tc *TrackCorrelator) haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371
	dLat := (lat2 - lat1) * math.Pi / 180
	dLon := (lon2 - lon1) * math.Pi / 180
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
			math.Sin(dLon/2)*math.Sin(dLon/2)
	return R * 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
}

func (tc *TrackCorrelator) GetTracks() []*Track {
	tc.mu.RLock()
	defer tc.mu.RUnlock()
	tracks := make([]*Track, 0, len(tc.tracks))
	for _, t := range tc.tracks {
		tracks = append(tracks, t)
	}
	sort.Slice(tracks, func(i, j int) bool {
		return tracks[i].ThreatLevel > tracks[j].ThreatLevel
	})
	return tracks
}

func (tc *TrackCorrelator) DropStaleTracks() []string {
	tc.mu.Lock()
	defer tc.mu.Unlock()
	now := time.Now()
	dropped := []string{}
	for id, t := range tc.tracks {
		if now.Sub(t.LastUpdate) > tc.MaxTrackAge {
			t.Status = "DROPPED"
			dropped = append(dropped, id)
			delete(tc.tracks, id)
		}
	}
	return dropped
}

func (tc *TrackCorrelator) GetStats() map[string]interface{} {
	tc.mu.RLock()
	defer tc.mu.RUnlock()
	return map[string]interface{}{
		"active_tracks":  len(tc.tracks),
		"next_track_num": tc.nextTrackNum,
	}
}
