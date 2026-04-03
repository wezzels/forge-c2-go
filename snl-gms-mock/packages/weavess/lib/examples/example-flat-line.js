/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Classes, Colors } from '@blueprintjs/core';
import { WeavessConstants, WeavessTypes, WeavessUtil } from '@gms/weavess-core';
import React from 'react';
import { Weavess } from '../weavess';
export class WeavessFlatLineExample extends React.Component {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        // eslint-disable-next-line react/default-props-match-prop-types
        showExampleControls: true
    };
    static SAMPLE_RATE = 0.1;
    static NUM_SAMPLES = WeavessFlatLineExample.SAMPLE_RATE * 1800; // 10 minutes of data
    static startTimeSecs = 1507593600; // Tue, 10 Oct 2017 00:00:00 GMT
    static endTimeSecs = WeavessFlatLineExample.startTimeSecs + 1800; // + 30 minutes
    weavess;
    constructor(props) {
        super(props);
        this.state = {
            stations: []
        };
    }
    componentDidMount() {
        this.setState({
            stations: this.generateDummyData()
        });
    }
    // eslint-disable-next-line react/sort-comp
    render() {
        const { stations } = this.state;
        return (React.createElement("div", { className: Classes.DARK, style: {
                height: '90%',
                width: '100%',
                padding: '0.5rem',
                color: Colors.GRAY4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } },
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
                                    startTimeSecs: WeavessFlatLineExample.startTimeSecs,
                                    endTimeSecs: WeavessFlatLineExample.endTimeSecs
                                }, displayInterval: {
                                    startTimeSecs: WeavessFlatLineExample.startTimeSecs,
                                    endTimeSecs: WeavessFlatLineExample.endTimeSecs
                                }, stations: stations, initialConfiguration: {
                                    suppressLabelYAxis: true
                                }, events: WeavessConstants.DEFAULT_UNDEFINED_EVENTS, markers: {
                                    verticalMarkers: [
                                        {
                                            id: 'marker',
                                            color: 'pink',
                                            lineStyle: WeavessTypes.LineStyle.DASHED,
                                            timeSecs: WeavessFlatLineExample.startTimeSecs + 1200
                                        }
                                    ]
                                } })))))));
    }
    // eslint-disable-next-line class-methods-use-this
    generateDummyData = () => {
        const stations = [];
        // create channels w/ random noise as data
        for (let i = 0; i < 10; i += 1) {
            const values = [];
            let value = Math.round(WeavessUtil.getSecureRandomNumber());
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 100, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 300, value });
            value = Math.round(WeavessUtil.getSecureRandomNumber());
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 300, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1000, value });
            value = Math.round(WeavessUtil.getSecureRandomNumber());
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1000, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1100, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1200, value });
            value = Math.round(WeavessUtil.getSecureRandomNumber());
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1200, value });
            value = Math.round(WeavessUtil.getSecureRandomNumber());
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1200, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1300, value });
            value = Math.round(WeavessUtil.getSecureRandomNumber());
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1300, value });
            values.push({ timeSecs: WeavessFlatLineExample.startTimeSecs + 1500, value });
            values.push({ timeSecs: WeavessFlatLineExample.endTimeSecs, value });
            const data = { values };
            const channelSegmentsRecord = {};
            channelSegmentsRecord.data = [
                {
                    configuredInputName: 'ExampleChannel',
                    channelName: 'ExampleChannel',
                    wfFilterId: WeavessTypes.UNFILTERED,
                    isSelected: false,
                    dataSegments: [
                        {
                            color: 'dodgerblue',
                            displayType: [WeavessTypes.DisplayType.LINE],
                            pointSize: 4,
                            data
                        }
                    ]
                }
            ];
            stations.push({
                id: String(i),
                name: `station ${i}`,
                defaultChannels: [
                    {
                        isSelected: false,
                        height: 50,
                        defaultRange: {
                            min: -1,
                            max: 2
                        },
                        id: String(i),
                        name: `channel ${i}`,
                        waveform: {
                            channelSegmentId: 'data',
                            channelSegmentsRecord,
                            markers: {
                                verticalMarkers: [
                                    {
                                        id: 'marker',
                                        color: 'lime',
                                        lineStyle: WeavessTypes.LineStyle.DASHED,
                                        timeSecs: WeavessFlatLineExample.startTimeSecs + 5
                                    }
                                ]
                            }
                        }
                    }
                ],
                nonDefaultChannels: undefined, // Set it to undefined means no Expand/Collapse button on Station Label,
                areChannelsShowing: false
            });
        }
        return stations;
    };
}
//# sourceMappingURL=example-flat-line.js.map