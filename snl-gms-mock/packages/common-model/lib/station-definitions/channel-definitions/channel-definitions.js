export const TEMPORARY_CHANNEL_GROUP = 'temp';
export const SPLIT_CHANNEL_TOKEN = 'split';
export const INDIVIDUAL_CHANNEL_TOKEN = 'individual';
export const MEASUREMENT_CHANNEL_TOKEN = 'measurement';
export const BASE_CHANNEL_TOKEN = 'BASE';
export const TEMPORARY_CHANNEL_CODE = '---';
export const ATTRIBUTE_SEPARATOR = ',';
export const COMPONENT_SEPARATOR = '/';
export const CHANNEL_COMPONENT_SEPARATOR = '.';
/**
 * ChannelGroupType enum represents the different groupings of channels
 */
export var ChannelGroupType;
(function (ChannelGroupType) {
    ChannelGroupType["PROCESSING_GROUP"] = "PROCESSING_GROUP";
    ChannelGroupType["SITE_GROUP"] = "SITE_GROUP";
    ChannelGroupType["PHYSICAL_SITE"] = "PHYSICAL_SITE";
})(ChannelGroupType || (ChannelGroupType = {}));
/**
 * An enum to describe one of the possible values of processingMetadata.CHANNEL_GROUP
 */
export var ProcessingMetadataChannelGroup;
(function (ProcessingMetadataChannelGroup) {
    ProcessingMetadataChannelGroup["FK"] = "FK";
    ProcessingMetadataChannelGroup["BEAM"] = "beam";
})(ProcessingMetadataChannelGroup || (ProcessingMetadataChannelGroup = {}));
/**
 * Enumeration representing the different types of processing channels.
 */
export var ChannelDataType;
(function (ChannelDataType) {
    ChannelDataType["SEISMIC"] = "SEISMIC";
    ChannelDataType["HYDROACOUSTIC"] = "HYDROACOUSTIC";
    ChannelDataType["INFRASOUND"] = "INFRASOUND";
    ChannelDataType["WEATHER"] = "WEATHER";
    ChannelDataType["DIAGNOSTIC_SOH"] = "DIAGNOSTIC_SOH";
    ChannelDataType["DIAGNOSTIC_WEATHER"] = "DIAGNOSTIC_WEATHER";
    ChannelDataType["UNKNOWN"] = "UNKNOWN";
})(ChannelDataType || (ChannelDataType = {}));
/**
 * Represents the type of processing metadata values that can appear as keys in the
 */
export var ChannelProcessingMetadataType;
(function (ChannelProcessingMetadataType) {
    // General properties
    ChannelProcessingMetadataType["CHANNEL_GROUP"] = "CHANNEL_GROUP";
    // Filtering properties
    ChannelProcessingMetadataType["FILTER_CAUSALITY"] = "FILTER_CAUSALITY";
    ChannelProcessingMetadataType["FILTER_GROUP_DELAY"] = "FILTER_GROUP_DELAY";
    ChannelProcessingMetadataType["FILTER_HIGH_FREQUENCY_HZ"] = "FILTER_HIGH_FREQUENCY_HZ";
    ChannelProcessingMetadataType["FILTER_LOW_FREQUENCY_HZ"] = "FILTER_LOW_FREQUENCY_HZ";
    ChannelProcessingMetadataType["FILTER_PASS_BAND_TYPE"] = "FILTER_PASS_BAND_TYPE";
    ChannelProcessingMetadataType["FILTER_TYPE"] = "FILTER_TYPE";
    // Channel steering properties (used in beaming, rotation)
    ChannelProcessingMetadataType["STEERING_AZIMUTH"] = "STEERING_AZIMUTH";
    ChannelProcessingMetadataType["STEERING_SLOWNESS"] = "STEERING_SLOWNESS";
    ChannelProcessingMetadataType["STEERING_BACK_AZIMUTH"] = "STEERING_BACK_AZIMUTH";
    // Beaming properties
    ChannelProcessingMetadataType["BEAM_SUMMATION"] = "BEAM_SUMMATION";
    ChannelProcessingMetadataType["BEAM_LOCATION"] = "BEAM_LOCATION";
    ChannelProcessingMetadataType["BEAM_SIGNAL_DETECTION_HYPOTHESIS_ID"] = "BEAM_SIGNAL_DETECTION_HYPOTHESIS_ID";
    ChannelProcessingMetadataType["BEAM_EVENT_HYPOTHESIS_ID"] = "BEAM_EVENT_HYPOTHESIS_ID";
    ChannelProcessingMetadataType["BEAM_TYPE"] = "BEAM_TYPE";
    ChannelProcessingMetadataType["BEAM_PHASE"] = "BEAM_PHASE";
    ChannelProcessingMetadataType["BRIDGED"] = "BRIDGED";
})(ChannelProcessingMetadataType || (ChannelProcessingMetadataType = {}));
/**
 * Represents the SEED / FDSN standard Channel Instruments.  Each instrument has a corresponding
 * single letter code.
 */
