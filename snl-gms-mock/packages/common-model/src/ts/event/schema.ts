/* eslint-disable @typescript-eslint/no-magic-numbers */
import uniq from 'lodash/uniq';
import { z } from 'zod';

import { channelSegmentSchema } from '../channel-segment/schema';
import { doubleValueSchema, locationSchema } from '../common/schema';
import type { SignalDetectionTypes } from '../common-model';
import { createEntityReferenceSchema } from '../faceted/schema';
import { FeatureMeasurementType } from '../signal-detection';
import {
  amplitudeMeasurementValueSchema,
  durationValueSchema,
  enumeratedMeasurementValueSchema,
  featureMeasurementSchema,
  featureMeasurementValueSchema,
  signalDetectionEntityReferenceSchema,
  signalDetectionHypothesisFacetedSchema,
  signalDetectionHypothesisSchema,
  valueTypeSchema
} from '../signal-detection/schema';
import {
  channelSchema,
  channelVersionReferenceSchema,
  stationEntityReferenceSchema,
  stationSchema,
  stationVersionReferenceSchema
} from '../station-definitions';
import type { ToZodSchema } from '../type-util/zod-util';
import { workflowDefinitionIdSchema } from '../workflow/schema';
import type {
  Ellipse,
  Ellipsoid,
  Event,
  EventHypothesis,
  EventHypothesisId,
  EventLocation,
  FeaturePrediction,
  FeaturePredictionComponent,
  LocationBehavior,
  LocationRestraint,
  LocationSolution,
  LocationUncertainty,
  NetworkMagnitudeBehavior,
  NetworkMagnitudeSolution,
  PredictionValue,
  PreferredEventHypothesis,
  StationMagnitudeSolution
} from './types';
import {
  DepthRestraintReason,
  FeaturePredictionComponentType,
  FeaturePredictionDerivativeType,
  MagnitudeType,
  NetworkMagnitudeStatus,
  RestrainerType,
  Restraint,
  RestraintType,
  ScalingFactorType
} from './types';

/** A zod schema defining the {@link EventHypothesisId}. */
export const eventHypothesisIdSchema = z
  .object({
    eventId: z.string(),
    hypothesisId: z.string()
  } satisfies ToZodSchema<EventHypothesisId>)
  .strict();

/** A zod schema defining the {@link LocationRestraint}. */
export const locationRestraintSchema = z
  .object({
    restrainer: z.nativeEnum(RestrainerType).optional(),
    depthRestraintReason: z.nativeEnum(DepthRestraintReason).optional(),
    depthRestraintType: z.nativeEnum(RestraintType),
    depthRestraintKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    epicenterRestraintType: z.nativeEnum(RestraintType),
    latitudeRestraintDegrees: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    longitudeRestraintDegrees: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    timeRestraintType: z.nativeEnum(RestraintType),
    timeRestraint: z.number().optional()
  } satisfies ToZodSchema<LocationRestraint>)
  .strict()
  .refine(
    data =>
      data.depthRestraintKm == null ||
      (data.depthRestraintKm >= -100 && data.depthRestraintKm <= 1000),
    () => ({
      message: `-100.0 <= depth <= 1000.0`,
      path: ['depthRestraintKm']
    })
  )
  .refine(
    data =>
      data.latitudeRestraintDegrees == null ||
      (data.latitudeRestraintDegrees >= -90 && data.latitudeRestraintDegrees <= 90),
    () => ({
      message: `-90 <= latitudeRestraintDegrees <= 90`,
      path: ['latitudeRestraintDegrees']
    })
  )
  .refine(
    data =>
      data.longitudeRestraintDegrees == null ||
      (data.longitudeRestraintDegrees >= -180 && data.longitudeRestraintDegrees <= 180),
    () => ({
      message: `-180 <= longitudeRestraintDegrees <= 180`,
      path: ['longitudeRestraintDegrees']
    })
  );

