package internal

import (
	"fmt"
	"log"
	"time"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

// engagementHandler processes J4 (EngagementOrder) and J5 (EngagementStatus) messages.
type engagementHandler struct {
	decoder *jreap.Decoder
	c2bmc   *C2BMCInterface
}

// newEngagementHandler creates a new engagement handler.
func newEngagementHandler(c2bmc *C2BMCInterface) *engagementHandler {
	return &engagementHandler{
		decoder: jreap.NewDecoder("FORGE-NODE-0001", "ENGAGE-HANDLER"),
		c2bmc:   c2bmc,
	}
}

// HandleJ4 processes a J4 Engagement Order message.
func (h *engagementHandler) HandleJ4(msg []byte) error {
	meta := mdpa.NewMDPAMetadata(h.decoder.NodeID(), "ENGAGE-HANDLER", "", "UNCLASSIFIED")
	j4, err := h.decoder.DecodeEngagementOrder(msg, meta)
	if err != nil {
		return fmt.Errorf("DecodeEngagementOrder failed: %w", err)
	}

	log.Printf("[EngageHandler] J4: engagement=%s track=%s weapon=%s priority=%d",
		j4.OrderID, j4.TrackID, j4.WeaponSystem, j4.Priority)

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
	h.c2bmc.InjectEngagement(eng)
	return nil
}

// HandleJ5 processes a J5 Engagement Status message.
func (h *engagementHandler) HandleJ5(msg []byte) error {
	j5, err := h.decoder.DecodeJ5(msg)
	if err != nil {
		return fmt.Errorf("DecodeJ5 failed: %w", err)
	}

	log.Printf("[EngageHandler] J5: engagement=%d stage=%d result=%d",
		j5.EngagementID, j5.EngagementStage, j5.InterceptResult)

	status := h.stageToStatus(j5.EngagementStage)
	h.c2bmc.UpdateEngagementStatusByID(j5.EngagementID, status)
	return nil
}

func (h *engagementHandler) stageToStatus(stage uint8) string {
	switch stage {
	case jseries.J5StageWeaponLaunched:
		return "LAUNCHED"
	case jseries.J5StageFlightTerminated:
		return "INTERCEPTED"
	case jseries.J5StageInterceptSuccess:
		return "INTERCEPTED"
	case jseries.J5StageInterceptFailed:
		return "FAILED"
	case jseries.J5StageCancelled:
		return "CANCELLED"
	default:
		return "PENDING"
	}
}
