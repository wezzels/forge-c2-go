import moment from 'moment';
export declare const SECONDS_IN_MINUTES = 60;
export declare const SECONDS_IN_HOUR = 3600;
export declare const MINUTES_IN_HOUR = 60;
export declare const HOURS_IN_DAY = 24;
export declare const DAYS_IN_WEEK = 7;
export declare const THIRTY_DAYS = 30;
export declare const WEEKS_IN_YEAR = 52;
export declare const FORTY_FIVE_DAYS = 45;
export declare const MILLISECONDS_IN_HALF_SECOND = 500;
export declare const MILLISECONDS_IN_SECOND = 1000;
export declare const MICROSECONDS_IN_SECOND = 1000000;
export declare const MILLISECONDS_IN_MINUTE: number;
export declare const MILLISECONDS_IN_HOUR: number;
export declare const MILLISECONDS_IN_HALF_DAY: number;
export declare const MILLISECONDS_IN_DAY: number;
export declare const FORTY_FIVE_DAYS_IN_MILLISECONDS: number;
export declare const FORTY_FIVE_DAYS_IN_SECONDS: number;
export declare const MILLISECONDS_IN_WEEK: number;
export declare const MILLISECONDS_IN_YEAR: number;
/**
 * The available date formats as a type
 */
export type DateFormat = 'YYYY-MM-DD';
/**
 * The available time formats as a type
 */
export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'HH:mm:ss.SSS';
/**
 * The available date and time formats as a type
 */
export type DateTimeFormat = 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss.SSS' | 'YYYY-MM-DDTHH:mm' | 'YYYY-MM-DDTHH:mm:ss' | 'YYYY-MM-DDTHH:mm:ss.SSS';
/**
 * All available date and time formats as a type
 */
export type Format = DateFormat | TimeFormat | DateTimeFormat;
/**
 * Date format.
 */
export declare const DATE_FORMAT: DateFormat;
/**
 * Time format.
 */
export declare const TIME_FORMAT: TimeFormat;
/**
 * Time format to the second precision
 */
export declare const TIME_FORMAT_WITH_SECOND_PRECISION: TimeFormat;
/**
 * Date and time format to the sub-second precision (three decimals places)
 */
export declare const TIME_FORMAT_WITH_FRACTIONAL_SECOND_PRECISION: TimeFormat;
/**
 * Date and time format
 */
export declare const DATE_TIME_FORMAT: DateTimeFormat;
/**
 * Date and time format with second precision
 */
export declare const DATE_TIME_FORMAT_WITH_SECOND_PRECISION: DateTimeFormat;
/**
 * Date and time format with fractional second precision
 */
export declare const DATE_TIME_FORMAT_WITH_FRACTIONAL_SECOND_PRECISION: DateTimeFormat;
/**
 * ISO Date and time format
 */
export declare const ISO_DATE_TIME_FORMAT: DateTimeFormat;
/**
 * ISO Date and time format with second precision
 */
export declare const ISO_DATE_TIME_FORMAT_WITH_SECOND_PRECISION: DateTimeFormat;
/**
 * ISO Date and time format with fractional second precision
 */
export declare const ISO_DATE_TIME_FORMAT_WITH_FRACTIONAL_SECOND_PRECISION: DateTimeFormat;
/**
 * A regular expression pattern for matching ISO Date Times
 *
 * Matches: `2010-05-10T10:45:30.123Z`
 */
export declare const REGEX_ISO_DATE_TIME: RegExp;
/**
 * A regular expression pattern for matching the string `UserCurrentTime`
 */
export declare const REGEX_USER_CURRENT_TIME: RegExp;
/**
 * Format seconds to a Moment object.
 *
 * @param seconds the seconds
 */
export declare const toMoment: (seconds: number) => moment.Moment;
/**
 * Format seconds to a JS Date object.
 *
 * @param seconds the seconds
 */
export declare const toDate: (seconds: number) => Date;
/**
 * Calculates the difference between two times.
 *
 * @param a the first time to compare
 * @param b the second time to compare
 * @param unitOfTime the unit of time
 */
export declare const diff: (start: number, end: number, unitOfTime?: moment.unitOfTime.Diff) => number;
/**
 * Format seconds to a readable string.
 *
 * @param seconds the seconds
 * @param format the format string (defaults to 'YYYY-MM-DD HH:mm:ss')
 */
export declare const secondsToString: (seconds: number, format?: Format) => string;
/**
 * Format fractional seconds to a readable string.
 *
 * @param seconds the seconds
 * @param format the format string (defaults to 'YYYY-MM-DD HH:mm:ss.SSS')
 */
export declare const fractionalSecondsToString: (seconds: number, format?: Format) => string;
/**
 * Format a JS date to a readable string.
 *
 * @param date the JS date
 * @param format the format string (defaults to 'YYYY-MM-DD HH:mm:ss')
 */
export declare const dateToString: (date: Date, format?: Format) => string;
/**
 * Check if a string is a valid entry for stringToDate
 *
 * @param str the date string
 */
