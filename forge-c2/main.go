package main

import (
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"forge-c2/jreap"
)

func main() {
	port := flag.String("port", "8080", "HTTP server port")
	kafkaBroker := flag.String("kafka-broker", "kafka-cluster-kafka-bootstrap.gms.svc.cluster.local:9092", "Kafka broker address")
	c2bmcURL := flag.String("c2bmc-url", "grpc://localhost:50051", "C2BMC gRPC endpoint")
	jreapUDPPort := flag.String("jreap-udp-port", "", "JREAP UDP listen port (e.g., :5000)")
	jreapTCPPort := flag.String("jreap-tcp-port", "", "JREAP TCP listen port (e.g., :5001)")
	flag.Parse()

	cfg := &Config{
		Port:         *port,
		KafkaBroker: *kafkaBroker,
		C2BMCURL:    *c2bmcURL,
		JREAPUDP:    *jreapUDPPort,
		JREAPTCP:    *jreapTCPPort,
	}

	log.Printf("[FORGE-C2] Starting FORGE Command & Control System")
	log.Printf("  Port: %s", cfg.Port)
	log.Printf("  Kafka: %s", cfg.KafkaBroker)
	log.Printf("  C2BMC: %s", cfg.C2BMCURL)
	if cfg.JREAPUDP != "" {
		log.Printf("  JREAP UDP: %s", cfg.JREAPUDP)
	}
	if cfg.JREAPTCP != "" {
		log.Printf("  JREAP TCP: %s", cfg.JREAPTCP)
	}

	server, err := NewServer(cfg)
	if err != nil {
		log.Fatalf("[FORGE-C2] Failed to create server: %v", err)
	}

	// Start JREAP transport if configured
	if cfg.JREAPUDP != "" {
		go server.StartJREAPUDP(cfg.JREAPUDP)
	}
	if cfg.JREAPTCP != "" {
		go server.StartJREAPTCP(cfg.JREAPTCP)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go server.StartKafkaConsumer(ctx)
	go server.StartC2BMC(ctx)
	go server.StartTrackMonitor(ctx)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("[FORGE-C2] Server starting on :%s", cfg.Port)
		server.Run()
		log.Printf("[FORGE-C2] Server stopped")
	}()

	<-sigChan
	log.Printf("[FORGE-C2] Shutting down...")
	cancel()
	time.Sleep(2 * time.Second)
	log.Printf("[FORGE-C2] Done")
}

// StartJREAPUDP starts a JREAP UDP listener.
func (s *Server) StartJREAPUDP(addr string) {
	conn, err := jreap.NewJREAPUDPConn(addr, 8192)
	if err != nil {
		log.Printf("[JREAP-UDP] Failed to start: %v", err)
		return
	}
	defer conn.Close()
	log.Printf("[JREAP-UDP] Listening on %s", addr)

	for {
		msg, _, err := conn.ReadFromWithTimeout(5 * time.Second)
		if err != nil {
			log.Printf("[JREAP-UDP] Read error: %v", err)
			continue
		}
		if msg == nil {
			continue // Timeout, no data
		}
		log.Printf("[JREAP-UDP] Received %d bytes", len(msg))

		// Decode and log
		hdr, _, _, err := jreap.DecodeFull(msg)
		if err != nil {
			log.Printf("[JREAP-UDP] Decode error: %v", err)
			continue
		}
		log.Printf("[JREAP-UDP] Message type: J%d (%s)", hdr.MessageType, jreap.MessageType(hdr.MessageType))
	}
}

// StartJREAPTCP starts a JREAP TCP listener.
func (s *Server) StartJREAPTCP(addr string) {
	listener, err := jreap.NewListener(addr, jreap.ProtocolTCP)
	if err != nil {
		log.Printf("[JREAP-TCP] Failed to start: %v", err)
		return
	}
	defer listener.Close()
	log.Printf("[JREAP-TCP] Listening on %s", addr)

	for {
		conn, err := listener.AcceptWithTimeout(5 * time.Second)
		if err != nil {
			if err == jreap.ErrListenerClosed {
				return
			}
			continue
		}
		go handleTCPConnection(conn)
	}
}

func handleTCPConnection(conn *jreap.JREAPTCPConn) {
	defer conn.Close()
	log.Printf("[JREAP-TCP] Client connected from %s", conn.RemoteAddr())

	for {
		frame, err := conn.ReadFrameWithTimeout(30 * time.Second)
		if err != nil {
			log.Printf("[JREAP-TCP] Read error: %v", err)
			return
		}
		if frame == nil {
			continue
		}

		hdr, _, _, err := jreap.DecodeFull(frame)
		if err != nil {
			log.Printf("[JREAP-TCP] Decode error: %v", err)
			continue
		}
		log.Printf("[JREAP-TCP] Message type: J%d (%s)", hdr.MessageType, jreap.MessageType(hdr.MessageType))
	}
}
