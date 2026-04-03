import React from 'react';
/**
 * The type of the props for the {@link ViewportMaxSizer} component
 */
export interface ViewportMaxSizerProps {
    setMaxViewportSizePx: (maxPx: number) => void;
}
/**
 * Creates a non-interactive, invisible div that is as wide as possible in order to determine the maximum width
 * of a div that the browser will allow. When it determines this value, calls the setMaxViewportSizePx function provided
 * in props.
 * Note, this is memoized to prevent it from calling the setter repeatedly. It performs best if the provided setter
 * function is referentially stable.
 */
export declare const ViewportMaxSizer: React.NamedExoticComponent<ViewportMaxSizerProps>;
//# sourceMappingURL=viewport-max-sizer.d.ts.map