export declare const dateStringIsValid: (str: string) => boolean;
/**
 * Convert an string to a date.
 *
 * @param str the date string
 */
export declare const stringToDate: (str: string) => Date;
/**
 * Converts a UTC date to a date
 *
 * @param date the date to convert
 * @returns the converted date
 */
export declare const convertUTCDateToDate: (date: Date) => Date;
/**
 * Converts a date to a UTC representation of the date.
 *
 * @param date the date to convert
 * @returns the converted date
 */
export declare const convertDateToUTCDate: (date: Date) => Date;
/**
 * Convert a formatted date string to epoch seconds.
 *
 * @param str date string in ISO format
 * @returns an epoch seconds representation of the input date spring
 */
export declare function toEpochSeconds(str: string | undefined | null): number;
/**
 * Returns the current time in epoch seconds.
 *
 * @returns an epoch seconds for time now
 */
export declare function epochSecondsNow(): number;
/**
 * Convert epoch seconds to OSD compatible ISO formatted date string.
 *
 * If value is NaN, returns the start of Unix epoch time.
 *
 * @param epochSeconds seconds since epoch
 * @returns a New Date string in OSD format
 */
export declare function toOSDTime(epochSeconds: number): string;
/**
 * Takes epoch seconds and returns the closest start of the hour in epoch seconds.
 *
 * @param epochSeconds the epoch seconds
 *
 */
export declare function startOfHour(epochSeconds: number): number;
/**
 * takes a UTC formatted time string or number in epoch seconds and formats it for human readable display
 *
 * @param time - the time string to be formatted
 * @param invalidString the string to return if given falsy string, or a string with the wrong format. Defaults to 'Unknown'
 * @returns the time in a human readable format: YYYY-MM-DD HH:MM:SS, or the string 'Unknown' if something goes wrong
 */
export declare function formatTimeForDisplay(time: number | string | undefined | null, invalidString?: string): string;
export interface TimeUnits {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
export declare const splitMillisIntoTimeUnits: (millis: number) => TimeUnits;
export declare const timeUnitsToString: (timeUnits: TimeUnits, includeMilliseconds?: boolean) => string;
export declare const getIndexOfFirstSignificantTimeUnit: (timeUnits: TimeUnits) => number;
/**
 * Sets time units so that no more than the maximum time units are non-zero
 *
 * @param timeUnits units to truncate
 * @param maxTimeUnits maximum amount of units to show
 */
export declare const truncateTimeUnits: (timeUnits: TimeUnits, maxTimeUnits?: number) => TimeUnits;
/**
 * Converts milliseconds into human readable string
 *
 * @param millis milliseconds to split
 * @param maximumPrecision if provided, will reduce outputted time units to a maximum of three
 * @param includeMilliseconds if provided, output may include milliseconds
 */
export declare const millisToTimeRemaining: (millis: number, maximumPrecision?: number, includeMilliseconds?: boolean) => string;
/**
 * Returns weeks, days, etc. optionally to a maximum given precision. Removes leading a trailing units that are zero
 *
 * ie, 3660001 ms, 2 precision => 1 hour 1 minute
 * ie, 6000 ms, 2 precision => 1 minute
 *
 * @param millis Milliseconds to convert
 * @param maximumPrecision maximum number of time units in string
 */
export declare const millisToStringWithMaxPrecision: (millis: number, maximumPrecision?: number) => string;
/**
 * Convert a duration to seconds.
 *
 * @param duration string of duration i.e. 'PT1.60S' returns 1.6 seconds
 * @returns a number
 */
export declare function convertDurationToSeconds(duration: string): number;
/**
 * Helper function to convert a Moment string and return epoch milliseconds as a number.
 *
 * @param duration string of duration i.e. 'PT1.60S' returns 1600 milliseconds
 * @returns a number
 */
export declare function convertDurationToMilliseconds(duration: string): number;
/**
 * Helper function to format a seconds into duration format.
 *
 * @param duration number of 1.6 seconds returns 'PT1.60S'
 * @param seconds
 * @returns a string
 */
export declare function convertSecondsToDuration(seconds: number): string;
/**
 * Calculates what percentage of time remains for a timer.
 *
 * @param timeEndMs the timestamp of the end
 * @param durationMs the timestamp of how long it runs
 */
export declare function calculatePercentTimeRemaining(timeEndMs: number, durationMs: number): number;
/**
 * Takes in a time to test and determines the delta time to compare against staleTimeMs.
 * returns true if calculated time is greater than staleTimeMs
 *
 * @param staleTimeMs time limit for stale time to test against
 * @param timeSecs number in seconds gets converted to milliseconds
 */
export declare const isTimeStale: (timeSecs: number, staleTimeMs: number) => boolean;
/**
 * Rounds the given date to the nearest hour.
 *
 * @param date - The date to round.
 * @returns The rounded date.
 */
export declare const roundDateToNearestHourByMinute: (date: Date) => Date;
//# sourceMappingURL=time-util.d.ts.map