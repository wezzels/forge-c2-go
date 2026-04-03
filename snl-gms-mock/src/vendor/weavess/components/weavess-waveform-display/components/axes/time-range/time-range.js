import { WeavessConstants } from '@gms/weavess-core';
import * as React from 'react';
import { deltaTimeString, timeRangeDisplayString } from '../../../utils';
function InternalTimeRange(props) {
    const { labelWidthPx, currentZoomInterval } = props;
    const fullTimeString = timeRangeDisplayString(currentZoomInterval);
    const shortTimeString = timeRangeDisplayString(currentZoomInterval, 'HH:mm:ss.SSS');
    const veryShortTimeString = deltaTimeString(currentZoomInterval);
    return (React.createElement("div", { className: "weavess-wp-time-range", style: {
            left: `${labelWidthPx ?? WeavessConstants.DEFAULT_LABEL_WIDTH_PIXELS}px`
        } },
        React.createElement("span", { className: "very-short-time" }, veryShortTimeString),
        React.createElement("span", { className: "short-time" }, shortTimeString),
        React.createElement("span", { className: "full-time" }, fullTimeString)));
}
/**
 * A memoized component that simply draws a time range string at the desired location on the page.
 * If labelWidthPx are given, will draw them at that offset. Otherwise, defaults to WeavessConstants.DEFAULT_LABEL_WIDTH_PIXELS
 */
export const TimeRange = React.memo(InternalTimeRange);
//# sourceMappingURL=time-range.js.map