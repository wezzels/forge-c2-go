import type { ChannelSegmentDescriptor } from '../channel-segment';
import type { FilterDefinitionByFilterDefinitionUsage } from '../filter';
import type { AzimuthSlownessValues, FkReviewablePhasesByStation } from '../fk';
import { WaveformMode } from '../ui-configuration/types';
import type { AmplitudeFeatureMeasurement, AmplitudeFeatureMeasurementType, AmplitudeMeasurementValue, ArrivalTimeFeatureMeasurement, ArrivalTimeMeasurementValue, AzimuthFeatureMeasurement, EmergenceAngleFeatureMeasurement, FeatureMeasurement, FirstMotionMeasurementValue, LongPeriodFirstMotionFeatureMeasurement, NumericMeasurementValue, PhaseTypeFeatureMeasurement, PhaseTypeMeasurementValue, RectilinearityFeatureMeasurement, ShortPeriodFirstMotionFeatureMeasurement, SignalDetection, SignalDetectionHypothesis, SlownessFeatureMeasurement, WaveformAndFilterDefinition } from './types';
import { FeatureMeasurementType } from './types';
/** Backend restricts arrivalTimes to 6 decimal places */
export declare const ARRIVAL_TIME_PRECISION = 6;
/**
 * Type guard that returns true if {@link object} is an {@link AmplitudeFeatureMeasurement}.
 *
 * @param object the object to check to see if it is an {@link AmplitudeFeatureMeasurement}.
 * @returns true if {@link object} is an {@link AmplitudeFeatureMeasurement}; false otherwise.
 */
export declare function isAmplitudeFeatureMeasurement(object: unknown): object is AmplitudeFeatureMeasurement;
/**
 * Type guard for {@link ArrivalTimeFeatureMeasurement}
 */
export declare function isArrivalTimeFeatureMeasurement(object: unknown): object is ArrivalTimeFeatureMeasurement;
/**
 * Checks if Signal detection ArrivalTimeMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export declare function isArrivalTimeMeasurementValue(object: any): object is ArrivalTimeMeasurementValue;
/**
 * Type guard for {@link AzimuthFeatureMeasurement} with feature measurement type RECEIVER_TO_SOURCE_AZIMUTH
 */
export declare function isReceiverToSourceAzimuthFeatureMeasurement(object: unknown): object is AzimuthFeatureMeasurement;
/**
 * Type guard for {@link AzimuthFeatureMeasurement}
 */
export declare function isAzimuthFeatureMeasurement(object: unknown): object is AzimuthFeatureMeasurement;
/**
 * Type guard for {@link SlownessFeatureMeasurement}
 */
export declare function isSlownessFeatureMeasurement(object: unknown): object is SlownessFeatureMeasurement;
/**
 * Type guard for {@link PhaseTypeFeatureMeasurement}
 */
export declare function isPhaseTypeFeatureMeasurement(object: unknown): object is PhaseTypeFeatureMeasurement;
/**
 * Checks if Signal detection PhaseMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export declare function isPhaseMeasurementValue(object: any): object is PhaseTypeMeasurementValue;
/**
 * Type guard for {@link RectilinearityFeatureMeasurement}
 */
export declare function isRectilinearityFeatureMeasurement(object: unknown): object is RectilinearityFeatureMeasurement;
/**
 * Type guard for {@link EmergenceAngleFeatureMeasurement}
 */
export declare function isEmergenceAngleFeatureMeasurement(object: unknown): object is EmergenceAngleFeatureMeasurement;
/**
 * Type guard for {@link LongPeriodFirstMotionFeatureMeasurement}
 */
export declare function isLongPeriodFirstMotionFeatureMeasurement(object: unknown): object is LongPeriodFirstMotionFeatureMeasurement;
/**
 * Type guard for {@link ShortPeriodFirstMotionFeatureMeasurement}
 */
export declare function isShortPeriodFirstMotionFeatureMeasurement(object: unknown): object is ShortPeriodFirstMotionFeatureMeasurement;
/**
 * Checks if Signal detection NumericMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export declare function isNumericMeasurementValue(object: any): object is NumericMeasurementValue;
/**
 * Checks if Signal detection AmplitudeMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export declare function isAmplitudeFeatureMeasurementValue(object: any): object is AmplitudeMeasurementValue;
/**
 * Get the current Hypothesis from the set of Hypotheses. This will be the last entry in the set if there is one
 * Returns undefined on empty arrays
 *
 * @param hypotheses the set of Hypotheses.
 * @return the current Hypothesis
 */
export declare function getCurrentHypothesis(hypotheses: SignalDetectionHypothesis[]): SignalDetectionHypothesis;
/**
 * Searches Feature Measurements for the desired Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 * @param featureMeasurementType Enum of desired Feature Measurement desired
 *
 * @returns FeatureMeasurement or undefined if not found
 */
export declare function findFeatureMeasurementByType(featureMeasurements: FeatureMeasurement[], featureMeasurementType: FeatureMeasurementType): FeatureMeasurement | undefined;
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns ArrivalTime FeatureMeasurement or undefined if not found
 */
