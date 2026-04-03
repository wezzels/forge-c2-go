import React from 'react';
import { Weavess } from '../weavess';
export interface WeavessLineChartExampleState {
    endTimeSecs: number;
    useTypedArray: boolean;
    numberOfHours: number;
    numberOfLines: number;
    timeOffsetSeconds: number;
    pointFrequency: number;
    isGeneratingData: boolean;
}
export declare class WeavessLineChartExample extends React.Component<object, WeavessLineChartExampleState> {
    private readonly startTimeSecs;
    private numberOfHoursTimeout;
    private numberOfLinesTimeout;
    private timeOffsetSecondsTimeout;
    private pointFrequencyTimeout;
    weavess: Weavess;
    private stations;
    constructor(props: object);
    componentDidUpdate(): void;
    render(): JSX.Element;
    private readonly validateNumberOfHours;
    private readonly onValueChangeNumberOfHours;
    private readonly onBlurNumberOfHours;
    private readonly validateNumberOfLines;
    private readonly onValueChangeNumberOfLines;
    private readonly onBlurNumberOfLines;
    private readonly validateTimeOffsetSeconds;
    private readonly onValueChangeTimeOffsetSeconds;
    private readonly onBlurTimeOffsetSeconds;
    private readonly validatePointFrequency;
    private readonly onValueChangePointFrequency;
    private readonly onBlurPointFrequency;
}
//# sourceMappingURL=example-line-chart.d.ts.map