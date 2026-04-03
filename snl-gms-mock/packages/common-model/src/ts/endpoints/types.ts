/**
 * Enumerates the different possible priorities for requests.
 * ! Note, these need to map to numbers in the transpiled javascript code.
 */
export enum Priority {
  HIGHEST = 7,
  HIGH = 6,
  MEDIUM_HIGH = 5,
  MEDIUM = 4,
  MEDIUM_LOW = 3,
  LOW = 2,
  LOWEST = 1
}

export const DEFAULT_PRIORITY = Priority.MEDIUM;

/**
 * DAL Services (Data Fabric)
 */
export const DalServiceUrls = {
  baseUrl: '',
  fdsnDataSelect: {
    url: '/rest/waveform/dataselect/1/query' as const,
    friendlyName: 'FDSN data select' as const
  }
};

/**
 * Event Manager Service
 */
export const EventManagerUrls = {
  baseUrl: '/event-manager-service/event' as const,
  getEventsWithDetectionsAndSegmentsByTime: {
    url: '/detections-and-segments/time' as const,
    friendlyName: 'Events by time' as const
  },
  findEventsByAssociatedSignalDetectionHypotheses: {
    url: '/associated-signal-detection-hypotheses' as const,
    friendlyName: 'Events by signal detection association' as const
  },
  predictFeaturesForEventLocation: {
    url: '/predict-for-event-location' as const,
    friendlyName: 'Event feature predictions' as const
  },
  status: { url: '/status' as const, friendlyName: 'Event statuses' as const },
  update: { url: '/update' as const, friendlyName: 'Update event status' as const }
};

/**
 * Event Relocation Service
 */
export const EventRelocationUrls = {
  baseUrl: '/event-relocation-service/relocation' as const,
  getEventRelocationProcessingDefinition: {
    url: '/event-relocation-processing-definition' as const,
    friendlyName: 'Event relocation processing definition' as const
  },
  getDefaultDefiningFeatureMaps: {
    url: '/default-defining-feature-maps' as const,
    friendlyName: 'Default defining feature maps' as const
  },
  relocate: {
    url: '/relocate' as const,
    friendlyName: 'Event relocate' as const
  }
};

/**
 * Magnitude Estimation Service
 */
export const MagnitudeEstimationUrls = {
  baseUrl: '/magnitude-estimation-service' as const,
  getDefiningAndNonOverridableStations: {
    url: '/query/defining-and-nonoverridable-stations' as const,
    friendlyName: 'Defining and Non-Overridable Stations' as const
  },
  getStationMagnitudeDefinitions: {
    url: '/query/definitions/station-magnitude' as const,
    friendlyName: 'Station Magnitude Corrections Definitions' as const
  },
  getNetworkMagnitudeDefinitions: {
    url: '/query/definitions/network-magnitude' as const,
    friendlyName: 'Network Magnitude Definitions' as const
  },
  getStationMagnitudeCorrectionDefinitions: {
    url: '/station-magnitude-corrections-definitions' as const,
    friendlyName: 'Station Magnitude Corrections Definitions' as const
  },
  getNamedLocationCorrectionsForStationAndMagnitudeType: {
    url: '/station-magnitude-location-corrections' as const,
    friendlyName: 'Named Location Corrections for Station and Magnitude Type' as const
  },
  estimateMagnitudes: {
    url: '/estimate-magnitudes' as const,
    friendlyName: 'Estimate magnitudes' as const
  }
};

/**
 * Fk Control
 */
export const FkControlUrls = {
  baseUrl: '/fk-control-service' as const,
  computeFkSpectra: { url: '/spectra/interactive' as const, friendlyName: 'FK spectra' as const }
};

/**
 * Processing Configuration
 */
export const ProcessingConfigUrls = {
  baseUrl: '/ui-processing-configuration-service' as const,
  getProcessingConfiguration: {
    url: '/resolve' as const,
    friendlyName: 'Processing configuration' as const
  }
};

/**
 * Signal Detections Manager Service
 */
export const SignalDetectionManagerUrls = {
  baseUrl: '/signal-detection-manager-service/signal-detection' as const,
  getFilterDefinitionsForSignalDetections: {
    url: '/filter-definitions-by-usage/query/signal-detections/canned' as const,
    friendlyName: 'Filter definitions for signal detections' as const
  },
  getDetectionsWithSegmentsByStationsAndTime: {
    url: '/signal-detections-with-channel-segments/query/stations-timerange' as const,
    friendlyName: 'Signal detections by station and time' as const
  }
};

/**
 * Signal Enhancement Configuration
 */
export const SignalEnhancementConfigurationUrls = {
  baseUrl: '/signal-enhancement-configuration-service/signal-enhancement-configuration' as const,
  getSignalEnhancementConfiguration: {
    url: '/filter-lists-definition' as const,
    friendlyName: 'Filter configuration' as const
  },
  getDefaultFilterDefinitionsForSignalDetectionHypotheses: {
    url: '/default-filter-definitions-for-signal-detection-hypotheses' as const,
    friendlyName: 'Filter definitions for signal detections' as const
  },
  getDefaultFilterDefinitionByUsageForChannelSegments: {
    url: '/default-filter-definitions-for-channel-segments' as const,
    friendlyName: 'Filter definitions for channel segments' as const
  },
  getProcessingMaskDefinitions: {
    url: '/processing-mask-definitions' as const,
    friendlyName: 'Processing mask definitions' as const
  },
  getBeamformingTemplates: {
    url: '/beamforming-template' as const,
    friendlyName: 'Beamforming templates' as const
  },
  getRotationTemplates: {
    url: '/rotation-templates' as const,
    friendlyName: 'Rotation templates' as const
  },
  getFkReviewablePhases: {
    url: '/fk-reviewable-phases' as const,
    friendlyName: 'FK reviewable phases' as const
  },
  getFkSpectraTemplates: {
    url: '/fk-spectra-templates' as const,
    friendlyName: 'FK spectra templates' as const
  },
  getDefaultFilterDefinitionByUsageMap: {
    url: '/default-filter-definitions-by-usage-map' as const,
    friendlyName: 'Default filter definitions by usage for channel segments' as const
  }
};

