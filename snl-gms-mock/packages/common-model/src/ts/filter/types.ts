import type { ChannelSegmentDescriptor } from '../channel-segment';
import type { DoubleValue, Location } from '../common';
import type { EventLocation } from '../event/types';
import type { SignalDetectionHypothesis } from '../signal-detection';
import type { FrequencyAmplitudePhase } from '../station-definitions/response-definitions/response-definitions';
import type { Only, RequireOnlyOne } from '../type-util/type-util';
import type { WorkflowDefinitionId } from '../workflow/types';

export interface FilterListsDefinition {
  preferredFilterListByActivity: FilterListActivity[];
  filterLists: FilterList[];
}
export interface FilterListActivity {
  name: string;
  workflowDefinitionId: WorkflowDefinitionId;
}
export interface FilterList {
  name: string;
  defaultFilterIndex: number;
  filters: Filter[];
}

/**
 * Filter definition usage processing configuration enums. These correspond to the names of the named filters.
 */
export enum FilterDefinitionUsage {
  /**
   * Named filter that corresponds to the filter definition that was used when this signal detection was initially created
   */
  DETECTION = 'DETECTION',

  /**
   * Named filter that corresponds to the filter definition that was used when the FK peak was chosen, resulting in the creation of the FK beam
   */
  FK = 'FK',

  /**
   * Named filter that corresponds to the filter definition that was used when this signal detection was last modified
   */
  ONSET = 'ONSET',

  /**
   * Named filter that corresponds to the filter definition that was used when the amplitude was measured
   */
  AMPLITUDE = 'AMPLITUDE'
}

/**
 * The FilterDefinitions for realized FilterDescriptions. We need this in order to ensure
 * that we are using FilterDescriptions that contain realized FilterDescriptions, and not
 * just the abstract FilterDescription interface.
 *
 * A FilterDefinition object represents a description of a Waveform filter and may also
 * contain the actual parameters that a filtering algorithm can use to filter a Waveform.
 *
 * The FilterDescription realizations are:
 *
 * LinearFilterDescription - these filter descriptions represent linear filters.
 * AutoregressiveFilterDescription - these filter descriptions represent autoregressive filters.
 * PhaseMatchFilterDescription - these filter descriptions represent phase match filters.
 * CascadeFilterDescription - these filter descriptions represent a series of filters applied in order to a Waveform.
 */
export type FilterDefinitionRealization =
  | LinearFilterDefinition
  | CascadeFilterDefinition
  | AutoRegressiveFilterDefinition
  | PhaseMatchFilterDefinition;

export interface BaseFilter {
  withinHotKeyCycle: boolean;

  /** indicates that the description should be formatted as an error state */
  _uiIsError?: boolean;

  /** unique id given to user created filters to prevent conflict on editing */
  _uiId?: string;
}

export type Filter = BaseFilter &
  RequireOnlyOne<{
    // ! exactly one of unfiltered, filterDefinition, namedFilter must be populated
    unfiltered: boolean;
    namedFilter: FilterDefinitionUsage;
    filterDefinition: FilterDefinitionRealization;
  }>;

export enum FilterType {
  CASCADE = 'CASCADE',
  AUTOREGRESSIVE = 'AUTOREGRESSIVE',
  LINEAR = 'LINEAR',
  PHASE_MATCH = 'PHASE_MATCH'
}

export enum BandType {
  LOW_PASS = 'LOW_PASS',
  HIGH_PASS = 'HIGH_PASS',
  BAND_PASS = 'BAND_PASS',
  BAND_REJECT = 'BAND_REJECT'
}

/**
 * Instance of one of the classes specializing the FilterDescription generalization
 * (e.g. LinearFilterDescription, CascadeFilterDescription, etc.)
 *
 * The FilterDescription realizations are:
 *
 * LinearFilterDescription - these filter descriptions represent linear filters.
 * AutoregressiveFilterDescription - these filter descriptions represent autoregressive filters.
 * PhaseMatchFilterDescription - these filter descriptions represent phase match filters.
 * CascadeFilterDescription - these filter descriptions represent a series of filters applied in order to a Waveform.
 */
