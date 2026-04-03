import { WeavessTypes } from '@gms/weavess-core';
/**
 * Grabs the first Signal Detection on a channel and returns its timeSecs if not returns
 * null or undefined
 *
 * @param channel WeavessTypes.Channel
 * @returns timeSecs | null | undefined
 */
export const sortBySdForChannels = (channel) => {
    if (channel?.waveform?.signalDetections && channel?.waveform?.signalDetections.length > 0) {
        return channel?.waveform?.signalDetections[0]?.timeSecs;
    }
    return null;
};
/**
 * @returns true if the channel segments provided have data segments,
 * and if those data segments have pre-calculated boundaries.
 */
export const hasUserProvidedBoundaries = (channelSegments) => {
    if (channelSegments && channelSegments.length > 0) {
        return channelSegments.every(channelSegment => channelSegment.channelSegmentBoundary !== undefined);
    }
    return false;
};
/**
 * Searches thru each channel segment's ChannelSegmentBoundary finding the min/max amplitudes
 * Note assumes there are populated ChannelSegmentBoundary in the channelSegments (hasUserProvidedBoundaries)
 *
 * @param channelSegments
 * @returns found min/max amplitudes
 */
export const getMinMaxAmplitudes = (channelSegments) => {
    let minAmplitude = Infinity;
    let maxAmplitude = -Infinity;
    channelSegments.forEach(channelSegment => {
        if (channelSegment.channelSegmentBoundary?.bottomMax &&
            channelSegment.channelSegmentBoundary.bottomMax < minAmplitude) {
            minAmplitude = channelSegment.channelSegmentBoundary.bottomMax;
        }
        if (channelSegment.channelSegmentBoundary?.topMax &&
            channelSegment.channelSegmentBoundary.topMax > maxAmplitude) {
            maxAmplitude = channelSegment.channelSegmentBoundary.topMax;
        }
    });
    return { minAmplitude, maxAmplitude };
};
/**
 * Build the various markers
 *
 * @param markers
 * @param timeOffsetSeconds
 * @returns
 */
export const buildWeavessMarkers = (markers, timeOffsetSeconds) => {
    return {
        verticalMarkers: markers.verticalMarkers
            ? markers.verticalMarkers.map(v => ({
                ...v,
                timeSecs: v.timeSecs + timeOffsetSeconds
            }))
            : undefined,
        moveableMarkers: markers.moveableMarkers
            ? markers.moveableMarkers.map(m => ({
                ...m,
                timeSecs: m.timeSecs + timeOffsetSeconds
            }))
            : undefined,
        selectionWindows: markers.selectionWindows
            ? markers.selectionWindows.map(s => ({
                ...s,
                startMarker: {
                    ...s.startMarker,
                    timeSecs: s.startMarker.timeSecs + timeOffsetSeconds,
                    minTimeSecsConstraint: s.startMarker.minTimeSecsConstraint
                        ? s.startMarker.minTimeSecsConstraint + timeOffsetSeconds
                        : s.startMarker.minTimeSecsConstraint,
                    maxTimeSecsConstraint: s.startMarker.maxTimeSecsConstraint
                        ? s.startMarker.maxTimeSecsConstraint + timeOffsetSeconds
                        : s.startMarker.maxTimeSecsConstraint
                },
                endMarker: {
                    ...s.endMarker,
                    timeSecs: s.endMarker.timeSecs + timeOffsetSeconds,
                    minTimeSecsConstraint: s.endMarker.minTimeSecsConstraint
                        ? s.endMarker.minTimeSecsConstraint + timeOffsetSeconds
                        : s.endMarker.minTimeSecsConstraint,
                    maxTimeSecsConstraint: s.endMarker.maxTimeSecsConstraint
                        ? s.endMarker.maxTimeSecsConstraint + timeOffsetSeconds
                        : s.endMarker.maxTimeSecsConstraint
                }
            }))
            : undefined
    };
};
/**
 * Returns onChannelClick with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onChannelClick function
 */
export const onChannelClickToOffset = (events, timeOffsetSeconds) => {
    return events && events.onChannelClick
        ? (e, channel, timeSecs) => {
            if (events && events.onChannelClick) {
                events.onChannelClick(e, channel, timeSecs - timeOffsetSeconds);
            }
        }
        : undefined;
};
/**
 * Returns onMaskCreateDragEnd with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onMaskCreateDragEnd function
 */
export const onMaskCreateDragEndToOffset = (events, timeOffsetSeconds) => {
    return events && events.onMaskCreateDragEnd
        ? (selectedStationIds, startTimeSecs, endTimeSecs) => {
            if (events && events.onMaskCreateDragEnd) {
                events.onMaskCreateDragEnd(selectedStationIds, startTimeSecs - timeOffsetSeconds, endTimeSecs - timeOffsetSeconds);
            }
        }
        : undefined;
};
/**
 * Returns onMeasureWindowUpdated with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onMeasureWindowUpdated function
 */
