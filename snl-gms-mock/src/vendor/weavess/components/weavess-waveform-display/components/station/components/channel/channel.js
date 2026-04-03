/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import { Overlay } from '@blueprintjs/core';
import { HotkeyListener, toast, UILogger } from '@gms/ui-util';
import { WeavessConstants } from '@gms/weavess-core';
import { getKeyboardShortcutCombos } from '@gms/weavess-core/lib/util';
import classNames from 'classnames';
import * as d3 from 'd3';
import { deepEqual } from 'fast-equals';
import sortBy from 'lodash/sortBy';
import memoizeOne from 'memoize-one';
import React from 'react';
import { setFocusToWeavess } from '../../../../utils';
import { getMinMaxAmplitudes, hasUserProvidedBoundaries } from '../../utils';
import { ChannelWaveformRenderer } from './channel-waveform-renderer';
import { ContentRenderer, Label, SpectrogramRenderer } from './components';
import { EmptyRenderer } from './components/empty-renderer';
const logger = UILogger.create('GMS_LOG_WEAVESS');
const OVER_RENDER_CHANNEL_BUFFER_PX = 150;
/**
 * Renders the waveform content of the channel
 */
const internalGetSignalDetections = memoizeOne((displayInterval, signalDetections) => signalDetections?.filter(sd => {
    return (sd.timeSecs >= displayInterval.startTimeSecs && sd.timeSecs <= displayInterval.endTimeSecs);
}));
/**
 * Channel Component. Contains a Label, a Waveform (or other graphic component) and optional events
 */
