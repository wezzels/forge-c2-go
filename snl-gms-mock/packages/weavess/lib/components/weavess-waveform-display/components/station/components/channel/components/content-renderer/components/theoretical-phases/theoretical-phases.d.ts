import React from 'react';
import type { TheoreticalPhasesProps } from './types';
export declare class TheoreticalPhases extends React.PureComponent<TheoreticalPhasesProps, never> {
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
    private readonly memoizedCreateTheoreticalPhaseWindowElements;
    /**
     * Constructor
     *
     * @param props Waveform props as TheoreticalPhasesProps
     */
    constructor(props: TheoreticalPhasesProps);
    render(): JSX.Element;
    /**
     * Creates the theoretical phase window elements.
     *
     * @param startTimeSecs epoch seconds start time
     * @param endTimeSecs epoch seconds end time
     * @param theoreticalPhaseWindows the theoretical phase windows
     *
     * @returns an array of theoretical phase elements as JSX.Element
     */
    private static readonly createTheoreticalPhaseWindowElements;
}
//# sourceMappingURL=theoretical-phases.d.ts.map