import { deepEqual } from 'fast-equals';
import join from 'lodash/join';
import sortBy from 'lodash/sortBy';
import sortedUniq from 'lodash/sortedUniq';
import { setDecimalPrecision } from './formatting-util';
export const uniqueNumberFromString = (input) => {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
        /* eslint-disable no-bitwise */
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // to 32bit integer
        /* eslint-enable no-bitwise */
    }
    return Math.abs(hash);
};
/**
 * Returns a new string that has been converted to sentence case
 *
 * @param s the string on which to operate
 */
export const toSentenceCase = (s) => {
    if (s.length <= 0)
        return '';
    if (s.length === 1)
        return s.charAt(0).toUpperCase();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
/**
 * Convert string like enums to human readable (example HI_ALL => Hi All)
 *
 * @param input
 * @returns readable string
 */
export const humanReadable = (input) => {
    const breakItUp = input.split('_');
    return join(breakItUp.map(entry => {
        const lowerCase = entry.toLowerCase();
        if (lowerCase.length === 1) {
            return lowerCase;
        }
        if (lowerCase.length > 1) {
            return `${lowerCase[0].toUpperCase()}${lowerCase.substring(1, lowerCase.length)}`;
        }
        return ``;
    }), ' ');
};
/**
 * Creates an array containing each substring, split along any matched whitespace.
 *
 * @param input the string on which to operate
 * @param pattern the string or RegExp to split the input by. Defaults to split on whitespace.
 * @returns an array of strings
 */
export const splitStringByPattern = (input, pattern = /(\s+)/) => input
    .split(pattern)
    .map(w => w.trim())
    .filter(w => w.length > 0);
/**
 * Checks if at least one tag from a list is matched by a word
 *
 * @param tags A list of tags to search
 * @param searchWord a word to search for in the tags
 */
export const oneTagMatches = (tags, searchWord) => tags.reduce((tagMatches, tag) => tagMatches || tag?.toLowerCase().includes(searchWord), false);
/**
 * Checks if all of the words in the search string match one or more tags
 *
 * @param tags the list of tags
 * @param term the search string (including spaces)
 */
export const doTagsMatch = (tags, term) => {
    if (tags == null) {
        return false;
    }
    const words = splitStringByPattern(term);
    return words.reduce((matches, word) => matches && oneTagMatches(tags, word), true);
};
/**
 * Compare two lists of string (this could be slow for large list and may need optimization)
 *
 * @param firstStrings first set of strings to compare
 * @param secondStrings second set of strings to compare
 * @returns whether they are the same, irrespective of order
 */
export const areListsSame = (firstStrings, secondStrings) => {
    const sortedNewStrings = sortBy(firstStrings);
    const sortedOldStrings = sortBy(secondStrings);
    return deepEqual(sortedNewStrings, sortedOldStrings);
};
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
export function isNumeric(testSubject) {
    if (!testSubject)
        return false;
    return !Number.isNaN(Number(testSubject)); // parseFloat returns NaN if it cannot parse the string into a number
}
/**
 * This function determines if the string passed in contains a value that should be treated as a
 * date string.
 *
 * @param str a string to test
 * @returns whether the string can be parsed into a date
 */
export function isDate(str) {
    if (!str) {
        return false;
    }
    return !Number.isNaN(Date.parse(str));
}
/**
 * If the input string @param value is undefined, empty, or null, returns @param defaultValue
 * If no defaultValue is passed, defaults to 'Unknown'
 */
export function defaultTo(value, defaultValue = 'Unknown') {
    if (value === undefined || value === null || value.length === 0) {
        return defaultValue;
    }
    return value;
}
/**
 * Appends and shows uncertainty with ± if exists
 *
 * @param value value in desired string format
 * @param uncertainty value of uncertainty
 * @returns string
 */
export const appendUncertainty = (value, uncertainty) => {
    if (uncertainty) {
        return `${value} ± ${setDecimalPrecision(uncertainty, 3)}`;
    }
    return value;
};
/**
 * Appends and shows uncertainty with ± if exists
 *
 * @param value value in desired string format
 * @param uncertainty value of uncertainty
 * @returns string
 */
export const appendUncertaintyForTime = (value, uncertainty) => {
    if (uncertainty) {
        return `${value} ± ${setDecimalPrecision(uncertainty, 3)}s`;
    }
    return value;
};
/**
 * Sorts and ensures uniqueness for a collection of strings
 *
 * @return returns the new sorted collection with unique entires
 */
export const uniqSortStrings = (value) => sortedUniq(sortBy(value));
/**
 * Formats a list of strings to a human readable comma separated list
 * Ex. ['apple', 'orange', 'grape'] becomes 'apple, orange, and grape'
 * @param strArray
 * @returns
 */
export const stringArrayToFormattedString = (strArray) => {
    if (strArray.length > 2) {
        return `${strArray.slice(0, -1).join(', ')}, and ${strArray[strArray.length - 1]}`;
    }
    if (strArray.length === 2) {
        return strArray.join(' and ');
    }
    return strArray.join('');
};
/**
 * Formats Frequency units in a string to the correct case
 * Ex. hz -> Hz and khz -> kHz
 * @param value string
 * @returns string
 */
export const correctFrequencyUnitCases = (value) => {
    // find 'hz' with no preceding 'k', case insensitive
    let hzRegex = /(?<!k)(hz)/gi;
    // find 'khz', case insensitive
    let khzRegex = /(khz)/gi;
    let newValue = value.replaceAll(hzRegex, 'Hz').replaceAll(khzRegex, 'kHz');
    // look for units with no preceding whitespace
    hzRegex = /(?<!\s)(?<!k)(hz)/gi;
    khzRegex = /(?<!\s)(khz)/gi;
    newValue = newValue.replaceAll(hzRegex, ' Hz').replaceAll(khzRegex, ' kHz');
    return newValue;
};
/**
 * Formats 'Soh' (State of Health) to the correct casing
 * Ex. soh -> SOH
 * @param value string
 * @returns string
 */
export const correctSohCase = (value) => {
    // find soh with preceding whitespace e.g. - yes: Diagnostic soh; no: isohedron
    const sohRegex = /(?<!\S)(soh)/gi;
    return value.replaceAll(sohRegex, 'SOH');
};
/**
 * A wrapper for {@link Number.paseInt} that returns undefined instead of NaN to prevent NaN from getting stored in input fields
 * @param maybeNumber  A string to convert into a number.
 * @param radix A value between 2 and 36 that specifies the base of the number in string. If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
 * @returns
 */
export const nonNaNParseInt = (maybeNumber, radix) => {
    const parsedValue = Number.parseInt(maybeNumber, radix);
    if (Number.isNaN(parsedValue))
        return undefined;
    return parsedValue;
};
/**
 * A wrapper for {@link Number} that returns undefined instead of NaN to prevent NaN from getting stored in input fields
 * @param maybeNumber  A string to convert into a number.
 * @returns
 */
export const nonNaNParseNumber = (maybeNumber) => {
    const parsedValue = Number(maybeNumber);
    if (Number.isNaN(parsedValue))
        return undefined;
    return parsedValue;
};
/**
 * Truncates a string if it has no spaces and its length exceeds maxLen,
 * then adds an ellipsis; otherwise returns the original string
 * @param str the string to limit
 * @param maxLen the maximum character length allowed
 * @returns a truncated string or the original string
 */
export const truncateStringToLength = (str, maxLen) => {
    if (str && str.length > maxLen && !str.includes(' ')) {
        return `${str.substring(0, maxLen)}...`;
    }
    return str;
};
//# sourceMappingURL=string-util.js.map