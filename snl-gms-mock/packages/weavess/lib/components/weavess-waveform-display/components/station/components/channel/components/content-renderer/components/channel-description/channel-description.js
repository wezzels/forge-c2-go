import { Icon, Tooltip } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import React from 'react';
import { ErrorTooltip } from '../../../../../../../error-tooltip';
const isError = (description) => {
    return typeof description === 'string' ? false : description?.isError ?? false;
};
const ChannelDescriptionLabelMessage = React.memo(function ChannelDescriptionLabelMessage({ err, message }) {
    return (React.createElement("span", { className: "channel-description__message-container" },
        err && React.createElement(Icon, { className: "channel-description__icon", icon: IconNames.ERROR, size: 12 }),
        React.createElement("span", { className: "channel-description__message" }, message)));
});
/**
 * Renders a channel description label, which is a string that will turn red and add a tooltip if the isError flag is set to true.
 */
export const ChannelDescriptionLabel = React.memo(function ChannelDescriptionLabel({ description }) {
    const message = typeof description === 'string' ? description : description?.message;
    const tooltipMessage = typeof description === 'string' ? null : description?.tooltipMessage;
    const err = isError(description);
    return (React.createElement("span", { className: classNames({
            'channel-description': true,
            'channel-description--error': isError(description)
        }) }, tooltipMessage != null ? (React.createElement(Tooltip, { compact: true, content: err ? React.createElement(ErrorTooltip, { errorTitle: message, message: tooltipMessage }) : tooltipMessage },
        React.createElement(ChannelDescriptionLabelMessage, { message: message, err: err }))) : (React.createElement(ChannelDescriptionLabelMessage, { message: message, err: err }))));
});
//# sourceMappingURL=channel-description.js.map