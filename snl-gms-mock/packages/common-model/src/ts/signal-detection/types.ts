import type {
  ChannelSegment,
  ChannelSegmentDescriptor,
  ChannelSegmentFaceted,
  Timeseries
} from '../channel-segment/types';
import type { DoubleValue, Units } from '../common/types';
import type { MagnitudeType } from '../event/types';
import type { EntityReference, Faceted, VersionReference } from '../faceted';
import type { FilterDefinition, FilterDefinitionUsage } from '../filter';
import type { Channel } from '../station-definitions/channel-definitions/channel-definitions';
import type { Station } from '../station-definitions/station-definitions/station-definitions';

/**
 * Enumeration of feature measurement type names
 */
export enum FeatureMeasurementType {
  AMPLITUDE_ALR_OVER_2 = 'AMPLITUDE_ALR_OVER_2',
  AMPLITUDE_ANL_OVER_2 = 'AMPLITUDE_ANL_OVER_2',
  AMPLITUDE_ANP_OVER_2 = 'AMPLITUDE_ANP_OVER_2',
  AMPLITUDE_A5_OVER_2 = 'AMPLITUDE_A5_OVER_2',
  ARRIVAL_TIME = 'ARRIVAL_TIME',
  EMERGENCE_ANGLE = 'EMERGENCE_ANGLE',
  LONG_PERIOD_FIRST_MOTION = 'LONG_PERIOD_FIRST_MOTION',
  PHASE = 'PHASE',
  RECEIVER_TO_SOURCE_AZIMUTH = 'RECEIVER_TO_SOURCE_AZIMUTH',
  RECTILINEARITY = 'RECTILINEARITY',
  ROOT_MEAN_SQUARE = 'ROOT_MEAN_SQUARE',
  SHORT_PERIOD_FIRST_MOTION = 'SHORT_PERIOD_FIRST_MOTION',
  SLOWNESS = 'SLOWNESS',
  SOURCE_TO_RECEIVER_AZIMUTH = 'SOURCE_TO_RECEIVER_AZIMUTH',
  SOURCE_TO_RECEIVER_DISTANCE = 'SOURCE_TO_RECEIVER_DISTANCE'
}

/**
 * A collection of {@link FeatureMeasurementType}s which are amplitude measurement types.
 * ! Sorted in intended display order
 */
export const amplitudeMeasurementTypes = [
  FeatureMeasurementType.AMPLITUDE_A5_OVER_2,
  FeatureMeasurementType.AMPLITUDE_ALR_OVER_2,
  FeatureMeasurementType.AMPLITUDE_ANP_OVER_2,
  FeatureMeasurementType.AMPLITUDE_ANL_OVER_2,
  FeatureMeasurementType.ROOT_MEAN_SQUARE
] as const;

/** The {@link FeatureMeasurementType}s that are amplitude measurement types; @see {@link amplitudeMeasurementTypes} */
export type AmplitudeFeatureMeasurementType = (typeof amplitudeMeasurementTypes)[number];

/** The {@link FeatureMeasurementType}s that are arrival measurement types */
export type ArrivalFeatureMeasurementType = FeatureMeasurementType.ARRIVAL_TIME;

/** The {@link FeatureMeasurementType}s that are duration measurement types */
export type DurationFeatureMeasurementType = never;

/** The {@link FeatureMeasurementType}s that are enumeration measurement types */
export type EnumerationFeatureMeasurementType =
  | FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION
  | FeatureMeasurementType.PHASE
  | FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION;

/** The {@link FeatureMeasurementType}s that are numeric measurement types */
export type NumericFeatureMeasurementType =
  | FeatureMeasurementType.EMERGENCE_ANGLE
  | FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH
  | FeatureMeasurementType.RECTILINEARITY
  | FeatureMeasurementType.SLOWNESS
  | FeatureMeasurementType.SOURCE_TO_RECEIVER_AZIMUTH
  | FeatureMeasurementType.SOURCE_TO_RECEIVER_DISTANCE;

