import React from 'react';
import type { YAxisProps } from './types';
/**
 * Y axis for an individual waveform
 */
export declare class YAxis extends React.Component<YAxisProps, never> {
    /** Handle to the axis wrapper HTMLElement */
    private axisRef;
    /** Handle to the d3 svg selection, where the axis will be created. */
    private svgAxis;
    private resizeObserverTimeout;
    private readonly resizeObserver;
    /**
     * The axis height. This is tracked using a ResizeObserver so that we don't have to have
     * the DOM recompute styles just to see the height on every render.
     */
    private axisHeightPx;
    /**
     * Constructor
     *
     * @param props Y Axis props as YAxisProps
     */
    constructor(props: YAxisProps);
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount(): void;
    /**
     * React lifecycle
     *
     * @param nextProps props for the axis of type YAxisProps
     *
     * @returns boolean
     */
    shouldComponentUpdate(nextProps: YAxisProps): boolean;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    /**
     * Cleanup the resize observer
     */
    componentWillUnmount(): void;
    render(): JSX.Element;
    /**
     * Draw the axis
     */
    readonly display: () => number;
    readonly calcAxisRange: () => {
        min: number;
        max: number;
    } | undefined;
    private readonly onResize;
    /**
     * Updates the SVG with the min/max amplitudes and ticks
     */
    private readonly drawAxis;
    /**
     * handles the ref callback function on the axis div
     *
     * @param axisRef the ref provided by the div
     */
    private readonly handleRef;
}
//# sourceMappingURL=y-axis.d.ts.map