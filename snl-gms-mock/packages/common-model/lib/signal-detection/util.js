import { WaveformMode } from '../ui-configuration/types';
import { amplitudeMeasurementTypes, FeatureMeasurementType } from './types';
/** Backend restricts arrivalTimes to 6 decimal places */
export const ARRIVAL_TIME_PRECISION = 6;
/**
 * Type guard that returns true if {@link object} is an {@link AmplitudeFeatureMeasurement}.
 *
 * @param object the object to check to see if it is an {@link AmplitudeFeatureMeasurement}.
 * @returns true if {@link object} is an {@link AmplitudeFeatureMeasurement}; false otherwise.
 */
export function isAmplitudeFeatureMeasurement(object) {
    if (!object)
        return false;
    return amplitudeMeasurementTypes.includes(object.featureMeasurementType);
}
/**
 * Type guard for {@link ArrivalTimeFeatureMeasurement}
 */
export function isArrivalTimeFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.ARRIVAL_TIME);
}
/**
 * Checks if Signal detection ArrivalTimeMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export function isArrivalTimeMeasurementValue(object) {
    return object && object.arrivalTime !== undefined;
}
/**
 * Type guard for {@link AzimuthFeatureMeasurement} with feature measurement type RECEIVER_TO_SOURCE_AZIMUTH
 */
export function isReceiverToSourceAzimuthFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH);
}
/**
 * Type guard for {@link AzimuthFeatureMeasurement}
 */
export function isAzimuthFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH ||
        object.featureMeasurementType ===
            FeatureMeasurementType.SOURCE_TO_RECEIVER_AZIMUTH);
}
/**
 * Type guard for {@link SlownessFeatureMeasurement}
 */
export function isSlownessFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.SLOWNESS);
}
/**
 * Type guard for {@link PhaseTypeFeatureMeasurement}
 */
export function isPhaseTypeFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType === FeatureMeasurementType.PHASE);
}
/**
 * Checks if Signal detection PhaseMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export function isPhaseMeasurementValue(object) {
    return object.value !== undefined && object.standardDeviation !== undefined;
}
/**
 * Type guard for {@link RectilinearityFeatureMeasurement}
 */
export function isRectilinearityFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.RECTILINEARITY);
}
/**
 * Type guard for {@link EmergenceAngleFeatureMeasurement}
 */
export function isEmergenceAngleFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.EMERGENCE_ANGLE);
}
/**
 * Type guard for {@link LongPeriodFirstMotionFeatureMeasurement}
 */
export function isLongPeriodFirstMotionFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION);
}
/**
 * Type guard for {@link ShortPeriodFirstMotionFeatureMeasurement}
 */
export function isShortPeriodFirstMotionFeatureMeasurement(object) {
    if (!object)
        return false;
    return (object.featureMeasurementType ===
        FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION);
}
/**
 * Checks if Signal detection NumericMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export function isNumericMeasurementValue(object) {
    return object.measuredValue !== undefined;
}
/**
 * Checks if Signal detection AmplitudeMeasurementValue
 *
 * @param object FeatureMeasurementValue
 * @returns boolean
 */
export function isAmplitudeFeatureMeasurementValue(object) {
    return (object !== undefined &&
        object.amplitude !== undefined &&
        object.period !== undefined &&
        object.measurementTime !== undefined &&
        object.measurementWindowDuration !== undefined &&
        object.measurementWindowStart !== undefined &&
        object.clipped !== undefined);
}
/**
 * Get the current Hypothesis from the set of Hypotheses. This will be the last entry in the set if there is one
 * Returns undefined on empty arrays
 *
 * @param hypotheses the set of Hypotheses.
 * @return the current Hypothesis
 */
export function getCurrentHypothesis(hypotheses) {
    return hypotheses[hypotheses.length - 1];
}
/**
 * Searches Feature Measurements for the desired Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 * @param featureMeasurementType Enum of desired Feature Measurement desired
 *
 * @returns FeatureMeasurement or undefined if not found
 */
export function findFeatureMeasurementByType(featureMeasurements, featureMeasurementType) {
    return featureMeasurements.find(fmt => fmt?.featureMeasurementType === featureMeasurementType);
}
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns ArrivalTime FeatureMeasurement or undefined if not found
 */
