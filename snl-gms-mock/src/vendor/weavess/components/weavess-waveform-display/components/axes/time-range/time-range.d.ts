import * as React from 'react';
import type { TimeRangeProps } from './types';
declare function InternalTimeRange(props: TimeRangeProps): React.JSX.Element;
/**
 * A memoized component that simply draws a time range string at the desired location on the page.
 * If labelWidthPx are given, will draw them at that offset. Otherwise, defaults to WeavessConstants.DEFAULT_LABEL_WIDTH_PIXELS
 */
export declare const TimeRange: React.MemoExoticComponent<typeof InternalTimeRange>;
export {};
//# sourceMappingURL=time-range.d.ts.map