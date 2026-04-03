import type { WeavessTypes } from '@gms/weavess-core';

import type { AnimationFrameOptions } from '../../../../../../types';
import type { Channel } from '../../channel';

export interface WaveformRendererProps {
  /** viewable interval plus its min/max offsets; full amount of data window */
  displayInterval: WeavessTypes.TimeRange;

  /** viewable time interval, the amount of data initially loaded into weavess (excluding offsets) */
  viewableInterval: WeavessTypes.TimeRange;

  /** Id of the filter currently applied. This is the key into the {@link channelSegmentsRecord} indicating which waveforms to render */
  filterId: string;

  /** Collection of channel segments mapping filter name to a list of channel segments */
  channelSegmentsRecord: Record<string, WeavessTypes.ChannelSegment[]>;

  /** the min boundary (x value) in gl units */
  glMin: number;

  /** the max boundary (x value) in gl units */
  glMax: number;

  /* Is this part of the Measure Window */
  isMeasureWindow: boolean;

  /* used to tell if this waveform is involved in the expanded channel mode or if it should be dimmed */
  isSplitChannelOverlayOpen: boolean;

  /** waveform display configuration */
  initialConfiguration?: Partial<WeavessTypes.Configuration>;

  /** Collection of masks */
  masks?: WeavessTypes.Mask[];

  /** reference to split channels for expanded mode */
  splitChannelRefs: { [id: string]: Channel | null };

  /** helps identify the channel associated to this renderer */
  channelName: string;

  /** default min/max range scale for the y-axis */
  defaultRange?: WeavessTypes.Range;

  /** Amplitude scale factor to apply to measure window's waveform renderer */
  msrWindowWaveformAmplitudeScaleFactor?: { top: number; bottom: number };
  /** channel offset for scaling during alignment */
  channelOffset?: number;

  /** Forces the channel to dim */
  isAutoDimmed?: boolean;

  // Callbacks
  /**
   * Sets the Y axis bounds
   *
   * @param min minimum bound as a number
   * @param max Maximum bound as a number
   */
  setYAxisBounds(min: number | undefined, max: number | undefined);

  /** Issues a re render */
  renderWaveforms: (options?: AnimationFrameOptions) => void;

  /**
   * Used to look up the position buffer data (a Float32Array formatted like so: x y x y x y ...).
   * Takes the position buffer's id.
   */
  getPositionBuffer?: (
    id: string,
    startTime: number,
    endTime: number,
    domainTimeRange: WeavessTypes.TimeRange
  ) => Promise<Float32Array>;

  /**
   * Used to look up the Channel Segment Boundaries for a given channel segment by name
   */
  getBoundaries?(
    channelName: string,
    channelSegment: WeavessTypes.ChannelSegment,
    timeRange?: WeavessTypes.TimeRange
  ): Promise<WeavessTypes.ChannelSegmentBoundary | undefined>;

  setError: (isError: boolean, errorMessage?: string) => void;

  /**
   * Callback when the amplitude for a channel has been set
   */
  onSetAmplitude?(
    channelId: string,
    channelSegmentBounds: WeavessTypes.ChannelSegmentBoundary,
    isMeasureWindow: boolean
  ): void;
}

export interface Float32ArrayData {
  /** is this channel segment selected */
  isSelected: boolean;

  /** Color */
  color?: string;

  /** Display type */
  displayType?: WeavessTypes.DisplayType[];

  /** Point size */
  pointSize?: number;

  /** Waveform data */
  float32Array: Float32Array;

  /** Start time in seconds */
  startTimeSecs: number;

  /** End time in seconds */
  endTimeSecs: number;
}

/**
 * A pair associating a boundary object with the data segments it was derived from
 */
export interface BoundaryAndDataSegmentsPair {
  boundary: WeavessTypes.ChannelSegmentBoundary;
  dataSegments: WeavessTypes.DataSegment[];
}

/**
 * A pair associating a THREE Line object with the {@link WeavessTypes.DataSegment} it represents.
 */
export interface LineAndDataSegmentPair {
  line: THREE.Line;
  dataSegment: WeavessTypes.DataSegment;
}

/**
 * Maps a Float32Array to the corresponding DataSegment from which it was derived.
 */
export type Float32ArrayDataAndDataSegmentPair = Map<WeavessTypes.DataSegment, Float32ArrayData>;
