import { deepEqual } from 'fast-equals';
import memoizeOne from 'memoize-one';
import React from 'react';
import { calculateLeftPercent } from '../../utils';
import { MoveableMarker } from './moveable-marker';
import { SelectionWindow } from './selection-window';
import { VerticalMarker } from './vertical-marker';
/**
 * Utility for creating vertical marker elements
 *
 * @param startTimeSecs the start time in seconds for the data
 * @param endTimeSecs the end time in seconds for the data
 * @param verticalMarkers the vertical markers
 */
export const createVerticalMarkers = (startTimeSecs, endTimeSecs, verticalMarkers) => {
    if (!verticalMarkers || verticalMarkers.length === 0)
        return [];
    return verticalMarkers.reduce((accumulator, verticalMarker) => {
        // Only render markers within the visible time range
        if (verticalMarker.timeSecs >= startTimeSecs && verticalMarker.timeSecs <= endTimeSecs) {
            const leftPct = calculateLeftPercent(verticalMarker.timeSecs, startTimeSecs, endTimeSecs);
            accumulator.push(React.createElement(VerticalMarker, { key: `vertical_marker_${verticalMarker.id}`, color: verticalMarker.color, lineStyle: verticalMarker.lineStyle, percentageLocation: leftPct, width: verticalMarker.width }));
        }
        return accumulator;
    }, []);
};
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
export const createMoveableMarkers = ({ startTimeSecs, endTimeSecs, moveableMarkers, getZoomRatio, containerClientWidth, viewportClientWidth, onUpdateMarker, labelWidthPx }) => {
    if (!moveableMarkers || moveableMarkers.length === 0)
        return [];
    return moveableMarkers.reduce((accumulator, m) => {
        // Only render markers within the visible time range
        if (m.timeSecs >= startTimeSecs && m.timeSecs <= endTimeSecs) {
            const leftPct = calculateLeftPercent(m.timeSecs, startTimeSecs, endTimeSecs);
            accumulator.push(React.createElement(MoveableMarker, { key: `moveable_marker_${m.id}`, labelWidthPx: labelWidthPx, marker: m, percentageLocation: leftPct, timeRange: () => ({
                    startTimeSecs,
                    endTimeSecs
                }), getZoomRatio: getZoomRatio, containerClientWidth: containerClientWidth, viewportClientWidth: viewportClientWidth, 
                // these methods shouldn't be bound as they are events passed in by a 3rd party user
                // and have already been bound to the appropriate context.
                onUpdateMarker: onUpdateMarker }));
        }
        return accumulator;
    }, []);
};
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
export const createSelectionWindowMarkers = ({ startTimeSecs, endTimeSecs, selectionWindows, getZoomRatio, canvasRef, containerClientWidth, viewportClientWidth, computeTimeSecsForMouseXPosition, onMouseMove, onMouseDown, onMouseUp, onMoveSelectionWindow, onUpdateSelectionWindow, onClickSelectionWindow, labelWidthPx }) => {
    if (!selectionWindows || selectionWindows.length === 0)
        return [];
    return selectionWindows.reduce((accumulator, selectionWindow) => {
        // Only render markers within the visible time range
        if (selectionWindow.startMarker.timeSecs <= endTimeSecs &&
            selectionWindow.endMarker.timeSecs >= startTimeSecs) {
            accumulator.push(React.createElement(SelectionWindow, { key: `selection_window_${selectionWindow.id}`, timeRange: () => ({
                    startTimeSecs,
                    endTimeSecs
                }), labelWidthPx: labelWidthPx, getZoomRatio: getZoomRatio, canvasRef: canvasRef, selectionWindow: selectionWindow, containerClientWidth: containerClientWidth, viewportClientWidth: viewportClientWidth, computeTimeSecsForMouseXPosition: computeTimeSecsForMouseXPosition, 
                // these methods shouldn't be bound as they are events passed in by a 3rd party user
                // and have already been bound to the appropriate context.
                onMoveSelectionWindow: onMoveSelectionWindow, onUpdateSelectionWindow: onUpdateSelectionWindow, onClickSelectionWindow: onClickSelectionWindow, onMouseDown: onMouseDown, onMouseMove: onMouseMove, onMouseUp: onMouseUp, minimumSelectionWindowDuration: selectionWindow.minimumSelectionWindowDuration, maximumSelectionWindowDuration: selectionWindow.maximumSelectionWindowDuration }));
        }
        return accumulator;
    }, []);
};
/**
 * A memoized function for creating the vertical markers.
 * The memoization function caches the results using
 * the most recent argument and returns the results.
 *
 * @returns an array JSX elements
 */
export const memoizedCreateVerticalMarkers = memoizeOne(createVerticalMarkers, 
// ! Is this necessary?
/* tell memoize to use a deep comparison for complex objects */
deepEqual);
//# sourceMappingURL=create-marker-util.js.map