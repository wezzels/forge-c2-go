/**
 * Enumerates the different possible priorities for requests.
 * ! Note, these need to map to numbers in the transpiled javascript code.
 */
export declare enum Priority {
    HIGHEST = 7,
    HIGH = 6,
    MEDIUM_HIGH = 5,
    MEDIUM = 4,
    MEDIUM_LOW = 3,
    LOW = 2,
    LOWEST = 1
}
export declare const DEFAULT_PRIORITY = Priority.MEDIUM;
/**
 * DAL Services (Data Fabric)
 */
export declare const DalServiceUrls: {
    baseUrl: string;
    fdsnDataSelect: {
        url: "/rest/waveform/dataselect/1/query";
        friendlyName: "FDSN data select";
    };
};
/**
 * Event Manager Service
 */
export declare const EventManagerUrls: {
    baseUrl: "/event-manager-service/event";
    getEventsWithDetectionsAndSegmentsByTime: {
        url: "/detections-and-segments/time";
        friendlyName: "Events by time";
    };
    findEventsByAssociatedSignalDetectionHypotheses: {
        url: "/associated-signal-detection-hypotheses";
        friendlyName: "Events by signal detection association";
    };
    predictFeaturesForEventLocation: {
        url: "/predict-for-event-location";
        friendlyName: "Event feature predictions";
    };
    status: {
        url: "/status";
        friendlyName: "Event statuses";
    };
    update: {
        url: "/update";
        friendlyName: "Update event status";
    };
};
/**
 * Event Relocation Service
 */
export declare const EventRelocationUrls: {
    baseUrl: "/event-relocation-service/relocation";
    getEventRelocationProcessingDefinition: {
        url: "/event-relocation-processing-definition";
        friendlyName: "Event relocation processing definition";
    };
    getDefaultDefiningFeatureMaps: {
        url: "/default-defining-feature-maps";
        friendlyName: "Default defining feature maps";
    };
    relocate: {
        url: "/relocate";
        friendlyName: "Event relocate";
    };
};
/**
 * Magnitude Estimation Service
 */
export declare const MagnitudeEstimationUrls: {
    baseUrl: "/magnitude-estimation-service";
    getDefiningAndNonOverridableStations: {
        url: "/query/defining-and-nonoverridable-stations";
        friendlyName: "Defining and Non-Overridable Stations";
    };
    getStationMagnitudeDefinitions: {
        url: "/query/definitions/station-magnitude";
        friendlyName: "Station Magnitude Corrections Definitions";
    };
    getNetworkMagnitudeDefinitions: {
        url: "/query/definitions/network-magnitude";
        friendlyName: "Network Magnitude Definitions";
    };
    getStationMagnitudeCorrectionDefinitions: {
        url: "/station-magnitude-corrections-definitions";
        friendlyName: "Station Magnitude Corrections Definitions";
    };
    getNamedLocationCorrectionsForStationAndMagnitudeType: {
        url: "/station-magnitude-location-corrections";
        friendlyName: "Named Location Corrections for Station and Magnitude Type";
    };
    estimateMagnitudes: {
        url: "/estimate-magnitudes";
        friendlyName: "Estimate magnitudes";
    };
};
/**
 * Fk Control
 */
export declare const FkControlUrls: {
    baseUrl: "/fk-control-service";
    computeFkSpectra: {
        url: "/spectra/interactive";
        friendlyName: "FK spectra";
    };
};
/**
 * Processing Configuration
 */
export declare const ProcessingConfigUrls: {
    baseUrl: "/ui-processing-configuration-service";
    getProcessingConfiguration: {
        url: "/resolve";
        friendlyName: "Processing configuration";
    };
};
/**
 * Signal Detections Manager Service
 */
export declare const SignalDetectionManagerUrls: {
    baseUrl: "/signal-detection-manager-service/signal-detection";
    getFilterDefinitionsForSignalDetections: {
        url: "/filter-definitions-by-usage/query/signal-detections/canned";
        friendlyName: "Filter definitions for signal detections";
    };
    getDetectionsWithSegmentsByStationsAndTime: {
        url: "/signal-detections-with-channel-segments/query/stations-timerange";
        friendlyName: "Signal detections by station and time";
    };
};
/**
 * Signal Enhancement Configuration
 */
export declare const SignalEnhancementConfigurationUrls: {
    baseUrl: "/signal-enhancement-configuration-service/signal-enhancement-configuration";
    getSignalEnhancementConfiguration: {
        url: "/filter-lists-definition";
        friendlyName: "Filter configuration";
    };
    getDefaultFilterDefinitionsForSignalDetectionHypotheses: {
        url: "/default-filter-definitions-for-signal-detection-hypotheses";
        friendlyName: "Filter definitions for signal detections";
    };
    getDefaultFilterDefinitionByUsageForChannelSegments: {
        url: "/default-filter-definitions-for-channel-segments";
        friendlyName: "Filter definitions for channel segments";
    };
    getProcessingMaskDefinitions: {
        url: "/processing-mask-definitions";
        friendlyName: "Processing mask definitions";
    };
    getBeamformingTemplates: {
        url: "/beamforming-template";
        friendlyName: "Beamforming templates";
    };
    getRotationTemplates: {
        url: "/rotation-templates";
        friendlyName: "Rotation templates";
    };
    getFkReviewablePhases: {
        url: "/fk-reviewable-phases";
        friendlyName: "FK reviewable phases";
    };
    getFkSpectraTemplates: {
        url: "/fk-spectra-templates";
        friendlyName: "FK spectra templates";
    };
    getDefaultFilterDefinitionByUsageMap: {
        url: "/default-filter-definitions-by-usage-map";
        friendlyName: "Default filter definitions by usage for channel segments";
    };
};
/**
 * Signal Feature Measurement Configuration Urls
 */
