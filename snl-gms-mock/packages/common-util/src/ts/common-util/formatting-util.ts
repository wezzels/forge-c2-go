import type { Nullable } from '@gms/common-model/lib/type-util/type-util';

import { ValueType } from '../types/value-type';

const decimalFormatCache: Record<number, Intl.NumberFormat> = [];

/**
 * Takes a number and sets it to a fixed precision,
 * also adds commas to delineate thousands places e.g. 1000 => 1,000
 *
 * @param value a value to be fixed
 * @param precision optional precision, default is 2
 *
 * @returns a string
 */
export function setDecimalPrecision(value: number | null | undefined, precision = 2): string {
  if (value === undefined || value === null) return '';

  // Check if we have the needed NumberFormat object
  // If not generate it
  if (decimalFormatCache[precision] === undefined) {
    decimalFormatCache[precision] = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision
    });
  }

  // Use a Intl.NumberFormat instead of Number.ToLocaleString
  // ToLocaleString builds a new format every time and is about 40-50x slower then a static look up
  return decimalFormatCache[precision].format(value);
}

/**
 * Rounds a number to a certain decimal precision
 *
 * @param value
 * @param precision
 */
export const setDecimalPrecisionAsNumber = (
  value: Nullable<number> | undefined,
  precision = 2
): number | undefined => {
  if (value === undefined || value === null || value.toFixed === undefined) return undefined;
  return parseFloat(value.toFixed(precision));
};

/**
 * Capitalizes the first character of each word
 *
 * @param input string input
 */
export function capitalizeFirstLetters(input: string): string {
  const words = input.split(' ');
  let newString = '';
  words.forEach(word => {
    if (word.length > 0) {
      const newWord = word[0].toUpperCase() + word.slice(1);
      newString += `${newWord} `;
    }
  });
  return newString.trim();
}

/**
 * Nicely capitalizes and removes _ from enums
 *
 * @param enumAsString string to prettify
 * @param stripFirstPart strips first part of enum IE (ENV_CLOCK_SLOW would be Clock Slow)
 *
 * @returns prettified string of enum
 */
export const prettifyAllCapsEnumType = (
  enumAsString: string | undefined,
  stripFirstPart = false
): string | undefined => {
  if (enumAsString) {
    const asString: string = enumAsString;
    const regex = /_/g;
    const withoutUnderscores = asString.replace(regex, ' ');
    let stringArray: string[];
    if (stripFirstPart) {
      [, ...stringArray] = withoutUnderscores.toLowerCase().split(' ');
    } else {
      stringArray = withoutUnderscores.toLowerCase().split(' ');
    }
    return stringArray.map(s => String(s.charAt(0).toUpperCase()) + s.substring(1)).join(' ');
  }
  return undefined;
};

/**
 * Strips out everything up to the first occurrence of the `pattern` and removes first
 * occurrence of the pattern.
 *
 * @param str the string to strip
 * @param pattern the pattern to search for
 * @returns the stripped string
 */
export const stripOutFirstOccurrence = (str: string, pattern = '.'): string => {
  if (str && pattern) {
    if (str.includes(pattern)) {
      const [, ...channelNames] = str.split('.');
      return channelNames.join(pattern);
    }
  }
  return str;
};

/**
 * Determines Precision by type
 *
 * @param value the value
 * @param valueType value type
 * @param returnAsString determines return type
 * @returns a precision value as a string or number based on returnAsString
 */
export const determinePrecisionByType = (
  value: number | undefined,
  valueType: ValueType | undefined,
  returnAsString = false
): string | number | undefined => {
  if (!value) {
    return undefined;
  }
  switch (valueType) {
    case ValueType.PERCENTAGE:
      return returnAsString ? setDecimalPrecision(value, 2) : setDecimalPrecisionAsNumber(value, 2);
    case ValueType.INTEGER:
      return returnAsString ? setDecimalPrecision(value, 0) : setDecimalPrecisionAsNumber(value, 0);
    case ValueType.FLOAT:
      return returnAsString ? setDecimalPrecision(value, 2) : setDecimalPrecisionAsNumber(value, 2);
    default:
      return returnAsString ? setDecimalPrecision(value) : setDecimalPrecisionAsNumber(value);
  }
};
