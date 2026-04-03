import type { Nullable } from '@gms/common-model/lib/type-util/type-util';
import { ValueType } from '../types/value-type';
/**
 * Takes a number and sets it to a fixed precision,
 * also adds commas to delineate thousands places e.g. 1000 => 1,000
 *
 * @param value a value to be fixed
 * @param precision optional precision, default is 2
 *
 * @returns a string
 */
export declare function setDecimalPrecision(value: number | null | undefined, precision?: number): string;
/**
 * Rounds a number to a certain decimal precision
 *
 * @param value
 * @param precision
 */
export declare const setDecimalPrecisionAsNumber: (value: Nullable<number> | undefined, precision?: number) => number | undefined;
/**
 * Capitalizes the first character of each word
 *
 * @param input string input
 */
export declare function capitalizeFirstLetters(input: string): string;
/**
 * Nicely capitalizes and removes _ from enums
 *
 * @param enumAsString string to prettify
 * @param stripFirstPart strips first part of enum IE (ENV_CLOCK_SLOW would be Clock Slow)
 *
 * @returns prettified string of enum
 */
export declare const prettifyAllCapsEnumType: (enumAsString: string | undefined, stripFirstPart?: boolean) => string | undefined;
/**
 * Strips out everything up to the first occurrence of the `pattern` and removes first
 * occurrence of the pattern.
 *
 * @param str the string to strip
 * @param pattern the pattern to search for
 * @returns the stripped string
 */
export declare const stripOutFirstOccurrence: (str: string, pattern?: string) => string;
/**
 * Determines Precision by type
 *
 * @param value the value
 * @param valueType value type
 * @param returnAsString determines return type
 * @returns a precision value as a string or number based on returnAsString
 */
export declare const determinePrecisionByType: (value: number | undefined, valueType: ValueType | undefined, returnAsString?: boolean) => string | number | undefined;
//# sourceMappingURL=formatting-util.d.ts.map