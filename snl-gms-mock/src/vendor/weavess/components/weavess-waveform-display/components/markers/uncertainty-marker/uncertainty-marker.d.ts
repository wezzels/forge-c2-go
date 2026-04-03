import React from 'react';
import type { UncertaintyMarkerProps } from './types';
interface UncertaintyMarkerState {
    isActive: boolean;
}
/**
 * An interactive marker, that is configurable, and can have specific events.
 */
export declare class UncertaintyMarker extends React.PureComponent<UncertaintyMarkerProps, UncertaintyMarkerState> {
    /**
     * Constructor
     *
     * @param props props as PickMarkerProps
     */
    constructor(props: UncertaintyMarkerProps);
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to un-mount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    private readonly isEditingUncertainty;
    private readonly preventDefaults;
    /**
     * Prevent propagation & default if in editing uncertainty mode, which stops the context menu event
     * from clearing the hotkeys from the global listener.
     */
    private readonly onContextMenu;
    /**
     * onMouseDown event handler for signal detections
     *
     * @param e
     */
    private readonly onMouseDown;
    /**
     * Update uncertainty in parent
     *
     * @param time Uncertainty time epoch secs
     * @param callDragEnd if to call update callback
     */
    private readonly setUncertaintyTime;
    /**
     * Add a drag listener for pick marker move modification. This
     * listener will be removed on mouse up event
     *
     * @param e MouseEvent from mouseDown
     */
    private readonly addDragListenerForMove;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=uncertainty-marker.d.ts.map