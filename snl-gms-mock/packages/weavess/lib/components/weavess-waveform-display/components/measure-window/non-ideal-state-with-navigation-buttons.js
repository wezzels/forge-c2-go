import { Button, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import React from 'react';
export function NonIdealStateWithNavigationButtons(props) {
    const { icon, title, description, buttonCallback, buttonDisabled } = props;
    const nextSDCallback = React.useCallback(() => buttonCallback(false), [buttonCallback]);
    const prevSDCallback = React.useCallback(() => buttonCallback(true), [buttonCallback]);
    return (React.createElement("div", { className: "non-ideal-state-with-navigation-buttons-container" },
        React.createElement("div", { className: "measurement-mode-window-label" },
            React.createElement("div", { className: classNames({ 'label-channel-name-row': true, 'non-ideal-state': true }) },
                React.createElement("span", { className: "station-name" }, "\u00A0"),
                React.createElement("span", { className: "station-name__channel-name" }, "\u00A0"),
                React.createElement("span", { className: "station-name__label-icon" })),
            React.createElement("div", { className: classNames({ 'label-measurement-row': true, 'non-ideal-state': true }) },
                React.createElement("span", { className: "amplitude-type" }, "\u00A0"),
                React.createElement("span", { className: "period-label" }, "\u00A0")),
            React.createElement("div", { className: classNames({ 'measure-mode-label__buttons': true, 'non-ideal-state': true }) },
                React.createElement(Button, { className: classNames({
                        'previous-button': true,
                        'measure-mode-buttons-disabled': buttonDisabled
                    }), text: "Prev", onClick: prevSDCallback, title: buttonDisabled ? 'No required phases to review' : 'Review the previous required phase', disabled: buttonDisabled }),
                React.createElement(Button, { className: classNames({
                        'next-button': true,
                        'measure-mode-buttons-disabled': buttonDisabled
                    }), text: "Next", onClick: nextSDCallback, title: buttonDisabled ? 'No required phases to review' : 'Review the next required phase', disabled: buttonDisabled }))),
        React.createElement(NonIdealState, { icon: icon ? IconNames[icon] : undefined, title: title, description: description })));
}
//# sourceMappingURL=non-ideal-state-with-navigation-buttons.js.map