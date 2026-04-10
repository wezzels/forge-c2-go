// Package mdpa implements MDPAF (Metadata Framework) compliance for FORGE-C2.
// MDPAF provides end-to-end metadata tracking for Link 16 network operations.
package mdpa

import (
	"encoding/binary"
	"fmt"
	"strings"
	"unsafe"
	"time"
)

// MDPAF Version
const (
	MDPAFVersion   = "MDPAF-2022"
	MDPAFNamespace = "forge-c2.jreap"
)

// Classification Levels
const (
	ClassificationUnclassified = 0
	ClassificationConfidential = 1
	ClassificationSecret      = 2
	ClassificationTopSecret   = 3
)

// Track Metadata Status
const (
	TrackStatusTentative    = 0
	TrackStatusConfirmed    = 1
	TrackStatusNonReal     = 2
	TrackStatusDeleted     = 3
)

// Data Integrity Levels
const (
	IntegrityLow    = 0
	IntegrityMedium = 1
	IntegrityHigh   = 2
	IntegrityVeryHigh = 3
)

// MDPAFHeader is the MDPAF metadata header.
type MDPAFHeader struct {
	Version         uint8
	Namespace       [32]byte
	CorrelationID   uint64
	Timestamp       time.Time
	Classification  uint8
	Integrity      uint8
}

// MDPAFHeaderSize is the packed size.
const MDPAFHeaderSize = 54

// PackMDPAFHeader packs the MDPAF header.
func PackMDPAFHeader(h *MDPAFHeader, buf []byte) {
	off := 0
	buf[off] = h.Version
	off++

	copy(buf[off:], h.Namespace[:])
	off += 32

	binary.LittleEndian.PutUint64(buf[off:], h.CorrelationID)
	off += 8

	ms := uint64(h.Timestamp.UnixMilli())
	binary.LittleEndian.PutUint64(buf[off:], ms)
	off += 8

	buf[off] = h.Classification
	off++
	buf[off] = h.Integrity
	off++
}

// UnpackMDPAFHeader unpacks the MDPAF header.
func UnpackMDPAFHeader(buf []byte) *MDPAFHeader {
	if len(buf) < MDPAFHeaderSize {
		return nil
	}
	h := &MDPAFHeader{}
	off := 0

	h.Version = buf[off]
	off++

	copy(h.Namespace[:], buf[off:])
	off += 32

	h.CorrelationID = binary.LittleEndian.Uint64(buf[off:])
	off += 8

	ms := binary.LittleEndian.Uint64(buf[off:])
	h.Timestamp = time.UnixMilli(int64(ms))
	off += 8

	h.Classification = buf[off]
	off++
	h.Integrity = buf[off]
	off++

	return h
}

// MDPAFTrackMetadata contains end-to-end track metadata.
type MDPAFTrackMetadata struct {
	Header MDPAFHeader

	// Track Identification
	TrackNumber      uint16
	MDPAFTrackID     string  // Unique MDPAF identifier
	Suffix           string  // Track name/label
	SensorID         string  // Originating sensor

	// Temporal Metadata
	CreateTime       time.Time
	UpdateTime       time.Time
	ReportAge        uint16  // seconds since last report

	// Source Information
	SourceSystem     string  // System that created this track
	SourceUnit       string  // Unit/platform identifier
	PlatformType     uint8   // Platform category
	CountryCode      uint16  // Country of origin

	// Quality Metrics
	TrackAccuracy    float64 // meters
	TrackConfidence  float64 // 0-100%
	CorrelationScore float64 // Association quality

	// Track Status
	Status          uint8   // Tentative/Confirmed/etc
	Priority        uint8   // 0-15 track priority
	JammingFlag     bool    // Jamming detected
	FusionFlag      bool    // Multi-sensor fusion applied

	// Geolocation
	Latitude         float64
	Longitude        float64
	Altitude         float64

	// Motion
	Heading          float64 // degrees
	Speed            float64 // m/s
	VerticalVelocity float64 // m/s

	// Engagement Reference
	EngagementID     uint32  // Associated engagement order

	// Free Text
	FreeText         string  // Operator notes
}

// MDPAFTrackMetadataSize is the packed size estimate.
const MDPAFTrackMetadataSize = 256

