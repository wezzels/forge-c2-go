// track-simulator.go - Simple track simulator for FORGE-C2 testing
// Generates J28 Space Track messages and sends to FORGE-C2 JREAP endpoint
package main

import (
	"flag"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net"
	"time"

	"forge-c2/jreap"
	"forge-c2/jreap/jseries"
)

func main() {
	forgeAddr := flag.String("forge", "localhost:5000", "FORGE-C2 JREAP UDP address")
	rate := flag.Duration("rate", time.Second, "Update interval")
	nodeID := flag.String("node", "SIM01", "Node ID")
	appID := flag.String("app", "TRK", "Application ID")
	numTracks := flag.Int("tracks", 5, "Number of tracks to simulate")
	flag.Parse()

	// Create JREAP encoder
	enc := jreap.NewEncoder(*nodeID, *appID)

	// Track state
	tracks := make([]SpaceTrack, *numTracks)
	for i := range tracks {
		tracks[i] = NewSpaceTrack(i)
	}

	log.Printf("[SIM] Starting space track simulator")
	log.Printf("[SIM] Target: %s", *forgeAddr)
	log.Printf("[SIM] Tracks: %d, Rate: %s", *numTracks, *rate)

	// Resolve address
	udpAddr, err := net.ResolveUDPAddr("udp", *forgeAddr)
	if err != nil {
		log.Fatalf("[SIM] Failed to resolve: %v", err)
	}

	conn, err := net.DialUDP("udp", nil, udpAddr)
	if err != nil {
		log.Fatalf("[SIM] Failed to dial: %v", err)
	}
	defer conn.Close()

	ticker := time.NewTicker(*rate)
	defer ticker.Stop()

	msgCount := 0
	for {
		<-ticker.C
		for i := range tracks {
			tracks[i].Update()

			// Create J28 Space Track message
			j28 := tracks[i].ToJ28()

			// Encode as J28
			data, err := enc.EncodeJ28(j28)
			if err != nil {
				log.Printf("[SIM] Encode error: %v", err)
				continue
			}

			// Send
			_, err = conn.Write(data)
			if err != nil {
				log.Printf("[SIM] Send error: %v", err)
				continue
			}

			msgCount++
			if msgCount%100 == 0 {
				log.Printf("[SIM] Sent %d messages", msgCount)
			}
		}
	}
}

// SpaceTrack represents a simulated space object track
type SpaceTrack struct {
	ID             int
	SensorID       string
	LAT            float64 // Geocentric latitude
	LON            float64 // Geocentric longitude
	ALT            float64 // Altitude in km
	VX             float64 // Velocity m/s ECI
	VY             float64
	VZ             float64
	Quality        int // 0-100
	ThreatLevel    uint8 // 1-5
	Status         uint8 // 1=NEW, 2=ACTIVE, 3=UPDATED, 4=DROPPED
	PlatformType   uint8 // 1=SATELLITE, 2=BOOSTER, 3=DEBRIS, 4=MISSILE
	SatID          string
	OrbitalPeriod  float64 // minutes
	Inclination    float64 // degrees
	SemiMajorAxis  float64 // km
	Eccentricity   float64
	RAAN           float64 // Right ascension of ascending node
	ArgPerigee     float64
	TrueAnomaly    float64
	IRIntensity    float64 // Kelvin
	BackgroundTemp float64
	DetectionConf  float64
	SNR            float64
	UpdateCount    int
}