export type FilterDescriptionRealization =
  | LinearFilterDescription
  | CascadeFilterDescription
  | AutoRegressiveFilterDescription
  | PhaseMatchFilterDescription;

export interface FilterDefinition {
  name: string;
  comments?: string;
  filterDescription: FilterDescriptionRealization;
}

export interface LinearFilterDefinition extends FilterDefinition {
  filterDescription: LinearFilterDescription;
}

export interface AutoRegressiveFilterDefinition extends FilterDefinition {
  filterDescription: AutoRegressiveFilterDescription;
}

export interface PhaseMatchFilterDefinition extends FilterDefinition {
  filterDescription: PhaseMatchFilterDescription;
}

export interface CascadeFilterDefinition extends FilterDefinition {
  filterDescription: CascadeFilterDescription;
}

export type Parameters =
  | LinearFilterParameters
  | IirFilterParameters
  | FirFilterParameters
  | AutoRegressiveFilterParameters
  | PhaseMatchFilterParameters
  | CascadeFilterParameters;

export interface FilterDescription {
  filterType: FilterType;
  comments?: string;
  causal: boolean;
  correctGroupDelay: boolean;
  response?: FrequencyAmplitudePhase;
  parameters?: Parameters;
}

export interface LinearFilterParameters {
  sampleRateHz: number;
  sampleRateToleranceHz: number;
  groupDelaySec: number;
}

export type FirFilterParameters = LinearFilterParameters &
  Only<
    {
      transferFunctionBCoefficients: number[];
    },
    // do not allow IIR parameter types
    { sosNumeratorCoefficients: number[]; sosDenominatorCoefficients: number[] }
  >;

export type IirFilterParameters = LinearFilterParameters &
  Only<
    {
      sosNumeratorCoefficients: number[];
      sosDenominatorCoefficients: number[];
    },
    // do not allow FIR parameter types
    { transferFunctionBCoefficients: number[] }
  >;

export interface CascadeFilterParameters {
  sampleRateHz: number;
  sampleRateToleranceHz: number;
  groupDelaySec?: number;
}

export enum LinearFilterType {
  FIR_HAMMING = 'FIR_HAMMING',
  IIR_BUTTERWORTH = 'IIR_BUTTERWORTH',
  FIR_OTHER = 'FIR_OTHER',
  IIR_OTHER = 'IIR_OTHER'
}

export interface LinearFilterDescription extends FilterDescription {
  filterType: FilterType.LINEAR;
  lowFrequencyHz?: number;
  highFrequencyHz?: number;
  order: number;
  zeroPhase: boolean;
  passBandType: BandType;
  // if not defined, then the filter definition has not been designed
  linearFilterType: LinearFilterType;
  parameters?: Extract<
    Parameters,
    LinearFilterParameters | IirFilterParameters | FirFilterParameters
  >;
}

export interface CascadeFilterDescription extends FilterDescription {
  filterType: FilterType.CASCADE;
  parameters?: CascadeFilterParameters;
  filterDescriptions: FilterDescriptionRealization[];
}

export enum AutoregressiveType {
  N = 'N',
  N_SQUARED = 'N_SQUARED'
}

export enum AutoregressiveFilterType {
  ADAPTIVE = 'ADAPTIVE',
  NON_ADAPTIVE = 'NON_ADAPTIVE'
}

export interface BaseAutoregressiveFilterParameters {
  sampleRateHz: number;
  sampleRateToleranceHz: number;
}

export interface AutoRegressiveFilterParameters extends BaseAutoregressiveFilterParameters {
  coefficients: number[];
  noiseWindow: ChannelSegmentDescriptor;
}

export interface AutoRegressiveFilterDescription extends FilterDescription {
  filterType: FilterType.AUTOREGRESSIVE;
  order: number;
  noiseWindowDuration: number;
  noiseWindowOffset: number;
  // only unpopulated when adaptive is true
  signalWindowDuration?: number;
  signalWindowOffset: number;
  autoregressiveType: AutoregressiveType;
  autoregressiveFilterType: AutoregressiveFilterType;
  parameters?: Extract<
    Parameters,
    BaseAutoregressiveFilterParameters | AutoRegressiveFilterParameters
  >;
}

export interface TaperDefinition {
  taperDuration: number;
}

