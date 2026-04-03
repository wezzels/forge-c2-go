import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import { Weavess } from '../weavess';
export interface WeavessFlatLineExampleProps {
    showExampleControls: boolean;
}
export interface WeavessFlatLineExampleState {
    stations: WeavessTypes.Station[];
}
export declare class WeavessFlatLineExample extends React.Component<WeavessFlatLineExampleProps, WeavessFlatLineExampleState> {
    static defaultProps: WeavessFlatLineExampleProps;
    static SAMPLE_RATE: number;
    static NUM_SAMPLES: number;
    static startTimeSecs: number;
    static endTimeSecs: number;
    weavess: Weavess;
    constructor(props: WeavessFlatLineExampleProps);
    componentDidMount(): void;
    render(): JSX.Element;
    private readonly generateDummyData;
}
//# sourceMappingURL=example-flat-line.d.ts.map