export const onMeasureWindowUpdatedToOffset = (events, timeOffsetSeconds) => {
    return events && events.onMeasureWindowUpdated
        ? (isVisible, channelId, startTimeSecs, endTimeSecs, heightPx) => {
            if (events && events.onMeasureWindowUpdated) {
                events.onMeasureWindowUpdated(isVisible, channelId, startTimeSecs ? startTimeSecs - timeOffsetSeconds : undefined, endTimeSecs ? endTimeSecs - timeOffsetSeconds : undefined, heightPx);
            }
        }
        : undefined;
};
/**
 * Returns onUpdateMarker with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onUpdateMarker function
 */
export const onUpdateMarkerToOffset = (events, timeOffsetSeconds) => {
    return events && events.onUpdateMarker
        ? (channelId, marker) => {
            if (events && events.onUpdateMarker) {
                events.onUpdateMarker(channelId, {
                    ...marker,
                    timeSecs: marker?.timeSecs ? marker.timeSecs - timeOffsetSeconds : NaN
                });
            }
        }
        : undefined;
};
/**
 * Build start/end marker
 *
 * @param marker
 * @param timeOffsetSeconds
 * @returns marker
 */
const buildMarker = (marker, timeOffsetSeconds) => {
    return {
        ...marker,
        timeSecs: marker.timeSecs - timeOffsetSeconds,
        minTimeSecsConstraint: marker.minTimeSecsConstraint
            ? marker.minTimeSecsConstraint - timeOffsetSeconds
            : marker.minTimeSecsConstraint,
        maxTimeSecsConstraint: marker.maxTimeSecsConstraint
            ? marker.maxTimeSecsConstraint - timeOffsetSeconds
            : marker.maxTimeSecsConstraint
    };
};
/**
 * Build the selection window
 *
 * @param s SelectionWindow
 * @param timeOffsetSeconds
 * @returns selection window
 */
const buildSelectionWindow = (s, timeOffsetSeconds) => {
    return {
        ...s,
        startMarker: buildMarker(s.startMarker, timeOffsetSeconds),
        endMarker: buildMarker(s.endMarker, timeOffsetSeconds)
    };
};
/**
 * Returns onMoveSelectionWindow with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onMoveSelectionWindow function
 */
export const onMoveSelectionWindowToOffset = (events, timeOffsetSeconds) => {
    if (!events?.onMoveSelectionWindow) {
        return undefined;
    }
    return (channelId, s) => {
        if (events.onMoveSelectionWindow) {
            events.onMoveSelectionWindow(channelId, buildSelectionWindow(s, timeOffsetSeconds));
        }
    };
};
/**
 * Returns onUpdateSelectionWindow with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onUpdateSelectionWindow function
 */
export const onUpdateSelectionWindowToOffset = (events, timeOffsetSeconds) => {
    if (!events || !events.onUpdateSelectionWindow) {
        return undefined;
    }
    return (channelId, s) => {
        if (events.onUpdateSelectionWindow) {
            events.onUpdateSelectionWindow(channelId, buildSelectionWindow(s, timeOffsetSeconds));
        }
    };
};
/**
 * Returns onClickSelectionWindow with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onClickSelectionWindow function
 */
export const onClickSelectionWindowToOffset = (events, timeOffsetSeconds) => {
    if (!events || !events.onClickSelectionWindow) {
        return undefined;
    }
    return (channelId, s, timeSecs) => {
        if (events.onClickSelectionWindow) {
            events.onClickSelectionWindow(channelId, buildSelectionWindow(s, timeOffsetSeconds), timeSecs - timeOffsetSeconds);
        }
    };
};
/**
 * Find the start and end time for a given data segment
 *
 * @param dataSegment The data segment to find a time for
 * @returns the time range for the given segment
 */
export const findDataSegmentTimeRange = (dataSegment) => {
    if (WeavessTypes.isDataByTime(dataSegment.data)) {
        if (WeavessTypes.isFloat32Array(dataSegment.data.values)) {
            return {
                startTimeSecs: dataSegment.data.values[0],
                endTimeSecs: dataSegment.data.values[dataSegment.data.values.length - 2]
            };
        }
        return {
            startTimeSecs: dataSegment.data.values[0].timeSecs,
            endTimeSecs: dataSegment.data.values[dataSegment.data.values.length - 1].timeSecs
        };
    }
    if (WeavessTypes.isDataBySampleRate(dataSegment.data) ||
        WeavessTypes.isDataClaimCheck(dataSegment.data)) {
        return {
            startTimeSecs: dataSegment.data.startTimeSecs,
            endTimeSecs: dataSegment.data.endTimeSecs
        };
    }
    return undefined;
};
//# sourceMappingURL=utils.js.map