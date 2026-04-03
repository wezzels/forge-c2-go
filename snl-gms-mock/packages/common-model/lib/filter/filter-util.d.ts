import type { FilterTypes } from '../common-model';
import type { Maybe } from '../type-util/type-util';
import type { Waveform } from '../waveform/types';
import type { AutoRegressiveFilterDefinition, AutoRegressiveFilterDescription, AutoRegressiveFilterParameters, BaseAutoregressiveFilterParameters, CascadeFilterDefinition, CascadeFilterDescription, CascadeFilterParameters, Filter, FilterDefinition, FilterDefinitionRealization, FilterDefinitionType, FilterDescription, FilterDescriptionType, IirFilterParameters, LinearFilterDefinition, LinearFilterDescription, LinearFilterParameters, Parameters, PhaseMatchFilterDefinition, PhaseMatchFilterDescription, PhaseMatchFilterParameters } from './types';
/**
 * Gets the unique id for a filter, which is its name, or `unfiltered`.
 *
 * @param filter the filter from which to get the id. If undefined, will return `unfiltered`
 * @param fallbackFilterName the filter name to fallback on if one is not found, falls back
 * to 'unfiltered' which is not necessarily the default filter
 */
export declare const getFilterName: (filter: Filter | undefined, fallbackFilterName?: string) => string;
export declare const getNamedFilterName: (filter: Filter | undefined, fallbackFilterName?: string) => string;
/**
 * Type guard to check and see if an error is a FilterError type
 */
export declare const isFilterError: (e: Error) => e is FilterTypes.FilterError;
/**
 * Test if the object is a LinearFilterParameter
 * @param object an object that may be a LinearFilterParameter
 * @returns true if the object is a LinearFilterParameter
 */
export declare function isLinearFilterParameters(object: Maybe<Parameters>): object is LinearFilterParameters;
/**
 * Test if the object is a CascadeFilterParameter
 * @param object an object that may be a CascadeFilterParameter
 * @returns true if the object is a CascadeFilterParameter
 */
export declare function isCascadeFilterParameters(object: Maybe<Parameters>): object is CascadeFilterParameters;
/**
 * Test if the object is BaseAutoregressiveFilterParameters
 * @param object an object that may be BaseAutoregressiveFilterParameters
 * @returns true if the object is BaseAutoregressiveFilterParameters
 */
export declare function isBaseAutoregressiveFilterParameters(object: Maybe<Parameters>): object is BaseAutoregressiveFilterParameters;
/**
 * Test if the object is AutoRegressiveFilterParameters
 * @param object an object that may be AutoRegressiveFilterParameters
 * @returns true if the object is AutoRegressiveFilterParameters
 */
export declare function isAutoregressiveFilterParameters(object: Maybe<Parameters>): object is AutoRegressiveFilterParameters;
/**
 * Test if the object is PhaseMatchFilterParameters
 * @param object an object that may be PhaseMatchFilterParameters
 * @returns true if the object is PhaseMatchFilterParameters
 */
export declare function isPhaseMatchFilterParameters(object: Maybe<Parameters>): object is PhaseMatchFilterParameters;
/**
 * Test if the object is a CascadeFilterParameter
 * @param object
 * @returns
 */
export declare function isPhaseMatchFilterDefinition(object: FilterDefinitionType): object is PhaseMatchFilterDefinition;
/**
 * Test if the object is a AutoRegressiveFilterDefinition
 * @param object
 * @returns
 */
export declare function isAutoRegressiveFilterDefinition(object: FilterDefinitionType): object is AutoRegressiveFilterDefinition;
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export declare function isLinearFilterDefinition(object: FilterDefinitionType): object is LinearFilterDefinition;
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export declare function isIirFilterParameters(object: LinearFilterParameters | undefined): object is IirFilterParameters;
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export declare function isLinearIirOtherFilterDefinition(object: FilterDefinitionType): object is LinearFilterDefinition;
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export declare function isLinearIirButterworthFilterDefinition(object: FilterDefinitionType): object is LinearFilterDefinition;
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export declare function isLinearFirHammingFilterDefinition(object: FilterDefinitionType): object is LinearFilterDefinition;
/**
 * Test if the object is a CascadeFilterDefinition
 * @param object
 * @returns
 */