// PackMDPAFTrackMetadata packs track metadata.
func PackMDPAFTrackMetadata(m *MDPAFTrackMetadata, buf []byte) int {
	off := 0

	// Header
	PackMDPAFHeader(&m.Header, buf[off:])
	off += MDPAFHeaderSize

	// Track Number (2)
	binary.LittleEndian.PutUint16(buf[off:], m.TrackNumber)
	off += 2

	// MDPAFTrackID (32 bytes max)
	idBytes := []byte(m.MDPAFTrackID)
	buf[off] = byte(len(idBytes))
	off++
	copy(buf[off:], idBytes)
	off += 32

	// Suffix (16 bytes max)
	suffixBytes := []byte(m.Suffix)
	buf[off] = byte(len(suffixBytes))
	off++
	copy(buf[off:], suffixBytes)
	off += 16

	// SensorID (16 bytes max)
	sensorBytes := []byte(m.SensorID)
	buf[off] = byte(len(sensorBytes))
	off++
	copy(buf[off:], sensorBytes)
	off += 16

	// CreateTime (8)
	ms := uint64(m.CreateTime.UnixMilli())
	binary.LittleEndian.PutUint64(buf[off:], ms)
	off += 8

	// UpdateTime (8)
	ms = uint64(m.UpdateTime.UnixMilli())
	binary.LittleEndian.PutUint64(buf[off:], ms)
	off += 8

	// ReportAge (2)
	binary.LittleEndian.PutUint16(buf[off:], m.ReportAge)
	off += 2

	// SourceSystem (24 bytes max)
	srcBytes := []byte(m.SourceSystem)
	buf[off] = byte(len(srcBytes))
	off++
	copy(buf[off:], srcBytes)
	off += 24

	// SourceUnit (24 bytes max)
	unitBytes := []byte(m.SourceUnit)
	buf[off] = byte(len(unitBytes))
	off++
	copy(buf[off:], unitBytes)
	off += 24

	// PlatformType (1)
	buf[off] = m.PlatformType
	off++

	// CountryCode (2)
	binary.LittleEndian.PutUint16(buf[off:], m.CountryCode)
	off += 2

	// Quality Metrics (8 + 8 + 8 = 24)
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.TrackAccuracy))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.TrackConfidence))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.CorrelationScore))
	off += 8

	// Status flags (1)
	statusByte := m.Status & 0x03
	if m.JammingFlag {
		statusByte |= 0x04
	}
	if m.FusionFlag {
		statusByte |= 0x08
	}
	buf[off] = statusByte
	off++

	// Priority (1)
	buf[off] = m.Priority
	off++

	// Location (8 + 8 + 8 = 24)
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.Latitude))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.Longitude))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.Altitude))
	off += 8

	// Motion (8 + 8 + 8 = 24)
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.Heading))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.Speed))
	off += 8
	binary.LittleEndian.PutUint64(buf[off:], floatToBits(m.VerticalVelocity))
	off += 8

	// EngagementID (4)
	binary.LittleEndian.PutUint32(buf[off:], m.EngagementID)
	off += 4

	return off
}

// UnpackMDPAFTrackMetadata unpacks track metadata.
func UnpackMDPAFTrackMetadata(buf []byte) *MDPAFTrackMetadata {
	if len(buf) < MDPAFHeaderSize+100 {
		return nil
	}
	m := &MDPAFTrackMetadata{}
	off := 0

	// Header
	m.Header = *UnpackMDPAFHeader(buf[off:])
	off += MDPAFHeaderSize

	// Track Number
	m.TrackNumber = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// MDPAFTrackID
	idLen := int(buf[off])
	off++
	m.MDPAFTrackID = string(buf[off : off+idLen])
	off += 32

	// Suffix
	suffixLen := int(buf[off])
	off++
	m.Suffix = string(buf[off : off+suffixLen])
	off += 16

	// SensorID
	sensorLen := int(buf[off])
	off++
	m.SensorID = string(buf[off : off+sensorLen])
	off += 16

	// CreateTime
	ms := binary.LittleEndian.Uint64(buf[off:])
	m.CreateTime = time.UnixMilli(int64(ms))
	off += 8

	// UpdateTime
	ms = binary.LittleEndian.Uint64(buf[off:])
	m.UpdateTime = time.UnixMilli(int64(ms))
	off += 8

	// ReportAge
	m.ReportAge = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// SourceSystem
	srcLen := int(buf[off])
	off++
	m.SourceSystem = string(buf[off : off+srcLen])
	off += 24

	// SourceUnit
	unitLen := int(buf[off])
	off++
	m.SourceUnit = string(buf[off : off+unitLen])
	off += 24

	// PlatformType
	m.PlatformType = buf[off]
	off++

	// CountryCode
	m.CountryCode = binary.LittleEndian.Uint16(buf[off:])
	off += 2

	// Quality Metrics
	m.TrackAccuracy = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	m.TrackConfidence = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	m.CorrelationScore = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8

	// Status flags
	statusByte := buf[off]
	m.Status = statusByte & 0x03
	m.JammingFlag = (statusByte & 0x04) != 0
	m.FusionFlag = (statusByte & 0x08) != 0
	off++

	// Priority
	m.Priority = buf[off]
	off++

	// Location
	m.Latitude = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	m.Longitude = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	m.Altitude = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8

	// Motion
	m.Heading = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	m.Speed = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8
	m.VerticalVelocity = bitsToFloat(binary.LittleEndian.Uint64(buf[off:]))
	off += 8

	// EngagementID
	m.EngagementID = binary.LittleEndian.Uint32(buf[off:])
	off += 4

	return m
}

