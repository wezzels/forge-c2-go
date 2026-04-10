package internal

import (
	"fmt"
	"log"

	"forge-c2/jreap"
)

// alertHandler processes J12 (Alert) messages.
type alertHandler struct {
	decoder *jreap.Decoder
	c2bmc   *C2BMCInterface
}

// newAlertHandler creates a new alert handler.
func newAlertHandler(c2bmc *C2BMCInterface) *alertHandler {
	return &alertHandler{
		decoder: jreap.NewDecoder("FORGE-NODE-0001", "ALERT-HANDLER"),
		c2bmc:   c2bmc,
	}
}

// HandleJ12 processes a J12 Alert message.
func (h *alertHandler) HandleJ12(msg []byte) error {
	j12, err := h.decoder.DecodeJ12(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ12 failed: %w", err)
	}

	log.Printf("[AlertHandler] J12: id=%s type=%d severity=%d pos=(%.4f,%.4f)",
		j12.AlertID, j12.AlertType, j12.Severity, j12.Latitude, j12.Longitude)

	alert := &BMDAlert{
		AlertID:      j12.AlertID,
		TrackID:      fmt.Sprintf("TRK-%04d", j12.TrackNumber),
		AlertType:    h.alertTypeString(j12.AlertType),
		Severity:     int(j12.Severity),
		Message:      fmt.Sprintf("J12 Alert: %s from %s", h.alertTypeString(j12.AlertType), j12.SourceID),
		Acknowledged: false,
		CreatedAt:    j12.Timestamp,
	}
	h.c2bmc.InjectAlert(alert)
	return nil
}

func (h *alertHandler) alertTypeString(t uint8) string {
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
