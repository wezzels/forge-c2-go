import type { WeavessTypes } from '@gms/weavess-core';
/**
 * Sets up event listeners to handle mouseup and mousemove events. These listeners handle
 * drawing the measure window selection range on the waveform display.
 */
export declare const attachMeasureWindowSelectionListeners: (startClientX: number, displayInterval: WeavessTypes.TimeRange, offsetSecs: number, computeTimeSecsFromMouseXPixels: (timeSecs: number) => number, updateMeasureWindowSelectionTimeRange: (range: WeavessTypes.TimeRange) => void, updateMeasureWindow: (timeRange: WeavessTypes.TimeRange) => void, setDragging: (isDragging: boolean) => void) => {
    onMouseMove: (event: MouseEvent) => void;
    onMouseUp: (event: MouseEvent) => void;
};
//# sourceMappingURL=measure-window-mouse-handlers.d.ts.map