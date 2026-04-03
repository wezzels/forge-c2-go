import { deepEqual } from 'fast-equals';
import memoizeOne from 'memoize-one';
import React from 'react';
import { calculateLeftPercent } from '../../../../../../../../utils';
import { PickMarker } from '../../../../../../../markers';
export class PredictedPhases extends React.PureComponent {
    /**
     * A memoized function for creating the predicted phases.
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param props the predicted phase props
     *
     * @returns an array JSX elements
     */
    memoizedCreatePredictivePhaseElements;
    /**
     * Constructor
     *
     * @param props Waveform props as PredictedPhasesProps
     */
    constructor(props) {
        super(props);
        this.memoizedCreatePredictivePhaseElements = memoizeOne(PredictedPhases.createPredictivePhaseElements, 
        /* tell memoize to use a deep comparison for complex objects */
        deepEqual);
    }
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    render() {
        return React.createElement(React.Fragment, null, this.memoizedCreatePredictivePhaseElements(this.props));
    }
    /**
     * Creates Predictive phase components
     *
     * @param props
     * @returns an array of predictive phase elements as JSX.Element
     */
    // eslint-disable-next-line react/sort-comp
    static createPredictivePhaseElements = (props) => {
        if (!props.predictedPhases)
            return [];
        return props.predictedPhases.map(predictivePhase => {
            const predictivePhasePosition = calculateLeftPercent(predictivePhase.timeSecs, props.displayInterval.startTimeSecs, props.displayInterval.endTimeSecs);
            return (React.createElement(PickMarker
            // eslint-disable-next-line react/jsx-props-no-spreading
            , { ...predictivePhase, key: predictivePhase.id, channelId: props.channelId, predicted: true, isSelected: predictivePhase.isSelected, isSelectable: false, isActionTarget: false, isDraggable: false, startTimeSecs: props.displayInterval.startTimeSecs, endTimeSecs: props.displayInterval.endTimeSecs, viewableInterval: props.viewableInterval, offsetSecs: props.offsetSecs, position: predictivePhasePosition, getTimeSecsForClientX: props.getTimeSecsForClientX, getClientXForTimeSecs: props.getClientXForTimeSecs, onClick: props.events && props.events.onPredictivePhaseClick
                    ? props.events.onPredictivePhaseClick
                    : undefined, onContextMenu: props.events && props.events.onPredictivePhaseContextMenu
                    ? props.events.onPredictivePhaseContextMenu
                    : undefined, toggleDragIndicator: props.toggleDragIndicator, positionDragIndicator: props.positionDragIndicator }));
        });
    };
}
//# sourceMappingURL=predicted-phases.js.map