export declare const uniqueNumberFromString: (input: string) => number;
/**
 * Returns a new string that has been converted to sentence case
 *
 * @param s the string on which to operate
 */
export declare const toSentenceCase: (s: string) => string;
/**
 * Convert string like enums to human readable (example HI_ALL => Hi All)
 *
 * @param input
 * @returns readable string
 */
export declare const humanReadable: (input: string) => string;
/**
 * Creates an array containing each substring, split along any matched whitespace.
 *
 * @param input the string on which to operate
 * @param pattern the string or RegExp to split the input by. Defaults to split on whitespace.
 * @returns an array of strings
 */
export declare const splitStringByPattern: (input: string, pattern?: string | RegExp) => string[];
/**
 * Checks if at least one tag from a list is matched by a word
 *
 * @param tags A list of tags to search
 * @param searchWord a word to search for in the tags
 */
export declare const oneTagMatches: (tags: string[], searchWord: string) => boolean;
/**
 * Checks if all of the words in the search string match one or more tags
 *
 * @param tags the list of tags
 * @param term the search string (including spaces)
 */
export declare const doTagsMatch: (tags: string[] | undefined, term: string) => boolean;
/**
 * Compare two lists of string (this could be slow for large list and may need optimization)
 *
 * @param firstStrings first set of strings to compare
 * @param secondStrings second set of strings to compare
 * @returns whether they are the same, irrespective of order
 */
export declare const areListsSame: (firstStrings: string[], secondStrings: string[]) => boolean;
/**
 * This function determines if the string passed in contains a value that should be treated as a
 * right-aligned numeric cell on the station properties table
 * EX: "2534"                 true
 * EX: "2007-12-23"           false
 * EX: "2007-12-23 09:23:23"  false
 * EX: "-123.93"              true
 * EX: "obviously false"      false
 *
 * @param testSubject: the string or cell data to be evaluated
 */
export declare function isNumeric(testSubject: string): boolean;
/**
 * This function determines if the string passed in contains a value that should be treated as a
 * date string.
 *
 * @param str a string to test
 * @returns whether the string can be parsed into a date
 */
export declare function isDate(str: string | undefined): boolean;
/**
 * If the input string @param value is undefined, empty, or null, returns @param defaultValue
 * If no defaultValue is passed, defaults to 'Unknown'
 */
export declare function defaultTo(value: string | undefined | null, defaultValue?: string): string;
/**
 * Appends and shows uncertainty with ± if exists
 *
 * @param value value in desired string format
 * @param uncertainty value of uncertainty
 * @returns string
 */
export declare const appendUncertainty: (value: string, uncertainty: number | undefined) => string;
/**
 * Appends and shows uncertainty with ± if exists
 *
 * @param value value in desired string format
 * @param uncertainty value of uncertainty
 * @returns string
 */
export declare const appendUncertaintyForTime: (value: string, uncertainty: number | undefined) => string;
/**
 * Sorts and ensures uniqueness for a collection of strings
 *
 * @return returns the new sorted collection with unique entires
 */
export declare const uniqSortStrings: (value: string[]) => string[];
/**
 * Formats a list of strings to a human readable comma separated list
 * Ex. ['apple', 'orange', 'grape'] becomes 'apple, orange, and grape'
 * @param strArray
 * @returns
 */
export declare const stringArrayToFormattedString: (strArray: string[]) => string;
/**
 * Formats Frequency units in a string to the correct case
 * Ex. hz -> Hz and khz -> kHz
 * @param value string
 * @returns string
 */
export declare const correctFrequencyUnitCases: (value: string) => string;
/**
 * Formats 'Soh' (State of Health) to the correct casing
 * Ex. soh -> SOH
 * @param value string
 * @returns string
 */
export declare const correctSohCase: (value: string) => string;
/**
 * A wrapper for {@link Number.paseInt} that returns undefined instead of NaN to prevent NaN from getting stored in input fields
 * @param maybeNumber  A string to convert into a number.
 * @param radix A value between 2 and 36 that specifies the base of the number in string. If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
 * @returns
 */
export declare const nonNaNParseInt: (maybeNumber: string, radix?: number) => number | undefined;
/**
 * A wrapper for {@link Number} that returns undefined instead of NaN to prevent NaN from getting stored in input fields
 * @param maybeNumber  A string to convert into a number.
 * @returns
 */
export declare const nonNaNParseNumber: (maybeNumber: string) => number | undefined;
/**
 * Truncates a string if it has no spaces and its length exceeds maxLen,
 * then adds an ellipsis; otherwise returns the original string
 * @param str the string to limit
 * @param maxLen the maximum character length allowed
 * @returns a truncated string or the original string
 */
export declare const truncateStringToLength: (str: string, maxLen: number) => string;
//# sourceMappingURL=string-util.d.ts.map