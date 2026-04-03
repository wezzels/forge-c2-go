import type { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import { SelectionWindow } from './selection-window';
/**
 * Utility for creating vertical marker elements
 *
 * @param startTimeSecs the start time in seconds for the data
 * @param endTimeSecs the end time in seconds for the data
 * @param verticalMarkers the vertical markers
 */
export declare const createVerticalMarkers: (startTimeSecs: number, endTimeSecs: number, verticalMarkers: WeavessTypes.Marker[] | undefined) => JSX.Element[];
/**
 * Utility for creating moveable marker elements.
 *
 * @param startTimeSecs the start time in seconds for the data
 * @param endTimeSecs the end time in seconds for the data
 * @param moveableMarkers the moveable markers
 * @param zoomInterval current waveform interval displayed
 * @param containerClientWidth provides the container client width
 * @param viewportClientWidth provides the viewport client width
 * @param updateMarkers event to be invoked on update
 * @param onUpdateMarker
 * @param labelWidthPx offset provided for calculating location
 */
export declare const createMoveableMarkers: ({ startTimeSecs, endTimeSecs, moveableMarkers, getZoomRatio, containerClientWidth, viewportClientWidth, onUpdateMarker, labelWidthPx }: {
    startTimeSecs: number;
    endTimeSecs: number;
    moveableMarkers: WeavessTypes.Marker[] | undefined;
    getZoomRatio: () => number;
    containerClientWidth: () => number;
    viewportClientWidth: () => number;
    onUpdateMarker?: ((marker: WeavessTypes.Marker) => void) | undefined;
    labelWidthPx: number;
}) => JSX.Element[];
/**
 * Utility for creating selection window elements.
 *
 * @param startTimeSecs the start time in seconds for the data
 * @param endTimeSecs the end time in seconds for the data
 * @param selectionWindows the selection windows
 * @param zoomInterval current waveform interval displayed
 * @param canvasRef provides the canvas reference
 * @param containerClientWidth provides the container client width
 * @param viewportClientWidth provides the viewport client width
 * @param computeTimeSecsForMouseXPosition computes the time in seconds for the mouse x position.
 * @param onMouseMove event to be invoked on mouse move
 * @param onMouseDown event to be invoked on mouse move
 * @param onMouseUp event to be invoked on mouse move
 * @param onMoveSelectionWindow event handler for invoked while the selection is moving
 * @param onUpdateSelectionWindow event handler for updating selections value
 * @param onClickSelectionWindow event handler for click events within a selection
 * @param labelWidthPx offset provided for calculating location
 */
export declare const createSelectionWindowMarkers: ({ startTimeSecs, endTimeSecs, selectionWindows, getZoomRatio, canvasRef, containerClientWidth, viewportClientWidth, computeTimeSecsForMouseXPosition, onMouseMove, onMouseDown, onMouseUp, onMoveSelectionWindow, onUpdateSelectionWindow, onClickSelectionWindow, labelWidthPx }: {
    startTimeSecs: number;
    endTimeSecs: number;
    selectionWindows: WeavessTypes.SelectionWindow[] | undefined;
    getZoomRatio: () => number;
    canvasRef: () => HTMLCanvasElement | null;
    containerClientWidth: () => number;
    viewportClientWidth: () => number;
    computeTimeSecsForMouseXPosition: (mouseXPosition: number) => number;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMoveSelectionWindow?: ((selection: WeavessTypes.SelectionWindow) => void) | undefined;
    onUpdateSelectionWindow?: ((selection: WeavessTypes.SelectionWindow) => void) | undefined;
    onClickSelectionWindow?: ((selection: WeavessTypes.SelectionWindow, timeSecs: number) => void) | undefined;
    labelWidthPx: number;
}) => JSX.Element[];
/**
 * A memoized function for creating the vertical markers.
 * The memoization function caches the results using
 * the most recent argument and returns the results.
 *
 * @returns an array JSX elements
 */
export declare const memoizedCreateVerticalMarkers: import("memoize-one").MemoizedFn<(startTimeSecs: number, endTimeSecs: number, verticalMarkers: WeavessTypes.Marker[] | undefined) => JSX.Element[]>;
//# sourceMappingURL=create-marker-util.d.ts.map