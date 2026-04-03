import * as React from 'react';
import { MeasureWindowSelectionListener } from '../../../measure-window/measure-window-selection';
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
export function useDescription(channel, channelSegments) {
    const [isError, setIsError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(undefined);
    const setError = React.useCallback((isE, msg) => {
        setIsError(isE);
        setErrorMessage(msg);
    }, []);
    return React.useMemo(() => {
        if (isError) {
            return {
                setError,
                description: {
                    message: typeof channel.description === 'string'
                        ? channel.description
                        : channel?.description?.message,
                    tooltipMessage: isError ? errorMessage ?? 'Filtering operation failed' : undefined
                }
            };
        }
        if (channel.description) {
            return { setError, description: channel.description };
        }
        if (channelSegments.every(cs => cs.description === channelSegments[0]?.description)) {
            return { setError, description: channelSegments[0]?.description };
        }
        if (channelSegments.find(cs => cs.description != null)) {
            return { setError, description: 'mixed' };
        }
        return {
            setError,
            description: undefined
        };
    }, [channel.description, channelSegments, errorMessage, isError, setError]);
}
/**
 * Renders the waveform content for the channel, including the measure window
 * selection listener, the ContentRenderer, and the waveform renderer
 */
export function InternalChannelWaveformRenderer({ canvasRef, channel, channelSegments, contentRenderMouseDown, converters, displayInterval, viewableInterval, offsetSecs, events, getBoundaries, getContentRenderer, getPositionBuffer, getSignalDetections, getZoomRatio, glMax, glMin, height, initialConfiguration, isDefaultChannel, isMeasureWindow, isMeasureWindowEnabled, isSplitChannelOverlayOpen, isSplitStation, activeSplitModeType, labelWidthPx, msrWindowWaveformAmplitudeScaleFactor, numberOfRenderers, splitModePickMarkerColor, onMouseMove, onWaveformContextMenu, onKeyDown, onWaveformMouseUp, renderWaveforms, setWaveformContainerRef, setWaveformContentRendererRef, setWaveformRendererRef, setWaveformYAxisBounds, splitChannelRefs, stationId, toast, updateMeasureWindow, updateMeasureWindowPanel, waveform, initialMeasureWindowSelection }) {
    const { description, setError } = useDescription(channel, channelSegments);
    const onSetAmplitude = React.useCallback((channelId, channelSegmentBounds, measureWindow) => {
        return events?.onSetAmplitude
            ? events?.onSetAmplitude(channelId, channelSegmentBounds, measureWindow)
            : undefined;
    }, [events]);
    const renderMeasureWindowSelectionChildren = React.useCallback(({ contentRenderer, onMouseDown }) => {
        return (React.createElement("div", { className: "channel-content-container", 
            /* Using channel.name reduces unnecessary unmounts in the case of filtering
            since the channelSegmentId's will change in the case of filtering */
            key: `channel-segment-${channel.name}`, ref: setWaveformContainerRef, style: {
                height: `${height / numberOfRenderers}px`,
                width: `calc(100% - ${labelWidthPx}px)`,
                left: `${labelWidthPx}px`
            } },
            React.createElement(ContentRenderer, { ref: setWaveformContentRendererRef, canvasRef: canvasRef, isSplitStation: isSplitStation, splitModePickMarkerColor: splitModePickMarkerColor, converters: converters, displayInterval: displayInterval, viewableInterval: viewableInterval, offsetSecs: offsetSecs, initialConfiguration: initialConfiguration, isDefaultChannel: isDefaultChannel, renderWaveforms: renderWaveforms, stationId: stationId, getZoomRatio: getZoomRatio, updateMeasureWindow: updateMeasureWindow, contentRenderers: getContentRenderer(contentRenderer), isSplitChannelOverlayOpen: isSplitChannelOverlayOpen, activeSplitModeType: activeSplitModeType, splitChannelPhase: channel.splitChannelPhase, channelId: channel.id, isChannelSelected: channel.isSelected, description: description, descriptionLabelColor: channelSegments[0]?.descriptionLabelColor, signalDetections: getSignalDetections(waveform.signalDetections || []), predictedPhases: waveform?.predictedPhases, theoreticalPhaseWindows: waveform?.theoreticalPhaseWindows, markers: waveform?.markers, events: events?.events, onContextMenu: onWaveformContextMenu, onMouseMove: onMouseMove, onMouseDown: contentRenderMouseDown(onMouseDown), onMouseUp: onWaveformMouseUp, onKeyDown: onKeyDown }),
            React.createElement(WaveformRenderer, { ref: setWaveformRendererRef, displayInterval: displayInterval, viewableInterval: viewableInterval, glMax: glMax, glMin: glMin, onSetAmplitude: onSetAmplitude, renderWaveforms: renderWaveforms, initialConfiguration: initialConfiguration, getPositionBuffer: getPositionBuffer, getBoundaries: getBoundaries, channelName: channel.id, defaultRange: channel.defaultRange, filterId: waveform.channelSegmentId ?? '', channelSegmentsRecord: waveform.channelSegmentsRecord ?? {}, masks: waveform?.masks, setYAxisBounds: setWaveformYAxisBounds, msrWindowWaveformAmplitudeScaleFactor: msrWindowWaveformAmplitudeScaleFactor, isMeasureWindow: isMeasureWindow, channelOffset: channel.timeOffsetSeconds, setError: setError, splitChannelRefs: splitChannelRefs, isSplitChannelOverlayOpen: isSplitChannelOverlayOpen, isAutoDimmed: waveform.isAutoDimmed })));
    }, [
        channel.name,
        channel.splitChannelPhase,
        channel.id,
        channel.isSelected,
        channel.defaultRange,
        channel.timeOffsetSeconds,
        setWaveformContainerRef,
        height,
        numberOfRenderers,
        labelWidthPx,
        setWaveformContentRendererRef,
        canvasRef,
        isSplitStation,
        splitModePickMarkerColor,
        converters,
        displayInterval,
        viewableInterval,
        offsetSecs,
        initialConfiguration,
        isDefaultChannel,
        renderWaveforms,
        stationId,
        getZoomRatio,
        updateMeasureWindow,
        getContentRenderer,
        isSplitChannelOverlayOpen,
        activeSplitModeType,
        description,
        channelSegments,
        getSignalDetections,
        waveform.signalDetections,
        waveform?.predictedPhases,
        waveform?.theoreticalPhaseWindows,
        waveform?.markers,
        waveform.channelSegmentId,
        waveform.channelSegmentsRecord,
        waveform?.masks,
        waveform.isAutoDimmed,
        events?.events,
        onWaveformContextMenu,
        onMouseMove,
        contentRenderMouseDown,
        onWaveformMouseUp,
        onKeyDown,
        setWaveformRendererRef,
        glMax,
        glMin,
        onSetAmplitude,
        getPositionBuffer,
        getBoundaries,
        setWaveformYAxisBounds,
        msrWindowWaveformAmplitudeScaleFactor,
        isMeasureWindow,
        setError,
        splitChannelRefs
    ]);
    if (!waveform) {
        return null;
    }
    return (React.createElement(MeasureWindowSelectionListener, { displayInterval: displayInterval, offsetSecs: channel.timeOffsetSeconds, hotKeys: initialConfiguration.hotKeys, isMeasureWindowEnabled: isMeasureWindowEnabled, computeTimeSecsFromMouseXPixels: converters.computeTimeSecsFromMouseXPixels, toast: toast, updateMeasureWindowPanel: updateMeasureWindowPanel, disabled: isSplitChannelOverlayOpen, initialSelectionInterval: initialMeasureWindowSelection }, renderMeasureWindowSelectionChildren));
}
export const ChannelWaveformRenderer = React.memo(InternalChannelWaveformRenderer);
//# sourceMappingURL=channel-waveform-renderer.js.map