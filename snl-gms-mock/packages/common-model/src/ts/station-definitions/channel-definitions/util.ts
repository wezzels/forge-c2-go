import type { ChannelSegmentDescriptor } from '../../channel-segment';
import { UNFILTERED } from '../../filter/types';
import type { Channel } from './channel-definitions';
import {
  CHANNEL_COMPONENT_SEPARATOR,
  COMPONENT_SEPARATOR,
  INDIVIDUAL_CHANNEL_TOKEN,
  MEASUREMENT_CHANNEL_TOKEN,
  SPLIT_CHANNEL_TOKEN,
  TEMPORARY_CHANNEL_CODE
} from './channel-definitions';

/**
 * Determines the name is formatted for a Station.
 *
 * @param name the name to inspect
 * @returns true if the name matches the format for a Station
 */
export function isStationName(name: string): boolean {
  return !name.includes('.') && !name.includes('/');
}

/**
 * Determines if a channel name is formatted like a rotated channel by checking for `/rotate/`
 * This should work even for rotated channels which have since been filtered.
 *
 * @param inputChannelName
 * @returns true if '/rotate/' is found
 */
export function isRotatedChannelName(inputChannelName: string): boolean {
  return inputChannelName.includes('/rotate/');
}

/**
 * Determines if a channel name is formatted like a filtered channel by checking for `/filter,`
 *
 * @param inputChannelName
 * @returns true if '/filter,' is found
 */
export function isFilteredChannelName(inputChannelName: string): boolean {
  return inputChannelName.includes('/filter,');
}

