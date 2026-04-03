/**
 * Magnitude Calculation Functions
 * 
 * Based on standard seismological formulas for calculating
 * earthquake magnitudes from various measurements.
 */

/**
 * Calculate body wave magnitude (Mb)
 * Mb = log10(A) + Q(Δ, h)
 * 
 * A = amplitude in micrometers
 * Δ = epicentral distance in degrees
 * h = focal depth in km
 */
export function calculateMb(amplitude: number, distance: number, depth: number = 0): number {
  // Q function for Mb (simplified)
  const Q = (delta: number) => {
    if (delta < 20) return 0.16 * delta + 5.9;
    if (delta < 100) return 0.01 * delta + 7.0;
    return 6.8 + 0.0035 * delta;
  };
  
  return Math.log10(amplitude) + Q(distance) - 3.3;
}

/**
 * Calculate surface wave magnitude (Ms)
 * Ms = log10(A/T) + 1.66 * log10(Δ) + 3.3
 * 
 * A = amplitude in micrometers
 * T = period in seconds (typically ~20s)
 * Δ = epicentral distance in degrees
 */
export function calculateMs(amplitude: number, period: number, distance: number): number {
  return Math.log10(amplitude / period) + 1.66 * Math.log10(distance) + 3.3;
}

/**
 * Calculate local magnitude (ML)
 * ML = log10(A) - log10(A₀(Δ))
 * 
 * A = maximum amplitude in mm
 * A₀ = reference amplitude for distance Δ
 * 
 * For California: ML = log10(A) + 2.76 * log10(Δ) - 2.48
 */
export function calculateML(amplitude: number, distance: number): number {
  // Richter scale formula for Southern California
  return Math.log10(amplitude) + 2.76 * Math.log10(distance) - 2.48;
}

/**
 * Calculate moment magnitude (Mw)
 * Mw = (2/3) * log10(M₀) - 6.0
 * 
 * M₀ = seismic moment in N·m
 * M₀ = μ * A * D
 * μ = rigidity (~3e10 Pa for crust)
 * A = fault area in m²
 * D = average displacement in m
 */
export function calculateMw(seismicMoment: number): number {
  return (2.0 / 3.0) * Math.log10(seismicMoment) - 6.0;
}

/**
 * Calculate seismic moment from fault parameters
 */
export function calculateSeismicMoment(
  rigidity: number = 3e10, // Pa
  faultArea: number, // m²
  slip: number // m
): number {
  return rigidity * faultArea * slip;
}

/**
 * Calculate network magnitude
 * Mnet = Σ(Mi * wi) / Σ wi
 * 
 * Mi = individual magnitude
 * wi = weight (typically based on station quality)
 */
export function calculateNetworkMagnitude(
  magnitudes: number[],
  weights?: number[]
): number {
  if (magnitudes.length === 0) return 0;
  
  if (!weights) {
    // Equal weights
    return magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  }
  
  if (weights.length !== magnitudes.length) {
    throw new Error('Weights array must have same length as magnitudes');
  }
  
  const sumWeighted = magnitudes.reduce((sum, m, i) => sum + m * weights[i], 0);
  const sumWeights = weights.reduce((sum, w) => sum + w, 0);
  
  return sumWeighted / sumWeights;
}

/**
 * Get magnitude quality factor (A, B, C, D)
 * Based on number of stations and RMS residual
 */
export function getMagnitudeQuality(
  stationCount: number,
  rmsResidual: number
): 'A' | 'B' | 'C' | 'D' {
  if (stationCount >= 10 && rmsResidual < 0.15) return 'A';
  if (stationCount >= 6 && rmsResidual < 0.3) return 'B';
  if (stationCount >= 4 && rmsResidual < 0.5) return 'C';
  return 'D';
}

/**
 * Convert between magnitude scales (approximate)
 */
export function convertMagnitude(
  fromType: 'mb' | 'ms' | 'ml' | 'mw',
  toType: 'mb' | 'ms' | 'ml' | 'mw',
  magnitude: number
): number {
  // Approximate conversion formulas
  const conversions: Record<string, Record<string, (m: number) => number>> = {
    mb: {
      ms: (m) => m - 0.4,
      ml: (m) => m - 0.3,
      mw: (m) => m - 0.5
    },
    ms: {
      mb: (m) => m + 0.4,
      ml: (m) => m + 0.1,
      mw: (m) => m - 0.1
    },
    ml: {
      mb: (m) => m + 0.3,
      ms: (m) => m - 0.1,
      mw: (m) => m - 0.2
    },
    mw: {
      mb: (m) => m + 0.5,
      ms: (m) => m + 0.1,
      ml: (m) => m + 0.2
    }
  };
  
  if (fromType === toType) return magnitude;
  
  const converter = conversions[fromType]?.[toType];
  if (!converter) {
    console.warn(`No conversion from ${fromType} to ${toType}`);
    return magnitude;
  }
  
  return converter(magnitude);
}

export default {
  calculateMb,
  calculateMs,
  calculateML,
  calculateMw,
  calculateSeismicMoment,
  calculateNetworkMagnitude,
  getMagnitudeQuality,
  convertMagnitude
};
