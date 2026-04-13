package dis

import (
	"encoding/binary"
	"math"
)

// =============================================================================
// Phase 2.4.8: World Coordinate System Mapping
// =============================================================================

// WGS84 is the standard World Geodetic System 1984 coordinate system
var WGS84 = &GeoDatum{
	Name:             "WGS84",
	SemiMajorAxis:    6378137.0,
	InverseFlattening: 298.257223563,
}

// GeoDatum represents a geodetic datum
type GeoDatum struct {
	Name              string
	SemiMajorAxis     float64
	InverseFlattening float64
}

// EarthRadiusWGS84 is the mean Earth radius in meters
const EarthRadiusWGS84 = 6371000.0

// ConvertECEFToLLA converts Earth-Centered Earth-Fixed to Latitude/Longitude/Altitude
// using the WGS84 ellipsoid. This is a direct geodesic conversion.
func ConvertECEFToLLA(x, y, z float64) (lat, lon, alt float64) {
	a := WGS84.SemiMajorAxis
	f := 1.0 / WGS84.InverseFlattening
	e2 := 2*f - f*f // First eccentricity squared

	lon = math.Atan2(y, x)
	p := math.Sqrt(x*x + y*y)

	// Bowring's iterative method for latitude
	lat = math.Atan2(z, p*(1-e2)) // Initial estimate
	for i := 0; i < 5; i++ {
		N := a / math.Sqrt(1-e2*math.Sin(lat)*math.Sin(lat))
		alt = p/math.Cos(lat) - N
		lat = math.Atan2(z+e2*N*math.Sin(lat), p)
	}

	return lat * 180.0 / math.Pi, lon * 180.0 / math.Pi, alt
}

// ConvertLLAToECEF converts Latitude/Longitude/Altitude to Earth-Centered Earth-Fixed
// using the WGS84 ellipsoid
func ConvertLLAToECEF(lat, lon, alt float64) (x, y, z float64) {
	latRad := lat * math.Pi / 180.0
	lonRad := lon * math.Pi / 180.0

	a := WGS84.SemiMajorAxis
	f := 1.0 / WGS84.InverseFlattening
	e2 := 2*f - f*f

	N := a / math.Sqrt(1-e2*math.Sin(latRad)*math.Sin(latRad))

	x = (N + alt) * math.Cos(latRad) * math.Cos(lonRad)
	y = (N + alt) * math.Cos(latRad) * math.Sin(lonRad)
	z = (N*(1-e2) + alt) * math.Sin(latRad)

	return x, y, z
}

// =============================================================================
// Phase 2.4.9: Entity Orientation (Roll, Pitch, Yaw) Encoding
// =============================================================================

// EulerFromQuaternion converts quaternion to Euler angles (roll, pitch, yaw)
func EulerFromQuaternion(qx, qy, qz, qw float32) (roll, pitch, yaw float32) {
	// Roll (X axis rotation)
	sinr_cosp := 2*(qw*qx+qy*qz)
	cosr_cosp := 1 - 2*(qx*qx+qy*qy)
	roll = float32(math.Atan2(float64(sinr_cosp), float64(cosr_cosp)))

	// Pitch (Y axis rotation) - use standardized formula
	sinp := 2 * (qw*qy - qz*qx)
	if math.Abs(float64(sinp)) >= 1 {
		pitch = math.Pi / 2 * float32(math.Copysign(1, float64(sinp)))
	} else {
		pitch = float32(math.Asin(float64(sinp)))
	}

	// Yaw (Z axis rotation)
	siny_cosp := 2*(qw*qz+qx*qy)
	cosy_cosp := 1 - 2*(qy*qy+qz*qz)
	yaw = float32(math.Atan2(float64(siny_cosp), float64(cosy_cosp)))

	return roll, pitch, yaw
}

