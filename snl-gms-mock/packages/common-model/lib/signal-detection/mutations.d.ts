import type { AmplitudeMeasurementValue } from './types';
/**
 * Signal Detection Timing. Input object that groups ArrivalTime and AmplitudeMeasurement
 */
export interface SignalDetectionTimingInput {
    arrivalTime: number;
    timeUncertaintySec: number;
    amplitudeMeasurement?: AmplitudeMeasurementValue;
}
/**
 * Input used to create a new signal detection with an initial hypothesis
 * and time feature measurement
 */
export interface NewDetectionInput {
    stationId: string;
    phase: string;
    signalDetectionTiming: SignalDetectionTimingInput;
    eventId?: string;
}
export interface CreateDetectionMutationArgs {
    input: NewDetectionInput;
}
//# sourceMappingURL=mutations.d.ts.map