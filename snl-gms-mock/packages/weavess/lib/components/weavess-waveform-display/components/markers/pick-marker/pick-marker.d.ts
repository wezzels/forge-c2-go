import React from 'react';
import type { PickMarkerProps } from './types';
/**
 * An interactive marker, that is configurable, and can have specific events.
 */
export declare class PickMarker extends React.PureComponent<PickMarkerProps> {
    /** container reference */
    private containerRef;
    /** line reference */
    private lineRef;
    /** label reference */
    private labelRef;
    /** Used to prevent collisions between the single and double-click handlers */
    private singleClickTimer;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     */
    componentDidUpdate(prevProps: PickMarkerProps): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to un-mount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    /**
     * referentially stable click handler for pick markers
     *
     * @param e
     */
    private readonly onClick;
    /**
     * referentially stable double-click handler for pick markers
     */
    private readonly onDoubleClick;
    /**
     * onContextMenu menu event handler for pick markers
     *
     * @param e
     */
    private readonly onContextMenu;
    /**
     * onMouseDown event handler for signal detections
     *
     * @param e
     */
    private readonly onMouseDown;
    private readonly onMouseUp;
    /**
     * Add a drag listener for pick marker move modification. This
     * listener will be removed on mouse up event
     *
     * @param e MouseEvent from mouseDown
     */
    private readonly addDragListenerForMove;
    render(): JSX.Element | undefined;
}
//# sourceMappingURL=pick-marker.d.ts.map