import { z } from 'zod';
import { channelSegmentDescriptorSchema, channelSegmentFacetedSchema } from '../channel-segment/schema';
import { Units } from '../common';
import { doubleValueSchema } from '../common/schema';
import { createEntityReferenceSchema } from '../faceted/schema';
import { FilterDefinitionUsage } from '../filter';
import { filterDefinitionSchema } from '../filter/schema';
import { channelSchema, channelVersionReferenceSchema, stationEntityReferenceSchema, stationSchema, stationVersionReferenceSchema } from '../station-definitions';
import { FeatureMeasurementType, FirstMotionType } from './types';
import { ARRIVAL_TIME_PRECISION } from './util';
/** A zod schema defining the {@link DurationValue}. */
export const durationValueSchema = z
    .object({
    value: z.number(),
    standardDeviation: z.number().optional()
})
    .strict();
/** A zod schema defining the {@link InstantValue}. */
export const instantValueSchema = z
    .object({
    value: z.number(),
    standardDeviation: z.number().optional()
})
    .strict();
/** A zod schema defining the {@link ValueType}. */
export const valueTypeSchema = z
    .object({
    value: z.number(),
    standardDeviation: z.number().optional(),
    units: z.never()
})
    .strict();
/** A zod schema defining the {@link AmplitudeMeasurementValue}. */
export const amplitudeMeasurementValueSchema = z
    .object({
    amplitude: z.number(),
    period: z.number().optional(),
    measurementTime: z.number().optional(),
    measurementWindowStart: z.number().optional(),
    measurementWindowDuration: z.number().optional(),
    clipped: z.boolean().optional(),
    units: z.nativeEnum(Units)
})
    .strict();
/** A zod schema defining the {@link ArrivalTimeMeasurementValue}. */
export const arrivalTimeMeasurementValueSchema = z
    .object({
    arrivalTime: instantValueSchema,
    travelTime: durationValueSchema.optional()
})
    .strict()
    .refine(data => (data.arrivalTime.value.toString().split('.').at(1)?.length ?? 0) <= ARRIVAL_TIME_PRECISION, data => ({
    message: `Arrival time must be 6 decimal places or fewer, ${data.arrivalTime.value}`
}));
/** A zod schema defining the {@link DurationMeasurementValue}. */
export const durationMeasurementValueSchema = z
    .object({
    startTime: instantValueSchema,
    duration: durationValueSchema
})
    .strict();
/** A zod schema defining the {@link EnumeratedMeasurementValue}. */
export const enumeratedMeasurementValueSchema = z
    .object({
    value: z.union([z.nativeEnum(FirstMotionType), z.string()]),
    confidence: z.number().optional(),
    referenceTime: z.number().optional()
})
    .strict();
/** A zod schema defining the {@link NumericMeasurementValue}. */
export const numericMeasurementValueSchema = z
    .object({
    measuredValue: doubleValueSchema,
    referenceTime: z.number().optional()
})
    .strict();
/** A zod schema defining the {@link PhaseTypeMeasurementValue}. */
export const phaseTypeMeasurementValueSchema = z
    .object({
    value: z.string(),
    confidence: z.number().optional(),
    referenceTime: z.number().optional()
})
    .strict();
/** A zod schema defining the {@link FirstMotionMeasurementValue}. */
export const firstMotionMeasurementValueSchema = z
    .object({
    value: z.nativeEnum(FirstMotionType),
    confidence: z.number().optional(),
    referenceTime: z.number().optional()
})
    .strict();
/** A zod schema defining the {@link FirstMotionMeasurementValue}. */
export const featureMeasurementValueSchema = z.union([
    amplitudeMeasurementValueSchema,
    arrivalTimeMeasurementValueSchema,
    durationMeasurementValueSchema,
    numericMeasurementValueSchema,
    enumeratedMeasurementValueSchema
]);
/** A zod schema defining the {@link WaveformAndFilterDefinition}. */
export const waveformAndFilterDefinitionSchema = z
    .object({
    filterDefinitionUsage: z.nativeEnum(FilterDefinitionUsage).optional(),
    filterDefinition: filterDefinitionSchema.optional(),
    waveform: channelSegmentFacetedSchema
})
    .strict();
/** A zod schema defining the {@link FeatureMeasurement}. */
export const featureMeasurementSchema = z
    .object({
    channel: z.union([channelSchema, channelVersionReferenceSchema]),
    measuredChannelSegment: z
        .object({
        id: channelSegmentDescriptorSchema
    })
        .optional(),
    measurementValue: featureMeasurementValueSchema,
    featureMeasurementType: z.nativeEnum(FeatureMeasurementType),
    snr: doubleValueSchema.optional(),
    analysisWaveform: waveformAndFilterDefinitionSchema.optional()
})
    .strict();