/** A zod schema defining the {@link Ellipse}. */
export const ellipseSchema = z
  .object({
    aprioriStandardError: z.number({ coerce: true }).transform(value => Number(value)),
    scalingFactorType: z.nativeEnum(ScalingFactorType),
    kWeight: z.number({ coerce: true }).transform(value => Number(value)),
    confidenceLevel: z.number({ coerce: true }).transform(value => Number(value)),
    semiMajorAxisLengthKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMajorAxisTrendDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMinorAxisLengthKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    depthUncertaintyKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    timeUncertainty: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional()
  } satisfies ToZodSchema<Ellipse>)
  .strict()
  .refine(
    data => data.aprioriStandardError >= 0 && data.aprioriStandardError <= 1000,
    () => ({
      message: `0 <= aprioriStandardError <= 1000`,
      path: ['aprioriStandardError']
    })
  )
  .refine(
    data => data.confidenceLevel >= 0.5 && data.confidenceLevel <= 1,
    () => ({
      message: `0.5 <= confidenceLevel <= 1.0`,
      path: ['confidenceLevel']
    })
  )
  .refine(
    data => data.depthUncertaintyKm == null || data.depthUncertaintyKm >= 0,
    () => ({
      message: `depthUncertaintyKm >= 0.0`,
      path: ['depthUncertaintyKm']
    })
  )
  .refine(
    data => data.kWeight >= 0,
    () => ({
      message: `kWeight >= 0.0`,
      path: ['kWeight']
    })
  )
  .refine(
    data => data.semiMajorAxisLengthKm == null || data.semiMajorAxisLengthKm > 0,
    () => ({
      message: `semiMajorAxisLengthKm > 0.0`,
      path: ['semiMajorAxisLengthKm']
    })
  )
  .refine(
    data =>
      data.semiMajorAxisTrendDeg == null ||
      (data.semiMajorAxisTrendDeg >= 0 && data.semiMajorAxisTrendDeg < 360),
    () => ({
      message: `0.0 <= semiMajorAxisTrendDeg < 360`,
      path: ['semiMajorAxisTrendDeg']
    })
  )
  .refine(
    data => data.semiMinorAxisLengthKm == null || data.semiMinorAxisLengthKm > 0,
    () => ({
      message: `semiMinorAxisLengthKm > 0.0`,
      path: ['semiMinorAxisLengthKm']
    })
  )
  .refine(
    data => data.timeUncertainty == null || data.timeUncertainty >= 0,
    () => ({
      message: `timeUncertainty >= 0.0`,
      path: ['timeUncertainty']
    })
  );

/** A zod schema defining the {@link Ellipsoid}. */
export const ellipsoidSchema = z
  .object({
    aprioriStandardError: z.number({ coerce: true }).transform(value => Number(value)),
    scalingFactorType: z.nativeEnum(ScalingFactorType),
    kWeight: z.number({ coerce: true }).transform(value => Number(value)),
    confidenceLevel: z.number({ coerce: true }).transform(value => Number(value)),
    semiMajorAxisLengthKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMajorAxisTrendDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMajorAxisPlungeDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiIntermediateAxisLengthKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiIntermediateAxisTrendDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiIntermediateAxisPlungeDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMinorAxisLengthKm: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMinorAxisTrendDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    semiMinorAxisPlungeDeg: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    timeUncertainty: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional()
  } satisfies ToZodSchema<Ellipsoid>)
  .strict()
  .refine(
    data => data.aprioriStandardError >= 0 && data.aprioriStandardError <= 1000,
    () => ({
      message: `0 <= aprioriStandardError <= 1000`,
      path: ['aprioriStandardError']
    })
  )
  .refine(
    data => data.kWeight >= 0,
    () => ({
      message: `kWeight >= 0`,
      path: ['kWeight']
    })
  )
  .refine(
    data => data.confidenceLevel >= 0.5 && data.confidenceLevel <= 1,
    () => ({
      message: `0.5 <= confidenceLevel <= 1.0`,
      path: ['confidenceLevel']
    })
  )
  .refine(
    data => data.semiMajorAxisLengthKm == null || data.semiMajorAxisLengthKm > 0,
    () => ({
      message: `semiMajorAxisLengthKm > 0.0`,
      path: ['semiMajorAxisLengthKm']
    })
  )
  .refine(
    data =>
      data.semiMajorAxisTrendDeg == null ||
      (data.semiMajorAxisTrendDeg >= 0 && data.semiMajorAxisTrendDeg < 360),
    () => ({
      message: `0.0 <= semiMajorAxisTrendDeg < 360.0`,
      path: ['semiMajorAxisTrendDeg']
    })
  )
  .refine(
    data =>
      data.semiMajorAxisPlungeDeg == null ||
      (data.semiMajorAxisPlungeDeg >= -90 && data.semiMajorAxisPlungeDeg <= 90),
    () => ({
      message: `-90.0 <= semiMajorAxisPlungeDeg <= 90.0`,
      path: ['semiMajorAxisPlungeDeg']
    })
  )
  .refine(
    data => data.semiIntermediateAxisLengthKm == null || data.semiIntermediateAxisLengthKm > 0,
    () => ({
      message: `semiIntermediateAxisLengthKm > 0.0`,
      path: ['semiIntermediateAxisLengthKm']
    })
  )
  .refine(
    data =>
      data.semiIntermediateAxisTrendDeg == null ||
      (data.semiIntermediateAxisTrendDeg >= 0 && data.semiIntermediateAxisTrendDeg < 360),
    () => ({
      message: `0.0 <= semiIntermediateAxisTrendDeg < 360.0	`,
      path: ['semiIntermediateAxisTrendDeg']
    })
  )
  .refine(
    data =>
      data.semiIntermediateAxisPlungeDeg == null ||
      (data.semiIntermediateAxisPlungeDeg >= -90 && data.semiIntermediateAxisPlungeDeg <= 90),
    () => ({
      message: `-90.0 <= semiIntermediateAxisPlungeDeg <= 90.0`,
      path: ['semiIntermediateAxisPlungeDeg']
    })
  )
  .refine(
    data => data.semiMinorAxisLengthKm == null || data.semiMinorAxisLengthKm > 0,
    () => ({
      message: `semiMinorAxisLengthKm > 0.0`,
      path: ['semiMinorAxisLengthKm']
    })
  )
  .refine(
    data =>
      data.semiMinorAxisTrendDeg == null ||
      (data.semiMinorAxisTrendDeg >= 0 && data.semiMinorAxisTrendDeg < 360),
    () => ({
      message: `0.0 <= semiMinorAxisTrendDeg < 360.0`,
      path: ['semiMinorAxisTrendDeg']
    })
  )
  .refine(
    data =>
      data.semiMinorAxisPlungeDeg == null ||
      (data.semiMinorAxisPlungeDeg >= -90 && data.semiMinorAxisPlungeDeg <= 90),
    () => ({
      message: `-90.0 <= semiMinorAxisPlungeDeg <= 90.0`,
      path: ['semiMinorAxisPlungeDeg']
    })
  )
  .refine(
    data => data.timeUncertainty == null || data.timeUncertainty >= 0,
    () => ({
      message: `timeUncertainty >= 0.0`,
      path: ['timeUncertainty']
    })
  );

