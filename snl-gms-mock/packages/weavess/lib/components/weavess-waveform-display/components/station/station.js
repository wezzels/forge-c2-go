/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import { WeavessConstants, WeavessTypes } from '@gms/weavess-core';
import classNames from 'classnames';
import sortBy from 'lodash/sortBy';
import memoizeOne from 'memoize-one';
import React from 'react';
import { Channel } from './components';
import { StationExpansionButton } from './components/channel/components/label/label-elements';
import { buildWeavessMarkers, onChannelClickToOffset, onClickSelectionWindowToOffset, onMaskCreateDragEndToOffset, onMeasureWindowUpdatedToOffset, onMoveSelectionWindowToOffset, onUpdateMarkerToOffset, onUpdateSelectionWindowToOffset, sortBySdForChannels } from './utils';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * Station Component. Contains channels, and optional events.
 */
export class Station extends React.PureComponent {
    defaultChannelRef;
    /** The reference to the default channel. */
    defaultChannelRefs = {};
    /** The reference to the non-default channels. */
    nonDefaultChannelRefs = {};
    /** Temporary split channels created when adding a signal detection */
    splitChannelRefs = {};
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess Station Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Get a list of channels (used by waveform-panel to render the waveforms)
     *
     * @returns list of Channels
     */
    getChannelList = () => {
        const channels = [];
        // Add default channels
        if (this.defaultChannelRefs) {
            Object.keys(this.defaultChannelRefs).forEach(key => {
                const channel = this.defaultChannelRefs[key];
                if (channel) {
                    channels.push(channel);
                }
            });
        }
        // Add non-default channels if the channel is expanded
        if (this.nonDefaultChannelRefs && this.props.station.areChannelsShowing) {
            Object.keys(this.nonDefaultChannelRefs).forEach(key => {
                const channel = this.nonDefaultChannelRefs[key];
                if (channel) {
                    channels.push(channel);
                }
            });
        }
        // Add split channels if applicable
        if (this.splitChannelRefs) {
            Object.keys(this.splitChannelRefs).forEach(key => {
                const channel = this.splitChannelRefs[key];
                if (channel) {
                    channels.push(channel);
                }
            });
        }
        return channels;
    };
    /**
     * Get the channel
     *
     * @param channelName
     * @returns channel found or undefined
     */
    getChannel = (channelName) => {
        const channels = this.getChannelList();
        return channels.find(channel => channel.getChannelId() === channelName);
    };
    /**
     * Sets the ref for a  default channel. Uses memoization to ensure referential stability
     * of this function for each non default channel
     */
    setDefaultChannelRef = memoizeOne((id) => ref => {
        this.defaultChannelRefs[id] = ref;
    });
    /**
     * Sets the ref for a non default channel. Uses memoization to ensure referential stability
     * of this function for each non default channel
     */
    setNonDefaultChannelRef = memoizeOne((id) => (ref) => {
        this.nonDefaultChannelRefs[id] = ref;
    });
    /**
     * Sets the ref for a split channel. Uses memoization to ensure referential stability
     * of this function for each non default channel
     */
    setSplitChannelRef = memoizeOne((id) => (ref) => {
        this.splitChannelRefs[id] = ref;
    });
    /** Determine if the channels are showing */
    areChannelsShowing = () => {
        return (!!this.props.station &&
            !!this.props.station.areChannelsShowing &&
            !!this.props.station.nonDefaultChannels &&
            // Only show channels if there is at least one default channel
            this.props.station.defaultChannels.length > 0);
    };
    /** Sets and calls the function for the expand/collapse button */
    expandOrCollapse = () => {
        const callback = this.areChannelsShowing()
            ? this.props.events?.defaultChannelEvents?.labelEvents?.onChannelCollapsed
            : this.props.events?.defaultChannelEvents?.labelEvents?.onChannelExpanded;
        if (callback) {
            callback(this.props.station.name);
        }
        else {
            logger.error(`Unable to expand/collapse ${this.props.station.name}`);
        }
    };
    /** Calculate the row heights for use in rendering channels */
    buildRowHeights = () => {
        const rowHeights = [];
        this.props.station.defaultChannels.forEach(channel => {
            rowHeights.push(channel.height ||
                this.props.initialConfiguration.defaultChannelHeightPx ||
                WeavessConstants.DEFAULT_CHANNEL_HEIGHT_PIXELS);
        });
        if (this.areChannelsShowing() && this.props.station.nonDefaultChannels) {
            this.props.station.nonDefaultChannels.forEach(channel => {
                rowHeights.push(channel.height ||
                    this.props.initialConfiguration.defaultChannelHeightPx ||
                    WeavessConstants.DEFAULT_CHANNEL_HEIGHT_PIXELS);
            });
        }
        if (this.props.station.splitChannels) {
            this.props.station.splitChannels.forEach(channel => {
                rowHeights.push(channel.height ||
                    this.props.initialConfiguration.defaultChannelHeightPx ||
                    WeavessConstants.DEFAULT_CHANNEL_HEIGHT_PIXELS);
            });
        }
        const totalRowHeight = rowHeights.map(rowHeight => rowHeight + 1).reduce((a, b) => a + b, 0);
        return {
            rowHeights,
            totalRowHeight
        };
    };
    /**
     * Resets the manual amplitude scaling on the parent and child channels
     */
    // eslint-disable-next-line react/no-unused-class-component-methods
    resetAmplitude = () => {
        if (this.defaultChannelRefs) {
            Object.keys(this.defaultChannelRefs).forEach(key => {
                const channel = this.defaultChannelRefs[key];
                if (channel) {
                    channel.resetAmplitude();
                }
            });
        }
        if (this.splitChannelRefs) {
            Object.keys(this.splitChannelRefs).forEach(key => {
                const channel = this.splitChannelRefs[key];
                if (channel) {
                    channel.resetAmplitude();
                }
            });
        }
        if (this.nonDefaultChannelRefs) {
            Object.keys(this.nonDefaultChannelRefs).forEach(key => {
                const channel = this.nonDefaultChannelRefs[key];
                if (channel) {
                    channel.resetAmplitude();
                }
            });
        }
    };
    /**
     * @returns List of channels that have their amplitudes manually scaled
     */
    getManualAmplitudeScaledChannels = () => {
        const manuallyScaledChannels = [];
        if (this.defaultChannelRefs) {
            Object.keys(this.defaultChannelRefs).forEach(key => {
                const channel = this.defaultChannelRefs[key];
                if (channel?.isAmplitudeManuallyScaled() && channel?.props.channel) {
                    manuallyScaledChannels.push(channel?.props.channel);
                }
            });
        }
        if (this.nonDefaultChannelRefs) {
            Object.keys(this.nonDefaultChannelRefs).forEach(key => {
                const channel = this.nonDefaultChannelRefs[key];
                if (channel?.isAmplitudeManuallyScaled() && channel?.props.channel) {
                    manuallyScaledChannels.push(channel?.props.channel);
                }
            });
        }
        return manuallyScaledChannels;
    };
    /**
     * Create the child channels JSX elements. This function helps break
     * up the render method's complexity and makes it more readable
     *
     * @param channels the child Weavess Channel list
     * @param rowHeights for each child Channel
     * @param distanceUnits which distanceUnits to use degrees or km
     * @param isSplitChanel flag to show if this is a split channel
     */
    createNonDefaultChannelElements = (channels, rowHeights, distanceUnits, refSetter, splitChannel = false) => {
        return (splitChannel ? sortBy(channels, sortBySdForChannels) : channels).map((channel, index) => {
            let childEvents;
            if (this.props.events?.nonDefaultChannelEvents) {
                childEvents = this.mapEventsToOffset(channel, this.props.events.nonDefaultChannelEvents);
            }
            const timeOffsetSeconds = channel.timeOffsetSeconds || 0;
            return (React.createElement(Channel // Channel (for non-default channels)
            , { isSplitStation: this.props?.isSplitStation, splitModePickMarkerColor: this.props?.splitModePickMarkerColor, key: `station-nondefault-channel-${channel.id}`, ref: refSetter(channel.id), offsetSecs: timeOffsetSeconds, index: (index + 1) * 2, height: rowHeights[index + this.props.station.defaultChannels.length], shouldRenderWaveforms: this.props.shouldRenderWaveforms, shouldRenderSpectrograms: this.props.shouldRenderSpectrograms, initialConfiguration: this.props.initialConfiguration, stationId: this.props.station.id, channel: this.mapChannelConfigToOffset(channel), displayInterval: this.props.displayInterval, viewableInterval: this.props.viewableInterval, getZoomRatio: this.props.getZoomRatio, isDefaultChannel: false, isExpandable: false, isSplitChannelOverlayOpen: this.props.isSplitChannelOverlayOpen, activeSplitModeType: this.props.activeSplitModeType, closeSplitChannelOverlayCallback: this.props.closeSplitChannelOverlayCallback, expanded: false, showMaskIndicator: false, isStationMaskTarget: this.props.isMaskTarget, distance: channel.distance || 0, distanceUnits: distanceUnits, azimuth: channel.azimuth || 0, customLabel: this.props.customLabel, events: childEvents, canvasRef: this.props.canvasRef, getCanvasBoundingRect: this.props.getCanvasBoundingRect, getPositionBuffer: this.props.getPositionBuffer, getBoundaries: this.props.getBoundaries, glMin: this.props.glMin, glMax: this.props.glMax, renderWaveforms: this.props.renderWaveforms, converters: this.props.converters, onMouseMove: this.props.onMouseMove, onMouseDown: this.props.onMouseDown, onMouseUp: this.props.onMouseUp, onContextMenu: this.props.onContextMenu, isMeasureWindow: this.props.isMeasureWindow, updateMeasureWindow: this.props.updateMeasureWindow, measureWindowSelection: this.props.measureWindowSelection, msrWindowWaveformAmplitudeScaleFactor: this.props.msrWindowWaveformAmplitudeScaleFactor, channelLabelTooltip: channel.channelLabelTooltip, splitChannelRefs: this.splitChannelRefs }));
        });
    };
    /**
     * Create the default channels JSX elements. This function helps break
     * up the render method's complexity and makes it more readable
     *
     * @param channels the child Weavess Channel list
     * @param rowHeights for each child Channel
     * @param distanceUnits which distanceUnits to use degrees or km
     * @param isSplitChanel flag to show if this is a split channel
     */
    createDefaultChannelElements = (channels, rowHeights, distanceUnits, expanded, refSetter) => {
        return channels.map((channel, index) => {
            const timeOffsetSeconds = channel.timeOffsetSeconds || 0;
            let parentEvents;
            if (this.props.events?.defaultChannelEvents) {
                parentEvents = this.mapEventsToOffset(channel, this.props.events.defaultChannelEvents);
            }
            /**
             * All values in this must be referentially stable.
             */
            return (React.createElement(Channel // default channel
            , { isSplitStation: !!this.props.activeSplitModeType, activeSplitModeType: this.props.activeSplitModeType, splitModePickMarkerColor: this.props?.splitModePickMarkerColor, key: `station-individual-channel-${channel.id}`, ref: refSetter(channel.id), offsetSecs: timeOffsetSeconds, index: index * 2, height: rowHeights[index], shouldRenderWaveforms: this.props.shouldRenderWaveforms, shouldRenderSpectrograms: this.props.shouldRenderSpectrograms, initialConfiguration: this.props.initialConfiguration, stationId: this.props.station.id, channel: this.mapChannelConfigToOffset(channel), displayInterval: this.props.displayInterval, viewableInterval: this.props.viewableInterval, getZoomRatio: this.props.getZoomRatio, isDefaultChannel: true, isExpandable: !!this.props.station.nonDefaultChannels, isSplitChannelOverlayOpen: this.props.isSplitChannelOverlayOpen, splitChannelRefs: this.splitChannelRefs, closeSplitChannelOverlayCallback: this.props.closeSplitChannelOverlayCallback, expanded: expanded, showMaskIndicator: this.props.hasQcMasks ?? false, distance: this.props.station.distance ? this.props.station.distance : 0, distanceUnits: distanceUnits, azimuth: this.props.station.azimuth ? this.props.station.azimuth : 0, customLabel: this.props.customLabel, events: parentEvents, canvasRef: this.props.canvasRef, getCanvasBoundingRect: this.props.getCanvasBoundingRect, getPositionBuffer: this.props.getPositionBuffer, getBoundaries: this.props.getBoundaries, renderWaveforms: this.props.renderWaveforms, glMin: this.props.glMin, glMax: this.props.glMax, converters: this.props.converters, onMouseMove: this.props.onMouseMove, onMouseDown: this.props.onMouseDown, onMouseUp: this.props.onMouseUp, onContextMenu: this.props.onContextMenu, isMeasureWindow: this.props.isMeasureWindow, updateMeasureWindow: this.props.updateMeasureWindow, measureWindowSelection: this.props.measureWindowSelection, msrWindowWaveformAmplitudeScaleFactor: this.props.msrWindowWaveformAmplitudeScaleFactor, channelLabelTooltip: channel.channelLabelTooltip, channelLabelIcon: channel.channelLabelIcon }));
        });
    };
    /**
     * Maps the channel data to the provided time offset in seconds.
     *
     * @param channel
     */
    mapChannelConfigToOffset = (channel) => {
        if (!channel.timeOffsetSeconds) {
            return channel;
        }
        const { timeOffsetSeconds } = channel;
        // map the time seconds to the offset time seconds
        const waveform = channel.waveform
            ? this.buildWaveform(channel.waveform, timeOffsetSeconds)
            : undefined;
        const spectrogram = channel.spectrogram
            ? this.buildSpectrogram(channel, timeOffsetSeconds)
            : undefined;
        const markers = channel && channel.markers
            ? buildWeavessMarkers(channel.markers, timeOffsetSeconds)
            : undefined;
        // TODO: This is referentially unstable
        return {
            ...channel,
            waveform,
            spectrogram,
            markers
        };
    };
    /**
     * Build the waveform content including markers
     *
     * @param waveform
     * @returns Channel WaveformContent
     */
    // eslint-disable-next-line class-methods-use-this
    buildWaveform = (waveform, timeOffsetSeconds) => {
        const waveformSignalDetections = waveform && waveform.signalDetections
            ? waveform.signalDetections.map(s => ({
                ...s,
                timeSecs: s.timeSecs + timeOffsetSeconds
            }))
            : undefined;
        const waveformPredictedPhases = waveform && waveform.predictedPhases
            ? waveform.predictedPhases.map(p => ({
                ...p,
                timeSecs: p.timeSecs + timeOffsetSeconds
            }))
            : undefined;
        const waveformTheoreticalPhaseWindows = waveform && waveform.theoreticalPhaseWindows
            ? waveform.theoreticalPhaseWindows.map(t => ({
                ...t,
                startTimeSecs: t.startTimeSecs + timeOffsetSeconds,
                endTimeSecs: t.endTimeSecs + timeOffsetSeconds
            }))
            : undefined;
        const waveformMarkers = waveform && waveform.markers
            ? buildWeavessMarkers(waveform.markers, timeOffsetSeconds)
            : undefined;
        if (waveform) {
            return {
                ...waveform,
                signalDetections: waveformSignalDetections,
                predictedPhases: waveformPredictedPhases,
                theoreticalPhaseWindows: waveformTheoreticalPhaseWindows,
                markers: waveformMarkers
            };
        }
        return undefined;
    };
    /**
     * Build the waveform content including markers
     *
     * @param waveform
     * @returns Channel WaveformContent
     */
    // eslint-disable-next-line class-methods-use-this
    buildSpectrogram = (channel, timeOffsetSeconds) => {
        const spectrogramSignalDetections = channel.spectrogram && channel.spectrogram.signalDetections
            ? channel.spectrogram.signalDetections.map(s => ({
                ...s,
                timeSecs: s.timeSecs + timeOffsetSeconds
            }))
            : undefined;
        const spectrogramPredictedPhases = channel.spectrogram && channel.spectrogram.predictedPhases
            ? channel.spectrogram.predictedPhases.map(p => ({
                ...p,
                timeSecs: p.timeSecs + timeOffsetSeconds
            }))
            : undefined;
        const spectrogramTheoreticalPhaseWindows = channel.spectrogram && channel.spectrogram.theoreticalPhaseWindows
            ? channel.spectrogram.theoreticalPhaseWindows.map(t => ({
                ...t,
                startTimeSecs: t.startTimeSecs + timeOffsetSeconds,
                endTimeSecs: t.endTimeSecs + timeOffsetSeconds
            }))
            : undefined;
        const spectrogramMarkers = channel.spectrogram && channel.spectrogram.markers
            ? buildWeavessMarkers(channel.spectrogram.markers, timeOffsetSeconds)
            : undefined;
        if (channel.spectrogram) {
            return {
                ...channel.spectrogram,
                signalDetections: spectrogramSignalDetections,
                predictedPhases: spectrogramPredictedPhases,
                theoreticalPhaseWindows: spectrogramTheoreticalPhaseWindows,
                markers: spectrogramMarkers
            };
        }
        return undefined;
    };
    /**
     * Maps the events to the real time from offset in seconds.
     *
     * @param channel
     * @param channelEvents
     */
    // eslint-disable-next-line class-methods-use-this
    mapEventsToOffset = (channel, channelEvents) => {
        if (!channel.timeOffsetSeconds) {
            return channelEvents;
        }
        const { timeOffsetSeconds } = channel;
        // TODO this is referentially unstable
        return {
            ...channelEvents,
            labelEvents: channelEvents.labelEvents ? channelEvents.labelEvents : undefined,
            events: channelEvents.events
                ? {
                    ...channelEvents.events,
                    // map the time seconds back to the original time seconds
                    onChannelClick: onChannelClickToOffset(channelEvents.events, timeOffsetSeconds),
                    onMaskCreateDragEnd: onMaskCreateDragEndToOffset(channelEvents.events, timeOffsetSeconds),
                    onMeasureWindowUpdated: onMeasureWindowUpdatedToOffset(channelEvents.events, timeOffsetSeconds),
                    onUpdateMarker: onUpdateMarkerToOffset(channelEvents.events, timeOffsetSeconds),
                    onMoveSelectionWindow: onMoveSelectionWindowToOffset(channelEvents.events, timeOffsetSeconds),
                    onUpdateSelectionWindow: onUpdateSelectionWindowToOffset(channelEvents.events, timeOffsetSeconds),
                    onClickSelectionWindow: onClickSelectionWindowToOffset(channelEvents.events, timeOffsetSeconds)
                }
                : undefined,
            onKeyPress: channelEvents.onKeyPress
        };
    };
    render() {
        // calculate and determine the individual row heights
        const { rowHeights, totalRowHeight } = this.buildRowHeights();
        const distanceUnits = this.props.station.distanceUnits
            ? this.props.station.distanceUnits
            : WeavessTypes.DistanceUnits.Degrees;
        const expanded = this.areChannelsShowing();
        return (React.createElement("div", { className: classNames({
                station: true,
                'station-split-expanded': !!this.props.station?.splitChannels,
                'station-thick-border': this.props.shouldThickenStationBorders
            }), style: {
                height: totalRowHeight,
                display: totalRowHeight === 0 ? 'none' : 'flex'
            } },
            !this.props.station.splitChannels && !!this.props.station.nonDefaultChannels ? (React.createElement("div", { className: "station-expansion-container" },
                React.createElement("div", { className: "station-expansion-button-parent" },
                    React.createElement(StationExpansionButton, { channelId: this.props.station.name, showMaskIndicator: this.props.hasQcMasks ?? false, onClick: this.expandOrCollapse, isExpanded: expanded, rowHeight: rowHeights[0] })))) : null,
            this.props.station?.defaultChannels
                ? this.createDefaultChannelElements(this.props.station.defaultChannels, rowHeights, distanceUnits, expanded, this.setDefaultChannelRef)
                : [],
            this.props.station?.splitChannels
                ? this.createNonDefaultChannelElements(this.props.station.splitChannels, rowHeights, distanceUnits, this.setSplitChannelRef, true)
                : [],
            expanded && !!this.props.station?.nonDefaultChannels
                ? this.createNonDefaultChannelElements(this.props.station.nonDefaultChannels, rowHeights, distanceUnits, this.setNonDefaultChannelRef)
                : []));
    }
}
//# sourceMappingURL=station.js.map