export var ChannelInstrumentType;
(function (ChannelInstrumentType) {
    ChannelInstrumentType["UNKNOWN"] = "UNKNOWN";
    ChannelInstrumentType["HIGH_GAIN_SEISMOMETER"] = "HIGH_GAIN_SEISMOMETER";
    ChannelInstrumentType["LOW_GAIN_SEISMOMETER"] = "LOW_GAIN_SEISMOMETER";
    ChannelInstrumentType["GRAVIMETER"] = "GRAVIMETER";
    ChannelInstrumentType["MASS_POSITION_SEISMOMETER"] = "MASS_POSITION_SEISMOMETER";
    ChannelInstrumentType["ACCELEROMETER"] = "ACCELEROMETER";
    ChannelInstrumentType["ROTATIONAL_SENSOR"] = "ROTATIONAL_SENSOR";
    ChannelInstrumentType["TILT_METER"] = "TILT_METER";
    ChannelInstrumentType["CREEP_METER"] = "CREEP_METER";
    ChannelInstrumentType["CALIBRATION_INPUT"] = "CALIBRATION_INPUT";
    ChannelInstrumentType["PRESSURE"] = "PRESSURE";
    ChannelInstrumentType["ELECTRONIC_TEST_POINT"] = "ELECTRONIC_TEST_POINT";
    ChannelInstrumentType["MAGNETOMETER"] = "MAGNETOMETER";
    ChannelInstrumentType["HUMIDITY"] = "HUMIDITY";
    ChannelInstrumentType["TEMPERATURE"] = "TEMPERATURE";
    ChannelInstrumentType["WATER_CURRENT"] = "WATER_CURRENT";
    ChannelInstrumentType["GEOPHONE"] = "GEOPHONE";
    ChannelInstrumentType["ELECTRIC_POTENTIAL"] = "ELECTRIC_POTENTIAL";
    ChannelInstrumentType["RAINFALL"] = "RAINFALL";
    ChannelInstrumentType["LINEAR_STRAIN"] = "LINEAR_STRAIN";
    ChannelInstrumentType["TIDE"] = "TIDE";
    ChannelInstrumentType["BOLOMETER"] = "BOLOMETER";
    ChannelInstrumentType["VOLUMETRIC_STRAIN"] = "VOLUMETRIC_STRAIN";
    ChannelInstrumentType["WIND"] = "WIND";
    ChannelInstrumentType["NON_SPECIFIC_INSTRUMENT"] = "NON_SPECIFIC_INSTRUMENT";
    ChannelInstrumentType["DERIVED"] = "DERIVED";
    ChannelInstrumentType["SYNTHESIZED_BEAM"] = "SYNTHESIZED_BEAM";
})(ChannelInstrumentType || (ChannelInstrumentType = {}));
/**
 * Represents the SEED / FDSN standard Channel Bands.  Each band has a corresponding single letter
 * code.
 */
