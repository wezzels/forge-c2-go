package jseries

import (
	"time"
)

// J18 subtypes
const (
	J18SubtypeSpaceTrack       uint8 = 0 // General space track
	J18SubtypeSatelliteBasic  uint8 = 1 // Basic satellite position
	J18SubtypeDecayed         uint8 = 2 // Decayed/reentered object
	J18SubtypeBallistic       uint8 = 3 // Ballistic track
)

// J18SpaceTrack represents a J18 Space Track message (MIL-STD-6016).
// Used for tracking space objects — satellites, debris, ballistic missiles.
// J28 is the extended OPIR variant; J18 is the general space track format.
type J18SpaceTrack struct {
	TrackNumber      uint16    // 16 bits: track number
	Subtype         uint8     // 8 bits: J18 subtype
	ObjectID        string    // up to 12 bytes: space object catalog ID (e.g. "1998-054A")
	Latitude        float64   // degrees
	Longitude       float64   // degrees
	Altitude        float64   // meters WGS-84
	VelocityX       float64   // m/s in Earth-centered inertial X
	VelocityY       float64   // m/s in Earth-centered inertial Y
	VelocityZ       float64   // m/s in Earth-centered inertial Z
	Speed           float64   // m/s total velocity
	CourseOverGround float64  // degrees: orbital course
	RadialVelocity  float64   // m/s (positive = approaching)
	OrbitalPeriod   float64   // minutes
	Apogee          float64   // km
	Perigee         float64   // km
	Inclination     float64   // degrees
	SemiMajorAxis   float64   // km
	Eccentricity    float64   // dimensionless
	MeanAnomaly     float64   // degrees
	Time            time.Time
}

// J18PayloadSize is the packed byte size of a J18 Space Track message.
const J18PayloadSize = 60

// PackJ18SpaceTrack packs a J18 Space Track message into buf.
func PackJ18SpaceTrack(j18 *J18SpaceTrack, buf []byte) {
	off := 0

	PackUint16(j18.TrackNumber, buf, off); off += 2
	buf[off] = j18.Subtype; off++

	// Object ID: 12 bytes, null-padded
	for i := 0; i < 12; i++ {
		if i < len(j18.ObjectID) {
			buf[off+i] = j18.ObjectID[i]
		} else {
			buf[off+i] = 0
		}
	}
	off += 12

	latP := PackLatitudePacked(j18.Latitude)
	lonP := PackLongitudePacked(j18.Longitude)
	PackUint24(latP, buf, off); off += 3
	PackUint24(lonP, buf, off); off += 3

	altP := uint32(j18.Altitude / 10)
	PackUint24(altP, buf, off); off += 3

	// Velocity XYZ: 16 bits each, 0.1 m/s resolution, offset -3276.8 m/s
	vx := int16((j18.VelocityX + 3276.8) * 10)
	vy := int16((j18.VelocityY + 3276.8) * 10)
	vz := int16((j18.VelocityZ + 3276.8) * 10)
	PackInt16(vx, buf, off); off += 2
	PackInt16(vy, buf, off); off += 2
	PackInt16(vz, buf, off); off += 2

	spdP := uint16(j18.Speed * 10)
	PackUint16(spdP, buf, off); off += 2

	cogP := uint16(j18.CourseOverGround / 0.0057)
	PackUint16(cogP, buf, off); off += 2

	rvP := int16(j18.RadialVelocity * 10)
	PackInt16(rvP, buf, off); off += 2

	// Orbital elements
	opP := uint16(j18.OrbitalPeriod * 10)
	PackUint16(opP, buf, off); off += 2

	apP := uint16(j18.Apogee / 10)
	PackUint16(apP, buf, off); off += 2

	peP := uint16(j18.Perigee / 10)
	PackUint16(peP, buf, off); off += 2

	incP := uint16(j18.Inclination * 10)
	PackUint16(incP, buf, off); off += 2

	smaP := uint16(j18.SemiMajorAxis / 10)
	PackUint16(smaP, buf, off); off += 2

	eccP := uint16(j18.Eccentricity * 10000)
	PackUint16(eccP, buf, off); off += 2

	maP := uint16(j18.MeanAnomaly * 10)
	PackUint16(maP, buf, off); off += 2

	ms := PackMilliseconds(j18.Time)
	PackUint32(ms, buf, off)
}

// UnpackJ18SpaceTrack unpacks a J18 Space Track message from buf.
func UnpackJ18SpaceTrack(buf []byte) *J18SpaceTrack {
	if len(buf) < J18PayloadSize {
		return nil
	}
	j18 := &J18SpaceTrack{}
	off := 0

	j18.TrackNumber = UnpackUint16(buf, off); off += 2
	j18.Subtype = buf[off]; off++

	objID := make([]byte, 0, 12)
	for i := 0; i < 12; i++ {
		if buf[off+i] != 0 {
			objID = append(objID, buf[off+i])
		}
	}
	j18.ObjectID = string(objID)
	off += 12

	latP := UnpackUint24(buf, off); off += 3
	lonP := UnpackUint24(buf, off); off += 3
	j18.Latitude = UnpackLatitudePacked(latP)
	j18.Longitude = UnpackLongitudePacked(lonP)

	altP := UnpackUint24(buf, off); off += 3
	j18.Altitude = float64(altP) * 10

	vx := UnpackInt16(buf, off); off += 2
	vy := UnpackInt16(buf, off); off += 2
	vz := UnpackInt16(buf, off); off += 2
	j18.VelocityX = float64(vx)/10.0 - 3276.8
	j18.VelocityY = float64(vy)/10.0 - 3276.8
	j18.VelocityZ = float64(vz)/10.0 - 3276.8

	spdP := UnpackUint16(buf, off); off += 2
	j18.Speed = float64(spdP) / 10.0

	cogP := UnpackUint16(buf, off); off += 2
	j18.CourseOverGround = float64(cogP) * 0.0057

	rvP := UnpackInt16(buf, off); off += 2
	j18.RadialVelocity = float64(rvP) / 10.0

	opP := UnpackUint16(buf, off); off += 2
	j18.OrbitalPeriod = float64(opP) / 10.0

	apP := UnpackUint16(buf, off); off += 2
	j18.Apogee = float64(apP) * 10

	peP := UnpackUint16(buf, off); off += 2
	j18.Perigee = float64(peP) * 10

	incP := UnpackUint16(buf, off); off += 2
	j18.Inclination = float64(incP) / 10.0

	smaP := UnpackUint16(buf, off); off += 2
	j18.SemiMajorAxis = float64(smaP) * 10

	eccP := UnpackUint16(buf, off); off += 2
	j18.Eccentricity = float64(eccP) / 10000.0

	maP := UnpackUint16(buf, off); off += 2
	j18.MeanAnomaly = float64(maP) / 10.0

	ms := UnpackUint32(buf, off)
	j18.Time = UnpackMilliseconds(ms)

	return j18
}
