import 'moment-precise-range-plugin';
import type { WeavessTypes } from '@gms/weavess-core';
/**
 * Calculates the left percentage for a given time based on the provided start and end times.
 *
 * @param timeSeconds The time to calculate the left percentage on
 * @param startTimeSeconds The start time in seconds
 * @param endTimeSeconds The end time in seconds
 *
 * @returns left percentage as a number
 */
export declare const calculateLeftPercent: (timeSeconds: number, startTimeSecs: number, endTimeSecs: number) => number;
/**
 * Cleans up after THREE js objects such as Camera and Scene
 *
 * @param obj THREE object
 */
export declare const clearThree: (obj: any) => void;
/**
 * Calculates the right percentage for a given time based on the provided start and end times.
 *
 * @param timeSeconds The time to calculate the left percentage on
 * @param startTimeSeconds The start time in seconds
 * @param endTimeSeconds The end time in seconds
 *
 * @returns right percentage as a number
 */
export declare const calculateRightPercent: (timeSeconds: number, startTimeSeconds: number, endTimeSeconds: number) => number;
/**
 * Helper function to format the number of seconds difference between start and end time
 *
 * @param interval time interval in epoch seconds
 * @returns string formatted number of seconds
 */
export declare const deltaTimeString: (interval: WeavessTypes.TimeRange) => string;
/**
 * Time range of display interval as human-readable string
 * in the following structure: `startTime - endTime, duration`
 * startTime and endTime default to `YYYY-MM-DD HH:mm:ss.SSS` if no other format is specified
 *
 * @param interval: WeavessTypes.TimeRange
 * @param format: optional string to format start and end time using moment. Defaults to `YYYY-MM-DD HH:mm:ss.SSS`
 * @returns interval formatted string to display
 */
export declare const timeRangeDisplayString: (interval: WeavessTypes.TimeRange, format?: string) => string;
/**
 * Determine if time falls within time range
 *
 * @param timeSecs
 * @param timeRange
 * @returns boolean
 */
export declare const isWithinTimeRange: (timeSecs: number, timeRange: WeavessTypes.TimeRange) => boolean;
/**
 * Gets the channel segments for a specific channel by a point in time.
 *
 * @param channelId the channel id
 * @param timeSecs the time in epoch seconds
 * @param stations the current array of stations
 * @returns an array of selected channel segments
 */
export declare const getChannelSegmentsFromStationAndTime: (channelId: string, timeSecs: number, stations: WeavessTypes.Station[], isDefaultChannel: boolean) => WeavessTypes.ChannelSegment[];
/**
 * Sets focus to weavess wp container viewport
 */
export declare function setFocusToWeavess(): void;
//# sourceMappingURL=utils.d.ts.map