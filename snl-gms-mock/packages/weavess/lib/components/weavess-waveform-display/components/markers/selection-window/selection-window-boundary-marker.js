/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import React from 'react';
import { calculateLeftPercent } from '../../../utils';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * SelectionWindowBoundaryMarker Component
 */
export class SelectionWindowBoundaryMarker extends React.PureComponent {
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    lineBorderWidthPx = 1;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess Selection Window Boundary Marker Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    // eslint-disable-next-line react/sort-comp
    render() {
        const timeRange = this.props.timeRange();
        const percentageLocation = calculateLeftPercent(this.props.timeSecs, timeRange.startTimeSecs, timeRange.endTimeSecs);
        return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        React.createElement("div", { className: "moveable-marker", "data-testid": "selection-window-boundary-marker", key: this.props?.name, style: {
                left: `${percentageLocation}%`,
                width: `${this.props.width ?? this.lineBorderWidthPx}px`,
                borderInlineEnd: `${this.props.color} ${this.props.lineStyle} ${this.props.width ?? this.lineBorderWidthPx}px`,
                transform: `translateX(-50%)`
            }, onMouseDown: this.onMarkerClick }));
    }
    /**
     * Move logic for the markers. Creates mouse move and up listeners to determine
     * Where it should be moved. Only works for pairs currently, if more than two markers
     * Depend on each other, will need to be refactored.
     *
     * @param e
     */
    onMarkerClick = (mouseClickEvent) => {
        mouseClickEvent.stopPropagation();
        const onMouseMove = (mouseMoveEvent) => {
            this.props.setIsUpdating(true);
            const currentTimeSecs = this.props.getTimeSecsForClientX(mouseMoveEvent.clientX);
            this.props.onMarkerUpdated(this.props.boundaryType, currentTimeSecs);
        };
        const onMouseUp = (mouseUpEvent) => {
            this.props.setIsUpdating(false);
            const currentTimeSecs = this.props.getTimeSecsForClientX(mouseUpEvent.clientX);
            this.props.onMarkerUpdated(this.props.boundaryType, currentTimeSecs);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
}
//# sourceMappingURL=selection-window-boundary-marker.js.map