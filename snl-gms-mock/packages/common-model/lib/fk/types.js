export var FkUnits;
(function (FkUnits) {
    FkUnits["FSTAT"] = "FSTAT";
    FkUnits["POWER"] = "POWER";
})(FkUnits || (FkUnits = {}));
/**
 * Pixels widths of available thumbnail sizes
 */
export var FkThumbnailSize;
(function (FkThumbnailSize) {
    FkThumbnailSize[FkThumbnailSize["SMALL"] = 80] = "SMALL";
    FkThumbnailSize[FkThumbnailSize["MEDIUM"] = 120] = "MEDIUM";
    FkThumbnailSize[FkThumbnailSize["LARGE"] = 160] = "LARGE";
})(FkThumbnailSize || (FkThumbnailSize = {}));
export var FkUncertaintyOption;
(function (FkUncertaintyOption) {
    FkUncertaintyOption["EMPIRICAL"] = "EMPIRICAL";
    FkUncertaintyOption["EXPONENTIAL_SIGNAL_COHERENCE"] = "EXPONENTIAL_SIGNAL_COHERENCE";
    FkUncertaintyOption["OBSERVED_SIGNAL_COHERENCE"] = "OBSERVED_SIGNAL_COHERENCE";
    FkUncertaintyOption["PERFECT_SIGNAL_COHERENCE"] = "PERFECT_SIGNAL_COHERENCE";
})(FkUncertaintyOption || (FkUncertaintyOption = {}));
export var TaperFunction;
(function (TaperFunction) {
    TaperFunction["BLACKMAN"] = "BLACKMAN";
    TaperFunction["COSINE"] = "COSINE";
    TaperFunction["HAMMING"] = "HAMMING";
    TaperFunction["HANNING"] = "HANNING";
    TaperFunction["PARZEN"] = "PARZEN";
    TaperFunction["WELCH"] = "WELCH";
})(TaperFunction || (TaperFunction = {}));
//# sourceMappingURL=types.js.map