type Task<TaskResultType> = (() => PromiseLike<TaskResultType>) | (() => TaskResultType);
export interface OrderedPriorityQueueOptions {
    tag: string | undefined;
    id: string | undefined;
    priority: number;
}
/**
 * Creates a priority queue and allows in flight adjustment to the priority of the tasks in the queue.
 *
 * Usage:
 *
 * ```ts
 * const queue = new OrderedPriorityQueue({ concurrency: 15 });
 * ```
 */
export declare class OrderedPriorityQueue {
    private readonly queue;
    private tag;
    private pending;
    private readonly concurrency;
    private paused;
    private readonly logger;
    constructor(options: any);
    private get doesConcurrencyAllowAnother();
    private tryToStartAnother;
    private next;
    private enqueue;
    private dequeue;
    /**
     * Get the size of the remaining items in the queue
     */
    get size(): number;
    /**
     * Clear the promise queue of all pending promises
     */
    clear(): void;
    /**
     * Prioritize the queue against a new tag
     *
     * @param tag the tag to prioritize the queue against
     */
    prioritize(tag: string): void;
    /**
     * Add a task to the priority queue.
     *
     * @param func the function to resolve
     * @param options the options for this task (tag and priority)
     * @returns a promise
     */
    add<TaskResultType>(func: Task<TaskResultType>, options?: Partial<OrderedPriorityQueueOptions>): Promise<TaskResultType | void>;
    has(id: string): boolean;
    now(id: string): Promise<unknown>;
    /**
     * Pause execution of subsequent tasks. This will not stop any tasks in progress, but will prevent
     * new ones from starting.
     */
    pause(): void;
    /**
     * Unpause execution of tasks in the queue. This will start execution of up to the concurrency limit.
     */
    unpause(): void;
}
export {};
//# sourceMappingURL=ordered-priority-queue.d.ts.map