import React from 'react';
const TEN = 20;
const TWENTY = 20;
const FIFTY = 50;
export class RecordSectionLabels extends React.Component {
    containerStyle = {
        borderLeft: 'solid',
        borderWidth: '3px',
        height: '100%',
        position: 'absolute',
        width: '100%'
    };
    /**
     * Constructor
     *
     * @param props Record Section Labels props as RecordSectionLabelsProps
     */
    constructor(props) {
        super(props);
        this.state = {};
    }
    /**
     * @returns labels as any[]
     */
    getLabels() {
        let labels = [];
        const { bottomVal, topVal } = this.props;
        const degreeRange = bottomVal - topVal;
        if (degreeRange) {
            const roundedTopVal = Math.floor(topVal);
            let interval = 0;
            if (degreeRange < FIFTY) {
                interval = 5;
            }
            else if (degreeRange < 100) {
                interval = TEN;
            }
            else {
                interval = TWENTY;
            }
            const numPoints = Math.floor(degreeRange / interval);
            const base = roundedTopVal + (interval - (roundedTopVal % interval));
            labels = Array.from(Array(numPoints).keys()).map(val => base + interval * val);
        }
        return labels;
    }
    render() {
        const { bottomVal, topVal, phases } = this.props;
        const yAxisLabels = this.getLabels();
        const scalingFactor = 100 / (bottomVal - topVal);
        const yAxisLabelElements = [];
        const phaseLabelElements = [];
        for (let i = 0; i < yAxisLabels.length; i += 1) {
            const style = {
                WebkitTransform: 'translate(0, -50%)',
                left: '-1px',
                msTransform: 'translate(0, -50%)',
                position: 'absolute',
                textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
                top: `${(yAxisLabels[i] - topVal) * scalingFactor}%`,
                transform: 'translate(0, -50%)'
            };
            yAxisLabelElements.push(React.createElement("div", { style: style, key: `label${i}` },
                "-",
                yAxisLabels[i]));
        }
        for (let i = 0; i < phases.length; i += 1) {
            const style = {
                left: `${phases[i].percentX}%`,
                position: 'absolute',
                textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
                top: `${phases[i].percentY}%`
            };
            phaseLabelElements.push(React.createElement("div", { style: style, key: `phase${i}` }, phases[i].phase));
        }
        return (React.createElement("div", { className: "y-axis-container", style: this.containerStyle },
            yAxisLabelElements,
            phaseLabelElements));
    }
}
//# sourceMappingURL=labels.js.map