package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// Config holds FORGE-C2 server configuration
type Config struct {
	Port           string
	VIMIBroker     string
	KafkaBroker    string
	C2BMCURL      string
	AllowedOrigins []string
	JREAPUDP       string // JREAP UDP listen address
	JREAPTCP       string // JREAP TCP listen address
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
	clients       map[*websocket.Conn]bool
	clientMu      sync.RWMutex
}

// TrackStore holds track state
type TrackStore struct {
	mu     sync.RWMutex
	tracks map[string]*Track
}

func NewTrackStore() *TrackStore {
	return &TrackStore{tracks: make(map[string]*Track)}
}

func (ts *TrackStore) GetTrack(id string) (*Track, bool) {
	ts.mu.RLock()
	defer ts.mu.RUnlock()
	t, ok := ts.tracks[id]
	return t, ok
}

func (ts *TrackStore) SetTrack(id string, track *Track) {
	ts.mu.Lock()
	defer ts.mu.Unlock()
	ts.tracks[id] = track
}

func (ts *TrackStore) DeleteTrack(id string) {
	ts.mu.Lock()
	defer ts.mu.Unlock()
	delete(ts.tracks, id)
}

func (ts *TrackStore) GetAllTracks() []*Track {
	ts.mu.RLock()
	defer ts.mu.RUnlock()
	tracks := make([]*Track, 0, len(ts.tracks))
	for _, t := range ts.tracks {
		tracks = append(tracks, t)
	}
	return tracks
}

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
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
	s.setupRoutes()
	return s, nil
}

func (s *Server) setupRoutes() {
	s.router.HandleFunc("/health", s.handleHealth).Methods("GET")
	api := s.router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/tracks", s.handleListTracks).Methods("GET")
	api.HandleFunc("/tracks/{id}", s.handleGetTrack).Methods("GET")
	api.HandleFunc("/tracks", s.handleCreateTrack).Methods("POST")
	api.HandleFunc("/alerts", s.handleListAlerts).Methods("GET")
	api.HandleFunc("/status", s.handleStatus).Methods("GET")
	api.HandleFunc("/c2bmc/status", s.handleC2BMCStatus).Methods("GET")
	api.HandleFunc("/c2bmc/engagements", s.handleListEngagements).Methods("GET")
	api.HandleFunc("/correlator/stats", s.handleCorrelatorStats).Methods("GET")
	api.HandleFunc("/inject/sensor", s.handleInjectSensor).Methods("POST")
	s.router.HandleFunc("/ws/c2", s.handleC2WebSocket)
}

func (s *Server) Run() {
	addr := ":" + s.config.Port
	log.Printf("[FORGE-C2] Starting server on %s", addr)
	if err := http.ListenAndServe(addr, s.router); err != nil {
		log.Fatalf("[FORGE-C2] Server error: %v", err)
	}
}

func (s *Server) StartKafkaConsumer(ctx context.Context) {
	log.Printf("[FORGE-C2] Starting Kafka consumer...")
	topics := []string{"vimi.sensors.raw"}
	err := s.kafka.ConsumeTopics(ctx, topics, func(topic string, data []byte) {
		var event SensorEvent
		if err := json.Unmarshal(data, &event); err != nil {
			log.Printf("[Kafka] Unmarshal error: %v", err)
			return
		}
		log.Printf("[Kafka] Sensor event: %s from %s", event.EventID, event.SensorID)
		track, isNew := s.correlator.ProcessEvent(&event)
		s.trackStore.SetTrack(track.TrackID, track)
		s.c2bmc.UpdateTrack(track)
		s.broadcastTrackUpdate(track, isNew)
	})
	if err != nil {
		log.Printf("[FORGE-C2] Kafka consumer error: %v", err)
	}
}

func (s *Server) StartC2BMC(ctx context.Context) {
	log.Printf("[FORGE-C2] Starting C2BMC interface...")
	if err := s.c2bmc.Connect(ctx); err != nil {
		log.Printf("[C2BMC] Connection failed: %v", err)
	}
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			s.c2bmc.Disconnect()
			return
		case <-ticker.C:
			s.c2bmc.SendHeartbeat()
			s.broadcastC2BMCState()
		}
	}
}

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

func (s *Server) broadcastTrackUpdate(track *Track, isNew bool) {
	msg := map[string]interface{}{"type": "track_update", "is_new": isNew, "track": track}
	data, _ := json.Marshal(msg)
	s.clientMu.RLock()
	defer s.clientMu.RUnlock()
	for client := range s.clients {
		if err := client.WriteMessage(websocket.TextMessage, data); err != nil {
			client.Close()
			delete(s.clients, client)
		}
	}
}

func (s *Server) broadcastTrackDropped(trackID string) {
	msg := map[string]interface{}{"type": "track_dropped", "track_id": trackID}
	data, _ := json.Marshal(msg)
	s.clientMu.RLock()
	defer s.clientMu.RUnlock()
	for client := range s.clients {
		client.WriteMessage(websocket.TextMessage, data)
	}
}

func (s *Server) broadcastC2BMCState() {
	state, err := s.c2bmc.ToJSON()
	if err != nil {
		return
	}
	msg := map[string]interface{}{"type": "c2bmc_state", "data": json.RawMessage(state)}
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
		EventID:   "MANUAL-" + time.Now().Format("150405.000"),
		Timestamp: time.Now(),
		SensorID:  "MANUAL",
		SensorType: "MANUAL",
		Latitude:  track.Latitude,
		Longitude: track.Longitude,
		Altitude:  track.Altitude,
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
	json.NewEncoder(w).Encode(map[string]interface{}{"track": track, "is_new": isNew, "consumed": true})
}

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
	state, _ := s.c2bmc.ToJSON()
	conn.WriteJSON(map[string]interface{}{"type": "init", "data": json.RawMessage(state)})
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}
