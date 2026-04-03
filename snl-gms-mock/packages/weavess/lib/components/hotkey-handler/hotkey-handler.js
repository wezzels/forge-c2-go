import { useHotkeys } from '@blueprintjs/core';
import React from 'react';
/** Zoom in on the center of the zoom interval */
export const ZOOM_TARGET_FRACTION = 0.5;
/**
 * Zooming in and then zooming out should return you to the same zoom interval.
 * These ratios have this effect in the zoomByPercentageToPoint function in the WeavessWaveformPanel.
 */
export const ZOOM_IN_RATIO = -0.5;
export const ZOOM_OUT_RATIO = 0.6666666667;
/**
 * The fallback percent of the screen to pan on keypress
 */
export const PAN25_RATIO = 0.25;
export const PAN75_RATIO = 0.75;
/**
 *  Converts a hotkey config record into a blueprint {@link HotkeyConfig} array
 *
 * @param config UI Processing config hotkey record
 * @param onKeyDown Hotkey function
 * @param onKeyUp Hotkey function
 * @param disabled flag to disable the hotkey - defaults to false
 * @param global flag to make the hotkey global - defaults to false
 * @returns
 */
function buildBlueprintHotkeyConfigArray(config, onKeyDown, onKeyUp, disabled = false, global = false) {
    const blueprintConfigArray = [];
    if (config) {
        config.combos.forEach(hotkeyCombo => blueprintConfigArray.push({
            combo: hotkeyCombo,
            group: config.category,
            label: config.description,
            onKeyDown,
            onKeyUp,
            disabled,
            global
        }));
    }
    return blueprintConfigArray;
}
/**
 * @returns Memoized {@link HotkeyConfig} array
 */
export function useWaveformHotkeyConfig({ hotKeysConfig, panRatio, zoomInRatio, zoomOutRatio, pan, zoomByPercentageToPoint, fullZoomOut, createQcSegmentsKeyDown, createQcSegmentsKeyUp, pageDown, pageUp, isSplitChannelOverlayOpen }) {
    const doNothing = () => null;
    return React.useMemo(() => {
        if (hotKeysConfig == null) {
            return [];
        }
        return [
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.zoomOutFully, e => {
                // Prevent space bar from scrolling the window down
                e.preventDefault();
                fullZoomOut();
            }),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.zoomInOneStep, () => zoomByPercentageToPoint(zoomInRatio ?? ZOOM_IN_RATIO, ZOOM_TARGET_FRACTION), doNothing),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.zoomOutOneStep, () => zoomByPercentageToPoint(zoomOutRatio ?? ZOOM_OUT_RATIO, ZOOM_TARGET_FRACTION), doNothing),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig?.pageDown ?? { combos: ['shift+s'] }, () => pageDown(), doNothing, isSplitChannelOverlayOpen),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig?.pageUp ?? { combos: ['shift+w'] }, () => pageUp(), doNothing, isSplitChannelOverlayOpen),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.panLeft25, e => {
                e.preventDefault();
                pan(panRatio != null ? -1 * panRatio : -1 * PAN25_RATIO);
            }),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.panRight25, e => {
                e.preventDefault();
                pan(panRatio ?? PAN25_RATIO);
            }),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.panLeft75, e => {
                e.preventDefault();
                pan(-1 * PAN75_RATIO);
            }),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.panRight75, e => {
                e.preventDefault();
                pan(PAN75_RATIO);
            }),
            ...buildBlueprintHotkeyConfigArray(hotKeysConfig.createQcSegments, createQcSegmentsKeyDown, createQcSegmentsKeyUp, isSplitChannelOverlayOpen)
        ];
    }, [
        hotKeysConfig,
        isSplitChannelOverlayOpen,
        createQcSegmentsKeyDown,
        createQcSegmentsKeyUp,
        fullZoomOut,
        zoomByPercentageToPoint,
        zoomInRatio,
        zoomOutRatio,
        pageDown,
        pageUp,
        pan,
        panRatio
    ]);
}
/**
 * Listens for zoom hotkey changes and updates zoom via the provided function in props if zoom hotkeys are pressed.
 */
export function HotkeyHandler(props) {
    const blueprintConfig = useWaveformHotkeyConfig(props);
    const { handleKeyDown, handleKeyUp } = useHotkeys(blueprintConfig);
    const { children } = props;
    return (React.createElement("div", { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp, "data-testid": "hotkey-handler", className: "weavess-hotkey-handler", role: "tab", tabIndex: -1 }, children));
}
//# sourceMappingURL=hotkey-handler.js.map