export function findArrivalTimeFeatureMeasurement(featureMeasurements) {
    const arrivalTimeFeatureMeasurement = featureMeasurements?.find(isArrivalTimeFeatureMeasurement);
    if (!arrivalTimeFeatureMeasurement) {
        throw new Error(`Invalid feature measurement collection, must have an arrival time feature measurement`);
    }
    return arrivalTimeFeatureMeasurement;
}
/**
 * Searches a SignalDetection for the ArrivalTime Feature Measurement
 *
 * @param signalDetection to search for ArrivalTime
 *
 * @returns ArrivalTime FeatureMeasurement
 */
export function findArrivalTimeFeatureMeasurementUsingSignalDetection(signalDetection) {
    const currentHypothesis = getCurrentHypothesis(signalDetection.signalDetectionHypotheses);
    return findArrivalTimeFeatureMeasurement(currentHypothesis.featureMeasurements);
}
/**
 * Gets the arrival time feature measurement value from a signal detection
 *
 * @param signalDetection
 * @returns the numeric arrival time feature measurement value
 */
export function getArrivalTimeFeatureMeasurementValue(signalDetection) {
    return findArrivalTimeFeatureMeasurementUsingSignalDetection(signalDetection).measurementValue
        .arrivalTime.value;
}
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns ArrivalTime FeatureMeasurementValue or undefined if not found
 */
export function findArrivalTimeFeatureMeasurementValue(featureMeasurements) {
    const fm = findArrivalTimeFeatureMeasurement(featureMeasurements);
    return fm.measurementValue;
}
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement's Analysis Waveform
 *
 * @param signalDetection
 * @returns returns the arrival time analysis waveform or undefined
 */
export function findArrivalTimeAnalysisWaveform(signalDetection) {
    const arrivalTimeFeatureMeasurement = findArrivalTimeFeatureMeasurementUsingSignalDetection(signalDetection);
    return arrivalTimeFeatureMeasurement.analysisWaveform;
}
/**
 * Searches Feature Measurements for the ArrivalTime Feature Measurement's
 * MeasuredChannelSegment. If exists, returns the id
 *
 * @param signalDetection
 * @returns returns the ID of the MeasuredChannelSegment if exists, otherwise undefined
 */
export function findArrivalTimeMeasuredChannelSegmentDescriptor(signalDetection) {
    const arrivalTimeFeatureMeasurement = findArrivalTimeFeatureMeasurementUsingSignalDetection(signalDetection);
    return arrivalTimeFeatureMeasurement.measuredChannelSegment?.id;
}
/**
 * Returns the first part of the name of the channel associated with the first feature
 * measurement associated with a channel
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns the first part of the channel name or undefined if not found
 */
export function findFeatureMeasurementChannelNameHelper(featureMeasurements) {
    return featureMeasurements && featureMeasurements.length > 0
        ? featureMeasurements.find(fm => fm?.channel?.name != null && fm?.channel?.name.length > 0)
            ?.channel?.name
        : undefined;
}
/**
 * Returns the first part of the name of the channel associated with the arrival time
 * feature measurement if available, otherwise, returns the first part of the name of
 * the channel associated with the first feature measurement associated with a channel
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns the first part of the channel name or undefined if not found
 */
export function findFeatureMeasurementChannelName(featureMeasurements) {
    const arrivalTimeFeatureMeasurement = findArrivalTimeFeatureMeasurement(featureMeasurements);
    const channelName = arrivalTimeFeatureMeasurement?.channel?.name ??
        findFeatureMeasurementChannelNameHelper(featureMeasurements);
    return channelName ? channelName.split('/')[0] : undefined;
}
/**
 * Searches Feature Measurements for the Azimuth Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Azimuth FeatureMeasurement or undefined if not found
 */
export function findAzimuthFeatureMeasurement(featureMeasurements) {
    return featureMeasurements.find(isAzimuthFeatureMeasurement);
}
/**
 * Searches Feature Measurements for the Receiver to Source Azimuth Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Azimuth FeatureMeasurement or undefined if not found
 */
export function findReceiverToSourceAzimuthFeatureMeasurement(featureMeasurements) {
    return featureMeasurements.find(isReceiverToSourceAzimuthFeatureMeasurement);
}
/**
 * Searches Feature Measurements for the Azimuth Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Azimuth FeatureMeasurementValue or undefined if not found
 */
