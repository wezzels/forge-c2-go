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
/**
 * Calculate distance between two points on Earth using Haversine formula
 */
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * Calculate travel time using simplified velocity model
 */
export declare function calculateTravelTime(distance: number, depth: number, phase: 'P' | 'S'): number;
/**
 * Calculate azimuth from station to event
 */
export declare function calculateAzimuth(stationLat: number, stationLon: number, eventLat: number, eventLon: number): number;
/**
 * Geiger location algorithm
 */
export declare function geigerLocation(arrivals: Arrival[], initialLat?: number, initialLon?: number, initialDepth?: number, maxIterations?: number, tolerance?: number): LocationResult;
export default geigerLocation;
//# sourceMappingURL=geiger.d.ts.map