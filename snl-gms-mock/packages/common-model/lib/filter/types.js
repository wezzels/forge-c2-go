/**
 * Filter definition usage processing configuration enums. These correspond to the names of the named filters.
 */
export var FilterDefinitionUsage;
(function (FilterDefinitionUsage) {
    /**
     * Named filter that corresponds to the filter definition that was used when this signal detection was initially created
     */
    FilterDefinitionUsage["DETECTION"] = "DETECTION";
    /**
     * Named filter that corresponds to the filter definition that was used when the FK peak was chosen, resulting in the creation of the FK beam
     */
    FilterDefinitionUsage["FK"] = "FK";
    /**
     * Named filter that corresponds to the filter definition that was used when this signal detection was last modified
     */
    FilterDefinitionUsage["ONSET"] = "ONSET";
    /**
     * Named filter that corresponds to the filter definition that was used when the amplitude was measured
     */
    FilterDefinitionUsage["AMPLITUDE"] = "AMPLITUDE";
})(FilterDefinitionUsage || (FilterDefinitionUsage = {}));
export var FilterType;
(function (FilterType) {
    FilterType["CASCADE"] = "CASCADE";
    FilterType["AUTOREGRESSIVE"] = "AUTOREGRESSIVE";
    FilterType["LINEAR"] = "LINEAR";
    FilterType["PHASE_MATCH"] = "PHASE_MATCH";
})(FilterType || (FilterType = {}));
export var BandType;
(function (BandType) {
    BandType["LOW_PASS"] = "LOW_PASS";
    BandType["HIGH_PASS"] = "HIGH_PASS";
    BandType["BAND_PASS"] = "BAND_PASS";
    BandType["BAND_REJECT"] = "BAND_REJECT";
})(BandType || (BandType = {}));
export var LinearFilterType;
(function (LinearFilterType) {
    LinearFilterType["FIR_HAMMING"] = "FIR_HAMMING";
    LinearFilterType["IIR_BUTTERWORTH"] = "IIR_BUTTERWORTH";
    LinearFilterType["FIR_OTHER"] = "FIR_OTHER";
    LinearFilterType["IIR_OTHER"] = "IIR_OTHER";
})(LinearFilterType || (LinearFilterType = {}));
export var AutoregressiveType;
(function (AutoregressiveType) {
    AutoregressiveType["N"] = "N";
    AutoregressiveType["N_SQUARED"] = "N_SQUARED";
})(AutoregressiveType || (AutoregressiveType = {}));
export var AutoregressiveFilterType;
(function (AutoregressiveFilterType) {
    AutoregressiveFilterType["ADAPTIVE"] = "ADAPTIVE";
    AutoregressiveFilterType["NON_ADAPTIVE"] = "NON_ADAPTIVE";
})(AutoregressiveFilterType || (AutoregressiveFilterType = {}));
export var TaperFunction;
(function (TaperFunction) {
    TaperFunction["BLACKMAN"] = "BLACKMAN";
    TaperFunction["COSINE"] = "COSINE";
    TaperFunction["HAMMING"] = "HAMMING";
    TaperFunction["HANNING"] = "HANNING";
    TaperFunction["PARZEN"] = "PARZEN";
    TaperFunction["WELCH"] = "WELCH";
})(TaperFunction || (TaperFunction = {}));
/** A string identifying the `unfiltered` filter */
export const UNFILTERED = 'Unfiltered';
/**
 * A filter definition for an unfiltered filter, which is used as a default/fallback
 */
export const UNFILTERED_FILTER = {
    withinHotKeyCycle: true,
    unfiltered: true
};
/**
 * Extends a basic Error so that we may attach metadata about the filter operation that failed.
 * This allows for more fine-grained error handling than a generic Error.
 */
export class FilterError extends Error {
    /** Always set to true, makes for simple error type checking */
    isFilterError = true;
    /** The name of the filter definition that failed */
    filterNames;
    /** The name of the channel/station on which this error was thrown */
    channelName;
    /** Zero or more serialized identifiers for a channel segment */
    channelSegmentDescriptorIds;
    constructor(message, filterNames, channelName, channelSegmentDescriptorId) {
        super(message);
        this.channelSegmentDescriptorIds =
            typeof channelSegmentDescriptorId === 'string'
                ? [channelSegmentDescriptorId]
                : channelSegmentDescriptorId;
        this.filterNames = typeof filterNames === 'string' ? [filterNames] : filterNames;
        this.channelName = channelName;
    }
}
//# sourceMappingURL=types.js.map