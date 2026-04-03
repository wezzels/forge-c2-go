/* eslint-disable react/destructuring-assignment */
import classNames from 'classnames';
import React from 'react';
import { calculateLeftPercent } from '../../../utils';
import { useMousePosition } from './utils';
/**
 * An marker that follows your mouse
 */
export function FollowPickMarker(props) {
    const mousePosition = useMousePosition();
    let time = props.getTimeSecsForClientX(mousePosition.x);
    // round up to nearest milliseconds
    time = Math.round(time * 1000) / 1000;
    // Calculation for mouse position needs to be on the display interval without offset
    const percentLeft = calculateLeftPercent(time, props.displayInterval.startTimeSecs, props.displayInterval.endTimeSecs);
    const positionX = (percentLeft * (props.parentWidthPx ?? 0)) / 100;
    const pickMarkerLabelStyle = {
        left: '4px',
        filter: props.filter ?? ''
    };
    return (React.createElement("div", { role: "presentation", className: classNames([`follow-pick-marker`]), style: {
            '--follow-pick-marker-color': props.color ?? '',
            transform: `translateX(${positionX}px)`,
            position: 'relative',
            height: '100%',
            filter: props.filter ?? ''
        } },
        React.createElement("div", { className: "follow-pick-marker__vertical" }),
        React.createElement("div", { className: classNames([`follow-pick-marker__label`]), style: pickMarkerLabelStyle }, props.label)));
}
//# sourceMappingURL=follow-pick-marker.js.map