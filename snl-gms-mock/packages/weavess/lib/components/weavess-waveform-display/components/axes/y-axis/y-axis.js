/* eslint-disable react/destructuring-assignment */
import { UILogger } from '@gms/ui-util';
import { WeavessConstants } from '@gms/weavess-core';
import * as d3 from 'd3';
import debounce from 'lodash/debounce';
import defer from 'lodash/defer';
import isNumber from 'lodash/isNumber';
import mean from 'lodash/mean';
import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { getYAxisTickFormatter } from './util';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * Y axis for an individual waveform
 */
export class YAxis extends React.Component {
    /** Handle to the axis wrapper HTMLElement */
    axisRef;
    /** Handle to the d3 svg selection, where the axis will be created. */
    svgAxis;
    resizeObserverTimeout;
    resizeObserver;
    /**
     * The axis height. This is tracked using a ResizeObserver so that we don't have to have
     * the DOM recompute styles just to see the height on every render.
     */
    axisHeightPx = 0;
    /**
     * Constructor
     *
     * @param props Y Axis props as YAxisProps
     */
    constructor(props) {
        super(props);
        this.resizeObserver = new ResizeObserver(() => {
            this.resizeObserverTimeout = setTimeout(this.onResize, 0);
        });
    }
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount() {
        if (!this.axisRef)
            return;
        this.resizeObserver.observe(this.axisRef);
        const width = 50;
        const translate = 49;
        const svg = d3.select(this.axisRef).append('svg');
        svg.attr('height', `100%`).attr('width', width);
        this.svgAxis = svg
            .append('g')
            .attr('class', 'y-axis__ordinate')
            .attr('height', `${this.props.heightInPercentage ?? 100}%`)
            .attr('transform', `translate(${translate},0)`);
        this.display();
    }
    /**
     * React lifecycle
     *
     * @param nextProps props for the axis of type YAxisProps
     *
     * @returns boolean
     */
    shouldComponentUpdate(nextProps) {
        // has changed
        return !(this.props.maxAmplitude === nextProps.maxAmplitude &&
            this.props.minAmplitude === nextProps.minAmplitude &&
            this.props.heightInPercentage === nextProps.heightInPercentage);
    }
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate() {
        this.display();
    }
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess YAxis Error: ${error} : ${info}`);
    }
    /**
     * Cleanup the resize observer
     */
    componentWillUnmount() {
        clearTimeout(this.resizeObserverTimeout);
        if (this.axisRef)
            this.resizeObserver.unobserve(this.axisRef);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    // eslint-disable-next-line react/sort-comp
    render() {
        const axisRange = this.calcAxisRange();
        return (React.createElement("div", { className: "y-axis", "data-cy": "y-axis", "data-min": axisRange?.min, "data-max": axisRange?.max, ref: this.handleRef, style: {
                height: `calc(${this.props.heightInPercentage ?? 100}% - ${WeavessConstants.WAVEFORM_PADDING_PX * 2}px)`,
                margin: `${WeavessConstants.WAVEFORM_PADDING_PX}px 0 ${WeavessConstants.WAVEFORM_PADDING_PX}px 0`
            } }));
    }
    /**
     * Draw the axis
     */
    display = () => defer(debounce(this.drawAxis));
    calcAxisRange = () => {
        // adjust the min/max with a pixel padding to ensure that all of the number are visible
        const min = this.props.minAmplitude;
        const max = this.props.maxAmplitude;
        // If both min and max are numbers (helps where min or max are equal to 0)
        if (isNumber(min) && isNumber(max)) {
            return {
                min,
                max
            };
        }
        return undefined;
    };
    onResize = () => {
        this.display();
        this.axisHeightPx = this.axisRef?.clientHeight ?? this.axisHeightPx;
    };
    /**
     * Updates the SVG with the min/max amplitudes and ticks
     */
    drawAxis = () => {
        if (!this.axisRef)
            return;
        const width = 50;
        // Get min max amplitude values
        const axisRange = this.calcAxisRange();
        // If the axisRange is undefined clear the yAxis amplitudes and tick marks
        if (!axisRange) {
            const scale = d3.scaleLinear().domain([]).range([0, 0]);
            this.svgAxis.call(d3.axisLeft(scale).ticks(0).tickFormat(null).tickSizeOuter(0).tickValues([]));
            return;
        }
        const totalTicks = this.props.yAxisTicks ? this.props.yAxisTicks.length : 3;
        d3.select(this.axisRef)
            .select('svg')
            .attr('height', `100%`)
            .attr('width', width)
            .attr('overflow', 'visible');
        const yAxisScale = d3
            .scaleLinear()
            .domain([axisRange.min, axisRange.max])
            .range([this.axisHeightPx, 0]);
        let tickValues = [];
        if (this.props.yAxisTicks) {
            tickValues = this.props.yAxisTicks;
        }
        else {
            let meanValue = mean([axisRange.min, axisRange.max]);
            const meanValueZeroMin = -0.099;
            const meanValueZeroMax = 0.099;
            // make sure we don't display -0
            if (meanValue && meanValue >= meanValueZeroMin && meanValue <= meanValueZeroMax) {
                meanValue = Math.abs(meanValue);
            }
            tickValues = [axisRange.min, meanValue, axisRange.max];
        }
        const tickFormatter = getYAxisTickFormatter(axisRange.min, axisRange.max);
        const yAxis = d3
            .axisLeft(yAxisScale)
            .ticks(totalTicks)
            .tickFormat(tickFormatter)
            .tickSizeOuter(0)
            .tickValues(tickValues);
        this.svgAxis.call(yAxis);
        // TODO allow the tick marks to be more customizable within WEAVESS
        // TODO allow props to specify whether or not tick marks should be rendered (none, all, odd, or even)
        if (!this.props.yAxisTicks) {
            const paddingPx = 6;
            const groups = this.svgAxis.selectAll('text');
            d3.select(groups._groups[0][0]).attr('transform', `translate(0,${-1 * paddingPx})`);
            d3.select(groups._groups[0][2]).attr('transform', `translate(0,${paddingPx})`);
        }
    };
    /**
     * handles the ref callback function on the axis div
     *
     * @param axisRef the ref provided by the div
     */
    handleRef = axisRef => {
        if (axisRef) {
            this.axisRef = axisRef;
        }
    };
}
//# sourceMappingURL=y-axis.js.map