/** A zod schema defining the {@link AmplitudeALROver2FeatureMeasurement}. */
export const amplitudeALROver2FeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    featureMeasurementType: z.literal(FeatureMeasurementType.AMPLITUDE_ALR_OVER_2),
    measuredValue: amplitudeMeasurementValueSchema
})
    .strict();
/** A zod schema defining the {@link AmplitudeANLOver2FeatureMeasurement}. */
export const amplitudeANLOver2FeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    featureMeasurementType: z.literal(FeatureMeasurementType.AMPLITUDE_ANL_OVER_2),
    measuredValue: amplitudeMeasurementValueSchema
})
    .strict();
/** A zod schema defining the {@link AmplitudeANPOver2FeatureMeasurement}. */
export const amplitudeANPOver2FeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    featureMeasurementType: z.literal(FeatureMeasurementType.AMPLITUDE_ANP_OVER_2),
    measuredValue: amplitudeMeasurementValueSchema
})
    .strict();
/** A zod schema defining the {@link AmplitudeA5Over2FeatureMeasurement}. */
export const amplitudeA5Over2FeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    featureMeasurementType: z.literal(FeatureMeasurementType.AMPLITUDE_A5_OVER_2),
    measuredValue: amplitudeMeasurementValueSchema
})
    .strict();
/** A zod schema defining the {@link ArrivalTimeFeatureMeasurement}. */
export const arrivalTimeFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: arrivalTimeMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.ARRIVAL_TIME)
})
    .strict();
/** A zod schema defining the {@link EmergenceAngleFeatureMeasurement}. */
export const emergenceAngleFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: numericMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.EMERGENCE_ANGLE)
})
    .strict();
/** A zod schema defining the {@link LongPeriodFirstMotionFeatureMeasurement}. */
export const longPeriodFirstMotionFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: firstMotionMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.LONG_PERIOD_FIRST_MOTION)
})
    .strict();
/** A zod schema defining the {@link PhaseTypeFeatureMeasurement}. */
export const phaseTypeFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: phaseTypeMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.PHASE)
})
    .strict();
/** A zod schema defining the {@link ReceiverToSourceAzimuthFeatureMeasurement}. */
export const receiverToSourceAzimuthFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: numericMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.RECEIVER_TO_SOURCE_AZIMUTH)
})
    .strict();
/** A zod schema defining the {@link RectilinearityFeatureMeasurement}. */
export const rectilinearityFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: numericMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.RECTILINEARITY)
})
    .strict();
/** A zod schema defining the {@link RootMeanSquareFeatureMeasurement}. */
export const rootMeanSquareFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: amplitudeMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.ROOT_MEAN_SQUARE)
})
    .strict();
/** A zod schema defining the {@link ShortPeriodFirstMotionFeatureMeasurement}. */
export const shortPeriodFirstMotionFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: firstMotionMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.SHORT_PERIOD_FIRST_MOTION)
})
    .strict();
/** A zod schema defining the {@link SlownessFeatureMeasurement}. */
export const slownessFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: numericMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.SLOWNESS)
})
    .strict();
/** A zod schema defining the {@link SourceToReceiverAzimuthFeatureMeasurement}. */
export const sourceToReceiverAzimuthFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: numericMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.SOURCE_TO_RECEIVER_AZIMUTH)
})
    .strict();
/** A zod schema defining the {@link SourceToReceiverDistanceFeatureMeasurement}. */
export const sourceToReceiverDistanceFeatureMeasurementSchema = z
    .object({
    ...featureMeasurementSchema.shape,
    measurementValue: numericMeasurementValueSchema,
    featureMeasurementType: z.literal(FeatureMeasurementType.SOURCE_TO_RECEIVER_DISTANCE)
})
    .strict();