export enum FirstMotionType {
  COMPRESSION = 'COMPRESSION',
  DILATION = 'DILATION',
  INDETERMINATE = 'INDETERMINATE'
}

export interface DurationValue {
  readonly value: number;
  readonly standardDeviation?: number;
}

export interface InstantValue {
  readonly value: number;
  readonly standardDeviation?: number;
}

/**
 * Generic value object which are the foundational building blocks to
 * the FeatureMeasurementValue definition
 */
export type ValueType = Exclude<DoubleValue, 'units'> | DurationValue | InstantValue;

/**
 * Represents Feature Measurement Value for a amplitude type.
 */
export interface AmplitudeMeasurementValue {
  readonly amplitude: number;
  readonly period?: number; // from a Java Duration, Twice the distance between the peak and trough measured
  readonly measurementTime?: number; // from a Java Instant, Time of first extrema
  readonly measurementWindowStart?: number; // from a Java Instant
  readonly measurementWindowDuration?: number; // from a Java Duration
  readonly clipped?: boolean;
  readonly units: Units;
}

/**
 * Represents Feature Measurement Value for Arrival Time FM Type.
 */
export interface ArrivalTimeMeasurementValue {
  readonly arrivalTime: InstantValue;
  readonly travelTime?: DurationValue;
}

/**
 * Represents Feature Measurement Value for Duration FM Type
 */
export interface DurationMeasurementValue {
  readonly startTime: InstantValue;
  readonly duration: DurationValue;
}

/**
 * Represents Feature Measurement Value for enumerated types
 */
export interface EnumeratedMeasurementValue {
  readonly value: FirstMotionType | string;
  readonly confidence?: number;
  readonly referenceTime?: number;
}

/**
 * Represents Feature Measurement Value for a numeric type.
 */
export interface NumericMeasurementValue {
  readonly measuredValue: DoubleValue;
  readonly referenceTime?: number;
}

/**
 * Represents Feature Measurement Value for a phase type.
 */
export interface PhaseTypeMeasurementValue extends EnumeratedMeasurementValue {
  readonly value: string;
}

/**
 * Represents Feature Measurement Value for first motion types
 */
export interface FirstMotionMeasurementValue extends EnumeratedMeasurementValue {
  readonly value: FirstMotionType;
}

/**
 * Represents Feature Measurement Value (fields are dependent on type of FM)
 */
export type FeatureMeasurementValue =
  | AmplitudeMeasurementValue
  | ArrivalTimeMeasurementValue
  | DurationMeasurementValue
  | NumericMeasurementValue
  | EnumeratedMeasurementValue;

export interface WaveformAndFilterDefinition {
  readonly filterDefinitionUsage?: FilterDefinitionUsage;
  readonly filterDefinition?: FilterDefinition;
  readonly waveform: ChannelSegmentFaceted;
}

/**
 * Represents a measurement of a signal detection feature,
 * including arrival time, azimuth, slowness and phase
 */
export interface FeatureMeasurement {
  readonly channel: VersionReference<'name', Channel> | Channel;
  readonly measuredChannelSegment?: {
    readonly id: ChannelSegmentDescriptor;
  };
  readonly measurementValue: FeatureMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType;
  /** Signal to Noise Ratio as a DoubleValue */
  readonly snr?: DoubleValue;
  /** Only defined in ArrivalTime FM when derived from filter def */
  readonly analysisWaveform?: WaveformAndFilterDefinition;
}

export interface AmplitudeALROver2FeatureMeasurement extends FeatureMeasurement {
  readonly measuredValue: AmplitudeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.AMPLITUDE_ALR_OVER_2;
}

export interface AmplitudeANLOver2FeatureMeasurement extends FeatureMeasurement {
  readonly measuredValue: AmplitudeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.AMPLITUDE_ANL_OVER_2;
}

export interface AmplitudeANPOver2FeatureMeasurement extends FeatureMeasurement {
  readonly measuredValue: AmplitudeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.AMPLITUDE_ANP_OVER_2;
}

