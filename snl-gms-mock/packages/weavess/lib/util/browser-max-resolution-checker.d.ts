import React from 'react';
/**
 * The type of the props for the {@link BrowserMaxResolutionChecker} component
 */
export interface BrowserMaxResolutionCheckerProps {
    maxSizePx: number;
    setMaxElementResolution: (sigFigs: number) => void;
}
/**
 * Finds the point at which the size does not change when adding 1 to an element
 */
export declare const BrowserMaxResolutionChecker: React.NamedExoticComponent<BrowserMaxResolutionCheckerProps>;
//# sourceMappingURL=browser-max-resolution-checker.d.ts.map