/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable react/destructuring-assignment */
import { Checkbox, Classes, Colors, FormGroup, Intent, Label, NumericInput, Spinner } from '@blueprintjs/core';
import { UILogger } from '@gms/ui-util';
import { WeavessConstants, WeavessTypes, WeavessUtil } from '@gms/weavess-core';
import * as d3 from 'd3';
import memoizeOne from 'memoize-one';
import React from 'react';
import { Weavess } from '../weavess';
const logger = UILogger.create('GMS_LOG_WEAVESS');
const EVENT_TIMEOUT_MS = 500;
const ONE_HOUR = 3600;
const MIN_OFFSET_SECONDS = 0;
const MAX_OFFSET_SECONDS = 1800;
const MIN_LINES = 1;
const MAX_LINES = 150;
const MIN_HOURS = 1;
const MAX_HOURS = 1152; // 48 Days
const MIN_POINT_FREQUENCY = 1;
const MAX_POINT_FREQUENCY = 60;
const INITIAL_HOURS = 24;
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(WeavessUtil.getSecureRandomNumber() * 16)];
    }
    return color;
};
const generateDummyData = memoizeOne((startTimeSecs, endTimeSecs, numberOfLines, useTypedArray, timeOffsetSeconds, pointFrequency) => {
    const start = new Date('2016-01-01T00:00:00Z').valueOf();
    const stations = [];
    const dataSegments = [];
    const timeToGlScale = d3.scaleLinear().domain([startTimeSecs, endTimeSecs]).range([0, 100]);
    for (let i = 0; i < numberOfLines; i += 1) {
        const data = Array.from({ length: endTimeSecs - startTimeSecs }, (v, idx) => ({
            timeSecs: startTimeSecs + pointFrequency * idx,
            value: WeavessUtil.getSecureRandomNumber() * 100
        }));
        let dataByTime;
        if (useTypedArray) {
            const values = new Float32Array(data.length * 2);
            let n = 0;
            data.forEach(value => {
                values[n] = timeToGlScale(value.timeSecs + timeOffsetSeconds);
                n += 1;
                values[n] = value.value;
                n += 1;
            });
            dataByTime = { values };
        }
        else {
            dataByTime = { values: data };
        }
        dataSegments.push({
            color: getRandomColor(),
            displayType: [WeavessTypes.DisplayType.LINE],
            pointSize: 4,
            data: dataByTime
        });
    }
    const channelSegmentsRecord = {};
    channelSegmentsRecord.data = [
        {
            configuredInputName: 'ExampleChannel',
            channelName: 'ExampleChannel',
            isSelected: false,
            wfFilterId: WeavessTypes.UNFILTERED,
            dataSegments
        }
    ];
    stations.push({
        id: 'id',
        name: ``,
        defaultChannels: [
            {
                isSelected: false,
                height: 750,
                yAxisTicks: [
                    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100
                ],
                defaultRange: {
                    min: -1,
                    max: 101
                },
                id: 'id',
                name: ``,
                timeOffsetSeconds,
                waveform: {
                    channelSegmentId: 'data',
                    channelSegmentsRecord
                }
            }
        ],
        nonDefaultChannels: undefined, // Set it to undefined means no Expand/Collapse button on Station Label
        areChannelsShowing: false
    });
    logger.debug(`Took ${(Date.now() - start) / 1000} seconds to generate data`);
    return stations;
    /* eslint-enable @typescript-eslint/no-magic-numbers */
});
function CustomYLabel() {
    return (React.createElement("div", { style: {
            width: '150px',
            transform: 'rotate(270deg)',
            transformOrigin: 'left top 0'
        } }, "Example Line Chart"));
}
export class WeavessLineChartExample extends React.Component {
    startTimeSecs = 1507593600; // Tue, 10 Oct 2017 00:00:00 GMT
    numberOfHoursTimeout;
    numberOfLinesTimeout;
    timeOffsetSecondsTimeout;
    pointFrequencyTimeout;
    weavess;
    stations = [];
    constructor(props) {
        super(props);
        this.state = {
            endTimeSecs: this.startTimeSecs + ONE_HOUR * INITIAL_HOURS,
            useTypedArray: true,
            numberOfHours: INITIAL_HOURS,
            numberOfLines: 10,
            timeOffsetSeconds: 0,
            pointFrequency: 10,
            isGeneratingData: false
        };
        this.stations = generateDummyData(this.startTimeSecs, this.state.endTimeSecs, this.state.numberOfLines, this.state.useTypedArray, this.state.timeOffsetSeconds, this.state.pointFrequency);
    }
    componentDidUpdate() {
        if (this.state.isGeneratingData) {
            new Promise(resolve => {
                setTimeout(() => {
                    this.stations = generateDummyData(this.startTimeSecs, this.state.endTimeSecs, this.state.numberOfLines, this.state.useTypedArray, this.state.timeOffsetSeconds, this.state.pointFrequency);
                    this.setState({
                        isGeneratingData: false
                    });
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                }, 200);
                resolve();
            }).catch(error => {
                logger.warn(`Failed to generate data ${error}`);
            });
        }
    }
    // eslint-disable-next-line react/sort-comp
    render() {
        return (React.createElement("div", { className: Classes.DARK, style: {
                height: '90%',
                width: '100%',
                padding: '0.5rem',
                color: Colors.GRAY4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } },
            this.state.isGeneratingData ? (React.createElement("div", { style: {
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 6
                } },
                React.createElement(Spinner, { intent: Intent.PRIMARY }))) : undefined,
            React.createElement("div", { className: Classes.DARK, style: {
                    height: '100%',
                    width: '100%'
                } },
                React.createElement("div", { style: {
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    } },
                    React.createElement("div", { style: {
                            display: 'block'
                        } },
                        React.createElement(FormGroup, { className: Classes.INLINE },
                            React.createElement(Checkbox, { label: "Use Typed Array", checked: this.state.useTypedArray, onClick: () => this.setState(prevState => ({ useTypedArray: !prevState.useTypedArray })) }),
                            React.createElement(Label, { className: Classes.INLINE },
                                "Number of Hours (1 - 1152 (48 days)):",
                                React.createElement(NumericInput, { className: Classes.INLINE, allowNumericCharactersOnly: true, onValueChange: this.onValueChangeNumberOfHours, onBlur: this.onBlurNumberOfHours, placeholder: "Enter a number", value: this.state.numberOfHours, min: MIN_HOURS, max: MAX_HOURS })),
                            React.createElement(Label, { className: Classes.INLINE },
                                "Number of Lines (1 - 150):",
                                React.createElement(NumericInput, { className: Classes.INLINE, allowNumericCharactersOnly: true, onValueChange: this.onValueChangeNumberOfLines, onBlur: this.onBlurNumberOfLines, placeholder: "Enter a number", value: this.state.numberOfLines, min: MIN_LINES, max: MAX_LINES })),
                            React.createElement(Label, { className: Classes.INLINE },
                                "Time Offset Seconds (0 - 1800):",
                                React.createElement(NumericInput, { className: Classes.INLINE, allowNumericCharactersOnly: true, onValueChange: this.onValueChangeTimeOffsetSeconds, onBlur: this.onBlurTimeOffsetSeconds, placeholder: "Enter a number", stepSize: 10, value: this.state.timeOffsetSeconds, min: MIN_OFFSET_SECONDS, max: MAX_OFFSET_SECONDS })),
                            React.createElement(Label, { className: Classes.INLINE },
                                "Point Frequency (1 - 60):",
                                React.createElement(NumericInput, { className: Classes.INLINE, allowNumericCharactersOnly: true, onValueChange: this.onValueChangePointFrequency, onBlur: this.onBlurPointFrequency, placeholder: "Enter a number", value: this.state.pointFrequency, min: MIN_POINT_FREQUENCY, max: MAX_POINT_FREQUENCY }))),
                        React.createElement("div", null,
                            "Number of Points per line:",
                            ' ',
                            (this.state.endTimeSecs - this.startTimeSecs) / this.state.pointFrequency),
                        React.createElement("div", null,
                            "Total number of Points:",
                            ' ',
                            ((this.state.endTimeSecs - this.startTimeSecs) / this.state.pointFrequency) *
                                this.state.numberOfLines)),
                    React.createElement("div", { style: {
                            flex: '1 1 auto',
                            position: 'relative'
                        } },
                        React.createElement("div", { style: {
                                position: 'absolute',
                                top: '0px',
                                bottom: '0px',
                                left: '0px',
                                right: '0px'
                            } },
                            React.createElement(Weavess, { ref: ref => {
                                    if (ref) {
                                        this.weavess = ref;
                                    }
                                }, activeSplitModeType: undefined, shouldThickenStationBorders: false, viewableInterval: {
                                    startTimeSecs: this.startTimeSecs,
                                    endTimeSecs: this.state.endTimeSecs
                                }, displayInterval: {
                                    startTimeSecs: this.startTimeSecs,
                                    endTimeSecs: this.state.endTimeSecs
                                }, stations: this.stations, initialConfiguration: {
                                    suppressLabelYAxis: false,
                                    labelWidthPx: 184,
                                    xAxisLabel: `My Custom X-Axis Label`
                                }, customLabel: CustomYLabel, events: WeavessConstants.DEFAULT_UNDEFINED_EVENTS })))))));
    }
    validateNumberOfHours = (value) => {
        if (value < MIN_HOURS) {
            return MIN_HOURS;
        }
        if (value > MAX_HOURS) {
            return MAX_HOURS;
        }
        return value;
    };
    onValueChangeNumberOfHours = (valueAsNumber) => {
        const numberOfHours = this.validateNumberOfHours(valueAsNumber);
        clearTimeout(this.numberOfHoursTimeout);
        this.numberOfHoursTimeout = setTimeout(() => {
            this.setState({
                endTimeSecs: this.startTimeSecs + numberOfHours * ONE_HOUR,
                numberOfHours,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    onBlurNumberOfHours = (e) => {
        const numberOfHours = this.validateNumberOfHours(Number(e.target.value));
        clearTimeout(this.numberOfHoursTimeout);
        this.numberOfHoursTimeout = setTimeout(() => {
            this.setState({
                endTimeSecs: this.startTimeSecs + numberOfHours * ONE_HOUR,
                numberOfHours,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    validateNumberOfLines = (value) => {
        if (value < MIN_LINES) {
            return MIN_LINES;
        }
        if (value > MAX_LINES) {
            return MAX_LINES;
        }
        return value;
    };
    onValueChangeNumberOfLines = (valueAsNumber) => {
        const numberOfLines = this.validateNumberOfLines(valueAsNumber);
        clearTimeout(this.numberOfLinesTimeout);
        this.numberOfLinesTimeout = setTimeout(() => {
            this.setState({
                numberOfLines,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    onBlurNumberOfLines = (e) => {
        const numberOfLines = this.validateNumberOfLines(Number(e.target.value));
        clearTimeout(this.numberOfLinesTimeout);
        this.numberOfLinesTimeout = setTimeout(() => {
            this.setState({
                numberOfLines,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    validateTimeOffsetSeconds = (value) => {
        if (value < MIN_OFFSET_SECONDS) {
            return MIN_OFFSET_SECONDS;
        }
        if (value > MAX_OFFSET_SECONDS) {
            return MAX_OFFSET_SECONDS;
        }
        return value;
    };
    onValueChangeTimeOffsetSeconds = (valueAsNumber) => {
        const timeOffsetSeconds = this.validateTimeOffsetSeconds(valueAsNumber);
        clearTimeout(this.timeOffsetSecondsTimeout);
        this.timeOffsetSecondsTimeout = setTimeout(() => {
            this.setState({
                timeOffsetSeconds,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    onBlurTimeOffsetSeconds = (e) => {
        const timeOffsetSeconds = this.validateTimeOffsetSeconds(Number(e.target.value));
        clearTimeout(this.timeOffsetSecondsTimeout);
        this.timeOffsetSecondsTimeout = setTimeout(() => {
            this.setState({
                timeOffsetSeconds,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    validatePointFrequency = (value) => {
        if (value < MIN_POINT_FREQUENCY) {
            return MIN_POINT_FREQUENCY;
        }
        if (value > MAX_POINT_FREQUENCY) {
            return MAX_POINT_FREQUENCY;
        }
        return value;
    };
    onValueChangePointFrequency = (valueAsNumber) => {
        const pointFrequency = this.validatePointFrequency(valueAsNumber);
        clearTimeout(this.pointFrequencyTimeout);
        this.pointFrequencyTimeout = setTimeout(() => {
            this.setState({
                pointFrequency,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
    onBlurPointFrequency = (e) => {
        const pointFrequency = this.validatePointFrequency(Number(e.target.value));
        clearTimeout(this.pointFrequencyTimeout);
        this.pointFrequencyTimeout = setTimeout(() => {
            this.setState({
                pointFrequency,
                isGeneratingData: true
            });
        }, EVENT_TIMEOUT_MS);
    };
}
//# sourceMappingURL=example-line-chart.js.map