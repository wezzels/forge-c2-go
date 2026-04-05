package internal

import (
	"log"

	"forge-c2/jreap"
)

// coordinationHandler processes J13–J17 coordination/control messages.
// These are network management, command, and transfer protocol messages.
type coordinationHandler struct {
	decoder *jreap.Decoder
}

// newCoordinationHandler creates a new coordination handler.
func newCoordinationHandler() *coordinationHandler {
	return &coordinationHandler{
		decoder: jreap.NewDecoder("FORGE-NODE-0001", "COORD-HANDLER"),
	}
}

func (h *coordinationHandler) HandleJ13(msg []byte) error {
	j13, err := h.decoder.DecodeJ13(msg)
	if err != nil {
		return err
	}
	log.Printf("[CoordHandler] J13: pn=%d lat=%.6f lon=%.6f alt=%.1f vel=(%.2f,%.2f,%.2f) timeq=%d",
		j13.ParticipantNumber, j13.Latitude, j13.Longitude, j13.Altitude,
		j13.VelocityX, j13.VelocityY, j13.VelocityZ, j13.TimeQuality)
	return nil
}

func (h *coordinationHandler) HandleJ14(msg []byte) error {
	j14, err := h.decoder.DecodeJ14(msg)
	if err != nil {
		return err
	}
	log.Printf("[CoordHandler] J14: track=%d subtype=%d mode=%d qmin=%d rate=%.1f",
		j14.TrackNumber, j14.Subtype, j14.ProcessMode, j14.QualityMin, j14.UpdateRate)
	return nil
}

func (h *coordinationHandler) HandleJ15(msg []byte) error {
	j15, err := h.decoder.DecodeJ15(msg)
	if err != nil {
		return err
	}
	log.Printf("[CoordHandler] J15: id=%d subtype=%d code=%d target=%d priority=%d",
		j15.CommandID, j15.Subtype, j15.CommandCode, j15.TargetID, j15.Priority)
	return nil
}

func (h *coordinationHandler) HandleJ16(msg []byte) error {
	j16, err := h.decoder.DecodeJ16(msg)
	if err != nil {
		return err
	}
	status := "ACK"
	if j16.AckStatus == 2 {
		status = "NACK"
	} else if j16.AckStatus == 3 {
		status = "REFUSED"
	}
	log.Printf("[CoordHandler] J16: ack=%d subtype=%d status=%s orig=%d",
		j16.AckID, j16.Subtype, status, j16.OriginalID)
	return nil
}

func (h *coordinationHandler) HandleJ17(msg []byte) error {
	j17, err := h.decoder.DecodeJ17(msg)
	if err != nil {
		return err
	}
	subtype := "INITIATE"
	switch j17.Subtype {
	case 1:
		subtype = "ACCEPT"
	case 2:
		subtype = "REJECT"
	case 3:
		subtype = "CANCEL"
	}
	log.Printf("[CoordHandler] J17: id=%d subtype=%s size=%d src=%d dst=%d file=%q",
		j17.TransferID, subtype, j17.FileSize, j17.ParticipantSrc, j17.ParticipantDst, j17.Filename)
	return nil
}
