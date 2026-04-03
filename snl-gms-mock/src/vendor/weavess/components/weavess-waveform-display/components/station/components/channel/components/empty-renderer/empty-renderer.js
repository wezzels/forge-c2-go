import React from 'react';
import * as THREE from 'three';
/**
 * Empty component. Renders and displays an empty graphics data.
 */
export class EmptyRenderer extends React.PureComponent {
    /** THREE.Scene for this channel */
    scene;
    /** Orthographic camera used to zoom/pan around the spectrogram */
    camera;
    /** Current min in gl units */
    glMin = 0;
    /** Current max in gl units */
    glMax = 100;
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount() {
        this.scene = new THREE.Scene();
        const cameraZDepth = 5;
        this.camera = new THREE.OrthographicCamera(this.glMin, this.glMax, 1, -1, cameraZDepth, -cameraZDepth);
        this.camera.position.z = 0;
    }
    render() {
        return null;
    }
}
//# sourceMappingURL=empty-renderer.js.map