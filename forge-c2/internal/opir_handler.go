package internal

import (
	"fmt"
	"log"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// opirHandler processes J28 OPIR satellite track messages.
// Replaces direct correlator.ProcessEvent calls from the main consumer.
type opirHandler struct {
	decoder     *jreap.Decoder
	correlator  *TrackCorrelator
	trackStore  *TrackStore
	c2bmc       *C2BMCInterface
}

// newOpIRHandler creates a new OPIR message handler.
func newOpIRHandler(correlator *TrackCorrelator, trackStore *TrackStore, c2bmc *C2BMCInterface) *opirHandler {
	return &opirHandler{
		decoder:    jreap.NewDecoder("FORGE-NODE-0001", "OPIR-HANDLER"),
		correlator: correlator,
		trackStore: trackStore,
		c2bmc:      c2bmc,
	}
}

// Handle processes a raw JREAP J28 message.
func (h *opirHandler) Handle(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(h.decoder.NodeID(), "OPIR-HANDLER", "", "UNCLASSIFIED")
	j28, err := h.decoder.DecodeJ28(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ28 failed: %w", err)
	}

	event := &SensorEvent{
		EventID:    fmt.Sprintf("J28-%s-%d", j28.SatelliteID, j28.Time.UnixMilli()),
		Timestamp:  j28.Time,
		SensorID:   j28.SatelliteID,
		SensorType: "OPIR",
		Latitude:   j28.Latitude,
		Longitude:  j28.Longitude,
		Altitude:   j28.Altitude,
		Azimuth:    0,
		Elevation:  0,
		SignalType: "IR",
		Intensity:  j28.IRIntensity,
		Frequency:  0,
		SNR:        j28.SNR,
		Confidence: j28.DetectionConf,
	}

	track, isNew := h.correlator.ProcessEvent(event)
	if track.CorrelationID != "" {
		meta.CorrelationID = track.CorrelationID
	}
	meta.QualityFlags = track.QualityFlags

	h.trackStore.SetTrack(track.TrackID, track)
	h.c2bmc.UpdateTrack(track)

	log.Printf("[OPIRHandler] J28: sat=%s track=%s pos=(%.4f,%.4f,%.0f) new=%v corr=%s",
		j28.SatelliteID, track.TrackID, j28.Latitude, j28.Longitude, j28.Altitude, isNew, meta.CorrelationID)
	return nil
}

// HandleJ28 processes a decoded J28 directly (for use with shared decoder).
func (h *opirHandler) HandleJ28(j28 *jseries.J28SpaceTrack, meta *mdpa.MDPAMetadata) error {
	event := &SensorEvent{
		EventID:    fmt.Sprintf("J28-%s-%d", j28.SatelliteID, j28.Time.UnixMilli()),
		Timestamp:  j28.Time,
		SensorID:   j28.SatelliteID,
		SensorType: "OPIR",
		Latitude:   j28.Latitude,
		Longitude:  j28.Longitude,
		Altitude:   j28.Altitude,
		Azimuth:    0,
		Elevation:  0,
		SignalType: "IR",
		Intensity:  j28.IRIntensity,
		Frequency:  0,
		SNR:        j28.SNR,
		Confidence: j28.DetectionConf,
	}

	track, isNew := h.correlator.ProcessEvent(event)
	if track.CorrelationID != "" {
		meta.CorrelationID = track.CorrelationID
	}
	meta.QualityFlags = track.QualityFlags

	h.trackStore.SetTrack(track.TrackID, track)
	h.c2bmc.UpdateTrack(track)

	log.Printf("[OPIRHandler] J28: sat=%s track=%s pos=(%.4f,%.4f,%.0f) new=%v corr=%s",
		j28.SatelliteID, track.TrackID, j28.Latitude, j28.Longitude, j28.Altitude, isNew, meta.CorrelationID)
	return nil
}
