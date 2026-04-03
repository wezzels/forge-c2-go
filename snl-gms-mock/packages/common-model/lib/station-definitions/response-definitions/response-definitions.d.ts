import type { DoubleValue } from '../../common';
import type { EntityReference } from '../../faceted';
import type { AmplitudePhaseResponse } from '../../filter';
/**
 * Channel Response definition
 */
export interface Response {
    readonly id: string;
    readonly effectiveAt: number;
    readonly calibration?: Calibration;
    readonly effectiveUntil?: number;
    readonly fapResponse?: FrequencyAmplitudePhase | EntityReference<'id', FrequencyAmplitudePhase>;
}
/**
 * Represents calibration information
 *
 * @JsonProperty("calibrationPeriodSec") double calibrationPeriodSec,
 * @JsonProperty("calibrationTimeShift") Duration calibrationTimeShift,
 * @JsonProperty("calibrationFactor") DoubleValue calibrationFactor)
 */
export interface Calibration {
    readonly calibrationPeriodSec: number;
    readonly calibrationTimeShift: number;
    readonly calibrationFactor: DoubleValue;
}
/**
 * Represents the frequency, amplitude, and phase response of a filter.
 */
export interface FrequencyAmplitudePhase {
    /**
     * A collection of the amplitude and phase responses, and their standard deviations,
     * for each frequency in the frequenciesHz collection. Must have the same length and ordering as the frequenciesHz collection.
     */
    readonly amplitudePhaseResponses: AmplitudePhaseResponse[];
    /** A collection of the frequencies, in Hz, of the response entries in the amplitudePhaseResponse collection. */
    readonly frequencies: number[];
    /**
     * An identifier for the FrequencyAmplitudePhase object which is globally unique among all
     * FrequencyAmplitudePhase value objects. Used to support faceting.
     */
    readonly id: string;
    /** A Calibration object containing a sensor's expected calibration values. */
    readonly nominalCalibration?: Calibration;
    /** A sensor's expected sampling rate, in Hz. */
    readonly nominalSampleRateHz?: number;
}
//# sourceMappingURL=response-definitions.d.ts.map