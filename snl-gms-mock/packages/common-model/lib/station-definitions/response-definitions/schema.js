import { z } from 'zod';
import { doubleValueSchema } from '../../common/schema';
/**
 * Zod schema for validating {@link AmplitudePhaseResponse} objects.
 *
 * This schema ensures that the AmplitudePhaseResponse objects conform to the expected structure and types.
 */
export const amplitudePhaseResponseSchema = z
    .object({
    amplitude: doubleValueSchema,
    phase: doubleValueSchema
})
    .strict();
/**
 * Represents the {@link Calibration} settings for a sensor or instrument.
 *
 * This schema is used to validate the calibration settings, ensuring that they conform to the expected structure and types.
 * ```
 */
export const calibrationSchema = z
    .object({
    calibrationPeriodSec: z.number(),
    calibrationTimeShift: z.number(),
    calibrationFactor: doubleValueSchema
})
    .strict();
/**
 * Zod schema for validating {@link FrequencyAmplitudePhase} objects.
 *
 * This schema ensures that the FrequencyAmplitudePhase objects conform to the expected structure and types.
 */
export const frequencyAmplitudePhaseSchema = z
    .object({
    amplitudePhaseResponses: z.array(amplitudePhaseResponseSchema),
    frequencies: z.array(z.number()),
    id: z.string(),
    nominalCalibration: calibrationSchema.optional(),
    nominalSampleRateHz: z.number().optional()
})
    .strict();
/**
 * Represents the response of a channel, including calibration, effective time range, and frequency-amplitude-phase response.
 *
 * This schema is used to validate the response settings, ensuring that they conform to the expected structure and types.
 */
export const responseSchema = z
    .object({
    calibration: calibrationSchema.optional(),
    effectiveAt: z.number(),
    effectiveUntil: z.number().optional(),
    fapResponse: frequencyAmplitudePhaseSchema.optional(),
    id: z.string()
})
    .strict();
//# sourceMappingURL=schema.js.map