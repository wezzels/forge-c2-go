/* eslint-disable react/jsx-no-useless-fragment */
import { Tooltip } from '@blueprintjs/core';
import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
/**
 * Creates a distance/azimuth value for the label with wrapped tooltips and classes for
 * styling. Use km vs degree ('\u00B0') symbol depending on distanceUnits enum from props
 *
 */
export function InternalDistanceAzimuth(props) {
    const { distanceUnits, distance, azimuth } = props;
    const disFixBy = distanceUnits === WeavessTypes.DistanceUnits.Degrees ? 1 : 2;
    return (React.createElement(React.Fragment, null,
        distance !== 0 && (React.createElement(Tooltip, { className: "label-tooltip-wrapper__value", content: `Distance (${distanceUnits})` },
            React.createElement(React.Fragment, null,
                distance.toFixed(disFixBy),
                distanceUnits === WeavessTypes.DistanceUnits.Km ? ' km' : '\u00B0'))),
        azimuth !== 0 && (React.createElement(React.Fragment, null,
            "/",
            React.createElement(Tooltip, { className: "label-tooltip-wrapper__value", content: "Azimuth (degrees)" },
                React.createElement(React.Fragment, null, `${azimuth.toFixed(1)}\u00B0`))))));
}
export const DistanceAzimuth = React.memo(InternalDistanceAzimuth);
//# sourceMappingURL=distance-azimuth.js.map