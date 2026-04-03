import { StationType } from './station-definitions';
/**
 * @return true if given station is an array-type station
 */
export function isArrayStation(station) {
    return (station.type === StationType.HYDROACOUSTIC_ARRAY ||
        station.type === StationType.INFRASOUND_ARRAY ||
        station.type === StationType.SEISMIC_ARRAY);
}
//# sourceMappingURL=util.js.map