// NewSpaceTrack creates a new space track with orbital elements
func NewSpaceTrack(id int) SpaceTrack {
	// Random orbital elements for LEO/MEO orbit
	inc := 30.0 + rand.Float64()*100       // 30-130 deg inclination
	alt := 400.0 + rand.Float64()*36000.0  // 400-38000 km (LEO to GEO)
	
	// Semi-major axis from altitude (assuming circular for simplicity)
	a := alt + 6371 // Earth radius in km
	
	// Orbital period from semi-major axis (Kepler's 3rd law)
	period := 2 * math.Pi * math.Sqrt(math.Pow(a/1000, 3) / 398600.4) / 60 // minutes
	
	return SpaceTrack{
		ID:             id,
		SensorID:       fmt.Sprintf("SBIRS%02d", id%3+1),
		LAT:            rand.Float64()*180 - 90,
		LON:            rand.Float64()*360 - 180,
		ALT:            alt,
		VX:             -3000 + rand.Float64()*6000,
		VY:             -3000 + rand.Float64()*6000,
		VZ:             -1000 + rand.Float64()*2000,
		Quality:        50 + rand.Intn(50),
		ThreatLevel:    uint8(rand.Intn(5) + 1),
		Status:         1, // NEW
		PlatformType:   uint8(rand.Intn(4) + 1),
		SatID:          fmt.Sprintf("%08d", 40000+id),
		OrbitalPeriod:  period,
		Inclination:    inc,
		SemiMajorAxis:  a,
		Eccentricity:   rand.Float64() * 0.5,
		RAAN:           rand.Float64() * 360,
		ArgPerigee:     rand.Float64() * 360,
		TrueAnomaly:    rand.Float64() * 360,
		IRIntensity:    280 + rand.Float64()*100,
		BackgroundTemp: 3.0 + rand.Float64()*10,
		DetectionConf:  0.7 + rand.Float64()*0.3,
		SNR:            10 + rand.Float64()*20,
		UpdateCount:    0,
	}
}

// Update moves the track along its orbit
func (t *SpaceTrack) Update() {
	// Simple orbital propagation (simplified)
	// In reality would use SGP4/SDP4
	meanMotion := 1440.0 / t.OrbitalPeriod // revolutions per day
	t.TrueAnomaly += meanMotion * 0.01667 // increment per minute (0.1 sec)
	if t.TrueAnomaly > 360 {
		t.TrueAnomaly -= 360
	}
	
	// Update position from true anomaly
	latStep := (t.VX / 1000) * 0.1
	lonStep := (t.VY / 1000) * 0.1
	altStep := (t.VZ / 100) * 0.1
	
	t.LAT += latStep
	t.LON += lonStep
	t.ALT += altStep
	
	// Clamp
	if t.LAT > 90 || t.LAT < -90 {
		t.LAT = rand.Float64()*180 - 90
	}
	if t.LON > 180 || t.LON < -180 {
		t.LON = rand.Float64()*360 - 180
	}
	if t.ALT < 200 {
		t.ALT = 400 + rand.Float64()*1000
	}
	if t.ALT > 40000 {
		t.ALT = 20000 + rand.Float64()*10000
	}
	
	// Vary quality
	t.Quality += rand.Intn(7) - 3
	if t.Quality > 100 {
		t.Quality = 100
	}
	if t.Quality < 0 {
		t.Quality = 0
	}
	
	// Update status
	t.Status = 2 // ACTIVE
	t.UpdateCount++
}

// ToJ28 converts to J28 Space Track message
func (t *SpaceTrack) ToJ28() *jseries.J28SpaceTrack {
	return &jseries.J28SpaceTrack{
		TrackNumber:    uint16(t.ID),
		Time:          time.Now().UTC(),
		Latitude:      t.LAT,
		Longitude:     t.LON,
		Altitude:      t.ALT * 1000, // km to m
		VelocityX:     t.VX,
		VelocityY:     t.VY,
		VelocityZ:     t.VZ,
		SatelliteID:   t.SatID,
		OrbitalPeriod: t.OrbitalPeriod,
		Inclination:   t.Inclination,
		SemiMajorAxis: t.SemiMajorAxis,
		Eccentricity:  t.Eccentricity,
		RightAscension: t.RAAN,
		ArgPerigee:    t.ArgPerigee,
		TrueAnomaly:   t.TrueAnomaly,
		IRIntensity:   t.IRIntensity,
		BackgroundTemp: t.BackgroundTemp,
		DetectionConf: t.DetectionConf,
		SNR:           t.SNR,
		Quality:       jseries.QualityIndicator{Quality: uint8(t.Quality / 25)},
		ThreatLevel:   t.ThreatLevel,
		Status:        t.Status,
		PlatformType:  t.PlatformType,
	}
}
