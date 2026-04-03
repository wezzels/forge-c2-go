/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import React from 'react';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * VerticalMarker Component. Is not moveable
 */
export class VerticalMarker extends React.PureComponent {
    /** Ref to the marker container element */
    containerRef;
    lineBorderWidthPx = 1;
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess Vertical Marker Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    render() {
        return (React.createElement("div", { className: "vertical-marker", ref: ref => {
                this.containerRef = ref;
            }, key: this.props?.name, "data-cy": "weavess-static-vertical-marker", "data-cy-left": `${this.props.percentageLocation}`, "data-cy-color": `${this.props.color}`, style: {
                // offset the vertical marker by half its total width so it is centered.
                left: `calc(${this.props.percentageLocation}% - 0px)`,
                width: `${this.props.width ?? this.lineBorderWidthPx}px`,
                borderInlineEnd: `${this.props.color} ${this.props.lineStyle} ${this.props.width ?? this.lineBorderWidthPx}px`,
                transform: `translateX(-50%)`
            } }));
    }
}
//# sourceMappingURL=vertical-marker.js.map