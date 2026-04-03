/**
 * Enumerated Restraint Type
 */
export var RestraintType;
(function (RestraintType) {
    RestraintType["UNRESTRAINED"] = "UNRESTRAINED";
    RestraintType["FIXED"] = "FIXED";
})(RestraintType || (RestraintType = {}));
/**
 * Enumerated Scaling Factor Type
 */
export var ScalingFactorType;
(function (ScalingFactorType) {
    ScalingFactorType["CONFIDENCE"] = "CONFIDENCE";
    ScalingFactorType["COVERAGE"] = "COVERAGE";
    ScalingFactorType["K_WEIGHTED"] = "K_WEIGHTED";
})(ScalingFactorType || (ScalingFactorType = {}));
/**
 * Event status options
 */
export var EventStatus;
(function (EventStatus) {
    EventStatus["IN_PROGRESS"] = "IN_PROGRESS";
    EventStatus["COMPLETE"] = "COMPLETE";
    EventStatus["NOT_STARTED"] = "NOT_STARTED";
    EventStatus["NOT_COMPLETE"] = "NOT_COMPLETE";
})(EventStatus || (EventStatus = {}));
/**
 * Filter status options
 */
export var FilterStatus;
(function (FilterStatus) {
    FilterStatus["IN_PROGRESS"] = "IN_PROGRESS";
    FilterStatus["COMPLETE"] = "COMPLETE";
    FilterStatus["NOT_STARTED"] = "NOT_STARTED";
    FilterStatus["NOT_COMPLETE"] = "NOT_COMPLETE";
})(FilterStatus || (FilterStatus = {}));
/**
 * Enumerated Restrainer Type
 */
export var RestrainerType;
(function (RestrainerType) {
    RestrainerType["FIXED_BY_ANALYST"] = "FIXED_BY_ANALYST";
    RestrainerType["FIXED_BY_CONFIGURATION"] = "FIXED_BY_CONFIGURATION";
    RestrainerType["FIXED_BY_LOCATOR"] = "FIXED_BY_LOCATOR";
    RestrainerType["UNKNOWN"] = "UNKNOWN";
})(RestrainerType || (RestrainerType = {}));
/**
 * Enumerated Depth Restraint Reason
 */
export var DepthRestraintReason;
(function (DepthRestraintReason) {
    DepthRestraintReason["FIXED_AT_DEPTH_FOUND_USING_DEPTH_PHASE_MEASUREMENTS"] = "FIXED_AT_DEPTH_FOUND_USING_DEPTH_PHASE_MEASUREMENTS";
    DepthRestraintReason["FIXED_AT_STANDARD_DEPTH"] = "FIXED_AT_STANDARD_DEPTH";
    DepthRestraintReason["FIXED_AT_SURFACE"] = "FIXED_AT_SURFACE";
    DepthRestraintReason["OTHER"] = "OTHER";
})(DepthRestraintReason || (DepthRestraintReason = {}));
/**
 * Enumerated Feature Prediction Derivative Type
 */
export var FeaturePredictionDerivativeType;
(function (FeaturePredictionDerivativeType) {
    FeaturePredictionDerivativeType["DERIVATIVE_WRT_DEPTH"] = "DERIVATIVE_WRT_DEPTH";
    FeaturePredictionDerivativeType["DERIVATIVE_WRT_LATITUDE"] = "DERIVATIVE_WRT_LATITUDE";
    FeaturePredictionDerivativeType["DERIVATIVE_WRT_LONGITUDE"] = "DERIVATIVE_WRT_LONGITUDE";
    FeaturePredictionDerivativeType["DERIVATIVE_WRT_TIME"] = "DERIVATIVE_WRT_TIME";
    // TODO: Not in guidance, but used by ApacheBicubicSplineInterpolator.  Delete when ABSI goes away (keep in line with Java)
    FeaturePredictionDerivativeType["DERIVATIVE_WRT_DISTANCE"] = "DERIVATIVE_WRT_DISTANCE";
})(FeaturePredictionDerivativeType || (FeaturePredictionDerivativeType = {}));
/**
 * Enumerated Magnitude Type
 */
