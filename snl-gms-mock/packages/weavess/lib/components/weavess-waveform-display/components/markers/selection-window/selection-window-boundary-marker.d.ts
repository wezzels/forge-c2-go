import React from 'react';
import { type SelectionWindowBoundaryMarkerProps } from './types';
/**
 * SelectionWindowBoundaryMarker Component
 */
export declare class SelectionWindowBoundaryMarker extends React.PureComponent<SelectionWindowBoundaryMarkerProps> {
    readonly lineBorderWidthPx: number;
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
     * Move logic for the markers. Creates mouse move and up listeners to determine
     * Where it should be moved. Only works for pairs currently, if more than two markers
     * Depend on each other, will need to be refactored.
     *
     * @param e
     */
    private readonly onMarkerClick;
}
//# sourceMappingURL=selection-window-boundary-marker.d.ts.map