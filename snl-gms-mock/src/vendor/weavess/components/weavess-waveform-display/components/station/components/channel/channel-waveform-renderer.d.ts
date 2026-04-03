import type { WeavessTypes } from '@gms/weavess-core';
import * as React from 'react';
import type { PositionConverters } from '../../../../../../util/types';
import type { AnimationFrameOptions, updateMeasureWindow as updateMeasureWindowFunction } from '../../../../types';
import type { Channel } from './channel';
import { ContentRenderer } from './components/content-renderer/content-renderer';
import { WaveformRenderer } from './components/waveform-renderer/waveform-renderer';
/**
 * returns an object containing a description that should be displayed in the bottom right corner of the channel row,
 * along with setError to set isError: boolean, and errorMessage: string.
 *
 * If isError == true, description will be the error message, and a hover tooltip with additional error info will be added
 * If the channel already has a description, use that.
 * If all channel segments share a description, use that.
 * If channel segments have multiple descriptions, use 'mixed' as the description
 * and finally, uses undefined if there are no descriptions and there is no error.
 */
export declare function useDescription(channel: WeavessTypes.Channel, channelSegments: WeavessTypes.ChannelSegment[]): {
    setError: (isError: boolean, errorMessage?: string | undefined) => void;
    description: string | WeavessTypes.ChannelDescription | undefined;
};
/**
 * The type of the props for the {@link ChannelWaveformRenderer} component
 */
export interface ChannelWaveformRendererProps {
    canvasRef: () => HTMLCanvasElement | null;
    channel: WeavessTypes.Channel;
    channelSegments: WeavessTypes.ChannelSegment[];
    contentRenderMouseDown: any;
    converters: PositionConverters;
    /** viewable interval plus its min/max offsets; full amount of data window */
    displayInterval: WeavessTypes.TimeRange;
    /** viewable time interval, the amount of data initially loaded into weavess (excluding offsets) */
    viewableInterval: WeavessTypes.TimeRange;
    offsetSecs: number;
    events: WeavessTypes.ChannelEvents | undefined;
    getBoundaries: ((channelName: string, channelSegment?: WeavessTypes.ChannelSegment, timeRange?: WeavessTypes.TimeRange) => Promise<WeavessTypes.ChannelSegmentBoundary | undefined>) | undefined;
    getContentRenderer: (this: any, contentRenderer: any) => any[];
    getPositionBuffer: ((id: string, startTime: number, endTime: number, domainTimeRange: WeavessTypes.TimeRange) => Promise<Float32Array>) | undefined;
    getSignalDetections: (signalDetections: WeavessTypes.PickMarker[]) => WeavessTypes.PickMarker[];
    getZoomRatio: () => number;
    glMax: number;
    glMin: number;
    height: number;
    initialConfiguration: WeavessTypes.Configuration;
    isDefaultChannel: boolean;
    isMeasureWindow: boolean;
    splitModePickMarkerColor?: string;
    isMeasureWindowEnabled: () => boolean;
    isSplitChannelOverlayOpen: boolean;
    isSplitStation?: boolean;
    activeSplitModeType?: WeavessTypes.SplitMode;
    labelWidthPx: number;
    msrWindowWaveformAmplitudeScaleFactor?: {
        top: number;
        bottom: number;
    };
    numberOfRenderers: number;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onWaveformContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onWaveformMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
    renderWaveforms: (options?: AnimationFrameOptions) => void;
    setWaveformContainerRef: (ref: HTMLDivElement) => void;
    setWaveformContentRendererRef: (ref: ContentRenderer) => void;
    setWaveformRendererRef: (ref: WaveformRenderer) => void;
    setWaveformYAxisBounds: (min: number | undefined, max: number | undefined) => void;
    splitChannelRefs: {
        [id: string]: Channel | null;
    };
    stationId: string;
    toast: (message: string) => void;
    updateMeasureWindow: updateMeasureWindowFunction | undefined;
    updateMeasureWindowPanel: (timeRange: WeavessTypes.TimeRange, removeMeasureWindowSelection: () => void) => void;
    waveform: WeavessTypes.ChannelWaveformContent;
    initialMeasureWindowSelection?: WeavessTypes.TimeRange;
}
/**
 * Renders the waveform content for the channel, including the measure window
 * selection listener, the ContentRenderer, and the waveform renderer
 */
export declare function InternalChannelWaveformRenderer({ canvasRef, channel, channelSegments, contentRenderMouseDown, converters, displayInterval, viewableInterval, offsetSecs, events, getBoundaries, getContentRenderer, getPositionBuffer, getSignalDetections, getZoomRatio, glMax, glMin, height, initialConfiguration, isDefaultChannel, isMeasureWindow, isMeasureWindowEnabled, isSplitChannelOverlayOpen, isSplitStation, activeSplitModeType, labelWidthPx, msrWindowWaveformAmplitudeScaleFactor, numberOfRenderers, splitModePickMarkerColor, onMouseMove, onWaveformContextMenu, onKeyDown, onWaveformMouseUp, renderWaveforms, setWaveformContainerRef, setWaveformContentRendererRef, setWaveformRendererRef, setWaveformYAxisBounds, splitChannelRefs, stationId, toast, updateMeasureWindow, updateMeasureWindowPanel, waveform, initialMeasureWindowSelection }: ChannelWaveformRendererProps): React.JSX.Element | null;
export declare const ChannelWaveformRenderer: React.MemoExoticComponent<typeof InternalChannelWaveformRenderer>;
//# sourceMappingURL=channel-waveform-renderer.d.ts.map