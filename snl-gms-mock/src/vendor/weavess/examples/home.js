import { H3, H4, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line react/prefer-stateless-function
export class Home extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement(H3, null, "Examples"),
                React.createElement("p", null, "If this project is cloned or downloaded, these examples can be loaded as files in the browser. Otherwise, peruse the source code for ideas on how to use WEAVESS in various ways."),
                React.createElement(H3, null, "Documentation"),
                React.createElement("p", null, "Currently, no formal API Docs exist. Hopefully they will be coming soon. For now, these examples and the source code are your only hope.")),
            React.createElement("br", null),
            React.createElement("div", null,
                React.createElement(H4, null,
                    React.createElement(Icon, { icon: IconNames.CHART }),
                    React.createElement(Link, { to: "/WeavessExample" }, " Weavess Example")),
                React.createElement("p", null, "Basic introduction to using Weavess. Start here first."),
                React.createElement("br", null),
                React.createElement(H4, null,
                    React.createElement(Icon, { icon: IconNames.CHART }),
                    React.createElement(Link, { to: "/WeavessFlatLineExample" }, " Weavess Flat Line Example")),
                React.createElement("p", null, "Weavess displaying a flat line with data segments defined by time."),
                React.createElement("br", null),
                React.createElement(H4, null,
                    React.createElement(Icon, { icon: IconNames.CHART }),
                    React.createElement(Link, { to: "/WeavessLineChartExample" }, " Weavess Line Chart Example")),
                React.createElement("p", null, "Weavess displaying a line chart example."),
                React.createElement("br", null),
                React.createElement(H4, null,
                    React.createElement(Icon, { icon: IconNames.MULTI_SELECT }),
                    React.createElement(Link, { to: "/MultipleDisplaysExample" }, " Multiple Displays Example")),
                React.createElement("p", null, "Multiple Weavess displays can be displayed anywhere on the screen and operate completely independent of each other"),
                React.createElement("br", null),
                React.createElement(H4, null,
                    React.createElement(Icon, { icon: IconNames.TIMELINE_EVENTS }),
                    React.createElement(Link, { to: "/EventsExample" }, " Events Example")),
                React.createElement("p", null, "Register callbacks for various events triggered by the Weavess display"),
                React.createElement("br", null),
                React.createElement(H4, null,
                    React.createElement(Icon, { icon: IconNames.RECORD }),
                    React.createElement(Link, { to: "/RecordSectionExample" }, " Record Section Example")),
                React.createElement("p", null, "Record Section-style waveform display"),
                React.createElement("br", null))));
    }
}
//# sourceMappingURL=home.js.map