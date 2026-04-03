// ***************************************
// Mutations
// ***************************************
/** The `operation name` for the client log mutation */
export const ClientLogOperationMutationName = 'clientLog';
/**
 * Creation Type, reflects system change or analyst change
 */
export var CreatorType;
(function (CreatorType) {
    CreatorType["Analyst"] = "Analyst";
    CreatorType["System"] = "System";
})(CreatorType || (CreatorType = {}));
/**
 * Distance value's units degrees or kilometers
 */
export var DistanceUnits;
(function (DistanceUnits) {
    DistanceUnits["Degrees"] = "degrees";
    DistanceUnits["Km"] = "km";
})(DistanceUnits || (DistanceUnits = {}));
/**
 * Distance to source type
 */
export var DistanceSourceType;
(function (DistanceSourceType) {
    DistanceSourceType["Event"] = "Event";
    DistanceSourceType["UserDefined"] = "UserDefined";
})(DistanceSourceType || (DistanceSourceType = {}));
/**
 * Log Level to determine different levels
 *
 * ! the log levels must be all lowercase for the loggers
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["error"] = "error";
    LogLevel["warn"] = "warn";
    LogLevel["client"] = "client";
    LogLevel["info"] = "info";
    LogLevel["timing"] = "timing";
    LogLevel["data"] = "data";
    LogLevel["debug"] = "debug";
})(LogLevel || (LogLevel = {}));
/**
 * Enumeration representing the different types of stations in the monitoring network.
 */
export var StationType;
(function (StationType) {
    StationType["SEISMIC_3_COMPONENT"] = "SEISMIC_3_COMPONENT";
    StationType["SEISMIC_1_COMPONENT"] = "SEISMIC_1_COMPONENT";
    StationType["SEISMIC_ARRAY"] = "SEISMIC_ARRAY";
    StationType["HYDROACOUSTIC"] = "HYDROACOUSTIC";
    StationType["HYDROACOUSTIC_ARRAY"] = "HYDROACOUSTIC_ARRAY";
    StationType["INFRASOUND"] = "INFRASOUND";
    StationType["INFRASOUND_ARRAY"] = "INFRASOUND_ARRAY";
    StationType["WEATHER"] = "WEATHER";
    StationType["UNKNOWN"] = "UNKNOWN";
})(StationType || (StationType = {}));
/**
 * Units used in DoubleValue part of feature prediction and DoubleValue part of calibration
 */
export var Units;
(function (Units) {
    Units["DEGREES"] = "DEGREES";
    Units["DECIBELS"] = "DECIBELS";
    Units["RADIANS"] = "RADIANS";
    Units["SECONDS"] = "SECONDS";
    Units["HERTZ"] = "HERTZ";
    Units["DEGREES_PER_SECOND"] = "DEGREES_PER_SECOND";
    Units["SECONDS_PER_DEGREE"] = "SECONDS_PER_DEGREE";
    Units["SECONDS_PER_RADIAN"] = "SECONDS_PER_RADIAN";
    Units["SECONDS_PER_DEGREE_SQUARED"] = "SECONDS_PER_DEGREE_SQUARED";
    Units["SECONDS_PER_KILOMETER_SQUARED"] = "SECONDS_PER_KILOMETER_SQUARED";
    Units["SECONDS_PER_KILOMETER"] = "SECONDS_PER_KILOMETER";
    Units["SECONDS_PER_KILOMETER_PER_DEGREE"] = "SECONDS_PER_KILOMETER_PER_DEGREE";
    Units["ONE_OVER_KM"] = "ONE_OVER_KM";
    Units["NANOMETERS"] = "NANOMETERS";
    Units["NANOMETERS_PER_SECOND"] = "NANOMETERS_PER_SECOND";
    Units["NANOMETERS_PER_COUNT"] = "NANOMETERS_PER_COUNT";
    Units["NANOMETERS_SQUARED_PER_SECOND"] = "NANOMETERS_SQUARED_PER_SECOND";
    Units["UNITLESS"] = "UNITLESS";
    Units["MAGNITUDE"] = "MAGNITUDE";
    Units["COUNTS_PER_NANOMETER"] = "COUNTS_PER_NANOMETER";
    Units["COUNTS_PER_PASCAL"] = "COUNTS_PER_PASCAL";
    Units["PASCALS_PER_COUNT"] = "PASCALS_PER_COUNT";
    Units["ONE_OVER_DEGREE"] = "ONE_OVER_DEGREE";
    Units["SECONDS_PER_DEGREE_KM"] = "SECONDS_PER_DEGREE_KM";
    Units["DEGREES_PER_KM"] = "DEGREES_PER_KM";
})(Units || (Units = {}));
export var SamplingType;
(function (SamplingType) {
    SamplingType["NEAREST_SAMPLE"] = "Nearest sample";
    SamplingType["INTERPOLATED"] = "Interpolated";
})(SamplingType || (SamplingType = {}));
//# sourceMappingURL=types.js.map