export function findAzimuthFeatureMeasurementValue(featureMeasurements) {
    const fm = findAzimuthFeatureMeasurement(featureMeasurements);
    return fm ? fm.measurementValue : undefined;
}
/**
 * Searches Feature Measurements for the Slowness Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Slowness FeatureMeasurement or undefined if not found
 */
export function findSlownessFeatureMeasurement(featureMeasurements) {
    return featureMeasurements.find(isSlownessFeatureMeasurement);
}
/**
 * Searches Feature Measurements for the Slowness Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Slowness FeatureMeasurementValue or undefined if not found
 */
export function findSlownessFeatureMeasurementValue(featureMeasurements) {
    const fm = findSlownessFeatureMeasurement(featureMeasurements);
    return fm ? fm.measurementValue : undefined;
}
export function sortAmplitudeFeatureMeasurements(a, b) {
    const indexA = amplitudeMeasurementTypes.indexOf(a.featureMeasurementType);
    const indexB = amplitudeMeasurementTypes.indexOf(b.featureMeasurementType);
    return indexA - indexB;
}
/**
 * Gets the reference time from the slowness feature measurement on a signal detection
 *
 * @param signalDetection the signal detection from which to get the slowness reference time.
 * @returns the numeric slowness reference time feature measurement value
 */
export function getSlownessReferenceTime(signalDetection) {
    return findSlownessFeatureMeasurement(getCurrentHypothesis(signalDetection.signalDetectionHypotheses).featureMeasurements)?.measurementValue.referenceTime;
}
/**
 * Searches Feature Measurements for Amplitude Feature Measurements
 *
 * @param featureMeasurements List of feature measurements
 * @returns AmplitudeFeatureMeasurements sorted by order of precedence or empty array if not found
 */
export function findAmplitudeFeatureMeasurements(featureMeasurements) {
    return featureMeasurements
        .filter(isAmplitudeFeatureMeasurement)
        .sort(sortAmplitudeFeatureMeasurements);
}
/**
 * Searches a SignalDetection for the Amplitude Feature Measurements
 *
 * @param signalDetection to search for Amplitude
 *
 * @returns Amplitude FM array
 */
export function findAmplitudeFeatureMeasurementsUsingSignalDetection(signalDetection) {
    const currentHypothesis = getCurrentHypothesis(signalDetection.signalDetectionHypotheses);
    return findAmplitudeFeatureMeasurements(currentHypothesis.featureMeasurements);
}
/**
 * Searches Feature Measurements for the first Amplitude Feature Measurements' Analysis Waveform
 *
 * @param signalDetection
 * @returns returns the first amplitude analysis waveform or undefined
 * ! May need to be updated when multiple amplitude feature measurements become present in FM collection
 */
export function findAmplitudeAnalysisWaveform(signalDetection) {
    const amplitudeFeatureMeasurements = findAmplitudeFeatureMeasurementsUsingSignalDetection(signalDetection);
    if (amplitudeFeatureMeasurements.length > 0) {
        return amplitudeFeatureMeasurements[0].analysisWaveform;
    }
    return undefined;
}
/**
 * If in Measurement Mode, find analysis waveform based on amplitude FMs
 * Otherwise, find analysis waveform based on arrival time FM
 */
export function findAnalysisWaveformByMode(waveformMode, signalDetection) {
    if (waveformMode !== WaveformMode.Measurement) {
        return findArrivalTimeAnalysisWaveform(signalDetection);
    }
    return findAmplitudeAnalysisWaveform(signalDetection);
}
/**
 * Searches Feature Measurements for a particular Amplitude Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 * @param amplitudeName
 * @returns Specified Amplitude FeatureMeasurement or undefined if not found
 */
export function findAmplitudeFeatureMeasurement(featureMeasurements, amplitudeName) {
    return findAmplitudeFeatureMeasurements(featureMeasurements).find(fm => fm.featureMeasurementType === amplitudeName);
}
/**
 * Searches Feature Measurements for the Amplitude Feature Measurement Values
 *
 * @param featureMeasurements List of feature measurements
 * @returns Array of AmplitudeMeasurementValues sorted by order of precedence or empty array if not found
 */
