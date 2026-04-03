import type { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import type * as THREE from 'three';
import { Label } from './components';
import type { ChannelProps, ChannelState } from './types';
/**
 * Channel Component. Contains a Label, a Waveform (or other graphic component) and optional events
 */
export declare class Channel extends React.PureComponent<ChannelProps, ChannelState> {
    /** The label container reference. */
    labelContainerRef: HTMLElement;
    /** The label reference. */
    labelRef: Label;
    /** The empty container reference. */
    private emptyContainerRef;
    /** The empty renderer reference. */
    private emptyRendererRef;
    /** The waveform container reference. */
    private waveformContainerRef;
    /** The waveform content reference. */
    private waveformContentRef;
    /** The waveform renderer reference. */
    private waveformRendererRef;
    /** The spectrogram container reference. */
    private spectrogramContainerRef;
    /** The spectrogram content reference. */
    private spectrogramContentRef;
    /** The spectrogram renderer reference. */
    private spectrogramRendererRef;
    /** Current mouse position in [0,1] */
    private mouseXPosition;
    /** Current mouse position on mouse down */
    private mouseDownXPosition;
    /** Current mouse position in pixels from the left of the window */
    private mousePosition;
    /** The id of the hotkey listener for cleanup on unmount */
    private globalHotkeyListenerId;
    private readonly contentRenderMouseDown;
    /**
     * Constructor
     *
     * @param props Channel props as ChannelProps
     */
    constructor(props: ChannelProps);
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
    componentDidUpdate(prevProps: ChannelProps, prevState: ChannelState): void;
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error: any, info: any): void;
    componentWillUnmount(): void;
    private readonly getContentRenderer;
    /**
     * Renders the waveform content of the channel
     */
    private readonly getSignalDetections;
    /**
     * Render the scene of the channel.
     * !!Performance sensitive code!!
     * This gets called in the `requestAnimationFrame` loop in {@link WeavessWaveformPanel}
     *
     * @param renderer
     * @param boundsRect
     */
    renderScene: (renderer: THREE.WebGLRenderer, canvasRect: DOMRect, viewportRect: DOMRect) => void;
    render(): JSX.Element;
    /**
     * Returns the current mouse position.
     *
     * @returns the mouse position
     */
    readonly getMousePosition: () => WeavessTypes.MousePosition;
    /**
     * Returns the time in seconds for the current mouse x position
     *
     * @returns the time in seconds
     */
    readonly getTimeSecs: () => number;
    /**
     * Reset the amplitude of the waveform.
     */
    resetAmplitude: () => void;
    /**
     * Update amplitudes and y axis with the new boundaries.
     *
     * @param timeRange optionally, provide a time range for which to calculate amplitude bounds.
     */
    updateAmplitude: (timeRange: WeavessTypes.TimeRange) => Promise<void>;
    /**
     * Get channel name
     *
     * @returns channel name
     */
    getChannelId: () => string | undefined;
    /**
     * Get Waveform YAxisBounds
     *
     * @returns the Waveform YAxisBounds
     */
    getWaveformYAxisBound: () => WeavessTypes.YAxisBounds | undefined;
    /**
     * @returns true if this channel's amplitude is manually scaled
     */
    isAmplitudeManuallyScaled: () => boolean;
    /**
     * @returns true if this channel's amplitude is manually scaled
     */
    getManualScale: () => {
        top: number;
        bottom: number;
    };
    /** **************************
     * Begin private properties
     *************************** */
    /**
     * Returns a percentage representing how tall each renderer is.
     *
     * @returns the height in percent, equal to 100% / the number of renderers
     */
    private readonly getHeightPercentage;
    private readonly setLabelRef;
    private readonly getYAxisBounds;
    /**
     * Renders the label of the channel
     */
    private readonly renderChannelLabel;
    /**
     * Get the content information of the channel
     */
    private readonly getContent;
    /**
     * Renders the content of the channel
     */
    private readonly renderContent;
    /**
     * Renders the channel content with no graphics
     */
    private readonly renderNoGraphics;
    private readonly updateMeasureWindowPanel;
    /**
     * The amount of pixels allocated for the label
     *
     * @returns number of pixels
     */
    private readonly labelWidthPx;
    private readonly toast;
    private readonly setWaveformContentRef;
    private readonly setWaveformContainerRef;
    private readonly setWaveformRendererRef;
    /**
     * Renders the spectrogram content of the channel
     */
    private readonly renderSpectrogram;
    /**
     * Build spectrogram renderer JSXElement
     *
     * @param spectrogram spectrogram data
     * @returns JSX.Element
     */
    private readonly buildSpectrogramRendererElement;
    /**
     * onWaveformContextMenu event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onWaveformContextMenu;
    /**
     * onSpectrogramContextMenu event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onSpectrogramContextMenu;
    /**
     * onMouseMove event handler
     *
     * @param e The mouse event
     */
    private readonly onMouseMove;
    /**
     * onWaveformMouseUp event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onWaveformMouseUp;
    /**
     * Determines if a mask has been clicked. If a mask is shorter than a second
     * A buffer of 0.5secs to the start and end time is added so that it can be seen
     * visually and a users can click it.
     */
    private readonly determineIfMaskIsClicked;
    /**
     * onSpectrogramMouseUp event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    private readonly onSpectrogramMouseUp;
    private readonly isMeasureWindowEnabled;
    /**
     * onMouseDown event handler, may have to move the measureWindow logic to keydown
     * to distinguish between command click and regular click
     *
     * @param e The mouse event
     */
    private readonly onMouseDown;
    /**
     * onSpectrogramKeyDown event handler
     *
     * @param e mouse event as React.KeyboardEvent<HTMLDivElement>
     */
    private readonly onSpectrogramKeyDown;
    /**
     * onKeyPress event handler
     *
     * @param e
     */
    private readonly onKeyDown;
    /**
     * @returns true if the min amplitude is -1 and the max amplitude is 1, which are the defaults.
     */
    private readonly isUsingDefaultWaveformYAxisBounds;
    /**
     * Set the waveform y-axis bounds for the channel.
     *
     * @param min
     * @param max
     */
    private readonly setWaveformYAxisBounds;
    /**
     * Set the spectrogram y-axis bounds for the channel.
     *
     * @param min
     * @param max
     */
    private readonly setSpectrogramYAxisBounds;
    /**
     *
     * Calculate the offset scale based on the width of the render area.
     *
     * @param width the width of the render area
     */
    private readonly calculateOffset;
    /**
     * Renders the scene which had its data calculated in {@link WaveformRenderer}
     */
    private readonly internalRenderScene;
}
//# sourceMappingURL=channel.d.ts.map