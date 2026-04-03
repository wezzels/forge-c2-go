import type { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import { Station } from './components';
import { TimeRange } from './components/axes/time-range';
import type { Channel } from './components/station/components';
import type { WeavessWaveformPanelProps, WeavessWaveformPanelState } from './types';
/**
 * Waveform Panel component. Contains a TimeAxis and Stations
 */
export declare class WeavessWaveformPanel extends React.PureComponent<WeavessWaveformPanelProps, WeavessWaveformPanelState> {
    /** Refs to each station component */
    stationComponentRefs: Map<string, Station> | null;
    /** Ref to the root element of weavess */
    private weavessRootRef;
    /** Ref to the viewport where waveforms are rendered */
    private waveformsViewportRef;
    /** Ref to the container where waveforms are held, directly within the viewport */
    private waveformsContainerRef;
    /** Ref to the translucent selection brush-effect region, which is updated manually for performance reasons */
    private selectionAreaRef;
    /** Ref to the TimeAxis component, which is updated manually for performance reasons */
    private timeAxisRef;
    /** Ref to the vertical crosshair indicator element */
    private crosshairRef;
    /** Ref to the primary canvas element where the waveforms are drawn */
    private canvasRef;
    /** THREE.js WebGLRenderer used to draw waveforms */
    private renderer;
    /** If the brush has just started to be used */
    private startOfBrush;
    /** Flag to indicate whether or not the mouse button is pressed down */
    private isMouseDown;
    /** The start of the brush effect in [0,1] where 0 = zoomRange.left and 1 = zoomRange.right */
    private selectionStart;
    /** The type of brush used on the channel */
    private brushType;
    private globalHotkeyListenerId;
    /** An id of the previous requestAnimationFrame call, which allows
     * one to cancel it, so we can avoid enqueueing multiple animation frames */
    private prevRAF;
    /** An id of the previous requestAnimationFrame call to the onRenderWaveformLoopEnd function, which allows
     * one to cancel it, so we can avoid enqueueing multiple animation frames */
    private prevRAFEnd;
    /** The maximum canvas height */
    private maxCanvasHeight;
    /**
     * A collection of the physical dimensions in the DOM. These are calculated in a batch
     * in order to reduce calculation time during critical points in time, such as
     * requestAnimationFrame calls.
     */
    private readonly dimensions;
    /**
     * A resize observer for the canvas element
     */
    private readonly canvasResizeObserver;
    /**
     * A resize observer for the waveformsViewportRef element
     */
    private readonly waveformViewportResizeObserver;
    /**
     * A resize observer for the waveforms container that holds all the waveforms.
     * The waveforms container may resize when the user expands a station, for example.
     */
    private readonly waveformsContainerResizeObserver;
    /** handler for handling single and double click events */
    private readonly handleSingleDoubleClick;
    /**
     * A memoized function for creating all stations
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param props the waveform panel props
     *
     * @returns an array JSX elements
     */
    private readonly memoizedCreateStationsJsx;
    /** Debounce call to update parent with latest zoomInterval */
    private readonly debounceUpdateZoomInterval;
    /** The max width the browser will allow us to render a div */
    private maxViewportSizePx;
    /**
     * The max number of significant figures for rendering an element in the browser. Elements beyond this size are
     * rounded and/or truncated to use a representation using this many significant figures.
     */
    private maxNumSigFigsForElementSize;
    /** Name of the station targeted for QC mask creation */
    private maskTarget;
    private canvasResizeObserverTimeout;
    private waveformViewportResizeObserverTimeout;
    private waveformsContainerResizeObserverTimeout;
    /**
     * Constructor.
     *
     * @param props WeavessWaveformPanelProps
     */
    constructor(props: WeavessWaveformPanelProps);
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount(): void;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(prevProps: WeavessWaveformPanelProps, prevState: WeavessWaveformPanelState): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    /**
     * clean up when the component is unmounted
     */
    componentWillUnmount(): void;
    /**
     * Exposed primarily for non-react users.
     * Force a redraw of the waveforms.
     */
    refresh: () => void;
    /**
     * Reset amplitudes of all waveforms in this panel.
     */
    resetAmplitudes: () => void;
    /**
     * Return a list of all channels that have their amplitudes manually scaled.
     */
    getManualAmplitudeScaledChannels: () => WeavessTypes.Channel[];
    /**
     * Computes the time in seconds for the mouse x position, represented as a fraction of the canvas.
     *
     * @param mouseXPositionFraction the mouse x position from 0 to 1, where 0 is the far left and 1 is the far right of the canvas
     * @returns The computed time in seconds
     */
    readonly computeTimeSecsForMouseXFractionalPosition: (mouseXPositionFraction: number) => number;
    /**
     * Computes the time in epoch seconds when given an x pixel position on the screen.
     *
     * @param mouseXPx the x position in pixels in question
     * @returns the time represented by that location
     */
    readonly computeTimeSecsFromMouseXPixels: (mouseXPx: number) => number;
    /**
     * Computes a fraction representing where on the canvas an x pixel value is found.
     * 0 means the left side of the canvas, 1 means the right. Value can be out of these bounds.
     *
     * @param xPositionPx the input
     * @returns the fractional x position on the canvas
     */
    readonly computeFractionOfCanvasFromXPositionPx: (xPositionPx: number) => number;
    /**
     * Gets the bounding client rectangle of the waveform panel's canvas element in the DOM.
     *
     * @returns the canvas' bounding rectangle, or undefined if no canvas is found.
     */
    readonly getCanvasBoundingClientRect: () => DOMRect | undefined;
    /**
     * Gets the bounding client rectangle of the waveform panel's canvas element in the DOM.
     *
     * @returns the canvas' bounding rectangle, or undefined if no canvas is found.
     */
    readonly getViewportBoundingClientRect: () => DOMRect | undefined;
    /**
     * Removes the brush div, is public so it be hit with weavess reference
     */
    clearBrushStroke: () => void;
    /**
     * Updates the brush div, is public so it be hit with weavess reference
     */
    updateBrushStroke: (start: number, end: number) => void;
    /**
     * Gets a list of the channel names in the order they are displayed in the WeavessWaveformPanel.
     *
     * @returns a list of the channel names in the order in which they are displayed (from top to bottom)
     */
    readonly getOrderedVisibleChannelNames: () => string[];
    /**
     * Finds the Channel's Waveform YAxisBounds
     *
     * @param channelId
     * @returns WeavessTypes.YAxisBounds for the channel name
     */
    readonly getChannelWaveformYAxisBounds: (channelName: string) => WeavessTypes.YAxisBounds | undefined;
    /**
     * get the currently displayed zoomTimeInterval
     * (the startTime and endTime of the currently displayed view of the waveforms).
     *
     * @returns the state's zoomTimeInterval
     */
    getCurrentZoomInterval: () => WeavessTypes.TimeRange;
    /**
     * Will zoom to the provided time range even if current zoom interval is the same
     *
     * @param zoomInterval
     */
    readonly zoomToTimeWindow: (zoomInterval: WeavessTypes.TimeRange) => void;
    /**
     * Resets amplitudes for selected channels from props selections
     */
    readonly resetSelectedWaveformAmplitudeScaling: (channelIds: string[]) => void;
    /** ********************
     * * End Public Methods
     ********************** */
    private readonly documentPreventCtrlMouseWheel;
    /**
     * Compare the updated zoom interval with current zoom interval in state.
     *
     * @param zoomInterval interval to compare against current zoom interval in state
     * @returns true if the zoom interval is the same (or within 1 pixel); false otherwise
     */
    private readonly isCurrentZoomIntervalEqual;
    /**
     * Compare the two intervals to see if they are equal within 1 pixel
     *
     * @param interval1
     * @param interval2
     * @returns true if the interval is the same (or within 1 pixel); false otherwise
     */
    private readonly areIntervalsEqual;
    /**
     * Zoom interval is checked for limits
     *
     * @param zoomInterval to check
     * @return returns clamped zoom interval if necessary. Will return undefined if already at max zoom
     */
    private readonly checkMaxZoomInterval;
    /**
     * Set the zoom interval in state.
     */
    private readonly setZoomIntervalInState;
    /**
     * If waveform panel is a controlled component update parent with
     * zoomInterval
     */
    private readonly updateZoomIntervalInControlledComponent;
    /**
     * Call to update amplitude after a zoom call. Also remove any manual scaling.
     */
    private readonly updateAmplitudes;
    /**
     * Deletes any station component refs that are not in the current stations (from props)
     */
    private readonly pruneStationComponentRefs;
    /**
     * Updates the position and size dimensions of elements that the waveform display cares about. This
     * prevents one from having to ask the browser to calculate layout and styles during critical points
     * in the execution of the code.
     */
    private readonly updateTrackedDimensions;
    /**
     * calculate the zoom range in [0,1] from the current zoom interval
     * where 0 = this.props.startTimeSecs
     * and 1 = this.props.endTimeSecs
     */
    private readonly getCurrentZoomIntervalRange;
    /**
     * calculate the zoom range in [0,1] for the time range provided
     * where 0 = this.props.startTimeSecs
     * and 1 = this.props.endTimeSecs
     */
    private readonly getZoomRangeFromInterval;
    /**
     * Convert giving range to time interval using props start and end times
     *
     * @param zoomRange range 0 - 1 used in conversion
     * @returns time interval
     */
    private readonly convertRangeToTimeInterval;
    /**
     * Calculates the current viewport range in fractional units
     *
     * @returns fractional viewport range in the format [0, 1]
     */
    private readonly getRangeFromCurrentViewport;
    /**
     * Calculate number of pixels to which the viewport should be scrolled, given the current zoom range
     * and viewport range.
     *
     * @param viewportRange a fractional range in the form [0, 1] showing what region of the whole loaded
     * range is in view.
     * @returns number of pixels from the left of the container
     */
    private readonly getNumberOfPixelsFromLeft;
    /**
     * Calculates a time interval corresponding to the scroll position of the viewport.
     * To function correctly, this.dimensions must have been set using updateTrackedDimensions.
     *
     * @returns a time interval for scroll bar range
     */
    private readonly getTimeIntervalFromViewport;
    private readonly setTimeRangePrecision;
    /**
     * onScroll handler for viewport scroll events.
     */
    private readonly onScroll;
    /**
     * Zoom in on mouse wheel
     *
     * @param e
     */
    private readonly onWheel;
    private readonly createQcSegmentsKeyDown;
    private readonly createQcSegmentsKeyUp;
    /**
     * Scroll to force a specific row to be visible.
     *
     * Supports custom modifiers if the window is changing during the same render as scrolling such as opening the measure window.
     * @param rowId rowId to scroll to
     * @param customRowHeight custom row height - used in place of current row height
     * @param heightOffset window height modifier - subtracted from current panel height
     * @param centered Should the row be centered(true) or top aligned(false)
     */
    readonly scrollToRow: (channelId: string, customRowHeight?: number, heightOffset?: number, centered?: boolean) => void;
    /**
     * Creates all of the markers.
     *
     * @param props the waveform panel props
     *
     * @returns an array JSX elements
     */
    private readonly createAllMarkers;
    /**
     * handler for the ref callback for stations. As a side effect, adds the station's
     * default channel to the visible list of channels.
     *
     * @param stationRef: the ref to the station provided by the React ref callback.
     * If null, will be a no-op.
     */
    private readonly setStationComponentRef;
    /**
     * @returns a ref to the canvas element on which all waveforms are drawn.
     */
    private readonly getCanvasRef;
    /**
     * @returns the bounding client rectangle for the canvas.
     */
    private readonly getCanvasRect;
    /**
     * A set of converter functions that are passed to stations for converting position to
     * and from screen and time units.
     * */
    private readonly converters;
    /**
     * @returns the ratio of the zoom duration divided by the total viewable duration.
     * This can be used to see how far zoomed in we are.
     */
    private readonly getZoomRatio;
    /**
     * @param timeRangeToCheck A time range to check to see if it is entirely in view
     * @returns Whether the time range provided is within the zoom interval (inclusive)
     */
    private readonly isWithinTimeRange;
    /**
     * Returns the name of last station in an array of stations that has populated default channels
     */
    private readonly getLastStationNameWithDefaultChannels;
    /**
     * Creates all of the stations. Parameters should be referentially stable for
     * optimal rendering.
     *
     * @param props the waveform panel props
     *
     * @returns an array JSX elements
     */
    private readonly createStationsJsx;
    /**
     * If WEAVESS is contained inside of a div with flex layout, sizing it with height=100% doesn't work.
     */
    private createRootStyle;
    /**
     * This function is scheduled as an animation frame during @function renderWaveforms. It is
     * cleared by subsequent @function renderWaveform calls, and then scheduled again in the resulting
     * animation frames.
     */
    private readonly onRenderWaveformsLoopEnd;
    /**
     * Create a list of all the channels for all stations
     *
     * @returns list of channels
     */
    private readonly getStationsChannels;
    /**
     * Find channel
     *
     * @params channelName
     * @returns Channel or undefined
     */
    readonly findChannel: (channelName: string) => Channel | undefined;
    private readonly getChannelHeight;
    /**
     * @returns the max allowed height of the canvas, which is the current screen height times 4
     */
    private readonly getMaxCanvasHeight;
    /**
     * resize the renderer to fit the new canvas size
     */
    private updateSize;
    /**
     * Update the size of the canvas and scroll-limiter when the waveform container
     * changes size. This solves a bug in which expanding a station with many channels
     * that already have loaded data will not correctly render all channels' waveforms.
     */
    private onWaveformContainerResize;
    /**
     * Zoom out to the full displayInterval
     */
    private readonly fullZoomOut;
    /**
     * Scroll down so that the top-most row is at the bottom.
     * If only one row is in view because they are so large, scroll the whole distance
     */
    private readonly pageDown;
    /**
     * Scroll down so that the bottom-most row is at the top.
     * If only one row is in view because they are so large, scroll the whole distance
     */
    private readonly pageUp;
    private readonly getSelectedChannels;
    /**
     * helper function to handle on mouse down for the CreateMask brush type
     *
     * @param xPct
     * @param channelId
     * @param isDefaultChannel
     */
    private readonly handleCreateMask;
    /**
     * right click mouse down event handler
     *
     * @param e:  React.MouseEvent<HTMLDivElement>,
     * @param channelId channel id as string
     * @param timeSecs the time of the x position that was clicked
     * @param sdId sd id as string
     * @param waveform weavess waveform content
     */
    private readonly onContextMenu;
    /**
     * mouse down event handler
     *
     * @param e
     * @param xPct
     * @param channelId
     * @param timeSecs
     * @param isDefaultChannel
     */
    private readonly onMouseDown;
    /**
     * Given an event determine if we should set the brushType to zoom
     *
     * @param event React.MouseEvent<HTMLDivElement>
     */
    private readonly shouldSetBrushTypeToZoom;
    /**
     * mouse move event handler
     *
     * @param e
     * @param xPct
     * @param timeSecs
     */
    private readonly onMouseMove;
    /** *
     *  Cancel the stroke so as to not interfere with other mouse events
     */
    private readonly cancelStroke;
    /**
     * Create Mask
     *
     */
    private readonly createMask;
    private readonly performZoom;
    private readonly onRulerMouseUp;
    /**
     * Handle logic for if we should call the onChannelClick callback when
     * a channel is clicked
     *
     * @param mouseEvent React.MouseEvent<HTMLDivElement>
     * @param isDefaultChannel boolean
     * @param channel WeavessTypes.Channel
     * @param timeSecs number
     * @param isMeasureWindow did the click happen in the measure window
     */
    private readonly handleOnChannelClick;
    /**
     * Handle the other click events that are not for the default channel events
     *
     * @param mouseEvent React.MouseEvent<HTMLDivElement>
     * @param events WeavessTypes.ChannelContentEvents
     * @param channel WeavessTypes.Channel
     * @param timeSecs number
     * @param isMeasureWindow did the mousedown event occur in the measure window
     */
    private readonly handleChannelMousedownEvents;
    /**
     * handle a single click event, only if the user has not moved the mouse
     *
     * @param mouseEvent
     * @param events
     * @param isDefaultChannel
     * @param channel
     * @param timeSecs
     * @param isMeasureWindow did the click happen in the measure window
     */
    private readonly handleSingleClickInMouseUp;
    /**
     * mouse up event handler
     *
     * @param mouseEvent
     * @param xPct
     * @param channelId
     * @param timeSecs
     * @param isDefaultChannel
     * @param isMeasureWindow
     * @param isDragged
     */
    private readonly onMouseUp;
    /**
     * zoomPct in [0,1], x in [0,1]
     *
     * @param zoomPct positive zooms out, negative zooms in
     * @param x
     */
    private readonly zoomByPercentageToPoint;
    private readonly pan;
    /**
     * Rounds the provided number to the number of significant figures provided
     *
     * @param num the number to round
     * @param numSigFigs the max number of significant figures
     * @param shouldFloor boolean that, if true, forces this to floor the result
     * @returns
     */
    private roundToSigFigs;
    /**
     * Calculates the start of the new zoom interval in webGL units (0 is the left of the current interval, 1 is the right)
     * and the size in pixels of the waveform container.
     */
    private readonly calculateZoomPx;
    /**
     * Zoom to the requested time interval in WebGL units, with 0 representing the start
     * of the current interval, and 1 representing the end.
     * Zoom is constrained by the max allowed browser element size (maxViewportSizePx),
     * the smallest time interval allowed.
     *
     * It will try to round the width to the known browser supported significant figures.
     * For example, the browser does not seem to track precision of element widths beyond
     * a set number of significant figures, resulting in the elements having an actual size
     * that is rounded to a power of ten pixels wide.
     *
     * This updates the tracked dimensions, and may call to render waveforms if the scrollLeft
     * has changed (which would not otherwise rerender the waveforms).
     *
     * @param zoomInterval the time range representing the level to which to zoom
     */
    private readonly zoom;
    /**
     * Has current state zoom interval reached either max element or max resolution limit
     *
     * @returns whether the current zoom interval provided is at max
     */
    private readonly hasCurrentZoomIntervalReachedMax;
    /**
     * Notify user max zoom has been reached
     */
    private readonly notifyMaxZoomHasBeenReached;
    /**
     * Returns true if the zoom interval at or smaller (zooming in) on current zoom interval.
     */
    private readonly isZoomIntervalSmallerThanCurrent;
    /**
     * @param zoomInterval A zoom interval to check
     * @returns true if the provided interval would cause us to zoom so much that we would be creating DOM elements
     * that are larger than the browser supports.
     */
    private readonly isZoomIntervalAtMaxElementWidth;
    /**
     * @param zoomInterval A zoom interval to check
     * @returns true if the provided interval would cause us to zoom so much that we pass the maximum time resolution
     * allowed, which is 100 microseconds.
     */
    private readonly isZoomIntervalAtMaxResolution;
    /**
     * Will log an error if the internal weavess zoom interval state does not match the size of the waveforms container,
     * plus or minus a tolerance: {@link VIEWPORT_ZOOM_TOLERANCE_PX}.
     * For the same reason, it will also log an error if the waveformContainerRef element has a computed width that differs
     * from the clientWidth, plus or minus the same tolerance.
     * In other words, this will log an error if the state would be rendering elements at the wrong place due to a mismatch
     * between our internal state and the browser's expected state.
     *
     * ! This should only be run in development mode to avoid a performance hit
     */
    private readonly assertZoomIntervalMatchesViewportSize;
    /**
     * @param zoomInterval the interval to check
     * @returns a zoom interval that is clamped to the maximum element width, if it would
     * exceed that width.
     */
    private readonly calculateMaxElementZoomInterval;
    /**
     * @param zoomInterval the interval to check
     * @returns a zoom interval that is clamped to the minimum time interval,
     * if it would exceed that size
     */
    private readonly calculateMaxTimeResolutionZoomInterval;
    /**
     * Checks zoom interval for two limits. First if reached max browser width in pixels
     * second if interval is less than 1 microsecond
     *
     * @param zoomInterval
     * @returns limited zoom interval if limit is reached else checked zoom interval
     */
    private readonly clampToMaxZoomInterval;
    /**
     * After zoom update update waveform panel
     */
    private readonly postZoomUpdate;
    /**
     * Render currently visible waveforms to the canvas.
     * Note: This is not a React render, this is drawing to the canvas. It uses
     * `requestAnimationFrame` in order to queue up work to draw the waveforms
     * to the canvas at the most opportune time. This will happen asynchronously,
     * and not necessarily because of a React render.
     *
     * @param options shouldCallAnimationLoopEnd sets whether {@see onRenderWaveformsLoopEnd} should be triggered (true by default)
     * which can be used to prevent infinite loops.
     * shouldUpdateDimensions sets whether the animation frame should recalculate the dimensions of the DOM (expensive). True by default.
     */
    private readonly renderWaveforms;
    /**
     * Updates the top margin of the canvas if the contentHeight is over the max canvas height and
     * we have scrolled past the max canvas height. This prevents internal buffer overruns in the canvas
     * which might result in rendering errors.
     *
     * @param contentHeight the height of all weavess rows
     * @param scrollTop the scroll position of the weavess view
     */
    private readonly updateCanvasMargin;
    /**
     * The function called by the requestAnimationFrame scheduled in @function renderWaveforms.
     * This actually results in drawing the waveforms.
     */
    private readonly renderWaveformsAnimationFrame;
    /**
     * The amount of pixels allocated for the label
     *
     * @returns number of pixels
     */
    private readonly labelWidthPx;
    /**
     * The amount of pixels allocated for the label and scrollbar widths
     *
     * @returns number of pixels
     */
    private readonly labelWithScrollbarWidthPx;
    private readonly setMaxViewportSizePx;
    private readonly setMaxBrowserResolution;
    private readonly hasNoVisibleStation;
    /**
     * React component lifecycle
     */
    render(): JSX.Element;
}
//# sourceMappingURL=weavess-waveform-panel.d.ts.map