export var ChannelBandType;
(function (ChannelBandType) {
    ChannelBandType["UNKNOWN"] = "-";
    // Long Period Bands
    /**
     * 1Hz - 10Hz
     */
    ChannelBandType["MID_PERIOD"] = "MID_PERIOD";
    /**
     * ~1Hz
     */
    ChannelBandType["LONG_PERIOD"] = "LONG_PERIOD";
    /**
     * ~0.1Hz
     */
    ChannelBandType["VERY_LONG_PERIOD"] = "VERY_LONG_PERIOD";
    /**
     * ~0.01Hz
     */
    ChannelBandType["ULTRA_LONG_PERIOD"] = "ULTRA_LONG_PERIOD";
    /**
     * 0.0001Hz - 0.001Hz
     */
    ChannelBandType["EXTREMELY_LONG_PERIOD"] = "EXTREMELY_LONG_PERIOD";
    /**
     * 0.00001Hz - 0.0001Hz (new)
     */
    ChannelBandType["PERIOD_ORDER_TENTH_TO_ONE_DAY"] = "PERIOD_ORDER_TENTH_TO_ONE_DAY";
    /**
     * 0.000001Hz - 0.00001Hz (new)
     */
    ChannelBandType["PERIOD_ORDER_ONE_TO_TEN_DAYS"] = "PERIOD_ORDER_ONE_TO_TEN_DAYS";
    /**
     * < 0.000001Hz (new)
     */
    ChannelBandType["PERIOD_GREATER_TEN_DAYS"] = "PERIOD_GREATER_TEN_DAYS";
    // Short Period Bands
    /**
     * 1000Hz - 5000Hz (new)
     */
    ChannelBandType["SAMPLE_RATE_1KHZ_TO_LESS_5KHZ_CORNER_LESS_10SEC"] = "SAMPLE_RATE_1KHZ_TO_LESS_5KHZ_CORNER_LESS_10SEC";
    /**
     * 250Hz - 10000Hz (new)
     */
    ChannelBandType["SAMPLE_RATE_250HZ_TO_LESS_1KHZ_CORNER_LESS_10SEC"] = "SAMPLE_RATE_250HZ_TO_LESS_1KHZ_CORNER_LESS_10SEC";
    /**
     * 80Hz - 250Hz
     */
    ChannelBandType["EXTREMELY_SHORT_PERIOD"] = "EXTREMELY_SHORT_PERIOD";
    /**
     * 10Hz - 80Hz
     */
    ChannelBandType["SHORT_PERIOD"] = "SHORT_PERIOD";
    // Broadband (Corner Periods > 10 sec)
    /**
     * 1000Hz - 5000Hz (new)
     */
    ChannelBandType["SAMPLE_RATE_1KHZ_TO_LESS_5KHZ_CORNER_GREATER_EQUAL_10SEC"] = "SAMPLE_RATE_1KHZ_TO_LESS_5KHZ_CORNER_GREATER_EQUAL_10SEC";
    /**
     * 250Hz - 1000Hz (new)
     */
    ChannelBandType["SAMPLE_RATE_250HZ_TO_LESS_1KHZ_CORNER_GREATER_EQUAL_10SEC"] = "SAMPLE_RATE_250HZ_TO_LESS_1KHZ_CORNER_GREATER_EQUAL_10SEC";
    /**
     * 80Hz - 250Hz
     */
    ChannelBandType["HIGH_BROADBAND"] = "HIGH_BROADBAND";
    /**
     * 10Hz - 80Hz
     */
    ChannelBandType["BROADBAND"] = "BROADBAND";
    ChannelBandType["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    ChannelBandType["OPAQUE"] = "OPAQUE";
})(ChannelBandType || (ChannelBandType = {}));
/**
 * Seismometer, Rotational Sensor, or Derived/Generated Orientations.
 * These correspond to instrument codes H, L, G, M, N, J, and X.
 */
export var ChannelOrientationType;
(function (ChannelOrientationType) {
    ChannelOrientationType["UNKNOWN"] = "UNKNOWN";
    ChannelOrientationType["VERTICAL"] = "VERTICAL";
    ChannelOrientationType["NORTH_SOUTH"] = "NORTH_SOUTH";
    ChannelOrientationType["EAST_WEST"] = "EAST_WEST";
    ChannelOrientationType["TRIAXIAL_A"] = "TRIAXIAL_A";
    ChannelOrientationType["TRIAXIAL_B"] = "TRIAXIAL_B";
    ChannelOrientationType["TRIAXIAL_C"] = "TRIAXIAL_C";
    ChannelOrientationType["TRANSVERSE"] = "TRANSVERSE";
    ChannelOrientationType["RADIAL"] = "RADIAL";
    ChannelOrientationType["ORTHOGONAL_1"] = "ORTHOGONAL_1";
    ChannelOrientationType["ORTHOGONAL_2"] = "ORTHOGONAL_2";
    ChannelOrientationType["ORTHOGONAL_3"] = "ORTHOGONAL_3";
    ChannelOrientationType["OPTIONAL_U"] = "OPTIONAL_U";
    ChannelOrientationType["OPTIONAL_V"] = "OPTIONAL_V";
    ChannelOrientationType["OPTIONAL_W"] = "OPTIONAL_W";
})(ChannelOrientationType || (ChannelOrientationType = {}));
//# sourceMappingURL=channel-definitions.js.map