export declare const SignalFeatureMeasurementConfigurationUrls: {
    baseUrl: "/signal-feature-measurement-configuration-service/signal-feature-measurement-configuration";
    getAmplitudeMeasurementDefinitions: {
        url: "/amplitude-measurement-definition";
        friendlyName: "Amplitude measurement definition";
    };
    getDefaultStationsToMeasureByAmplitudeType: {
        url: "/default-stations-by-amplitude-type";
        friendlyName: "Default stations to measure amplitude type";
    };
    getAmplitudeMeasurementConditioningTemplates: {
        url: "/amplitude-measurement-conditioning-template";
        friendlyName: "Amplitude measurement conditioning templates";
    };
};
/**
 * Station Definition Service
 */
export declare const StationDefinitionUrls: {
    baseUrl: "/station-definition-service/station-definition";
    getStationGroupsByNames: {
        url: "/station-groups/query/names";
        friendlyName: "Station groups";
    };
    getStations: {
        url: "/stations/query/names";
        friendlyName: string;
    };
    getStationsEffectiveAtTimes: {
        url: "/stations/query/change-times";
        friendlyName: "Stations effective at times";
    };
    getChannelsByNames: {
        url: "/channels/query/names";
        friendlyName: "Channel definitions";
    };
    getChannelsByNamesTimeRange: {
        url: "/channels/query/names-timerange";
        friendlyName: "Channel definitions";
    };
};
/**
 * System Event Gateway
 */
export declare const SystemEventGatewayUrls: {
    baseUrl: "/interactive-analysis-api-gateway";
    sendClientLogs: {
        url: "/client-log";
        friendlyName: "Publish client logs";
    };
    publishDerivedChannels: {
        url: "/publish-derived-channels";
        friendlyName: "Publish derived channels";
    };
};
/**
 * User Manager Service
 */
export declare const UserManagerServiceUrls: {
    baseUrl: "/user-manager-service";
    getUserProfile: {
        url: "/user-profile";
        friendlyName: "User profile";
    };
    getDefaultUserProfile: {
        url: "/user-profile/default";
        friendlyName: "Default user profile";
    };
    setUserProfile: {
        url: "/user-profile/store";
        friendlyName: "Set user profile";
    };
};
/**
 * Waveform Manager Service
 */
export declare const WaveformManagerServiceUrls: {
    baseUrl: "/waveform-manager-service/waveform";
    getChannelSegment: {
        url: "/channel-segment/query/channel-timerange";
        friendlyName: "Channel segments";
    };
    findQCSegmentsByChannelAndTimeRange: {
        url: "/qc-segment/query/channel-timerange/canned";
        friendlyName: "QC segments";
    };
    findEventBeamsByEventHypothesisAndStations: {
        url: string;
        friendlyName: "Event beams by hypothesis and stations";
    };
};
/**
 * Workflow Manager Service
 */
export declare const WorkflowManagerServiceUrls: {
    baseUrl: "/workflow-manager-service/workflow-manager";
    activityDefinitionsById: {
        url: "/activity-definitions";
        friendlyName: "Activity Definitions";
    };
    getCustomScanActivityDefinition: {
        url: "/custom-scan-activity-definition";
        friendlyName: "Custom Scan Definition";
    };
    workflow: {
        url: "/workflow-definition";
        friendlyName: "Workflow definitions";
    };
    stageIntervalsByIdAndTime: {
        url: "/interval/stage/query/ids-timerange";
        friendlyName: "Workflow stage intervals";
    };
    reserveActivityInterval: {
        url: "/interval/activity/reserve";
        friendlyName: "Reserve activity interval";
    };
    reserveInteractiveAnalysisStageInterval: {
        url: "/interval/stage/interactive-analysis/reserve";
        friendlyName: "Reserve stage interval";
    };
    updateActivityIntervalStatus: {
        url: "/interval/activity/update";
        friendlyName: "Update activity interval status";
    };
    updateStageIntervalStatus: {
        url: "/interval/stage/interactive-analysis/update";
        friendlyName: "Update stage interval status";
    };
};
/**
 * File Store Service
 */
export declare const FileStoreServiceUrls: {
    baseUrl: "/interactive-analysis-api-gateway/file-store";
    listBuckets: {
        url: "/list-buckets";
        friendlyName: "List Buckets in File Store";
    };
    listObjects: {
        url: "/list-objects";
        friendlyName: "List Objects in File Store";
    };
    getObject: {
        url: "/get-object";
        friendlyName: "Get Object From File Store";
    };
    statObject: {
        url: "/stat-object";
        friendlyName: "Get Stat Object From File Store";
    };
};
//# sourceMappingURL=types.d.ts.map