package internal

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"

	"forge-c2/jreap"
)

// Config holds FORGE-C2 server configuration
type Config struct {
	Port           string
	VIMIBroker     string
	KafkaBroker    string
	C2BMCURL       string
	AllowedOrigins []string
	JREAPUDP       string // JREAP UDP listen address (e.g. ":5000")
	JREAPTCP       string // JREAP TCP listen address (e.g. ":5001")
}

// Server is the main HTTP/WebSocket server
type Server struct {
	config        *Config
	router        *mux.Router
	upgrader      websocket.Upgrader
	trackStore    *TrackStore
	correlator    *TrackCorrelator
	kafka         *KafkaBroker
	c2bmc         *C2BMCInterface
	jreapConsumer *JREAPConsumer
	clients       map[*websocket.Conn]bool
	clientMu      sync.RWMutex
}

// TrackStore holds track state
type TrackStore struct {
	mu     sync.RWMutex
	tracks map[string]*Track
}

// NewTrackStore creates a new track store
func NewTrackStore() *TrackStore {
	return &TrackStore{
		tracks: make(map[string]*Track),
	}
}

// GetTrack returns a track by ID
func (ts *TrackStore) GetTrack(id string) (*Track, bool) {
	ts.mu.RLock()
	defer ts.mu.RUnlock()
	t, ok := ts.tracks[id]
	return t, ok
}

// SetTrack stores a track
func (ts *TrackStore) SetTrack(id string, track *Track) {
	ts.mu.Lock()
	defer ts.mu.Unlock()
	ts.tracks[id] = track
}

// DeleteTrack removes a track
func (ts *TrackStore) DeleteTrack(id string) {
	ts.mu.Lock()
	defer ts.mu.Unlock()
	delete(ts.tracks, id)
}

// GetAllTracks returns all tracks
func (ts *TrackStore) GetAllTracks() []*Track {
	ts.mu.RLock()
	defer ts.mu.RUnlock()
	tracks := make([]*Track, 0, len(ts.tracks))
	for _, t := range ts.tracks {
		tracks = append(tracks, t)
	}
	return tracks
}

// NewServer creates a new FORGE-C2 server
func NewServer(cfg *Config) (*Server, error) {
	s := &Server{
		config:     cfg,
		router:     mux.NewRouter(),
		trackStore: NewTrackStore(),
		correlator: NewTrackCorrelator(),
		kafka:      NewKafkaBroker([]string{cfg.KafkaBroker}),
		c2bmc:      NewC2BMCInterface(cfg.C2BMCURL),
		clients:    make(map[*websocket.Conn]bool),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // TODO: restrict in production
			},
		},
	}
	s.jreapConsumer = NewJREAPConsumer(s.correlator, s.c2bmc, s.trackStore)
	s.setupRoutes()
	return s, nil
}

// setupRoutes registers all HTTP and WebSocket routes
func (s *Server) setupRoutes() {
	// Health check
	s.router.HandleFunc("/health", s.handleHealth).Methods("GET")

	// REST API
	api := s.router.PathPrefix("/api").Subrouter()

	// Track endpoints
	api.HandleFunc("/tracks", s.handleListTracks).Methods("GET")
	api.HandleFunc("/tracks/{id}", s.handleGetTrack).Methods("GET")
	api.HandleFunc("/tracks", s.handleCreateTrack).Methods("POST")

	// Alert endpoints
	api.HandleFunc("/alerts", s.handleListAlerts).Methods("GET")

	// System endpoints
	api.HandleFunc("/status", s.handleStatus).Methods("GET")
	api.HandleFunc("/c2bmc/status", s.handleC2BMCStatus).Methods("GET")
	api.HandleFunc("/c2bmc/engagements", s.handleListEngagements).Methods("GET")
	api.HandleFunc("/correlator/stats", s.handleCorrelatorStats).Methods("GET")

	// WebSocket endpoints
	s.router.HandleFunc("/ws/c2", s.handleC2WebSocket)
	s.router.HandleFunc("/ws/alerts", s.handleAlertsWebSocket)

	// Test endpoint to inject sensor events
	api.HandleFunc("/inject/sensor", s.handleInjectSensor).Methods("POST")
}

