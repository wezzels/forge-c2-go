import { deepEqual } from 'fast-equals';
import memoizeOne from 'memoize-one';
import React from 'react';
import { SignalDetection } from './signal-detection';
export class SignalDetections extends React.PureComponent {
    /**
     * Creates SignalDetection components
     *
     * @param props the signal detection props
     * @returns an array of signal detection elements as JSX.Element
     */
    static createSignalDetectionElements = (props) => {
        if (!props.signalDetections)
            return [];
        return props.signalDetections.map(signalDetection => {
            return (React.createElement(SignalDetection, { key: `${signalDetection.id}-top`, stationId: props.stationId, channelId: props.channelId, signalDetection: signalDetection, displayInterval: props.displayInterval, viewableInterval: props.viewableInterval, offsetSecs: props.offsetSecs, events: props.events, isOnSplitChannel: props.isOnSplitChannel, initialConfiguration: props.initialConfiguration, getTimeSecsForClientX: props.getTimeSecsForClientX, getClientXForTimeSecs: props.getClientXForTimeSecs, toggleDragIndicator: props.toggleDragIndicator, positionDragIndicator: props.positionDragIndicator }));
        });
    };
    /**
     * A memoized function for creating the signal detection elements.
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param props the signal detection props
     * @returns an array JSX elements
     */
    memoizedCreateSignalDetectionElements;
    /**
     * Constructor
     *
     * @param props Waveform props as SignalDetectionsProps
     */
    constructor(props) {
        super(props);
        this.memoizedCreateSignalDetectionElements = memoizeOne(SignalDetections.createSignalDetectionElements, 
        /* tell memoize to use a deep comparison for complex objects */
        deepEqual);
        this.state = {};
    }
    render() {
        return React.createElement(React.Fragment, null, this.memoizedCreateSignalDetectionElements(this.props));
    }
}
//# sourceMappingURL=signal-detections.js.map