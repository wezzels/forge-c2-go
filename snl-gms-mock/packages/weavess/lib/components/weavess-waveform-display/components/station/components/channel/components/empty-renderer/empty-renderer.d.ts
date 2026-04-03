import React from 'react';
import * as THREE from 'three';
import type { EmptyRendererProps } from './types';
/**
 * Empty component. Renders and displays an empty graphics data.
 */
export declare class EmptyRenderer extends React.PureComponent<EmptyRendererProps, never> {
    /** THREE.Scene for this channel */
    scene: THREE.Scene;
    /** Orthographic camera used to zoom/pan around the spectrogram */
    camera: THREE.OrthographicCamera;
    /** Current min in gl units */
    private readonly glMin;
    /** Current max in gl units */
    private readonly glMax;
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount(): void;
    render(): null;
}
//# sourceMappingURL=empty-renderer.d.ts.map