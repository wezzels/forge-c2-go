import { z } from 'zod';

import type { ChannelSegmentDescriptor } from '../channel-segment';
import { eventLocationSchema, locationSchema } from '../common/schema';
import { channelSchema, channelVersionReferenceSchema } from '../station-definitions';
import { frequencyAmplitudePhaseSchema } from '../station-definitions/response-definitions';
import type { ToZodSchema } from '../type-util/zod-util';
import type {
  AutoRegressiveFilterDefinition,
  AutoRegressiveFilterDescription,
  AutoRegressiveFilterParameters,
  BaseAutoregressiveFilterParameters,
  BaseFilter,
  CascadeFilterDefinition,
  CascadeFilterDescription,
  CascadeFilterParameters,
  Filter,
  FilterDefinition,
  FilterDescription,
  FilterList,
  FirFilterParameters,
  IirFilterParameters,
  LinearFilterDefinition,
  LinearFilterDescription,
  LinearFilterParameters,
  Parameters,
  PhaseMatchFilterDefinition,
  PhaseMatchFilterDescription,
  PhaseMatchFilterParameters,
  TaperDefinition
} from './types';
import {
  AutoregressiveFilterType,
  AutoregressiveType,
  BandType,
  FilterDefinitionUsage,
  FilterType,
  LinearFilterType,
  TaperFunction
} from './types';

const MAX_ORDER = 10;

/**
 * Represents the parameters for a linear filter.
 *
 * This schema is used to validate linear filter parameters, ensuring that they conform to the expected structure and types.
 */
export const linearFilterParametersSchema = z
  .object({
    sampleRateHz: z.number(),
    sampleRateToleranceHz: z.number(),
    groupDelaySec: z.number()
  } satisfies ToZodSchema<LinearFilterParameters>)
  .strict();

/**
 * Represents the parameters for an IIR filter.
 * See {@link IirFilterParameters}
 *
 * This schema is used to validate IIR filter parameters, ensuring that they conform to the expected structure and types.
 */
export const iirFilterParametersSchema = z
  .object({
    ...linearFilterParametersSchema.shape,
    sosNumeratorCoefficients: z.array(z.number()),
    sosDenominatorCoefficients: z.array(z.number()),
    // do not allow FIR parameter types
    transferFunctionBCoefficients: z.undefined().optional()
  } satisfies ToZodSchema<IirFilterParameters>)
  .strict();

/**
 * Represents the parameters for an FIR filter.
 * See {@link FirFilterParameters}
 *
 * This schema is used to validate FIR filter parameters, ensuring that they conform to the expected structure and types.
 */
export const firFilterParametersSchema = z
  .object({
    ...linearFilterParametersSchema.shape,
    // do not allow IIR parameter types
    transferFunctionBCoefficients: z.array(z.number()),
    sosNumeratorCoefficients: z.undefined().optional(),
    sosDenominatorCoefficients: z.undefined().optional()
  } satisfies ToZodSchema<FirFilterParameters>)
  .strict();

/**
 * Represents the parameters for a cascade filter.
 * See {@link CascadeFilterParameters}
 *
 * This schema is used to validate cascade filter parameters, ensuring that they conform to the expected structure and types.
 */
export const cascadeFilterParametersSchema = z
  .object({
    sampleRateHz: z.number(),
    sampleRateToleranceHz: z.number(),
    groupDelaySec: z.number().optional()
  } satisfies ToZodSchema<CascadeFilterParameters>)
  .strict();

/**
 * Represents the base parameters for an autoregressive filter.
 * See {@link BaseAutoregressiveFilterParameters}
 *
 * This schema is used to validate base autoregressive filter parameters, ensuring that they conform to the expected structure and types.
 */
export const baseAutoregressiveFilterParametersSchema = z
  .object({
    sampleRateHz: z.number(),
    sampleRateToleranceHz: z.number()
  } satisfies ToZodSchema<BaseAutoregressiveFilterParameters>)
  .strict();

/**
 * Represents the parameters for an autoregressive filter.
 * See {@link AutoRegressiveFilterParameters}
 *
 * This schema is used to validate autoregressive filter parameters, ensuring that they conform to the expected structure and types.
 */
export const autoRegressiveFilterParametersSchema = z
  .object({
    ...baseAutoregressiveFilterParametersSchema.shape,
    coefficients: z.array(z.number()),
    noiseWindow: z
      .object({
        channel: z.union([channelSchema, channelVersionReferenceSchema]),
        startTime: z.number(),
        endTime: z.number(),
        creationTime: z.number()
      } satisfies ToZodSchema<ChannelSegmentDescriptor>)
      .strict()
  } satisfies ToZodSchema<AutoRegressiveFilterParameters>)
  .strict();

