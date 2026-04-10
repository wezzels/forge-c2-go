package internal

import (
	"fmt"
	"log"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// trackManagerHandler processes J0 (track lifecycle) and J3 (track update) messages.
// Handles track initiation, confirmation, drop, and position updates.
type trackManagerHandler struct {
	decoder    *jreap.Decoder
	correlator *TrackCorrelator
	trackStore *TrackStore
	c2bmc      *C2BMCInterface
}

// newTrackManagerHandler creates a new track manager handler.
func newTrackManagerHandler(correlator *TrackCorrelator, trackStore *TrackStore, c2bmc *C2BMCInterface) *trackManagerHandler {
	return &trackManagerHandler{
		decoder:    jreap.NewDecoder("FORGE-NODE-0001", "TRACK-MGR"),
		correlator: correlator,
		trackStore: trackStore,
		c2bmc:      c2bmc,
	}
}

// HandleJ0 processes a J0 Track Management message.
func (h *trackManagerHandler) HandleJ0(msg []byte) error {
	j0, err := h.decoder.DecodeJ0(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ0 failed: %w", err)
	}

	log.Printf("[TrackMgr] J0: track=%d status=%s type=%d pos=(%.4f,%.4f,%.0f) corr=%s",
		j0.TrackNumber, j0.TrackStatus.String(), j0.MgtType,
		j0.Latitude, j0.Longitude, j0.Altitude, j0.CorrelationID)

	switch j0.MgtType {
	case jseries.J0TrackDrop:
		return h.handleTrackDrop(j0)
	case jseries.J0TrackInitiation:
		return h.handleTrackInit(j0)
	case jseries.J0TrackData, jseries.J0TrackGroup:
		return h.handleTrackUpdate(j0)
	}
	return nil
}

// HandleJ3 processes a J3 Track Update message.
func (h *trackManagerHandler) HandleJ3(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(h.decoder.NodeID(), "TRACK-MGR", "", "UNCLASSIFIED")
	j3, err := h.decoder.DecodeTrackUpdate(msg, meta)
	if err != nil {
		return fmt.Errorf("DecodeTrackUpdate failed: %w", err)
	}

	existing := h.findByNumber(j3.TrackNumber)
	if existing != nil {
		// Update existing track
		existing.Latitude = j3.Latitude
		existing.Longitude = j3.Longitude
		existing.Altitude = j3.Altitude
		existing.Speed = j3.Speed
		existing.Heading = j3.Heading
		existing.Status = j3.Status
		existing.ThreatLevel = int(j3.ThreatLevel)
		existing.LastUpdate = j3.Timestamp
		existing.Trajectory = append(existing.Trajectory, Position{
			Timestamp: j3.Timestamp,
			Lat:       j3.Latitude,
			Lon:       j3.Longitude,
			Alt:       j3.Altitude,
		})
		if len(existing.Trajectory) > 20 {
			existing.Trajectory = existing.Trajectory[len(existing.Trajectory)-20:]
		}
		if j3.Metadata != nil {
			existing.QualityFlags = j3.Metadata.QualityFlags
			if j3.Metadata.CorrelationID != "" {
				existing.CorrelationID = j3.Metadata.CorrelationID
			}
		}
		h.trackStore.SetTrack(existing.TrackID, existing)
		h.c2bmc.UpdateTrack(existing)
		log.Printf("[TrackMgr] J3 Update: track=%s pos=(%.4f,%.4f,%.0f) spd=%.1f corr=%s",
			existing.TrackID, j3.Latitude, j3.Longitude, j3.Altitude, j3.Speed, existing.CorrelationID)
	} else {
		// Create new track from J3
		track := &Track{
			TrackID:      fmt.Sprintf("TRK-%04d", j3.TrackNumber),
			TrackNumber:  j3.TrackNumber,
			Status:       j3.Status,
			Latitude:     j3.Latitude,
			Longitude:    j3.Longitude,
			Altitude:     j3.Altitude,
			Speed:        j3.Speed,
			Heading:      j3.Heading,
			ThreatLevel:  int(j3.ThreatLevel),
			TrackSource:  "FUSED",
			PlatformType: "BALLISTIC_MISSILE",
			ForceType:    "UNKNOWN",
			LastUpdate:   j3.Timestamp,
			Trajectory: []Position{
				{Timestamp: j3.Timestamp, Lat: j3.Latitude, Lon: j3.Longitude, Alt: j3.Altitude},
			},
		}
		if j3.Metadata != nil {
			track.QualityFlags = j3.Metadata.QualityFlags
			track.CorrelationID = j3.Metadata.CorrelationID
		} else {
			track.CorrelationID = GenerateCorrelationID("FUSED", j3.TrackNumber, j3.Timestamp)
		}
		h.trackStore.SetTrack(track.TrackID, track)
		// Feed into correlator for tracking continuity
		h.correlator.ProcessEvent(&SensorEvent{
			EventID:    fmt.Sprintf("J3-%d-%d", j3.TrackNumber, j3.Timestamp.UnixMilli()),
			Timestamp:  j3.Timestamp,
			SensorID:   "J3-FUSED",
			SensorType: "FUSED",
			Latitude:   j3.Latitude,
			Longitude:  j3.Longitude,
			Altitude:   j3.Altitude,
		})
		log.Printf("[TrackMgr] J3 New: track=%s pos=(%.4f,%.4f,%.0f) corr=%s",
			track.TrackID, j3.Latitude, j3.Longitude, j3.Altitude, track.CorrelationID)
	}
	return nil
}

// HandleJ2 processes a J2 Surveillance message as a new detection.
func (h *trackManagerHandler) HandleJ2(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(h.decoder.NodeID(), "TRACK-MGR", "", "UNCLASSIFIED")
	j2, err := h.decoder.DecodeJ2(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ2 failed: %w", err)
	}

	event := &SensorEvent{
		EventID:    fmt.Sprintf("J2-%d-%d", j2.TrackNumber, j2.Timestamp.UnixMilli()),
		Timestamp:  j2.Timestamp,
		SensorID:   fmt.Sprintf("SN-%d", j2.ParticipantNumber),
		SensorType: "RADAR",
		Latitude:   j2.Latitude,
		Longitude:  j2.Longitude,
		Altitude:   j2.Altitude,
		Azimuth:    j2.Heading,
		Elevation:  0,
		SignalType: "RF",
		Intensity:  j2.SignalIntensity,
		Frequency:  j2.Frequency,
		SNR:        j2.SNR,
		Confidence: j2.Confidence,
	}

	track, isNew := h.correlator.ProcessEvent(event)
	meta.CorrelationID = track.CorrelationID
	meta.QualityFlags = track.QualityFlags

	h.trackStore.SetTrack(track.TrackID, track)
	h.c2bmc.UpdateTrack(track)

	log.Printf("[TrackMgr] J2: track=%s pos=(%.4f,%.4f,%.0f) new=%v corr=%s",
		track.TrackID, j2.Latitude, j2.Longitude, j2.Altitude, isNew, meta.CorrelationID)
	return nil
}

func (h *trackManagerHandler) handleTrackDrop(j0 *jseries.J0TrackManagement) error {
	existing := h.findByNumber(j0.TrackNumber)
	if existing != nil {
		existing.Status = "DROPPED"
		existing.LastUpdate = j0.Time
		h.trackStore.SetTrack(existing.TrackID, existing)
		h.c2bmc.UpdateTrack(existing)
		log.Printf("[TrackMgr] J0 Drop: track=%d (%s) dropped", j0.TrackNumber, existing.TrackID)
	}
	return nil
}

func (h *trackManagerHandler) handleTrackInit(j0 *jseries.J0TrackManagement) error {
	track := &Track{
		TrackID:      fmt.Sprintf("TRK-%04d", j0.TrackNumber),
		TrackNumber:  j0.TrackNumber,
		Status:       j0.TrackStatus.String(),
		Latitude:     j0.Latitude,
		Longitude:    j0.Longitude,
		Altitude:     j0.Altitude,
		Speed:        j0.Speed,
		Heading:      j0.Heading,
		ThreatLevel:  int(j0.Quality.Quality + 1),
		TrackSource:  j0.SensorID,
		PlatformType: "BALLISTIC_MISSILE",
		ForceType:    decodeForceType(j0.ForceType),
		LastUpdate:   j0.Time,
		Trajectory: []Position{
			{Timestamp: j0.Time, Lat: j0.Latitude, Lon: j0.Longitude, Alt: j0.Altitude},
		},
		QualityFlags:  qualityToFlags(j0.Quality),
		CorrelationID: j0.CorrelationID,
	}
	h.trackStore.SetTrack(track.TrackID, track)
	h.c2bmc.UpdateTrack(track)
	log.Printf("[TrackMgr] J0 Init: track=%d (%s) confirmed", j0.TrackNumber, track.TrackID)
	return nil
}

func (h *trackManagerHandler) handleTrackUpdate(j0 *jseries.J0TrackManagement) error {
	existing := h.findByNumber(j0.TrackNumber)
	if existing != nil {
		existing.Latitude = j0.Latitude
		existing.Longitude = j0.Longitude
		existing.Altitude = j0.Altitude
		existing.Speed = j0.Speed
		existing.Heading = j0.Heading
		existing.Status = j0.TrackStatus.String()
		existing.LastUpdate = j0.Time
		existing.QualityFlags = qualityToFlags(j0.Quality)
		if j0.CorrelationID != "" {
			existing.CorrelationID = j0.CorrelationID
		}
		h.trackStore.SetTrack(existing.TrackID, existing)
		h.c2bmc.UpdateTrack(existing)
	}
	return nil
}

// findByNumber searches the track store by track number.
func (h *trackManagerHandler) findByNumber(num uint16) *Track {
	for _, t := range h.trackStore.GetAllTracks() {
		if t.TrackNumber == num {
			return t
		}
	}
	return nil
}
