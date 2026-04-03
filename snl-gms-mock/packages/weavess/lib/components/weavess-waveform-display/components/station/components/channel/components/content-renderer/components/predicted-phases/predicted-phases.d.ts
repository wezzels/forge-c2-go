import React from 'react';
import type { PredictedPhasesProps } from './types';
export declare class PredictedPhases extends React.PureComponent<PredictedPhasesProps, never> {
    /**
     * A memoized function for creating the predicted phases.
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param props the predicted phase props
     *
     * @returns an array JSX elements
     */
    private readonly memoizedCreatePredictivePhaseElements;
    /**
     * Constructor
     *
     * @param props Waveform props as PredictedPhasesProps
     */
    constructor(props: PredictedPhasesProps);
    render(): JSX.Element;
    /**
     * Creates Predictive phase components
     *
     * @param props
     * @returns an array of predictive phase elements as JSX.Element
     */
    private static readonly createPredictivePhaseElements;
}
//# sourceMappingURL=predicted-phases.d.ts.map