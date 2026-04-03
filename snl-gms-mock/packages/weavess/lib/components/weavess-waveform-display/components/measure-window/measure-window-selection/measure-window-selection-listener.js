import { HotkeyListener } from '@gms/ui-util';
import { WeavessMessages } from '@gms/weavess-core';
import { getKeyboardShortcutCombos } from '@gms/weavess-core/lib/util';
import * as React from 'react';
import { getMeasureWindowSelectionAreaFraction } from '../../../../../util/position-util';
import { attachMeasureWindowSelectionListeners } from './measure-window-mouse-handlers';
import { MeasureWindowSelectionArea } from './measure-window-selection-area';
export const InternalMeasureWindowSelectionListener = ({ displayInterval, offsetSecs, isMeasureWindowEnabled, children, toast, updateMeasureWindowPanel, computeTimeSecsFromMouseXPixels, hotKeys, disabled, initialSelectionInterval }) => {
    HotkeyListener.useGlobalHotkeyListener();
    const [stateTimeRange, setSelectionTimeRange] = React.useState(undefined);
    const selectionTimeRange = stateTimeRange || initialSelectionInterval;
    const [isMouseDragging, setIsMouseDragging] = React.useState(false);
    const { current: cleanupCallbacks } = React.useRef([]);
    React.useEffect(() => {
        return () => {
            cleanupCallbacks.forEach(callback => callback());
        };
    }, [cleanupCallbacks]);
    const removeMeasureWindowSelection = React.useCallback(() => {
        setSelectionTimeRange(undefined);
    }, [setSelectionTimeRange]);
    const onMouseDown = React.useCallback((e) => {
        if (!disabled &&
            HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(hotKeys?.drawMeasureWindow))) {
            e.stopPropagation();
            if (!isMeasureWindowEnabled()) {
                toast(WeavessMessages.measureWindowDisabled);
            }
            else {
                const startClientX = e.clientX;
                const { onMouseMove, onMouseUp } = attachMeasureWindowSelectionListeners(startClientX, displayInterval, offsetSecs ?? 0, computeTimeSecsFromMouseXPixels, setSelectionTimeRange, timeRange => updateMeasureWindowPanel(timeRange, removeMeasureWindowSelection), setIsMouseDragging);
                cleanupCallbacks.push(() => {
                    document.body.removeEventListener('mousemove', onMouseMove);
                    document.body.removeEventListener('mouseup', onMouseUp);
                });
            }
        }
    }, [
        disabled,
        hotKeys?.drawMeasureWindow,
        isMeasureWindowEnabled,
        toast,
        displayInterval,
        offsetSecs,
        computeTimeSecsFromMouseXPixels,
        cleanupCallbacks,
        updateMeasureWindowPanel,
        removeMeasureWindowSelection
    ]);
    /**
     * onMeasureWindowClick event handler
     * @param e The mouse event
     */
    const onMeasureWindowClick = React.useCallback((e) => {
        if (disabled ||
            e.button === 2 ||
            e.shiftKey ||
            e.ctrlKey ||
            e.metaKey ||
            HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(hotKeys?.scaleWaveformAmplitude)) ||
            !selectionTimeRange) {
            return;
        }
        const startClientX = e.clientX;
        const measureWindowAreaDuration = selectionTimeRange.endTimeSecs - selectionTimeRange.startTimeSecs;
        let isDragging = false;
        const calculateTimeRange = (clientX) => {
            const currentMouseTimeSecs = computeTimeSecsFromMouseXPixels(clientX);
            const startMouseTimeSecs = computeTimeSecsFromMouseXPixels(startClientX);
            const timeDiffSecs = currentMouseTimeSecs - startMouseTimeSecs;
            let startTimeSecs = selectionTimeRange.startTimeSecs + timeDiffSecs;
            let endTimeSecs = selectionTimeRange.endTimeSecs + timeDiffSecs;
            // Clamp the time range to be bounded by the max and min start and end times
            if (startTimeSecs < displayInterval.startTimeSecs) {
                startTimeSecs = displayInterval.startTimeSecs;
                endTimeSecs = startTimeSecs + measureWindowAreaDuration;
            }
            if (endTimeSecs > displayInterval.endTimeSecs) {
                endTimeSecs = displayInterval.endTimeSecs;
                startTimeSecs = endTimeSecs - measureWindowAreaDuration;
            }
            return { startTimeSecs, endTimeSecs };
        };
        const onMouseMove = (event) => {
            const diff = Math.abs(startClientX - event.clientX);
            // begin drag if moving more than 1 pixel
            if (diff > 1 && !isDragging) {
                isDragging = true;
            }
            const newTimeRange = calculateTimeRange(event.clientX);
            if (isDragging) {
                setIsMouseDragging(isDragging);
                setSelectionTimeRange(newTimeRange);
            }
        };
        const onMouseUp = (event) => {
            isDragging = false;
            setIsMouseDragging(isDragging);
            const newTimeRange = calculateTimeRange(event.clientX);
            updateMeasureWindowPanel(newTimeRange, removeMeasureWindowSelection);
            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseup', onMouseUp);
        };
        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);
    }, [
        computeTimeSecsFromMouseXPixels,
        disabled,
        displayInterval.endTimeSecs,
        displayInterval.startTimeSecs,
        hotKeys?.scaleWaveformAmplitude,
        removeMeasureWindowSelection,
        selectionTimeRange,
        updateMeasureWindowPanel
    ]);
    const MeasureWindowSelection = React.useMemo(() => (React.createElement(MeasureWindowSelectionArea, { position: getMeasureWindowSelectionAreaFraction(selectionTimeRange, displayInterval.startTimeSecs, displayInterval.endTimeSecs, offsetSecs ?? 0), isDragging: isMouseDragging, onClick: onMeasureWindowClick })), [
        displayInterval.endTimeSecs,
        displayInterval.startTimeSecs,
        isMouseDragging,
        offsetSecs,
        onMeasureWindowClick,
        selectionTimeRange
    ]);
    return children({
        contentRenderer: MeasureWindowSelection,
        onMouseDown
    });
};
export const MeasureWindowSelectionListener = React.memo(InternalMeasureWindowSelectionListener);
//# sourceMappingURL=measure-window-selection-listener.js.map