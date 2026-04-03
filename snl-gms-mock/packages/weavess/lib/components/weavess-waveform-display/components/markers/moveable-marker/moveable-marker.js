/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import { deepEqual } from 'fast-equals';
import React from 'react';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * MoveableMarker Component. Vertical or Horizontal line that is moveable
 */
export class MoveableMarker extends React.PureComponent {
    /** Ref to the marker container element */
    containerRef;
    /** indicates if the mouse is dragging */
    isDragging = false;
    /**
     * Constructor
     *
     * @param props Moveable Marker props as MoveableMarkerProps
     */
    constructor(props) {
        super(props);
        this.state = {
            marker: props.marker
        };
    }
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     */
    componentDidUpdate() {
        // When not dragging update state to equal props marker
        if (!this.isDragging && !deepEqual(this.state.marker, this.props.marker)) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ marker: this.props.marker });
        }
    }
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess Moveable Marker Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    // eslint-disable-next-line react/sort-comp
    render() {
        return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        React.createElement("div", { className: "moveable-marker", "data-testid": "moveable-marker", ref: ref => {
                this.containerRef = ref;
            }, key: this.props?.name, style: {
                left: `${this.props.percentageLocation}%`
            }, onMouseDown: this.onMoveableMarkerClick }));
    }
    /**
     * Returns the minimum constraint of the moveable marker.
     */
    getMinConstraint = () => {
        let { minTimeSecsConstraint } = this.getMarker();
        if (minTimeSecsConstraint) {
            if (this.props.associatedStartMarker) {
                if (this.props.associatedStartMarker.timeSecs > minTimeSecsConstraint) {
                    minTimeSecsConstraint =
                        this.props.associatedStartMarker.timeSecs + this.getMinSelectionWindowDuration();
                }
            }
        }
        else {
            // use the associated start marker if one exists
            minTimeSecsConstraint = this.props.associatedStartMarker
                ? this.props.associatedStartMarker.timeSecs + this.getMinSelectionWindowDuration()
                : undefined;
        }
        return minTimeSecsConstraint || this.props.timeRange().startTimeSecs;
    };
    /**
     * Returns the minimum constraint percentage of the moveable marker.
     */
    getMinConstraintPercentage = () => {
        const smallPaddingPercent = this.getSmallPaddingPercent();
        const timeRange = this.props.timeRange();
        const timeWindow = timeRange.endTimeSecs - timeRange.startTimeSecs;
        const minTimeSecsConstraint = this.getMinConstraint();
        const min = minTimeSecsConstraint - timeRange.startTimeSecs;
        const minPercent = min / timeWindow + smallPaddingPercent;
        return minPercent * 100;
    };
    /**
     * Returns the maximum constraint of the moveable marker.
     */
    getMaxConstraint = () => {
        let { maxTimeSecsConstraint } = this.getMarker();
        if (maxTimeSecsConstraint) {
            if (this.props.associatedEndMarker) {
                if (this.props.associatedEndMarker.timeSecs < maxTimeSecsConstraint) {
                    maxTimeSecsConstraint =
                        this.props.associatedEndMarker.timeSecs - this.getMinSelectionWindowDuration();
                }
            }
        }
        else {
            // use the associated end marker if one exists
            maxTimeSecsConstraint = this.props.associatedEndMarker
                ? this.props.associatedEndMarker.timeSecs - this.getMinSelectionWindowDuration()
                : undefined;
        }
        return maxTimeSecsConstraint || this.props.timeRange().endTimeSecs;
    };
    /**
     * Returns the maximum constraint percentage of the moveable marker.
     */
    getMaxConstraintPercentage = () => {
        const smallPaddingPercent = this.getSmallPaddingPercent();
        const timeRange = this.props.timeRange();
        const timeWindow = timeRange.endTimeSecs - timeRange.startTimeSecs;
        const maxTimeSecsConstraint = this.getMaxConstraint();
        const max = maxTimeSecsConstraint - timeRange.startTimeSecs;
        const maxPercent = max / timeWindow - smallPaddingPercent;
        return maxPercent * 100;
    };
    /**
     * Move logic for the markers. Creates mouse move and up listeners to determine
     * Where it should be moved. Only works for pairs currently, if more than two markers
     * Depend on each other, will need to be refactored.
     *
     * @param e
     */
    onMoveableMarkerClick = (e) => {
        e.stopPropagation();
        const htmlEle = e.target;
        let mouseXOffset = e.clientX - htmlEle.offsetLeft; // Beginning X position of waveform display
        const fracPercentage = 100;
        const viewPortWidth = this.props.viewportClientWidth();
        const zoomRatio = viewPortWidth / (this.props.containerClientWidth() - this.props.labelWidthPx);
        // if different update state to reflect initially what props
        if (!deepEqual(this.props.marker, this.state.marker)) {
            this.setState({
                marker: this.props.marker
            });
        }
        const onMouseMove = (event) => {
            this.isDragging = true;
            if (!htmlEle)
                return;
            const mouseXPercent = ((event.clientX - mouseXOffset) / viewPortWidth) * zoomRatio;
            const offsetPercentGuard = 99;
            // Get the limited position based on the other moveable div (if exist)
            const timeWindow = this.props.timeRange().endTimeSecs - this.props.timeRange().startTimeSecs;
            let newPosPercent = this.determineMoveableMarkerPosition(mouseXPercent);
            // Guard to ensure stays on waveform
            newPosPercent = newPosPercent < 0 ? 0 : newPosPercent;
            newPosPercent = newPosPercent > offsetPercentGuard ? offsetPercentGuard : newPosPercent;
            htmlEle.style.left = `${newPosPercent * fracPercentage}%`;
            let timeSecs = newPosPercent * timeWindow + this.props.timeRange().startTimeSecs;
            const minConstraint = this.getMinConstraint();
            const maxConstraint = this.getMaxConstraint();
            if (timeSecs < minConstraint) {
                timeSecs = minConstraint;
            }
            else if (timeSecs > maxConstraint) {
                timeSecs = maxConstraint;
            }
            this.setState(prevState => ({
                marker: {
                    ...prevState.marker,
                    timeSecs
                }
            }));
            if (this.props.updateTimeWindowSelection) {
                this.props.updateTimeWindowSelection();
            }
            mouseXOffset = event.clientX - htmlEle.offsetLeft;
        };
        const onMouseUp = () => {
            if (this.props.onUpdateMarker) {
                this.props.onUpdateMarker(this.getMarker());
            }
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        this.isDragging = false;
    };
    /**
     * Return the marker depending on if we are dragging or not.
     * If not dragging then position is determined from the props
     *
     * @returns SelectionWindow
     */
    getMarker = () => {
        if (this.isDragging) {
            return this.state.marker;
        }
        return this.props.marker;
    };
    /**
     * Returns an small padding percentage.
     */
    getSmallPaddingPercent = () => {
        const smallPercent = 0.001;
        return this.props.getZoomRatio() * smallPercent;
    };
    /**
     * Returns the moveable marker position based on on a percentage provided.
     *
     * @param currentPercent
     */
    determineMoveableMarkerPosition = (currentPercent) => {
        const smallPaddingPercent = this.getSmallPaddingPercent();
        const timeRange = this.props.timeRange();
        const timeWindow = timeRange.endTimeSecs - timeRange.startTimeSecs;
        const minTimeSecsConstraint = this.getMinConstraint();
        const min = minTimeSecsConstraint && minTimeSecsConstraint < timeRange.startTimeSecs
            ? timeRange.startTimeSecs
            : minTimeSecsConstraint || timeRange.startTimeSecs;
        const minTime = min - timeRange.startTimeSecs;
        const minPercent = minTime / timeWindow + smallPaddingPercent;
        const maxTimeSecsConstraint = this.getMaxConstraint();
        const max = maxTimeSecsConstraint && maxTimeSecsConstraint > timeRange.endTimeSecs
            ? timeRange.endTimeSecs
            : maxTimeSecsConstraint || timeRange.endTimeSecs;
        const maxTime = max - timeRange.startTimeSecs;
        const maxPercent = maxTime / timeWindow - smallPaddingPercent;
        if (currentPercent < minPercent) {
            return minPercent;
        }
        if (currentPercent > maxPercent) {
            return maxPercent;
        }
        return currentPercent;
    };
    /**
     * Returns the minimum duration allowable between the start and end markers or 0 if not set
     * @returns number
     */
    getMinSelectionWindowDuration = () => {
        return this.props.minimumSelectionWindowDuration?.durationInSeconds ?? 0;
    };
}
//# sourceMappingURL=moveable-marker.js.map