export declare function findArrivalTimeFeatureMeasurement(featureMeasurements: FeatureMeasurement[]): ArrivalTimeFeatureMeasurement;
/**
 * Searches a SignalDetection for the ArrivalTime Feature Measurement
 *
 * @param signalDetection to search for ArrivalTime
 *
 * @returns ArrivalTime FeatureMeasurement
 */
export declare function findArrivalTimeFeatureMeasurementUsingSignalDetection(signalDetection: SignalDetection): ArrivalTimeFeatureMeasurement;
/**
 * Gets the arrival time feature measurement value from a signal detection
 *
 * @param signalDetection
 * @returns the numeric arrival time feature measurement value
 */
export declare function getArrivalTimeFeatureMeasurementValue(signalDetection: SignalDetection): number;
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns ArrivalTime FeatureMeasurementValue or undefined if not found
 */
export declare function findArrivalTimeFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): ArrivalTimeMeasurementValue;
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement's Analysis Waveform
 *
 * @param signalDetection
 * @returns returns the arrival time analysis waveform or undefined
 */
export declare function findArrivalTimeAnalysisWaveform(signalDetection: SignalDetection): WaveformAndFilterDefinition | undefined;
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement's
 * MeasuredChannelSegment. If exists, returns the id
 *
 * @param signalDetection
 * @returns returns the ID of the MeasuredChannelSegment if exists, otherwise undefined
 */
export declare function findArrivalTimeMeasuredChannelSegmentDescriptor(signalDetection: SignalDetection): ChannelSegmentDescriptor | undefined;
/**
 * Returns the first part of the name of the channel associated with the first feature
 * measurement associated with a channel
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns the first part of the channel name or undefined if not found
 */
export declare function findFeatureMeasurementChannelNameHelper(featureMeasurements: FeatureMeasurement[]): string | undefined;
/**
 * Returns the first part of the name of the channel associated with the arrival time
 * feature measurement if available, otherwise, returns the first part of the name of
 * the channel associated with the first feature measurement associated with a channel
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns the first part of the channel name or undefined if not found
 */
export declare function findFeatureMeasurementChannelName(featureMeasurements: FeatureMeasurement[]): string | undefined;
/**
 * Searches Feature Measurements for the Azimuth Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Azimuth FeatureMeasurement or undefined if not found
 */
export declare function findAzimuthFeatureMeasurement(featureMeasurements: FeatureMeasurement[]): AzimuthFeatureMeasurement | undefined;
/**
 * Searches Feature Measurements for the Receiver to Source Azimuth Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Azimuth FeatureMeasurement or undefined if not found
 */
export declare function findReceiverToSourceAzimuthFeatureMeasurement(featureMeasurements: FeatureMeasurement[]): AzimuthFeatureMeasurement | undefined;
/**
 * Searches Feature Measurements for the Azimuth Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Azimuth FeatureMeasurementValue or undefined if not found
 */
export declare function findAzimuthFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): NumericMeasurementValue | undefined;
/**
 * Searches Feature Measurements for the Slowness Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Slowness FeatureMeasurement or undefined if not found
 */
export declare function findSlownessFeatureMeasurement(featureMeasurements: FeatureMeasurement[]): SlownessFeatureMeasurement | undefined;
/**
 * Searches Feature Measurements for the Slowness Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Slowness FeatureMeasurementValue or undefined if not found
 */
export declare function findSlownessFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): NumericMeasurementValue | undefined;
export declare function sortAmplitudeFeatureMeasurements(a: AmplitudeFeatureMeasurement, b: AmplitudeFeatureMeasurement): number;
/**
 * Gets the reference time from the slowness feature measurement on a signal detection
 *
 * @param signalDetection the signal detection from which to get the slowness reference time.
 * @returns the numeric slowness reference time feature measurement value
 */
export declare function getSlownessReferenceTime(signalDetection: SignalDetection): number | undefined;
/**
 * Searches Feature Measurements for Amplitude Feature Measurements
 *
 * @param featureMeasurements List of feature measurements
 * @returns AmplitudeFeatureMeasurements sorted by order of precedence or empty array if not found
 */
export declare function findAmplitudeFeatureMeasurements(featureMeasurements: FeatureMeasurement[]): AmplitudeFeatureMeasurement[];
/**
 * Searches a SignalDetection for the Amplitude Feature Measurements
 *
 * @param signalDetection to search for Amplitude
 *
 * @returns Amplitude FM array
 */
export declare function findAmplitudeFeatureMeasurementsUsingSignalDetection(signalDetection: SignalDetection): AmplitudeFeatureMeasurement[];
/**
 * Searches Feature Measurements for the first Amplitude Feature Measurements' Analysis Waveform
 *
 * @param signalDetection
 * @returns returns the first amplitude analysis waveform or undefined
 * ! May need to be updated when multiple amplitude feature measurements become present in FM collection
 */
