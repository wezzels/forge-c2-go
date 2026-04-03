/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import React from 'react';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * Displays a window of time on a channel where a phase may theoretically exist.
 */
export class TheoreticalPhaseWindow extends React.PureComponent {
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
        logger.error(`Weavess Theoretical Phase Window Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    render() {
        return (React.createElement("div", { className: "theoretical-phase-window" },
            React.createElement("div", { className: "theoretical-phase-window-selection", style: {
                    backgroundColor: this.props.color,
                    left: `${this.props.left}%`,
                    right: `${this.props.right}%`
                } }),
            React.createElement("div", { className: "theoretical-phase-window-label", style: {
                    color: this.props.color,
                    left: `${this.props.left}%`,
                    right: `${this.props.right}%`
                } }, this.props.label)));
    }
}
//# sourceMappingURL=theoretical-phase-window.js.map