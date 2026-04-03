import { Tooltip } from '@blueprintjs/core';
import { classList } from '@gms/ui-util';
import classNames from 'classnames';
import React from 'react';
/**
 * A button for expanding or collapsing the channel row to reveal sub-channels
 *
 * @param props StationExpansionButtonProps
 * @returns an expand element for the left hand side of the weavess label
 */
export const StationExpansionButton = React.memo(function StationExpansionButton(props) {
    const { channelId, showMaskIndicator, onClick, isExpanded, rowHeight } = props;
    const expandText = isExpanded ? '-' : '+';
    const maskIndicator = showMaskIndicator ? 'M' : null;
    const expandElem = (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    React.createElement("div", { className: "station-expansion-button", "data-cy": "weavess-expand-parent", "data-cy-channel-name": channelId, onClick: onClick },
        React.createElement("div", { className: "expand-label", style: {
                marginTop: `${rowHeight / 2}px`
            } },
            expandText,
            maskIndicator != null && React.createElement("span", { className: "mask-indicator" }, maskIndicator))));
    return expandElem;
});
/**
 * A button used to cancel the split channel row expansion
 *
 * @param props CancelElementProps
 * @returns Cancel button element for the left hand side of the weavess label
 */
export function LabelLeftCancelElement(props) {
    const { channelId, onClick } = props;
    return (React.createElement(Tooltip, { disabled: false, className: classList({
            'weavess-tooltip': true,
            'weavess-tooltip--cancel-element': true,
            'weavess-tooltip__target': true
        }), content: React.createElement("div", null, "Cancel. Hotkey esc"), placement: "right", hoverOpenDelay: 250 }, 
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    React.createElement("div", { role: "button", tabIndex: 0, className: "label-container-left-parent-cancel-button", "data-cy": "weavess-cancel-split", "data-cy-channel-name": channelId, onClick: onClick }, "x")));
}
/**
 *  Currently displayed when the channel is not expandable, and does not need a CancelElement.
 *  Is colored differently for split channels.
 *
 * @param props
 * @returns DefaultLeftElement for the left hand side of the weavess label
 */
export function DefaultLabelLeftElement(props) {
    const { isDefaultChannel, isSplitChannel } = props;
    return (React.createElement("div", { className: classNames({
            'label-container-left-child': true,
            'label-container-left-child--split-channel': isSplitChannel && !isDefaultChannel
        }) }));
}
/**
 * The left-hand element in a weavess channel label. Might contain an expand/collapse element if it's on a default channel,
 * or a cancel element if the default channel is in expansion mode.
 *
 * @param props
 * @returns left-hand weavess label element
 */
export const LabelLeftElement = React.memo(function LabelLeftElement(props) {
    const { isDefaultChannel, isSplitChannel, closeSplitChannelOverlayCallback, channelId, isExpandable, isMeasureWindow } = props;
    const cancelElement = isExpandable && isSplitChannel ? (React.createElement(LabelLeftCancelElement, { channelId: channelId, onClick: closeSplitChannelOverlayCallback })) : null;
    /* render child label without expansion button */
    const labelWithoutExpansion = (React.createElement(DefaultLabelLeftElement, { isDefaultChannel: isDefaultChannel, isSplitChannel: isSplitChannel }));
    return isDefaultChannel ? (
    /* render parent label with expansion button */
    React.createElement("div", { className: classNames([
            'label-container-left-parent',
            { 'measure-window-left-parent': isMeasureWindow }
        ]) }, cancelElement)) : (labelWithoutExpansion);
});
//# sourceMappingURL=label-elements.js.map