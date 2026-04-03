import { Classes, Colors } from '@blueprintjs/core';
import React from 'react';
export function WeavessGenericContainerWrapper(props) {
    const { children } = props;
    return (React.createElement("div", { className: Classes.DARK, style: {
            height: '80%',
            width: '100%',
            padding: '0.5rem',
            color: Colors.GRAY4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        } },
        React.createElement("div", { style: {
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            } },
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
                    } }, children)))));
}
//# sourceMappingURL=container-wrapper.js.map