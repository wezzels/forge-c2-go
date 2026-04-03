import type { ChannelSegmentDescriptor } from '../../channel-segment';
import type { Channel } from './channel-definitions';
/**
 * Determines the name is formatted for a Station.
 *
 * @param name the name to inspect
 * @returns true if the name matches the format for a Station
 */
export declare function isStationName(name: string): boolean;
/**
 * Determines if a channel name is formatted like a rotated channel by checking for `/rotate/`
 * This should work even for rotated channels which have since been filtered.
 *
 * @param inputChannelName
 * @returns true if '/rotate/' is found
 */
export declare function isRotatedChannelName(inputChannelName: string): boolean;
/**
 * Determines if a channel name is formatted like a filtered channel by checking for `/filter,`
 *
 * @param inputChannelName
 * @returns true if '/filter,' is found
 */
export declare function isFilteredChannelName(inputChannelName: string): boolean;
export declare function getFilterNameFromChannelName(inputChannelName: string): string;
/**
 * Determines if a channel name is formatted like a derived channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is derived
 */
export declare function isDerivedChannelName(inputChannelName: string): boolean;
/**
 * Determines if a channel is derived by checking the name for a component separator token.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is derived
 */
export declare function isDerivedChannel(inputChannel: ChannelSegmentDescriptor['channel']): boolean;
/**
 * Determines if a channel name is formatted like a split channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is split
 */
export declare function isSplitChannelName(inputChannelName: string): boolean;
/**
 * Determines if a channel is split by checking the name for a component separator token.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is split
 */
export declare function isSplitChannel(inputChannel: ChannelSegmentDescriptor['channel']): boolean;
/**
 * Determines if a channel name is temporary by the temp channel code
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannelName is temporary
 */
export declare function isTemporaryChannelName(inputChannelName: string): boolean;
/**
 * Determines if a channel is temporary by checking the name for a temporary channel code.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is temporary
 */
export declare function isTemporaryChannel(inputChannel: Channel): boolean;
/**
 * Determines if a channel name is formatted like a raw channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is raw
 */
export declare function isRawChannelName(inputChannelName: string | undefined): boolean;
/**
 * Determines if a channel is raw by checking the name for a component separator token.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is raw
 */
export declare function isRawChannel(inputChannel: ChannelSegmentDescriptor['channel'] | undefined): boolean;
/**
 * Returns the beam type or undefined parsed from channel name
 *
 * @param channelName
 * @returns string beam type
 */
export declare function parseWaveformChannelType(channelName: string | undefined): 'N/A' | 'Raw channel' | 'Fk beam' | 'Event beam' | 'Detection beam' | 'Amplitude beam' | 'Rotated channel' | undefined;
/**
 * Check whether a channel name is from an event beam
 */
export declare function isEventBeamChannelName(channelName: string | undefined): boolean;
/**
 * Check whether a channel name is from an FK beam
 */
export declare function isFkBeamChannelName(channelName: string | undefined): boolean;
/**
 * Check whether a channel name is from an FK beam
 */
export declare function isDetectionBeamChannelName(channelName: string | undefined): boolean;
/**
 * Helper function to reduce code complexity
 * Helps check whether or not a non-default channel should get the BEAM INPUT label or be dimmed
 */
export declare const isBeamInputChannelName: (channelName: string) => boolean;
/**
 * Determines if a channel name is formatted like an individual mode channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is individual
 */
export declare function isIndividualChannelName(inputChannelName: string): boolean;
/**
 * Gets the derived or raw channel name from and individual mode channel id
 * since individual mode channel row ids have additional info to guarantee uniqueness
 * @param individualChannelName the individual channel id
 * @returns the derived or raw channel name for the individual channel
 */
export declare function getChannelNameFromIndividualChannelName(individualChannelName: string): string;
/**
 * Determines if a channel name is formatted like a measurement mode channel by checking the name for a component separator token.
 */
export declare function isMeasurementChannelName(inputChannelName: string): boolean;
/**
 * Determines if a channel name is formatted like a measurement or individual mode channel by checking the name for a component separator token.
 */
export declare function isModeChannelName(inputChannelName: string): boolean;
/**
 * Gets the derived or raw channel name from a measurement mode channel id
 * since measurement mode channel row ids have additional info to guarantee uniqueness
 */
export declare function getChannelNameFromMeasurementChannelName(measurementChannelName: string): string;
/**
 * Parses a channel name to determine if it is a non-Overlay (Individual or Measurement) Mode
 * Returns the derived or raw channel name regardless of mode
 */
export declare function getChannelNameFromModeChannel(inputChannelName: string): string;
//# sourceMappingURL=util.d.ts.map