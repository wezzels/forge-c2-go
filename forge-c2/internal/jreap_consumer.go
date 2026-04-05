package internal

import (
	"fmt"
	"log"
	"time"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// JREAPConsumer processes incoming JREAP messages and feeds them into the system.
// It bridges external JREAP-C traffic (from UDP/TCP) with the internal correlator and C2BMC.
type JREAPConsumer struct {
	decoder     *jreap.Decoder
	correlator *TrackCorrelator
	c2bmc      *C2BMCInterface
	trackStore *TrackStore
}

// NewJREAPConsumer creates a new JREAP consumer.
func NewJREAPConsumer(correlator *TrackCorrelator, c2bmc *C2BMCInterface, trackStore *TrackStore) *JREAPConsumer {
	return &JREAPConsumer{
		decoder:     jreap.NewDecoder("FORGE-NODE-0001", "JREAP-CONSUMER"),
		correlator: correlator,
		c2bmc:      c2bmc,
		trackStore: trackStore,
	}
}

// ProcessMessage takes a raw JREAP message bytes, decodes it, and feeds the
// appropriate internal event into the correlator and C2BMC.
func (c *JREAPConsumer) ProcessMessage(msg []byte) error {
	if len(msg) < 10 {
		return fmt.Errorf("message too short: %d bytes", len(msg))
	}

	hdr, _, _, err := jreap.DecodeFull(msg)
	if err != nil {
		return fmt.Errorf("JREAP decode failed: %w", err)
	}

	switch jreap.MessageType(hdr.MessageType) {
	case jreap.J2_Surveillance:
		return c.processJ2(msg)
	case jreap.J3_TrackUpdate:
		return c.processJ3(msg)
	case jreap.J4_EngagementOrder:
		return c.processJ4(msg)
	case jreap.J5_EngagementStatus:
		return c.processJ5(msg)
	case jreap.J6_SensorRegistration:
		return c.processJ6(msg)
	case jreap.J0_TrackManagement:
		return c.processJ0(msg)
	case jreap.J1_NetworkInitialize:
		return c.processJ1(msg)
	case jreap.J12_Alert:
		return c.processJ12(msg)
	case jreap.J28_SatelliteOPIR:
		return c.processJ28(msg)
	default:
		log.Printf("[JREAPConsumer] Unknown message type: J%d", hdr.MessageType)
		return nil
	}
}

// processJ2 feeds a J2 Surveillance message into the correlator as a new detection.
func (c *JREAPConsumer) processJ2(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(c.decoder.NodeID(), "JREAP-CONSUMER", "", "UNCLASSIFIED")
	j2, err := c.decoder.DecodeJ2(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ2 failed: %w", err)
	}

	event := &SensorEvent{
		EventID:    fmt.Sprintf("J2-%d-%d", j2.TrackNumber, j2.Timestamp.UnixMilli()),
		Timestamp:  j2.Timestamp,
		SensorID:   fmt.Sprintf("SN-%d", j2.ParticipantNumber),
		SensorType: "RADAR", // inferred from J2 surveillance
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

	track, isNew := c.correlator.ProcessEvent(event)
	// Propagate CorrelationID back from track to metadata
	meta.CorrelationID = track.CorrelationID
	meta.QualityFlags = track.QualityFlags

	c.trackStore.SetTrack(track.TrackID, track)
	c.c2bmc.UpdateTrack(track)

	log.Printf("[JREAPConsumer] J2 Surveillance: track=%s lat=%.4f lon=%.4f alt=%.0f new=%v corr=%s",
		track.TrackID, j2.Latitude, j2.Longitude, j2.Altitude, isNew, meta.CorrelationID)
	return nil
}

// processJ3 feeds a J3.0 Track Update directly into the track store (already correlated).
// If the track exists, update it. If not, create a new track from J3 data.
func (c *JREAPConsumer) processJ3(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(c.decoder.NodeID(), "JREAP-CONSUMER", "", "UNCLASSIFIED")
	j3, err := c.decoder.DecodeTrackUpdate(msg, meta)
	if err != nil {
		return fmt.Errorf("DecodeTrackUpdate failed: %w", err)
	}

	// Find existing track by track number or create new one
	existing := c.findTrackByNumber(j3.TrackNumber)
	if existing != nil {
		// Update existing track with J3 data
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
		// Keep last 20 trajectory points
		if len(existing.Trajectory) > 20 {
			existing.Trajectory = existing.Trajectory[len(existing.Trajectory)-20:]
		}
		// Propagate quality flags from J3
		if j3.Metadata != nil {
			existing.QualityFlags = j3.Metadata.QualityFlags
			if j3.Metadata.CorrelationID != "" {
				existing.CorrelationID = j3.Metadata.CorrelationID
			}
		}
		c.trackStore.SetTrack(existing.TrackID, existing)
		c.c2bmc.UpdateTrack(existing)
		log.Printf("[JREAPConsumer] J3 Track Update: track=%s lat=%.4f lon=%.4f alt=%.0f spd=%.1f corr=%s",
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
			ThreatLevel: int(j3.ThreatLevel),
			TrackSource:  "FUSED",
			PlatformType: "BALLISTIC_MISSILE",
			ForceType:    "UNKNOWN",
			LastUpdate:   j3.Timestamp,
			Trajectory: []Position{
				{Timestamp: j3.Timestamp, Lat: j3.Latitude, Lon: j3.Longitude, Alt: j3.Altitude},
			},
		}
		// Apply quality from metadata
		if j3.Metadata != nil {
			track.QualityFlags = j3.Metadata.QualityFlags
			track.CorrelationID = j3.Metadata.CorrelationID
		} else {
			track.CorrelationID = GenerateCorrelationID("FUSED", j3.TrackNumber, j3.Timestamp)
		}
		c.trackStore.SetTrack(track.TrackID, track)
		c.correlator.ProcessEvent(&SensorEvent{
			EventID:    fmt.Sprintf("J3-%d-%d", j3.TrackNumber, j3.Timestamp.UnixMilli()),
			Timestamp:  j3.Timestamp,
			SensorID:   "J3-FUSED",
			SensorType: "FUSED",
			Latitude:   j3.Latitude,
			Longitude: j3.Longitude,
			Altitude:  j3.Altitude,
		})
		log.Printf("[JREAPConsumer] J3 Track New: track=%s lat=%.4f lon=%.4f alt=%.0f corr=%s",
			track.TrackID, j3.Latitude, j3.Longitude, j3.Altitude, track.CorrelationID)
	}
	return nil
}

// processJ4 handles a J4 Engagement Order — feed to C2BMC.
func (c *JREAPConsumer) processJ4(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(c.decoder.NodeID(), "JREAP-CONSUMER", "", "UNCLASSIFIED")
	j4, err := c.decoder.DecodeEngagementOrder(msg, meta)
	if err != nil {
		return fmt.Errorf("DecodeEngagementOrder failed: %w", err)
	}

	log.Printf("[JREAPConsumer] J4 Engagement Order: track=%s weapon=%s priority=%d",
		j4.TrackID, j4.WeaponSystem, j4.Priority)

	// C2BMC already handles engagement order creation internally via UpdateTrack.
	// For J4 messages from external sources, we need to simulate the order.
	// Find the track and create an engagement.
	eng := &EngagementOrder{
		OrderID:       j4.OrderID,
		TrackID:        j4.TrackID,
		Priority:       j4.Priority,
		WeaponSystem:   j4.WeaponSystem,
		TimeOnTarget:   j4.TimeOnTarget,
		InterceptProb:  j4.InterceptProb,
		Status:         j4.Status,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}
	// Manually inject into C2BMC's engagement map
	c.c2bmc.InjectEngagement(eng)
	return nil
}

// processJ5 handles a J5 Engagement Status update.
func (c *JREAPConsumer) processJ5(msg []byte) error {
	j5, err := c.decoder.DecodeJ5(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ5 failed: %w", err)
	}

	log.Printf("[JREAPConsumer] J5 Engagement Status: engagement=%d stage=%d result=%d",
		j5.EngagementID, j5.EngagementStage, j5.InterceptResult)

	// Map J5 stage to C2BMC status
	var status string
	switch j5.EngagementStage {
	case jseries.J5StageWeaponLaunched:
		status = "LAUNCHED"
	case jseries.J5StageFlightTerminated:
		status = "INTERCEPTED"
	case jseries.J5StageInterceptSuccess:
		status = "INTERCEPTED"
	case jseries.J5StageInterceptFailed:
		status = "FAILED"
	case jseries.J5StageCancelled:
		status = "CANCELLED"
	default:
		status = "PENDING"
	}

	c.c2bmc.UpdateEngagementStatusByID(j5.EngagementID, status)
	return nil
}

// processJ0 handles a J0 Track Management message — manages track lifecycle.
// Used for track initiation, confirmation, and drop notifications.
func (c *JREAPConsumer) processJ0(msg []byte) error {
	j0, err := c.decoder.DecodeJ0(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ0 failed: %w", err)
	}

	log.Printf("[JREAPConsumer] J0 Track Management: track=%d status=%s type=%d lat=%.4f lon=%.4f alt=%.0f corr=%s",
		j0.TrackNumber, j0.TrackStatus.String(), j0.MgtType,
		j0.Latitude, j0.Longitude, j0.Altitude, j0.CorrelationID)

	switch j0.MgtType {
	case jseries.J0TrackDrop:
		// Find and drop the track
		if existing := c.findTrackByNumber(j0.TrackNumber); existing != nil {
			existing.Status = "DROPPED"
			existing.LastUpdate = j0.Time
			c.trackStore.SetTrack(existing.TrackID, existing)
			c.c2bmc.UpdateTrack(existing)
			log.Printf("[JREAPConsumer] J0 Track Drop: track=%d (%s) dropped",
				j0.TrackNumber, existing.TrackID)
		}
	case jseries.J0TrackInitiation:
		// Create new track from J0 data
		track := &Track{
			TrackID:      fmt.Sprintf("TRK-%04d", j0.TrackNumber),
			TrackNumber:  j0.TrackNumber,
			Status:       j0.TrackStatus.String(),
			Latitude:     j0.Latitude,
			Longitude:    j0.Longitude,
			Altitude:     j0.Altitude,
			Speed:        j0.Speed,
			Heading:      j0.Heading,
			ThreatLevel: int(j0.Quality.Quality + 1), // quality 0-3 → threat 1-4
			TrackSource:  j0.SensorID,
			PlatformType: "BALLISTIC_MISSILE",
			ForceType:   decodeForceType(j0.ForceType),
			LastUpdate:   j0.Time,
			Trajectory: []Position{
				{Timestamp: j0.Time, Lat: j0.Latitude, Lon: j0.Longitude, Alt: j0.Altitude},
			},
			QualityFlags:  qualityToFlags(j0.Quality),
			CorrelationID: j0.CorrelationID,
		}
		c.trackStore.SetTrack(track.TrackID, track)
		c.c2bmc.UpdateTrack(track)
		log.Printf("[JREAPConsumer] J0 Track Init: track=%d (%s) confirmed",
			j0.TrackNumber, track.TrackID)
	case jseries.J0TrackData, jseries.J0TrackGroup:
		// Update existing track
		if existing := c.findTrackByNumber(j0.TrackNumber); existing != nil {
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
			c.trackStore.SetTrack(existing.TrackID, existing)
			c.c2bmc.UpdateTrack(existing)
		}
	}
	return nil
}

// processJ1 handles a J1 Network Initialization message — network join/leave/heartbeat.
func (c *JREAPConsumer) processJ1(msg []byte) error {
	j1, err := c.decoder.DecodeJ1(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ1 failed: %w", err)
	}

	nodeStatus := "ACTIVE"
	switch j1.NetworkStatus {
	case jseries.NetworkStatusStandby:
		nodeStatus = "STANDBY"
	case jseries.NetworkStatusOffline:
		nodeStatus = "OFFLINE"
	}

	log.Printf("[JREAPConsumer] J1 Network Init: net=%d msg_type=%d node=%d participants=%d status=%s lat=%.4f lon=%.4f",
		j1.NetworkID, j1.MessageType, j1.NodeID, j1.ParticipantCount, nodeStatus, j1.Latitude, j1.Longitude)
	return nil
}

// processJ6 handles a J6 Sensor Registration — log and optionally update sensor registry.
func (c *JREAPConsumer) processJ6(msg []byte) error {
	j6, err := c.decoder.DecodeJ6(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ6 failed: %w", err)
	}

	log.Printf("[JREAPConsumer] J6 Sensor Registration: sensor=%s type=%d lat=%.4f lon=%.4f status=%d",
		j6.SensorID, j6.SensorType, j6.Latitude, j6.Longitude, j6.Status)
	return nil
}

// processJ12 handles a J12 Alert — create an alert and update C2BMC.
func (c *JREAPConsumer) processJ12(msg []byte) error {
	j12, err := c.decoder.DecodeJ12(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ12 failed: %w", err)
	}

	log.Printf("[JREAPConsumer] J12 Alert: id=%s type=%d severity=%d lat=%.4f lon=%.4f",
		j12.AlertID, j12.AlertType, j12.Severity, j12.Latitude, j12.Longitude)

	alert := &BMDAlert{
		AlertID:     j12.AlertID,
		TrackID:     fmt.Sprintf("TRK-%04d", j12.TrackNumber),
		AlertType:   c.alertTypeString(j12.AlertType),
		Severity:    int(j12.Severity),
		Message:     fmt.Sprintf("J12 Alert: %s from %s", c.alertTypeString(j12.AlertType), j12.SourceID),
		Acknowledged: false,
		CreatedAt:   j12.Timestamp,
	}
	c.c2bmc.InjectAlert(alert)
	return nil
}

// processJ28 handles a J28 Space Track (OPIR satellite track) — feed to correlator.
func (c *JREAPConsumer) processJ28(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(c.decoder.NodeID(), "JREAP-CONSUMER", "", "UNCLASSIFIED")
	j28, err := c.decoder.DecodeJ28(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ28 failed: %w", err)
	}

	event := &SensorEvent{
		EventID:    fmt.Sprintf("J28-%d-%d", j28.TrackNumber, j28.Time.UnixMilli()),
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

	track, isNew := c.correlator.ProcessEvent(event)
	// Propagate CorrelationID back from track
	if track.CorrelationID != "" {
		meta.CorrelationID = track.CorrelationID
	}
	meta.QualityFlags = track.QualityFlags

	c.trackStore.SetTrack(track.TrackID, track)
	c.c2bmc.UpdateTrack(track)

	log.Printf("[JREAPConsumer] J28 Space Track: track=%s sat=%s lat=%.4f lon=%.4f alt=%.0f new=%v corr=%s",
		track.TrackID, j28.SatelliteID, j28.Latitude, j28.Longitude, j28.Altitude, isNew, meta.CorrelationID)
	return nil
}

// findTrackByNumber searches the track store for a track with the given number.
func (c *JREAPConsumer) findTrackByNumber(num uint16) *Track {
	for _, t := range c.trackStore.GetAllTracks() {
		if t.TrackNumber == num {
			return t
		}
	}
	return nil
}

func (c *JREAPConsumer) alertTypeString(t uint8) string {
	switch t {
	case 1:
		return "LAUNCH_DETECTED"
	case 2:
		return "THREAT_CONFIRMED"
	case 3:
		return "ENGAGEMENT_ORDER"
	case 4:
		return "INTERCEPT_COMPLETE"
	case 5:
		return "SYSTEM_STATUS"
	default:
		return "UNKNOWN"
	}
}

// decodeForceType converts a J-series force type code to a string.
func decodeForceType(code uint8) string {
	switch code & 0x03 {
	case 1:
		return "FRIEND"
	case 2:
		return "HOSTILE"
	case 3:
		return "NEUTRAL"
	default:
		return "UNKNOWN"
	}
}

// qualityToFlags converts a jseries.QualityIndicator to mdpa quality flags.
func qualityToFlags(q jseries.QualityIndicator) uint8 {
	var flags uint8
	if q.Quality >= 1 {
		flags |= mdpa.QualityGood
	}
	if q.Derived {
		flags |= mdpa.QualityCorrelated
	}
	if q.Manual {
		// Manual plots are generally good quality
		flags |= mdpa.QualityGeomGood
	}
	if !q.Coasting {
		flags |= mdpa.QualityTimely
	}
	return flags
}