export interface AmplitudeA5Over2FeatureMeasurement extends FeatureMeasurement {
  readonly measuredValue: AmplitudeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.AMPLITUDE_A5_OVER_2;
}

export interface ArrivalTimeFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: ArrivalTimeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.ARRIVAL_TIME;
}

export interface EmergenceAngleFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: NumericMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.EMERGENCE_ANGLE;
}

export interface LongPeriodFirstMotionFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: FirstMotionMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION;
}

export interface PhaseTypeFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: PhaseTypeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.PHASE;
}

export interface ReceiverToSourceAzimuthFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: NumericMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH;
}

export interface RectilinearityFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: NumericMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.RECTILINEARITY;
}

export interface RootMeanSquareFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: AmplitudeMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.ROOT_MEAN_SQUARE;
}

export interface ShortPeriodFirstMotionFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: FirstMotionMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION;
}

export interface SlownessFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: NumericMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.SLOWNESS;
}

export interface SourceToReceiverAzimuthFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: NumericMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.SOURCE_TO_RECEIVER_AZIMUTH;
}

export interface SourceToReceiverDistanceFeatureMeasurement extends FeatureMeasurement {
  readonly measurementValue: NumericMeasurementValue;
  readonly featureMeasurementType: FeatureMeasurementType.SOURCE_TO_RECEIVER_DISTANCE;
}

export type AmplitudeFeatureMeasurement =
  | AmplitudeALROver2FeatureMeasurement
  | AmplitudeANLOver2FeatureMeasurement
  | AmplitudeANPOver2FeatureMeasurement
  | AmplitudeA5Over2FeatureMeasurement
  | RootMeanSquareFeatureMeasurement;

export type DurationFeatureMeasurement = never;

export type EnumerationFeatureMeasurement =
  | LongPeriodFirstMotionFeatureMeasurement
  | PhaseTypeFeatureMeasurement
  | ShortPeriodFirstMotionFeatureMeasurement;

export type NumericFeatureMeasurement =
  | EmergenceAngleFeatureMeasurement
  | ReceiverToSourceAzimuthFeatureMeasurement
  | RectilinearityFeatureMeasurement
  | SlownessFeatureMeasurement
  | SourceToReceiverAzimuthFeatureMeasurement
  | SourceToReceiverDistanceFeatureMeasurement;

export type AzimuthFeatureMeasurement =
  | ReceiverToSourceAzimuthFeatureMeasurement
  | SourceToReceiverAzimuthFeatureMeasurement;

/**
 * Signal detection hypothesis id interface
 */
export interface SignalDetectionHypothesisId {
  readonly id: string;
  readonly signalDetectionId: string;
}

/**
 * Faceted Signal Detection Hypothesis
 */
export interface SignalDetectionHypothesisFaceted {
  readonly id: SignalDetectionHypothesisId;
}

/**
 * Signal detection hypothesis interface used in Signal detection
 */
export interface SignalDetectionHypothesis extends Faceted<SignalDetectionHypothesisFaceted> {
  readonly monitoringOrganization: string;
  readonly deleted: boolean;
  readonly station: VersionReference<'name', Station> | Station;
  readonly featureMeasurements: FeatureMeasurement[];
  readonly parentSignalDetectionHypothesis?: SignalDetectionHypothesisFaceted | null;
}

/**
 * Tracks the location defining values; what values are marked as defining for event location computation.
 * !tracks what has changed since the last computation
 */
export interface LocationDefining {
  /** true if arrival time is defining */
  readonly arrivalTime?: boolean;
  /** true if slowness is defining */
  readonly slowness?: boolean;
  /** true if azimuth is defining */
  readonly azimuth?: boolean;
}

/**
 * Tracks the location defining values; what values are marked as defining for event location computation.
 * !tracks what has changed since the last computation
 * !the unsaved changes is used to force undo/redo changes so that immer patches are properly produced
 */
