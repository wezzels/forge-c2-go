import type { Timeseries, TimeseriesClaimCheck } from '../channel-segment/types';
import type { DoubleValue } from '../common/types';
import type { EntityReference, VersionReference } from '../faceted';
import type { AutoRegressiveFilterDefinition, CascadeFilterDefinition, FilterDefinition, LinearFilterDefinition, PhaseMatchFilterDefinition } from '../filter';
import type { ArrivalTimeFeatureMeasurement } from '../signal-detection';
import type { Channel, OrientationAngles } from '../station-definitions/channel-definitions';
import type { Station } from '../station-definitions/station-definitions';
import type { Waveform } from '../waveform/types';
export declare enum FkUnits {
    FSTAT = "FSTAT",
    POWER = "POWER"
}
export interface AzimuthSlownessValues {
    azimuth: number | undefined;
    slowness: number | undefined;
}
export interface FkMeasuredValues {
    signalDetectionId: string;
    measuredValues: AzimuthSlownessValues | undefined;
    referenceTime: number | undefined;
    distanceDeg?: number;
    filterName?: string;
}
/**
 * Object containing FStat and Power for a particular measured azimuth/slowness
 */
export interface MeasuredFstatAndPower {
    fstat: number | undefined;
    power: number | undefined;
}
/**
 * Fk meta data from the COI
 */
export interface FkMetadata {
    readonly phaseType: string;
    readonly slowDeltaX: number;
    readonly slowDeltaY: number;
    readonly slowStartX: number;
    readonly slowStartY: number;
}
export interface FstatData {
    readonly azimuthWf: Waveform;
    readonly slownessWf: Waveform;
    readonly fstatWf: Waveform;
}
/**
 * Fk power spectra COI representation
 */
export interface FkPowerSpectraCOI extends Timeseries {
    readonly metadata: FkMetadata;
    readonly values: FkPowerSpectrum[];
    readonly stepSize: number;
    readonly windowLead: number;
    readonly windowLength: number;
    readonly lowFrequency: number;
    readonly highFrequency: number;
}
/**
 * Fk power spectra UI representation
 */
export interface FkPowerSpectra extends FkPowerSpectraCOI {
    readonly fstatData: FstatData;
    readonly configuration: FkSpectraTemplate;
    readonly reviewed: boolean;
}
export interface FkPowerSpectrum {
    readonly power: number[][];
    readonly fstat: number[][];
    readonly quality: number;
    readonly attributes: OldFkAttributes[];
}
export interface AzimuthSlowness {
    readonly azimuth: number;
    readonly slowness: number;
    readonly azimuthUncertainty: number;
    readonly slownessUncertainty: number;
    readonly extrapolated: boolean;
}
export interface OldFkAttributes extends AzimuthSlowness {
    readonly peakFStat: number;
    readonly xSlow: number;
    readonly ySlow: number;
}
/**
 * Preview Fk at a preset FkFrequencyRange
 */
export interface FkFrequencyPreview {
    readonly frequencyBand: FkFrequencyRange;
    readonly fkSpectra: FkSpectraClaimCheck;
}
/**
 * Tracks whether a channel is used to calculate fk
 */
export interface ContributingChannelsConfiguration {
    readonly id: string;
    readonly enabled: boolean;
    readonly name: string;
}
export interface ComputeFkInput {
    readonly startTime: number;
    readonly sampleRate: number;
    readonly sampleCount: number;
    readonly channels: EntityReference<'name'>[];
    readonly windowLead: string;
    readonly windowLength: string;
    readonly lowFrequency: number;
    readonly highFrequency: number;
    readonly useChannelVerticalOffset: boolean;
    readonly phaseType: string;
    readonly normalizeWaveforms: boolean;
    readonly slowStartX?: number;
    readonly slowStartY?: number;
    readonly slowDeltaX?: number;
    readonly slowDeltaY?: number;
    readonly slowCountX?: number;
    readonly slowCountY?: number;
}
/**
 * Build FkInput for backend with configuration values to restore
 * with FkSpectra returned in fk configuration
 */
export interface FkInputWithConfiguration {
    readonly fkComputeInput: ComputeFkInput;
    readonly configuration: FkSpectraTemplate;
    readonly signalDetectionId: string;
    readonly isThumbnailRequest: boolean;
}
/** Describes both a FKSpectraWindow and FkSpectrumWindow */
export interface FkWindow {
    duration: number;
    lead: number;
}
export interface FkSpectraMetadata {
    readonly fkSpectrumWindow: FkWindow;
    readonly slownessGrid: SlownessGrid;
    readonly phase: string;
}
/**
 * Fk spectra COI representation
 */
export interface FkSpectraCOI extends Timeseries {
    readonly fkSpectraMetadata?: FkSpectraMetadata;
    readonly samples: FkSpectrum[];
}
/**
 * Fk spectra with UI representation
 */
