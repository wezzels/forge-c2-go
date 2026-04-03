import React from 'react';
import type { VerticalMarkerProps } from './types';
/**
 * VerticalMarker Component. Is not moveable
 */
export declare class VerticalMarker extends React.PureComponent<VerticalMarkerProps, never> {
    /** Ref to the marker container element */
    containerRef: HTMLElement | null;
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
}
//# sourceMappingURL=vertical-marker.d.ts.map