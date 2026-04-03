import { WeavessTypes } from '@gms/weavess-core';
import React from 'react';
import type { ContentRendererProps, ContentRendererState } from './types';
/**
 * Content renderer component responsible for rendering the main content of a channel.
 */
export declare class ContentRenderer extends React.PureComponent<React.PropsWithChildren<ContentRendererProps>, ContentRendererState> {
    /** Default channel props, if not provided */
    static readonly defaultProps: WeavessTypes.ChannelDefaultConfiguration;
    /** Ref to the element where this channel will be rendered */
    containerRef: HTMLElement | null;
    /** Ref to the element where this description label will be rendered */
    descriptionLabelRef: HTMLElement | null;
    /** Ref to drag indicator element */
    private dragIndicatorRef;
    private resizeObserverTimeout;
    /** Ref to content rendered content element (has the full width of the channel) */
    private contentRendererContentRef;
    private readonly resizeObserver;
    /**
     * Constructor
     *
     * @param props props as ContentRendererProps
     */
    constructor(props: ContentRendererProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<React.PropsWithChildren<ContentRendererProps>>): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    /**
     * Check to see if we should be showing the follow marker on a channel
     *
     * @returns true if we can show a follow marker
     */
    private readonly shouldShowFollowPickMarker;
    /**
     * Called on mouse enter for the channel, will render a highlight if this is a split channel
     */
    private readonly onChannelMouseEnter;
    /**
     * Called on mouse enter for the channel, will remove a highlight if this is a split channel
     */
    private readonly onChannelMouseLeave;
    /**
     * sets the function onUpdateMarker if events and events.onUpdateMarker exist
     *
     * @param marker
     */
    private readonly updateMarker;
    /**
     * sets the function onMoveSelectionWindow if events and events.onMoveSelectionWindow exist
     *
     * @param marker
     */
    private readonly moveSelectionWindow;
    /**
     * sets the function onUpdateSelectionWindow if events and events.onUpdateSelectionWindow
     *
     * @param selection
     */
    private readonly updateSelectionWindow;
    /**
     * sets the function onClickSelectionWindow if events and events.onClickSelectionWindow exist
     *
     * @param selection
     */
    private readonly clickSelectionWindow;
    /**
     * Creates all of the markers.
     *
     * @param props the content renderer props
     * @returns an array JSX elements
     */
    private readonly createAllMarkers;
    /**
     * Returns the time in seconds for the given clientX.
     *
     * @param clientX The clientX
     * @returns The time in seconds; undefined if clientX is
     * out of the channel's bounds on screen.
     */
    private readonly getTimeSecsForClientX;
    /**
     * Returns clientX position for a given time in epoch seconds.
     *
     * @param clientX The clientX
     * @returns clientX position
     */
    private readonly getClientXForTimeSecs;
    /**
     * Toggle display of the drag indicator for this channel
     *
     * @param show True to show drag indicator
     * @param color The color of the drag indicator
     */
    private readonly toggleDragIndicator;
    /**
     * Set the position for the drag indicator
     *
     * @param clientX The clientX
     */
    private readonly positionDragIndicator;
}
//# sourceMappingURL=content-renderer.d.ts.map