/**
 * JSON fields of type Instance.
 * ! Defines the fields to search that may contain Instance type values for serializing and deserializing
 */
export const JSON_INSTANT_NAMES = [
    'creationTime',
    'currentIntervalEndTime',
    'effectiveAt',
    'effectiveForRequestTime',
    'effectiveTime',
    'effectiveUntil',
    'endTime',
    'measurementTime',
    'measurementWindowStart',
    'modificationTime',
    'processingEndTime',
    'processingStartTime',
    'referenceTime',
    'startTime',
    'time'
];
/**
 * JSON fields of type Duration.
 * ! Defines the fields to search that may contain Duration type values for serializing and deserializing
 */
export const JSON_DURATION_NAMES = [
    'beamDuration',
    'currentIntervalDuration',
    'defaultSDTimeUncertainty',
    'defaultRotationDuration',
    'defaultRotationLeadTime',
    'duration',
    'groupDelaySec',
    'lagBufferDuration',
    'lead',
    'leadBufferDuration',
    'leadDuration',
    'maskedSegmentMergeThreshold',
    'maximumOpenAnythingDuration',
    'maxPeriod',
    'measurementWindowDuration',
    'minimumRequestDuration',
    'minPeriod',
    'operationalPeriodEnd',
    'operationalPeriodStart',
    'panDoubleArrow',
    'panningBoundaryDuration',
    'panSingleArrow',
    'period',
    'spectrumStepDuration',
    'timeUncertainty',
    'trimWaveformDuration',
    'trimWaveformLead',
    'trimWaveformRetimeThreshold',
    'windowArrivalTimeLead',
    'windowDuration',
    'zasZoomInterval'
];
/**
 * Custom JSON {@link InstantValue} entries.
 */
export const CUSTOM_JSON_INSTANT_VALUE_NAMES = ['arrivalTime', 'startTime'];
/**
 * Custom JSON {@link DurationValue} entries.
 */
export const CUSTOM_JSON_DURATION_VALUE_NAMES = ['travelTime', 'duration'];
export const InstanceKeySet = new Set(JSON_INSTANT_NAMES);
export const DurationKeySet = new Set(JSON_DURATION_NAMES);
//# sourceMappingURL=types.js.map