/**
 * Represents the parameters for a phase match filter. See {@link PhaseMatchFilterParameters}
 *
 * This schema is used to validate phase match filter parameters, ensuring that they conform to the expected structure and types.
 */
export const phaseMatchFilterParametersSchema = z
  .object({
    receiverLocation: locationSchema,
    sourceLocation: eventLocationSchema
  } satisfies ToZodSchema<PhaseMatchFilterParameters>)
  .strict();

/**
 * Represents the {@link Parameters} for valid types of filters.
 *
 * This schema is used to validate filter parameters, ensuring that they conform to the expected structure and types.
 */
export const parametersSchema = z.union([
  linearFilterParametersSchema,
  iirFilterParametersSchema,
  firFilterParametersSchema,
  autoRegressiveFilterParametersSchema,
  phaseMatchFilterParametersSchema,
  cascadeFilterParametersSchema
]) satisfies z.ZodType<Parameters>;

/**
 * Represents the description of a filter, including its type, comments, causality, response, and parameters.
 * See {@link FilterDescription}
 *
 * This schema is used to validate filter descriptions, ensuring that they conform to the expected structure and types.
 */
export const filterDescriptionSchema = z
  .object({
    filterType: z.nativeEnum(FilterType),
    comments: z.string().optional(),
    causal: z.boolean(),
    correctGroupDelay: z.boolean(),
    response: frequencyAmplitudePhaseSchema.optional(),
    parameters: parametersSchema.optional()
  } satisfies ToZodSchema<FilterDescription>)
  .strict();

/**
 * Represents the description of a linear filter, including its specific properties and parameters.
 * See {@link LinearFilterDescription}
 *
 * This schema is used to validate linear filter descriptions, ensuring that they conform to the expected structure and types.
 */
export const linearFilterDescriptionSchema = z
  .object({
    ...filterDescriptionSchema.shape,
    filterType: z.literal(FilterType.LINEAR),
    lowFrequencyHz: z.number().optional(),
    highFrequencyHz: z.number().optional(),
    order: z.number(),
    zeroPhase: z.boolean(),
    passBandType: z.nativeEnum(BandType),
    linearFilterType: z.nativeEnum(LinearFilterType),
    parameters: z
      .union([linearFilterParametersSchema, iirFilterParametersSchema, firFilterParametersSchema])
      .optional()
  } satisfies ToZodSchema<LinearFilterDescription>)
  .strict()
  .refine(
    data =>
      data.highFrequencyHz != null && data.lowFrequencyHz != null
        ? data.highFrequencyHz > data.lowFrequencyHz
        : true,

    () => ({
      message: `highFrequencyHz is not greater than lowFrequencyHz`,
      path: ['highFrequencyHz']
    })
  )
  .refine(
    data => data.highFrequencyHz == null || data.highFrequencyHz > 0,
    data => ({
      message: `highFrequencyHz is not a positive number. Received ${data.highFrequencyHz}`,
      path: ['highFrequencyHz']
    })
  )
  .refine(
    data => data.lowFrequencyHz == null || data.lowFrequencyHz > 0,
    data => ({
      message: `lowFrequencyHz is not a positive number. Received ${data.lowFrequencyHz}`
    })
  )
  .refine(
    data => Number.isInteger(data.order) && data.order > 0 && data.order <= MAX_ORDER,
    data => ({ message: `order must be an integer between 1 and 10, but received ${data.order}` })
  );

/**
 * Represents the description of an autoregressive filter, including its specific properties and parameters.
 * See {@link AutoRegressiveFilterDescription}
 *
 * This schema is used to validate autoregressive filter descriptions, ensuring that they conform to the expected structure and types.
 */
