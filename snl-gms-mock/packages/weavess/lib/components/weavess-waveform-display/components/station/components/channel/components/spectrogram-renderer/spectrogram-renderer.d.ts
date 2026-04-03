import React from 'react';
import * as THREE from 'three';
import type { SpectrogramRendererProps } from './types';
/**
 * Spectrogram component. Renders and displays spectrogram graphics data.
 */
export declare class SpectrogramRenderer extends React.PureComponent<SpectrogramRendererProps, never> {
    /** THREE.Scene which holds the spectrograms for this channel */
    scene: THREE.Scene;
    /** Orthographic camera used to zoom/pan around the spectrogram */
    camera: THREE.OrthographicCamera;
    /** Current min for all points in gl units */
    private glMin;
    /** Current max for all points in gl units */
    private glMax;
    /**
     * A memoized function for creating the positions vertices.
     * The memoization function caches the results using
     * the most recent argument and returns the results.
     *
     * @param startTimeSecs the start time seconds
     * @param data the data
     * @param timeStep the time step
     * @param frequencyStep the frequency step
     *
     * @returns a map of string ids to vertices array
     */
    private readonly memoizedCreatePositionVertices;
    /**
     * Constructor
     *
     * @param props props as SpectrogramRendererProps
     */
    constructor(props: SpectrogramRendererProps);
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
    componentDidUpdate(prevProps: SpectrogramRendererProps): void;
    render(): null;
    /**
     * Update the min,max in gl units where we draw the spectrogram, if the view bounds have changed.
     *
     * @param prevProps The previous props
     */
    private readonly updateCameraBounds;
    /**
     * Generates the color scale.
     *
     * @param min The minimum frequency value
     * @param max THe maximum frequency value
     *
     * @returns D3 object that turns values into colors d3.ScaleSequential<d3.HSLColor>
     */
    private readonly createColorScale;
    /**
     * Renders the spectrogram
     */
    private readonly renderSpectrogram;
    /**
     * Creates the position vertices.
     *
     * @param startTimeSecs the start time seconds
     * @param data the data
     * @param timeStep the time step
     * @param frequencyStep the frequency step
     *
     * @returns a map of string ids to vertices array
     */
    private readonly createPositionVertices;
}
//# sourceMappingURL=spectrogram-renderer.d.ts.map