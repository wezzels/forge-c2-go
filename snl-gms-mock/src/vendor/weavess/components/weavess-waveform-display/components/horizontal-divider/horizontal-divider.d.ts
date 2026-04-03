import * as React from 'react';
import type { HorizontalDividerProps } from './types';
/**
 * Returns a callback used by the ResizeObserver for the horizontal divider.
 *
 * @param ref the reference object for obtaining the BoundingClientRect
 * @param setHeight a state action setter for setting the height
 * @param setWidth a state action setter for setting the width
 * @returns
 */
export declare const useResizeObserverCallback: (ref: React.MutableRefObject<HTMLDivElement | null>, setHeight: React.Dispatch<React.SetStateAction<number | undefined>>, setWidth: React.Dispatch<React.SetStateAction<number | undefined>>) => () => void;
/**
 * Renders a top and bottom container with a resizable horizontal divider between them.
 * Will fill the space available to it.
 * Top and bottom containers can be ReactElements or functions that return a React Element.
 */
export declare function HorizontalDivider({ topComponent, bottomComponent, topClassName, bottomClassName, showTop, showBottom, minTopHeight, maxTopHeight, onResizeEnd }: HorizontalDividerProps): React.JSX.Element;
//# sourceMappingURL=horizontal-divider.d.ts.map