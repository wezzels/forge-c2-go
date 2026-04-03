/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable react/destructuring-assignment */
import { Button, Checkbox, Classes, Colors, Label, NumericInput } from '@blueprintjs/core';
import { secondsToString } from '@gms/common-util';
import { toast, ToastContainer } from '@gms/ui-util';
import { WeavessTypes, WeavessUtil } from '@gms/weavess-core';
import * as d3 from 'd3';
import defer from 'lodash/defer';
import React from 'react';
import { Weavess } from '../weavess';
import { rainbowSpectrogramData, rainbowSpectrogramFrequencyStep, rainbowSpectrogramTimeStep, spectrogramData, spectrogramFrequencyStep, spectrogramTimeStep } from './sample-data/spectrum-data';
export class WeavessExample extends React.Component {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        // eslint-disable-next-line react/default-props-match-prop-types
        showExampleControls: true
    };
    static SAMPLE_RATE = 40;
    static NUM_SAMPLES = WeavessExample.SAMPLE_RATE * 600; // 10 minutes of data
    static startTimeSecs = 1507593600; // Tue, 10 Oct 2017 00:00:00 GMT
    static endTimeSecs = WeavessExample.startTimeSecs + 1800; // + 30 minutes
    weavess;
    constructor(props) {
        super(props);
        this.state = {
            toggleShowContent: '',
            stations: [],
            offset: 0,
            isOnChannelExpandedEnabled: false,
            isOnChannelCollapsedEnabled: false,
            isOnContextMenuEnabled: false,
            isOnChannelLabelClickEnabled: false,
            isOnChannelClickEnabled: false,
            isOnSignalDetectionClickEnabled: false,
            isOnSignalDetectionDragEndEnabled: false,
            isOnSignalDetectionContextMenuEnabled: false,
            isOnPredictivePhaseClickEnabled: false,
            isOnPredictivePhaseContextMenuEnabled: false,
            isOnKeyPressEnabled: false,
            isOnMaskClickEnabled: false,
            isUpdateMarkersEnabled: false,
            isMoveSelectionWindowsEnabled: false,
            isUpdateSelectionWindowsEnabled: false,
            isOnClickSelectionWindowsEnabled: false,
            isOnMeasureWindowUpdatedEnabled: false,
            isOnZoomChangeEnabled: false
        };
    }
    componentDidMount() {
        this.setState({
            toggleShowContent: this.getToggleContentLabel(),
            stations: this.generateDummyData()
        });
    }
    // eslint-disable-next-line react/sort-comp, complexity
    render() {
        const styleFlexItem = {
            width: '315px'
        };
        const styleToolbar = {
            display: 'flex',
            justifyItems: 'right',
            textAlign: 'right'
        };
        const styleToolbarItem = {
            margin: '6px',
            whiteSpace: 'nowrap'
        };
        const labelEvents = {
            onChannelCollapsed: this.state.isOnChannelCollapsedEnabled
                ? (channelId) => {
                    toast.info(`onChannelCollapsed: channelId:${channelId}`);
                }
                : undefined,
            onChannelExpanded: this.state.isOnChannelExpandedEnabled
                ? (channelId) => {
                    toast.info(`onChannelExpanded: channelId:${channelId}`);
                }
                : undefined,
            onChannelLabelClick: this.state.isOnChannelLabelClickEnabled
                ? (e, channelId) => {
                    toast.info(`onChannelLabelClick: channelId:${channelId}`);
                }
                : undefined
        };
        const waveformEvents = {
            onContextMenu: this.state.isOnContextMenuEnabled
                ? (e, channelId) => {
                    toast.info(`onContextMenu: channelId:${channelId}`);
                }
                : undefined,
            onChannelClick: this.state.isOnChannelClickEnabled
                ? (e, channel, timeSecs) => {
                    toast.info(`onChannelClick: channelId:${channel.id} timeSecs:${timeSecs}`);
                }
                : undefined,
            onSignalDetectionContextMenu: this.state.isOnSignalDetectionContextMenuEnabled
                ? (e, channelId, sdId) => {
                    toast.info(`onSignalDetectionContextMenu: channelId:${channelId} sdId:${sdId}`);
                }
                : undefined,
            onSignalDetectionClick: this.state.isOnSignalDetectionClickEnabled
                ? (e, sdId) => {
                    toast.info(`onSignalDetectionClick: sdId:${sdId}`);
                }
                : undefined,
            onSignalDetectionDragEnd: this.state.isOnSignalDetectionDragEndEnabled
                ? (sdId, timeSecs) => {
                    toast.info(`onSignalDetectionDragEnd: sdId:${sdId} timeSecs:${timeSecs}`);
                }
                : undefined,
            onPredictivePhaseContextMenu: this.state.isOnPredictivePhaseContextMenuEnabled
                ? (e, channelId, id) => {
                    toast.info(`onPredictivePhaseContextMenu: channelId:${channelId} id:${id}`);
                }
                : undefined,
            onPredictivePhaseClick: this.state.isOnPredictivePhaseClickEnabled
                ? (e, id) => {
                    toast.info(`onPredictivePhaseClick: id:${id}`);
                }
                : undefined,
            onMaskClick: this.state.isOnMaskClickEnabled
                ? (event, channelId, maskId) => {
                    toast.info(`onMaskClick: channelId:${channelId} maskId:${String(maskId)}`);
                }
                : undefined,
            onMeasureWindowUpdated: this.state.isOnMeasureWindowUpdatedEnabled
                ? (isVisible, channelId, mStartTimeSecs, mEndTimeSecs, heightPx) => {
                    toast.info(`onMeasureWindowUpdated: isVisible:${isVisible} channelId:${channelId} startTimeSecs:${mStartTimeSecs} endTimeSecs:${mEndTimeSecs} heightPx:${heightPx}`);
                }
                : undefined,
            onUpdateMarker: this.state.isUpdateMarkersEnabled
                ? (channelId, marker) => {
                    const markerStr = `channelId: ${channelId} :: ${secondsToString(marker.timeSecs)}`;
                    toast.info(`onUpdateMarker: marker:${markerStr}`);
                }
                : undefined,
            onMoveSelectionWindow: this.state.isMoveSelectionWindowsEnabled
                ? (channelId, selection) => {
                    const selectionStr = `channelId: ${channelId} :: start: ${secondsToString(selection.startMarker.timeSecs)} end: ${secondsToString(selection.endMarker.timeSecs)}`;
                    toast.info(`onMoveSelectionWindow: selection:${selectionStr}`);
                }
                : undefined,
            onUpdateSelectionWindow: this.state.isUpdateSelectionWindowsEnabled
                ? (channelId, selection) => {
                    const selectionStr = `channelId: ${channelId} :: start: ${secondsToString(selection.startMarker.timeSecs)} end: ${secondsToString(selection.endMarker.timeSecs)}`;
                    toast.info(`onUpdateSelectionWindow: selection:${selectionStr}`);
                }
                : undefined,
            onClickSelectionWindow: this.state.isOnClickSelectionWindowsEnabled
                ? (channelId, selection, timeSecs) => {
                    toast.info(`onClickSelectionWindow: channelId: ${channelId} :: timeSecs: ${timeSecs}`);
                }
                : undefined
        };
        const onKeyPress = this.state.isOnKeyPressEnabled
            ? (e, clientX, clientY, channel, timeSecs) => {
                toast.info(`onKeyPress: clientX:${clientX} clientY:${clientY} channelId:${channel.id} timeSecs:${timeSecs}`);
            }
            : undefined;
        const events = {
            stationEvents: {
                defaultChannelEvents: {
                    labelEvents,
                    events: waveformEvents,
                    onKeyPress
                },
                nonDefaultChannelEvents: {
                    labelEvents,
                    events: waveformEvents,
                    onKeyPress
                }
            },
            onUpdateMarker: this.state.isUpdateMarkersEnabled
                ? (marker) => {
                    const markerStr = `${secondsToString(marker.timeSecs)}`;
                    toast.info(`onUpdateMarker: marker:${markerStr}`);
                }
                : undefined,
            onMoveSelectionWindow: this.state.isMoveSelectionWindowsEnabled
                ? (selection) => {
                    const selectionStr = `start: ${secondsToString(selection.startMarker.timeSecs)} end: ${secondsToString(selection.endMarker.timeSecs)}`;
                    toast.info(`onMoveSelectionWindow: selection:${selectionStr}`);
                }
                : undefined,
            onUpdateSelectionWindow: this.state.isUpdateSelectionWindowsEnabled
                ? (selection) => {
                    const selectionStr = `start: ${selection.startMarker.timeSecs} end: ${secondsToString(selection.endMarker.timeSecs)}`;
                    toast.info(`onUpdateSelectionWindow: selection:${selectionStr}`);
                }
                : undefined,
            onClickSelectionWindow: this.state.isOnClickSelectionWindowsEnabled
                ? (selection, timeSecs) => {
                    toast.info(`onClickSelectionWindow: timeSecs: ${timeSecs}`);
                }
                : undefined,
            onZoomChange: this.state.isOnZoomChangeEnabled
                ? (timeRange) => {
                    toast.info(`isOnZoomChange: startTimeSecs: ${timeRange.startTimeSecs} ` +
                        `endTimeSecs: ${timeRange.endTimeSecs}`);
                }
                : undefined
        };
        return (React.createElement("div", { className: Classes.DARK, style: {
                height: '90%',
                width: '100%',
                padding: '0.5rem',
                color: Colors.GRAY4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } },
            React.createElement(ToastContainer, { theme: "dark" }),
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
                    this.props.showExampleControls ? (React.createElement("div", { style: {
                            flex: '0 0 auto',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyItems: 'left',
                            marginBottom: '0.5rem'
                        } },
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnChannelExpandedEnabled", onChange: () => this.setState(prevState => ({
                                    isOnChannelExpandedEnabled: !prevState.isOnChannelExpandedEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnChannelCollapsedEnabled", onChange: () => this.setState(prevState => ({
                                    isOnChannelCollapsedEnabled: !prevState.isOnChannelCollapsedEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnContextMenuEnabled", onChange: () => this.setState(prevState => ({
                                    isOnContextMenuEnabled: !prevState.isOnContextMenuEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnChannelLabelClickEnabled", onChange: () => this.setState(prevState => ({
                                    isOnChannelLabelClickEnabled: !prevState.isOnChannelLabelClickEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnChannelClickEnabled", onChange: () => this.setState(prevState => ({
                                    isOnChannelClickEnabled: !prevState.isOnChannelClickEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnSignalDetectionClickEnabled", onChange: () => this.setState(prevState => ({
                                    isOnSignalDetectionClickEnabled: !prevState.isOnSignalDetectionClickEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnSignalDetectionDragEndEnabled", onChange: () => this.setState(prevState => ({
                                    isOnSignalDetectionDragEndEnabled: !prevState.isOnSignalDetectionDragEndEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnSignalDetectionContextMenuEnabled", onChange: () => this.setState(prevState => ({
                                    isOnSignalDetectionContextMenuEnabled: !prevState.isOnSignalDetectionContextMenuEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnPredictivePhaseClickEnabled", onChange: () => this.setState(prevState => ({
                                    isOnPredictivePhaseClickEnabled: !prevState.isOnPredictivePhaseClickEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnPredictivePhaseContextMenuEnabled", onChange: () => this.setState(prevState => ({
                                    isOnPredictivePhaseContextMenuEnabled: !prevState.isOnPredictivePhaseContextMenuEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnKeyPressEnabled", onChange: () => this.setState(prevState => ({
                                    isOnKeyPressEnabled: !prevState.isOnKeyPressEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnMaskClickEnabled", onChange: () => this.setState(prevState => ({
                                    isOnMaskClickEnabled: !prevState.isOnMaskClickEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnUpdateMarkersEnabled", onChange: () => this.setState(prevState => ({
                                    isUpdateMarkersEnabled: !prevState.isUpdateMarkersEnabled
                                })) }),
                            React.createElement(Checkbox, { label: "OnMoveSelectionWindowsEnabled", onChange: () => this.setState(prevState => ({
                                    isMoveSelectionWindowsEnabled: !prevState.isMoveSelectionWindowsEnabled
                                })) }),
                            React.createElement(Checkbox, { label: "OnUpdateSelectionWindowsEnabled", onChange: () => this.setState(prevState => ({
                                    isUpdateSelectionWindowsEnabled: !prevState.isUpdateSelectionWindowsEnabled
                                })) }),
                            React.createElement(Checkbox, { label: "OnClickSelectionWindowsEnabled", onChange: () => this.setState(prevState => ({
                                    isOnClickSelectionWindowsEnabled: !prevState.isOnClickSelectionWindowsEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnMeasureWindowUpdated", onChange: () => this.setState(prevState => ({
                                    isOnMeasureWindowUpdatedEnabled: !prevState.isOnMeasureWindowUpdatedEnabled
                                })) })),
                        React.createElement("div", { style: styleFlexItem },
                            React.createElement(Checkbox, { label: "OnZoomChangeEnabled", onChange: () => this.setState(prevState => ({
                                    isOnZoomChangeEnabled: !prevState.isOnZoomChangeEnabled
                                })) })))) : undefined,
                    React.createElement("div", { style: { ...styleToolbar } },
                        React.createElement("div", { style: { ...styleToolbarItem } },
                            React.createElement(Label, { value: "Offset Step Increment:" },
                                React.createElement(NumericInput, { className: Classes.INPUT, 
                                    // allowNumericCharactersOnly={true}
                                    buttonPosition: "none", value: this.state.offset, onValueChange: this.onOffsetChange, selectAllOnFocus: true, stepSize: 1, minorStepSize: 1, majorStepSize: 1 }))),
                        React.createElement("div", { style: { ...styleToolbarItem } },
                            React.createElement(Button, { text: "Measure Window", onClick: () => {
                                    if (this.weavess) {
                                        this.weavess.toggleMeasureWindowVisibility();
                                    }
                                } })),
                        React.createElement("div", { style: { ...styleToolbarItem } },
                            React.createElement(Button, { text: this.state.toggleShowContent, onClick: () => {
                                    if (this.weavess) {
                                        this.weavess.toggleRenderingContent();
                                        defer(() => this.setState({ toggleShowContent: this.getToggleContentLabel() }));
                                    }
                                } }))),
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
                                    startTimeSecs: WeavessExample.startTimeSecs,
                                    endTimeSecs: WeavessExample.endTimeSecs
                                }, displayInterval: {
                                    startTimeSecs: WeavessExample.startTimeSecs,
                                    endTimeSecs: WeavessExample.endTimeSecs
                                }, stations: this.state.stations, events: events, markers: {
                                    verticalMarkers: [
                                        {
                                            id: 'marker',
                                            color: 'pink',
                                            lineStyle: WeavessTypes.LineStyle.DASHED,
                                            timeSecs: WeavessExample.startTimeSecs + 1200
                                        }
                                    ],
                                    selectionWindows: [
                                        {
                                            id: 'selection',
                                            startMarker: {
                                                id: 'marker',
                                                color: 'rgba(64, 255, 0, 1)',
                                                lineStyle: WeavessTypes.LineStyle.DASHED,
                                                timeSecs: WeavessExample.startTimeSecs + 600
                                            },
                                            endMarker: {
                                                id: 'marker',
                                                color: 'rgba(64, 255, 0, 1)',
                                                lineStyle: WeavessTypes.LineStyle.DASHED,
                                                timeSecs: WeavessExample.startTimeSecs + 800
                                            },
                                            isMoveable: true,
                                            color: 'rgba(64, 255, 0, 0.2)'
                                        }
                                    ]
                                } })))))));
    }
    getToggleContentLabel = () => {
        if (this.weavess) {
            if (this.weavess.state.shouldRenderWaveforms && this.weavess.state.shouldRenderSpectrograms) {
                return 'Show only waveforms';
            }
            if (this.weavess.state.shouldRenderWaveforms &&
                !this.weavess.state.shouldRenderSpectrograms) {
                return 'Show only spectrograms';
            }
            return 'Show waveforms and spectrograms';
        }
        return 'Toggle Contnent';
    };
    // eslint-disable-next-line class-methods-use-this
    generateDummyData = () => {
        const stations = [];
        const signalDetections = [
            {
                id: `sd`,
                timeSecs: WeavessExample.startTimeSecs + 500,
                uncertaintySecs: 1.5,
                showUncertaintyBars: true,
                color: 'red',
                label: 'P',
                filter: 'brightness(1)',
                isConflicted: false,
                isSelected: false,
                isActionTarget: false,
                isDraggable: true
            }
        ];
        const predictedPhases = [
            {
                id: `predictive`,
                timeSecs: WeavessExample.startTimeSecs + 515,
                uncertaintySecs: 1.5,
                showUncertaintyBars: true,
                color: 'red',
                label: 'P',
                filter: 'opacity(.6)',
                isConflicted: false,
                isSelected: false,
                isActionTarget: false,
                isDraggable: true
            }
        ];
        const theoreticalPhaseWindows = [
            {
                id: 'theoretical-phase',
                startTimeSecs: WeavessExample.startTimeSecs + 60,
                endTimeSecs: WeavessExample.startTimeSecs + 120,
                color: 'red',
                label: 'TP'
            }
        ];
        const verticalMarker = {
            id: 'marker',
            color: 'lime',
            lineStyle: WeavessTypes.LineStyle.DASHED,
            timeSecs: WeavessExample.startTimeSecs + 5
        };
        const markers = {
            verticalMarkers: [verticalMarker],
            moveableMarkers: [
                {
                    id: 'marker',
                    color: 'RED',
                    lineStyle: WeavessTypes.LineStyle.DASHED,
                    timeSecs: WeavessExample.startTimeSecs + 50
                }
            ],
            selectionWindows: [
                {
                    id: 'selection',
                    startMarker: {
                        id: 'marker',
                        color: 'purple',
                        lineStyle: WeavessTypes.LineStyle.DASHED,
                        timeSecs: WeavessExample.startTimeSecs + 200
                    },
                    endMarker: {
                        id: 'marker',
                        color: 'purple',
                        lineStyle: WeavessTypes.LineStyle.DASHED,
                        timeSecs: WeavessExample.startTimeSecs + 400
                    },
                    isMoveable: true,
                    color: 'rgba(200,0,0,0.2)'
                }
            ]
        };
        const spectrogram = {
            description: 'test spectogram data',
            descriptionLabelColor: 'black',
            startTimeSecs: WeavessExample.startTimeSecs,
            timeStep: rainbowSpectrogramTimeStep,
            frequencyStep: rainbowSpectrogramFrequencyStep,
            data: rainbowSpectrogramData,
            signalDetections,
            predictedPhases,
            theoreticalPhaseWindows,
            markers
        };
        const channelSegmentsRecordDefaultChannel = {};
        channelSegmentsRecordDefaultChannel.data = [
            {
                configuredInputName: 'ExampleChannel',
                channelName: 'ExampleChannel',
                wfFilterId: WeavessTypes.UNFILTERED,
                isSelected: false,
                description: 'test waveform data',
                dataSegments: [
                    {
                        color: 'dodgerblue',
                        displayType: [WeavessTypes.DisplayType.LINE],
                        pointSize: 2,
                        data: {
                            startTimeSecs: WeavessExample.startTimeSecs,
                            endTimeSecs: WeavessExample.endTimeSecs,
                            sampleRate: 1,
                            values: Array.from({ length: 1000 }, () => Math.floor(Math.abs(WeavessUtil.getSecureRandomNumber() * 15)))
                        }
                    }
                ]
            }
        ];
        const channelSegmentsRecordNonDefaultChannel = {};
        channelSegmentsRecordNonDefaultChannel.data = [
            {
                configuredInputName: 'ExampleChannel',
                channelName: 'ExampleChannel',
                wfFilterId: WeavessTypes.UNFILTERED,
                isSelected: false,
                dataSegments: [
                    {
                        color: 'dodgerblue',
                        displayType: [WeavessTypes.DisplayType.SCATTER],
                        pointSize: 2,
                        data: {
                            startTimeSecs: WeavessExample.startTimeSecs,
                            endTimeSecs: WeavessExample.endTimeSecs,
                            sampleRate: 1,
                            values: Array.from({ length: 300 }, () => Math.floor(WeavessUtil.getSecureRandomNumber() * 15))
                        }
                    }
                ]
            }
        ];
        stations.push({
            id: 'test',
            name: 'test station',
            defaultChannels: [
                {
                    isSelected: false,
                    id: 'BHZ',
                    name: 'BHZ',
                    height: 50,
                    defaultRange: {
                        min: 0
                    },
                    waveform: {
                        channelSegmentId: 'data',
                        channelSegmentsRecord: channelSegmentsRecordDefaultChannel,
                        signalDetections,
                        predictedPhases,
                        theoreticalPhaseWindows,
                        markers
                    }
                }
            ],
            nonDefaultChannels: [
                {
                    isSelected: false,
                    id: 'BHE',
                    name: 'BHE',
                    height: 50,
                    waveform: {
                        channelSegmentId: 'data',
                        channelSegmentsRecord: channelSegmentsRecordNonDefaultChannel,
                        masks: [
                            {
                                id: `mask_1`,
                                channelName: 'ExampleChannel',
                                startTimeSecs: WeavessExample.startTimeSecs + 20,
                                endTimeSecs: WeavessExample.startTimeSecs + 40,
                                color: 'green',
                                isProcessingMask: false,
                                shouldBuildPoints: true
                            }
                        ],
                        markers: {
                            verticalMarkers: markers.verticalMarkers
                        }
                    }
                }
            ],
            areChannelsShowing: false,
            hasQcMasks: true
        });
        stations.push({
            id: 'waveform spectrogram',
            name: 'waveform spectrogram',
            defaultChannels: [
                {
                    isSelected: false,
                    id: 'waveform spectrogram',
                    name: 'waveform spectrogram',
                    height: 100,
                    waveform: {
                        channelSegmentId: 'data',
                        channelSegmentsRecord: channelSegmentsRecordDefaultChannel,
                        signalDetections,
                        predictedPhases,
                        theoreticalPhaseWindows,
                        markers
                    },
                    spectrogram
                }
            ],
            areChannelsShowing: false,
            hasQcMasks: false
        });
        const channelSegmentsRecordNoWaveformData = {};
        channelSegmentsRecordNoWaveformData.data = [
            {
                configuredInputName: 'ExampleChannel',
                channelName: 'ExampleChannel',
                isSelected: false,
                wfFilterId: WeavessTypes.UNFILTERED,
                description: 'test waveform no data',
                dataSegments: []
            }
        ];
        stations.push({
            id: 'waveform no data',
            name: 'waveform no data',
            defaultChannels: [
                {
                    isSelected: false,
                    id: 'waveform no data',
                    name: 'waveform no data',
                    height: 50,
                    waveform: {
                        channelSegmentId: 'data',
                        channelSegmentsRecord: channelSegmentsRecordNoWaveformData
                    }
                }
            ],
            areChannelsShowing: false,
            hasQcMasks: false
        });
        stations.push({
            id: 'spectrogram',
            name: 'spectrogram',
            defaultChannels: [
                {
                    isSelected: false,
                    id: 'spectrogram',
                    name: 'spectrogram',
                    height: 50,
                    spectrogram: {
                        ...spectrogram,
                        data: spectrogramData,
                        timeStep: spectrogramTimeStep,
                        frequencyStep: spectrogramFrequencyStep
                    }
                }
            ],
            areChannelsShowing: false,
            hasQcMasks: false
        });
        stations.push({
            id: 'spectrogram no data',
            name: 'spectrogram no data',
            defaultChannels: [
                {
                    isSelected: false,
                    id: 'spectrogram no data',
                    name: 'spectrogram no data',
                    height: 50,
                    spectrogram: {
                        description: 'test spectogram no data',
                        startTimeSecs: WeavessExample.startTimeSecs,
                        timeStep: 0,
                        frequencyStep: 0,
                        data: []
                    }
                }
            ],
            areChannelsShowing: false,
            hasQcMasks: false
        });
        stations.push({
            id: 'no data',
            name: 'no data',
            defaultChannels: [
                {
                    isSelected: false,
                    id: 'no data',
                    name: 'no data',
                    height: 50
                }
            ],
            areChannelsShowing: false,
            hasQcMasks: false
        });
        const timeToGlScale = d3
            .scaleLinear()
            .domain([WeavessExample.startTimeSecs, WeavessExample.endTimeSecs])
            .range([0, 100]);
        // create channels w/ random noise as data
        for (let i = 0; i < 50; i += 1) {
            let time1 = WeavessExample.startTimeSecs;
            let time2 = WeavessExample.startTimeSecs + 900;
            const sampleData1 = new Float32Array(WeavessExample.NUM_SAMPLES * 2);
            const sampleData2 = new Float32Array(WeavessExample.NUM_SAMPLES * 2);
            for (let samp = 0; samp < WeavessExample.NUM_SAMPLES * 2; samp += 2) {
                sampleData1[samp] = timeToGlScale(time1);
                sampleData1[samp + 1] = WeavessUtil.getSecureRandomNumber() + 0.05 * 100;
                sampleData2[samp] = timeToGlScale(time2);
                sampleData2[samp + 1] = (Number(WeavessUtil.getSecureRandomNumber()) + 0.05) * 100;
                time1 += 1 / WeavessExample.SAMPLE_RATE;
                time2 += 1 / WeavessExample.SAMPLE_RATE;
            }
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
                            pointSize: 2,
                            data: {
                                startTimeSecs: WeavessExample.startTimeSecs,
                                sampleRate: WeavessExample.SAMPLE_RATE,
                                values: sampleData1
                            }
                        },
                        {
                            color: 'dodgerblue',
                            displayType: [WeavessTypes.DisplayType.LINE],
                            pointSize: 2,
                            data: {
                                startTimeSecs: WeavessExample.startTimeSecs + 900,
                                sampleRate: WeavessExample.SAMPLE_RATE,
                                values: sampleData2
                            }
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
                        id: String(i),
                        name: `channel ${i}`,
                        defaultRange: {
                            min: 0,
                            max: 100
                        },
                        waveform: {
                            channelSegmentId: 'data',
                            channelSegmentsRecord,
                            signalDetections: [
                                {
                                    id: `sd${i}`,
                                    timeSecs: WeavessExample.startTimeSecs + 450,
                                    uncertaintySecs: 1.5,
                                    showUncertaintyBars: true,
                                    color: 'red',
                                    label: 'P',
                                    filter: 'brightness(1)',
                                    isConflicted: false,
                                    isSelected: false,
                                    isActionTarget: false,
                                    isDraggable: true
                                }
                            ],
                            predictedPhases: [
                                {
                                    id: `predictive${i}`,
                                    timeSecs: WeavessExample.startTimeSecs + 450,
                                    uncertaintySecs: 1.5,
                                    showUncertaintyBars: false,
                                    color: 'red',
                                    label: 'P',
                                    filter: 'opacity(.6)',
                                    isConflicted: false,
                                    isSelected: true,
                                    isActionTarget: false,
                                    isDraggable: true
                                }
                            ],
                            masks: [
                                {
                                    id: `mask_1_${i}`,
                                    channelName: 'ExampleChannel',
                                    startTimeSecs: WeavessExample.startTimeSecs + 60,
                                    endTimeSecs: WeavessExample.startTimeSecs + 400,
                                    color: 'yellow',
                                    isProcessingMask: false,
                                    shouldBuildPoints: true
                                },
                                {
                                    id: `mask_2_${i}`,
                                    channelName: 'ExampleChannel',
                                    startTimeSecs: WeavessExample.startTimeSecs + 100,
                                    endTimeSecs: WeavessExample.startTimeSecs + 200,
                                    color: 'green',
                                    isProcessingMask: false,
                                    shouldBuildPoints: true
                                }
                            ],
                            markers: {
                                verticalMarkers: markers.verticalMarkers
                            }
                        }
                    }
                ],
                nonDefaultChannels: undefined, // Set it to undefined means no Expand/Collapse button on Station Label
                areChannelsShowing: false,
                hasQcMasks: false
            });
        }
        return stations;
    };
    onOffsetChange = (offset) => {
        const { stations } = this.state;
        for (let i = 0; i < stations.length; i += 1) {
            for (let j = 0; j < stations[i].defaultChannels.length; j += 1) {
                stations[i].defaultChannels[j].timeOffsetSeconds = offset * i;
            }
        }
        this.setState({
            offset,
            stations
        });
    };
}
//# sourceMappingURL=example-weavess.js.map