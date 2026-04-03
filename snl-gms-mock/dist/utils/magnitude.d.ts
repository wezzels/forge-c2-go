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
export declare function calculateMb(amplitude: number, distance: number, depth?: number): number;
/**
 * Calculate surface wave magnitude (Ms)
 * Ms = log10(A/T) + 1.66 * log10(Δ) + 3.3
 *
 * A = amplitude in micrometers
 * T = period in seconds (typically ~20s)
 * Δ = epicentral distance in degrees
 */
export declare function calculateMs(amplitude: number, period: number, distance: number): number;
/**
 * Calculate local magnitude (ML)
 * ML = log10(A) - log10(A₀(Δ))
 *
 * A = maximum amplitude in mm
 * A₀ = reference amplitude for distance Δ
 *
 * For California: ML = log10(A) + 2.76 * log10(Δ) - 2.48
 */
export declare function calculateML(amplitude: number, distance: number): number;
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
export declare function calculateMw(seismicMoment: number): number;
/**
 * Calculate seismic moment from fault parameters
 */
export declare function calculateSeismicMoment(rigidity: number | undefined, // Pa
faultArea: number, // m²
slip: number): number;
/**
 * Calculate network magnitude
 * Mnet = Σ(Mi * wi) / Σ wi
 *
 * Mi = individual magnitude
 * wi = weight (typically based on station quality)
 */
export declare function calculateNetworkMagnitude(magnitudes: number[], weights?: number[]): number;
/**
 * Get magnitude quality factor (A, B, C, D)
 * Based on number of stations and RMS residual
 */
export declare function getMagnitudeQuality(stationCount: number, rmsResidual: number): 'A' | 'B' | 'C' | 'D';
/**
 * Convert between magnitude scales (approximate)
 */
export declare function convertMagnitude(fromType: 'mb' | 'ms' | 'ml' | 'mw', toType: 'mb' | 'ms' | 'ml' | 'mw', magnitude: number): number;
declare const _default: {
    calculateMb: typeof calculateMb;
    calculateMs: typeof calculateMs;
    calculateML: typeof calculateML;
    calculateMw: typeof calculateMw;
    calculateSeismicMoment: typeof calculateSeismicMoment;
    calculateNetworkMagnitude: typeof calculateNetworkMagnitude;
    getMagnitudeQuality: typeof getMagnitudeQuality;
    convertMagnitude: typeof convertMagnitude;
};
export default _default;
//# sourceMappingURL=magnitude.d.ts.map