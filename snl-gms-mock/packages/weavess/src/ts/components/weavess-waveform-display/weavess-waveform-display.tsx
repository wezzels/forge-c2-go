/* eslint-disable react/destructuring-assignment */
import { ToastContainer, UILogger } from '@gms/ui-util';
import { registerHotKeyMode, unregisterHotKeyMode } from '@gms/ui-util/lib/ui-util/hot-key-util';
import { WeavessConstants, WeavessUtil } from '@gms/weavess-core';
import type { MeasureWindowSelection } from '@gms/weavess-core/lib/types';
import { deepEqual } from 'fast-equals';
import React from 'react';

import { HorizontalDivider } from './components/horizontal-divider';
import { MeasureWindow } from './components/measure-window';
import { memoizedGetConfiguration } from './configuration';
import type { WeavessWaveformDisplayProps, WeavessWaveformDisplayState } from './types';
import { WeavessWaveformPanel } from './weavess-waveform-panel';

const logger = UILogger.create('GMS_LOG_WEAVESS');

/**
 * Parent container for weavess. Contains a Waveform Panel for the main display
 * and the measure window.
 */
export class WeavessWaveformDisplay extends React.PureComponent<
  WeavessWaveformDisplayProps,
  WeavessWaveformDisplayState
> {
  /** Reference to the waveform panel. */
  public waveformPanelRef: WeavessWaveformPanel | null;

  /** Reference to the measure window container. */
  public measureWindowContainerRef: HTMLDivElement | null;

  /** Reference to the measure window panel. */
  public measureWindowPanelRef: WeavessWaveformPanel | null;

  /**
   * Constructor
   *
   * @param props WeavessWaveformDisplayProps
   */
  public constructor(props: WeavessWaveformDisplayProps) {
    super(props);
    const initialConfigurationWithDefaults = memoizedGetConfiguration(props.initialConfiguration);
    this.state = {
      measureWindowHeightPx: WeavessConstants.DEFAULT_DIVIDER_TOP_HEIGHT_PX,
      showMeasureWindow: false,
      isMeasureWindowVisible: false,
      measureWindowSelection: undefined,
      prevMeasureWindowSelectionFromProps: undefined,
      shouldRenderWaveforms: initialConfigurationWithDefaults.shouldRenderWaveforms ?? false,
      shouldRenderSpectrograms: initialConfigurationWithDefaults.shouldRenderSpectrograms ?? false
    };
  }

  // ******************************************
  // BEGIN REACT COMPONENT LIFECYCLE METHODS
  // ******************************************

  /**
   * Invoked right before calling the render method, both on the initial mount
   * and on subsequent updates. It should return an object to update the state,
   * or null to update nothing.
   *
   * @param nextProps the next props
   * @param prevState the previous state
   */
  public static getDerivedStateFromProps(
    nextProps: WeavessWaveformDisplayProps,
    prevState: WeavessWaveformDisplayState
  ): Partial<WeavessWaveformDisplayState> | null {
    let derivedState: Partial<WeavessWaveformDisplayState> = {};
    const hasStateChanged = false;
    const showMeasureWindowChanged = !deepEqual(
      nextProps.showMeasureWindow,
      prevState.showMeasureWindow
    );
    // check if the show measure window state has changed; if so update the state
    if (showMeasureWindowChanged) {
      derivedState = {
        ...derivedState,
        showMeasureWindow: nextProps.showMeasureWindow,
        isMeasureWindowVisible: nextProps.showMeasureWindow
      };
    }

    // check if the props specify and define the measure window selection
    const propsSpecifyAndDefineMeasureWindowSelection =
      !deepEqual(nextProps.measureWindowSelection, prevState.prevMeasureWindowSelectionFromProps) ||
      deepEqual(prevState.measureWindowSelection, prevState.prevMeasureWindowSelectionFromProps);
    if (propsSpecifyAndDefineMeasureWindowSelection) {
      // clear out any existing measure window selection
      if (prevState.measureWindowSelection?.removeSelection) {
        prevState.measureWindowSelection.removeSelection();
      }

      derivedState = {
        ...derivedState,
        measureWindowSelection: nextProps.measureWindowSelection,
        prevMeasureWindowSelectionFromProps: nextProps.measureWindowSelection
      };
    }

    if (hasStateChanged) {
      return derivedState;
    }
    return null; /* no-op */
  }

  public componentDidMount(): void {
    if (this.props.events.onMount) {
      if (this.props.events.onUnmount == null) {
        logger.warn(
          'Weavess onMount event provided as props, but no onUnmount provided. This may cause memory leaks (if references to Weavess are preserved in the upper scope. Be sure to clean up any references to Weavess refs and event listeners.'
        );
      }
      this.props.events.onMount(this);
    }
    this.props.initialConfiguration?.hotKeys?.editSignalDetectionUncertainty?.combos.forEach(
      combo => {
        registerHotKeyMode(combo, 'uncertainty-editing');
      }
    );
  }

  /**
   * Manages registration for the editSignalDetectionUncertainty hotkey if the combos change
   */
  public componentDidUpdate(prevProps: Readonly<WeavessWaveformDisplayProps>): void {
    if (
      prevProps.initialConfiguration?.hotKeys?.editSignalDetectionUncertainty?.combos !==
      this.props.initialConfiguration?.hotKeys?.editSignalDetectionUncertainty?.combos
    ) {
      // Unregister previous hotkeys for editSignalDetectionUncertainty
      prevProps.initialConfiguration?.hotKeys?.editSignalDetectionUncertainty?.combos.forEach(
        combo => {
          unregisterHotKeyMode(combo, 'uncertainty-editing');
        }
      );

      // Register new hotkeys for editSignalDetectionUncertainty
      this.props.initialConfiguration?.hotKeys?.editSignalDetectionUncertainty?.combos.forEach(
        combo => {
          registerHotKeyMode(combo, 'uncertainty-editing');
        }
      );
    }
  }

  /**
   * Catches exceptions generated in descendant components.
   * Unhandled exceptions will cause the entire component tree to unmount.
   *
   * @param error the error that was caught
   * @param info the information about the error
   */
  public componentDidCatch(error, info) {
    logger.error(`Waveform Display Error: ${error} : ${info}`);
  }

  public componentWillUnmount(): void {
    if (this.props.events.onUnmount) {
      this.props.events.onUnmount();
    }
  }

  // ******************************************
  // END REACT COMPONENT LIFECYCLE METHODS
  // ******************************************

  /**
   * Exposed primarily for non-react users.
   */
  public refresh = (): void => {
    if (!this.waveformPanelRef) {
      return;
    }
    this.waveformPanelRef.refresh();
    if (this.measureWindowPanelRef) {
      this.measureWindowPanelRef.refresh();
    }
  };

  /**
   * Converts a timestamp in seconds into the WebGL units in clipping space.
   *
   * @param timeSec the time to convert
   * @returns the equivalent GL units (in webGL clipping space)
   */
  public readonly convertTimeToGL = (timeSec: number): number => {
    const scale = WeavessUtil.scaleLinear(
      [
        this.props.currentInterval?.startTimeSecs ?? this.props.viewableInterval.startTimeSecs,
        this.props.currentInterval?.endTimeSecs ?? this.props.viewableInterval.endTimeSecs
      ],
      [0, 100]
    );
    return scale(timeSec);
  };

  /**
   * Returns true if the measure window is visible; false otherwise.
   *
   * @returns true if visible; false otherwise
   */
  public isMeasureWindowVisible = (): boolean => this.state.isMeasureWindowVisible;

  /**
   * Removes the selection div that spans all stations
   */
  public clearBrushStroke = (): void => {
    if (!this.waveformPanelRef) {
      return;
    }
    this.waveformPanelRef.clearBrushStroke();
    if (this.measureWindowPanelRef) {
      this.measureWindowPanelRef.clearBrushStroke();
    }
  };

  /**
   * Updates the start and end of the brush stroke
   * @param start start time to set the brush to
   * @param end end time to set the brush to
   * @returns void
   */
  public updateBrushStroke = (start: number, end: number): void => {
    if (!this.waveformPanelRef) {
      return;
    }
    this.waveformPanelRef.updateBrushStroke(start, end);
    if (this.measureWindowPanelRef) {
      this.measureWindowPanelRef.updateBrushStroke(start, end);
    }
  };

  /**
   * Toggle the measure window visibility.
   */
  public toggleMeasureWindowVisibility = (): void => {
    if (this.state.measureWindowSelection) {
      if (this.state.measureWindowSelection.removeSelection) {
        this.state.measureWindowSelection.removeSelection();
      }
    }

    if (this.state.measureWindowSelection && this.state.measureWindowSelection?.isDefaultChannel) {
      if (this.props.events?.stationEvents?.defaultChannelEvents?.events?.onMeasureWindowUpdated) {
        this.props.events.stationEvents.defaultChannelEvents.events.onMeasureWindowUpdated(
          !this.state.isMeasureWindowVisible
        );
      }
    } else if (
      this.props.events?.stationEvents?.nonDefaultChannelEvents?.events?.onMeasureWindowUpdated
    ) {
      this.props.events.stationEvents.nonDefaultChannelEvents.events.onMeasureWindowUpdated(
        !this.state.isMeasureWindowVisible
      );
    }

    this.setState(prevState => ({
      isMeasureWindowVisible: !prevState.isMeasureWindowVisible,
      measureWindowSelection: undefined
    }));
  };

  /**
   * Pass through method to expose the panels scrollToRow method which vertically scrolls to center a row
   * @param rowId rowId to scroll to
   * @param centered Should the row be centered(true) or top aligned(false)
   */
  public scrollToRow = (
    rowId: string,
    customRowHeight?: number,
    heightOffset?: number,
    centered?: boolean
  ): void => {
    this.waveformPanelRef?.scrollToRow(rowId, customRowHeight, heightOffset, centered);
  };

  public getMeasureWindowHeightPx = (): number => {
    return this.state.measureWindowHeightPx;
  };

  public setMeasureWindowSelection = (measureWindowSelection: MeasureWindowSelection): void => {
    const {
      stationId,
      channelId,
      startTimeSecs,
      endTimeSecs,
      isDefaultChannel,
      removeSelection,
      nonIdealState,
      customLabel
    } = measureWindowSelection;
    const channelRef = this.waveformPanelRef?.findChannel(channelId);

    this.updateMeasureWindow({
      stationId,
      channelId,
      startTimeSecs,
      endTimeSecs,
      isDefaultChannel,
      waveformAmplitudeScaleFactor: channelRef?.getManualScale(), // If the channel already exists get its manual scale
      removeSelection,
      nonIdealState,
      customLabel
    });
  };

  /**
   * Toggles whether or not waveforms or spectrograms should be rendered
   *
   * Toggle Order (repeat):
   *   * render: waveforms and spectrograms
   *   * render: waveforms
   *   * render: spectrograms
   */
  public toggleRenderingContent = (): void => {
    if (this.state.shouldRenderWaveforms && this.state.shouldRenderSpectrograms) {
      this.setState({
        shouldRenderWaveforms: true,
        shouldRenderSpectrograms: false
      });
    } else if (this.state.shouldRenderWaveforms && !this.state.shouldRenderSpectrograms) {
      this.setState({
        shouldRenderWaveforms: false,
        shouldRenderSpectrograms: true
      });
    } else {
      this.setState({
        shouldRenderWaveforms: true,
        shouldRenderSpectrograms: true
      });
    }
  };

  /** Toggles whether or not waveforms should be rendered */
  public toggleShouldRenderWaveforms = (): void => {
    this.setState(prevState => ({
      shouldRenderWaveforms: !prevState.shouldRenderWaveforms
    }));
  };

  /** Toggles whether or not spectrograms should be rendered */
  public toggleShouldRenderSpectrograms = (): void => {
    this.setState(prevState => ({
      shouldRenderSpectrograms: !prevState.shouldRenderSpectrograms
    }));
  };

  /**
   * Used to reset any Manual Amplitude Scaling override for main waveform panel
   * and measure window panel
   */
  public readonly resetWaveformPanelAmplitudes = (): void => {
    if (this.waveformPanelRef) {
      this.waveformPanelRef.resetAmplitudes();
    }

    if (this.measureWindowPanelRef) {
      this.measureWindowPanelRef.resetAmplitudes();
    }
  };

  /**
   * Used to reset any Manual Amplitude Scaling override for single channel for either
   * main waveform panel or measure window
   */
  // eslint-disable-next-line react/no-unused-class-component-methods
  public readonly resetSelectedWaveformAmplitudeScaling = (
    channelIds: string[],
    isMeasureWindow: boolean
  ): void => {
    if (isMeasureWindow && this.measureWindowPanelRef) {
      this.measureWindowPanelRef.resetAmplitudes();
    } else if (this.waveformPanelRef) {
      this.waveformPanelRef.resetSelectedWaveformAmplitudeScaling(channelIds);
    }
  };

  /** ** ** ** ** ** ** ** ** **
   * Private Functions
   * ** ** ** ** ** ** ** ** ** */

  /**
   * A setter to set the waveform panel ref
   *
   * @param ref the ref returned from the WeavessWaveformPanel
   */
  private readonly setWaveformRef = (ref: WeavessWaveformPanel | null) => {
    if (ref) {
      this.waveformPanelRef = ref;
    }
  };

  /**
   * A setter to set the measure window ref
   *
   * @param ref the ref returned from the WeavessWaveformPanel contained within the MeasureWindow
   */
  private readonly setMeasureWindowRef = (ref: WeavessWaveformPanel | null) => {
    this.measureWindowPanelRef = ref;
  };

  /**
   * Update measure window
   *
   * @param measureWindowSelection
   */

  private readonly updateMeasureWindow = (measureWindowSelection: MeasureWindowSelection) => {
    const { channelId, startTimeSecs, endTimeSecs, isDefaultChannel } = measureWindowSelection;
    if (
      this.state.measureWindowSelection &&
      this.state.measureWindowSelection.channelId !== channelId
    ) {
      if (this.state.measureWindowSelection.removeSelection) {
        this.state.measureWindowSelection.removeSelection();
      }
    }

    this.setState(
      {
        isMeasureWindowVisible: true,
        measureWindowSelection
      },
      () => {
        if (this.state.isMeasureWindowVisible && this.props.events?.onMeasureWindowResize) {
          this.props.events.onMeasureWindowResize(this.state.measureWindowHeightPx);
        }
        if (isDefaultChannel) {
          if (
            this.props.events?.stationEvents?.defaultChannelEvents?.events?.onMeasureWindowUpdated
          ) {
            this.props.events.stationEvents.defaultChannelEvents.events.onMeasureWindowUpdated(
              true,
              channelId,
              startTimeSecs,
              endTimeSecs,
              this.state.measureWindowHeightPx
            );
          }
        } else if (
          this.props.events?.stationEvents?.nonDefaultChannelEvents?.events?.onMeasureWindowUpdated
        ) {
          this.props.events.stationEvents.nonDefaultChannelEvents.events.onMeasureWindowUpdated(
            true,
            channelId,
            startTimeSecs,
            endTimeSecs,
            this.state.measureWindowHeightPx
          );
        }
      }
    );
  };

  /**
   * Handler for when the measure window is resized.
   *
   * @param heightPx the new height of the measure window
   */
  private readonly onMeasureWindowResizeMouseUp = (heightPx: number): void => {
    this.setState(
      {
        measureWindowHeightPx: heightPx
      },
      () => {
        if (this.props.events?.onMeasureWindowResize) {
          this.props.events.onMeasureWindowResize(heightPx);
        }
        if (this.state.measureWindowSelection) {
          if (this.state.measureWindowSelection?.isDefaultChannel) {
            if (
              this.props.events?.stationEvents?.defaultChannelEvents?.events?.onMeasureWindowUpdated
            ) {
              this.props.events.stationEvents.defaultChannelEvents.events.onMeasureWindowUpdated(
                true,
                this.state.measureWindowSelection.channelId,
                this.state.measureWindowSelection.startTimeSecs,
                this.state.measureWindowSelection.endTimeSecs,
                heightPx
              );
            }
          } else if (
            this.props.events?.stationEvents?.nonDefaultChannelEvents?.events
              ?.onMeasureWindowUpdated
          ) {
            this.props.events.stationEvents.nonDefaultChannelEvents.events.onMeasureWindowUpdated(
              true,
              this.state.measureWindowSelection.channelId,
              this.state.measureWindowSelection.startTimeSecs,
              this.state.measureWindowSelection.endTimeSecs,
              heightPx
            );
          }
        }
      }
    );
  };

  public render(): JSX.Element {
    // measure window's viewable interval is the selection window
    const msrWindowViewableInterval = {
      startTimeSecs: this.state.measureWindowSelection?.startTimeSecs ?? 0,
      endTimeSecs: this.state.measureWindowSelection?.endTimeSecs ?? 0
    };

    const measureWindowStation = this.props.stations.find(
      s => s.id === this.state.measureWindowSelection?.stationId
    );

    const measureWindowChannel = this.state.measureWindowSelection?.isDefaultChannel
      ? measureWindowStation?.defaultChannels.find(
          c => c.id === this.state.measureWindowSelection?.channelId
        )
      : measureWindowStation?.nonDefaultChannels?.find(
          c => c.id === this.state.measureWindowSelection?.channelId
        );
    // TODO fix performance (stability)
    /** {@link MeasureWindow} as topComponent */
    const topComponent = (measureWindowHeightPx: number, __, isResizing: boolean) => (
      <MeasureWindow
        measureWindowChannel={measureWindowChannel}
        key={JSON.stringify(msrWindowViewableInterval)}
        displayInterval={msrWindowViewableInterval}
        convertTimeToGL={this.convertTimeToGL}
        initialConfiguration={memoizedGetConfiguration(this.props.initialConfiguration)}
        isControlledComponent={false}
        shouldRenderWaveforms={this.state.shouldRenderWaveforms}
        shouldRenderSpectrograms={this.state.shouldRenderSpectrograms}
        measureWindowHeightPx={measureWindowHeightPx}
        measureWindowSelection={this.state.measureWindowSelection}
        setMeasureWindowRef={this.setMeasureWindowRef}
        isResizing={isResizing}
        resetWaveformPanelAmplitudes={this.resetWaveformPanelAmplitudes}
        scrollBarWidthPx={0}
        viewableInterval={this.props.viewableInterval}
        stations={this.props.stations}
        events={this.props.events}
        flex={this.props.flex}
        closeSplitChannelOverlayCallback={this.props.closeSplitChannelOverlayCallback}
        markers={this.props.markers}
        customLabel={this.props.customLabel}
        splitModePickMarkerColor={this.props.splitModePickMarkerColor}
        hotkeyZoomInRatio={this.props.hotkeyZoomInRatio}
        hotkeyZoomOutRatio={this.props.hotkeyZoomOutRatio}
        panRatio={this.props.panRatio}
        extraInfoBar={this.props.extraInfoBar}
        activeSplitModeType={this.props.activeSplitModeType}
        clearSelectedChannels={this.props.clearSelectedChannels}
        selectChannel={this.props.selectChannel}
        getPositionBuffer={this.props.getPositionBuffer}
        getBoundaries={this.props.getBoundaries}
        shouldThickenStationBorders={false}
      />
    );

    // TODO fix performance (stability)
    /** {@link WeavessWaveformPanel} as bottomComponent */
    const bottomComponent = (__, ___, isResizing: boolean) => {
      return (
        <WeavessWaveformPanel
          ref={this.setWaveformRef}
          splitModePickMarkerColor={this.props?.splitModePickMarkerColor}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          stations={this.props.stations}
          events={this.props.events}
          flex={this.props.flex}
          closeSplitChannelOverlayCallback={this.props.closeSplitChannelOverlayCallback}
          markers={this.props.markers}
          customLabel={this.props.customLabel}
          hotkeyZoomInRatio={this.props.hotkeyZoomInRatio}
          hotkeyZoomOutRatio={this.props.hotkeyZoomOutRatio}
          panRatio={this.props.panRatio}
          extraInfoBar={this.props.extraInfoBar}
          activeSplitModeType={this.props.activeSplitModeType}
          clearSelectedChannels={this.props.clearSelectedChannels}
          selectChannel={this.props.selectChannel}
          getPositionBuffer={this.props.getPositionBuffer}
          getBoundaries={this.props.getBoundaries}
          convertTimeToGL={this.convertTimeToGL}
          initialConfiguration={memoizedGetConfiguration(this.props.initialConfiguration)}
          isControlledComponent={this.props.isControlledComponent ?? true}
          updateMeasureWindow={this.updateMeasureWindow}
          displayInterval={this.props.displayInterval}
          viewableInterval={this.props.viewableInterval}
          shouldRenderWaveforms={this.state.shouldRenderWaveforms}
          shouldRenderSpectrograms={this.state.shouldRenderSpectrograms}
          isResizing={isResizing}
          resetWaveformPanelAmplitudes={this.resetWaveformPanelAmplitudes}
          scrollBarWidthPx={WeavessConstants.SCROLLBAR_WIDTH_PIXELS}
          shouldThickenStationBorders={this.props.shouldThickenStationBorders}
          measureWindowSelection={this.state.measureWindowSelection}
        />
      );
    };

    return (
      <div
        className="weavess"
        data-cy="weavess-container"
        data-start-time={this.props.viewableInterval.startTimeSecs}
        data-end-time={this.props.viewableInterval.endTimeSecs}
        onBlur={e => {
          // we need to check that the on blur trigger was not a child of this component
          // before we call close on split channels
          if (
            this.props.closeSplitChannelOverlayCallback &&
            e?.relatedTarget &&
            !e?.currentTarget?.contains(e.relatedTarget)
          ) {
            this.props.closeSplitChannelOverlayCallback();
          }
        }}
        style={
          {
            '--weavess-background-color': this.props.initialConfiguration?.backgroundColor
          } as React.CSSProperties
        }
      >
        <HorizontalDivider
          topComponent={topComponent}
          bottomComponent={bottomComponent}
          topClassName="weavess-measure-window"
          bottomClassName="weavess-waveform-display"
          showTop={this.state.isMeasureWindowVisible}
          onResizeEnd={this.onMeasureWindowResizeMouseUp}
        />
        {!this.props.disableToastContainer ? (
          <ToastContainer
            containerId="Weavess-Toast-Container"
            theme={this.props.uiTheme?.isLightMode ? 'light' : 'dark'}
          />
        ) : undefined}
      </div>
    );
  }
}
