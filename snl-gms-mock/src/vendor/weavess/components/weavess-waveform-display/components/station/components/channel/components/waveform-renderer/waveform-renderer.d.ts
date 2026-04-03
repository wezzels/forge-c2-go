import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import * as THREE from 'three';
import type { BoundaryAndDataSegmentsPair, WaveformRendererProps } from './types';
/**
 * Waveform component. Renders and displays waveform graphics data.
 */
export declare class WaveformRenderer extends React.PureComponent<WaveformRendererProps, never> {
    /**
     * Flag to ensure that deprecated messages are only logged once in the logger
     * note: will only log when NODE_ENV is set to `development`
     */
    private static shouldLogDeprecated;
    /** Default channel props, if not provided */
    static readonly defaultProps: WeavessTypes.ChannelDefaultConfiguration;
    /** THREE.Scene which holds the waveforms for this channel */
    scene: THREE.Scene | null;
    /**
     * A map of channel names to {@link LineAndDataSegmentPair}, which contain the rendered `THREE.Line` objects
     * in the scene. Having the channel names makes it possible to quickly find the `Lines`, and having the
     * `DataSegment` paired with the lines makes it possible to map bounds that were created with those
     * `DataSegment` objects to the corresponding `Line` object that represents that data segment.
     *
     * This all supports auto-centering of waveforms, which need to be independently demeaned per ChannelSegment.
     */
    private readonly lines;
    /** Orthographic camera used to zoom/pan around the waveform */
    camera: THREE.OrthographicCamera | null;
    /** Shutting down stop and calls */
    private shuttingDown;
    /** Building Masks */
    private buildingMasks;
    /** References to the masks drawn on the scene. */
    private renderedMaskRefs;
    /** References to the mask start/end points drawn on the scene. */
    private renderedMaskPointRefs;
    /** References to the masks to be drawn on the scene. */
    private readonly tempRenderedMaskRefs;
    /** References to the mask start/end points to be drawn on the scene. */
    private readonly tempRenderedMaskPointRefs;
    /** Camera max top value for specific channel. */
    private cameraTopMax;
    /** Camera max bottom value for specific channel */
    private cameraBottomMax;
    /** Camera max bottom value for specific channel */
    private maskHeight;
    /** The max manual amplitude scaled value to set on channel */
    private manualAmplitudeScaledTopValue;
    /** The minimum manual amplitude scaled value to set on channel */
    private manualAmplitudeScaledBottomValue;
    /** Manual amplitude scale is set */
    private isManualAmplitudeScaleSet;
    /**
     * Map keyed on waveform filter id, mapped to a record keyed on channel names paired with a map of data segments mapped to processed data segments.
     * This puzzle of a data structure allows lookup of processed waveforms (the Float32ArrayData objects) that have been correctly converted
     * into the type used by Weavess.
     *
     * Lookup is done by these keys, in this order:
     * * filterId
     * * channel name (from the channelSegment, including derived channels)
     * * DataSegment
     */
    private processedSegmentCache;
    /** Left side of the channel that's outside the {@link WaveformRendererProps.viewableInterval} */
    private leftBoundaryMarker;
    /** Right side of the channel that's outside the {@link WaveformRendererProps.viewableInterval} */
    private rightBoundaryMarker;
    /**
     * Map from filter name to a record of channel names mapped to pre-calculated {@link WeavessTypes.ChannelSegmentBoundary}
     * objects. The `BoundaryDataSegmentsPair` objects contain boundaries paired with a list of `DataSegments` for which the
     * ChannelSegmentBoundary was computed.
     *
     * This allows for an association between the `Line` objects that are actually rendered in the scene and the
     * boundary computed for the `DataSegment` that the `Line` represents.
     */
    private channelSegmentBoundariesMap;
    /** Default cameraZ */
    private readonly defaultCameraZDepth;
    /** Default cameraY */
    private readonly defaultCameraY;
    private readonly MASK_SPRITE;
    /**
     * Update amplitude for given time range
     */
    updateAmplitude: ((timeRange: WeavessTypes.TimeRange) => Promise<void>) & import("lodash").Cancelable;
    /**
     * Constructor
     *
     * @param props Waveform props as WaveformRenderProps
     */
    constructor(props: WaveformRendererProps);
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount(): Promise<void>;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(prevProps: WaveformRendererProps): Promise<void>;
    /**
     * Stop any calls propagating to channel after unmount
     */
    componentWillUnmount(): void;
    /**
     * Get the manual scaled amplitude if set else returns 0
     *
     * @returns camera (manual) amplitude scaled value
     */
    getCameraManualScaleAmplitude: () => {
        top: number;
        bottom: number;
    };
    /**
     * @returns true if amplitude has been manually scaled
     */
    isManuallyAmplitudeScaled: () => boolean;
    /**
     * Scales the amplitude of the single waveform.
     *
     * @param e The mouse event
     */
    readonly beginScaleAmplitudeDrag: (e: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Reset the amplitude to the default.
     */
    resetAmplitude: () => void;
    /**
     * Gets the channel segments with the ID provided in this.props
     *
     * @returns the channel segments that matches the channelSegmentID given by props
     */
    private readonly getThisChannelSegments;
    /**
     * If the Amplitude values in the ChannelSegmentBoundary was not already set
     * create them and set them in the ChannelSegmentBoundary map for each channel segment
     *
     * * @param timeRange
     */
    private readonly updateBounds;
    /**
     * Updates ChannelSegmentBoundary map for each channel segment
     *
     * @param timeRange
     * @param channelSegment
     * @param id
     */
    private readonly updateChannelSegmentBounds;
    /**
     * Update the min,max in gl units where we draw waveforms, if the view bounds have changed.
     *
     * @param prevProps The previous waveform props
     */
    private readonly updateCameraBounds;
    /**
     * For measure window update the camera amplitude adjustment if adjustment changed
     * or the display time range has changed
     *
     * @param prevProps The previous waveform props
     */
    private readonly updateMsrWindowCameraAmplitudeAdjustment;
    /**
     * Prepares the waveform display for rendering.
     *
     * @param refreshVerticesCache True if the cache should be refreshed, false otherwise
     */
    private readonly prepareWaveformData;
    /**
     * Updates the y axis and camera position based on the boundaries in this.ChannelSegmentBoundary
     */
    private readonly updateAmplitudeFromBounds;
    /**
     * Update the camera and y-axis based on the min/max amplitudes
     * Shifts the Line objects within the scene based on their boundary channel average, which effectively
     * will demean the waveforms if the average is not 0.
     *
     * @param amplitudeMin - The min amplitude of all channel segments displayed in this time range
     * @param amplitudeMax - The max amplitude of all channel segments displayed in this time range
     * @param channelsToBoundaryDataSegmentsPairs - A record mapping channel names to pairs associating data segments with boundaries
     */
    private readonly updateCameraAndYAxisForMinMaxAmplitudes;
    /**
     * Update the camera's top and bottom limits based on the maximum offset.
     * This ensures that the values actually set for the min and max always include the provided
     * min and max amplitudes. However, the values set may be a superset of the provided range
     * to match the values that will be displayed on the y-axis. This avoids slight differences
     * between the displayed scale and the actual one.
     *
     * @param amplitudeMin - The min amplitude value
     * @param amplitudeMax - The max amplitude value
     */
    private readonly updateCameraYAxisLimits;
    /**
     * Apply the default y-axis range if provided
     */
    private readonly applyDefaultYAxisRange;
    /**
     * Update the mask height based on the camera's top and bottom limits
     */
    private readonly updateMaskHeight;
    /**
     * Handle the case where the top and bottom limits are the same
     * Adds 1 to the top and subtracts one from the bottom, in this case.
     * This prevents a bug where the max and min are the same, and so nothing gets rendered.
     */
    private readonly updateCameraBoundsIfFlatLine;
    /**
     * Update the camera frustum based on the manual scale, if one is set. Otherwise, set
     * the camera to use the {@link cameraTopMax} and {@link cameraBottomMax} values instead.
     */
    private readonly updateCameraFrustum;
    /**
     * Update the positions of the Lines within the scene based on boundary ChannelSegment averages.
     * This adjusts the position of the Line by the corresponding boundary's `channelAvg` value.
     * This effectively centers the Line without changing its scale, if the average is correct.
     * If the average is 0, nothing will change.
     *
     * @param channelsToBoundaryDataSegmentsPairs - A record mapping channel names to pairs
     * associating data segments with boundaries
     */
    private readonly updateLinePositions;
    /**
     * Set the y axis bounds to use the current camera frustum
     * (`this.camera.top` and `this.camera.bottom`)
     */
    private readonly updateYAxisBoundsForCameraPosition;
    /**
     * Add line or scatter points to the scene
     *
     * @param id the
     * @param float32ArrayWithStartTime
     * @param anySelected
     */
    private readonly addScene;
    /**
     * Sorts processed data into two groups so to make sure the bright (selected) waveforms are more visible
     * add the bright waveforms after the dimmed waveforms.
     * Bright waveforms will come first in the arrays for each channel name
     *
     * @param chanNameToProcessedData A record of the channel names mapped to a Map pairing DataSegments to Float32ArrayData for this channel
     * @param anySelected are any of the channel segments selected
     * @returns an array containing Records connecting channelNames to waveforms grouped according to when they should be rendered so that
     * selected waveforms are rendered on top. Waveforms in Records appearing later in the array are rendered on top of the earlier ones.
     */
    private readonly createSortedWaveformRecords;
    /**
     * Manages {@link this.leftBoundaryMarker} and {@link this.rightBoundaryMarker}.
     * Calculates width, height, and position using interval times and the camera.
     * !This must be called *after* {@link this.updateAmplitudeFromBounds}, which updates {@link this.camera.top}.
     */
    private readonly updateBoundaryMarkers;
    /**
     * Iterates through cached vertices data in the float32 array format
     * and creates ThreeJS objects and adds them to the
     * ThreeJS scene
     */
    private readonly setupThreeJSFromVertices;
    /**
     * Converts waveform data into useable vertices
     */
    private readonly convertDataToVerticesArray;
    /**
     * Converts claim check data to a Float32Array
     *
     * @param getPositionBuffer valid getPositionBuffer getter (passed as Weavess props)
     * @param data to convert
     * @returns converted Float32Array data
     * @throws if getPositionBuffer callback is undefined
     */
    private readonly convertDataClaimCheckToFloat32;
    /**
     * Converts sample rate data to a Float32Array
     *
     * @param data to convert
     * @returns converted Float32Array data
     */
    private readonly convertDataBySampleRateToFloat32;
    /**
     * Converts data by time to a Float32Array
     *
     * @param data to convert
     * @returns converted Float32Array data
     */
    private readonly convertDataByTimeToFloat32;
    /**
     * Converts a data segment into a Float32ArrayData
     * if it is dataClaimCheck or dataBySampleRate
     * if already a Float32ArrayData then just returns it
     *
     * @param dataSegment to convert
     * @returns converted Float32ArrayData  or undefined
     */
    private readonly convertDataSegmentDataFloat32;
    /**
     * Converts each Data Segment to Float32ArrayData
     *
     * @param channelSegments
     * @returns a Record mapping channelName to {@link Float32ArrayDataAndDataSegmentPair} which contains
     * a map of the data segments to the fully hydrated waveform data to be rendered.
     */
    private readonly convertWaveformDataFloat32;
    /**
     * Filter data segment values for amplitude values for time range
     *
     * @param dataSegment
     * @param timeRange
     * @returns amplitude values
     */
    private readonly amplitudeValuesFromDataSegment;
    /**
     * Given a channel segment and id creates the Channel Segment Boundaries
     *
     * @param channelSegment
     * @param channelSegmentId
     * @returns ChannelSegmentBoundary
     */
    private readonly createChannelSegmentBoundary;
    /**
     * Render the Masks to the display.
     *
     * @param masks The masks (as Mask[]) to render
     */
    private readonly renderChannelMasks;
    /**
     * Builds a plane to layer over the waveform data in order to color it.  Stores the plane in the tempRenderedMaskRefs variable
     *
     * @param mask mask to build a plane for
     * @param timeToGlScale the scale used by the waveform
     * @returns void.  Mask plane is stored in class level object
     */
    private readonly buildMaskPlaneObject;
    /**
     * Builds ThreeJS points to place at the start and end of the mask.  Stores the points in the tempRenderedMaskPointRefs variable
     *
     * @param mask mask to build points for
     * @param timeToGlScale the scale used by the waveform
     * @returns void.  Mask points is stored in class level object
     */
    private readonly buildMaskPointsObject;
    /**
     * Set the y-axis bounds for a particular channel
     * Calls the onSetAmplitude event if one was given for this channel
     *
     * @param bounds A populated ChannelSegmentBoundary object. If the channelSegmentId is not known, this will use
     * the channel name as the default.
     */
    private readonly setYAxisBounds;
    /**
     * Find the data segment for a given time
     *
     * @param time the time in seconds to find the data segment for
     * @returns the data segment that spans the time requested
     */
    private readonly findDataSegmentForTime;
    /**
     * Find the waveform amplitude for a given time from the DataClaimCheck
     *
     * @param time the time in seconds to find the amplitude for
     * @param data WeavessTypes.DataClaimCheck containing the amplitudes
     * @returns the amplitude of the beam at the given time
     * defaults to 0 if no value is found
     */
    private readonly findAmplitudeFromDataClaimCheck;
    /**
     * Find the waveform amplitude for a given time for a qc masks.  This value has the demeaning value
     * applied if applicable
     *
     * @param time the time in seconds to find the amplitude for
     * @param channelName the channel name to load demeaning value for
     * @param boundaryDataSegmentsPairs the boundary data semgent pairs to load demeaning data from
     * @returns the amplitude of the beam at the given time
     */
    readonly findMaskAmplitudeAtTime: (time: number, channelName: string, boundaryDataSegmentsPairs?: Record<string, BoundaryAndDataSegmentsPair[]>) => number;
    render(): null;
    /**
     * Remove the scene children
     */
    private readonly clearScene;
}
//# sourceMappingURL=waveform-renderer.d.ts.map