export declare function isCascadeFilterDefinition(object: FilterDefinitionType): object is CascadeFilterDefinition;
/**
 * Test if the object is a CascadeFilterDefinition with a phase match filter inside
 * @param object the filter to check
 * @returns true if the filter is a CASCADE filter that has a PHASE_MATCH filter within it
 */
export declare function isCascadeFilterDefinitionWithPhaseMatchFilter(object: FilterDefinitionType): boolean;
/**
 * Test if the object is a FilterDefinition
 * @param object
 * @returns
 */
export declare function isFilterDefinition(object: FilterDefinition | Record<string, any> | undefined | null): object is FilterDefinition;
/**
 * Test if the object is a LinearFilterDescription
 * @param object
 * @returns
 */
export declare function isLinearFilterDescription(object: FilterDescriptionType): object is LinearFilterDescription;
/**
 * Test if the provided Filter Parameters are IirFilterParameters, from an IIR Custom filter.
 */
export declare function isIirCustomLinearFilterParameters(object: Parameters | undefined | null): object is FilterTypes.IirFilterParameters;
export declare function getLinearFilterFromDescription(object: LinearFilterDescription): Filter;
export declare function getCascadeFilterFromDescription(object: CascadeFilterDescription): Filter;
export declare function getAutoRegressiveFilterFromDescription(object: AutoRegressiveFilterDescription): Filter;
export declare function getPhaseMatchFilterFromDescription(object: PhaseMatchFilterDescription): Filter;
/**
 * Test if the object is a CascadeFilterDescription
 * @param object
 * @returns
 */
export declare function isCascadeFilterDescription(object: FilterDescriptionType): object is CascadeFilterDescription;
/**
 * Test if the object is a PhaseMatchFilterDescription
 * @param object
 * @returns
 */
export declare function isPhaseMatchFilterDescription(object: FilterDescriptionType): object is PhaseMatchFilterDescription;
/**
 * Test if the object is a AutoRegressiveFilterDescription
 * @param object
 * @returns
 */
export declare function isAutoRegressiveFilterDescription(object: FilterDescriptionType): object is AutoRegressiveFilterDescription;
/**
 * Create a Channel Filter from a filter definition
 * @param withinHotKeyCycle boolean
 * @param filterDefinition filter definition to use in channel filter
 */
export declare function createChannelFilterFromFilterDefinition(withinHotKeyCycle: boolean, filterDefinition: FilterDefinition): Filter;
/**
 * Test if the object is a type compatible with {@link FilterDefinitionRealization}
 *
 * @param object the object to check
 * @returns true if the type is compatible
 */
export declare function isFilterDefinitionRealization(object: FilterDefinitionType): object is FilterDefinitionRealization;
/**
 * Assert the object is {@link FilterDefinitionRealization} or throw
 * @param object the object to check
 */
export declare function assertIsFilterDefinitionRealization(object: FilterDefinition): asserts object is FilterDefinitionRealization;
/**
 * Check if a filter can be designed.
 *
 * Autoregressive filters and Cascade Filters containing AR filters may not be designed.
 */
export declare function isDesignableFilter(filterDefinition: FilterDefinition): boolean;
/**
 * Check if a filter can be pre-designed.
 *
 * Autoregressive filters and Cascade Filters containing AR or Phase Match filters may not be designed
 * Phase Match filters can only be designed along with the waveform they are applied to, meaning they cannot be pre-designed.
 */
export declare function isPreDesignableFilter(filterDefinition: FilterDefinition): boolean;
/**
 * Throws an error if the nyquist frequency is such that the waveform cannot be filtered.
 *
 * The Nyquist theorem states that an analog signal can be digitized without aliasing error if and only if
 * the sampling rate is greater than or equal to twice the highest frequency component in a given signal.
 *
 * @param filterDescription a filter description containing a highFrequencyHz
 * @param waveform used to gather the sampleRateHz being applied
 */
export declare function assertNyquistFrequency(filterDescription: FilterDescription, waveform: Waveform): void;
//# sourceMappingURL=filter-util.d.ts.map