package jseries

import (
	"time"
)

// J28SpaceTrack represents a J18/J28 Space Track message for satellite and OPIR targets.
// Extends J3 with space-specific fields: orbital elements, satellite ID, OPIR-specific data.
type J28SpaceTrack struct {
	TrackNumber    uint16    // 16 bits
	Time          time.Time // 32 bits: milliseconds since epoch
	Latitude      float64   // degrees (geocentric)
	Longitude     float64   // degrees (geocentric)
	Altitude      float64   // meters (above WGS-84)
	VelocityX     float64   // m/s in Earth-centered inertial frame
	VelocityY     float64   // m/s
	VelocityZ     float64   // m/s
	SatelliteID   string    // NORAD catalog number or SBIRS satellite ID
	OrbitalPeriod float64   // minutes
	Inclination   float64   // degrees
	SemiMajorAxis float64   // km
	Eccentricity  float64   // unitless
	RightAscension float64  // degrees
	ArgPerigee    float64   // degrees
	TrueAnomaly   float64   // degrees
	IRIntensity   float64   // Kelvin (blackbody temperature)
	BackgroundTemp float64  // Kelvin (space background)
	DetectionConf float64   // 0-1 detection confidence
	SNR           float64   // dB
	Quality       QualityIndicator
	ThreatLevel   uint8     // 8 bits: 1-5
	Status        uint8     // 8 bits: 1=NEW, 2=ACTIVE, 3=UPDATED, 4=DROPPED
	PlatformType  uint8     // 8 bits: 1=SATELLITE, 2=BOOSTER, 3=DEBRIS, 4=MISSILE
}

// J28PayloadSize is the packed byte size of a J28 Space Track message.
const J28PayloadSize = 67

// PackJ28SpaceTrack packs a J28 Space Track message into buf.
func PackJ28SpaceTrack(t *J28SpaceTrack, buf []byte) {
	off := 0

	PackUint16(t.TrackNumber, buf, off); off += 2

	ms := PackMilliseconds(t.Time)
	PackUint32(ms, buf, off); off += 4

	latP := PackLatitude(t.Latitude)
	lonP := PackLongitude(t.Longitude)
	PackUint32(latP, buf, off); off += 3
	PackUint32(lonP, buf, off); off += 3

	altP := uint32(t.Altitude)
	PackUint24(altP, buf, off); off += 3

	// Velocity in ECI frame: 3x 24-bit values, 0.1 m/s resolution
	vx := uint32(t.VelocityX * 10)
	vy := uint32(t.VelocityY * 10)
	vz := uint32(t.VelocityZ * 10)
	PackUint24(vx, buf, off); off += 3
	PackUint24(vy, buf, off); off += 3
	PackUint24(vz, buf, off); off += 3

	// Satellite ID: 12 bytes, null-padded
	for i := 0; i < 12; i++ {
		if i < len(t.SatelliteID) {
			buf[off] = t.SatelliteID[i]
		} else {
			buf[off] = 0
		}
		off++
	}

	// Orbital elements: all 16-bit, 0.001 resolution for deg, 0.01 for min/km
	op := uint16(t.OrbitalPeriod * 100)
	PackUint16(op, buf, off); off += 2

	inc := uint16(t.Inclination * 1000)
	PackUint16(inc, buf, off); off += 2

	sma := uint16(t.SemiMajorAxis / 100)
	PackUint16(sma, buf, off); off += 2

	ecc := uint16(t.Eccentricity * 10000)
	PackUint16(ecc, buf, off); off += 2

	ra := uint16(t.RightAscension * 100)
	PackUint16(ra, buf, off); off += 2

	ap := uint16(t.ArgPerigee * 100)
	PackUint16(ap, buf, off); off += 2

	ta := uint16(t.TrueAnomaly * 100)
	PackUint16(ta, buf, off); off += 2

	// IR and background temp: 16-bit Kelvin * 100
	ir := uint16(t.IRIntensity * 100)
	PackUint16(ir, buf, off); off += 2

	bg := uint16(t.BackgroundTemp * 100)
	PackUint16(bg, buf, off); off += 2

	// Detection confidence: 8-bit 0-255
	conf := uint8(t.DetectionConf * 255)
	buf[off] = conf; off++

	// SNR: 8-bit, 0.5 dB resolution
	snr := uint8(t.SNR / 0.5)
	buf[off] = snr; off++

	buf[off] = PackQuality(t.Quality); off++
	buf[off] = t.ThreatLevel; off++
	buf[off] = t.Status; off++
	buf[off] = t.PlatformType
}

// UnpackJ28SpaceTrack unpacks a J28 Space Track message from buf.
func UnpackJ28SpaceTrack(buf []byte) *J28SpaceTrack {
	if len(buf) < J28PayloadSize {
		return nil
	}
	t := &J28SpaceTrack{}
	off := 0

	t.TrackNumber = UnpackUint16(buf, off); off += 2

	ms := UnpackUint32(buf, off); off += 4
	t.Time = UnpackMilliseconds(ms)

	latP := UnpackUint24(buf, off); off += 3
	lonP := UnpackUint24(buf, off); off += 3
	t.Latitude = UnpackLatitude(latP)
	t.Longitude = UnpackLongitude(lonP)

	altP := UnpackUint24(buf, off); off += 3
	t.Altitude = float64(altP)

	vxP := UnpackUint24(buf, off); off += 3
	vyP := UnpackUint24(buf, off); off += 3
	vzP := UnpackUint24(buf, off); off += 3
	t.VelocityX = float64(int24ToInt32(vxP)) / 10.0
	t.VelocityY = float64(int24ToInt32(vyP)) / 10.0
	t.VelocityZ = float64(int24ToInt32(vzP)) / 10.0

	satID := make([]byte, 0, 12)
	for i := 0; i < 12; i++ {
		if buf[off] != 0 {
			satID = append(satID, buf[off])
		}
		off++
	}
	t.SatelliteID = string(satID)

	opP := UnpackUint16(buf, off); off += 2
	t.OrbitalPeriod = float64(opP) / 100.0

	incP := UnpackUint16(buf, off); off += 2
	t.Inclination = float64(incP) / 1000.0

	smaP := UnpackUint16(buf, off); off += 2
	t.SemiMajorAxis = float64(smaP) * 100.0

	eccP := UnpackUint16(buf, off); off += 2
	t.Eccentricity = float64(eccP) / 10000.0

	raP := UnpackUint16(buf, off); off += 2
	t.RightAscension = float64(raP) / 100.0

	apP := UnpackUint16(buf, off); off += 2
	t.ArgPerigee = float64(apP) / 100.0

	taP := UnpackUint16(buf, off); off += 2
	t.TrueAnomaly = float64(taP) / 100.0

	irP := UnpackUint16(buf, off); off += 2
	t.IRIntensity = float64(irP) / 100.0

	bgP := UnpackUint16(buf, off); off += 2
	t.BackgroundTemp = float64(bgP) / 100.0

	t.DetectionConf = float64(buf[off]) / 255.0; off++

	t.SNR = float64(buf[off]) * 0.5; off++

	t.Quality = UnpackQuality(buf[off]); off++
	t.ThreatLevel = buf[off]; off++
	t.Status = buf[off]; off++
	t.PlatformType = buf[off]

	return t
}

// int24ToInt32 converts a 24-bit signed integer to int32.
func int24ToInt32(v uint32) int32 {
	v24 := v & 0xFFFFFF
	if v24 >= 0x800000 {
		return int32(v24) - 0x1000000
	}
	return int32(v24)
}
