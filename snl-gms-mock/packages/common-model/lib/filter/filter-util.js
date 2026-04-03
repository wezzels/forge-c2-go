import { FilterType, LinearFilterType, UNFILTERED } from './types';
const getFilterNameIfExists = (filter) => filter?.filterDefinition?.name ?? filter?.namedFilter;
/**
 * Gets the unique id for a filter, which is its name, or `unfiltered`.
 *
 * @param filter the filter from which to get the id. If undefined, will return `unfiltered`
 * @param fallbackFilterName the filter name to fallback on if one is not found, falls back
 * to 'unfiltered' which is not necessarily the default filter
 */
export const getFilterName = (filter, fallbackFilterName = UNFILTERED) => getFilterNameIfExists(filter) ?? fallbackFilterName;
export const getNamedFilterName = (filter, fallbackFilterName = UNFILTERED) => filter?.namedFilter || filter?.filterDefinition?.name || fallbackFilterName;
/**
 * Type guard to check and see if an error is a FilterError type
 */
export const isFilterError = (e) => {
    return !!e.isFilterError;
};
/**
 * Test if the object is a LinearFilterParameter
 * @param object an object that may be a LinearFilterParameter
 * @returns true if the object is a LinearFilterParameter
 */
export function isLinearFilterParameters(object) {
    return (object != null &&
        object.sampleRateHz != null &&
        object.sampleRateToleranceHz != null);
}
/**
 * Test if the object is a CascadeFilterParameter
 * @param object an object that may be a CascadeFilterParameter
 * @returns true if the object is a CascadeFilterParameter
 */
export function isCascadeFilterParameters(object) {
    return (object != null &&
        object.sampleRateHz != null &&
        object.sampleRateToleranceHz != null);
}
/**
 * Test if the object is BaseAutoregressiveFilterParameters
 * @param object an object that may be BaseAutoregressiveFilterParameters
 * @returns true if the object is BaseAutoregressiveFilterParameters
 */
export function isBaseAutoregressiveFilterParameters(object) {
    return (object != null &&
        object.coefficients == null &&
        object.noiseWindow == null &&
        object.sampleRateHz != null &&
        object.sampleRateToleranceHz != null);
}
/**
 * Test if the object is AutoRegressiveFilterParameters
 * @param object an object that may be AutoRegressiveFilterParameters
 * @returns true if the object is AutoRegressiveFilterParameters
 */
export function isAutoregressiveFilterParameters(object) {
    return (object != null &&
        object.coefficients != null &&
        object.noiseWindow != null &&
        object.sampleRateHz != null &&
        object.sampleRateToleranceHz != null);
}
/**
 * Test if the object is PhaseMatchFilterParameters
 * @param object an object that may be PhaseMatchFilterParameters
 * @returns true if the object is PhaseMatchFilterParameters
 */
export function isPhaseMatchFilterParameters(object) {
    return (object != null &&
        object.receiverLocation != null &&
        object.sourceLocation != null);
}
/**
 * Test if the object is a CascadeFilterParameter
 * @param object
 * @returns
 */
export function isPhaseMatchFilterDefinition(object) {
    return object != null && object.filterDescription.filterType === FilterType.PHASE_MATCH;
}
/**
 * Test if the object is a AutoRegressiveFilterDefinition
 * @param object
 * @returns
 */
export function isAutoRegressiveFilterDefinition(object) {
    return object != null && object.filterDescription.filterType === FilterType.AUTOREGRESSIVE;
}
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export function isLinearFilterDefinition(object) {
    return object != null && object.filterDescription.filterType === FilterType.LINEAR;
}
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export function isIirFilterParameters(object) {
    return (object != null &&
        Object.keys(object).includes('sosNumeratorCoefficients') &&
        Object.keys(object).includes('sosDenominatorCoefficients'));
}
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export function isLinearIirOtherFilterDefinition(object) {
    return (isLinearFilterDefinition(object) &&
        object.filterDescription.linearFilterType === LinearFilterType.IIR_OTHER);
}
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export function isLinearIirButterworthFilterDefinition(object) {
    return (isLinearFilterDefinition(object) &&
        object.filterDescription.linearFilterType === LinearFilterType.IIR_BUTTERWORTH);
}
/**
 * Test if the object is a LinearFilterDefinition
 * @param object
 * @returns
 */
export function isLinearFirHammingFilterDefinition(object) {
    return (isLinearFilterDefinition(object) &&
        object.filterDescription.linearFilterType === LinearFilterType.FIR_HAMMING);
}
/**
 * Test if the object is a CascadeFilterDefinition
 * @param object
 * @returns
 */
export function isCascadeFilterDefinition(object) {
    return object != null && object.filterDescription.filterType === FilterType.CASCADE;
}
/**
 * Test if the object is a CascadeFilterDefinition with a phase match filter inside
 * @param object the filter to check
 * @returns true if the filter is a CASCADE filter that has a PHASE_MATCH filter within it
 */
export function isCascadeFilterDefinitionWithPhaseMatchFilter(object) {
    return (object?.filterDescription.filterType === FilterType.CASCADE &&
        object?.filterDescription.filterDescriptions.some(filterDescription => {
            return filterDescription.filterType === FilterType.PHASE_MATCH;
        }));
}
/**
 * Test if the object is a FilterDefinition
 * @param object
 * @returns
 */
export function isFilterDefinition(object) {
    if (object?.filterDescription?.filterType &&
        Object.values(FilterType).includes(object?.filterDescription?.filterType) &&
        object?.name &&
        object?.comments) {
        return true;
    }
    return false;
}
/**
 * Test if the object is a LinearFilterDescription
 * @param object
 * @returns
 */
