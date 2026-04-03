import delay from 'lodash/delay';
/**
 * A simple utility for handling both single and double click events when using
 * mouse down/up events.
 */
export class SingleDoubleClickEvent {
    /** delay in ms for handling single click events */
    static SINGLE_CLICK_DELAY_MS = 600;
    /** timeout in ms to clear out the double click behavior */
    static DOUBLE_CLICK_TIMEOUT_MS = 2000;
    /** timer id for the double click delay */
    doubleClickDelayTimerId;
    /** timer id for the single click delay */
    singleClickDelayTimerId;
    /**
     * A boolean flag that indicates if the mouse up event should be fired.
     * Used to prevent confusion between single and double click events.
     */
    shouldFireSingleClickEvent = true;
    /**
     * Handles a double click event.
     *
     * @param event the event
     * @param handleDoubleClickEvent the event to be fired to handle for a double event
     */
    onDoubleClick = (event, handleDoubleClickEvent) => {
        // flag that a double click event is in process, to prevent handling a single click
        this.shouldFireSingleClickEvent = false;
        // clear any previous delay
        if (this.singleClickDelayTimerId) {
            clearTimeout(this.singleClickDelayTimerId);
            this.singleClickDelayTimerId = undefined;
        }
        if (this.doubleClickDelayTimerId) {
            clearTimeout(this.doubleClickDelayTimerId);
            this.doubleClickDelayTimerId = undefined;
        }
        if (handleDoubleClickEvent) {
            handleDoubleClickEvent(event);
        }
        this.doubleClickDelayTimerId = delay(() => {
            // clear out the double click event to allow for single clicks
            this.shouldFireSingleClickEvent = true;
        }, 
        // create a new event to ensure that the event is in scope for the delayed action
        SingleDoubleClickEvent.DOUBLE_CLICK_TIMEOUT_MS, event);
    };
    /**
     * Handles a single click event.
     *
     * @param event the event
     * @param handleSingleClickEvent the event to be fired to handle for a single event
     */
    onSingleClickEvent = (event, handleSingleClickEvent) => {
        // clear any previous delay
        if (this.singleClickDelayTimerId) {
            clearTimeout(this.singleClickDelayTimerId);
            this.singleClickDelayTimerId = undefined;
        }
        // delay executing a single click to ensure the user does not do a double click
        this.singleClickDelayTimerId = delay((e) => {
            if (this.shouldFireSingleClickEvent && handleSingleClickEvent) {
                handleSingleClickEvent(e);
            }
        }, 
        // create a new event to ensure that the event is in scope for the delayed action
        SingleDoubleClickEvent.SINGLE_CLICK_DELAY_MS, event);
    };
}
//# sourceMappingURL=single-double-click-event.js.map