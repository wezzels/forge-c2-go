import type { ZodError } from 'zod';
import { z } from 'zod';
import { GMSError } from '../errors/gms-error';
import type { IsNullable, IsOptional } from './type-util';
/**
 * Utility type to allow Zod effects on a Zod type.
 */
type ZodWithEffects<T extends z.ZodTypeAny> = T | z.ZodEffects<T, unknown, unknown>;
/**
 * Utility type to assert that a TypeScript type satisfies a Zod schema.
 *
 * This utility type ensures that the Zod schema matches the TypeScript type, including handling nullable and optional properties.
 * Essentially, it works by creating a
 *
 * @template T - The TypeScript type to convert to a Zod schema.
 *
 * @example
 * ```typescript
 * interface Example {
 *   a: string;
 *   b?: number;
 *   c: string | null;
 *   d?: string | null;
 * }
 *
 * const exampleSchema = z.object({
 *   a: z.string(),
 *   b: z.number().optional(),
 *   c: z.string().nullable(),
 *   d: z.string().optional().nullable() // optional must come before nullable
 * } satisfies ToZodSchema<Example>);
 * ```
 *
 * @remarks
 * This utility type only validates the input to a Zod object. It does not work on the returned Zod schema,
 * nor does it work for `z.union` or `z.ZodIntersection` types.
 */
export type ToZodSchema<T extends Record<string, any>> = {
    [K in keyof T]-?: IsNullable<T[K]> extends true ? ZodWithEffects<z.ZodNullable<z.ZodType<T[K]>>> : IsOptional<T[K]> extends true ? ZodWithEffects<z.ZodOptional<z.ZodType<T[K]>>> : ZodWithEffects<z.ZodType<T[K]>>;
};
export declare function isValidZodLiteralUnion<T extends z.ZodLiteral<unknown>>(literals: T[]): literals is [T, T, ...T[]];
export declare function constructZodLiteralUnionType<T extends z.ZodLiteral<unknown>>(literals: T[]): z.ZodUnion<[T, T, ...T[]]>;
export declare class ZodValidationError extends GMSError {
    readonly id: string;
    constructor(error: ZodError, id: string, parsedValue?: any);
}
export {};
//# sourceMappingURL=zod-util.d.ts.map