export function getFilterNameFromChannelName(inputChannelName: string): string {
  const matchArray = inputChannelName.match(/\/filter,(.*)\//);
  return matchArray ? matchArray[1] : UNFILTERED;
}
/**
 * Determines if a channel name is formatted like a derived channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is derived
 */
export function isDerivedChannelName(inputChannelName: string): boolean {
  return inputChannelName.includes(COMPONENT_SEPARATOR);
}

/**
 * Determines if a channel is derived by checking the name for a component separator token.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is derived
 */
export function isDerivedChannel(inputChannel: ChannelSegmentDescriptor['channel']): boolean {
  return isDerivedChannelName(inputChannel.name);
}

/**
 * Determines if a channel name is formatted like a split channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is split
 */
export function isSplitChannelName(inputChannelName: string): boolean {
  return inputChannelName.includes(SPLIT_CHANNEL_TOKEN);
}

/**
 * Determines if a channel is split by checking the name for a component separator token.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is split
 */
export function isSplitChannel(inputChannel: ChannelSegmentDescriptor['channel']): boolean {
  return isSplitChannelName(inputChannel.name);
}

/**
 * Determines if a channel name is temporary by the temp channel code
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannelName is temporary
 */
export function isTemporaryChannelName(inputChannelName: string): boolean {
  return inputChannelName !== undefined && inputChannelName?.includes(TEMPORARY_CHANNEL_CODE);
}

/**
 * Determines if a channel is temporary by checking the name for a temporary channel code.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is temporary
 */
export function isTemporaryChannel(inputChannel: Channel): boolean {
  return isTemporaryChannelName(inputChannel?.name);
}

/**
 * Determines if a channel name is formatted like a raw channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is raw
 */
export function isRawChannelName(inputChannelName: string | undefined): boolean {
  return (
    !!inputChannelName &&
    ((!inputChannelName.includes(COMPONENT_SEPARATOR) &&
      inputChannelName.includes(CHANNEL_COMPONENT_SEPARATOR)) ||
      (inputChannelName.includes(CHANNEL_COMPONENT_SEPARATOR) &&
        !inputChannelName.includes('beam') &&
        !isRotatedChannelName(inputChannelName)))
  );
}

/**
 * Determines if a channel is raw by checking the name for a component separator token.
 *
 * @param inputChannel the source channel
 * @returns true if the inputChannel is raw
 */
export function isRawChannel(
  inputChannel: ChannelSegmentDescriptor['channel'] | undefined
): boolean {
  return !!inputChannel && isRawChannelName(inputChannel.name);
}

/**
 * Returns the beam type or undefined parsed from channel name
 *
 * @param channelName
 * @returns string beam type
 */
export function parseWaveformChannelType(
  channelName: string | undefined
):
  | 'N/A'
  | 'Raw channel'
  | 'Fk beam'
  | 'Event beam'
  | 'Detection beam'
  | 'Amplitude beam'
  | 'Rotated channel'
  | undefined {
  if (!channelName) {
    return undefined;
  }

  if (isTemporaryChannelName(channelName)) {
    return 'N/A';
  }

  if (isRawChannelName(channelName)) {
    return 'Raw channel';
  }

  if (isRotatedChannelName(channelName)) {
    return 'Rotated channel';
  }

  const elements = channelName.split('/');

  if (!elements[1]) {
    return undefined;
  }

  const beamDescription = elements[1] === 'masked' ? elements[2] : elements[1];

  const beamPrefix = beamDescription.split(',')[1];
  switch (beamPrefix) {
    case 'fk':
      return 'Fk beam';
    case 'event':
      return 'Event beam';
    case 'detection':
      return 'Detection beam';
    case 'amplitude':
      return 'Amplitude beam';
    default:
      return undefined;
  }
}

/**
 * Check whether a channel name is from an event beam
 */
export function isEventBeamChannelName(channelName: string | undefined): boolean {
  return parseWaveformChannelType(channelName) === 'Event beam';
}

/**
 * Check whether a channel name is from an FK beam
 */
export function isFkBeamChannelName(channelName: string | undefined): boolean {
  return parseWaveformChannelType(channelName) === 'Fk beam';
}

/**
 * Check whether a channel name is from an FK beam
 */
export function isDetectionBeamChannelName(channelName: string | undefined): boolean {
  return parseWaveformChannelType(channelName) === 'Detection beam';
}

/**
 * Helper function to reduce code complexity
 * Helps check whether or not a non-default channel should get the BEAM INPUT label or be dimmed
 */
export const isBeamInputChannelName = (channelName: string): boolean => {
  return (
    isEventBeamChannelName(channelName) ||
    isFkBeamChannelName(channelName) ||
    isDetectionBeamChannelName(channelName)
  );
};

/**
 * Determines if a channel name is formatted like an individual mode channel by checking the name for a component separator token.
 *
 * @param inputChannelName the source channel name
 * @returns true if the inputChannel is individual
 */
export function isIndividualChannelName(inputChannelName: string): boolean {
  return inputChannelName.includes(INDIVIDUAL_CHANNEL_TOKEN);
}

/**
 * Gets the derived or raw channel name from and individual mode channel id
 * since individual mode channel row ids have additional info to guarantee uniqueness
 * @param individualChannelName the individual channel id
 * @returns the derived or raw channel name for the individual channel
 */
export function getChannelNameFromIndividualChannelName(individualChannelName: string): string {
  return individualChannelName.split(`.${INDIVIDUAL_CHANNEL_TOKEN}`)[0];
}

/**
 * Determines if a channel name is formatted like a measurement mode channel by checking the name for a component separator token.
 */
export function isMeasurementChannelName(inputChannelName: string): boolean {
  return inputChannelName.includes(MEASUREMENT_CHANNEL_TOKEN);
}

/**
 * Determines if a channel name is formatted like a measurement or individual mode channel by checking the name for a component separator token.
 */
export function isModeChannelName(inputChannelName: string): boolean {
  return isMeasurementChannelName(inputChannelName) || isIndividualChannelName(inputChannelName);
}

/**
 * Gets the derived or raw channel name from a measurement mode channel id
 * since measurement mode channel row ids have additional info to guarantee uniqueness
 */
export function getChannelNameFromMeasurementChannelName(measurementChannelName: string): string {
  return measurementChannelName.split(`.${MEASUREMENT_CHANNEL_TOKEN}`)[0];
}

/**
 * Parses a channel name to determine if it is a non-Overlay (Individual or Measurement) Mode
 * Returns the derived or raw channel name regardless of mode
 */
export function getChannelNameFromModeChannel(inputChannelName: string): string {
  let nonOverlayChannelName: string = inputChannelName;
  if (isIndividualChannelName(inputChannelName)) {
    nonOverlayChannelName = getChannelNameFromIndividualChannelName(inputChannelName);
  } else if (isMeasurementChannelName(inputChannelName)) {
    nonOverlayChannelName = getChannelNameFromMeasurementChannelName(inputChannelName);
  }
  return nonOverlayChannelName;
}