export class Channel extends React.PureComponent {
    /** The label container reference. */
    labelContainerRef;
    /** The label reference. */
    labelRef;
    /** The empty container reference. */
    emptyContainerRef;
    /** The empty renderer reference. */
    emptyRendererRef;
    /** The waveform container reference. */
    waveformContainerRef;
    /** The waveform content reference. */
    waveformContentRef;
    /** The waveform renderer reference. */
    waveformRendererRef;
    /** The spectrogram container reference. */
    spectrogramContainerRef;
    /** The spectrogram content reference. */
    spectrogramContentRef;
    /** The spectrogram renderer reference. */
    spectrogramRendererRef;
    /** Current mouse position in [0,1] */
    mouseXPosition = 0;
    /** Current mouse position on mouse down */
    mouseDownXPosition = 0;
    /** Current mouse position in pixels from the left of the window */
    mousePosition;
    /** The id of the hotkey listener for cleanup on unmount */
    globalHotkeyListenerId;
    contentRenderMouseDown = memoizeOne(onMouseDown => (e) => {
        onMouseDown(e);
        this.onMouseDown(e);
    });
    /**
     * Constructor
     *
     * @param props Channel props as ChannelProps
     */
    constructor(props) {
        super(props);
        const { numberOfRenderers } = this.getContent();
        const heightInPercentage = this.getHeightPercentage(numberOfRenderers);
        this.state = {
            waveformYAxisBounds: {
                minAmplitude: -1,
                maxAmplitude: 1,
                heightInPercentage
            },
            spectrogramYAxisBounds: {
                minAmplitude: -1,
                maxAmplitude: 1,
                heightInPercentage
            }
        };
    }
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Called immediately after a component is mounted.
     * Setting state here will trigger re-rendering.
     */
    componentDidMount() {
        // set the initial mouse position
        const canvas = this.props.canvasRef();
        if (canvas) {
            this.mousePosition = {
                clientX: 0,
                clientY: 0
            };
            this.mouseXPosition = 0;
        }
        this.globalHotkeyListenerId = HotkeyListener.subscribeToGlobalHotkeyListener();
    }
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(prevProps, prevState) {
        const { channelSegments, numberOfRenderers } = this.getContent();
        const heightPercent = this.getHeightPercentage(numberOfRenderers);
        let { minAmplitude, maxAmplitude } = this.state.waveformYAxisBounds;
        if (this.isUsingDefaultWaveformYAxisBounds() &&
            hasUserProvidedBoundaries(channelSegments) &&
            channelSegments?.length > 0) {
            const result = getMinMaxAmplitudes(channelSegments);
            minAmplitude = result.minAmplitude;
            maxAmplitude = result.maxAmplitude;
        }
        const waveformYAxisBounds = {
            ...this.state.waveformYAxisBounds,
            minAmplitude,
            maxAmplitude,
            heightInPercentage: heightPercent
        };
        const spectrogramYAxisBounds = {
            ...this.state.spectrogramYAxisBounds,
            heightInPercentage: heightPercent
        };
        if (!deepEqual(waveformYAxisBounds, prevState.waveformYAxisBounds) ||
            !deepEqual(spectrogramYAxisBounds, prevState.spectrogramYAxisBounds)) {
            this.setState({
                waveformYAxisBounds,
                spectrogramYAxisBounds
            });
        }
    }
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Channel Error: ${error} : ${info}`);
    }
    componentWillUnmount() {
        HotkeyListener.unsubscribeFromGlobalHotkeyListener(this.globalHotkeyListenerId);
    }
    getContentRenderer = memoizeOne(contentRenderer => [contentRenderer]);
    /**
     * Renders the waveform content of the channel
     */
    getSignalDetections = (signalDetections) => internalGetSignalDetections(this.props.displayInterval, signalDetections);
    /**
     * Render the scene of the channel.
     * !!Performance sensitive code!!
     * This gets called in the `requestAnimationFrame` loop in {@link WeavessWaveformPanel}
     *
     * @param renderer
     * @param boundsRect
     */
    renderScene = (
    /** THREE.js WebGLRenderer used to draw waveforms */
    renderer, 
    /** Rect of the entire weavess canvas */
    canvasRect, 
    /** Rectangle of displayed viewport */
    viewportRect) => {
        if (this.waveformContainerRef && this.waveformRendererRef) {
            this.internalRenderScene(renderer, canvasRect, viewportRect, this.waveformRendererRef.scene, this.waveformRendererRef.camera, this.waveformContainerRef);
        }
        if (this.spectrogramContainerRef && this.spectrogramRendererRef) {
            this.internalRenderScene(renderer, canvasRect, viewportRect, this.spectrogramRendererRef.scene, this.spectrogramRendererRef.camera, this.spectrogramContainerRef);
        }
        if (this.emptyContainerRef && this.emptyRendererRef) {
            this.internalRenderScene(renderer, canvasRect, viewportRect, this.emptyRendererRef.scene, this.emptyRendererRef.camera, this.emptyContainerRef);
        }
    };
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    // eslint-disable-next-line react/sort-comp
    render() {
        const isChannelMaskTarget = this.props.isStationMaskTarget && this.props.channel.isSelected;
        // The split overlay should be activated if we are in split mode but this channel is not split
        const fadeOutThisChannel = (this.props.isSplitChannelOverlayOpen && !this.props.channel.splitChannelTime) ||
            (this.props.isMeasureWindow && !!this.props.activeSplitModeType);
        return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        React.createElement("div", { className: classNames({
                channel: true,
                'channel--maskTarget': isChannelMaskTarget,
                'split-channel': !!this.props.channel.splitChannelTime && !this.props.isMeasureWindow
            }), "data-cy": `${this.getChannelId()}-channel`, 
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex: 0, onKeyDown: this.onKeyDown, style: {
                height: `${this.props.height}px`,
                maxHeight: `${this.props.height}px`
            }, "data-testid": "channel-wrapper" },
            React.createElement(Overlay, { "data-testid": "signal-detection-overlay-fade", isOpen: fadeOutThisChannel, autoFocus: false, enforceFocus: false, usePortal: false, onClose: this.props.closeSplitChannelOverlayCallback }),
            this.renderChannelLabel(),
            this.renderContent()));
    }
    /**
     * Returns the current mouse position.
     *
     * @returns the mouse position
     */
    getMousePosition = () => this.mousePosition;
    /**
     * Returns the time in seconds for the current mouse x position
     *
     * @returns the time in seconds
     */
    getTimeSecs = () => this.props.converters.computeTimeSecsForMouseXFractionalPosition(this.mouseXPosition);
    /**
     * Reset the amplitude of the waveform.
     */
    resetAmplitude = () => {
        if (this.waveformRendererRef) {
            this.waveformRendererRef.resetAmplitude();
        }
    };
    /**
     * Update amplitudes and y axis with the new boundaries.
     *
     * @param timeRange optionally, provide a time range for which to calculate amplitude bounds.
     */
    updateAmplitude = async (timeRange) => {
        if (this.waveformRendererRef) {
            await this.waveformRendererRef.updateAmplitude(timeRange);
        }
    };
    /**
     * Get channel name
     *
     * @returns channel name
     */
    getChannelId = () => {
        return this.props?.channel?.id;
    };
    /**
     * Get Waveform YAxisBounds
     *
     * @returns the Waveform YAxisBounds
     */
    getWaveformYAxisBound = () => {
        return this.state.waveformYAxisBounds;
    };
    /**
     * @returns true if this channel's amplitude is manually scaled
     */
    isAmplitudeManuallyScaled = () => {
        return this.waveformRendererRef?.isManuallyAmplitudeScaled();
    };
    /**
     * @returns true if this channel's amplitude is manually scaled
     */
    getManualScale = () => {
        return this.waveformRendererRef?.getCameraManualScaleAmplitude();
    };
    /** **************************
     * Begin private properties
     *************************** */
    /**
     * Returns a percentage representing how tall each renderer is.
     *
     * @returns the height in percent, equal to 100% / the number of renderers
     */
    getHeightPercentage = (numberOfRenderers) => {
        return WeavessConstants.PERCENT_100 / numberOfRenderers;
    };
    setLabelRef = ref => {
        if (ref) {
            this.labelRef = ref;
        }
    };
    getYAxisBounds = memoizeOne((waveformYAxisBounds, spectrogramYAxisBounds) => {
        const { waveform, channelSegments, spectrogram } = this.getContent();
        const yAxisBounds = {};
        if (waveform && channelSegments) {
            yAxisBounds.waveformYAxisBounds = waveformYAxisBounds;
        }
        if (spectrogram) {
            yAxisBounds.spectrogramYAxisBounds = spectrogramYAxisBounds;
        }
        return yAxisBounds;
    }, deepEqual);
    /**
     * Renders the label of the channel
     */
    renderChannelLabel = () => {
        return (React.createElement("div", { className: classNames({
                'channel-label-container': true,
                'channel-label-container--manually-scaled': this.waveformRendererRef?.getCameraManualScaleAmplitude().top != null &&
                    this.waveformRendererRef?.getCameraManualScaleAmplitude().top !== 0
            }), 
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex: 0, "data-cy": `${this.getChannelId()}-label`, ref: ref => {
                if (ref) {
                    this.labelContainerRef = ref;
                }
            }, style: {
                height: `${this.props.height}px`,
                width: `${this.labelWidthPx()}px`
            } },
            React.createElement(Label, { ref: this.setLabelRef, channelName: this.props.channel.name, channel: this.props.channel, distance: this.props.distance, distanceUnits: this.props.distanceUnits, azimuth: this.props.azimuth, expanded: this.props.expanded, isDefaultChannel: this.props.isDefaultChannel, isExpandable: this.props.isExpandable, isMeasureWindow: this.props.isMeasureWindow, closeSplitChannelOverlayCallback: this.props.closeSplitChannelOverlayCallback, showMaskIndicator: this.props.showMaskIndicator, channelLabelTooltip: this.props.channelLabelTooltip, channelLabelIcon: this.props.channelLabelIcon, customLabel: this.props.customLabel, labelHeader: this.props.channel.labelHeader, events: this.props?.events?.labelEvents, yAxisBounds: this.getYAxisBounds(this.state.waveformYAxisBounds, this.state.spectrogramYAxisBounds) })));
    };
    /**
     * Get the content information of the channel
     */
    getContent = () => {
        const waveform = this.props.shouldRenderWaveforms ? this.props.channel.waveform : undefined;
        const spectrogram = this.props.shouldRenderSpectrograms
            ? this.props.channel.spectrogram
            : undefined;
        let channelSegments;
        if (waveform?.channelSegmentsRecord[waveform.channelSegmentId] &&
            waveform?.channelSegmentsRecord[waveform.channelSegmentId].length > 0) {
            channelSegments = waveform.channelSegmentsRecord[waveform.channelSegmentId];
        }
        const numberOfRenderers = waveform && channelSegments && spectrogram ? 2 : 1;
        return {
            waveform,
            channelSegments: channelSegments || [],
            spectrogram,
            numberOfRenderers
        };
    };
    /**
     * Renders the content of the channel
     */
    renderContent = () => {
        const { waveform, spectrogram, channelSegments, numberOfRenderers } = this.getContent();
        // If this is not the measure window but the measure window was selected on this channel
        // Pass down the measure window value in case this channel had been hidden
        const initialMeasureWindowSelection = !this.props.isMeasureWindow &&
            this.props.measureWindowSelection?.channelId === this.props.channel.id
            ? {
                startTimeSecs: this.props.measureWindowSelection.startTimeSecs,
                endTimeSecs: this.props.measureWindowSelection.endTimeSecs
            }
            : undefined;
        return waveform || spectrogram ? (React.createElement(React.Fragment, null,
            waveform && (React.createElement(ChannelWaveformRenderer, { isSplitStation: this.props?.isSplitStation, splitModePickMarkerColor: this.props.splitModePickMarkerColor, canvasRef: this.props.canvasRef, channel: this.props.channel, channelSegments: channelSegments, contentRenderMouseDown: this.contentRenderMouseDown, converters: this.props.converters, displayInterval: this.props.displayInterval, viewableInterval: this.props.viewableInterval, offsetSecs: this.props.offsetSecs, events: this.props.events, getBoundaries: this.props.getBoundaries, getContentRenderer: this.getContentRenderer, getPositionBuffer: this.props.getPositionBuffer, getSignalDetections: this.getSignalDetections, glMax: this.props.glMax, glMin: this.props.glMin, height: this.props.height, initialConfiguration: this.props.initialConfiguration, isDefaultChannel: this.props.isDefaultChannel, isMeasureWindow: this.props.isMeasureWindow, isMeasureWindowEnabled: this.isMeasureWindowEnabled, isSplitChannelOverlayOpen: this.props.isSplitChannelOverlayOpen, activeSplitModeType: this.props.activeSplitModeType, labelWidthPx: this.labelWidthPx(), msrWindowWaveformAmplitudeScaleFactor: this.props.msrWindowWaveformAmplitudeScaleFactor, numberOfRenderers: numberOfRenderers, onMouseMove: this.onMouseMove, onWaveformMouseUp: this.onWaveformMouseUp, onWaveformContextMenu: this.onWaveformContextMenu, setWaveformYAxisBounds: this.setWaveformYAxisBounds, onKeyDown: this.onKeyDown, renderWaveforms: this.props.renderWaveforms, setWaveformContainerRef: this.setWaveformContainerRef, setWaveformContentRendererRef: this.setWaveformContentRef, setWaveformRendererRef: this.setWaveformRendererRef, splitChannelRefs: this.props.splitChannelRefs, stationId: this.props.stationId, toast: this.toast, updateMeasureWindow: this.props.updateMeasureWindow, updateMeasureWindowPanel: this.updateMeasureWindowPanel, initialMeasureWindowSelection: initialMeasureWindowSelection, waveform: waveform, getZoomRatio: this.props.getZoomRatio })),
            spectrogram && this.renderSpectrogram())) : (React.createElement(React.Fragment, null, this.renderNoGraphics()));
    };
    /**
     * Renders the channel content with no graphics
     */
    renderNoGraphics = () => (React.createElement("div", { className: "channel-content-container", ref: ref => {
            if (ref) {
                this.emptyContainerRef = ref;
            }
        }, style: {
            height: `${this.props.height}px`,
            width: `calc(100% - ${this.labelWidthPx()}px)`,
            left: `${this.labelWidthPx()}px`
        } },
        React.createElement(ContentRenderer
        // eslint-disable-next-line react/jsx-props-no-spreading
        , { ...this.props, isChannelSelected: this.props.channel.isSelected, channelId: this.props.channel.id, contentRenderers: [], description: undefined, descriptionLabelColor: undefined, signalDetections: undefined, predictedPhases: undefined, theoreticalPhaseWindows: undefined, markers: undefined, isSplitChannelOverlayOpen: this.props.isSplitChannelOverlayOpen, splitChannelPhase: this.props.channel.splitChannelPhase, events: this.props?.events?.events, onContextMenu: this.onWaveformContextMenu, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onMouseUp: this.onWaveformMouseUp, onKeyDown: this.onKeyDown },
            React.createElement(EmptyRenderer, { ref: ref => {
                    if (ref) {
                        this.emptyRendererRef = ref;
                    }
                }, ...this.props }))));
    updateMeasureWindowPanel = (timeRange, removeMeasureWindowSelection) => {
        if (this.props.updateMeasureWindow) {
            this.props.updateMeasureWindow({
                stationId: this.props.stationId,
                channelId: this.props.channel.id,
                startTimeSecs: timeRange.startTimeSecs,
                endTimeSecs: timeRange.endTimeSecs,
                isDefaultChannel: this.props.isDefaultChannel,
                waveformAmplitudeScaleFactor: this.waveformRendererRef.getCameraManualScaleAmplitude(),
                removeSelection: removeMeasureWindowSelection
            });
        }
    };
    /**
     * The amount of pixels allocated for the label
     *
     * @returns number of pixels
     */
    labelWidthPx = () => {
        return (this.props.initialConfiguration.labelWidthPx || WeavessConstants.DEFAULT_LABEL_WIDTH_PIXELS);
    };
    toast = (message) => {
        if (!this.props.isMeasureWindow) {
            toast.info(message, {
                toastId: message
            });
        }
    };
    setWaveformContentRef = (ref) => {
        if (ref) {
            this.waveformContentRef = ref;
        }
    };
    setWaveformContainerRef = (ref) => {
        if (ref) {
            this.waveformContainerRef = ref;
        }
    };
    setWaveformRendererRef = (ref) => {
        if (ref) {
            this.waveformRendererRef = ref;
        }
    };
    /**
     * Renders the spectrogram content of the channel
     */
    renderSpectrogram = () => {
        const { waveform, channelSegments, spectrogram, numberOfRenderers } = this.getContent();
        return (React.createElement(React.Fragment, null, spectrogram ? (React.createElement("div", { className: "channel-content-container", ref: ref => {
                if (ref) {
                    this.spectrogramContainerRef = ref;
                }
            }, style: {
                height: `${this.props.height / numberOfRenderers}px`,
                width: `calc(100% - ${this.labelWidthPx()}px)`,
                left: `${this.labelWidthPx()}px`,
                top: !waveform && channelSegments.length === 0
                    ? '0px'
                    : `${this.props.height / numberOfRenderers +
                        (this.props.height / numberOfRenderers) * this.props.index}px`,
                borderTop: waveform && channelSegments.length > 0 ? `1px solid` : ''
            } },
            React.createElement(ContentRenderer, { ref: ref => {
                    if (ref) {
                        this.spectrogramContentRef = ref;
                    }
                }, ...this.props, channelId: this.props.channel.id, isChannelSelected: this.props.channel.isSelected, contentRenderers: [], description: spectrogram?.description, descriptionLabelColor: spectrogram?.descriptionLabelColor, signalDetections: spectrogram?.signalDetections, predictedPhases: spectrogram?.predictedPhases, isSplitChannelOverlayOpen: this.props.isSplitChannelOverlayOpen, splitChannelPhase: this.props.channel.splitChannelPhase, theoreticalPhaseWindows: spectrogram?.theoreticalPhaseWindows, markers: spectrogram?.markers, events: this.props?.events?.events, onContextMenu: this.onSpectrogramContextMenu, onMouseMove: this.onMouseMove, onMouseDown: this.onMouseDown, onMouseUp: this.onSpectrogramMouseUp, onKeyDown: this.onSpectrogramKeyDown }, this.buildSpectrogramRendererElement(spectrogram)))) : undefined));
    };
    /**
     * Build spectrogram renderer JSXElement
     *
     * @param spectrogram spectrogram data
     * @returns JSX.Element
     */
    buildSpectrogramRendererElement = (spectrogram) => {
        return (React.createElement(SpectrogramRenderer, { ref: ref => {
                if (ref) {
                    this.spectrogramRendererRef = ref;
                }
            }, ...this.props, startTimeSecs: spectrogram.startTimeSecs, timeStep: spectrogram.timeStep, frequencyStep: spectrogram.frequencyStep, data: spectrogram.data, setYAxisBounds: this.setSpectrogramYAxisBounds, colorScale: this.props.initialConfiguration.colorScale }));
    };
    /**
     * onWaveformContextMenu event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onWaveformContextMenu = (e) => {
        e.preventDefault();
        // 2: Secondary button pressed, usually the right button
        // see: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        if (e.button === 2) {
            if (this.waveformContentRef && this.waveformRendererRef && this.props.channel.waveform) {
                const masks = this.determineIfMaskIsClicked();
                if (masks.length > 0) {
                    if (this.props.events &&
                        this.props.events.events &&
                        this.props.events.events.onMaskContextClick) {
                        this.props.events.events.onMaskContextClick(e, this.props.channel.id, masks);
                    }
                }
                else if (this.props.onContextMenu) {
                    const timeForMouseXPosition = this.getTimeSecs() - this.props.offsetSecs;
                    const channelId = this.props.isDefaultChannel
                        ? this.props.stationId
                        : this.props.channel.id;
                    this.props.onContextMenu(e, channelId, timeForMouseXPosition, undefined, this.props.channel.waveform);
                }
            }
        }
    };
    /**
     * onSpectrogramContextMenu event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onSpectrogramContextMenu = (e) => {
        e.preventDefault();
        if (this.spectrogramContentRef &&
            this.spectrogramRendererRef &&
            this.props.channel.spectrogram) {
            if (this.props.onContextMenu) {
                this.props.onContextMenu(e, this.props.channel.id, undefined);
            }
        }
    };
    /**
     * onMouseMove event handler
     *
     * @param e The mouse event
     */
    onMouseMove = (e) => {
        const canvasRect = this.props.getCanvasBoundingRect();
        const leftOffset = canvasRect?.left ?? 0;
        const width = canvasRect?.width ?? 0;
        this.mouseXPosition = (e.clientX - leftOffset) / width;
        this.mousePosition = {
            clientX: e.clientX,
            clientY: e.clientY
        };
        this.props.onMouseMove(e, this.mouseXPosition);
    };
    /**
     * onWaveformMouseUp event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onWaveformMouseUp = (e) => {
        const timeForMouseXPosition = this.getTimeSecs();
        this.props.onMouseUp(e, this.mouseXPosition, this.props.channel, timeForMouseXPosition - this.props.offsetSecs, this.props.isDefaultChannel, this.props.isMeasureWindow, this.mouseDownXPosition !== e.clientX);
        if (this.props.channel.waveform &&
            this.props.channel.waveform.masks &&
            this.props.events &&
            this.props.events.events &&
            this.props.events.events.onMaskClick &&
            !e.metaKey &&
            !e.ctrlKey) {
            const maskCreateHotKey = HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(this.props.initialConfiguration.hotKeys?.createQcSegments));
            const viewQcSegmentHotKey = HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(this.props.initialConfiguration.hotKeys?.viewQcSegmentDetails));
            if (viewQcSegmentHotKey) {
                const masks = this.determineIfMaskIsClicked();
                if (masks.length > 0) {
                    this.props.events.events.onMaskClick(e, this.props.channel.id, masks, maskCreateHotKey, viewQcSegmentHotKey);
                }
            }
        }
    };
    /**
     * Determines if a mask has been clicked. If a mask is shorter than a second
     * A buffer of 0.5secs to the start and end time is added so that it can be seen
     * visually and a users can click it.
     */
    determineIfMaskIsClicked = () => {
        if (!this.props.channel.waveform || !this.props.channel.waveform.masks) {
            return [];
        }
        // determine if any masks were click
        const timeForMouseXPosition = this.getTimeSecs() - this.props.offsetSecs;
        const halfSecond = 0.5;
        // Masks
        return sortBy(this.props.channel.waveform.masks, (m) => m.endTimeSecs - m.startTimeSecs).reduce((accumulator, m) => {
            // A mask with less than one second isn't clickable, thus adding a second to make sure it is clickable
            const adjustedStart = m.startTimeSecs - halfSecond;
            const adjustedEnd = m.endTimeSecs + halfSecond;
            if ((m.endTimeSecs - m.startTimeSecs < 1 &&
                adjustedStart <= timeForMouseXPosition &&
                timeForMouseXPosition <= adjustedEnd) ||
                (m.startTimeSecs <= timeForMouseXPosition && timeForMouseXPosition <= m.endTimeSecs)) {
                accumulator.push(m.id);
            }
            return accumulator;
        }, []);
    };
    /**
     * onSpectrogramMouseUp event handler
     *
     * @param e mouse event as React.MouseEvent<HTMLDivElement>
     */
    onSpectrogramMouseUp = (e) => {
        this.props.onMouseUp(e, this.mouseXPosition, this.props.channel, this.getTimeSecs() - this.props.offsetSecs, this.props.isDefaultChannel);
    };
    isMeasureWindowEnabled = () => this.props.isDefaultChannel
        ? !this.props.initialConfiguration.defaultChannel.disableMeasureWindow
        : !this.props.initialConfiguration.nonDefaultChannel.disableMeasureWindow;
    /**
     * onMouseDown event handler, may have to move the measureWindow logic to keydown
     * to distinguish between command click and regular click
     *
     * @param e The mouse event
     */
    onMouseDown = (e) => {
        setFocusToWeavess();
        // Prevent propagation of these events so that the underlying channel click doesn't register
        this.mouseDownXPosition = e.clientX;
        // if this is the measure window channel ignore the hotkey used to select measure window time range
        const measureWindowHotkeySatisfied = HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(this.props.initialConfiguration.hotKeys?.drawMeasureWindow));
        if ((measureWindowHotkeySatisfied && this.props.isMeasureWindow) || e.button === 2) {
            return;
        }
        const timeSecs = this.getTimeSecs();
        if (this.waveformRendererRef &&
            HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(this.props.initialConfiguration.hotKeys?.scaleWaveformAmplitude))) {
            e.stopPropagation();
            this.waveformRendererRef.beginScaleAmplitudeDrag(e);
        }
        else if (this.waveformRendererRef &&
            HotkeyListener.isGlobalHotKeyCommandSatisfied(getKeyboardShortcutCombos(this.props.initialConfiguration.hotKeys?.viewQcSegmentDetails))) {
            e.stopPropagation();
        }
        else if (this.props.onMouseDown) {
            // Send up the channel
            this.props.onMouseDown(e, this.mouseXPosition, this.props.channel, timeSecs - this.props.offsetSecs, this.props.isDefaultChannel, this.props.isMeasureWindow);
        }
    };
    /**
     * onSpectrogramKeyDown event handler
     *
     * @param e mouse event as React.KeyboardEvent<HTMLDivElement>
     */
    onSpectrogramKeyDown = () => {
        // no-op
    };
    /**
     * onKeyPress event handler
     *
     * @param e
     */
    onKeyDown = (e) => {
        if (!e.repeat) {
            if (this.waveformContentRef) {
                if (this.props.events) {
                    if (this.props.events.onKeyPress) {
                        const mousePosition = this.getMousePosition();
                        const timeSecs = this.getTimeSecs();
                        this.props.events.onKeyPress(e, mousePosition.clientX, mousePosition.clientY, this.props.channel, timeSecs);
                    }
                }
            }
        }
    };
    /**
     * @returns true if the min amplitude is -1 and the max amplitude is 1, which are the defaults.
     */
    isUsingDefaultWaveformYAxisBounds = () => this.state.waveformYAxisBounds.minAmplitude === -1 &&
        this.state.waveformYAxisBounds.maxAmplitude === 1;
    /**
     * Set the waveform y-axis bounds for the channel.
     *
     * @param min
     * @param max
     */
    setWaveformYAxisBounds = (min, max) => {
        if (this.state.waveformYAxisBounds) {
            if (this.state.waveformYAxisBounds.minAmplitude !== min ||
                this.state.waveformYAxisBounds.maxAmplitude !== max) {
                this.setState(prevState => ({
                    waveformYAxisBounds: {
                        ...prevState.waveformYAxisBounds,
                        minAmplitude: min,
                        maxAmplitude: max
                    }
                }));
            }
        }
    };
    /**
     * Set the spectrogram y-axis bounds for the channel.
     *
     * @param min
     * @param max
     */
    setSpectrogramYAxisBounds = (min, max) => {
        if (this.state.spectrogramYAxisBounds) {
            if (this.state.spectrogramYAxisBounds.minAmplitude !== min ||
                this.state.spectrogramYAxisBounds.maxAmplitude !== max) {
                this.setState(prevState => ({
                    spectrogramYAxisBounds: {
                        ...prevState.spectrogramYAxisBounds,
                        minAmplitude: min,
                        maxAmplitude: max
                    }
                }));
            }
        }
    };
    /**
     *
     * Calculate the offset scale based on the width of the render area.
     *
     * @param width the width of the render area
     */
    calculateOffset = (width) => {
        const { displayInterval, offsetSecs } = this.props;
        const scale = d3
            .scaleLinear()
            .domain([0, displayInterval.endTimeSecs - displayInterval.startTimeSecs])
            .range([0, width]);
        return scale(offsetSecs);
    };
    /**
     * Renders the scene which had its data calculated in {@link WaveformRenderer}
     */
    internalRenderScene = (
    /** THREE.js WebGLRenderer used to draw waveforms */
    renderer, 
    /** Rect of the entire weavess canvas */
    canvasRect, viewportRect, 
    /** THREE.js scene for this channel's individual waveform */
    scene, 
    /** THREE.js camera for this channel's individual waveform */
    camera, 
    /** Container to this channel's individual waveform */
    waveformContainer) => {
        if (!renderer || !canvasRect || !scene || !camera || !waveformContainer)
            return;
        // get its position relative to the page's viewport
        const waveformRect = waveformContainer.getBoundingClientRect();
        // check if it's out of bounds. If so skip it
        if (waveformRect.bottom < viewportRect.top - OVER_RENDER_CHANNEL_BUFFER_PX ||
            waveformRect.top > viewportRect.bottom + OVER_RENDER_CHANNEL_BUFFER_PX) {
            return; // it's out of bounds
        }
        // set the viewport
        const { width } = canvasRect;
        const height = waveformRect.height - WeavessConstants.WAVEFORM_PADDING_PX * 2;
        if (height <= 0) {
            return;
        }
        const x = waveformRect.left - canvasRect.left;
        const y = canvasRect.bottom - (waveformRect.bottom - WeavessConstants.WAVEFORM_PADDING_PX);
        renderer.setViewport(0, y, width, height);
        // adjust the camera view and offset
        const offset = this.calculateOffset(width) / this.props.getZoomRatio();
        camera.setViewOffset(waveformContainer.clientWidth, waveformContainer.clientHeight, Math.abs(x) - offset, 0, canvasRect.width, waveformContainer.clientHeight);
        renderer.setScissor(x, y, waveformContainer.clientWidth, height);
        renderer.render(scene, camera);
    };
}
//# sourceMappingURL=channel.js.map