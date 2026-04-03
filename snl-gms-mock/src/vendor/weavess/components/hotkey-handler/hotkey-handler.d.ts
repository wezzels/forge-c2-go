import type { HotkeyConfig } from '@blueprintjs/core';
import type { HotKeysConfiguration } from '@gms/weavess-core/lib/types';
import React from 'react';
/** Zoom in on the center of the zoom interval */
export declare const ZOOM_TARGET_FRACTION = 0.5;
/**
 * Zooming in and then zooming out should return you to the same zoom interval.
 * These ratios have this effect in the zoomByPercentageToPoint function in the WeavessWaveformPanel.
 */
export declare const ZOOM_IN_RATIO = -0.5;
export declare const ZOOM_OUT_RATIO = 0.6666666667;
/**
 * The fallback percent of the screen to pan on keypress
 */
export declare const PAN25_RATIO = 0.25;
export declare const PAN75_RATIO = 0.75;
/**
 * The type of the props for the {@link HotkeyHandler} component
 */
export interface HotkeyHandlerProps {
    children: React.ReactNode;
    hotKeysConfig: HotKeysConfiguration | undefined;
    panRatio?: number;
    zoomInRatio?: number;
    zoomOutRatio?: number;
    selectedChannelIds?: string[];
    /** Callback to pan the display left/right */
    pan: (pct: number) => void;
    /** Callback to zoom the display */
    zoomByPercentageToPoint: (modPercent: number, x: number) => void;
    /** Handler function that performs the full-zoom-out operation */
    fullZoomOut: () => void;
    /** Keydown handler for creating a mask */
    createQcSegmentsKeyDown: () => void;
    /** Keyup handler for creating a mask */
    createQcSegmentsKeyUp: () => void;
    /** Scroll down so that only the last row remains in view */
    pageDown: () => void;
    /** Scroll up so that only the first row remains in view */
    pageUp: () => void;
    /** controls what hotkeys are active */
    isSplitChannelOverlayOpen: boolean;
}
/**
 * @returns Memoized {@link HotkeyConfig} array
 */
export declare function useWaveformHotkeyConfig({ hotKeysConfig, panRatio, zoomInRatio, zoomOutRatio, pan, zoomByPercentageToPoint, fullZoomOut, createQcSegmentsKeyDown, createQcSegmentsKeyUp, pageDown, pageUp, isSplitChannelOverlayOpen }: HotkeyHandlerProps): HotkeyConfig[];
/**
 * Listens for zoom hotkey changes and updates zoom via the provided function in props if zoom hotkeys are pressed.
 */
export declare function HotkeyHandler(props: HotkeyHandlerProps): React.JSX.Element;
//# sourceMappingURL=hotkey-handler.d.ts.map