/** A zod schema defining the {@link AmplitudeFeatureMeasurement}. */
export const amplitudeFeatureMeasurementSchema = z.union([
    amplitudeANLOver2FeatureMeasurementSchema,
    amplitudeANLOver2FeatureMeasurementSchema,
    amplitudeANPOver2FeatureMeasurementSchema,
    amplitudeA5Over2FeatureMeasurementSchema,
    rootMeanSquareFeatureMeasurementSchema
]);
/** A zod schema defining the {@link DurationFeatureMeasurement}. */
export const durationFeatureMeasurementSchema = z.never();
/** A zod schema defining the {@link EnumerationFeatureMeasurement}. */
export const enumerationFeatureMeasurementSchema = z.union([
    longPeriodFirstMotionFeatureMeasurementSchema,
    phaseTypeFeatureMeasurementSchema,
    shortPeriodFirstMotionFeatureMeasurementSchema
]);
/** A zod schema defining the {@link NumericFeatureMeasurement}. */
export const numericFeatureMeasurementSchema = z.union([
    emergenceAngleFeatureMeasurementSchema,
    receiverToSourceAzimuthFeatureMeasurementSchema,
    rectilinearityFeatureMeasurementSchema,
    slownessFeatureMeasurementSchema,
    sourceToReceiverAzimuthFeatureMeasurementSchema,
    sourceToReceiverDistanceFeatureMeasurementSchema
]);
/** A zod schema defining the {@link AzimuthFeatureMeasurement}. */
export const azimuthFeatureMeasurementSchema = z.union([
    receiverToSourceAzimuthFeatureMeasurementSchema,
    sourceToReceiverAzimuthFeatureMeasurementSchema
]);
/** A zod schema defining the {@link SignalDetectionHypothesisId}. */
export const signalDetectionHypothesisIdSchema = z
    .object({
    id: z.string(),
    signalDetectionId: z.string()
})
    .strict();
/** A zod schema defining the {@link SignalDetectionHypothesisFaceted}. */
export const signalDetectionHypothesisFacetedSchema = z
    .object({
    id: signalDetectionHypothesisIdSchema
})
    .strict();
/** A zod schema defining the {@link SignalDetectionHypothesis}. */
export const signalDetectionHypothesisSchema = z
    .object({
    id: signalDetectionHypothesisIdSchema,
    effectiveAt: z.number().optional(),
    monitoringOrganization: z.string(),
    deleted: z.boolean(),
    station: z.union([stationSchema, stationVersionReferenceSchema]),
    featureMeasurements: z.array(featureMeasurementSchema),
    parentSignalDetectionHypothesis: signalDetectionHypothesisFacetedSchema.optional().nullable()
})
    .strict()
    .refine(data => data.featureMeasurements.length >= 2, data => ({
    message: `There must be at least two feature measurements ${data.featureMeasurements}`
}))
    .refine(data => data.featureMeasurements.find(fm => fm.featureMeasurementType === FeatureMeasurementType.ARRIVAL_TIME) != null, data => ({
    message: `There must be an arrival time feature measurement ${data.featureMeasurements}`
}))
    .refine(data => data.featureMeasurements.find(fm => fm.featureMeasurementType === FeatureMeasurementType.PHASE) != null, data => ({
    message: `There must be an phase feature measurement ${data.featureMeasurements}`
}));
/** A zod schema defining the {@link LocationDefiningWithChanges}. */
export const locationDefiningSchema = z
    .object({
    arrivalTime: z.boolean().optional(),
    azimuth: z.boolean().optional(),
    slowness: z.boolean().optional(),
    _uiHasUnsavedChanges: z.number()
})
    .strict();
/** A zod schema defining the {@link MagnitudeDefiningWithChanges}. */
export const magnitudeDefiningSchema = z
    .object({
    defining: z.record(z.string(), z.boolean()),
    _uiHasUnsavedChanges: z.number()
})
    .strict();
/** A zod schema defining the {@link SignalDetection}. */
export const signalDetectionSchema = z
    .object({
    id: z.string(),
    monitoringOrganization: z.string(),
    station: stationEntityReferenceSchema,
    signalDetectionHypotheses: z.array(signalDetectionHypothesisSchema).min(1),
    _uiHasUnsavedChanges: z.number().optional(),
    _uiHasUnsavedEventSdhAssociation: z.number().optional(),
    _uiFkChannelSegmentDescriptorId: channelSegmentDescriptorSchema.optional(),
    _uiFkBeamChannelSegmentDescriptorId: channelSegmentDescriptorSchema.optional(),
    _uiHasAcceptedFk: z.boolean().optional(),
    _uiLocationDefining: locationDefiningSchema.optional(),
    _uiMagnitudeDefining: magnitudeDefiningSchema.optional()
})
    .strict();
/**
 * Represents an entity reference for a  {@link SignalDetection}.
 *
 * This schema is used to validate  {@link SignalDetection} entity references, ensuring that they conform to the expected structure and types.
 */
export const signalDetectionEntityReferenceSchema = createEntityReferenceSchema(signalDetectionSchema).strict();
//# sourceMappingURL=schema.js.map