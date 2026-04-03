import React from 'react';
import type { SignalDetectionProps, SignalDetectionState } from './types';
export declare class SignalDetection extends React.PureComponent<SignalDetectionProps, SignalDetectionState> {
    /**
     * Constructor
     *
     * @param props Waveform props as SignalDetectionsProps
     */
    constructor(props: SignalDetectionProps);
    componentDidUpdate(prevProps: any): void;
    /**
     * Update the uncertainty seconds in state and call events onSignalDetectionDragEnd
     * if uncertainty marker drag has ended
     *
     * @param uncertaintyTime in epoch seconds
     * @param callDragEnd if to update events onSignalDetectionDragEnd
     */
    private readonly setUncertaintyInState;
    /**
     * Set new signal detection arrival time. Calls weavess events' onSignalDetectionDragEnd
     *
     * @param time to update
     */
    private readonly setSignalDetectionTime;
    /**
     * Update state's is editing uncertainty
     *
     * @param isEditing
     */
    private readonly setIsEditingTimeUncertainty;
    /**
     * Creates the left or right JSX.Element uncertainty marker
     *
     * @param initialConfiguration
     * @param uncertaintySecs
     * @param signalDetectionPosition
     * @param signalDetection
     * @param isLeftUncertaintyBar
     * @param isSplitChannelOverlayOpen
     * @returns JSX.Element or null if showUncertaintyBars is false
     */
    private readonly createUncertaintyElement;
    render(): React.JSX.Element | undefined;
}
//# sourceMappingURL=signal-detection.d.ts.map