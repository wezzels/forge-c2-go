import { Tooltip } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { DistanceAzimuth } from './distance-azimuth';
/**
 * Special formatting for FK channel label rows
 *
 * @param props uses ID to determine FK type
 * @returns name row for FK plots
 */
export const FKNameRow = React.memo(function FKNameRow(props) {
    const { id } = props;
    if (id === 'Slowness') {
        return (React.createElement("div", { style: { whiteSpace: 'nowrap' } },
            "Slowness (",
            React.createElement("sup", null, "s"),
            "\u2215",
            React.createElement("sub", null, "\u00B0"),
            ")"));
    }
    if (id === 'Azimuth') {
        return (React.createElement("div", { style: { whiteSpace: 'nowrap' } },
            "Azimuth ",
            React.createElement("sup", null, "(\u00B0)")));
    }
    return null;
});
const PhaseLabel = React.memo(function PhaseLabel({ tooltipText, phaseLabel, phaseColor }) {
    const phaseColorStyle = {
        color: phaseColor
    };
    return tooltipText ? (React.createElement(Tooltip, { content: tooltipText },
        React.createElement("span", { className: "station-name__phase-name", style: phaseColorStyle }, `/${phaseLabel}`))) : (React.createElement("span", { className: "station-name__phase-name", style: phaseColorStyle }, `/${phaseLabel}`));
});
/**
 * Exists only when split channel mode expansion is active, and only for Default Channels
 *
 * @param isDefaultChannel
 * @param isSplitChannel
 * @returns null when not a default channel in split channel expanded mode
 */
export const ChooseWaveformRow = React.memo(function ChooseWaveformRow(props) {
    const { isDefaultChannel, isSplitChannel } = props;
    return isSplitChannel && isDefaultChannel ? React.createElement("span", null, "CHOOSE WAVEFORM") : null;
});
/**
 * Includes the channel name.
 * For split non-default channels, also contains Signal Detection phase colored to match event association
 *
 * @param props
 * @returns a row for weavess channel labels
 */
export const ChannelNameRow = React.memo(function ChannelNameRow(props) {
    const { isSplitChannel, channelName, channelLabel, channelLabelIcon, phaseColor, phaseLabel, isDefaultChannel, tooltipText } = props;
    // For displaying labels in FK plots
    if (channelName === 'Slowness' || channelName === 'Azimuth') {
        return React.createElement(FKNameRow, { id: channelName });
    }
    return (React.createElement("div", { className: "label-channel-name-row" },
        React.createElement("span", { className: classNames({ 'station-name__channel-name': !isDefaultChannel }, { 'station-name': isDefaultChannel }) }, channelName),
        React.createElement("span", { className: "station-name__channel-name" },
            "\u00A0",
            channelLabel),
        React.createElement("span", { className: "station-name__label-icon" }, channelLabelIcon),
        isSplitChannel && !isDefaultChannel && phaseLabel ? (React.createElement(PhaseLabel, { tooltipText: tooltipText, phaseLabel: phaseLabel, phaseColor: phaseColor })) : null));
});
/**
 *
 * @param props Includes the Azimuth and Distance when an event is open
 * @returns a row for weavess channel labels
 */
export const AzimuthRow = React.memo(function AzimuthRow(props) {
    const { azimuth, distance, distanceUnits } = props;
    return (React.createElement("div", { className: "distance-azimuth" },
        React.createElement("p", null,
            React.createElement(DistanceAzimuth, { azimuth: azimuth, distance: distance, distanceUnits: distanceUnits }))));
});
/**
 * @returns simple row to display a label header
 */
export const LabelHeaderRow = React.memo(function LabelHeaderRow(props) {
    const { labelHeader } = props;
    return React.createElement("div", { className: "label-header" }, labelHeader);
});
//# sourceMappingURL=label-rows.js.map