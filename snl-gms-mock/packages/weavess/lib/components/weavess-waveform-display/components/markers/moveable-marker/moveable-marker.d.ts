import React from 'react';
import type { MoveableMarkerProps, MoveableMarkerState } from './types';
/**
 * MoveableMarker Component. Vertical or Horizontal line that is moveable
 */
export declare class MoveableMarker extends React.PureComponent<MoveableMarkerProps, MoveableMarkerState> {
    /** Ref to the marker container element */
    containerRef: HTMLElement | null;
    /** indicates if the mouse is dragging */
    private isDragging;
    /**
     * Constructor
     *
     * @param props Moveable Marker props as MoveableMarkerProps
     */
    constructor(props: MoveableMarkerProps);
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     */
    componentDidUpdate(): void;
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
     * Returns the minimum constraint of the moveable marker.
     */
    readonly getMinConstraint: () => number;
    /**
     * Returns the minimum constraint percentage of the moveable marker.
     */
    readonly getMinConstraintPercentage: () => number;
    /**
     * Returns the maximum constraint of the moveable marker.
     */
    readonly getMaxConstraint: () => number;
    /**
     * Returns the maximum constraint percentage of the moveable marker.
     */
    readonly getMaxConstraintPercentage: () => number;
    /**
     * Move logic for the markers. Creates mouse move and up listeners to determine
     * Where it should be moved. Only works for pairs currently, if more than two markers
     * Depend on each other, will need to be refactored.
     *
     * @param e
     */
    private readonly onMoveableMarkerClick;
    /**
     * Return the marker depending on if we are dragging or not.
     * If not dragging then position is determined from the props
     *
     * @returns SelectionWindow
     */
    private readonly getMarker;
    /**
     * Returns an small padding percentage.
     */
    private readonly getSmallPaddingPercent;
    /**
     * Returns the moveable marker position based on on a percentage provided.
     *
     * @param currentPercent
     */
    private readonly determineMoveableMarkerPosition;
    /**
     * Returns the minimum duration allowable between the start and end markers or 0 if not set
     * @returns number
     */
    private readonly getMinSelectionWindowDuration;
}
//# sourceMappingURL=moveable-marker.d.ts.map