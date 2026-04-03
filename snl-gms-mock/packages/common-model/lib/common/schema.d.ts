import { z } from 'zod';
import { Units } from './types';
/**
 * Represents the geographical location of a point, including latitude, longitude, elevation, and depth.
 *
 * This schema is used to validate location data, ensuring that it conforms to the expected structure and types.
 */
export declare const locationSchema: z.ZodObject<{
    latitudeDegrees: z.ZodNumber;
    longitudeDegrees: z.ZodNumber;
    elevationKm: z.ZodNumber;
    depthKm: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    latitudeDegrees: number;
    longitudeDegrees: number;
    elevationKm: number;
    depthKm: number;
}, {
    latitudeDegrees: number;
    longitudeDegrees: number;
    elevationKm: number;
    depthKm: number;
}>;
/**
 * Represents the geographical location of an event, including latitude, longitude, depth and time.
 *
 * This schema is used to validate event location data, ensuring that it conforms to the expected structure and types.
 */
export declare const eventLocationSchema: z.ZodObject<{
    depthKm: z.ZodNumber;
    latitudeDegrees: z.ZodNumber;
    longitudeDegrees: z.ZodNumber;
    time: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    latitudeDegrees: number;
    longitudeDegrees: number;
    depthKm: number;
    time: number;
}, {
    latitudeDegrees: number;
    longitudeDegrees: number;
    depthKm: number;
    time: number;
}>;
/**
 * Represents a value with an optional standard deviation and units.
 *
 * This schema is used to validate double values, ensuring that they conform to the expected structure and types.
 */
export declare const doubleValueSchema: z.ZodObject<{
    value: z.ZodNumber;
    standardDeviation: z.ZodOptional<z.ZodNumber>;
    units: z.ZodNativeEnum<typeof Units>;
}, "strict", z.ZodTypeAny, {
    units: Units;
    value: number;
    standardDeviation?: number | undefined;
}, {
    units: Units;
    value: number;
    standardDeviation?: number | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map