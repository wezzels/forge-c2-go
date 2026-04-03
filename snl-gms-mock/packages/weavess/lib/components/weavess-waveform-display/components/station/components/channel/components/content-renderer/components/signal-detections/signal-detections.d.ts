import React from 'react';
import type { SignalDetectionsProps } from './types';
export declare class SignalDetections extends React.PureComponent<SignalDetectionsProps> {
    /**
     * Creates SignalDetection components
     *
     * @param props the signal detection props
     * @returns an array of signal detection elements as JSX.Element
     */
    private static readonly createSignalDetectionElements;
    /**
     * A memoized function for creating the signal detection elements.
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param props the signal detection props
     * @returns an array JSX elements
     */
    private readonly memoizedCreateSignalDetectionElements;
    /**
     * Constructor
     *
     * @param props Waveform props as SignalDetectionsProps
     */
    constructor(props: SignalDetectionsProps);
    render(): JSX.Element;
}
//# sourceMappingURL=signal-detections.d.ts.map