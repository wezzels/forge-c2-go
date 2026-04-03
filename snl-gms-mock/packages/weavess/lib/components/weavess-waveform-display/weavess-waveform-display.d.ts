import type { MeasureWindowSelection } from '@gms/weavess-core/lib/types';
import React from 'react';
import type { WeavessWaveformDisplayProps, WeavessWaveformDisplayState } from './types';
import { WeavessWaveformPanel } from './weavess-waveform-panel';
/**
 * Parent container for weavess. Contains a Waveform Panel for the main display
 * and the measure window.
 */
export declare class WeavessWaveformDisplay extends React.PureComponent<WeavessWaveformDisplayProps, WeavessWaveformDisplayState> {
    /** Reference to the waveform panel. */
    waveformPanelRef: WeavessWaveformPanel | null;
    /** Reference to the measure window container. */
    measureWindowContainerRef: HTMLDivElement | null;
    /** Reference to the measure window panel. */
    measureWindowPanelRef: WeavessWaveformPanel | null;
    /**
     * Constructor
     *
     * @param props WeavessWaveformDisplayProps
     */
    constructor(props: WeavessWaveformDisplayProps);
    /**
     * Invoked right before calling the render method, both on the initial mount
     * and on subsequent updates. It should return an object to update the state,
     * or null to update nothing.
     *
     * @param nextProps the next props
     * @param prevState the previous state
     */
    static getDerivedStateFromProps(nextProps: WeavessWaveformDisplayProps, prevState: WeavessWaveformDisplayState): Partial<WeavessWaveformDisplayState> | null;
    componentDidMount(): void;
    /**
     * Manages registration for the editSignalDetectionUncertainty hotkey if the combos change
     */
    componentDidUpdate(prevProps: Readonly<WeavessWaveformDisplayProps>): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    componentWillUnmount(): void;
    /**
     * Exposed primarily for non-react users.
     */
    refresh: () => void;
    /**
     * Converts a timestamp in seconds into the WebGL units in clipping space.
     *
     * @param timeSec the time to convert
     * @returns the equivalent GL units (in webGL clipping space)
     */
    readonly convertTimeToGL: (timeSec: number) => number;
    /**
     * Returns true if the measure window is visible; false otherwise.
     *
     * @returns true if visible; false otherwise
     */
    isMeasureWindowVisible: () => boolean;
    /**
     * Removes the selection div that spans all stations
     */
    clearBrushStroke: () => void;
    /**
     * Updates the start and end of the brush stroke
     * @param start start time to set the brush to
     * @param end end time to set the brush to
     * @returns void
     */
    updateBrushStroke: (start: number, end: number) => void;
    /**
     * Toggle the measure window visibility.
     */
    toggleMeasureWindowVisibility: () => void;
    /**
     * Pass through method to expose the panels scrollToRow method which vertically scrolls to center a row
     * @param rowId rowId to scroll to
     * @param centered Should the row be centered(true) or top aligned(false)
     */
    scrollToRow: (rowId: string, customRowHeight?: number, heightOffset?: number, centered?: boolean) => void;
    getMeasureWindowHeightPx: () => number;
    setMeasureWindowSelection: (measureWindowSelection: MeasureWindowSelection) => void;
    /**
     * Toggles whether or not waveforms or spectrograms should be rendered
     *
     * Toggle Order (repeat):
     *   * render: waveforms and spectrograms
     *   * render: waveforms
     *   * render: spectrograms
     */
    toggleRenderingContent: () => void;
    /** Toggles whether or not waveforms should be rendered */
    toggleShouldRenderWaveforms: () => void;
    /** Toggles whether or not spectrograms should be rendered */
    toggleShouldRenderSpectrograms: () => void;
    /**
     * Used to reset any Manual Amplitude Scaling override for main waveform panel
     * and measure window panel
     */
    readonly resetWaveformPanelAmplitudes: () => void;
    /**
     * Used to reset any Manual Amplitude Scaling override for single channel for either
     * main waveform panel or measure window
     */
    readonly resetSelectedWaveformAmplitudeScaling: (channelIds: string[], isMeasureWindow: boolean) => void;
    /** ** ** ** ** ** ** ** ** **
     * Private Functions
     * ** ** ** ** ** ** ** ** ** */
    /**
     * A setter to set the waveform panel ref
     *
     * @param ref the ref returned from the WeavessWaveformPanel
     */
    private readonly setWaveformRef;
    /**
     * A setter to set the measure window ref
     *
     * @param ref the ref returned from the WeavessWaveformPanel contained within the MeasureWindow
     */
    private readonly setMeasureWindowRef;
    /**
     * Update measure window
     *
     * @param measureWindowSelection
     */
    private readonly updateMeasureWindow;
    /**
     * Handler for when the measure window is resized.
     *
     * @param heightPx the new height of the measure window
     */
    private readonly onMeasureWindowResizeMouseUp;
    render(): JSX.Element;
}
//# sourceMappingURL=weavess-waveform-display.d.ts.map