export function isLinearFilterDescription(object) {
    return object != null && object.filterType === FilterType.LINEAR;
}
/**
 * Test if the provided Filter Parameters are IirFilterParameters, from an IIR Custom filter.
 */
export function isIirCustomLinearFilterParameters(object) {
    return object != null && object.sosNumeratorCoefficients !== undefined;
}
export function getLinearFilterFromDescription(object) {
    const filterDescription = object;
    const filter = {
        filterDefinition: { filterDescription, name: filterDescription.comments ?? '' },
        withinHotKeyCycle: false
    };
    return filter;
}
export function getCascadeFilterFromDescription(object) {
    const filterDescription = object;
    const filter = {
        filterDefinition: { filterDescription, name: filterDescription.comments ?? '' },
        withinHotKeyCycle: false
    };
    return filter;
}
export function getAutoRegressiveFilterFromDescription(object) {
    const filterDescription = object;
    const filter = {
        filterDefinition: { filterDescription, name: filterDescription.comments ?? '' },
        withinHotKeyCycle: false
    };
    return filter;
}
export function getPhaseMatchFilterFromDescription(object) {
    const filterDescription = object;
    const filter = {
        filterDefinition: { filterDescription, name: filterDescription.comments ?? '' },
        withinHotKeyCycle: false
    };
    return filter;
}
/**
 * Test if the object is a CascadeFilterDescription
 * @param object
 * @returns
 */
export function isCascadeFilterDescription(object) {
    return object != null && object.filterType === FilterType.CASCADE;
}
/**
 * Test if the object is a PhaseMatchFilterDescription
 * @param object
 * @returns
 */
export function isPhaseMatchFilterDescription(object) {
    return object != null && object.filterType === FilterType.PHASE_MATCH;
}
/**
 * Test if the object is a AutoRegressiveFilterDescription
 * @param object
 * @returns
 */
export function isAutoRegressiveFilterDescription(object) {
    return object != null && object.filterType === FilterType.AUTOREGRESSIVE;
}
/**
 * Create a Channel Filter from a filter definition
 * @param withinHotKeyCycle boolean
 * @param filterDefinition filter definition to use in channel filter
 */
export function createChannelFilterFromFilterDefinition(withinHotKeyCycle, filterDefinition) {
    return {
        withinHotKeyCycle,
        filterDefinition
    };
}
/**
 * Test if the object is a type compatible with {@link FilterDefinitionRealization}
 *
 * @param object the object to check
 * @returns true if the type is compatible
 */
export function isFilterDefinitionRealization(object) {
    return (isLinearFilterDefinition(object) ||
        isCascadeFilterDefinition(object) ||
        isPhaseMatchFilterDefinition(object) ||
        isAutoRegressiveFilterDefinition(object));
}
/**
 * Assert the object is {@link FilterDefinitionRealization} or throw
 * @param object the object to check
 */
export function assertIsFilterDefinitionRealization(object) {
    if (!isFilterDefinitionRealization(object)) {
        throw new Error(`Unsupported filter definition: ${object}`);
    }
}
/**
 * Check if a filter can be designed.
 *
 * Autoregressive filters and Cascade Filters containing AR filters may not be designed.
 */
export function isDesignableFilter(filterDefinition) {
    return (!isPhaseMatchFilterDefinition(filterDefinition) &&
        !isAutoRegressiveFilterDefinition(filterDefinition) &&
        !(isCascadeFilterDefinition(filterDefinition) &&
            filterDefinition.filterDescription.filterDescriptions.some(cascadeFilter => cascadeFilter.filterType === FilterType.AUTOREGRESSIVE ||
                cascadeFilter.filterType === FilterType.PHASE_MATCH)));
}
/**
 * Check if a filter can be pre-designed.
 *
 * Autoregressive filters and Cascade Filters containing AR or Phase Match filters may not be designed
 * Phase Match filters can only be designed along with the waveform they are applied to, meaning they cannot be pre-designed.
 */
export function isPreDesignableFilter(filterDefinition) {
    return (!isPhaseMatchFilterDefinition(filterDefinition) &&
        !isAutoRegressiveFilterDefinition(filterDefinition) &&
        !(isCascadeFilterDefinition(filterDefinition) &&
            filterDefinition.filterDescription.filterDescriptions.some(cascadeFilter => cascadeFilter.filterType === FilterType.AUTOREGRESSIVE ||
                cascadeFilter.filterType === FilterType.PHASE_MATCH)));
}
/**
 * Throws an error if the nyquist frequency is such that the waveform cannot be filtered.
 *
 * The Nyquist theorem states that an analog signal can be digitized without aliasing error if and only if
 * the sampling rate is greater than or equal to twice the highest frequency component in a given signal.
 *
 * @param filterDescription a filter description containing a highFrequencyHz
 * @param waveform used to gather the sampleRateHz being applied
 */
export function assertNyquistFrequency(filterDescription, waveform) {
    if (isLinearFilterDescription(filterDescription) ||
        isPhaseMatchFilterDescription(filterDescription)) {
        const nyquistFrequency = waveform.sampleRateHz / 2;
        if ((filterDescription.lowFrequencyHz && filterDescription.lowFrequencyHz > nyquistFrequency) ||
            (filterDescription.highFrequencyHz && filterDescription.highFrequencyHz > nyquistFrequency)) {
            throw new Error(`High frequency ${filterDescription.highFrequencyHz} Hz or low frequency ${filterDescription.lowFrequencyHz} Hz must be less than or equal to the Nyquist frequency ${nyquistFrequency} Hz.`);
        }
    }
    // Check all cascade filter descriptions
    if (isCascadeFilterDescription(filterDescription)) {
        filterDescription.filterDescriptions.forEach(fd => {
            assertNyquistFrequency(fd, waveform);
        });
    }
}
//# sourceMappingURL=filter-util.js.map