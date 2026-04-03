import type Immutable from 'immutable';

import { type Channel, type Station } from '../types';

/**
 * Searches thru list of Weavess Channel looking for matching channel
 * uses the Weavess channel id to match
 *
 * @param station Weavess Station
 * @param channelName string channel name i.e. 'AAK.AK01.SHZ'
 * @returns channel Weavess Channel or undefined
 */
export const findChannelInStation = (
  station: Station,
  channelName: string | JSX.Element
): Channel | undefined => {
  const maybeChannel = station.defaultChannels?.find(newChannel => {
    return newChannel.id === channelName;
  });
  if (maybeChannel) {
    return maybeChannel;
  }
  return station.nonDefaultChannels?.find(newChannel => {
    return newChannel.id === channelName;
  });
};

/**
 * Search thru the weavess stations if the channel name matches the parent channel name
 * return the defaultChannel else search child channels for a match
 *
 * @param weavessStations list
 * @param channelId
 * @returns
 */
export const findChannelInStations = (
  weavessStations: Immutable.List<Station> | Station[],
  channelId: string
): Channel | undefined => {
  /** Find the WeavessChannel to check if a waveform is loaded */
  for (const ws of weavessStations) {
    const channel = findChannelInStation(ws, channelId);
    if (channel) {
      return channel;
    }
  }
  return undefined;
};