/** A zod schema defining the {@link LocationUncertainty}. */
export const locationUncertaintySchema = z
  .object({
    xx: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    xy: z.number().optional(),
    xz: z.number().optional(),
    xt: z.number().optional(),
    yy: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    yz: z.number().optional(),
    yt: z.number().optional(),
    zz: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    zt: z.number().optional(),
    tt: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    stdDevTravelTimeResiduals: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional(),
    ellipses: z.array(ellipseSchema),
    ellipsoids: z.array(ellipsoidSchema)
  } satisfies ToZodSchema<LocationUncertainty>)
  .strict()
  .refine(
    data => data.xx == null || data.xx > 0,
    () => ({
      message: `xx > 0`,
      path: ['xx']
    })
  )
  .refine(
    data => data.yy == null || data.yy > 0,
    () => ({
      message: `yy > 0`,
      path: ['yy']
    })
  )
  .refine(
    data => data.zz == null || data.zz > 0,
    () => ({
      message: `zz > 0`,
      path: ['zz']
    })
  )
  .refine(
    data => data.tt == null || data.tt > 0,
    () => ({
      message: `tt > 0`,
      path: ['tt']
    })
  )
  .refine(
    data => data.stdDevTravelTimeResiduals == null || data.stdDevTravelTimeResiduals >= 0,
    () => ({
      message: `stdDevTravelTimeResiduals >= 0`,
      path: ['stdDevTravelTimeResiduals']
    })
  )
  .refine(
    data =>
      data.ellipses.length === 0 ||
      uniq(data.ellipses.map(e => `${e.scalingFactorType}/${e.confidenceLevel}`)).length ===
        data.ellipses.length,
    () => ({
      message: `Every element in the ellipses collection must have a unique combination of scalingFactorType and confidenceLevel.`,
      path: ['ellipses']
    })
  )
  .refine(
    data =>
      data.ellipsoids.length === 0 ||
      uniq(data.ellipsoids.map(e => `${e.scalingFactorType}/${e.confidenceLevel}`)).length ===
        data.ellipsoids.length,
    () => ({
      message: `Every element in the ellipsoids collection must have a unique combination of scalingFactorType and confidenceLevel.`,
      path: ['ellipsoids']
    })
  );

/** A zod schema defining the {@link StationMagnitudeSolution}. */
export const stationMagnitudeSolutionSchema = z
  .object({
    type: z.nativeEnum(MagnitudeType),
    attenuationModel: z.string(),
    station: z.union([stationSchema, stationEntityReferenceSchema, stationVersionReferenceSchema]),
    phase: z.string(),
    magnitude: doubleValueSchema.optional(),
    measurement: featureMeasurementSchema.optional(),
    modelCorrection: z.number().optional(),
    stationCorrection: z.number().optional()
  } satisfies ToZodSchema<StationMagnitudeSolution>)
  .strict();

