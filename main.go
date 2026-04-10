package main

import (
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"forge-c2/internal"
)

func main() {
	port := flag.String("port", "8080", "HTTP server port")
	kafkaBroker := flag.String("kafka-broker", "kafka-cluster-kafka-bootstrap.gms.svc.cluster.local:9092", "Kafka broker address")
	c2bmcURL := flag.String("c2bmc-url", "grpc://localhost:50051", "C2BMC gRPC endpoint")
	jreapUDPPort := flag.String("jreap-udp-port", "", "JREAP UDP listen port (e.g., :5000)")
	jreapTCPPort := flag.String("jreap-tcp-port", "", "JREAP TCP listen port (e.g., :5001)")
	flag.Parse()

	cfg := &internal.Config{
		Port:        *port,
		KafkaBroker: *kafkaBroker,
		C2BMCURL:   *c2bmcURL,
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

	server, err := internal.NewServer(cfg)
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
