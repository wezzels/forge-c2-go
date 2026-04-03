/** Kilometer per degree of Earth */
const KM_PER_DEGREE = 111.19492664;
/**
 * The max offset permitted due to floating point arithmetic errors.
 * This is used to determine if the reference time is off by too much
 */
const MAX_ALLOWED_FLOATING_POINT_ERROR_FOR_REFERENCE_TIME_OFFSET = 0.0001;
/**
 * Default collection of UI metadata
 */
export const defaultUiFkMetadata = {
    fkBeamIsComputing: false,
    fkSpectraIsComputing: false,
    fkSpectraPreviewsComputing: false,
    fkReviewed: false
};
// TODO: Review to see what might make more sense as part of configuration
/** Width/height of y and x axis respectively */
export const SIZE_OF_FK_RENDERING_AXIS_PX = 35;
/** The height of the rendering needs to be 8 pixels smaller than the width */
export const FK_RENDERING_HEIGHT_OFFSET = 8;
/** The width of the x axis markers needs to be 10 pixels wider than the canvas */
export const FK_X_AXIS_WIDTH_OFFSET = 10;
/** The height of the y axis markers needs to be 12 pixels taller than the canvas */
export const FK_Y_AXIS_HEIGHT_OFFSET = 12;
export const BEAM_TOOLBAR_WIDTH_OFFSET = -61;
/** Default Frequency Bands */
export const FrequencyBands = [
    {
        lowFrequencyHz: 0.5,
        highFrequencyHz: 2
    },
    {
        lowFrequencyHz: 1,
        highFrequencyHz: 2.5
    },
    {
        lowFrequencyHz: 1.5,
        highFrequencyHz: 3
    },
    {
        lowFrequencyHz: 2,
        highFrequencyHz: 4
    },
    {
        lowFrequencyHz: 3,
        highFrequencyHz: 6
    }
];
/**
 * Formats a frequency band into a string for the drop down
 *
 * @param band Frequency band to format
 */
export function frequencyBandToString(band) {
    return `${band.lowFrequencyHz} - ${band.highFrequencyHz} Hz`;
}
/**
 * Creates menu options for frequency bands
 */
export function generateFrequencyBandOptions() {
    const items = [];
    FrequencyBands.forEach(frequency => {
        items.push(frequencyBandToString(frequency));
    });
    return items;
}
/**
 * Approximate conversion between degrees and km
 *
 * @returns Kilometer
 */
export function degreeToKmApproximate(degree) {
    const DEGREES_IN_CIRCLE = 360;
    const RAD_EARTH = 6371;
    const TWO_PI = Math.PI * 2;
    return degree / (DEGREES_IN_CIRCLE / (RAD_EARTH * TWO_PI));
}
/**
 * Approximate conversion between km and degrees
 *
 * @returns Degree
 */
export function kmToDegreesApproximate(km) {
    const DEGREES_IN_CIRCLE = 360;
    const RAD_EARTH = 6371;
    const TWO_PI = Math.PI * 2;
    return km * (DEGREES_IN_CIRCLE / (RAD_EARTH * TWO_PI));
}
/**
 * @returns Input value in s/degree converted to km/s
 */
export function convertSecondsPerDegreeToKilometersPerSecond(value) {
    if (value === 0)
        return 0;
    return KM_PER_DEGREE / value;
}
/**
 * @returns Input value in s/degree converted to s/km
 */
export function convertSecondsPerDegreeToSecondsPerKilometer(value) {
    if (value === 0)
        return 0;
    return 1 / convertSecondsPerDegreeToKilometersPerSecond(value);
}
/**
 * Recalculates the deviation as km/s when the original value was s/deg
 * @param originalValue
 * @param originalDeviation
 * @returns
 */
export function convertSecondsPerDegreeDeviationToKilometersPerSecond(slownessInDegree, originalDeviation) {
    const velocity = convertSecondsPerDegreeToKilometersPerSecond(slownessInDegree);
    const deviationInSKM = convertSecondsPerDegreeToSecondsPerKilometer(originalDeviation);
    return velocity * velocity * deviationInSKM;
}
/**
 * @returns a possible offset against an FK Spectra's start time based on the
 * configured spectrumStepDuration.
 */
export function getStartTimeOffset(referenceTime, fkSpectrumLead, fkIntervalStartTime, spectrumStepDuration) {
    return (referenceTime - fkSpectrumLead - fkIntervalStartTime) % spectrumStepDuration;
}
/**
 * Calculate the index within the spectra with a start time nearest to the provided time.
 * Internally, this rounds to get the nearest start time.
 *
 * @param fkSpectra - The FK spectra object containing start time and sample count.
 * @param timeSecs - The arrival or reference time.
 * @param spectrumStepDurationSecs - The duration of each spectrum step.
 * @returns Calculates the index of the spectrum with a *start time* nearest to the provided time.
 */
function getNearestIndexToTime(fkSpectra, timeSecs) {
    const { startTime, sampleCount } = fkSpectra;
    const spectrumStepDurationSecs = 1 / fkSpectra.sampleRateHz;
    // Always round: indices must be whole numbers
    // Rounding ensures that floating point arithmetic errors don't cause off-by-one errors
    const calculatedIndex = Math.round((timeSecs - startTime) / spectrumStepDurationSecs);
    // Take the last sample if the calculated index ends up higher than the actual sampleCount.
    const index = Math.min(calculatedIndex, sampleCount - 1);
    // Always return 0 if index comes back negative
    return Math.max(index, 0);
}
/**
 * Gets the index nearest to the provided reference time (minus the lead). Logs a warning if the reference time
 * and lead does not align with any spectrum start times, which might indicate a bug.
 *
 * @param fkSpectra - The FK spectra object containing start time and sample count.
 * @param referenceTimeSecs - The reference time to find the nearest spectrum index for.
 * @param spectrumStepDurationSecs - The duration of each spectrum step.
 * @param requestId - Optional request ID for logging purposes.
 * @returns The index of the spectrum nearest to the provided reference time.
 */
export function getIndexOfReferenceTime(fkSpectra, referenceTimeSecs) {
    const { startTime } = fkSpectra;
    const spectrumStepDurationSecs = 1 / fkSpectra.sampleRateHz;
    if (getStartTimeOffset(referenceTimeSecs, 0, startTime, spectrumStepDurationSecs) >
        MAX_ALLOWED_FLOATING_POINT_ERROR_FOR_REFERENCE_TIME_OFFSET) {
        // ! This might indicate a bug. For example, this could happen if the fkSpectra, arrivalTime, or lead is stale.
        // console needed because we don't have the right dependencies in common-model to use the system logger
        console.warn('Invalid reference time. Reference time minus lead must perfectly align with the spectrum step start times. This suggests something is wrong with the time passed in.');
    }
    return getNearestIndexToTime(fkSpectra, referenceTimeSecs);
}
//# sourceMappingURL=util.js.map