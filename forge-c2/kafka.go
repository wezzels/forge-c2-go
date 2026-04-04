package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

// KafkaBroker holds the connection to Kafka
type KafkaBroker struct {
	brokers []string
}

// NewKafkaBroker creates a new Kafka connection
func NewKafkaBroker(brokers []string) *KafkaBroker {
	return &KafkaBroker{brokers: brokers}
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
	Azimuth    float64   `json:"azimuth"`
	Elevation  float64   `json:"elevation"`
	SignalType string    `json:"signal_type"` // IR, RF, SEISMIC, ACOUSTIC
	Intensity  float64   `json:"intensity"`
	Frequency  float64   `json:"frequency"`
	SNR        float64   `json:"snr"`
	Confidence float64   `json:"confidence"`
}

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

func (k *KafkaBroker) ProduceEvent(ctx context.Context, topic string, event interface{}) error {
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
	return writer.WriteMessages(ctx, kafka.Message{Key: []byte("key"), Value: data})
}