// Run starts the HTTP server
func (s *Server) Run() {
	addr := ":" + s.config.Port
	log.Printf("[FORGE-C2] Starting server on %s", addr)
	if err := http.ListenAndServe(addr, s.router); err != nil {
		log.Fatalf("[FORGE-C2] Server error: %v", err)
	}
}

// StartKafkaConsumer starts consuming from Kafka topics
func (s *Server) StartKafkaConsumer(ctx context.Context) {
	log.Printf("[FORGE-C2] Starting Kafka consumer...")

	topics := []string{"vimi.sensors.raw"}

	err := s.kafka.ConsumeTopics(ctx, topics, func(topic string, data []byte) {
		var event SensorEvent
		if err := json.Unmarshal(data, &event); err != nil {
			log.Printf("[Kafka] Unmarshal error: %v", err)
			return
		}

		log.Printf("[Kafka] Received sensor event: %s from %s", event.EventID, event.SensorID)

		// Process through correlator
		track, isNew := s.correlator.ProcessEvent(&event)

		// Update track store
		s.trackStore.SetTrack(track.TrackID, track)

		// Update C2BMC
		s.c2bmc.UpdateTrack(track)

		// Broadcast to WebSocket clients
		s.broadcastTrackUpdate(track, isNew)
	})

	if err != nil {
		log.Printf("[FORGE-C2] Kafka consumer error: %v", err)
	}
}

// StartC2BMC starts the C2BMC interface handler
func (s *Server) StartC2BMC(ctx context.Context) {
	log.Printf("[FORGE-C2] Starting C2BMC interface...")

	// Connect to C2BMC
	if err := s.c2bmc.Connect(ctx); err != nil {
		log.Printf("[C2BMC] Connection failed: %v", err)
	}

	// Heartbeat loop
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			s.c2bmc.Disconnect()
			return
		case <-ticker.C:
			s.c2bmc.SendHeartbeat()
			// Broadcast C2BMC state periodically
			s.broadcastC2BMCState()
		}
	}
}

// StartTrackMonitor periodically drops stale tracks
func (s *Server) StartTrackMonitor(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			dropped := s.correlator.DropStaleTracks()
			for _, id := range dropped {
				s.trackStore.DeleteTrack(id)
				log.Printf("[Correlator] Track dropped: %s", id)
				s.broadcastTrackDropped(id)
			}
		}
	}
}

// broadcastTrackUpdate sends a track update to all WebSocket clients
func (s *Server) broadcastTrackUpdate(track *Track, isNew bool) {
	msg := map[string]interface{}{
		"type":   "track_update",
		"is_new": isNew,
		"track":  track,
	}

	data, _ := json.Marshal(msg)
	s.clientMu.RLock()
	defer s.clientMu.RUnlock()

	for client := range s.clients {
		if err := client.WriteMessage(websocket.TextMessage, data); err != nil {
			log.Printf("[WS] Write error: %v", err)
			client.Close()
			delete(s.clients, client)
		}
	}
}

// broadcastTrackDropped notifies clients of track deletion
func (s *Server) broadcastTrackDropped(trackID string) {
	msg := map[string]interface{}{
		"type":     "track_dropped",
		"track_id": trackID,
	}

	data, _ := json.Marshal(msg)
	s.clientMu.RLock()
	defer s.clientMu.RUnlock()

	for client := range s.clients {
		client.WriteMessage(websocket.TextMessage, data)
	}
}

// broadcastC2BMCState sends C2BMC state to clients
func (s *Server) broadcastC2BMCState() {
	state, err := s.c2bmc.ToJSON()
	if err != nil {
		return
	}

	msg := map[string]interface{}{
		"type": "c2bmc_state",
		"data": json.RawMessage(state),
	}

	data, _ := json.Marshal(msg)
	s.clientMu.RLock()
	defer s.clientMu.RUnlock()

	for client := range s.clients {
		client.WriteMessage(websocket.TextMessage, data)
	}
}

// HTTP Handlers

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (s *Server) handleListTracks(w http.ResponseWriter, r *http.Request) {
	tracks := s.correlator.GetTracks()
	json.NewEncoder(w).Encode(map[string]interface{}{"tracks": tracks, "count": len(tracks)})
}

