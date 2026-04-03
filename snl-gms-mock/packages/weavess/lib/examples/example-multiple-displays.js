import React from 'react';
import { WeavessExample } from './example-weavess';
// eslint-disable-next-line react/prefer-stateless-function
export class MultipleDisplaysExample extends React.Component {
    render() {
        return (React.createElement("div", { style: {
                height: '80%',
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
                alignItems: 'center'
            } },
            React.createElement(WeavessExample, { key: 1, showExampleControls: false }),
            React.createElement(WeavessExample, { key: 2, showExampleControls: false })));
    }
}
//# sourceMappingURL=example-multiple-displays.js.map