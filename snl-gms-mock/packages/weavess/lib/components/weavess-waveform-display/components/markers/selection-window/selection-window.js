/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import { WeavessConstants } from '@gms/weavess-core';
import classNames from 'classnames';
import { deepEqual } from 'fast-equals';
import debounce from 'lodash/debounce';
import React from 'react';
import { SingleDoubleClickEvent } from '../../../events/single-double-click-event';
import { calculateLeftPercent } from '../../../utils';
import { VerticalMarker } from '../vertical-marker';
import { SelectionWindowBoundaryMarker } from './selection-window-boundary-marker';
import { SelectionWindowBoundaryMarkerType } from './types';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * SelectionWindow Component. Contains two moveable boundary markers.
 */
export class SelectionWindow extends React.PureComponent {
    /** Amount of mouse movement before updating */
    MOUSE_MOVE_CONSTRAINT_SECS = 0.005; // represents 5 ms
    /** indicates if the mouse is down */
    mouseDown = false;
    /** indicates if the mouse is dragging */
    isUpdating = false;
    /** handler for handling single and double click events */
    handleSingleDoubleClick = new SingleDoubleClickEvent();
    /** The number of milliseconds to delay calls to onMoveSelectionClick  */
    debouncedOnMoveSelectionClickMS = 250;
    /** The debounced function of onMoveSelectionClick event handler */
    debouncedOnMoveSelectionClick;
    /**
     * Constructor
     *
     * @param props Selection Window props as SelectionWindowProps
     */
    constructor(props) {
        super(props);
        this.debouncedOnMoveSelectionClick = this.props.onMoveSelectionWindow
            ? debounce(() => {
                if (this.props.onMoveSelectionWindow) {
                    this.props.onMoveSelectionWindow(this.getSelectionWindow());
                }
            }, this.debouncedOnMoveSelectionClickMS, { maxWait: this.debouncedOnMoveSelectionClickMS })
            : undefined;
        this.state = {
            selectionWindow: props.selectionWindow
        };
    }
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     */
    componentDidUpdate(prevProps) {
        // When not dragging update state to equal props selection window
        // constrain to within timeRange
        if (!this.isUpdating && !deepEqual(this.state.selectionWindow, this.props.selectionWindow)) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ selectionWindow: this.props.selectionWindow });
        }
        if (!deepEqual(this.props.onMoveSelectionWindow, prevProps.onMoveSelectionWindow)) {
            if (this.debouncedOnMoveSelectionClick) {
                this.debouncedOnMoveSelectionClick.cancel();
            }
            this.debouncedOnMoveSelectionClick = this.props.onMoveSelectionWindow
                ? debounce(() => {
                    if (this.props.onMoveSelectionWindow) {
                        this.props.onMoveSelectionWindow(this.getSelectionWindow());
                    }
                }, this.debouncedOnMoveSelectionClickMS, { maxWait: this.debouncedOnMoveSelectionClickMS })
                : undefined;
        }
    }
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess Selection Window Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    // eslint-disable-next-line react/sort-comp
    render() {
        const selectionWindow = this.getSelectionWindow();
        const leftPercent = calculateLeftPercent(selectionWindow.startMarker.timeSecs, this.props.timeRange().startTimeSecs, this.props.timeRange().endTimeSecs);
        const rightPercent = calculateLeftPercent(selectionWindow.endMarker.timeSecs, this.props.timeRange().startTimeSecs, this.props.timeRange().endTimeSecs);
        return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        React.createElement("div", { className: "selection-window", "data-testid": "selection-window", onMouseDown: this.onMouseDown, onMouseMove: this.onMouseMove, onMouseUp: this.onMouseUp },
            React.createElement("div", { className: classNames([
                    'selection-window-selection',
                    { 'selection-window-selection--moveable': selectionWindow.isMoveable }
                ]), style: {
                    backgroundColor: `${selectionWindow.color}`,
                    left: `${leftPercent}%`,
                    right: `${WeavessConstants.PERCENT_100 - rightPercent}%`,
                    cursor: selectionWindow.isMoveable && !selectionWindow.disableCenterRangeClick
                        ? 'move'
                        : 'auto',
                    pointerEvents: selectionWindow.isMoveable && !selectionWindow.disableCenterRangeClick
                        ? 'auto'
                        : 'none'
                }, onMouseDown: this.onSelectionWindowClick, onDoubleClick: this.handleSingleDoubleClick.onDoubleClick }),
            this.createMarkers(selectionWindow)));
    }
    /**
     * Return the selection window depending on if we are dragging or not.
     * If not dragging then position is determined from the props
     *
     * @returns SelectionWindow
     */
    getSelectionWindow = () => {
        return this.state?.selectionWindow;
    };
    /**
     * Selection window on click logic, creates mouse move and mouse down
     * Listeners to determine where to move the window and the markers.
     *
     * @param event
     */
    onSelectionWindowClick = (mouseClickEvent) => {
        if (!this.getSelectionWindow().isMoveable ||
            this.getSelectionWindow().disableCenterRangeClick ||
            mouseClickEvent.button === 2 ||
            mouseClickEvent.shiftKey ||
            mouseClickEvent.ctrlKey ||
            mouseClickEvent.metaKey)
            return;
        const { clientX } = mouseClickEvent;
        mouseClickEvent.stopPropagation();
        if (this.mouseDown) {
            return;
        }
        this.mouseDown = true;
        // calculate initial start time
        const timeSecs = this.getTimeSecsForClientX(clientX);
        // If can't figure out where on the time line clicked
        if (!timeSecs)
            return;
        // Capture the selection window's left edge in relation to where the user clicked on it.
        // This value shouldn't change
        const startMarkerTimeSecs = this.getSelectionWindow().startMarker.timeSecs;
        const leadingEdgeClickOffset = timeSecs - startMarkerTimeSecs;
        const onMouseMove = (mouseMoveEvent) => {
            // Calculate the mouse position time adjusting for start time offset
            const newStartTimeSecs = (this.getTimeSecsForClientX(mouseMoveEvent.clientX) ?? 0) - leadingEdgeClickOffset;
            if (this.mouseDown) {
                this.setIsUpdating(true);
                const mouseDeltaTimeSecs = newStartTimeSecs - startMarkerTimeSecs;
                // the mouse is considered to be dragging if the user has moved greater than 5ms
                if (Math.abs(mouseDeltaTimeSecs) > this.MOUSE_MOVE_CONSTRAINT_SECS) {
                    this.updateSelectionWindowPosition(newStartTimeSecs);
                }
            }
        };
        const onMouseUp = (mouseUpEvent) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.endSelectionWindowDrag(mouseUpEvent, timeSecs);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    /**
     * Updates the start/end marker times of the selection window in state
     * @param newStartTimeSecs amount window moved in seconds
     */
    updateSelectionWindowPosition = (newStartTimeSecs) => {
        const selectionWindow = this.getSelectionWindow();
        const selectionWindowDuration = selectionWindow.endMarker.timeSecs - selectionWindow.startMarker.timeSecs;
        const deltaTimeSecs = newStartTimeSecs - selectionWindow.startMarker.timeSecs;
        let startMarkerTime = this.constrainTimeSecs(newStartTimeSecs, selectionWindow.startMarker.minTimeSecsConstraint, selectionWindow.startMarker.maxTimeSecsConstraint);
        let endMarkerTime = this.constrainTimeSecs(selectionWindow.endMarker.timeSecs + deltaTimeSecs, selectionWindow.endMarker.minTimeSecsConstraint, selectionWindow.endMarker.maxTimeSecsConstraint);
        // window duration changed due to constraint enforcement
        if (endMarkerTime - startMarkerTime !== selectionWindowDuration) {
            // the start marker was constrained
            if (startMarkerTime ===
                (selectionWindow.startMarker.minTimeSecsConstraint || this.props.timeRange().startTimeSecs)) {
                // reset the end marker
                endMarkerTime = startMarkerTime + selectionWindowDuration;
            }
            else {
                // end marker was constrained, reset the start marker
                startMarkerTime = endMarkerTime - selectionWindowDuration;
            }
        }
        this.setState(prevState => ({
            selectionWindow: {
                ...prevState.selectionWindow,
                startMarker: {
                    ...prevState.selectionWindow.startMarker,
                    timeSecs: startMarkerTime
                },
                endMarker: {
                    ...prevState.selectionWindow.endMarker,
                    timeSecs: endMarkerTime
                }
            }
        }));
        if (this.debouncedOnMoveSelectionClick) {
            this.debouncedOnMoveSelectionClick();
        }
    };
    /**
     * Handles mouse up ending drag of selection window
     *
     * @param mouseUpEvent Ending mouse drag event
     * @param endingDragTime Epoch time where drag window stops
     */
    endSelectionWindowDrag = (mouseUpEvent, endingDragTime) => {
        if (this.debouncedOnMoveSelectionClick) {
            this.debouncedOnMoveSelectionClick.cancel();
        }
        const selectionWindow = this.getSelectionWindow();
        if (this.isUpdating && selectionWindow.isMoveable && this.props.onUpdateSelectionWindow) {
            // only update if the selection window is moveable; no false updates
            this.setIsUpdating(false);
            this.props.onUpdateSelectionWindow(selectionWindow);
        }
        else {
            // handle a single click event
            this.handleSingleDoubleClick.onSingleClickEvent(mouseUpEvent, () => {
                if (this.props.onClickSelectionWindow) {
                    this.props.onClickSelectionWindow(selectionWindow, endingDragTime);
                }
            });
        }
        this.mouseDown = false;
    };
    /**
     * Create boarder markers
     */
    createMarkers = (selectionWindow) => {
        if (!selectionWindow)
            return [];
        const boundaryMarkers = [];
        const borderMarkersKey = 'boundary-marker-lead';
        const verticalMarkerKey = 'vertical-marker-start';
        boundaryMarkers.push(selectionWindow.isMoveable ? (React.createElement(SelectionWindowBoundaryMarker, { key: selectionWindow.startMarker.id, name: borderMarkersKey, boundaryType: SelectionWindowBoundaryMarkerType.LEAD, timeSecs: selectionWindow.startMarker.timeSecs, timeRange: this.props.timeRange, onMarkerUpdated: this.onMarkerUpdated, getTimeSecsForClientX: this.getTimeSecsForClientX, setIsUpdating: this.setIsUpdating, color: selectionWindow.startMarker.color, lineStyle: selectionWindow.startMarker.lineStyle, width: selectionWindow.startMarker.width })) : (React.createElement(VerticalMarker, { key: selectionWindow.startMarker.id, name: verticalMarkerKey, color: selectionWindow.startMarker.color, lineStyle: selectionWindow.startMarker.lineStyle, percentageLocation: calculateLeftPercent(selectionWindow.startMarker.timeSecs, this.props.timeRange().startTimeSecs, this.props.timeRange().endTimeSecs) })));
        const moveableMarkerKey = 'boundary-marker-lag';
        const verticalMarkerEndKey = 'vertical-marker-end';
        boundaryMarkers.push(selectionWindow.isMoveable ? (React.createElement(SelectionWindowBoundaryMarker, { key: selectionWindow.endMarker.id, name: moveableMarkerKey, boundaryType: SelectionWindowBoundaryMarkerType.LAG, timeSecs: selectionWindow.endMarker.timeSecs, timeRange: this.props.timeRange, onMarkerUpdated: this.onMarkerUpdated, getTimeSecsForClientX: this.getTimeSecsForClientX, setIsUpdating: this.setIsUpdating, color: selectionWindow.startMarker.color, lineStyle: selectionWindow.startMarker.lineStyle, width: selectionWindow.endMarker.width })) : (React.createElement(VerticalMarker, { key: selectionWindow.endMarker.id, name: verticalMarkerEndKey, color: selectionWindow.startMarker.color, lineStyle: selectionWindow.startMarker.lineStyle, percentageLocation: calculateLeftPercent(selectionWindow.endMarker.timeSecs, this.props.timeRange().startTimeSecs, this.props.timeRange().endTimeSecs) })));
        return boundaryMarkers;
    };
    updateStartAndEndTimeWithBounds = (windowSize, startMarkerDidMove, endMarkerDidMove, startMarkerTime, endMarkerTime, updatedTime) => {
        let newStartMarkerTime = startMarkerTime;
        let newEndMarkerTime = endMarkerTime;
        if (this.props.minimumSelectionWindowDuration &&
            windowSize < this.props.minimumSelectionWindowDuration.durationInSeconds) {
            if (startMarkerDidMove) {
                newStartMarkerTime =
                    endMarkerTime - this.props.minimumSelectionWindowDuration.durationInSeconds;
            }
            else {
                newEndMarkerTime =
                    startMarkerTime + this.props.minimumSelectionWindowDuration.durationInSeconds;
            }
            this.props.minimumSelectionWindowDuration.onDurationReached();
        }
        else if (this.props.maximumSelectionWindowDuration &&
            windowSize > this.props.maximumSelectionWindowDuration.durationInSeconds) {
            if (startMarkerDidMove) {
                newStartMarkerTime =
                    endMarkerTime - this.props.maximumSelectionWindowDuration.durationInSeconds;
            }
            else {
                newEndMarkerTime =
                    startMarkerTime + this.props.maximumSelectionWindowDuration.durationInSeconds;
            }
            this.props.maximumSelectionWindowDuration.onDurationReached();
        }
        else if (startMarkerDidMove) {
            newStartMarkerTime = updatedTime;
        }
        else if (endMarkerDidMove) {
            newEndMarkerTime = updatedTime;
        }
        return { newStartMarkerTime, newEndMarkerTime };
    };
    /**
     * Handles the on update marker event and updates the selection
     */
    onMarkerUpdated = (boundaryType, timeSecs) => {
        // only update if the selection window is moveable; no false updates
        const selectionWindow = this.getSelectionWindow();
        // determined which marker moved
        const startMarkerDidMove = boundaryType === SelectionWindowBoundaryMarkerType.LEAD;
        const endMarkerDidMove = boundaryType === SelectionWindowBoundaryMarkerType.LAG;
        // set to new time if moved, otherwise set from state
        let startMarkerTime = startMarkerDidMove
            ? this.constrainTimeSecs(timeSecs, this.props.selectionWindow.startMarker.minTimeSecsConstraint, this.props.selectionWindow.startMarker.maxTimeSecsConstraint)
            : selectionWindow.startMarker.timeSecs;
        let endMarkerTime = endMarkerDidMove
            ? this.constrainTimeSecs(timeSecs, this.props.selectionWindow.endMarker.minTimeSecsConstraint, this.props.selectionWindow.endMarker.maxTimeSecsConstraint)
            : selectionWindow.endMarker.timeSecs;
        if (this.props.minimumSelectionWindowDuration || this.props.maximumSelectionWindowDuration) {
            const windowSize = endMarkerTime - startMarkerTime;
            const updatedTime = this.updateStartAndEndTimeWithBounds(windowSize, startMarkerDidMove, endMarkerDidMove, startMarkerTime, endMarkerTime, timeSecs);
            startMarkerTime = updatedTime.newStartMarkerTime;
            endMarkerTime = updatedTime.newEndMarkerTime;
        }
        this.setState(prevState => ({
            selectionWindow: {
                ...prevState.selectionWindow,
                startMarker: {
                    ...prevState.selectionWindow.startMarker,
                    timeSecs: startMarkerTime
                },
                endMarker: {
                    ...prevState.selectionWindow.endMarker,
                    timeSecs: endMarkerTime
                }
            }
        }), () => {
            if (!this.isUpdating && selectionWindow.isMoveable && this.props.onUpdateSelectionWindow) {
                this.props.onUpdateSelectionWindow(this.state.selectionWindow);
            }
        });
    };
    /**
     * Returns the time in seconds for the given clientX.
     *
     * @param clientX The clientX
     *
     * @returns The time in seconds; undefined if clientX is
     * out of the channel's bounds on screen.
     */
    getTimeSecsForClientX = (clientX) => {
        const canvasRef = this.props.canvasRef();
        if (!canvasRef)
            return undefined;
        const offset = canvasRef.getBoundingClientRect();
        if (clientX < offset.left && clientX > offset.right)
            return undefined;
        // position in [0,1] in the current channel bounds.
        const position = (clientX - offset.left) / offset.width;
        // Return computed time
        return this.props.computeTimeSecsForMouseXPosition(position);
    };
    /**
     * onMouseDown event handler.
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onMouseDown = (e) => {
        this.props.onMouseDown(e);
    };
    /**
     * onMouseMove event handler.
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onMouseMove = (e) => {
        this.props.onMouseMove(e);
    };
    /**
     * onMouseUp event handler.
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onMouseUp = (e) => {
        this.props.onMouseUp(e);
    };
    setIsUpdating = (isUpdating) => {
        this.isUpdating = isUpdating;
    };
    constrainTimeSecs = (timeSecs, minConstraint = this.props.timeRange().startTimeSecs, maxConstraint = this.props.timeRange().endTimeSecs) => {
        if (timeSecs < minConstraint)
            return minConstraint;
        if (timeSecs > maxConstraint)
            return maxConstraint;
        return timeSecs;
    };
}
//# sourceMappingURL=selection-window.js.map