package internal

import (
	"fmt"
	"log"

	"forge-c2/jreap"
)

// JREAPConsumer is a thin dispatcher that routes incoming JREAP messages to
// typed handlers. Each handler runs as an independent application (NOS3 style),
// responsible for a subset of message types.
//
// Handler layout:
//   - trackManagerHandler: J0 (track lifecycle), J2 (new detection), J3 (track update)
//   - opirHandler:          J28 (OPIR satellite tracks)
//   - engagementHandler:    J4 (engagement order), J5 (engagement status)
//   - alertHandler:         J12 (alert/notification)
//   - networkHandler:       J1 (net init), J6 (sensor reg), J7 (platform/sensor), J8 (radio)
//                          J9 (EW), J10 (offset), J11 (data transfer)
//
// This separation means each message type can be processed, monitored, and
// scaled independently — matching the NOS3 multi-app architecture.
type JREAPConsumer struct {
	decoder           *jreap.Decoder
	trackMgr          *trackManagerHandler
	opir              *opirHandler
	engagement        *engagementHandler
	alert             *alertHandler
	network           *networkHandler
}

// NewJREAPConsumer creates a new JREAP consumer with all typed handlers.
func NewJREAPConsumer(correlator *TrackCorrelator, c2bmc *C2BMCInterface, trackStore *TrackStore) *JREAPConsumer {
	return &JREAPConsumer{
		decoder:    jreap.NewDecoder("FORGE-NODE-0001", "JREAP-CONSUMER"),
		trackMgr:   newTrackManagerHandler(correlator, trackStore, c2bmc),
		opir:       newOpIRHandler(correlator, trackStore, c2bmc),
		engagement: newEngagementHandler(c2bmc),
		alert:      newAlertHandler(c2bmc),
		network:    newNetworkHandler(),
	}
}

// ProcessMessage routes a raw JREAP message to the appropriate typed handler.
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
		return c.trackMgr.HandleJ2(msg)
	case jreap.J3_TrackUpdate:
		return c.trackMgr.HandleJ3(msg)
	case jreap.J4_EngagementOrder:
		return c.engagement.HandleJ4(msg)
	case jreap.J5_EngagementStatus:
		return c.engagement.HandleJ5(msg)
	case jreap.J6_SensorRegistration:
		return c.network.HandleJ6(msg)
	case jreap.J0_TrackManagement:
		return c.trackMgr.HandleJ0(msg)
	case jreap.J1_NetworkInitialize:
		return c.network.HandleJ1(msg)
	case jreap.J7_Platform:
		return c.network.HandleJ7(msg)
	case jreap.J8_Radio:
		return c.network.HandleJ8(msg)
	case jreap.J9_ElectronicAttack:
		return c.network.HandleJ9(msg)
	case jreap.J10_Offset:
		return c.network.HandleJ10(msg)
	case jreap.J11_DataTransfer:
		return c.network.HandleJ11(msg)
	case jreap.J12_Alert:
		return c.alert.HandleJ12(msg)
	case jreap.J28_SatelliteOPIR:
		return c.opir.Handle(msg)
	default:
		log.Printf("[JREAPConsumer] Unknown message type: J%d", hdr.MessageType)
		return nil
	}
}