export var MagnitudeType;
(function (MagnitudeType) {
    MagnitudeType["MB"] = "MB";
    MagnitudeType["MB_CODA"] = "MB_CODA";
    MagnitudeType["MB_MB"] = "MB_MB";
    MagnitudeType["MB_MLE"] = "MB_MLE";
    MagnitudeType["MB_PG"] = "MB_PG";
    MagnitudeType["MB_REL_T"] = "MB_REL_T";
    MagnitudeType["ML"] = "ML";
    MagnitudeType["MS"] = "MS";
    MagnitudeType["MS_MLE"] = "MS_MLE";
    MagnitudeType["MS_VMAX"] = "MS_VMAX";
    MagnitudeType["MW_CODA"] = "MW_CODA";
})(MagnitudeType || (MagnitudeType = {}));
/**
 * Enumerated Network magnitude status
 */
export var NetworkMagnitudeStatus;
(function (NetworkMagnitudeStatus) {
    NetworkMagnitudeStatus["VALID"] = "VALID";
    NetworkMagnitudeStatus["TOO_FEW_DEFINING_STA_MAG"] = "TOO_FEW_DEFINING_STA_MAG";
    NetworkMagnitudeStatus["DID_NOT_CONVERGE"] = "DID_NOT_CONVERGE";
    NetworkMagnitudeStatus["OTHER_FAILURE"] = "OTHER_FAILURE";
})(NetworkMagnitudeStatus || (NetworkMagnitudeStatus = {}));
/**
 * Prediction Component Type Enum
 */
export var FeaturePredictionComponentType;
(function (FeaturePredictionComponentType) {
    FeaturePredictionComponentType["BASEMODEL_PREDICTION"] = "BASEMODEL_PREDICTION";
    FeaturePredictionComponentType["BULK_STATIC_STATION_CORRECTION"] = "BULK_STATIC_STATION_CORRECTION";
    FeaturePredictionComponentType["ELEVATION_CORRECTION"] = "ELEVATION_CORRECTION";
    FeaturePredictionComponentType["ELLIPTICITY_CORRECTION"] = "ELLIPTICITY_CORRECTION";
    FeaturePredictionComponentType["MASTER_EVENT_CORRECTION"] = "MASTER_EVENT_CORRECTION";
    FeaturePredictionComponentType["PATH_CORRECTION"] = "PATH_CORRECTION";
    FeaturePredictionComponentType["SOURCE_DEPENDENT_CORRECTION"] = "SOURCE_DEPENDENT_CORRECTION";
    FeaturePredictionComponentType["UNCERTAINTY_DISTANCE_DEPENDENT"] = "UNCERTAINTY_DISTANCE_DEPENDENT";
    FeaturePredictionComponentType["UNCERTAINTY_PATH_DEPENDENT"] = "UNCERTAINTY_PATH_DEPENDENT";
    FeaturePredictionComponentType["UNCERTAINTY_STATION_PHASE_DEPENDENT"] = "UNCERTAINTY_STATION_PHASE_DEPENDENT";
})(FeaturePredictionComponentType || (FeaturePredictionComponentType = {}));
/**
 * The computed Restraint determined by the values
 * of a {@link LocationRestraint} object.
 */
export var Restraint;
(function (Restraint) {
    Restraint["FIXED_BY_ANALYST"] = "FIXED_BY_ANALYST";
    Restraint["FIXED_BY_LOCATOR"] = "FIXED_BY_LOCATOR";
    Restraint["FIXED_AT_SURFACE"] = "FIXED_AT_SURFACE";
    Restraint["FIXED_AT_DEPTH"] = "FIXED_AT_DEPTH";
    Restraint["UNRESTRAINED"] = "UNRESTRAINED";
    Restraint["UNKNOWN"] = "UNKNOWN";
})(Restraint || (Restraint = {}));
/**
 * The decimal precision supported for event location latitude and longitude values.
 */
export const EVENT_LAT_LON_DECIMAL_PRECISION = 4;
//# sourceMappingURL=types.js.map