import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import { Weavess } from '../weavess';
export interface WeavessExampleProps {
    showExampleControls: boolean;
}
export interface WeavessExampleState {
    toggleShowContent: string;
    stations: WeavessTypes.Station[];
    offset: number;
    isOnChannelExpandedEnabled: boolean;
    isOnChannelCollapsedEnabled: boolean;
    isOnContextMenuEnabled: boolean;
    isOnChannelLabelClickEnabled: boolean;
    isOnChannelClickEnabled: boolean;
    isOnSignalDetectionClickEnabled: boolean;
    isOnSignalDetectionDragEndEnabled: boolean;
    isOnSignalDetectionContextMenuEnabled: boolean;
    isOnPredictivePhaseClickEnabled: boolean;
    isOnPredictivePhaseContextMenuEnabled: boolean;
    isOnKeyPressEnabled: boolean;
    isOnMaskClickEnabled: boolean;
    isUpdateMarkersEnabled: boolean;
    isMoveSelectionWindowsEnabled: boolean;
    isUpdateSelectionWindowsEnabled: boolean;
    isOnClickSelectionWindowsEnabled: boolean;
    isOnMeasureWindowUpdatedEnabled: boolean;
    isOnZoomChangeEnabled: boolean;
}
export declare class WeavessExample extends React.Component<WeavessExampleProps, WeavessExampleState> {
    static defaultProps: WeavessExampleProps;
    static SAMPLE_RATE: number;
    static NUM_SAMPLES: number;
    static startTimeSecs: number;
    static endTimeSecs: number;
    weavess: Weavess;
    constructor(props: WeavessExampleProps);
    componentDidMount(): void;
    render(): JSX.Element;
    private readonly getToggleContentLabel;
    private readonly generateDummyData;
    private readonly onOffsetChange;
}
//# sourceMappingURL=example-weavess.d.ts.map