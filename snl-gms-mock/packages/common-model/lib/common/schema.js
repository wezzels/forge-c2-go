import { z } from 'zod';
import { Units } from './types';
/**
 * Represents the geographical location of a point, including latitude, longitude, elevation, and depth.
 *
 * This schema is used to validate location data, ensuring that it conforms to the expected structure and types.
 */
export const locationSchema = z
    .object({
    latitudeDegrees: z.number(),
    longitudeDegrees: z.number(),
    elevationKm: z.number(),
    depthKm: z.number()
})
    .strict();
/**
 * Represents the geographical location of an event, including latitude, longitude, depth and time.
 *
 * This schema is used to validate event location data, ensuring that it conforms to the expected structure and types.
 */
export const eventLocationSchema = z
    .object({
    depthKm: z.number(),
    latitudeDegrees: z.number(),
    longitudeDegrees: z.number(),
    time: z.number()
})
    .strict();
/**
 * Represents a value with an optional standard deviation and units.
 *
 * This schema is used to validate double values, ensuring that they conform to the expected structure and types.
 */
export const doubleValueSchema = z
    .object({
    value: z.number(),
    standardDeviation: z.number().optional(),
    units: z.nativeEnum(Units)
})
    .strict();
//# sourceMappingURL=schema.js.map