export const autoRegressiveFilterDescriptionSchema = z
  .object({
    ...filterDescriptionSchema.shape,
    filterType: z.literal(FilterType.AUTOREGRESSIVE),
    order: z.number(),
    noiseWindowDuration: z.number(),
    noiseWindowOffset: z.number(),
    signalWindowDuration: z.number().optional(),
    signalWindowOffset: z.number(),
    autoregressiveType: z.nativeEnum(AutoregressiveType),
    autoregressiveFilterType: z.nativeEnum(AutoregressiveFilterType),
    parameters: z
      .union([baseAutoregressiveFilterParametersSchema, autoRegressiveFilterParametersSchema])
      .optional()
  } satisfies ToZodSchema<AutoRegressiveFilterDescription>)
  .strict()
  .refine(
    data => Number.isInteger(data.order) && data.order > 0 && data.order <= MAX_ORDER,
    data => ({ message: `order must be an integer between 1 and 10, but received ${data.order}` })
  )
  .refine(
    data => !Number.isNaN(data.noiseWindowDuration) && data.noiseWindowDuration > 0,
    data => ({
      message: `Noise window duration is not a positive number. Received ${data.noiseWindowDuration}`
    })
  )
  .refine(
    data => !Number.isNaN(data.noiseWindowOffset) && data.noiseWindowOffset >= 0,
    data => ({
      message: `Noise window offset must be a non-negative number. Received ${data.noiseWindowOffset}`
    })
  )
  .refine(
    data =>
      data.signalWindowDuration != null
        ? !Number.isNaN(data.signalWindowDuration) && data.signalWindowDuration > 0
        : true,
    data => ({
      message: `Signal window duration is not a positive number. Received ${data.signalWindowDuration}`
    })
  )
  .refine(
    data =>
      data.signalWindowOffset != null
        ? !Number.isNaN(data.signalWindowOffset) && data.signalWindowOffset >= 0
        : true,
    data => ({
      message: `Signal window offset must be a non-negative number. Received ${data.signalWindowOffset}`
    })
  );

/**
 * Represents the definition of a taper, including its duration.
 * See {@link TaperDefinition}
 *
 * This schema is used to validate taper definitions, ensuring that they conform to the expected structure and types.
 */
export const taperDefinitionSchema = z
  .object({
    taperDuration: z.number()
  } satisfies ToZodSchema<TaperDefinition>)
  .strict();

export const taperFunctionSchema = z.nativeEnum(TaperFunction);

/**
 * Represents the description of a phase match filter, including its specific properties and parameters.
 * See {@link PhaseMatchFilterDescription}
 *
 * This schema is used to validate phase match filter descriptions, ensuring that they conform to the expected structure and types.
 */
export const phaseMatchFilterDescriptionSchema = z
  .object({
    ...filterDescriptionSchema.shape,
    dispersionModelName: z.string(),
    frequencyTaperFunction: taperFunctionSchema,
    highFrequencyHz: z.number(),
    highFrequencyTaperWidthHz: z.number(),
    lowFrequencyHz: z.number(),
    lowFrequencyTaperWidthHz: z.number(),
    numFrequencies: z.number(),
    filterType: z.literal(FilterType.PHASE_MATCH),
    phase: z.string(),
    referencePeriod: z.number(),
    parameters: phaseMatchFilterParametersSchema.optional()
  } satisfies ToZodSchema<PhaseMatchFilterDescription>)
  .strict()
  .refine(
    data => data.phase === 'LR' || data.phase === 'LQ',
    data => ({ message: `Phase must be LR or LQ for phase match filters. Received ${data.phase}` })
  )
  .refine(
    data => data.referencePeriod > 0,
    data => ({
      message: `Reference period must be a positive number. Received ${data.referencePeriod}`
    })
  )
  .refine(
    data => data.lowFrequencyHz > 0,
    data => ({
      message: `Low frequency must be a positive number. Received ${data.lowFrequencyHz}`
    })
  )
  .refine(
    data => data.highFrequencyHz > 0,
    data => ({
      message: `High frequency must be a positive number. Received ${data.highFrequencyHz}`
    })
  )
  .refine(
    data => data.numFrequencies > 0 && Number.isInteger(data.numFrequencies),
    data => ({
      message: `The number of frequencies must be a positive integer. Received ${data.numFrequencies}`
    })
  )
  .refine(
    data => data.lowFrequencyTaperWidthHz >= 0,
    data => ({
      message: `Low frequency taper width must be a non-negative number. Received ${data.lowFrequencyTaperWidthHz}`
    })
  )
  .refine(
    data => data.highFrequencyTaperWidthHz >= 0,
    data => ({
      message: `High frequency taper width must be a non-negative number. Received ${data.highFrequencyTaperWidthHz}`
    })
  );

/**
 * Represents the description of a cascade filter, including its specific properties and parameters.
 * See {@link CascadeFilterDescription}
 *
 * This schema is used to validate cascade filter descriptions, ensuring that they conform to the expected structure and types.
 */
export const cascadeFilterDescriptionSchema = z
  .object({
    ...filterDescriptionSchema.shape,
    filterType: z.literal(FilterType.CASCADE),
    filterDescriptions: z.array(
      z.union([
        linearFilterDescriptionSchema,
        phaseMatchFilterDescriptionSchema,
        autoRegressiveFilterDescriptionSchema
      ])
    ),
    parameters: cascadeFilterParametersSchema.optional()
  } satisfies ToZodSchema<CascadeFilterDescription>)
  .strict();