/**
 * Signal Feature Measurement Configuration Urls
 */
export const SignalFeatureMeasurementConfigurationUrls = {
  baseUrl:
    '/signal-feature-measurement-configuration-service/signal-feature-measurement-configuration' as const,
  getAmplitudeMeasurementDefinitions: {
    url: '/amplitude-measurement-definition' as const,
    friendlyName: 'Amplitude measurement definition' as const
  },
  getDefaultStationsToMeasureByAmplitudeType: {
    url: '/default-stations-by-amplitude-type' as const,
    friendlyName: 'Default stations to measure amplitude type' as const
  },
  getAmplitudeMeasurementConditioningTemplates: {
    url: '/amplitude-measurement-conditioning-template' as const,
    friendlyName: 'Amplitude measurement conditioning templates' as const
  }
};

/**
 * Station Definition Service
 */
export const StationDefinitionUrls = {
  baseUrl: '/station-definition-service/station-definition' as const,
  getStationGroupsByNames: {
    url: '/station-groups/query/names' as const,
    friendlyName: 'Station groups' as const
  },
  getStations: { url: '/stations/query/names' as const, friendlyName: 'Stations by name' },
  getStationsEffectiveAtTimes: {
    url: '/stations/query/change-times' as const,
    friendlyName: 'Stations effective at times' as const
  },
  getChannelsByNames: {
    url: '/channels/query/names' as const,
    friendlyName: 'Channel definitions' as const
  },
  getChannelsByNamesTimeRange: {
    url: '/channels/query/names-timerange' as const,
    friendlyName: 'Channel definitions' as const
  }
};

/**
 * System Event Gateway
 */
export const SystemEventGatewayUrls = {
  baseUrl: '/interactive-analysis-api-gateway' as const,
  sendClientLogs: { url: '/client-log' as const, friendlyName: 'Publish client logs' as const },
  publishDerivedChannels: {
    url: '/publish-derived-channels' as const,
    friendlyName: 'Publish derived channels' as const
  }
};

/**
 * User Manager Service
 */
export const UserManagerServiceUrls = {
  baseUrl: '/user-manager-service' as const,
  getUserProfile: { url: '/user-profile' as const, friendlyName: 'User profile' as const },
  getDefaultUserProfile: {
    url: '/user-profile/default' as const,
    friendlyName: 'Default user profile' as const
  },
  setUserProfile: {
    url: '/user-profile/store' as const,
    friendlyName: 'Set user profile' as const
  }
};

/**
 * Waveform Manager Service
 */
export const WaveformManagerServiceUrls = {
  baseUrl: '/waveform-manager-service/waveform' as const,
  // TODO: DAL - FdsnDataSelect - remove endpoint configuration once fully integrated with the DAL for fetching waveforms
  getChannelSegment: {
    url: '/channel-segment/query/channel-timerange' as const,
    friendlyName: 'Channel segments' as const
  },
  findQCSegmentsByChannelAndTimeRange: {
    url: '/qc-segment/query/channel-timerange/canned' as const,
    friendlyName: 'QC segments' as const
  },
  findEventBeamsByEventHypothesisAndStations: {
    url: '/event-beams/query/event-beams-by-event-hypotheses-and-stations',
    friendlyName: 'Event beams by hypothesis and stations' as const
  }
};

/**
 * Workflow Manager Service
 */
export const WorkflowManagerServiceUrls = {
  baseUrl: '/workflow-manager-service/workflow-manager' as const,
  activityDefinitionsById: {
    url: '/activity-definitions' as const,
    friendlyName: 'Activity Definitions' as const
  },
  getCustomScanActivityDefinition: {
    url: '/custom-scan-activity-definition' as const,
    friendlyName: 'Custom Scan Definition' as const
  },
  workflow: { url: '/workflow-definition' as const, friendlyName: 'Workflow definitions' as const },
  stageIntervalsByIdAndTime: {
    url: '/interval/stage/query/ids-timerange' as const,
    friendlyName: 'Workflow stage intervals' as const
  },
  reserveActivityInterval: {
    url: '/interval/activity/reserve' as const,
    friendlyName: 'Reserve activity interval' as const
  },
  reserveInteractiveAnalysisStageInterval: {
    url: '/interval/stage/interactive-analysis/reserve' as const,
    friendlyName: 'Reserve stage interval' as const
  },
  updateActivityIntervalStatus: {
    url: '/interval/activity/update' as const,
    friendlyName: 'Update activity interval status' as const
  },
  updateStageIntervalStatus: {
    url: '/interval/stage/interactive-analysis/update' as const,
    friendlyName: 'Update stage interval status' as const
  }
};

/**
 * File Store Service
 */
export const FileStoreServiceUrls = {
  baseUrl: '/interactive-analysis-api-gateway/file-store' as const,
  listBuckets: {
    url: '/list-buckets' as const,
    friendlyName: 'List Buckets in File Store' as const
  },
  listObjects: {
    url: '/list-objects' as const,
    friendlyName: 'List Objects in File Store' as const
  },
  getObject: {
    url: '/get-object' as const,
    friendlyName: 'Get Object From File Store' as const
  },
  statObject: {
    url: '/stat-object' as const,
    friendlyName: 'Get Stat Object From File Store' as const
  }
};
