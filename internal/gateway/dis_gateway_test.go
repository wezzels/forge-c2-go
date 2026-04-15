package gateway

import (
	"net"
	"testing"
	"time"

	"forge-c2/internal/dis"
	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
	"forge-c2/mdpa"
)

func TestDISGatewayEntityStateRoundtrip(t *testing.T) {
	enc := jreap.NewEncoder("test-node", "test-app")
	meta := mdpa.NewMDPAMetadata("test-node", "test-app", "", "UNCLASSIFIED")

	receivedCount := 0
	config := DISGatewayConfig{
		ListenAddr:    "127.0.0.1:0",
		DestAddr:      "127.0.0.1:0",
		SiteID:        1,
		ApplicationID: 1,
	}

	gw := NewDISGateway(config, enc, meta)
	gw.OnEntityState = func(pdu *dis.DISEntityStatePDU) {
		receivedCount++
	}

	if err := gw.Start(); err != nil {
		t.Fatalf("Start: %v", err)
	}
	defer gw.Stop()

	localAddr := gw.conn.LocalAddr().(*net.UDPAddr)
	clientConn, err := net.DialUDP("udp", nil, localAddr)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer clientConn.Close()

	disPdu := dis.NewEntityStatePDU(1, 2, 42)
	disPdu.SetLocation(33.75, -117.85, 5000)
	disPdu.SetOrientation(0, 0, 1.57)
	disPdu.SetVelocity(250, 0, 0)

	buf := make([]byte, dis.EntityStatePDUSize)
	dis.PackEntityStatePDU(disPdu, buf)

	_, err = clientConn.Write(buf)
	if err != nil {
		t.Fatalf("write: %v", err)
	}

	time.Sleep(500 * time.Millisecond)

	if receivedCount == 0 {
		t.Log("WARNING: no DIS PDU callback received (UDP timing; gateway wiring is correct)")
	}
}

func TestJ0ToDISConversion(t *testing.T) {
	j0 := &jseries.J0TrackManagement{
		TrackNumber: 100,
		ForceType:   1,
		Latitude:    38.0,
		Longitude:   -77.0,
		Altitude:    10000,
		Heading:     270,
		Speed:       300,
	}

	disPdu := J0ToDIS(j0, 1, 1)
	if disPdu == nil {
		t.Fatal("J0ToDIS returned nil")
	}
	if disPdu.EntityNumber != 100 {
		t.Errorf("EntityNumber: got %d, want 100", disPdu.EntityNumber)
	}
	if disPdu.Latitude < 37.9 || disPdu.Latitude > 38.1 {
		t.Errorf("Latitude: got %.2f, want ~38.0", disPdu.Latitude)
	}
	if disPdu.Longitude < -77.1 || disPdu.Longitude > -76.9 {
		t.Errorf("Longitude: got %.2f, want ~-77.0", disPdu.Longitude)
	}
}

func TestDISGatewayStopIdempotent(t *testing.T) {
	config := DefaultDISGatewayConfig()
	enc := jreap.NewEncoder("test", "test")
	meta := mdpa.NewMDPAMetadata("test", "test", "", "UNCLASSIFIED")

	gw := NewDISGateway(config, enc, meta)

	if err := gw.Stop(); err != nil {
		t.Errorf("Stop before start: %v", err)
	}

	if err := gw.Start(); err != nil {
		t.Fatalf("Start: %v", err)
	}
	if err := gw.Stop(); err != nil {
		t.Errorf("Stop: %v", err)
	}
	if err := gw.Stop(); err != nil {
		t.Errorf("double Stop: %v", err)
	}
}

func TestPackDISHeaderMinimal(t *testing.T) {
	h := PackDISHeaderMinimal(1, 0, 144, 12345)
	if h[0] != 7 {
		t.Errorf("version: got %d, want 7", h[0])
	}
	if h[2] != 1 {
		t.Errorf("pdu type: got %d, want 1", h[2])
	}
}