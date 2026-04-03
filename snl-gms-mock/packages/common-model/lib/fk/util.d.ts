import type { FkFrequencyRange, FkSpectraCOI, UiFkMetadata } from './types';
/**
 * Default collection of UI metadata
 */
export declare const defaultUiFkMetadata: UiFkMetadata;
/** Width/height of y and x axis respectively */
export declare const SIZE_OF_FK_RENDERING_AXIS_PX = 35;
/** The height of the rendering needs to be 8 pixels smaller than the width */
export declare const FK_RENDERING_HEIGHT_OFFSET = 8;
/** The width of the x axis markers needs to be 10 pixels wider than the canvas */
export declare const FK_X_AXIS_WIDTH_OFFSET = 10;
/** The height of the y axis markers needs to be 12 pixels taller than the canvas */
export declare const FK_Y_AXIS_HEIGHT_OFFSET = 12;
export declare const BEAM_TOOLBAR_WIDTH_OFFSET = -61;
/** Default Frequency Bands */
export declare const FrequencyBands: FkFrequencyRange[];
/**
 * Formats a frequency band into a string for the drop down
 *
 * @param band Frequency band to format
 */
export declare function frequencyBandToString(band: FkFrequencyRange): string;
/**
 * Creates menu options for frequency bands
 */
export declare function generateFrequencyBandOptions(): string[];
/**
 * Approximate conversion between degrees and km
 *
 * @returns Kilometer
 */
export declare function degreeToKmApproximate(degree: number): number;
/**
 * Approximate conversion between km and degrees
 *
 * @returns Degree
 */
export declare function kmToDegreesApproximate(km: number): number;
/**
 * @returns Input value in s/degree converted to km/s
 */
export declare function convertSecondsPerDegreeToKilometersPerSecond(value: number): number;
/**
 * @returns Input value in s/degree converted to s/km
 */
export declare function convertSecondsPerDegreeToSecondsPerKilometer(value: number): number;
/**
 * Recalculates the deviation as km/s when the original value was s/deg
 * @param originalValue
 * @param originalDeviation
 * @returns
 */
export declare function convertSecondsPerDegreeDeviationToKilometersPerSecond(slownessInDegree: number, originalDeviation: number): number;
/**
 * @returns a possible offset against an FK Spectra's start time based on the
 * configured spectrumStepDuration.
 */
export declare function getStartTimeOffset(referenceTime: number, fkSpectrumLead: number, fkIntervalStartTime: number, spectrumStepDuration: number): number;
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
export declare function getIndexOfReferenceTime(fkSpectra: FkSpectraCOI, referenceTimeSecs: number): number;
//# sourceMappingURL=util.d.ts.map