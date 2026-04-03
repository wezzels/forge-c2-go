import React from 'react';
import type { SelectionWindowProps, SelectionWindowState } from './types';
/**
 * SelectionWindow Component. Contains two moveable boundary markers.
 */
export declare class SelectionWindow extends React.PureComponent<SelectionWindowProps, SelectionWindowState> {
    /** Amount of mouse movement before updating */
    private readonly MOUSE_MOVE_CONSTRAINT_SECS;
    /** indicates if the mouse is down */
    private mouseDown;
    /** indicates if the mouse is dragging */
    private isUpdating;
    /** handler for handling single and double click events */
    private readonly handleSingleDoubleClick;
    /** The number of milliseconds to delay calls to onMoveSelectionClick  */
    private readonly debouncedOnMoveSelectionClickMS;
    /** The debounced function of onMoveSelectionClick event handler */
    private debouncedOnMoveSelectionClick;
    /**
     * Constructor
     *
     * @param props Selection Window props as SelectionWindowProps
     */
    constructor(props: SelectionWindowProps);
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     */
    componentDidUpdate(prevProps: SelectionWindowProps): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    render(): JSX.Element;
    /**
     * Return the selection window depending on if we are dragging or not.
     * If not dragging then position is determined from the props
     *
     * @returns SelectionWindow
     */
    private readonly getSelectionWindow;
    /**
     * Selection window on click logic, creates mouse move and mouse down
     * Listeners to determine where to move the window and the markers.
     *
     * @param event
     */
    private readonly onSelectionWindowClick;
    /**
     * Updates the start/end marker times of the selection window in state
     * @param newStartTimeSecs amount window moved in seconds
     */
    private readonly updateSelectionWindowPosition;
    /**
     * Handles mouse up ending drag of selection window
     *
     * @param mouseUpEvent Ending mouse drag event
     * @param endingDragTime Epoch time where drag window stops
     */
    private readonly endSelectionWindowDrag;
    /**
     * Create boarder markers
     */
    private readonly createMarkers;
    private readonly updateStartAndEndTimeWithBounds;
    /**
     * Handles the on update marker event and updates the selection
     */
    private readonly onMarkerUpdated;
    /**
     * Returns the time in seconds for the given clientX.
     *
     * @param clientX The clientX
     *
     * @returns The time in seconds; undefined if clientX is
     * out of the channel's bounds on screen.
     */
    private readonly getTimeSecsForClientX;
    /**
     * onMouseDown event handler.
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onMouseDown;
    /**
     * onMouseMove event handler.
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onMouseMove;
    /**
     * onMouseUp event handler.
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onMouseUp;
    private readonly setIsUpdating;
    private readonly constrainTimeSecs;
}
//# sourceMappingURL=selection-window.d.ts.map