export function findAmplitudeFeatureMeasurementValues(featureMeasurements) {
    const measurementValues = [];
    const maybeMeasurements = findAmplitudeFeatureMeasurements(featureMeasurements);
    if (maybeMeasurements.length !== 0) {
        maybeMeasurements.forEach(fm => {
            if (isAmplitudeFeatureMeasurementValue(fm.measurementValue)) {
                measurementValues.push(fm.measurementValue);
            }
        });
    }
    return measurementValues;
}
/**
 * Searches Feature Measurements for the Amplitude Feature Measurement Types
 *
 * @param featureMeasurements List of feature measurements
 * @returns Array of AmplitudeFeatureMeasurementTypes sorted by order of precedence or empty array if none found
 */
export function findAmplitudeFeatureMeasurementTypes(featureMeasurements) {
    const measurementTypes = [];
    const maybeMeasurements = findAmplitudeFeatureMeasurements(featureMeasurements);
    if (maybeMeasurements.length !== 0) {
        maybeMeasurements.forEach(fm => {
            if (isAmplitudeFeatureMeasurementValue(fm.measurementValue)) {
                measurementTypes.push(fm.featureMeasurementType);
            }
        });
    }
    return measurementTypes;
}
/**
 * Returns undefined if no measurement is found.  Detections do not always have an amplitude measurement so no error is thrown
 * @param signalDetection containing the amplitude feature measurement we need
 * @returns the top priority amplitude feature measurement as determined by @function findAmplitudeFeatureMeasurements
 */
export function findAmplitudeFeatureMeasurementFromSignalDetection(signalDetection) {
    const amplitudeFeatureMeasurements = findAmplitudeFeatureMeasurements(getCurrentHypothesis(signalDetection.signalDetectionHypotheses).featureMeasurements);
    if (amplitudeFeatureMeasurements.length < 1) {
        return undefined;
    }
    return amplitudeFeatureMeasurements[0];
}
/**
 * Searches Feature Measurements for the Phase Feature Measurement
 *
 * @param featureMeasurements List of feature measurements
 *
 * @returns Phase FeatureMeasurement or undefined if not found
 */
export function findPhaseFeatureMeasurement(featureMeasurements) {
    const phaseFeatureMeasurement = featureMeasurements?.find(isPhaseTypeFeatureMeasurement);
    if (!phaseFeatureMeasurement) {
        throw new Error(`Invalid feature measurement collection, must have an phase feature measurement`);
    }
    return phaseFeatureMeasurement;
}
/**
 * Searches Feature Measurements for the Phase Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns Phase FeatureMeasurementValue or undefined if not found
 */
export function findPhaseFeatureMeasurementValue(featureMeasurements) {
    const fm = findPhaseFeatureMeasurement(featureMeasurements);
    return fm.measurementValue;
}
/**
 * Searches Feature Measurements for the Rectilinearity Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns Rectilinearity FeatureMeasurementValue or undefined if not found
 */
export function findRectilinearityFeatureMeasurementValue(featureMeasurements) {
    const fm = featureMeasurements.find(isRectilinearityFeatureMeasurement);
    return fm ? fm.measurementValue : undefined;
}
/**
 * Searches Feature Measurements for the Emergence_Angle Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns Emergence_Angle FeatureMeasurementValue or undefined if not found
 */
export function findEmergenceAngleFeatureMeasurementValue(featureMeasurements) {
    const fm = featureMeasurements.find(isEmergenceAngleFeatureMeasurement);
    return fm ? fm.measurementValue : undefined;
}
/**
 * Searches Feature Measurements for the ShortPeriodFirstMotion Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns SHORT_PERIOD_FIRST_MOTION FeatureMeasurementValue or undefined if not found
 */
export function findShortPeriodFirstMotionFeatureMeasurementValue(featureMeasurements) {
    const fm = featureMeasurements.find(isShortPeriodFirstMotionFeatureMeasurement);
    return fm ? fm.measurementValue : undefined;
}
/**
 * Searches Feature Measurements for the LongPeriodFirstMotion Feature Measurement Value
 *
 * @param featureMeasurements List of feature measurements
 *
 *
 * @returns LongPeriodFirstMotion FeatureMeasurementValue or undefined if not found
 */