func (s *Server) handleGetTrack(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	track, ok := s.trackStore.GetTrack(id)
	if !ok {
		http.Error(w, "Track not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(track)
}

func (s *Server) handleCreateTrack(w http.ResponseWriter, r *http.Request) {
	var track Track
	if err := json.NewDecoder(r.Body).Decode(&track); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	s.correlator.ProcessEvent(&SensorEvent{
		EventID:    fmt.Sprintf("MANUAL-%d", time.Now().Unix()),
		Timestamp:  time.Now(),
		SensorID:   "MANUAL",
		SensorType: "MANUAL",
		Latitude:   track.Latitude,
		Longitude:  track.Longitude,
		Altitude:   track.Altitude,
	})

	json.NewEncoder(w).Encode(map[string]string{"status": "created"})
}

func (s *Server) handleListAlerts(w http.ResponseWriter, r *http.Request) {
	alerts := s.c2bmc.GetAlerts()
	json.NewEncoder(w).Encode(map[string]interface{}{"alerts": alerts, "count": len(alerts)})
}

func (s *Server) handleStatus(w http.ResponseWriter, r *http.Request) {
	status := map[string]interface{}{
		"kafka_connected": true,
		"c2bmc_connected": s.c2bmc.IsConnected(),
		"correlator":      s.correlator.GetStats(),
		"tracks":          len(s.trackStore.GetAllTracks()),
	}
	json.NewEncoder(w).Encode(status)
}

func (s *Server) handleC2BMCStatus(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(s.c2bmc.GetBMDSStatus())
}

func (s *Server) handleListEngagements(w http.ResponseWriter, r *http.Request) {
	engagements := s.c2bmc.GetEngagements()
	json.NewEncoder(w).Encode(map[string]interface{}{"engagements": engagements})
}

func (s *Server) handleCorrelatorStats(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(s.correlator.GetStats())
}

func (s *Server) handleInjectSensor(w http.ResponseWriter, r *http.Request) {
	var event SensorEvent
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	event.Timestamp = time.Now()
	track, isNew := s.correlator.ProcessEvent(&event)
	s.trackStore.SetTrack(track.TrackID, track)
	s.c2bmc.UpdateTrack(track)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"track":    track,
		"is_new":   isNew,
		"consumed": true,
	})
}

// WebSocket Handlers

func (s *Server) handleC2WebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[WS] Upgrade error: %v", err)
		return
	}

	s.clientMu.Lock()
	s.clients[conn] = true
	s.clientMu.Unlock()

	log.Printf("[WS] Client connected (total: %d)", len(s.clients))
	defer func() {
		s.clientMu.Lock()
		delete(s.clients, conn)
		s.clientMu.Unlock()
		conn.Close()
	}()

	// Send initial state
	state, _ := s.c2bmc.ToJSON()
	conn.WriteJSON(map[string]interface{}{
		"type": "init",
		"data": json.RawMessage(state),
	})

	// Read loop (keep connection alive)
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

func (s *Server) handleAlertsWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// Send alerts as they come
	for {
		alerts := s.c2bmc.GetAlerts()
		conn.WriteJSON(map[string]interface{}{
			"type":   "alerts",
			"alerts": alerts,
		})
		time.Sleep(5 * time.Second)
	}
}

// StartJREAPUDP starts a JREAP UDP listener and feeds messages into the correlator.
func (s *Server) StartJREAPUDP(addr string) {
	conn, err := jreap.NewJREAPUDPConn(addr, 8192)
	if err != nil {
		log.Printf("[JREAP-UDP] Failed to start: %v", err)
		return
	}
	defer conn.Close()
	log.Printf("[JREAP-UDP] Listening on %s", addr)

	for {
		msg, from, err := conn.ReadFromWithTimeout(5 * time.Second)
		if err != nil {
			if errors.Is(err, jreap.ErrTimeout) || errors.Is(err, jreap.ErrListenerClosed) {
				continue
			}
			log.Printf("[JREAP-UDP] Read error: %v", err)
			continue
		}
		if msg == nil {
			continue
		}

		log.Printf("[JREAP-UDP] Received %d bytes from %s", len(msg), from)
		if err := s.jreapConsumer.ProcessMessage(msg); err != nil {
			log.Printf("[JREAP-UDP] Process error: %v", err)
		}
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
		go s.handleTCPConnection(conn)
	}
}

func (s *Server) handleTCPConnection(conn *jreap.JREAPTCPConn) {
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

		if err := s.jreapConsumer.ProcessMessage(frame); err != nil {
			log.Printf("[JREAP-TCP] Process error: %v", err)
		}
	}
}
