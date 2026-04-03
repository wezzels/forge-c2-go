/**
 * Geiger Location Algorithm
 * 
 * Iterative least-squares algorithm for determining earthquake location
 * from arrival times at multiple stations.
 */

export interface Station {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface Arrival {
  station: Station;
  phase: 'P' | 'S';
  time: number;
  uncertainty?: number;
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  depth: number;
  originTime: number;
  residuals: number[];
  rmsResidual: number;
  uncertainty: {
    latitude: number;
    longitude: number;
    depth: number;
    originTime: number;
  };
  iterations: number;
  converged: boolean;
}

// IASP91 velocity model (simplified)
const VELOCITY_MODEL = {
  P: 5.8, // km/s average P-wave velocity
  S: 3.36 // km/s average S-wave velocity
};

// Earth radius in km
const EARTH_RADIUS = 6371.0;

/**
 * Calculate distance between two points on Earth using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

/**
 * Calculate travel time using simplified velocity model
 */
export function calculateTravelTime(
  distance: number,
  depth: number,
  phase: 'P' | 'S'
): number {
  const velocity = VELOCITY_MODEL[phase];
  const slowness = distance / velocity;
  const depthTime = depth / velocity;
  return Math.sqrt(slowness * slowness + depthTime * depthTime);
}

/**
 * Calculate azimuth from station to event
 */
export function calculateAzimuth(
  stationLat: number,
  stationLon: number,
  eventLat: number,
  eventLon: number
): number {
  const dLon = (eventLon - stationLon) * Math.PI / 180;
  const lat1 = stationLat * Math.PI / 180;
  const lat2 = eventLat * Math.PI / 180;
  
  const x = Math.sin(dLon) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  let azimuth = Math.atan2(x, y) * 180 / Math.PI;
  if (azimuth < 0) azimuth += 360;
  
  return azimuth;
}

/**
 * Geiger location algorithm
 */
export function geigerLocation(
  arrivals: Arrival[],
  initialLat?: number,
  initialLon?: number,
  initialDepth?: number,
  maxIterations: number = 50,
  tolerance: number = 0.001
): LocationResult {
  if (arrivals.length < 4) {
    throw new Error('Need at least 4 arrivals for location');
  }

  // Initial estimate: centroid of stations
  let lat = initialLat ?? arrivals.reduce((sum, a) => sum + a.station.latitude, 0) / arrivals.length;
  let lon = initialLon ?? arrivals.reduce((sum, a) => sum + a.station.longitude, 0) / arrivals.length;
  let depth = initialDepth ?? 10; // Default 10 km depth
  let originTime = arrivals.reduce((sum, a) => {
    const dist = calculateDistance(a.station.latitude, a.station.longitude, lat, lon);
    const travelTime = calculateTravelTime(dist, depth, a.phase);
    return sum + a.time - travelTime;
  }, 0) / arrivals.length;

  let converged = false;
  let iterations = 0;

  for (let i = 0; i < maxIterations; i++) {
    iterations = i + 1;

    // Calculate residuals and derivatives
    const residuals: number[] = [];
    const derivatives: number[][] = [];

    for (const arrival of arrivals) {
      const dist = calculateDistance(arrival.station.latitude, arrival.station.longitude, lat, lon);
      const travelTime = calculateTravelTime(dist, depth, arrival.phase);
      const predictedTime = originTime + travelTime;
      const residual = arrival.time - predictedTime;
      residuals.push(residual);

      // Derivatives (approximate)
      const dLat = 0.001; // ~0.1 km
      const dLon = 0.001;
      const dDepth = 0.1; // km

      const dist1 = calculateDistance(arrival.station.latitude + dLat, arrival.station.longitude, lat, lon);
      const travelTime1 = calculateTravelTime(dist1, depth, arrival.phase);

      const dist2 = calculateDistance(arrival.station.latitude, arrival.station.longitude + dLon, lat, lon);
      const travelTime2 = calculateTravelTime(dist2, depth, arrival.phase);

      const travelTime3 = calculateTravelTime(dist, depth + dDepth, arrival.phase);

      derivatives.push([
        (travelTime1 - travelTime) / dLat,
        (travelTime2 - travelTime) / dLon,
        (travelTime3 - travelTime) / dDepth,
        1 // derivative with respect to origin time
      ]);
    }

    // Solve least-squares problem (simplified)
    const n = arrivals.length;
    const m = 4; // lat, lon, depth, originTime
    
    // Calculate updates using normal equations
    let sumDLat = 0, sumDLon = 0, sumDDepth = 0, sumDTime = 0;
    let sumResidual = 0;

    for (let j = 0; j < n; j++) {
      const d = derivatives[j];
      const r = residuals[j];
      sumDLat += d[0] * r;
      sumDLon += d[1] * r;
      sumDDepth += d[2] * r;
      sumDTime += d[3] * r;
      sumResidual += r;
    }

    // Damping factor
    const damping = 0.1;

    // Update parameters
    const dLat = damping * sumDLat / n;
    const dLon = damping * sumDLon / n;
    const dDepth = damping * sumDDepth / n;
    const dTime = damping * sumDTime / n;

    lat += dLat;
    lon += dLon;
    depth += dDepth;
    originTime += dTime;

    // Convergence check
    const maxUpdate = Math.max(Math.abs(dLat), Math.abs(dLon), Math.abs(dDepth), Math.abs(dTime));
    if (maxUpdate < tolerance) {
      converged = true;
      break;
    }
  }

  // Calculate uncertainties (simplified)
  const rmsResidual = Math.sqrt(
    arrivals.reduce((sum, a) => {
      const dist = calculateDistance(a.station.latitude, a.station.longitude, lat, lon);
      const travelTime = calculateTravelTime(dist, depth, a.phase);
      const predictedTime = originTime + travelTime;
      const residual = a.time - predictedTime;
      return sum + residual * residual;
    }, 0) / arrivals.length
  );

  return {
    latitude: lat,
    longitude: lon,
    depth,
    originTime,
    residuals: arrivals.map(a => {
      const dist = calculateDistance(a.station.latitude, a.station.longitude, lat, lon);
      const travelTime = calculateTravelTime(dist, depth, a.phase);
      return a.time - (originTime + travelTime);
    }),
    rmsResidual,
    uncertainty: {
      latitude: rmsResidual / Math.sqrt(arrivals.length) * 111, // Convert to km
      longitude: rmsResidual / Math.sqrt(arrivals.length) * 111 * Math.cos(lat * Math.PI / 180),
      depth: rmsResidual / Math.sqrt(arrivals.length),
      originTime: rmsResidual / Math.sqrt(arrivals.length)
    },
    iterations,
    converged
  };
}

export default geigerLocation;