/** A zod schema defining the {@link NetworkMagnitudeBehavior}. */
export const networkMagnitudeBehaviorSchema = z
  .object({
    defining: z.boolean(),
    stationMagnitudeSolution: stationMagnitudeSolutionSchema,
    residual: z.number().optional(),
    weight: z.number().optional()
  } satisfies ToZodSchema<NetworkMagnitudeBehavior>)
  .strict();

/** A zod schema defining the {@link NetworkMagnitudeSolution}. */
export const networkMagnitudeSolutionSchema = z
  .object({
    magnitude: doubleValueSchema.optional(),
    magnitudeBehaviors: z.array(networkMagnitudeBehaviorSchema),
    type: z.nativeEnum(MagnitudeType),
    status: z.nativeEnum(NetworkMagnitudeStatus)
  } satisfies ToZodSchema<NetworkMagnitudeSolution>)
  .strict();

/** A zod schema defining the {@link FeaturePredictionComponent}. */
export const featurePredictionComponentSchema = z
  .object({
    value: z.union([
      doubleValueSchema,
      durationValueSchema,
      amplitudeMeasurementValueSchema,
      enumeratedMeasurementValueSchema
    ]),
    extrapolated: z.boolean(),
    featurePredictionComponent: z.nativeEnum(FeaturePredictionComponentType)
  } satisfies ToZodSchema<FeaturePredictionComponent>)
  .strict();

/** A zod schema defining the {@link PredictionValue}. */
export const predictionValueSchema = z
  .object({
    featureMeasurementType: z.nativeEnum(FeatureMeasurementType),
    predictedValue: featureMeasurementValueSchema,
    derivativeMap: z
      .record(
        z
          .nativeEnum(FeaturePredictionDerivativeType)
          .transform(value => FeaturePredictionDerivativeType[value.toString()]),
        z.union([valueTypeSchema, doubleValueSchema])
      )
      .optional(),
    featurePredictionComponents: z.array(featurePredictionComponentSchema)
  } satisfies ToZodSchema<PredictionValue>)
  .strict();

/** A zod schema defining the {@link EventLocation}. */
export const eventLocationSchema = z
  .object({
    latitudeDegrees: z.number(),
    longitudeDegrees: z.number(),
    depthKm: z.number(),
    time: z.number()
  } satisfies ToZodSchema<EventLocation>)
  .strict();

// /** A zod schema defining the {@link FeaturePrediction}. */
export const featurePredictionSchema = z
  .object({
    phase: z.string(),
    extrapolated: z.boolean(),
    predictionValue: predictionValueSchema,
    sourceLocation: eventLocationSchema,
    receiverLocation: locationSchema,
    channel: z.union([channelSchema, channelVersionReferenceSchema]).optional(),
    predictionChannelSegment: channelSegmentSchema.optional(),
    predictionType: z.nativeEnum(FeatureMeasurementType)
  } satisfies ToZodSchema<FeaturePrediction>)
  .strict();

/** A zod schema defining the {@link LocationBehavior}. */
export const locationBehaviorSchema = z
  .object({
    defining: z.boolean(),
    measurement: featureMeasurementSchema,
    prediction: featurePredictionSchema.optional(),
    requestedDefining: z.boolean(),
    residual: z.number().optional(),
    weight: z
      .number({ coerce: true })
      .transform(value => Number(value))
      .optional()
  } satisfies ToZodSchema<LocationBehavior>)
  .strict()
  .refine(
    data => data.weight == null || data.weight > 0,
    () => ({
      message: `weight > 0`,
      path: ['weight']
    })
  );

export type LocationSolutionSchema = z.ZodObject<{
  id: z.ZodString;
  networkMagnitudeSolutions: z.ZodArray<typeof networkMagnitudeSolutionSchema>;
  featurePredictions: z.ZodObject<{
    featurePredictions: z.ZodArray<typeof featurePredictionSchema>;
  }>;
  locationUncertainty: z.ZodOptional<typeof locationUncertaintySchema>;
  locationBehaviors: z.ZodArray<typeof locationBehaviorSchema>;
  location: typeof eventLocationSchema;
  locationRestraint: typeof locationRestraintSchema;
}>;