export function findLongPeriodFirstMotionFeatureMeasurementValue(featureMeasurements) {
    const fm = featureMeasurements.find(isLongPeriodFirstMotionFeatureMeasurement);
    return fm ? fm.measurementValue : undefined;
}
/**
 * Finds the phase from the current hypothesis, phase feature measurement value.
 *
 * @param signalDetection the signal detection we need the phase from
 * @returns a phase value
 */
export function findSignalDetectionPhase(signalDetection) {
    const hypothesis = getCurrentHypothesis(signalDetection.signalDetectionHypotheses);
    return findPhaseFeatureMeasurementValue(hypothesis.featureMeasurements)?.value;
}
/**
 * Given a SD, returns the azimuth and slowness values from the current SDH
 *
 * @param signalDetection
 * @returns azimuth and slowness number values or undefined
 */
export const getAzimuthAndSlownessFromSD = (signalDetection) => {
    if (!signalDetection)
        return undefined;
    const currentSdHypothesis = getCurrentHypothesis(signalDetection.signalDetectionHypotheses);
    const fmAzimuth = findAzimuthFeatureMeasurementValue(currentSdHypothesis.featureMeasurements);
    const fmSlowness = findSlownessFeatureMeasurementValue(currentSdHypothesis.featureMeasurements);
    if (!fmAzimuth || !fmSlowness)
        return undefined;
    return {
        azimuth: fmAzimuth.measuredValue.value,
        slowness: fmSlowness.measuredValue.value
    };
};
/**
 * Gets a partial filter definition by filter definition usage object for the given signal detection.
 * The resulting object contains the various named filters that should be applied to any associated waveform.
 *
 * @param signalDetection the signal detection to search
 * @returns a partial record of filter definitions by filter definition usage
 */
export const getFilterDefinitionByFilterDefinitionUsageFromSignalDetection = (signalDetection) => {
    const result = {};
    const arrivalTimeAnalysisWaveform = findArrivalTimeAnalysisWaveform(signalDetection);
    if (arrivalTimeAnalysisWaveform?.filterDefinitionUsage &&
        arrivalTimeAnalysisWaveform?.filterDefinition) {
        result[arrivalTimeAnalysisWaveform.filterDefinitionUsage] =
            arrivalTimeAnalysisWaveform.filterDefinition;
    }
    // Get the amplitude analysis filter definition
    const currentHypothesis = getCurrentHypothesis(signalDetection.signalDetectionHypotheses);
    const amplitudeFeatureMeasurements = findAmplitudeFeatureMeasurements(currentHypothesis.featureMeasurements);
    //! When amplitude feature measurements are bridged there will be more then one amplitude FM
    //! we will need to add a qualifier here to find the correct one
    const amplitudeAnalysisWaveform = amplitudeFeatureMeasurements.find(amplitudeFeatureMeasurement => amplitudeFeatureMeasurement.analysisWaveform?.filterDefinition &&
        amplitudeFeatureMeasurement.analysisWaveform?.filterDefinitionUsage)?.analysisWaveform;
    // Add the first found amplitude analysis waveform's filter definition to the result
    if (amplitudeAnalysisWaveform?.filterDefinitionUsage &&
        amplitudeAnalysisWaveform?.filterDefinition) {
        result[amplitudeAnalysisWaveform.filterDefinitionUsage] =
            amplitudeAnalysisWaveform.filterDefinition;
    }
    return result;
};
/**
 * @returns List of signal detections whose phases are considered "key activity phases"
 * or require review via the analyst configuration
 */
export const getReviewableSignalDetections = (signalDetections, reviewablePhases) => {
    if (!reviewablePhases)
        return [];
    return signalDetections.filter(sd => {
        const phase = findSignalDetectionPhase(sd);
        const reviewablePhasesForStation = reviewablePhases[sd.station.name] ?? [];
        return reviewablePhasesForStation.includes(phase);
    });
};
export const getKeyActivityPhaseSignalDetections = (signalDetections, 
/** Taken from ProcessingAnalystConfiguration */
keyActivityPhases) => {
    return signalDetections.filter(sd => {
        const phase = findSignalDetectionPhase(sd);
        return keyActivityPhases.includes(phase);
    });
};
//# sourceMappingURL=util.js.map