// NewMDPAFTrackMetadata creates a new MDPAF track metadata record.
func NewMDPAFTrackMetadata(trackNumber uint16, correlationID uint64) *MDPAFTrackMetadata {
	now := time.Now()
	ns := [32]byte{}
	copy(ns[:], MDPAFNamespace)

	return &MDPAFTrackMetadata{
		Header: MDPAFHeader{
			Version:        1,
			Namespace:      ns,
			CorrelationID:  correlationID,
			Timestamp:      now,
			Classification: ClassificationUnclassified,
			Integrity:      IntegrityMedium,
		},
		TrackNumber:    trackNumber,
		MDPAFTrackID:   fmt.Sprintf("MDPAF-%d-%d", trackNumber, correlationID),
		CreateTime:     now,
		UpdateTime:     now,
		Status:         TrackStatusTentative,
		Priority:       8,
		TrackConfidence: 50.0,
	}
}

// SetLocation sets the track location.
func (m *MDPAFTrackMetadata) SetLocation(lat, lon, alt float64) {
	m.Latitude = lat
	m.Longitude = lon
	m.Altitude = alt
}

// SetMotion sets the track motion parameters.
func (m *MDPAFTrackMetadata) SetMotion(heading, speed, verticalVelocity float64) {
	m.Heading = heading
	m.Speed = speed
	m.VerticalVelocity = verticalVelocity
}

// SetQuality sets the track quality metrics.
func (m *MDPAFTrackMetadata) SetQuality(accuracy, confidence, correlationScore float64) {
	m.TrackAccuracy = accuracy
	m.TrackConfidence = confidence
	m.CorrelationScore = correlationScore
}

// Confirm marks the track as confirmed.
func (m *MDPAFTrackMetadata) Confirm() {
	m.Status = TrackStatusConfirmed
}

// SetJamming sets the jamming flag.
func (m *MDPAFTrackMetadata) SetJamming(jamming bool) {
	m.JammingFlag = jamming
}

// SetFusion sets the fusion applied flag.
func (m *MDPAFTrackMetadata) SetFusion(fusion bool) {
	m.FusionFlag = fusion
}

// String implements fmt.Stringer.
func (m *MDPAFTrackMetadata) String() string {
	labels := []string{"Unclassified", "Confidential", "Secret", "Top Secret"}
	classLabel := "Unknown"
	if int(m.Header.Classification) < len(labels) {
		classLabel = labels[m.Header.Classification]
	}
	return fmt.Sprintf("MDPAF[%s Track#%d %s @ (%.4f, %.4f) hdg=%.1f spd=%.1f]",
		classLabel, m.TrackNumber, m.MDPAFTrackID, m.Latitude, m.Longitude, m.Heading, m.Speed)
}

// Helper functions for float conversion
func floatToBits(f float64) uint64 {
	return binary.LittleEndian.Uint64((*[8]byte)(unsafe.Pointer(&f))[:])
}

func bitsToFloat(bits uint64) float64 {
	var f float64
	binary.LittleEndian.PutUint64((*[8]byte)(unsafe.Pointer(&f))[:], bits)
	return f
}

var _ = strings.TrimSpace
