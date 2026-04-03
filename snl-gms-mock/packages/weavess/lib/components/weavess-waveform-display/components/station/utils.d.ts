import { WeavessTypes } from '@gms/weavess-core';
/**
 * Grabs the first Signal Detection on a channel and returns its timeSecs if not returns
 * null or undefined
 *
 * @param channel WeavessTypes.Channel
 * @returns timeSecs | null | undefined
 */
export declare const sortBySdForChannels: (channel: WeavessTypes.Channel) => number | null | undefined;
/**
 * @returns true if the channel segments provided have data segments,
 * and if those data segments have pre-calculated boundaries.
 */
export declare const hasUserProvidedBoundaries: (channelSegments: WeavessTypes.ChannelSegment[]) => boolean;
/**
 * Searches thru each channel segment's ChannelSegmentBoundary finding the min/max amplitudes
 * Note assumes there are populated ChannelSegmentBoundary in the channelSegments (hasUserProvidedBoundaries)
 *
 * @param channelSegments
 * @returns found min/max amplitudes
 */
export declare const getMinMaxAmplitudes: (channelSegments: WeavessTypes.ChannelSegment[]) => {
    minAmplitude: number;
    maxAmplitude: number;
};
/**
 * Build the various markers
 *
 * @param markers
 * @param timeOffsetSeconds
 * @returns
 */
export declare const buildWeavessMarkers: (markers: WeavessTypes.Markers, timeOffsetSeconds: number) => WeavessTypes.Markers;
/**
 * Returns onChannelClick with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onChannelClick function
 */
export declare const onChannelClickToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((e: React.MouseEvent<HTMLDivElement>, channel: WeavessTypes.Channel, timeSecs: number) => void) | undefined;
/**
 * Returns onMaskCreateDragEnd with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onMaskCreateDragEnd function
 */
export declare const onMaskCreateDragEndToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((selectedStationIds: string[], startTimeSecs: number, endTimeSecs: number) => void) | undefined;
/**
 * Returns onMeasureWindowUpdated with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onMeasureWindowUpdated function
 */
export declare const onMeasureWindowUpdatedToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((isVisible: boolean, channelId?: string, startTimeSecs?: number, endTimeSecs?: number, heightPx?: number) => void) | undefined;
/**
 * Returns onUpdateMarker with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onUpdateMarker function
 */
export declare const onUpdateMarkerToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((channelId: string, marker: WeavessTypes.Marker) => void) | undefined;
/**
 * Returns onMoveSelectionWindow with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onMoveSelectionWindow function
 */
export declare const onMoveSelectionWindowToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((channelId: string, s: WeavessTypes.SelectionWindow) => void) | undefined;
/**
 * Returns onUpdateSelectionWindow with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onUpdateSelectionWindow function
 */
export declare const onUpdateSelectionWindowToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((channelId: string, s: WeavessTypes.SelectionWindow) => void) | undefined;
/**
 * Returns onClickSelectionWindow with offset in seconds
 *
 * @param events
 * @param timeOffsetSeconds
 * @returns onClickSelectionWindow function
 */
export declare const onClickSelectionWindowToOffset: (events: WeavessTypes.ChannelContentEvents, timeOffsetSeconds: number) => ((channelId: string, s: WeavessTypes.SelectionWindow, timeSecs: number) => void) | undefined;
/**
 * Find the start and end time for a given data segment
 *
 * @param dataSegment The data segment to find a time for
 * @returns the time range for the given segment
 */
export declare const findDataSegmentTimeRange: (dataSegment: WeavessTypes.DataSegment) => WeavessTypes.TimeRange | undefined;
//# sourceMappingURL=utils.d.ts.map