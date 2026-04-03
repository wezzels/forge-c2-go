import type React from 'react';
/**
 * A simple utility for handling both single and double click events when using
 * mouse down/up events.
 */
export declare class SingleDoubleClickEvent {
    /** delay in ms for handling single click events */
    static readonly SINGLE_CLICK_DELAY_MS: number;
    /** timeout in ms to clear out the double click behavior */
    static readonly DOUBLE_CLICK_TIMEOUT_MS: number;
    /** timer id for the double click delay */
    private doubleClickDelayTimerId;
    /** timer id for the single click delay */
    private singleClickDelayTimerId;
    /**
     * A boolean flag that indicates if the mouse up event should be fired.
     * Used to prevent confusion between single and double click events.
     */
    private shouldFireSingleClickEvent;
    /**
     * Handles a double click event.
     *
     * @param event the event
     * @param handleDoubleClickEvent the event to be fired to handle for a double event
     */
    readonly onDoubleClick: (event: React.MouseEvent<HTMLDivElement> | MouseEvent, handleDoubleClickEvent?: ((event: React.MouseEvent<HTMLDivElement> | MouseEvent) => void) | undefined) => void;
    /**
     * Handles a single click event.
     *
     * @param event the event
     * @param handleSingleClickEvent the event to be fired to handle for a single event
     */
    readonly onSingleClickEvent: (event: React.MouseEvent<HTMLDivElement> | MouseEvent, handleSingleClickEvent?: ((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => void) | undefined) => void;
}
//# sourceMappingURL=single-double-click-event.d.ts.map