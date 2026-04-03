export var TaperFunction;
(function (TaperFunction) {
    TaperFunction["BLACKMAN"] = "BLACKMAN";
    TaperFunction["COSINE"] = "COSINE";
    TaperFunction["HAMMING"] = "HAMMING";
    TaperFunction["HANNING"] = "HANNING";
    TaperFunction["PARZEN"] = "PARZEN";
    TaperFunction["WELCH"] = "WELCH";
})(TaperFunction || (TaperFunction = {}));
/**
 * Validates that the object passed in is a  {@link ProcessingMaskDefinition}
 *
 * @throws If the object does not contain the mandatory fields to be a ProcessingMaskDefinition
 */
export function isProcessingMaskDefinition(processingDefinition) {
    if (!Object.keys(processingDefinition).includes('processingOperation') ||
        !Object.keys(processingDefinition).includes('appliedQcSegmentCategoryAndTypes') ||
        !Object.keys(processingDefinition).includes('maskedSegmentMergeThreshold')) {
        throw new Error(`Object is not processing mask definition`);
    }
}
//# sourceMappingURL=types.js.map