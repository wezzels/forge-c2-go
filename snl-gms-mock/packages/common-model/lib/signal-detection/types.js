/**
 * Enumeration of feature measurement type names
 */
export var FeatureMeasurementType;
(function (FeatureMeasurementType) {
    FeatureMeasurementType["AMPLITUDE_ALR_OVER_2"] = "AMPLITUDE_ALR_OVER_2";
    FeatureMeasurementType["AMPLITUDE_ANL_OVER_2"] = "AMPLITUDE_ANL_OVER_2";
    FeatureMeasurementType["AMPLITUDE_ANP_OVER_2"] = "AMPLITUDE_ANP_OVER_2";
    FeatureMeasurementType["AMPLITUDE_A5_OVER_2"] = "AMPLITUDE_A5_OVER_2";
    FeatureMeasurementType["ARRIVAL_TIME"] = "ARRIVAL_TIME";
    FeatureMeasurementType["EMERGENCE_ANGLE"] = "EMERGENCE_ANGLE";
    FeatureMeasurementType["LONG_PERIOD_FIRST_MOTION"] = "LONG_PERIOD_FIRST_MOTION";
    FeatureMeasurementType["PHASE"] = "PHASE";
    FeatureMeasurementType["RECEIVER_TO_SOURCE_AZIMUTH"] = "RECEIVER_TO_SOURCE_AZIMUTH";
    FeatureMeasurementType["RECTILINEARITY"] = "RECTILINEARITY";
    FeatureMeasurementType["ROOT_MEAN_SQUARE"] = "ROOT_MEAN_SQUARE";
    FeatureMeasurementType["SHORT_PERIOD_FIRST_MOTION"] = "SHORT_PERIOD_FIRST_MOTION";
    FeatureMeasurementType["SLOWNESS"] = "SLOWNESS";
    FeatureMeasurementType["SOURCE_TO_RECEIVER_AZIMUTH"] = "SOURCE_TO_RECEIVER_AZIMUTH";
    FeatureMeasurementType["SOURCE_TO_RECEIVER_DISTANCE"] = "SOURCE_TO_RECEIVER_DISTANCE";
})(FeatureMeasurementType || (FeatureMeasurementType = {}));
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
];
export var FirstMotionType;
(function (FirstMotionType) {
    FirstMotionType["COMPRESSION"] = "COMPRESSION";
    FirstMotionType["DILATION"] = "DILATION";
    FirstMotionType["INDETERMINATE"] = "INDETERMINATE";
})(FirstMotionType || (FirstMotionType = {}));
/**
 * Signal Detection Status either deleted or
 * association status to event
 */
export var SignalDetectionStatus;
(function (SignalDetectionStatus) {
    SignalDetectionStatus["OPEN_ASSOCIATED"] = "Open";
    SignalDetectionStatus["COMPLETE_ASSOCIATED"] = "Completed";
    SignalDetectionStatus["OTHER_ASSOCIATED"] = "Other";
    SignalDetectionStatus["UNASSOCIATED"] = "Unassociated";
    SignalDetectionStatus["DELETED"] = "Deleted";
})(SignalDetectionStatus || (SignalDetectionStatus = {}));
//# sourceMappingURL=types.js.map