export interface FkSpectraClaimCheck extends TimeseriesClaimCheck {
    readonly configuration: FkSpectraTemplate;
    /** Tracking the accepted configuration, need to know on a new compute if params changed so can be reverted */
    readonly _uiAcceptedConfiguration?: FkSpectraTemplate;
}
/**
 * Object containing various UI-required flags related to an {@link FkSpectraClaimCheck}
 *
 * Used as the value of a Record<signalDetectionId, UiFkMetadata> object to
 * denote what aspects of a Signal Detection FK are being computed without
 * compromising re-memoizations.
 */
export interface UiFkMetadata {
    /** indicates if an fk spectra is computing, useful to trigger loading icons and non-ideals */
    readonly fkSpectraIsComputing: boolean;
    /** indicates if fk spectra previews are computing, useful to trigger loading icons and non-ideals */
    readonly fkSpectraPreviewsComputing: boolean;
    /** indicates if an fk beam is computing, useful to trigger loading icons and non-ideals */
    readonly fkBeamIsComputing: boolean;
    /** original arrival time for last computed PRIMARY FK. Used for determining when to recompute on retime */
    readonly primaryFkArrivalTime?: ArrivalTimeFeatureMeasurement;
    /** original arrival time for last computed FK PREVIEWS. Used for determine when to recompute on retime. */
    readonly previewFkArrivalTime?: ArrivalTimeFeatureMeasurement;
    /** If true, FK has been reviewed */
    readonly fkReviewed: boolean;
}
/**
 * Pixels widths of available thumbnail sizes
 */
export declare enum FkThumbnailSize {
    SMALL = 80,
    MEDIUM = 120,
    LARGE = 160
}
export interface FkSpectrum {
    readonly power: number[][];
    readonly fstat: number[][];
    readonly fkQual?: number;
    readonly fkAttributes?: FkAttributes;
}
export interface FkAttributes {
    readonly peakFStat: number;
    readonly peakPower: number;
    readonly receiverToSourceAzimuth: DoubleValue;
    readonly slowness: DoubleValue;
}
/**
 * FK Spectra Template Definition Components
 */
export interface SlownessGrid {
    maxSlowness: number;
    numPoints: number;
}
export interface FkWaveformSampleRate {
    waveformSampleRateHz: number;
    waveformSampleRateToleranceHz: number;
}
export interface FkFrequencyRange {
    lowFrequencyHz: number;
    highFrequencyHz: number;
}
export interface FkFrequencyRangeWithPrefilter extends FkFrequencyRange {
    previewPreFilterDefinition: FilterDefinition | LinearFilterDefinition | CascadeFilterDefinition | PhaseMatchFilterDefinition | AutoRegressiveFilterDefinition;
}
export declare enum FkUncertaintyOption {
    EMPIRICAL = "EMPIRICAL",
    EXPONENTIAL_SIGNAL_COHERENCE = "EXPONENTIAL_SIGNAL_COHERENCE",
    OBSERVED_SIGNAL_COHERENCE = "OBSERVED_SIGNAL_COHERENCE",
    PERFECT_SIGNAL_COHERENCE = "PERFECT_SIGNAL_COHERENCE"
}
export declare enum TaperFunction {
    BLACKMAN = "BLACKMAN",
    COSINE = "COSINE",
    HAMMING = "HAMMING",
    HANNING = "HANNING",
    PARZEN = "PARZEN",
    WELCH = "WELCH"
}
export interface FkSpectraParameters {
    phase: string;
    preFilter: FilterDefinition | undefined;
    slownessGrid: SlownessGrid;
    fkSpectrumWindow: FkWindow;
    fkFrequencyRange: FkFrequencyRange;
    waveformSampleRate: FkWaveformSampleRate;
    spectrumStepDuration: number;
    orientationAngleToleranceDeg: number;
    minimumWaveformsForSpectra: number;
    normalizeWaveforms: boolean;
    twoDimensional: boolean;
    fftTaperFunction: TaperFunction;
    fkUncertaintyOption: FkUncertaintyOption;
    fftTaperPercent: number;
}
export interface FkSpectraDefinition {
    orientationAngles: OrientationAngles;
    fkParameters: FkSpectraParameters;
}
export interface FkSpectraTemplate {
    inputChannels: EntityReference<'name', Channel>[];
    fkSpectraParameters: FkSpectraParameters;
    fkSpectraWindow: FkWindow;
    station: VersionReference<'name', Station>;
    phaseType: string;
}
export type FkSpectraTemplatesByStationByPhase = Record<string, Record<string, FkSpectraTemplate>>;
export type FkReviewablePhasesByStation = Record<string, string[]>;
export type FkReviewablePhasesByActivityNameByStation = Record<string, FkReviewablePhasesByStation>;
//# sourceMappingURL=types.d.ts.map