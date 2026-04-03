import type { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import { YAxis } from '../../../../../axes';
/**
 * Label component. Describes a waveform (or other graphic component) and has optional events
 */
export declare class Label extends React.PureComponent<WeavessTypes.LabelProps, never> {
    /** The y-axis references. */
    yAxisRefs: {
        [id: string]: YAxis | null;
    };
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(prevProps: WeavessTypes.LabelProps): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    /**
     * Creates the phase label and color string based on props.
     * If all are the same, returns that value. Otherwise, returns `*` for the label and
     * undefined for the color.
     *
     * @returns a phase label string and color string
     */
    private readonly getPhaseLabelAndColor;
    render(): JSX.Element;
    /**
     * Refreshes the y-axis for the label
     */
    readonly refreshYAxis: () => void;
    private readonly hasYAxes;
    /**
     * Helper method to reduce code complexity
     *
     * @param amplitude
     * @returns
     */
    private readonly amplitudeOrFallback;
    /**
     * The on context menu event handler
     * Does not fire if channel is in split-expansion mode
     *
     * @param e the mouse event
     */
    private readonly onContextMenu;
    /**
     * The label container content on click event handler
     *
     * @param e the mouse event
     */
    private readonly labelContainerContentOnClick;
}
//# sourceMappingURL=label.d.ts.map