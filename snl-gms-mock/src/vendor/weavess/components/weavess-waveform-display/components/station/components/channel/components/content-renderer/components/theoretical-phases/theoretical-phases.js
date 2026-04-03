import { deepEqual } from 'fast-equals';
import memoizeOne from 'memoize-one';
import React from 'react';
import { calculateLeftPercent, calculateRightPercent } from '../../../../../../../../utils';
import { TheoreticalPhaseWindow } from '../../../../../../../theoretical-phase-window';
export class TheoreticalPhases extends React.PureComponent {
    /**
     * A memoized function for creating the theoretical phase window elements.
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param startTimeSecs epoch seconds start time
     * @param endTimeSecs epoch seconds end time
     * @param theoreticalPhaseWindows the theoretical phase windows
     *
     * @returns an array JSX elements
     */
    memoizedCreateTheoreticalPhaseWindowElements;
    /**
     * Constructor
     *
     * @param props Waveform props as TheoreticalPhasesProps
     */
    constructor(props) {
        super(props);
        this.memoizedCreateTheoreticalPhaseWindowElements = memoizeOne(TheoreticalPhases.createTheoreticalPhaseWindowElements, 
        /* tell memoize to use a deep comparison for complex objects */
        deepEqual);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    render() {
        return (React.createElement(React.Fragment, null, this.memoizedCreateTheoreticalPhaseWindowElements(this.props.displayInterval.startTimeSecs, this.props.displayInterval.endTimeSecs, this.props.theoreticalPhaseWindows)));
    }
    /**
     * Creates the theoretical phase window elements.
     *
     * @param startTimeSecs epoch seconds start time
     * @param endTimeSecs epoch seconds end time
     * @param theoreticalPhaseWindows the theoretical phase windows
     *
     * @returns an array of theoretical phase elements as JSX.Element
     */
    // eslint-disable-next-line react/sort-comp
    static createTheoreticalPhaseWindowElements = (startTimeSecs, endTimeSecs, theoreticalPhaseWindows) => {
        if (!theoreticalPhaseWindows)
            return [];
        return theoreticalPhaseWindows.map(theoreticalPhaseWindow => {
            const leftPos = calculateLeftPercent(theoreticalPhaseWindow.startTimeSecs, startTimeSecs, endTimeSecs);
            const rightPos = calculateRightPercent(theoreticalPhaseWindow.endTimeSecs, startTimeSecs, endTimeSecs);
            return (React.createElement(TheoreticalPhaseWindow, { id: theoreticalPhaseWindow.id, key: theoreticalPhaseWindow.id, color: theoreticalPhaseWindow.color, left: leftPos, right: rightPos, label: theoreticalPhaseWindow.label }));
        });
    };
}
//# sourceMappingURL=theoretical-phases.js.map