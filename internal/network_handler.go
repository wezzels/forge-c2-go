package internal

import (
	"log"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
)

// networkHandler processes J1 (Network Initialization), J6 (Sensor Registration),
// J7 (Platform/Sensor Data), and J8 (Radio) messages.
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

// HandleJ7 processes a J7 Platform/Sensor Data message.
func (h *networkHandler) HandleJ7(msg []byte) error {
	j7, err := h.decoder.DecodeJ7(msg)
	if err != nil {
		return err
	}

	log.Printf("[NetworkHandler] J7: track=%d subtype=%d pos=(%.4f,%.4f,%.0f) signal=%d snr=%.1f",
		j7.TrackNumber, j7.Subtype, j7.Latitude, j7.Longitude, j7.Altitude, j7.SignalType, j7.SNR)
	return nil
}

// HandleJ8 processes a J8 Radio message.
func (h *networkHandler) HandleJ8(msg []byte) error {
	j8, err := h.decoder.DecodeJ8(msg)
	if err != nil {
		return err
	}

	log.Printf("[NetworkHandler] J8: net=%d subtype=%d from=%d status=%s len=%d",
		j8.NetworkID, j8.Subtype, j8.ParticipantNumber, j8.RadioStatus.String(), j8.MessageLength)
	return nil
}

// HandleJ9 processes a J9 Electronic Warfare message.
func (h *networkHandler) HandleJ9(msg []byte) error {
	j9, err := h.decoder.DecodeJ9(msg)
	if err != nil {
		return err
	}

	log.Printf("[NetworkHandler] J9: track=%d subtype=%d ea=%s freq=%.0f lat=%.4f lon=%.4f",
		j9.TrackNumber, j9.Subtype, j9.EAStatus.String(), j9.Frequency, j9.Latitude, j9.Longitude)
	return nil
}

// HandleJ10 processes a J10 Offset message.
func (h *networkHandler) HandleJ10(msg []byte) error {
	j10, err := h.decoder.DecodeJ10(msg)
	if err != nil {
		return err
	}

	log.Printf("[NetworkHandler] J10: track=%d subtype=%d pos=(%.4f,%.4f,%.0f) off=(%.1f,%.1f,%.1f)",
		j10.TrackNumber, j10.Subtype, j10.Latitude, j10.Longitude, j10.Altitude, j10.OffsetX, j10.OffsetY, j10.OffsetZ)
	return nil
}

// HandleJ11 processes a J11 Data Transfer message.
func (h *networkHandler) HandleJ11(msg []byte) error {
	j11, err := h.decoder.DecodeJ11(msg)
	if err != nil {
		return err
	}

	log.Printf("[NetworkHandler] J11: id=%d subtype=%d status=%s len=%d offset=%d",
		j11.TransferID, j11.Subtype, j11.TransferStatus.String(), j11.DataLength, j11.Offset)
	return nil
}
