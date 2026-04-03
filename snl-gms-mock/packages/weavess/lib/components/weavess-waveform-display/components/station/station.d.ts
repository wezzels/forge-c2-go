import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import { Channel } from './components';
import type { StationProps } from './types';
/**
 * Station Component. Contains channels, and optional events.
 */
export declare class Station extends React.PureComponent<StationProps> {
    defaultChannelRef: Channel | null;
    /** The reference to the default channel. */
    defaultChannelRefs: {
        [id: string]: Channel | null;
    };
    /** The reference to the non-default channels. */
    nonDefaultChannelRefs: {
        [id: string]: Channel | null;
    };
    /** Temporary split channels created when adding a signal detection */
    splitChannelRefs: {
        [id: string]: Channel | null;
    };
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    /**
     * Get a list of channels (used by waveform-panel to render the waveforms)
     *
     * @returns list of Channels
     */
    getChannelList: () => Channel[];
    /**
     * Get the channel
     *
     * @param channelName
     * @returns channel found or undefined
     */
    getChannel: (channelName: string) => Channel | undefined;
    /**
     * Sets the ref for a  default channel. Uses memoization to ensure referential stability
     * of this function for each non default channel
     */
    private readonly setDefaultChannelRef;
    /**
     * Sets the ref for a non default channel. Uses memoization to ensure referential stability
     * of this function for each non default channel
     */
    private readonly setNonDefaultChannelRef;
    /**
     * Sets the ref for a split channel. Uses memoization to ensure referential stability
     * of this function for each non default channel
     */
    private readonly setSplitChannelRef;
    /** Determine if the channels are showing */
    private readonly areChannelsShowing;
    /** Sets and calls the function for the expand/collapse button */
    private readonly expandOrCollapse;
    /** Calculate the row heights for use in rendering channels */
    private readonly buildRowHeights;
    /**
     * Resets the manual amplitude scaling on the parent and child channels
     */
    resetAmplitude: () => void;
    /**
     * @returns List of channels that have their amplitudes manually scaled
     */
    getManualAmplitudeScaledChannels: () => WeavessTypes.Channel[];
    /**
     * Create the child channels JSX elements. This function helps break
     * up the render method's complexity and makes it more readable
     *
     * @param channels the child Weavess Channel list
     * @param rowHeights for each child Channel
     * @param distanceUnits which distanceUnits to use degrees or km
     * @param isSplitChanel flag to show if this is a split channel
     */
    private readonly createNonDefaultChannelElements;
    /**
     * Create the default channels JSX elements. This function helps break
     * up the render method's complexity and makes it more readable
     *
     * @param channels the child Weavess Channel list
     * @param rowHeights for each child Channel
     * @param distanceUnits which distanceUnits to use degrees or km
     * @param isSplitChanel flag to show if this is a split channel
     */
    private readonly createDefaultChannelElements;
    /**
     * Maps the channel data to the provided time offset in seconds.
     *
     * @param channel
     */
    private readonly mapChannelConfigToOffset;
    /**
     * Build the waveform content including markers
     *
     * @param waveform
     * @returns Channel WaveformContent
     */
    private readonly buildWaveform;
    /**
     * Build the waveform content including markers
     *
     * @param waveform
     * @returns Channel WaveformContent
     */
    private readonly buildSpectrogram;
    /**
     * Maps the events to the real time from offset in seconds.
     *
     * @param channel
     * @param channelEvents
     */
    private readonly mapEventsToOffset;
    render(): JSX.Element;
}
//# sourceMappingURL=station.d.ts.map