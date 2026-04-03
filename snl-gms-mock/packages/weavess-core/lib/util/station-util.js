/**
 * Searches thru list of Weavess Channel looking for matching channel
 * uses the Weavess channel id to match
 *
 * @param station Weavess Station
 * @param channelName string channel name i.e. 'AAK.AK01.SHZ'
 * @returns channel Weavess Channel or undefined
 */
export const findChannelInStation = (station, channelName) => {
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
export const findChannelInStations = (weavessStations, channelId) => {
    /** Find the WeavessChannel to check if a waveform is loaded */
    for (const ws of weavessStations) {
        const channel = findChannelInStation(ws, channelId);
        if (channel) {
            return channel;
        }
    }
    return undefined;
};
//# sourceMappingURL=station-util.js.map