/** A zod schema defining the {@link LocationSolution}. */
export const locationSolutionSchema: LocationSolutionSchema = z
  .object({
    id: z.string(),
    networkMagnitudeSolutions: z.array(networkMagnitudeSolutionSchema),
    featurePredictions: z.object({
      featurePredictions: z.array(featurePredictionSchema)
    }),
    locationUncertainty: locationUncertaintySchema.optional(),
    locationBehaviors: z.array(locationBehaviorSchema),
    location: eventLocationSchema,
    locationRestraint: locationRestraintSchema
  } satisfies ToZodSchema<LocationSolution>)
  .strict();

/**
 * Represents an entity reference for a {@link LocationSolution}.
 *
 * This schema is used to validate {@link LocationSolution} entity references, ensuring that they conform to the expected structure and types.
 */
export const locationSolutionEntityReferenceSchema = createEntityReferenceSchema(
  z.object({ id: z.string() })
).strict();

/**
 * Represents an entity reference for a {@link EventHypothesis}.
 *
 * This schema is used to validate {@link EventHypothesis} entity references, ensuring that they conform to the expected structure and types.
 */
export const eventHypothesiEntityReferenceSchema = createEntityReferenceSchema(
  z.object({ id: eventHypothesisIdSchema })
).strict();

/** A zod schema defining the {@link EventHypothesis}. */
export const eventHypothesisSchema = z
  .object({
    id: eventHypothesisIdSchema,
    rejected: z.boolean(),
    deleted: z.boolean(),
    parentEventHypotheses: z.array(eventHypothesiEntityReferenceSchema),
    associatedSignalDetectionHypotheses: z.array(signalDetectionHypothesisFacetedSchema),
    preferredLocationSolution: z.object({
      id: z.string()
    }),
    locationSolutions: z.array(locationSolutionSchema),
    _uiMissingLocationConstraints: z.array(z.nativeEnum(Restraint)).optional(),
    _uiHasUnsavedChanges: z.number().optional()
  } satisfies ToZodSchema<EventHypothesis>)
  .strict();

/** A zod schema defining the {@link EventHypothesis} with fully populated {@link SignalDetectionTypes.SignalDetection}s. */
export const eventHypothesisWithFullyPopulatedSignalDetectionsSchema = z
  .object({
    id: eventHypothesisIdSchema,
    rejected: z.boolean(),
    deleted: z.boolean(),
    parentEventHypotheses: z.array(eventHypothesiEntityReferenceSchema),
    associatedSignalDetectionHypotheses: z.array(signalDetectionHypothesisSchema),
    preferredLocationSolution: z.object({
      id: z.string()
    }),
    locationSolutions: z.array(locationSolutionSchema),
    _uiMissingLocationConstraints: z.array(z.nativeEnum(Restraint)).optional(),
    _uiHasUnsavedChanges: z.number().optional()
  } satisfies ToZodSchema<
    Omit<EventHypothesis, 'associatedSignalDetectionHypotheses'> & {
      associatedSignalDetectionHypotheses: SignalDetectionTypes.SignalDetectionHypothesis[];
    }
  >)
  .strict();

/** A zod schema defining the {@link EventHypothesis} that is an id-only. */
export const eventHypothesisIdOnlySchema = z
  .object({
    id: eventHypothesisIdSchema
  } satisfies ToZodSchema<Pick<EventHypothesis, 'id'>>)
  .strict();

/** A zod schema defining the {@link PreferredEventHypothesis}. */
export const preferredEventHypothesisSchema = z
  .object({
    preferredBy: z.string(),
    stage: workflowDefinitionIdSchema,
    preferred: eventHypothesiEntityReferenceSchema
  } satisfies ToZodSchema<PreferredEventHypothesis>)
  .strict();

/** A zod schema defining the {@link Event}. */
export const eventSchema = z
  .object({
    id: z.string(),
    rejectedSignalDetectionAssociations: z.array(signalDetectionEntityReferenceSchema),
    monitoringOrganization: z.string(),
    eventHypotheses: z.array(eventHypothesisSchema).min(1),
    preferredEventHypothesisByStage: z.array(preferredEventHypothesisSchema),
    finalEventHypothesisHistory: z.array(eventHypothesiEntityReferenceSchema),
    overallPreferred: eventHypothesiEntityReferenceSchema.optional(),
    _uiHasUnsavedChanges: z.number().optional(),
    _uiIsVirtual: z.boolean().optional()
  } satisfies ToZodSchema<Event>)
  .strict()
  .refine(
    data => data._uiIsVirtual == null || data._uiHasUnsavedChanges === undefined,
    () => ({
      message: `A virtual event must not have unsaved changes`,
      path: ['_uiIsVirtual']
    })
  );