// QuaternionFromEuler converts Euler angles to quaternion
func QuaternionFromEuler(roll, pitch, yaw float32) (qx, qy, qz, qw float32) {
	cr := math.Cos(float64(roll) / 2)
	sr := math.Sin(float64(roll) / 2)
	cp := math.Cos(float64(pitch) / 2)
	sp := math.Sin(float64(pitch) / 2)
	cy := math.Cos(float64(yaw) / 2)
	sy := math.Sin(float64(yaw) / 2)

	qw = float32(cr*cp*cy + sr*sp*sy)
	qx = float32(sr*cp*cy - cr*sp*sy)
	qy = float32(cr*sp*cy + sr*cp*sy)
	qz = float32(cr*cp*sy - sr*sp*cy)

	return qx, qy, qz, qw
}

// Orientation represents entity orientation in Euler angles
type Orientation struct {
	Roll  float32 // Rotation about X axis (radians)
	Pitch float32 // Rotation about Y axis (radians)
	Yaw   float32 // Rotation about Z axis (radians)
}

// PackOrientation packs orientation into 12 bytes
func PackOrientation(o Orientation, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(o.Roll))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(o.Pitch))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(o.Yaw))
	off += 4
	return off
}

// UnpackOrientation unpacks orientation from 12 bytes
func UnpackOrientation(buf []byte) Orientation {
	return Orientation{
		Roll:  Float32FromBits(binary.LittleEndian.Uint32(buf[0:])),
		Pitch: Float32FromBits(binary.LittleEndian.Uint32(buf[4:])),
		Yaw:   Float32FromBits(binary.LittleEndian.Uint32(buf[8:])),
	}
}

// =============================================================================
// Phase 2.4.10: Velocity Representation (Body vs World Coordinates)
// =============================================================================

// Velocity represents a 3D velocity vector
type Velocity struct {
	X float32 // m/s
	Y float32 // m/s
	Z float32 // m/s
}

// Speed returns the magnitude of velocity (m/s)
func (v Velocity) Speed() float32 {
	return float32(math.Sqrt(float64(v.X*v.X + v.Y*v.Y + v.Z*v.Z)))
}

// ToWorldCoordinates converts body-relative velocity to world coordinates
func (v Velocity) ToWorldCoordinates(heading, pitch float32) Velocity {
	ch := float32(math.Cos(float64(heading)))
	sh := float32(math.Sin(float64(heading)))
	cp := float32(math.Cos(float64(pitch)))
	sp := float32(math.Sin(float64(pitch)))

	return Velocity{
		X: v.X*ch*cp - v.Y*sh - v.Z*sp*ch,
		Y: v.X*sh*cp + v.Y*ch - v.Z*sh*sp,
		Z: v.X*sp + v.Z*cp,
	}
}

// ToBodyCoordinates converts world velocity to body-relative coordinates
func (v Velocity) ToBodyCoordinates(heading, pitch float32) Velocity {
	ch := float32(math.Cos(float64(heading)))
	sh := float32(math.Sin(float64(heading)))
	cp := float32(math.Cos(float64(pitch)))
	sp := float32(math.Sin(float64(pitch)))

	return Velocity{
		X: v.X*ch + v.Y*sh,
		Y: -v.X*sh + v.Y*ch,
		Z: -v.X*sp*ch - v.Y*sp*sh + v.Z*cp,
	}
}

// PackVelocity packs velocity into 12 bytes
func PackVelocity(v Velocity, buf []byte) int {
	off := 0
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(v.X))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(v.Y))
	off += 4
	binary.LittleEndian.PutUint32(buf[off:], Float32ToBits(v.Z))
	off += 4
	return off
}

// UnpackVelocity unpacks velocity from 12 bytes
func UnpackVelocity(buf []byte) Velocity {
	return Velocity{
		X: Float32FromBits(binary.LittleEndian.Uint32(buf[0:])),
		Y: Float32FromBits(binary.LittleEndian.Uint32(buf[4:])),
		Z: Float32FromBits(binary.LittleEndian.Uint32(buf[8:])),
	}
}
