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
  // ToZodSchema is a mapped type that iterates over each key in the provided type T.
  //   The -? modifier removes the optionality from each key, ensuring that all keys are treated as required during the mapping process.
  //   IsNullable<T[K]> checks if the type of the property T[K] includes null.
  [K in keyof T]-?: IsNullable<T[K]> extends true
    ? // If IsNullable<T[K]> is true, the property is wrapped in z.ZodNullable.
      //   z.ZodType<T[K]> asserts that the property is a Zod type.
      //   ZodWithEffects allows the property to be either a Zod type or a Zod effect type (z.ZodEffects).
      ZodWithEffects<z.ZodNullable<z.ZodType<T[K]>>>
    : // if IsNullable<T[K]> is false, then check if it is optional
      //   IsOptional<T[K]> checks if the type of the property T[K] includes undefined.
      IsOptional<T[K]> extends true
      ? // If IsOptional<T[K]> is true, the property is wrapped in z.ZodOptional.
        //   z.ZodType<T[K]> asserts that the property is a Zod type.
        //   ZodWithEffects allows the property to be either a Zod type or a Zod effect type (z.ZodEffects).
        ZodWithEffects<z.ZodOptional<z.ZodType<T[K]>>>
      : // If IsOptional<T[K]> is false
        //   z.ZodType<T[K]> asserts that the property is a Zod type.
        //   ZodWithEffects allows the property to be either a Zod type or a Zod effect type (z.ZodEffects).
        ZodWithEffects<z.ZodType<T[K]>>;
};

export function isValidZodLiteralUnion<T extends z.ZodLiteral<unknown>>(
  literals: T[]
): literals is [T, T, ...T[]] {
  return literals.length >= 2;
}

export function constructZodLiteralUnionType<T extends z.ZodLiteral<unknown>>(literals: T[]) {
  if (!isValidZodLiteralUnion(literals)) {
    throw new Error(
      'Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2'
    );
  }
  return z.union(literals);
}

export class ZodValidationError extends GMSError {
  public readonly id: string;

  public constructor(error: ZodError, id: string, parsedValue?: any) {
    const message = `Invalid data structure from ${id}`;
    super(message);
    Object.setPrototypeOf(this, ZodValidationError.prototype);
    this.id = id;
    const errorReport: { issues: typeof error.issues; response?: any } = { issues: error.issues };
    if (parsedValue !== undefined) {
      errorReport.response = parsedValue;
    }
    console.error(`[Zod Validation Error]: ${message}`, {
      id,
      message,
      issues: error.issues,
      parsedValue
    });
  }
}
