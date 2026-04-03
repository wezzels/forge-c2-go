/* eslint-disable react/destructuring-assignment */
import { recordLength } from '@gms/common-util';
import { blendColors, UILogger } from '@gms/ui-util';
import { WeavessConstants, WeavessTypes, WeavessUtil } from '@gms/weavess-core';
import { deepEqual } from 'fast-equals';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import memoizeOne from 'memoize-one';
import React from 'react';
import * as THREE from 'three';
import { validateNonNullish } from '../../../../../../../../util/type-util';
import { clearThree, isWithinTimeRange } from '../../../../../../utils';
import { getYAxisTickFormatter } from '../../../../../axes/y-axis/util';
import { findDataSegmentTimeRange } from '../../../../utils';
import { doDataSegmentsMatch, doProcessedSegmentsHaveWaveformData } from './util';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * This override is to allow THREE to support 2d array buffers.
 * It assumes 3 points (x, y, and z) by default in an array buffer at
 * arr[0], arr[1], and arr[2], respectively. This allows us to override arr[2], because
 * it would not be present in a 2d buffer. By doing this, we are able to eliminate 1/3 of
 * the points in the buffer, since they are all 0 anyway.
 *
 * ! If this causes an error, delete it and change the array buffer to expect 3 points, the third of which is set to 0;
 *
 * eg: geometry.addAttribute('position', new THREE.BufferAttribute(float32Array, 3));
 * https://github.com/mrdoob/three.js/issues/19735
 *
 * @param index
 */
// eslint-disable-next-line func-names
THREE.BufferAttribute.prototype.getZ = function (index) {
    return this.array[index * this.itemSize + 2] || 0;
};
const getLineMaterial = memoizeOne((materialColor) => new THREE.LineBasicMaterial({
    color: materialColor,
    linewidth: 1
}));
/**
 * Filters values for Float32Array or number [] based on the time range
 * used to calculate min/max amplitudes for DataBySampleRate/DataClaimCheck data segments
 *
 * @param data
 * @param timeRange
 * @param valuesToFilter
 * @returns returns amplitude values within time range
 */
const filterValuesForDataSampleRate = (data, timeRange, valuesToFilter) => {
    let values = [];
    const { sampleRate, startTimeSecs } = data;
    const pointTimeIncrement = 1 / sampleRate;
    if (WeavessTypes.isFloat32Array(valuesToFilter)) {
        let timeIndex = 0;
        values = valuesToFilter.filter((value, index) => {
            if (index % 2 === 1) {
                timeIndex += 1;
            }
            const pointTimeSecs = pointTimeIncrement * timeIndex + startTimeSecs;
            if (index % 2 === 1 && isWithinTimeRange(pointTimeSecs, timeRange)) {
                return true;
            }
            return false;
        });
    }
    else if (!WeavessTypes.isTimeValuePairArray(valuesToFilter)) {
        // Filter out values where time is not withing the time range
        values = valuesToFilter.filter((value, index) => {
            const pointTimeSecs = pointTimeIncrement * index + startTimeSecs;
            return isWithinTimeRange(pointTimeSecs, timeRange);
        });
    }
    return values;
};
/**
 * Waveform component. Renders and displays waveform graphics data.
 */
