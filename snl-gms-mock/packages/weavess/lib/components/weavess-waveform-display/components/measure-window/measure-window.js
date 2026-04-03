/* eslint-disable react/destructuring-assignment */
import { Button, NonIdealState, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as React from 'react';
import { WeavessWaveformPanel } from '../../weavess-waveform-panel';
import { NonIdealStateWithNavigationButtons } from './non-ideal-state-with-navigation-buttons';
const HEIGHT_OF_X_AXIS_PX = 55;
const useMeasureWindowEvents = (events, measureWindowSelection) => {
    return React.useMemo(() => ({
        ...events,
        stationEvents: {
            defaultChannelEvents: measureWindowSelection?.isDefaultChannel
                ? events?.stationEvents?.defaultChannelEvents
                : events?.stationEvents?.nonDefaultChannelEvents
        }
    }), [events, measureWindowSelection]);
};
const useMeasureWindowInitialConfig = (initialConfiguration, measureWindowSelection) => {
    return React.useMemo(() => ({
        ...initialConfiguration,
        defaultChannel: {
            disableMeasureWindow: true,
            disableMaskModification: measureWindowSelection?.isDefaultChannel
                ? initialConfiguration?.defaultChannel?.disableMaskModification
                : initialConfiguration?.nonDefaultChannel?.disableMaskModification
        }
    }), [initialConfiguration, measureWindowSelection]);
};
const useMeasureWindowStations = (measureWindowSelection, measureWindowHeightPx, channel) => React.useMemo(() => measureWindowSelection && channel
    ? [
        {
            id: measureWindowSelection?.stationId,
            name: measureWindowSelection?.stationId,
            defaultChannels: [
                {
                    ...channel,
                    timeOffsetSeconds: 0, // always show true time in the measure window
                    height: measureWindowHeightPx - HEIGHT_OF_X_AXIS_PX
                }
            ]
        }
    ]
    : [], [measureWindowSelection, channel, measureWindowHeightPx]);
/**
 * If given a getBoundaries function, returns a function with the same signature, but that is
 * modified to be for the measure window.
 * @param getBoundaries the getBoundaries function to modify so it applies to the measure window
 * @returns a getBoundariesFunction modified to inject the isMeasureWindow parameter, or undefined if no getBoundaries function was provided
 */
const useGetBoundariesForMeasureWindow = (getBoundaries) => {
    const getBoundariesForMeasureWindow = React.useCallback(async (channelName, channelSegment, timeRange) => {
        if (!getBoundaries) {
            throw new Error('Cannot call getBoundaries when function is not provided. This may be a bug.');
        }
        return getBoundaries(channelName, channelSegment, timeRange, true);
    }, [getBoundaries]);
    return getBoundaries ? getBoundariesForMeasureWindow : undefined;
};
function MeasureWindow(props) {
    const { events, setMeasureWindowRef, measureWindowSelection, initialConfiguration, measureWindowHeightPx, activeSplitModeType, measureWindowChannel } = props;
    const measureWindowEvents = useMeasureWindowEvents(events, measureWindowSelection);
    const initialMeasureWindowConfig = useMeasureWindowInitialConfig(initialConfiguration, measureWindowSelection);
    const measureWindowStations = useMeasureWindowStations(measureWindowSelection, measureWindowHeightPx, measureWindowChannel);
    const nextSDCallback = React.useCallback(() => measureWindowSelection?.nonIdealState?.buttonCallback(false), [measureWindowSelection?.nonIdealState]);
    // We want the same unbound method so we can use it as a dependency in the new function creation.
    const getBoundariesForMeasureWindow = useGetBoundariesForMeasureWindow(props.getBoundaries);
    if (measureWindowSelection && measureWindowSelection.nonIdealState === undefined) {
        return (React.createElement(WeavessWaveformPanel, { ref: setMeasureWindowRef, key: measureWindowSelection.channelId, ...props, activeSplitModeType: activeSplitModeType, getBoundaries: getBoundariesForMeasureWindow, events: measureWindowEvents, initialConfiguration: initialMeasureWindowConfig, stations: measureWindowStations, displayInterval: {
                startTimeSecs: measureWindowSelection.startTimeSecs,
                endTimeSecs: measureWindowSelection.endTimeSecs
            }, msrWindowWaveformAmplitudeScaleFactor: measureWindowSelection.waveformAmplitudeScaleFactor, customLabel: measureWindowSelection.customLabel }));
    }
    // if in measurement mode and a non-measurable detection is selected, we should retain the lefthand label panel so that we can still cycle through detections
    if (measureWindowSelection?.nonIdealState?.nonIdealStateWithNavigationButtons === true) {
        const { icon, title, description, buttonCallback, buttonDisabled } = measureWindowSelection.nonIdealState;
        return (React.createElement(NonIdealStateWithNavigationButtons, { icon: icon, title: title, description: description, buttonCallback: buttonCallback, buttonDisabled: buttonDisabled }));
    }
    if (measureWindowSelection?.nonIdealState !== undefined) {
        const { icon, title, description, buttonText, buttonDisabled, tooltipContent } = measureWindowSelection.nonIdealState;
        return (React.createElement(NonIdealState, { icon: icon ? IconNames[icon] : undefined, title: title, description: description, action: buttonText ? (React.createElement(Tooltip, { content: tooltipContent, disabled: !buttonDisabled },
                React.createElement(Button, { text: buttonText, onClick: nextSDCallback, disabled: buttonDisabled }))) : undefined }));
    }
    return (React.createElement(NonIdealState, { icon: IconNames.TIMELINE_LINE_CHART, title: "No measure window data selected" }));
}
export const MemoizedMeasureWindow = React.memo(MeasureWindow);
//# sourceMappingURL=measure-window.js.map