/**
 * Represents the definition of a filter, including its name, comments, and description.
 * See {@link FilterDefinition}
 *
 * This schema is used to validate filter definitions, ensuring that they conform to the expected structure and types.
 */
export const filterDefinitionSchema = z
  .object({
    name: z.string(),
    comments: z.string().optional(),
    filterDescription: z.union([
      autoRegressiveFilterDescriptionSchema,
      cascadeFilterDescriptionSchema,
      linearFilterDescriptionSchema,
      phaseMatchFilterDescriptionSchema
    ])
  } satisfies ToZodSchema<FilterDefinition>)
  .strict();

/**
 * Represents the definition of a linear filter, including its specific description.
 * See {@link LinearFilterDefinition}
 *
 * This schema is used to validate linear filter definitions, ensuring that they conform to the expected structure and types.
 */
export const linearFilterDefinitionSchema = z
  .object({
    ...filterDefinitionSchema.shape,
    filterDescription: linearFilterDescriptionSchema
  } satisfies ToZodSchema<LinearFilterDefinition>)
  .strict();

/**
 * Represents the definition of an autoregressive filter, including its specific description.
 * See {@link AutoRegressiveFilterDefinition}
 *
 * This schema is used to validate autoregressive filter definitions, ensuring that they conform to the expected structure and types.
 */
export const autoRegressiveFilterDefinitionSchema = z
  .object({
    ...filterDefinitionSchema.shape,
    filterDescription: autoRegressiveFilterDescriptionSchema
  } satisfies ToZodSchema<AutoRegressiveFilterDefinition>)
  .strict();

/**
 * Represents the definition of a phase match filter, including its specific description.
 * See {@link PhaseMatchFilterDefinition}
 *
 * This schema is used to validate phase match filter definitions, ensuring that they conform to the expected structure and types.
 */
export const phaseMatchFilterDefinitionSchema = z
  .object({
    ...filterDefinitionSchema.shape,
    filterDescription: phaseMatchFilterDescriptionSchema
  } satisfies ToZodSchema<PhaseMatchFilterDefinition>)
  .strict();

/**
 * Represents the definition of a cascade filter, including its specific description.
 * See {@link CascadeFilterDefinition}
 *
 * This schema is used to validate cascade filter definitions, ensuring that they conform to the expected structure and types.
 */
export const cascadeFilterDefinitionSchema = z
  .object({
    ...filterDefinitionSchema.shape,
    filterDescription: cascadeFilterDescriptionSchema
  } satisfies ToZodSchema<CascadeFilterDefinition>)
  .strict();

/**
 * Represents the base properties of a filter, including whether it is within the hotkey cycle and if it should be formatted as an error state.
 * See {@link BaseFilter}
 *
 * This schema is used to validate base filter properties, ensuring that they conform to the expected structure and types.
 */
export const baseFilterSchema = z.object({
  withinHotKeyCycle: z.boolean(),
  _uiIsError: z.boolean().optional(),
  _uiId: z.string().optional()
} satisfies ToZodSchema<BaseFilter>);

/**
 * Represents a filter, including its base properties and specific filter details.
 * See {@link Filter}
 *
 * This schema is used to validate filters, ensuring that they conform to the expected structure and types.
 */
export const filterSchema = z.union([
  z
    .object({
      ...baseFilterSchema.shape,
      unfiltered: z.boolean(),
      namedFilter: z.undefined().optional(),
      filterDefinition: z.undefined().optional()
    })
    .strict(),
  z
    .object({
      ...baseFilterSchema.shape,
      unfiltered: z.undefined(),
      namedFilter: z.nativeEnum(FilterDefinitionUsage),
      filterDefinition: z.undefined()
    })
    .strict(),
  z
    .object({
      ...baseFilterSchema.shape,
      unfiltered: z.undefined(),
      namedFilter: z.undefined(),
      filterDefinition: z.union([
        linearFilterDefinitionSchema,
        cascadeFilterDefinitionSchema,
        phaseMatchFilterDefinitionSchema,
        autoRegressiveFilterDefinitionSchema
      ])
    })
    .strict()
]) satisfies z.ZodType<Filter>;

/**
 * Represents a list of filters, including the name of the list, the default filter index, and the filters.
 * See {@link FilterList}
 *
 * This schema is used to validate filter lists, ensuring that they conform to the expected structure and types.
 */
export const filterListSchema = z
  .object({
    /**
     * The name of the filter list
     */
    name: z.string().min(1),

    /**
     * The index within the filter list that should be shown by default
     */
    defaultFilterIndex: z.number(),

    filters: z.array(filterSchema)
  } satisfies ToZodSchema<FilterList>)
  .strict();
