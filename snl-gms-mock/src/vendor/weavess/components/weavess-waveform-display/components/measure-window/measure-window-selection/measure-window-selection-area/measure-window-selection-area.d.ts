import * as React from 'react';
import type { MeasureWindowSelectionAreaProps } from './types';
/**
 * Memoized component that draws a measure window selection area and positions it according to the props provided.
 * Draws two divs, one that is a container and the other that is the actual visible overlay. The container spans
 * the full width of its parent. This allows us to reposition it using transform: translateX, which is more performant
 * than using left or right positions. See https://stackoverflow.com/questions/7108941/css-transform-vs-position/53892597
 * Note that, for optimal performance, all props should be treated as immutable.
 */
export declare const MeasureWindowSelectionArea: React.FC<MeasureWindowSelectionAreaProps>;
//# sourceMappingURL=measure-window-selection-area.d.ts.map