export class WaveformRenderer extends React.PureComponent {
    /**
     * Flag to ensure that deprecated messages are only logged once in the logger
     * note: will only log when NODE_ENV is set to `development`
     */
    static shouldLogDeprecated = process.env.NODE_ENV === 'development';
    /** Default channel props, if not provided */
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        displayType: [WeavessTypes.DisplayType.LINE],
        pointSize: 2,
        color: '#4580E6'
    };
    /** THREE.Scene which holds the waveforms for this channel */
    scene;
    /**
     * A map of channel names to {@link LineAndDataSegmentPair}, which contain the rendered `THREE.Line` objects
     * in the scene. Having the channel names makes it possible to quickly find the `Lines`, and having the
     * `DataSegment` paired with the lines makes it possible to map bounds that were created with those
     * `DataSegment` objects to the corresponding `Line` object that represents that data segment.
     *
     * This all supports auto-centering of waveforms, which need to be independently demeaned per ChannelSegment.
     */
    lines = new Map();
    /** Orthographic camera used to zoom/pan around the waveform */
    camera;
    /** Shutting down stop and calls */
    shuttingDown = false;
    /** Building Masks */
    buildingMasks = false;
    /** References to the masks drawn on the scene. */
    renderedMaskRefs = [];
    /** References to the mask start/end points drawn on the scene. */
    renderedMaskPointRefs = [];
    /** References to the masks to be drawn on the scene. */
    tempRenderedMaskRefs = [];
    /** References to the mask start/end points to be drawn on the scene. */
    tempRenderedMaskPointRefs = [];
    /** Camera max top value for specific channel. */
    cameraTopMax = -Infinity;
    /** Camera max bottom value for specific channel */
    cameraBottomMax = Infinity;
    /** Camera max bottom value for specific channel */
    maskHeight = 0;
    /** The max manual amplitude scaled value to set on channel */
    manualAmplitudeScaledTopValue = 0;
    /** The minimum manual amplitude scaled value to set on channel */
    manualAmplitudeScaledBottomValue = 0;
    /** Manual amplitude scale is set */
    isManualAmplitudeScaleSet = false;
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
    processedSegmentCache = new Map();
    /** Left side of the channel that's outside the {@link WaveformRendererProps.viewableInterval} */
    leftBoundaryMarker;
    /** Right side of the channel that's outside the {@link WaveformRendererProps.viewableInterval} */
    rightBoundaryMarker;
    /**
     * Map from filter name to a record of channel names mapped to pre-calculated {@link WeavessTypes.ChannelSegmentBoundary}
     * objects. The `BoundaryDataSegmentsPair` objects contain boundaries paired with a list of `DataSegments` for which the
     * ChannelSegmentBoundary was computed.
     *
     * This allows for an association between the `Line` objects that are actually rendered in the scene and the
     * boundary computed for the `DataSegment` that the `Line` represents.
     */
    channelSegmentBoundariesMap = new Map();
    /** Default cameraZ */
    defaultCameraZDepth = 5;
    /** Default cameraY */
    defaultCameraY = 1;
    // PNG for the mask start/end point
    MASK_SPRITE = new THREE.TextureLoader().load(new URL('../../../../../../../../../../resources/textures/disc.png', import.meta.url).toString());
    /**
     * Update amplitude for given time range
     */
    updateAmplitude = debounce(async (timeRange) => {
        /**
         * If we are in the process of zooming, drop this call because another
         *
         * @function updateAmplitude call will be scheduled.
         */
        await this.updateBounds(timeRange);
        /**
         * If we are in the process of zooming, drop this call because another
         *
         * @function updateAmplitude call will be scheduled.
         * We add this second check here in case zooming was triggered while we awaited
         * the @function updateBounds above.
         */
        this.updateAmplitudeFromBounds();
        this.updateBoundaryMarkers();
        // If we have masks but the masks list is empty, render masks previous render was likely canceled due to boundaries not being set yet
        if (this.props.masks && this.renderedMaskRefs.length === 0) {
            const boundariesDataSegmentsPairs = this.channelSegmentBoundariesMap.get(this.props.filterId);
            this.renderChannelMasks(this.props.masks, boundariesDataSegmentsPairs);
        }
        this.props.renderWaveforms({ shouldCallAnimationLoopEnd: false }); // false so we don't get an infinite loop of amplitude update calls
    }, WeavessConstants.ONE_FRAME_MS, { leading: false, trailing: true });
    /**
     * Constructor
     *
     * @param props Waveform props as WaveformRenderProps
     */
    constructor(props) {
        super(props);
        // If the msr window amplitude scale adjustment (factor) is set
        // then this must be the measure window's channel so set the adjustment
        this.manualAmplitudeScaledTopValue = this.props.msrWindowWaveformAmplitudeScaleFactor?.top ?? 0;
        this.manualAmplitudeScaledBottomValue =
            this.props.msrWindowWaveformAmplitudeScaleFactor?.bottom ?? 0;
        this.isManualAmplitudeScaleSet = this.manualAmplitudeScaledTopValue !== 0;
    }
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************d
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    async componentDidMount() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(this.props.glMin, this.props.glMax, this.defaultCameraY, -this.defaultCameraY, this.defaultCameraZDepth, -this.defaultCameraZDepth);
        this.camera.position.z = 0;
        await this.prepareWaveformData(true);
        await this.updateBounds(this.props.displayInterval);
        this.updateAmplitudeFromBounds();
        await this.updateBounds(this.props.displayInterval);
        this.updateBoundaryMarkers();
    }
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    async componentDidUpdate(prevProps) {
        // if the measure window amplitude scale factor is set update camera amplitude factor
        if (this.props.msrWindowWaveformAmplitudeScaleFactor ||
            prevProps.msrWindowWaveformAmplitudeScaleFactor) {
            this.updateMsrWindowCameraAmplitudeAdjustment(prevProps);
        }
        // Received data for the first time
        if (!deepEqual(prevProps.channelSegmentsRecord, this.props.channelSegmentsRecord) ||
            prevProps.displayInterval !== this.props.displayInterval ||
            !deepEqual(prevProps.defaultRange, this.props.defaultRange) ||
            prevProps.getBoundaries !== this.props.getBoundaries ||
            prevProps.isAutoDimmed !== this.props.isAutoDimmed) {
            this.updateCameraBounds();
            await this.prepareWaveformData(true);
            this.updateBoundaryMarkers();
        }
        else if (prevProps.filterId !== this.props.filterId) {
            this.updateCameraBounds();
            try {
                await this.prepareWaveformData(false);
                this.props.setError(false);
                this.updateBoundaryMarkers();
            }
            catch {
                this.props.setError(true, `Error rendering channel segment ${this.props.filterId}`);
            }
        }
        if (prevProps.masks !== this.props.masks) {
            const boundariesDataSegmentsPairs = this.channelSegmentBoundariesMap.get(this.props.filterId);
            this.renderChannelMasks(this.props.masks || [], boundariesDataSegmentsPairs);
        }
    }
    /**
     * Stop any calls propagating to channel after unmount
     */
    componentWillUnmount() {
        this.shuttingDown = true;
        this.processedSegmentCache = new Map();
        this.channelSegmentBoundariesMap = new Map();
        clearThree(this.scene);
        this.scene = null;
        clearThree(this.camera);
        this.camera = null;
        clearThree(this.renderedMaskRefs);
        this.renderedMaskRefs = [];
        clearThree(this.renderedMaskPointRefs);
        this.renderedMaskPointRefs = [];
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Get the manual scaled amplitude if set else returns 0
     *
     * @returns camera (manual) amplitude scaled value
     */
    getCameraManualScaleAmplitude = () => {
        return this.isManualAmplitudeScaleSet
            ? { top: this.manualAmplitudeScaledTopValue, bottom: this.manualAmplitudeScaledBottomValue }
            : { top: 0, bottom: 0 };
    };
    /**
     * @returns true if amplitude has been manually scaled
     */
    isManuallyAmplitudeScaled = () => {
        return this.isManualAmplitudeScaleSet;
    };
    /**
     * Scales the amplitude of the single waveform.
     *
     * @param e The mouse event
     */
    beginScaleAmplitudeDrag = (e) => {
        if (!this.camera)
            return;
        // prevent propagation of these events so that the underlying channel click doesn't register
        let previousPos = e.clientY;
        let currentPos = e.clientY;
        let diff = 0;
        if (!this.isManualAmplitudeScaleSet) {
            this.isManualAmplitudeScaleSet = true;
            this.manualAmplitudeScaledTopValue = this.camera.top;
            this.manualAmplitudeScaledBottomValue = this.camera.bottom;
        }
        const onMouseMove = (e2) => {
            if (!this.camera)
                return;
            currentPos = e2.clientY;
            diff = previousPos - currentPos;
            previousPos = currentPos;
            const currentCameraRange = Math.abs(this.camera.top - this.camera.bottom);
            // calculate the amplitude adjustment
            const percentDiff = 0.05;
            const amplitudeAdjustment = currentCameraRange * percentDiff;
            // Was mouse moving up or down
            if (diff > 0) {
                this.manualAmplitudeScaledTopValue += amplitudeAdjustment;
                this.manualAmplitudeScaledBottomValue -= amplitudeAdjustment;
            }
            else if (diff < 0) {
                this.manualAmplitudeScaledTopValue -= amplitudeAdjustment;
                this.manualAmplitudeScaledBottomValue += amplitudeAdjustment;
            }
            // apply the any amplitude adjustment to the camera
            this.camera.top = this.manualAmplitudeScaledTopValue;
            this.camera.bottom = this.manualAmplitudeScaledBottomValue;
            const average = (this.camera.bottom + this.camera.top) / 2;
            this.setYAxisBounds({
                bottomMax: this.camera.bottom,
                topMax: this.camera.top,
                channelAvg: average,
                offset: Math.max(Math.abs(this.camera.top - average), Math.abs(this.camera.bottom - average)),
                channelSegmentId: this.props.channelName
            });
            this.camera.updateProjectionMatrix();
            this.props.renderWaveforms();
        };
        const onMouseUp = () => {
            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseup', onMouseUp);
        };
        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseup', onMouseUp);
    };
    /**
     * Reset the amplitude to the default.
     */
    resetAmplitude = () => {
        if (!this.camera)
            return;
        // Clear manual scaling
        this.manualAmplitudeScaledTopValue = 0;
        this.manualAmplitudeScaledBottomValue = 0;
        this.isManualAmplitudeScaleSet = false;
        // Determines if the cameraTopMax has not been changed
        const cameraMaxUninitialized = this.cameraTopMax !== -Infinity && this.cameraBottomMax !== Infinity;
        // Check that the amplitude needs resetting
        if (cameraMaxUninitialized &&
            (this.camera.top !== this.cameraTopMax || this.camera.bottom !== this.cameraBottomMax)) {
            // reset the amplitude to the window default for this channel
            this.camera.top = this.cameraTopMax;
            this.camera.bottom = this.cameraBottomMax;
            const average = (this.camera.bottom + this.camera.top) / 2;
            this.setYAxisBounds({
                bottomMax: this.camera.bottom,
                topMax: this.camera.top,
                channelAvg: average,
                offset: average,
                channelSegmentId: this.props.channelName
            });
            this.camera.updateProjectionMatrix();
            this.props.renderWaveforms();
        }
    };
    /**
     * Gets the channel segments with the ID provided in this.props
     *
     * @returns the channel segments that matches the channelSegmentID given by props
     */
    getThisChannelSegments = () => this.props.channelSegmentsRecord && this.props.channelSegmentsRecord[this.props.filterId]
        ? this.props.channelSegmentsRecord[this.props.filterId]
        : undefined;
    /**
     * If the Amplitude values in the ChannelSegmentBoundary was not already set
     * create them and set them in the ChannelSegmentBoundary map for each channel segment
     *
     * * @param timeRange
     */
    updateBounds = async (timeRange) => {
        if (this.props.channelSegmentsRecord == null ||
            Object.entries(this.props.channelSegmentsRecord) == null) {
            return;
        }
        // Clear the map before rebuilding the boundaries for the timeRange
        this.channelSegmentBoundariesMap.clear();
        try {
            await Promise.all(Object.entries(this.props.channelSegmentsRecord).map(async ([id, channelSegments]) => {
                if (channelSegments == null) {
                    // return a promise so we can use Promise.all above.
                    await Promise.resolve(undefined);
                }
                await Promise.all(channelSegments.map(async (channelSegment) => {
                    await this.updateChannelSegmentBounds(timeRange, channelSegment, id);
                }));
            }));
        }
        catch (e) {
            this.props.setError(true, e);
        }
    };
    /**
     * Updates ChannelSegmentBoundary map for each channel segment
     *
     * @param timeRange
     * @param channelSegment
     * @param id
     */
    updateChannelSegmentBounds = async (timeRange, channelSegment, id) => {
        let boundary = channelSegment.channelSegmentBoundary;
        if (!boundary &&
            this.props.getBoundaries &&
            WeavessTypes.areDataSegmentsAllClaimChecks(channelSegment.dataSegments)) {
            try {
                if (this.props.channelOffset) {
                    const offsetTimeRange = {
                        startTimeSecs: timeRange.startTimeSecs - this.props.channelOffset,
                        endTimeSecs: timeRange.endTimeSecs - this.props.channelOffset
                    };
                    boundary = await this.props.getBoundaries(this.props.channelName, channelSegment, offsetTimeRange);
                }
                else {
                    boundary = await this.props.getBoundaries(this.props.channelName, channelSegment, timeRange);
                }
            }
            catch (e) {
                this.props.setError(true, e);
            }
        }
        else {
            boundary = await this.createChannelSegmentBoundary(channelSegment, id, timeRange);
        }
        if (boundary) {
            const channelNameToBoundaryRecord = this.channelSegmentBoundariesMap.get(id);
            const channelBoundaries = channelNameToBoundaryRecord?.[channelSegment.channelName];
            if (channelBoundaries) {
                channelBoundaries.push({
                    boundary,
                    dataSegments: channelSegment.dataSegments
                });
            }
            else if (channelNameToBoundaryRecord != null) {
                channelNameToBoundaryRecord[channelSegment.channelName] = [
                    {
                        boundary,
                        dataSegments: channelSegment.dataSegments
                    }
                ];
            }
            else {
                this.channelSegmentBoundariesMap.set(id, {
                    [channelSegment.channelName]: [
                        {
                            boundary,
                            dataSegments: channelSegment.dataSegments
                        }
                    ]
                });
            }
        }
    };
    /**
     * Update the min,max in gl units where we draw waveforms, if the view bounds have changed.
     *
     * @param prevProps The previous waveform props
     */
    updateCameraBounds = () => {
        if (!this.camera)
            return;
        this.camera.left = this.props.glMin;
        this.camera.right = this.props.glMax;
    };
    /**
     * For measure window update the camera amplitude adjustment if adjustment changed
     * or the display time range has changed
     *
     * @param prevProps The previous waveform props
     */
    updateMsrWindowCameraAmplitudeAdjustment = (prevProps) => {
        if (prevProps.msrWindowWaveformAmplitudeScaleFactor !==
            this.props.msrWindowWaveformAmplitudeScaleFactor ||
            prevProps.displayInterval !== this.props.displayInterval ||
            !deepEqual(prevProps.defaultRange, this.props.defaultRange)) {
            this.manualAmplitudeScaledTopValue =
                this.props.msrWindowWaveformAmplitudeScaleFactor?.top ?? 0;
            this.manualAmplitudeScaledBottomValue =
                this.props.msrWindowWaveformAmplitudeScaleFactor?.bottom ?? 0;
            this.isManualAmplitudeScaleSet = this.manualAmplitudeScaledTopValue !== 0;
        }
    };
    /**
     * Prepares the waveform display for rendering.
     *
     * @param refreshVerticesCache True if the cache should be refreshed, false otherwise
     */
    prepareWaveformData = async (refreshVerticesCache) => {
        // Converts from array of floats to an array of vertices
        if (refreshVerticesCache) {
            await this.convertDataToVerticesArray();
            this.props.renderWaveforms();
        }
        // Create ThreeJS scene from vertices data
        this.setupThreeJSFromVertices();
    };
    /**
     * Updates the y axis and camera position based on the boundaries in this.ChannelSegmentBoundary
     */
    updateAmplitudeFromBounds = () => {
        /**
         * If we are in the process of zooming, drop this call because another
         *
         * @function updateAmplitude call will be scheduled.
         */
        if (this.shuttingDown) {
            return;
        }
        const boundariesDataSegmentsPair = this.channelSegmentBoundariesMap.get(this.props.filterId);
        if (!boundariesDataSegmentsPair) {
            this.setYAxisBounds(undefined);
            return;
        }
        const flattenedBoundaries = Object.values(boundariesDataSegmentsPair)
            .flatMap(chanNameToBoundaries => Object.values(chanNameToBoundaries))
            .map(pair => pair.boundary);
        const offsets = flattenedBoundaries.map(boundary => boundary.offset);
        let amplitudeMin = Infinity;
        let amplitudeMax = -Infinity;
        // use a for loop for performance reasons
        for (let i = offsets.length - 1; i >= 0; i -= 1) {
            amplitudeMin = Math.min(offsets[i], amplitudeMin);
            amplitudeMax = Math.max(offsets[i], amplitudeMax);
        }
        if (this.props.masks) {
            this.renderChannelMasks(this.props.masks, boundariesDataSegmentsPair);
        }
        this.updateCameraAndYAxisForMinMaxAmplitudes(amplitudeMin, amplitudeMax, boundariesDataSegmentsPair);
    };
    /**
     * Update the camera and y-axis based on the min/max amplitudes
     * Shifts the Line objects within the scene based on their boundary channel average, which effectively
     * will demean the waveforms if the average is not 0.
     *
     * @param amplitudeMin - The min amplitude of all channel segments displayed in this time range
     * @param amplitudeMax - The max amplitude of all channel segments displayed in this time range
     * @param channelsToBoundaryDataSegmentsPairs - A record mapping channel names to pairs associating data segments with boundaries
     */
    updateCameraAndYAxisForMinMaxAmplitudes = (amplitudeMin, amplitudeMax, channelsToBoundaryDataSegmentsPairs) => {
        if (!this.camera)
            return;
        this.updateCameraYAxisLimits(amplitudeMin, amplitudeMax);
        this.applyDefaultYAxisRange();
        this.updateMaskHeight();
        this.updateCameraBoundsIfFlatLine();
        this.updateCameraFrustum();
        this.updateLinePositions(channelsToBoundaryDataSegmentsPairs);
        this.updateYAxisBoundsForCameraPosition();
        this.camera.updateProjectionMatrix();
    };
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
    updateCameraYAxisLimits = (amplitudeMin, amplitudeMax) => {
        const maxOffset = Math.max(Math.abs(amplitudeMin), Math.abs(amplitudeMax));
        const format = getYAxisTickFormatter(-1 * maxOffset, maxOffset);
        const formattedNumber = Number.parseFloat(format(maxOffset));
        this.cameraTopMax = formattedNumber;
        this.cameraBottomMax = -1 * formattedNumber;
    };
    /**
     * Apply the default y-axis range if provided
     */
    applyDefaultYAxisRange = () => {
        if (this.props.defaultRange) {
            if (this.props.defaultRange.max != null) {
                this.cameraTopMax = this.props.defaultRange.max;
            }
            if (this.props.defaultRange.min != null) {
                this.cameraBottomMax = this.props.defaultRange.min;
            }
        }
    };
    /**
     * Update the mask height based on the camera's top and bottom limits
     */
    updateMaskHeight = () => {
        if (this.cameraTopMax > this.maskHeight) {
            this.maskHeight = this.cameraTopMax;
        }
        if (-this.cameraBottomMax > this.maskHeight) {
            this.maskHeight = -this.cameraBottomMax;
        }
    };
    /**
     * Handle the case where the top and bottom limits are the same
     * Adds 1 to the top and subtracts one from the bottom, in this case.
     * This prevents a bug where the max and min are the same, and so nothing gets rendered.
     */
    updateCameraBoundsIfFlatLine = () => {
        if (this.cameraTopMax === this.cameraBottomMax) {
            this.cameraTopMax += 1;
            this.cameraBottomMax -= 1;
        }
    };
    /**
     * Update the camera frustum based on the manual scale, if one is set. Otherwise, set
     * the camera to use the {@link cameraTopMax} and {@link cameraBottomMax} values instead.
     */
    updateCameraFrustum = () => {
        validateNonNullish(this.camera, 'Camera is null or undefined');
        if (this.isManualAmplitudeScaleSet) {
            this.camera.top = this.manualAmplitudeScaledTopValue;
            this.camera.bottom = this.manualAmplitudeScaledBottomValue;
        }
        else {
            this.camera.top = this.cameraTopMax;
            this.camera.bottom = this.cameraBottomMax;
        }
    };
    /**
     * Update the positions of the Lines within the scene based on boundary ChannelSegment averages.
     * This adjusts the position of the Line by the corresponding boundary's `channelAvg` value.
     * This effectively centers the Line without changing its scale, if the average is correct.
     * If the average is 0, nothing will change.
     *
     * @param channelsToBoundaryDataSegmentsPairs - A record mapping channel names to pairs
     * associating data segments with boundaries
     */
    updateLinePositions = (channelsToBoundaryDataSegmentsPairs) => {
        Object.entries(channelsToBoundaryDataSegmentsPairs).forEach(([channelName, boundaryDataSegmentsPairs]) => {
            this.lines.get(channelName)?.forEach(lineDataSegPair => {
                const maybeBoundaryDataSegPair = boundaryDataSegmentsPairs.find(pair => pair.dataSegments.find(dataSegment => doDataSegmentsMatch(lineDataSegPair.dataSegment, dataSegment)));
                const boundary = maybeBoundaryDataSegPair?.boundary;
                if (boundary) {
                    // This updates the y position of the line within the THREE.scene
                    if (this.props.defaultRange) {
                        lineDataSegPair.line.position.y = 0;
                    }
                    else {
                        lineDataSegPair.line.position.y = -1 * boundary.channelAvg;
                    }
                }
            });
        });
    };
    /**
     * Set the y axis bounds to use the current camera frustum
     * (`this.camera.top` and `this.camera.bottom`)
     */
    updateYAxisBoundsForCameraPosition = () => {
        validateNonNullish(this.camera, 'Camera is null or undefined');
        this.setYAxisBounds({
            bottomMax: this.camera.bottom,
            topMax: this.camera.top,
            channelAvg: 0,
            offset: Math.max(Math.abs(this.camera.top), Math.abs(this.camera.bottom)),
            channelSegmentId: this.props.channelName
        });
    };
    /**
     * Add line or scatter points to the scene
     *
     * @param id the
     * @param float32ArrayWithStartTime
     * @param anySelected
     */
    addScene = (id, float32ArrayWithStartTime, dataSegment, anySelected) => {
        const color = float32ArrayWithStartTime.color || WaveformRenderer.defaultProps.color;
        const { float32Array } = float32ArrayWithStartTime;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(float32Array, 2));
        (float32ArrayWithStartTime.displayType || WaveformRenderer.defaultProps.displayType).forEach(displayType => {
            if (displayType === WeavessTypes.DisplayType.LINE) {
                // Default material is bright if any of the CS are selected
                // then dim all CS that are not selected
                let lineColor = color;
                const dimColor = this.props.initialConfiguration?.backgroundColor
                    ? blendColors(color, this.props.initialConfiguration?.backgroundColor, this.props.initialConfiguration?.waveformDimPercent)
                    : lineColor;
                if (this.props.isAutoDimmed || (anySelected && !float32ArrayWithStartTime.isSelected)) {
                    lineColor = dimColor;
                }
                const line = new THREE.Line(geometry, getLineMaterial(lineColor));
                if (this.scene) {
                    const existingLineDataSegmentPairs = this.lines?.get(id) ?? [];
                    const matchingLineDataSegmentPair = existingLineDataSegmentPairs.find(pair => doDataSegmentsMatch(pair.dataSegment, dataSegment));
                    if (matchingLineDataSegmentPair) {
                        matchingLineDataSegmentPair.line = line;
                    }
                    else {
                        this.lines?.set(id, [...existingLineDataSegmentPairs, { line, dataSegment }]);
                    }
                    this.scene.add(line);
                }
            }
            else if (displayType === WeavessTypes.DisplayType.SCATTER) {
                const pointsMaterial = new THREE.PointsMaterial({
                    color: color,
                    size: float32ArrayWithStartTime.pointSize || WaveformRenderer.defaultProps.pointSize,
                    sizeAttenuation: false
                });
                const points = new THREE.Points(geometry, pointsMaterial);
                if (this.scene) {
                    this.scene.add(points);
                }
            }
        });
    };
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
    createSortedWaveformRecords = (chanNameToProcessedData, anySelected) => {
        const brightProcessedDataRecord = {};
        const dimmedProcessedDataRecord = {};
        Object.entries(chanNameToProcessedData).forEach(([channelName, processedDataMap]) => {
            if (brightProcessedDataRecord[channelName] == null) {
                brightProcessedDataRecord[channelName] = new Map();
            }
            if (dimmedProcessedDataRecord[channelName] == null) {
                dimmedProcessedDataRecord[channelName] = new Map();
            }
            Array.from(processedDataMap.entries()).forEach(([dataSegment, float32ArrayWithStartTime]) => {
                if (this.props.isMeasureWindow) {
                    if (!anySelected || float32ArrayWithStartTime.isSelected) {
                        brightProcessedDataRecord[channelName].set(dataSegment, float32ArrayWithStartTime);
                    }
                }
                else if (anySelected && !float32ArrayWithStartTime.isSelected) {
                    dimmedProcessedDataRecord[channelName].set(dataSegment, float32ArrayWithStartTime);
                }
                else {
                    brightProcessedDataRecord[channelName].set(dataSegment, float32ArrayWithStartTime);
                }
            });
        });
        return [dimmedProcessedDataRecord, brightProcessedDataRecord];
    };
    /**
     * Manages {@link this.leftBoundaryMarker} and {@link this.rightBoundaryMarker}.
     * Calculates width, height, and position using interval times and the camera.
     * !This must be called *after* {@link this.updateAmplitudeFromBounds}, which updates {@link this.camera.top}.
     */
    updateBoundaryMarkers = () => {
        if (!this.scene || !this.camera)
            return;
        // Cleanup previous markers
        if (this.leftBoundaryMarker && this.rightBoundaryMarker) {
            this.scene.remove(this.leftBoundaryMarker);
        }
        if (this.rightBoundaryMarker) {
            this.scene.remove(this.rightBoundaryMarker);
        }
        const timeToGlScale = WeavessUtil.scaleLinear([this.props.displayInterval.startTimeSecs, this.props.displayInterval.endTimeSecs], [this.props.glMin, this.props.glMax]);
        const color = this.props.initialConfiguration?.outOfBoundsColor;
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true
        });
        const height = this.camera.top - this.camera.bottom;
        const depth = 1; // This keeps the boundaries behind the beams
        // Left marker start offset is subtracted since it is always negative
        const leftStartSeconds = this.props.displayInterval.startTimeSecs - (this.props.channelOffset || 0);
        const leftEndSeconds = this.props.viewableInterval.startTimeSecs;
        // Do not create and add to scene if there is no width
        if (leftEndSeconds - leftStartSeconds > 0) {
            const leftWidth = timeToGlScale(leftEndSeconds) - timeToGlScale(leftStartSeconds);
            const leftMarkerGeometry = new THREE.PlaneGeometry(leftWidth, height);
            this.leftBoundaryMarker = new THREE.Mesh(leftMarkerGeometry, material);
            const leftMidpoint = timeToGlScale(leftStartSeconds + (leftEndSeconds - leftStartSeconds) / 2);
            this.leftBoundaryMarker.position.x = leftMidpoint;
            this.leftBoundaryMarker.position.z = depth;
            this.scene.add(this.leftBoundaryMarker);
        }
        // Right marker end offset is subtracted since it is always negative
        const rightStartSeconds = this.props.viewableInterval.endTimeSecs;
        const rightEndSeconds = this.props.displayInterval.endTimeSecs - (this.props.channelOffset || 0);
        // Do not create and add to scene if there is no width
        if (rightEndSeconds - rightStartSeconds > 0) {
            const rightWidth = timeToGlScale(rightEndSeconds) - timeToGlScale(rightStartSeconds);
            const rightMarkerGeometry = new THREE.PlaneGeometry(rightWidth, height);
            this.rightBoundaryMarker = new THREE.Mesh(rightMarkerGeometry, material);
            const rightMidpoint = timeToGlScale(rightStartSeconds + (rightEndSeconds - rightStartSeconds) / 2);
            this.rightBoundaryMarker.position.x = rightMidpoint;
            this.rightBoundaryMarker.position.z = depth;
            this.scene.add(this.rightBoundaryMarker);
        }
    };
    /**
     * Iterates through cached vertices data in the float32 array format
     * and creates ThreeJS objects and adds them to the
     * ThreeJS scene
     */
    setupThreeJSFromVertices = () => {
        if (this.shuttingDown) {
            return;
        }
        // removed old three js objects from scene
        this.clearScene();
        if (!this.props.filterId) {
            return;
        }
        const channelSegments = this.getThisChannelSegments();
        const anySelected = channelSegments?.find(cs => cs.isSelected) !== undefined || false;
        // Record keyed on channelName (which comes from the channelSegment)
        const processedData = this.processedSegmentCache.get(this.props.filterId);
        if (processedData && Object.keys(processedData).length > 0) {
            // A list of data to add to scene in order of dimmed then bright channel segments
            // The list will always be defined
            const processedDataLists = this.createSortedWaveformRecords(processedData, anySelected);
            processedDataLists.forEach(processedDataList => {
                Object.entries(processedDataList).forEach(([channelName, data]) => {
                    Array.from(data.entries()).forEach(([dataSegment, waveform]) => {
                        this.addScene(channelName, waveform, dataSegment, anySelected);
                    });
                });
            });
        }
        this.updateAmplitudeFromBounds();
        this.updateBoundaryMarkers();
    };
    /**
     * Converts waveform data into useable vertices
     */
    convertDataToVerticesArray = async () => {
        // determine the new data segments that need to be added to the scene
        if (this.props.channelSegmentsRecord) {
            // If no entries then clear cache to remove all waveform entries
            if (Object.keys(this.props.channelSegmentsRecord).length === 0) {
                this.processedSegmentCache.clear();
                return;
            }
            await Promise.all(Object.entries(this.props.channelSegmentsRecord).map(async ([key, channelSegments]) => {
                if (channelSegments && channelSegments.length > 0) {
                    const processedSegments = await this.convertWaveformDataFloat32(channelSegments);
                    // if some processed segments have waveform data, set cache
                    if (doProcessedSegmentsHaveWaveformData(processedSegments)) {
                        this.processedSegmentCache.set(key, processedSegments);
                    }
                }
            }));
        }
    };
    /**
     * Converts claim check data to a Float32Array
     *
     * @param getPositionBuffer valid getPositionBuffer getter (passed as Weavess props)
     * @param data to convert
     * @returns converted Float32Array data
     * @throws if getPositionBuffer callback is undefined
     */
    convertDataClaimCheckToFloat32 = async (getPositionBuffer, data) => {
        if (getPositionBuffer) {
            try {
                return await getPositionBuffer(data.id, data.startTimeSecs, data.endTimeSecs, data.domainTimeRange);
            }
            catch (e) {
                logger.error(e.message);
                this.props.setError(true, e.message);
            }
        }
        else {
            throw new Error('Data by Claim Check needs a valid getPositionBuffer getter (passed as Weavess props)');
        }
        return undefined;
    };
    /**
     * Converts sample rate data to a Float32Array
     *
     * @param data to convert
     * @returns converted Float32Array data
     */
    convertDataBySampleRateToFloat32 = (data) => {
        if (WaveformRenderer.shouldLogDeprecated) {
            logger.warn('Deprecated (data by sample rate) - recommended to pass the data in using a typed array');
            WaveformRenderer.shouldLogDeprecated = false;
        }
        const values = data.values;
        return WeavessUtil.createPositionBufferForDataBySampleRate({
            values,
            displayStartTimeSecs: this.props.displayInterval.startTimeSecs,
            displayEndTimeSecs: this.props.displayInterval.endTimeSecs,
            glMax: this.props.glMax,
            glMin: this.props.glMin,
            sampleRate: data.sampleRate,
            startTimeSecs: data.startTimeSecs,
            endTimeSecs: data.endTimeSecs
        });
    };
    /**
     * Converts data by time to a Float32Array
     *
     * @param data to convert
     * @returns converted Float32Array data
     */
    convertDataByTimeToFloat32 = (data) => {
        if (WaveformRenderer.shouldLogDeprecated) {
            logger.warn('Deprecated (data by time) - recommended to pass the data in using a typed array');
            WaveformRenderer.shouldLogDeprecated = false;
        }
        const values = data.values;
        return WeavessUtil.createPositionBufferForDataByTime({
            glMax: this.props.glMax,
            glMin: this.props.glMin,
            displayStartTimeSecs: this.props.displayInterval.startTimeSecs,
            displayEndTimeSecs: this.props.displayInterval.endTimeSecs,
            values
        });
    };
    /**
     * Converts a data segment into a Float32ArrayData
     * if it is dataClaimCheck or dataBySampleRate
     * if already a Float32ArrayData then just returns it
     *
     * @param dataSegment to convert
     * @returns converted Float32ArrayData  or undefined
     */
    convertDataSegmentDataFloat32 = async (isChannelSegmentSelected, dataSegment) => {
        let float32Array;
        if (WeavessTypes.isFloat32Array(dataSegment.data.values)) {
            float32Array = dataSegment.data.values;
        }
        else if (WeavessTypes.isDataClaimCheck(dataSegment.data)) {
            float32Array = await this.convertDataClaimCheckToFloat32(this.props.getPositionBuffer, dataSegment.data);
        }
        else if (WeavessTypes.isDataBySampleRate(dataSegment.data)) {
            float32Array = this.convertDataBySampleRateToFloat32(dataSegment.data);
        }
        else {
            float32Array = this.convertDataByTimeToFloat32(dataSegment.data);
        }
        // If values were returned then add it
        // Note: Measure Window might not be in this segments window
        if (float32Array == null) {
            return undefined;
        }
        if (float32Array.length > 0) {
            const timeRange = findDataSegmentTimeRange(dataSegment);
            if (timeRange) {
                // Update the max / min gl units found
                return {
                    isSelected: isChannelSegmentSelected,
                    color: dataSegment.color,
                    displayType: dataSegment.displayType,
                    pointSize: dataSegment.pointSize,
                    float32Array,
                    startTimeSecs: timeRange.startTimeSecs,
                    endTimeSecs: timeRange.endTimeSecs
                };
            }
        }
        return undefined;
    };
    /**
     * Converts each Data Segment to Float32ArrayData
     *
     * @param channelSegments
     * @returns a Record mapping channelName to {@link Float32ArrayDataAndDataSegmentPair} which contains
     * a map of the data segments to the fully hydrated waveform data to be rendered.
     */
    convertWaveformDataFloat32 = async (channelSegments) => {
        // Convert Waveform data to Float32ArrayData data
        const processedSegments = {};
        // Build list of data segments to process
        await Promise.all(channelSegments.map(async (cs) => {
            await Promise.all(cs.dataSegments.map(async (dataSegment) => {
                const float32ArrayData = await this.convertDataSegmentDataFloat32(cs.isSelected, dataSegment);
                if (float32ArrayData) {
                    if (processedSegments[cs.channelName] == null) {
                        processedSegments[cs.channelName] = new Map();
                    }
                    processedSegments[cs.channelName].set(dataSegment, float32ArrayData);
                }
            }));
        }));
        return processedSegments;
    };
    /**
     * Filter data segment values for amplitude values for time range
     *
     * @param dataSegment
     * @param timeRange
     * @returns amplitude values
     */
    amplitudeValuesFromDataSegment = async (dataSegment, timeRange) => {
        let values;
        // If claim check will need to retrieve from props.getPositionBuffer
        const valuesToFilter = !dataSegment.data.values && WeavessTypes.isDataClaimCheck(dataSegment.data)
            ? await this.convertDataClaimCheckToFloat32(this.props.getPositionBuffer, dataSegment.data)
            : dataSegment.data.values;
        // populate amplitude values array based on the data segment types
        if (!valuesToFilter) {
            values = [];
        }
        else if (WeavessTypes.isDataByTime(dataSegment.data) &&
            WeavessTypes.isTimeValuePairArray(valuesToFilter)) {
            const filteredValues = [];
            valuesToFilter.forEach(v => {
                if (isWithinTimeRange(v.timeSecs, timeRange)) {
                    filteredValues.push(v.value);
                }
            });
            values = filteredValues;
        }
        else if (WeavessTypes.isDataClaimCheck(dataSegment.data) ||
            WeavessTypes.isDataBySampleRate(dataSegment.data)) {
            values = filterValuesForDataSampleRate(dataSegment.data, timeRange, valuesToFilter);
        }
        else {
            values = valuesToFilter;
        }
        return values;
    };
    /**
     * Given a channel segment and id creates the Channel Segment Boundaries
     *
     * @param channelSegment
     * @param channelSegmentId
     * @returns ChannelSegmentBoundary
     */
    createChannelSegmentBoundary = async (channelSegment, channelSegmentId, timeRange) => {
        let topMax = -Infinity;
        let bottomMax = Infinity;
        let totalValue = 0;
        let totalValuesCount = 0;
        if (!channelSegment?.dataSegments) {
            return undefined;
        }
        await Promise.all(channelSegment.dataSegments.map(async (dataSegment) => {
            const values = await this.amplitudeValuesFromDataSegment(dataSegment, timeRange);
            values.forEach(sample => {
                totalValue += sample;
                if (sample > topMax)
                    topMax = sample;
                if (sample < bottomMax)
                    bottomMax = sample;
            });
            totalValuesCount += values.length;
        }));
        if (topMax === -Infinity || bottomMax === Infinity) {
            // When there is no data in the channel set offset to 1 (to avoid infinity)
            this.cameraTopMax = 1;
            this.cameraBottomMax = -1;
            return undefined;
        }
        return {
            topMax: Math.ceil(topMax),
            bottomMax: Math.floor(bottomMax),
            channelAvg: totalValue / totalValuesCount,
            totalSamplesCount: totalValuesCount,
            offset: Math.max(Math.abs(topMax), Math.abs(bottomMax)),
            channelSegmentId
        };
    };
    /**
     * Render the Masks to the display.
     *
     * @param masks The masks (as Mask[]) to render
     */
    renderChannelMasks = (masks, boundariesDataSegmentsPairs) => {
        /** if we're being passed empty data,
         *  Dont have a valid height,
         *  Or are already rendering
         *  don't try to add masks just clear out the existing ones */
        if (this.buildingMasks ||
            recordLength(this.props.channelSegmentsRecord) === 0 ||
            this.cameraTopMax === -Infinity) {
            this.renderedMaskRefs.forEach(m => {
                if (this.scene) {
                    this.scene.remove(m);
                }
            });
            this.renderedMaskRefs.length = 0; // delete all references
            this.renderedMaskPointRefs.forEach(m => {
                if (this.scene) {
                    this.scene.remove(m);
                }
            });
            this.renderedMaskPointRefs.length = 0; // delete all references
            return;
        }
        // set the tracker so we dont have multiple concurrent build attempts
        this.buildingMasks = true;
        const timeToGlScale = WeavessUtil.scaleLinear([this.props.displayInterval.startTimeSecs, this.props.displayInterval.endTimeSecs], [this.props.glMin, this.props.glMax]);
        // TODO move sorting to happen elsewhere and support re-sorting when new masks are added
        // TODO consider passing comparator for mask sorting as an argument to weavess
        sortBy(sortBy(masks, (mask) => -(mask.endTimeSecs - mask.startTimeSecs)), (mask) => mask.isProcessingMask).forEach(mask => {
            this.buildMaskPlaneObject(mask, timeToGlScale);
            if (mask.shouldBuildPoints)
                this.buildMaskPointsObject(mask, timeToGlScale, boundariesDataSegmentsPairs);
        });
        // Wipe out existing masks
        this.renderedMaskRefs.forEach(m => {
            if (this.scene) {
                this.scene.remove(m);
            }
        });
        this.renderedMaskRefs.length = 0; // delete all references
        this.renderedMaskPointRefs.forEach(m => {
            if (this.scene) {
                this.scene.remove(m);
            }
        });
        this.renderedMaskPointRefs.length = 0; // delete all references
        if (this.scene && this.tempRenderedMaskRefs.length > 0) {
            // adding masks to the scene
            this.scene.add(...this.tempRenderedMaskRefs);
            if (this.tempRenderedMaskPointRefs.length > 0)
                this.scene.add(...this.tempRenderedMaskPointRefs);
            // force a render due to async possibly finishing after render
            this.props.renderWaveforms({ shouldCallAnimationLoopEnd: false });
            // store the temp and wipe out temp
            this.tempRenderedMaskRefs.forEach(m => this.renderedMaskRefs.push(m));
            this.tempRenderedMaskPointRefs.forEach(m => this.renderedMaskPointRefs.push(m));
            this.tempRenderedMaskRefs.length = 0; // delete all temp references
            this.tempRenderedMaskPointRefs.length = 0; // delete all temp references
        }
        // clear the tracker
        this.buildingMasks = false;
    };
    /**
     * Builds a plane to layer over the waveform data in order to color it.  Stores the plane in the tempRenderedMaskRefs variable
     *
     * @param mask mask to build a plane for
     * @param timeToGlScale the scale used by the waveform
     * @returns void.  Mask plane is stored in class level object
     */
    buildMaskPlaneObject = (mask, timeToGlScale) => {
        const maskStartTime = mask.startTimeSecs;
        const maskEndTime = mask.endTimeSecs;
        // if the mask length is 0 we can't draw a mask and the dot is all that is needed
        if (maskEndTime - maskStartTime === 0) {
            return;
        }
        const width = timeToGlScale(maskEndTime) - timeToGlScale(maskStartTime);
        const midpoint = timeToGlScale(maskStartTime + (maskEndTime - maskStartTime) / 2);
        const planeGeometry = new THREE.PlaneGeometry(width, this.maskHeight * 2);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: mask.color,
            side: THREE.DoubleSide,
            transparent: true
        });
        planeMaterial.blending = THREE.CustomBlending;
        planeMaterial.blendEquation = THREE.AddEquation;
        planeMaterial.blendSrc = THREE.DstAlphaFactor;
        planeMaterial.blendDst = THREE.ZeroFactor;
        planeMaterial.depthFunc = THREE.EqualDepth;
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.x = midpoint;
        this.tempRenderedMaskRefs.push(plane);
    };
    /**
     * Builds ThreeJS points to place at the start and end of the mask.  Stores the points in the tempRenderedMaskPointRefs variable
     *
     * @param mask mask to build points for
     * @param timeToGlScale the scale used by the waveform
     * @returns void.  Mask points is stored in class level object
     */
    buildMaskPointsObject = (mask, timeToGlScale, boundariesDataSegmentsPair) => {
        const material = new THREE.PointsMaterial({
            size: 8,
            sizeAttenuation: true,
            alphaTest: 0.5,
            map: this.MASK_SPRITE,
            transparent: false,
            color: mask.color
        });
        material.blending = THREE.CustomBlending;
        material.depthFunc = THREE.AlwaysDepth;
        material.blendEquation = THREE.AddEquation;
        material.blendSrc = THREE.OneFactor;
        material.blendDst = THREE.ZeroFactor;
        const pointsArray = [];
        const maskStartTime = mask.startTimeSecs;
        const maskEndTime = mask.endTimeSecs;
        if (this.props.viewableInterval.startTimeSecs <= mask.startTimeSecs &&
            this.props.viewableInterval.endTimeSecs >= mask.startTimeSecs) {
            pointsArray.push(timeToGlScale(maskStartTime));
            pointsArray.push(this.findMaskAmplitudeAtTime(maskStartTime, mask.channelName, boundariesDataSegmentsPair));
        }
        if (this.props.viewableInterval.startTimeSecs <= mask.endTimeSecs &&
            this.props.viewableInterval.endTimeSecs >= mask.endTimeSecs) {
            pointsArray.push(timeToGlScale(maskEndTime));
            pointsArray.push(this.findMaskAmplitudeAtTime(maskEndTime, mask.channelName, boundariesDataSegmentsPair));
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pointsArray), 2));
        const points = new THREE.Points(geo, material);
        points.position.z = -3;
        this.tempRenderedMaskPointRefs.push(points);
    };
    /**
     * Set the y-axis bounds for a particular channel
     * Calls the onSetAmplitude event if one was given for this channel
     *
     * @param bounds A populated ChannelSegmentBoundary object. If the channelSegmentId is not known, this will use
     * the channel name as the default.
     */
    setYAxisBounds = (bounds) => {
        // don't update channel y-axis if unmount has been called
        if (!this.shuttingDown) {
            if (bounds?.bottomMax != null && bounds.topMax != null) {
                if (this.props.onSetAmplitude) {
                    this.props.onSetAmplitude(this.props.channelName, {
                        ...bounds,
                        channelSegmentId: bounds.channelSegmentId ?? this.props.channelName
                    }, this.props.isMeasureWindow);
                }
            }
            this.props.setYAxisBounds(bounds?.bottomMax, bounds?.topMax);
        }
    };
    /**
     * Find the data segment for a given time
     *
     * @param time the time in seconds to find the data segment for
     * @returns the data segment that spans the time requested
     */
    findDataSegmentForTime = (time) => {
        const channelSegments = this.getThisChannelSegments();
        if (!channelSegments) {
            return undefined;
        }
        const dataSegments = channelSegments.flatMap(cs => cs.dataSegments);
        return dataSegments.find(ds => {
            if (ds.data === null)
                return false;
            if (WeavessTypes.isDataByTime(ds.data)) {
                if (WeavessTypes.isFloat32Array(ds.data.values)) {
                    return ds.data.values[0] <= time && ds.data.values[ds.data.values.length - 2] >= time;
                }
                return (ds.data.values[0].timeSecs <= time && ds.data[ds.data.values.length - 1].timeSecs >= time);
            }
            if (WeavessTypes.isDataBySampleRate(ds.data) || WeavessTypes.isDataClaimCheck(ds.data)) {
                return ds.data.startTimeSecs <= time && ds.data.endTimeSecs >= time;
            }
            return undefined;
        });
    };
    /**
     * Find the waveform amplitude for a given time from the DataClaimCheck
     *
     * @param time the time in seconds to find the amplitude for
     * @param data WeavessTypes.DataClaimCheck containing the amplitudes
     * @returns the amplitude of the beam at the given time
     * defaults to 0 if no value is found
     */
    findAmplitudeFromDataClaimCheck = (time, data, channelName) => {
        const index = Math.round((time - data.startTimeSecs) * data.sampleRate);
        // If this is a data claim check it will be cached
        const cachedSegmentRecord = this.processedSegmentCache.get(this.props.filterId);
        if (!cachedSegmentRecord)
            return 0;
        const cachedSegment = cachedSegmentRecord[channelName];
        if (cachedSegment) {
            const { float32Array } = Array.from(cachedSegment.values()).find(fad => fad.startTimeSecs <= time && fad.endTimeSecs >= time) ?? { float32Array: undefined };
            if (!float32Array) {
                return 0;
            }
            if (index * 2 + 1 < float32Array.length)
                return float32Array[index * 2 + 1];
        }
        return 0;
    };
    /**
     * Find the waveform amplitude for a given time for a qc masks.  This value has the demeaning value
     * applied if applicable
     *
     * @param time the time in seconds to find the amplitude for
     * @param channelName the channel name to load demeaning value for
     * @param boundaryDataSegmentsPairs the boundary data semgent pairs to load demeaning data from
     * @returns the amplitude of the beam at the given time
     */
    findMaskAmplitudeAtTime = (time, channelName, boundaryDataSegmentsPairs) => {
        const dataSegment = this.findDataSegmentForTime(time);
        if (dataSegment === undefined)
            return 0;
        const maybeBoundaryDataSegPair = boundaryDataSegmentsPairs?.[channelName]?.find(pair => pair.dataSegments.find(ds => doDataSegmentsMatch(ds, dataSegment)));
        const demeanOffset = this.props.defaultRange
            ? 0
            : maybeBoundaryDataSegPair?.boundary?.channelAvg || 0;
        if (dataSegment === undefined) {
            return 0;
        }
        if (WeavessTypes.isDataClaimCheck(dataSegment.data)) {
            return (this.findAmplitudeFromDataClaimCheck(time, dataSegment.data, channelName) - demeanOffset);
        }
        if (WeavessTypes.isDataByTime(dataSegment.data)) {
            if (WeavessTypes.isFloat32Array(dataSegment.data.values)) {
                // Return the value in the field after the requested time since data is in time, value sequence
                return (dataSegment.data.values[dataSegment.data.values.findIndex(f32 => f32 === time) + 1] -
                    demeanOffset);
            }
            return (dataSegment.data.values.find(tvPair => tvPair.timeSecs === time)?.value || 0 - demeanOffset);
        }
        if (WeavessTypes.isDataBySampleRate(dataSegment.data)) {
            const index = (time - dataSegment.data.startTimeSecs) * dataSegment.data.sampleRate;
            if (index < dataSegment.data.values.length)
                return dataSegment.data.values[index] - demeanOffset;
            return -demeanOffset;
        }
        return -demeanOffset;
    };
    // eslint-disable-next-line react/sort-comp
    render() {
        return null;
    }
    /**
     * Remove the scene children
     */
    clearScene = () => {
        while (this.scene && this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    };
}
//# sourceMappingURL=waveform-renderer.js.map