import type { ChannelContentEvents, Events, LabelEvents } from './types';
/** Constant for converting from decimal to percent. */
export declare const PERCENT_100 = 100;
/** Constant for the scrollbar width in pixels; */
export declare const SCROLLBAR_WIDTH_PIXELS = 8;
/** Constant for the default label width in pixels; */
export declare const MIN_LABEL_WIDTH_PIXELS = 100;
/** Constant for the default label width in pixels; */
export declare const DEFAULT_LABEL_WIDTH_PIXELS = 184;
/** Constant for the default channel height in pixels; */
export declare const DEFAULT_CHANNEL_HEIGHT_PIXELS = 50;
/** Constant for the xaxis height in pixels; */
export declare const DEFAULT_XAXIS_HEIGHT_PIXELS = 35;
/** Constant the number or milliseconds in a second */
export declare const MILLISECONDS_IN_SECOND = 1000;
/** The duration of one frame at 60FPS */
export declare const ONE_FRAME_MS = 16;
/** The default height of the horizontal divider top container */
export declare const DEFAULT_DIVIDER_TOP_HEIGHT_PX = 200;
/** The min height of the horizontal divider top container */
export declare const DEFAULT_DIVIDER_TOP_MIN_HEIGHT_PX = 100;
/** The max height of the horizontal divider top container */
export declare const DEFAULT_DIVIDER_TOP_MAX_HEIGHT_PX = 500;
/**
 * The number of pixels of padding to add at the top and bottom of each waveform.
 * This prevents them from touching the top and bottom of the channel, and also adjusts
 * the position of the y axis accordingly.
 */
export declare const WAVEFORM_PADDING_PX = 2;
/**
 * A constant that defines the weavess label events
 * to all be `undefined`.
 */
export declare const DEFAULT_UNDEFINED_LABEL_EVENTS: LabelEvents;
/**
 * A constant that defines the weavess channel content events
 * to all be `undefined`.
 */
export declare const DEFAULT_UNDEFINED_CHANNEL_CONTENT_EVENTS: ChannelContentEvents;
/**
 * A constant that defines the weavess events
 * to all be `undefined`.
 */
export declare const DEFAULT_UNDEFINED_EVENTS: Events;
//# sourceMappingURL=constants.d.ts.map