export interface LocationDefiningWithChanges extends LocationDefining {
  /** true if arrival time is defining */
  readonly arrivalTime?: boolean;
  /** true if slowness is defining */
  readonly slowness?: boolean;
  /** true if azimuth is defining */
  readonly azimuth?: boolean;
  /** indicates has unsaved changes: the number represents the last time it was changed (epoch seconds) */
  readonly _uiHasUnsavedChanges: number;
}

/**
 * Tracks the magnitude defining values; what values are marked as defining for magnitude estimation.
 * !tracks what has changed since the last computation
 */
export interface MagnitudeDefining {
  readonly defining: Partial<Record<MagnitudeType, boolean>>;
}

/**
 * Tracks the magnitude defining values; what values are marked as defining for magnitude estimation.
 * !tracks what has changed since the last computation
 * !the unsaved changes is used to force undo/redo changes so that immer patches are properly produced
 */
export interface MagnitudeDefiningWithChanges extends MagnitudeDefining {
  /** indicates has unsaved changes: the number represents the last time it was changed (epoch seconds) */
  readonly _uiHasUnsavedChanges: number;
}

/**
 * Represents a Signal detection
 */
export interface SignalDetection {
  readonly id: string;
  readonly monitoringOrganization: string;
  readonly station: EntityReference<'name', Station>;
  readonly signalDetectionHypotheses: SignalDetectionHypothesis[];
  /** indicates if a signal detection has unsaved changes: the number represents the last time it was changed (epoch seconds) */
  readonly _uiHasUnsavedChanges?: number;
  /** indicates if a signal detection has unsaved association changes: the number represents the last time it was changed (epoch seconds) */
  readonly _uiHasUnsavedEventSdhAssociation?: number;
  // TODO: Migrate these FK properties to UiFkMetadata?
  /** the current FK channel segment descriptor id */
  readonly _uiFkChannelSegmentDescriptorId?: ChannelSegmentDescriptor;
  /** the current FK beam channel segment descriptor id */
  readonly _uiFkBeamChannelSegmentDescriptorId?: ChannelSegmentDescriptor;
  /** indicates if an fk has ever been accepted by the analyst key for knowing when can revert */
  readonly _uiHasAcceptedFk?: boolean;
  /**
   * A record by unique {@link EventId} by {@link SignalDetectionIdString} for mapping
   * the analyst modified location {@link LocationDefiningWithChanges} values.
   *
   * Used to track any changes to the {@link LocationDefiningWithChanges} values between location computations.
   */
  readonly _uiLocationDefining?: LocationDefiningWithChanges;
  /**
   * A record by unique {@link EventId} by {@link SignalDetectionIdString} for mapping
   * the analyst modified magnitude {@link MagnitudeDefiningWithChanges} values.
   *
   * Used to track any changes to the {@link MagnitudeDefiningWithChanges} values between magnitude computations.
   */
  readonly _uiMagnitudeDefining?: MagnitudeDefiningWithChanges;
}

export type SignalDetectionIdString = SignalDetection['id'];

export interface SignalDetectionsWithChannelSegments {
  readonly signalDetections: SignalDetection[];
  readonly channelSegments: ChannelSegment<Timeseries>[];
}

/**
 * Basic info for a hypothesis
 */
export interface ConflictingSdHypData {
  readonly eventId: string;
  readonly phase: string;
  readonly arrivalTime: number;
  readonly stationName?: string;
  readonly eventTime?: number;
}

/**
 * Signal Detection Status either deleted or
 * association status to event
 */
export enum SignalDetectionStatus {
  OPEN_ASSOCIATED = 'Open',
  COMPLETE_ASSOCIATED = 'Completed',
  OTHER_ASSOCIATED = 'Other',
  UNASSOCIATED = 'Unassociated',
  DELETED = 'Deleted'
}

export interface SignalDetectionAssociationStatus {
  readonly signalDetectionId: string;
  readonly associationStatus: SignalDetectionStatus;
}
