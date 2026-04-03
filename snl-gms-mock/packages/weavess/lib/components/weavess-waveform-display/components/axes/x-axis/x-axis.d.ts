import React from 'react';
import type { XAxisProps } from './types';
/**
 * The tick formatter used for the axis.
 *
 * @param date the date object
 * @returns the formatted time string
 */
export declare const tickFormatter: (date: Date) => string;
/**
 * The tick formatter used for the axis when time interval is below minimum threshold
 *
 * @param epochSeconds time in epoch seconds
 * @returns the formatted time string
 */
export declare const subMillisecondFormatterFactory: (numberOfDigits?: number) => (epochSeconds: number) => string;
/**
 * A D3-based Time Axis component
 */
export declare class XAxis extends React.PureComponent<XAxisProps, never> {
    /** A handle to the axis wrapper HTML element */
    axisRef: HTMLElement | null;
    /** A handle to the svg selection d3 returns, where the axis will be created */
    private svgAxis;
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount(): void;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(prevProps: XAxisProps): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    render(): JSX.Element;
    /**
     * Re-draw the axis based on new parameters
     * Not a react life cycle method. Used to manually update the time axis
     * This is done to keep it performant, and not have to rerender the DOM
     */
    readonly update: () => void;
    private readonly internalUpdate;
}
//# sourceMappingURL=x-axis.d.ts.map