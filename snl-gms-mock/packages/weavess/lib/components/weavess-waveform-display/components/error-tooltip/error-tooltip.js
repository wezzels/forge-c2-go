import React from 'react';
/**
 * Component that renders an error title and an error message. Designed for use within error tooltips.
 */
export function ErrorTooltip({ errorTitle, message }) {
    return (React.createElement("div", { className: "error-tooltip" },
        React.createElement("span", { className: "error-tooltip__title" },
            React.createElement("span", { className: "monospace" },
                React.createElement("span", { className: "error-tooltip__label" }, "Error:"),
                " ",
                errorTitle)),
        React.createElement("span", { className: "error-tooltip__message" }, message)));
}
//# sourceMappingURL=error-tooltip.js.map