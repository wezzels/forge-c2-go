import kebabCase from 'lodash/kebabCase';
import React from 'react';
/**
 * Label value formatter
 *
 * @param props value label props
 * @returns a formatted value label container
 */
export function LabelValue(props) {
    const defaultContainerClass = 'weavess-label-value-container';
    const labelClass = 'weavess-label-value__label';
    const valueClass = 'weavess-label-value__value';
    const { containerClass, label, tooltip, styleForValue, value, valueColor } = props;
    const customContainerClass = `${defaultContainerClass} ${containerClass || ''}`;
    const labelKebab = kebabCase(label);
    return (React.createElement("div", { className: containerClass ? customContainerClass : defaultContainerClass },
        React.createElement("div", { className: labelClass, "data-cy": `${labelKebab}-label` }, label && label.length > 0 ? `${label}: ` : ''),
        React.createElement("div", { title: tooltip, className: valueClass, "data-cy": `${labelKebab}-value`, style: {
                color: valueColor || '',
                ...styleForValue
            } }, value)));
}
//# sourceMappingURL=label-value.js.map