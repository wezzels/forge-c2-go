import type { SafeParseError, SafeParseReturnType } from 'zod';

/**
 * This file is for test utilities that help with writing unit tests for Zod schema
 */
export function expectSafeParseFailure<Input, Output>(
  r: SafeParseReturnType<Input, Output>
): asserts r is SafeParseError<Input> {
  expect(r.success).toBeFalsy();
}
