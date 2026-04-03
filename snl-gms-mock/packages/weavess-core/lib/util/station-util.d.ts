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
export declare const findChannelInStation: (station: Station, channelName: string | JSX.Element) => Channel | undefined;
/**
 * Search thru the weavess stations if the channel name matches the parent channel name
 * return the defaultChannel else search child channels for a match
 *
 * @param weavessStations list
 * @param channelId
 * @returns
 */
export declare const findChannelInStations: (weavessStations: Immutable.List<Station> | Station[], channelId: string) => Channel | undefined;
//# sourceMappingURL=station-util.d.ts.map