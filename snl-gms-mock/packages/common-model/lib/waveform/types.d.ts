import { type Timeseries } from '../channel-segment/types';
import type { Either } from '../type-util/type-util';
export type Waveform = Timeseries & Either<{
    samples: Float64Array;
}, {
    /** Claim check ID. Used to fetch and perform operations on this waveform sample data. */
    _uiClaimCheckId: string;
}>;
/**
 * The legacy waveform filter type. This has been replaced by the COI filter type.
 *
 * @deprecated
 */
export interface WaveformFilter {
    id: string;
    name: string;
    description: string;
    filterType: string;
    filterPassBandType: string;
    lowFrequencyHz: number;
    highFrequencyHz: number;
    order: number;
    filterSource: string;
    filterCausality: string;
    zeroPhase: boolean;
    sampleRate: number;
    sampleRateTolerance: number;
    validForSampleRate: boolean;
    sosDenominatorCoefficients?: number[];
    sosNumeratorCoefficients?: number[];
    groupDelaySecs: number;
}
export declare const DEFAULT_SAMPLE_RATE = 1;
export declare const UNFILTERED = "Unfiltered";
export declare const UNFILTERED_FILTER: Partial<WaveformFilter>;
export declare enum LoadType {
    Earlier = 0,
    Later = 1
}
//# sourceMappingURL=types.d.ts.map