import type { SetKeys } from '../type-util/type-util';
/**
 * JSON fields of type Instance.
 * ! Defines the fields to search that may contain Instance type values for serializing and deserializing
 */
export declare const JSON_INSTANT_NAMES: readonly ["creationTime", "currentIntervalEndTime", "effectiveAt", "effectiveForRequestTime", "effectiveTime", "effectiveUntil", "endTime", "measurementTime", "measurementWindowStart", "modificationTime", "processingEndTime", "processingStartTime", "referenceTime", "startTime", "time"];
/**
 * JSON fields of type Duration.
 * ! Defines the fields to search that may contain Duration type values for serializing and deserializing
 */
export declare const JSON_DURATION_NAMES: readonly ["beamDuration", "currentIntervalDuration", "defaultSDTimeUncertainty", "defaultRotationDuration", "defaultRotationLeadTime", "duration", "groupDelaySec", "lagBufferDuration", "lead", "leadBufferDuration", "leadDuration", "maskedSegmentMergeThreshold", "maximumOpenAnythingDuration", "maxPeriod", "measurementWindowDuration", "minimumRequestDuration", "minPeriod", "operationalPeriodEnd", "operationalPeriodStart", "panDoubleArrow", "panningBoundaryDuration", "panSingleArrow", "period", "spectrumStepDuration", "timeUncertainty", "trimWaveformDuration", "trimWaveformLead", "trimWaveformRetimeThreshold", "windowArrivalTimeLead", "windowDuration", "zasZoomInterval"];
/**
 * Custom JSON {@link InstantValue} entries.
 */
export declare const CUSTOM_JSON_INSTANT_VALUE_NAMES: readonly ["arrivalTime", "startTime"];
/**
 * Custom JSON {@link DurationValue} entries.
 */
export declare const CUSTOM_JSON_DURATION_VALUE_NAMES: readonly ["travelTime", "duration"];
export declare const InstanceKeySet: Set<"effectiveAt" | "effectiveForRequestTime" | "effectiveUntil" | "time" | "startTime" | "endTime" | "creationTime" | "modificationTime" | "processingStartTime" | "processingEndTime" | "effectiveTime" | "currentIntervalEndTime" | "measurementTime" | "measurementWindowStart" | "referenceTime">;
export declare const DurationKeySet: Set<"groupDelaySec" | "timeUncertainty" | "period" | "beamDuration" | "currentIntervalDuration" | "defaultSDTimeUncertainty" | "defaultRotationDuration" | "defaultRotationLeadTime" | "duration" | "lagBufferDuration" | "lead" | "leadBufferDuration" | "leadDuration" | "maskedSegmentMergeThreshold" | "maximumOpenAnythingDuration" | "maxPeriod" | "measurementWindowDuration" | "minimumRequestDuration" | "minPeriod" | "operationalPeriodEnd" | "operationalPeriodStart" | "panDoubleArrow" | "panningBoundaryDuration" | "panSingleArrow" | "spectrumStepDuration" | "trimWaveformDuration" | "trimWaveformLead" | "trimWaveformRetimeThreshold" | "windowArrivalTimeLead" | "windowDuration" | "zasZoomInterval">;
/**
 * A type containing all key strings which represent instance values in OSD-sent JSON objects.
 * ! Represents the json fields that may contain Instance type values for serializing and deserializing
 */
export type InstanceKeys = SetKeys<typeof InstanceKeySet>;
/**
 * A type containing all key strings which represent duration values in OSD-sent JSON objects.
 * ! Represents the json fields that may contain Duration type values for serializing and deserializing
 */
export type DurationKeys = SetKeys<typeof DurationKeySet>;
/**
 * A type containing all key strings which represent instance and duration values in OSD-sent JSON objects.
 * ! Represents the union of all json fields that may contain Instance or Duration type values for serializing and deserializing
 */
export type AllTimeKeys = InstanceKeys | DurationKeys;
//# sourceMappingURL=types.d.ts.map