export enum TaperFunction {
  BLACKMAN = 'BLACKMAN',
  COSINE = 'COSINE',
  HAMMING = 'HAMMING',
  HANNING = 'HANNING',
  PARZEN = 'PARZEN',
  WELCH = 'WELCH'
}

export interface AmplitudePhaseResponse {
  amplitude: DoubleValue;
  phase: DoubleValue;
}

export interface DispersionModel {
  fileName: string;
  friendlyName: string;
  phase: string;
  numLatitudes: number;
  numLongitudes: number;
  gridSpacing: number;
  numPeriods: number;
  numIndices: number;
  gridIndices: number[][]; // [latitudeIndex][longitudeIndex]
  periods: number[];
  velocitiesByPeriodAndLatLon: number[][]; // [nextHighestIndex][gridIndex]
}

export interface PhaseMatchFilterParameters {
  receiverLocation: Location;
  sourceLocation: EventLocation;
}

export interface PhaseMatchFilterDescription extends FilterDescription {
  filterType: FilterType.PHASE_MATCH;
  phase: string;
  dispersionModelName: string;
  lowFrequencyHz: number;
  lowFrequencyTaperWidthHz: number;
  highFrequencyHz: number;
  highFrequencyTaperWidthHz: number;
  numFrequencies: number;
  referencePeriod: number;
  frequencyTaperFunction: TaperFunction;
  parameters?: Extract<Parameters, PhaseMatchFilterParameters>;
}
export type FilterDescriptionType = FilterDescription | undefined | null;
export type FilterDefinitionType = FilterDefinition | undefined | null;

/** A string identifying the `unfiltered` filter */
export const UNFILTERED = 'Unfiltered';

/**
 * A filter definition for an unfiltered filter, which is used as a default/fallback
 */
export const UNFILTERED_FILTER: Filter = {
  withinHotKeyCycle: true,
  unfiltered: true
};

/**
 * A Record mapping {@link FilterDefinitionUsage} literals (ie, names of named filters, such as 'ONSET', 'FK', 'DETECTION')
 * to {@link FilterDefinition} objects.
 */
export type FilterDefinitionByFilterDefinitionUsage = Record<
  FilterDefinitionUsage,
  FilterDefinitionRealization
>;

/**
 * The FilterDefinitionByUsageBySignalDetectionHypothesis interface represents the objects returned by
 * SignalEnhancementConfigurationService's getDefaultFilterDefinitionByUsageForSignalDetectionHypotheses(...)
 * operation.
 *
 * It is a JSON serialized version of a map containing keys which are {@link SignalDetectionHypothesis}
 * objects and values which are {@link FilterDefinitionByFilterDefinitionUsage} objects. Because JSON serialization
 * does not support complex objects as keys in a map, this is an object containing the signalDetectionHypothesis
 * parameter, which is the key in the map, and the filterDefinitionByFilterDefinitionUsage parameter, which
 * is the value.
 */
export interface FilterDefinitionByUsageBySignalDetectionHypothesis {
  signalDetectionHypothesis: SignalDetectionHypothesis;
  filterDefinitionByFilterDefinitionUsage: FilterDefinitionByFilterDefinitionUsage;
}

/**
 * Extends a basic Error so that we may attach metadata about the filter operation that failed.
 * This allows for more fine-grained error handling than a generic Error.
 */
export class FilterError extends Error {
  /** Always set to true, makes for simple error type checking */
  public readonly isFilterError: boolean = true;

  /** The name of the filter definition that failed */
  public filterNames: string[];

  /** The name of the channel/station on which this error was thrown */
  public channelName: string;

  /** Zero or more serialized identifiers for a channel segment */
  public channelSegmentDescriptorIds: string[] | undefined;

  public constructor(
    message: string,
    filterNames: string | string[],
    channelName: string,
    channelSegmentDescriptorId?: string | string[]
  ) {
    super(message);
    this.channelSegmentDescriptorIds =
      typeof channelSegmentDescriptorId === 'string'
        ? [channelSegmentDescriptorId]
        : channelSegmentDescriptorId;
    this.filterNames = typeof filterNames === 'string' ? [filterNames] : filterNames;
    this.channelName = channelName;
  }
}
