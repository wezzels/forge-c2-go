package internal

import (
	"log"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
)

// networkHandler processes J1 (Network Initialization) and J6 (Sensor Registration) messages.
type networkHandler struct {
	decoder *jreap.Decoder
}

// newNetworkHandler creates a new network handler.
func newNetworkHandler() *networkHandler {
	return &networkHandler{
		decoder: jreap.NewDecoder("FORGE-NODE-0001", "NETWORK-HANDLER"),
	}
}

// HandleJ1 processes a J1 Network Initialization message.
func (h *networkHandler) HandleJ1(msg []byte) error {
	j1, err := h.decoder.DecodeJ1(msg)
	if err != nil {
		return err
	}

	status := "ACTIVE"
	switch j1.NetworkStatus {
	case jseries.NetworkStatusStandby:
		status = "STANDBY"
	case jseries.NetworkStatusOffline:
		status = "OFFLINE"
	}

	log.Printf("[NetworkHandler] J1: net=%d type=%d node=%d participants=%d status=%s pos=(%.4f,%.4f)",
		j1.NetworkID, j1.MessageType, j1.NodeID, j1.ParticipantCount, status, j1.Latitude, j1.Longitude)
	return nil
}

// HandleJ6 processes a J6 Sensor Registration message.
func (h *networkHandler) HandleJ6(msg []byte) error {
	j6, err := h.decoder.DecodeJ6(msg)
	if err != nil {
		return err
	}

	log.Printf("[NetworkHandler] J6: sensor=%s type=%d status=%d pos=(%.4f,%.4f)",
		j6.SensorID, j6.SensorType, j6.Status, j6.Latitude, j6.Longitude)
	return nil
}
