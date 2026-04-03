import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime2/lib/css/blueprint-datetime2.css';
import '../../scss/weavess.scss';
import './style.scss';
import { Button, ButtonGroup, Classes, Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { EventsExample } from './example-events';
import { WeavessFlatLineExample } from './example-flat-line';
import { WeavessLineChartExample } from './example-line-chart';
import { MultipleDisplaysExample } from './example-multiple-displays';
import { RecordSectionExample } from './example-record-section';
import { WeavessExample } from './example-weavess';
import { Home } from './home';
window.React = React;
window.ReactDOM = ReactDOM;
export function App() {
    return (React.createElement("div", { id: "app-content" },
        React.createElement(HashRouter, null,
            React.createElement("div", { className: Classes.DARK, style: {
                    height: '100%',
                    width: '100%',
                    padding: '0.5rem',
                    color: Colors.GRAY4
                } },
                React.createElement(ButtonGroup, { minimal: true },
                    React.createElement(Button, { icon: IconNames.HOME },
                        React.createElement(Link, { to: "/" }, "Home")),
                    React.createElement(Button, { icon: IconNames.CHART },
                        React.createElement(Link, { to: "/WeavessExample" }, " Weavess Example")),
                    React.createElement(Button, { icon: IconNames.CHART },
                        React.createElement(Link, { to: "/WeavessFlatLineExample" }, " Weavess Flat Line Example")),
                    React.createElement(Button, { icon: IconNames.CHART },
                        React.createElement(Link, { to: "/WeavessLineChartExample" }, " Weavess Line Chart Example")),
                    React.createElement(Button, { icon: IconNames.MULTI_SELECT },
                        React.createElement(Link, { to: "/MultipleDisplaysExample" }, " Multiple Displays Example")),
                    React.createElement(Button, { icon: IconNames.TIMELINE_EVENTS },
                        React.createElement(Link, { to: "/EventsExample" }, " Events")),
                    React.createElement(Button, { icon: IconNames.RECORD },
                        React.createElement(Link, { to: "/RecordSectionExample" }, " Record Section Example"))),
                React.createElement("hr", null),
                React.createElement(Routes, null,
                    React.createElement(Route, { path: "/WeavessExample", element: React.createElement(WeavessExample, null) }),
                    React.createElement(Route, { path: "/WeavessFlatLineExample", element: React.createElement(WeavessFlatLineExample, null) }),
                    React.createElement(Route, { path: "/WeavessLineChartExample", element: React.createElement(WeavessLineChartExample, null) }),
                    React.createElement(Route, { path: "/MultipleDisplaysExample", element: React.createElement(MultipleDisplaysExample, null) }),
                    React.createElement(Route, { path: "/EventsExample", element: React.createElement(EventsExample, null) }),
                    React.createElement(Route, { path: "/RecordSectionExample", element: React.createElement(RecordSectionExample, null) }),
                    React.createElement(Route, { path: "*", element: React.createElement(Home, null) }))))));
}
//# sourceMappingURL=app.js.map