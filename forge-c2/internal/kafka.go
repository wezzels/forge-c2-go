package internal

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/segmentio/kafka-go"

	"forge-c2/jreap"
)

// KafkaBroker holds the connection to Kafka
type KafkaBroker struct {
	brokers []string
	writer  *kafka.Writer
	jreapEncoder *jreap.Encoder
}

// NewKafkaBroker creates a new Kafka connection
func NewKafkaBroker(brokers []string) *KafkaBroker {
	return &KafkaBroker{
		brokers: brokers,
		jreapEncoder: jreap.NewEncoder("FORGE-NODE-0001", "KAFKA-INGEST"),
	}
}

// SensorEvent represents raw sensor data
type SensorEvent struct {
	EventID    string    `json:"event_id"`
	Timestamp  time.Time `json:"timestamp"`
	SensorID   string    `json:"sensor_id"`
	SensorType string    `json:"sensor_type"` // OPIR, RADAR, SEISMIC, ACOUSTIC
	Latitude   float64   `json:"latitude"`
	Longitude  float64   `json:"longitude"`
	Altitude   float64   `json:"altitude"` // meters
	Azimuth    float64   `json:"azimuth"` // degrees
	Elevation  float64   `json:"elevation"`
	SignalType string    `json:"signal_type"` // IR, RF, SEISMIC, ACOUSTIC
	Intensity  float64   `json:"intensity"`   // dB or magnitude
	Frequency  float64   `json:"frequency"`   // Hz for RF
	SNR        float64   `json:"snr"`         // signal-to-noise ratio
	Confidence float64   `json:"confidence"`   // 0-1
}

// Track represents a correlated track
type Track struct {
	TrackID       string     `json:"track_id"`
	TrackNumber   uint16     `json:"track_number"`
	Status        string     `json:"status"` // NEW, ACTIVE, UPDATED, DROPPED
	Latitude      float64    `json:"latitude"`   // degrees
	Longitude     float64    `json:"longitude"`  // degrees
	Altitude      float64    `json:"altitude"`    // meters
	Speed         float64    `json:"speed"`       // m/s
	Heading       float64    `json:"heading"`     // degrees
	ThreatLevel   int        `json:"threat_level"` // 1-5
	TrackSource   string     `json:"track_source"` // OPIR, RADAR, FUSED
	PlatformType  string     `json:"platform_type"`
	ForceType     string     `json:"force_type"` // FRIEND, HOSTILE, NEUTRAL, UNKNOWN
	LastUpdate    time.Time  `json:"last_update"`
	Associations  []string   `json:"associations"` // sensor IDs
	Trajectory    []Position `json:"trajectory"`    // recent positions
}

// Position for trajectory history
type Position struct {
	Timestamp time.Time `json:"timestamp"`
	Lat       float64   `json:"lat"`
	Lon       float64   `json:"lon"`
	Alt       float64   `json:"alt"`
}

// ProduceSensorEvent writes a sensor event to Kafka
func (k *KafkaBroker) ProduceSensorEvent(ctx context.Context, topic string, event *SensorEvent) error {
	writer := &kafka.Writer{
		Addr:         kafka.TCP(k.brokers...),
		Topic:        topic,
		Balancer:     &kafka.LeastBytes{},
		BatchTimeout: 10 * time.Millisecond,
	}
	defer writer.Close()

	data, err := json.Marshal(event)
	if err != nil {
		return err
	}

	return writer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(event.EventID),
		Value: data,
	})
}

// ConsumeTopics creates consumers for multiple topics
func (k *KafkaBroker) ConsumeTopics(ctx context.Context, topics []string, handler func(topic string, event []byte)) error {
	for _, topic := range topics {
		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers:        k.brokers,
			Topic:          topic,
			GroupID:        "forge-c2-" + topic,
			MinBytes:       10e3,
			MaxBytes:       10e6,
			CommitInterval: time.Second,
			StartOffset:    kafka.LastOffset,
		})

		go func(t string, r *kafka.Reader) {
			defer r.Close()
			for {
				select {
				case <-ctx.Done():
					return
				default:
					msg, err := r.ReadMessage(ctx)
					if err != nil {
						if ctx.Err() != nil {
							return
						}
						log.Printf("[Kafka] Read error on %s: %v", t, err)
						continue
					}
					handler(t, msg.Value)
				}
			}
		}(topic, reader)
	}
	return nil
}

// ProduceTrack writes a track to Kafka
func (k *KafkaBroker) ProduceTrack(ctx context.Context, topic string, track *Track) error {
	writer := &kafka.Writer{
		Addr:         kafka.TCP(k.brokers...),
		Topic:        topic,
		Balancer:     &kafka.LeastBytes{},
		BatchTimeout: 10 * time.Millisecond,
	}
	defer writer.Close()

	data, err := json.Marshal(track)
	if err != nil {
		return err
	}

	return writer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(track.TrackID),
		Value: data,
	})
}

// JREAPOutput encodes a SensorEvent as JREAP and returns the bytes.
// This is used for JREAP-C output when Kafka is not available or as
// a parallel output path for external JREAP consumers.
func (k *KafkaBroker) JREAPOutput(event *SensorEvent) ([]byte, error) {
	return k.jreapEncoder.EncodeSensorEvent(event)
}

// JREAPTrackOutput encodes a Track as JREAP J3.0 and returns the bytes.
func (k *KafkaBroker) JREAPTrackOutput(track *Track) ([]byte, error) {
	return k.jreapEncoder.EncodeTrack(track)
}

// --- SensorEvent getters for jreap.SensorEventLike ---
func (e *SensorEvent) GetEventID() string    { return e.EventID }
func (e *SensorEvent) GetTimestamp() time.Time { return e.Timestamp }
func (e *SensorEvent) GetSensorID() string   { return e.SensorID }
func (e *SensorEvent) GetLatitude() float64  { return e.Latitude }
func (e *SensorEvent) GetLongitude() float64 { return e.Longitude }
func (e *SensorEvent) GetAltitude() float64  { return e.Altitude }
func (e *SensorEvent) GetIntensity() float64 { return e.Intensity }

// --- Track getters for jreap.TrackLike ---
func (t *Track) GetTrackID() string     { return t.TrackID }
func (t *Track) GetTrackNumber() uint16 { return t.TrackNumber }
func (t *Track) GetLatitude() float64   { return t.Latitude }
func (t *Track) GetLongitude() float64  { return t.Longitude }
func (t *Track) GetAltitude() float64   { return t.Altitude }
func (t *Track) GetSpeed() float64      { return t.Speed }
func (t *Track) GetHeading() float64    { return t.Heading }
func (t *Track) GetThreatLevel() int    { return t.ThreatLevel }
func (t *Track) GetStatus() string       { return t.Status }
func (t *Track) GetLastUpdate() time.Time { return t.LastUpdate }
func (t *Track) GetAssociations() []string { return t.Associations }