export declare function findAmplitudeAnalysisWaveform(signalDetection: SignalDetection): WaveformAndFilterDefinition | undefined;
/**
 * If in Measurement Mode, find analysis waveform based on amplitude FMs
 * Otherwise, find analysis waveform based on arrival time FM
 */
export declare function findAnalysisWaveformByMode(waveformMode: WaveformMode | null, signalDetection: SignalDetection): WaveformAndFilterDefinition | undefined;
/**
 * Searches Feature Measurements for a particular Amplitude Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 * @param amplitudeName
 * @returns Specified Amplitude FeatureMeasurement or undefined if not found
 */
export declare function findAmplitudeFeatureMeasurement(featureMeasurements: FeatureMeasurement[], amplitudeName: FeatureMeasurementType): AmplitudeFeatureMeasurement | undefined;
/**
 * Searches Feature Measurements for the Amplitude Feature Measurement Values
 *
 * @param featureMeasurements List of feature measurements
 * @returns Array of AmplitudeMeasurementValues sorted by order of precedence or empty array if not found
 */
export declare function findAmplitudeFeatureMeasurementValues(featureMeasurements: FeatureMeasurement[]): AmplitudeMeasurementValue[];
/**
 * Searches Feature Measurements for the Amplitude Feature Measurement Types
 *
 * @param featureMeasurements List of feature measurements
 * @returns Array of AmplitudeFeatureMeasurementTypes sorted by order of precedence or empty array if none found
 */
export declare function findAmplitudeFeatureMeasurementTypes(featureMeasurements: FeatureMeasurement[]): AmplitudeFeatureMeasurementType[];
/**
 * Returns undefined if no measurement is found.  Detections do not always have an amplitude measurement so no error is thrown
 * @param signalDetection containing the amplitude feature measurement we need
 * @returns the top priority amplitude feature measurement as determined by @function findAmplitudeFeatureMeasurements
 */
export declare function findAmplitudeFeatureMeasurementFromSignalDetection(signalDetection: SignalDetection): AmplitudeFeatureMeasurement | undefined;
/**
 * Searches Feature Measurements for the Phase Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Phase FeatureMeasurement or undefined if not found
 */
export declare function findPhaseFeatureMeasurement(featureMeasurements: FeatureMeasurement[]): PhaseTypeFeatureMeasurement;
/**
 * Searches Feature Measurements for the Phase Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns Phase FeatureMeasurementValue or undefined if not found
 */
export declare function findPhaseFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): PhaseTypeMeasurementValue;
/**
 * Searches Feature Measurements for the Rectilinearity Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns Rectilinearity FeatureMeasurementValue or undefined if not found
 */
export declare function findRectilinearityFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): NumericMeasurementValue | undefined;
/**
 * Searches Feature Measurements for the Emergence_Angle Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns Emergence_Angle FeatureMeasurementValue or undefined if not found
 */
export declare function findEmergenceAngleFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): NumericMeasurementValue | undefined;
/**
 * Searches Feature Measurements for the ShortPeriodFirstMotion Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns SHORT_PERIOD_FIRST_MOTION FeatureMeasurementValue or undefined if not found
 */
export declare function findShortPeriodFirstMotionFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): FirstMotionMeasurementValue | undefined;
/**
 * Searches Feature Measurements for the LongPeriodFirstMotion Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns LongPeriodFirstMotion FeatureMeasurementValue or undefined if not found
 */
export declare function findLongPeriodFirstMotionFeatureMeasurementValue(featureMeasurements: FeatureMeasurement[]): FirstMotionMeasurementValue | undefined;
/**
 * Finds the phase from the current hypothesis, phase feature measurement value.
 *
 * @param signalDetection the signal detection we need the phase from
 * @returns a phase value
 */
export declare function findSignalDetectionPhase(signalDetection: SignalDetection): string;
/**
 * Given a SD, returns the azimuth and slowness values from the current SDH
 *
 * @param signalDetection
 * @returns azimuth and slowness number values or undefined
 */
export declare const getAzimuthAndSlownessFromSD: (signalDetection: SignalDetection | undefined) => AzimuthSlownessValues | undefined;
/**
 * Gets a partial filter definition by filter definition usage object for the given signal detection.
 * The resulting object contains the various named filters that should be applied to any associated waveform.
 *
 * @param signalDetection the signal detection to search
 * @returns a partial record of filter definitions by filter definition usage
 */
export declare const getFilterDefinitionByFilterDefinitionUsageFromSignalDetection: (signalDetection: SignalDetection) => Partial<FilterDefinitionByFilterDefinitionUsage>;
/**
 * @returns List of signal detections whose phases are considered "key activity phases"
 * or require review via the analyst configuration
 */
export declare const getReviewableSignalDetections: (signalDetections: SignalDetection[], reviewablePhases: FkReviewablePhasesByStation) => SignalDetection[];
export declare const getKeyActivityPhaseSignalDetections: (signalDetections: SignalDetection[], keyActivityPhases: string[]) => SignalDetection[];
//# sourceMappingURL=util.d.ts.map