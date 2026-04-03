import findLastIndex from 'lodash/findLastIndex';
// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while (count > 0) {
        const step = Math.trunc(count / 2);
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
            it += 1;
            first = it;
            count -= step + 1;
        }
        else {
            count = step;
        }
    }
    return first;
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
export class OrderedPriorityQueue {
    queue = [];
    tag;
    pending = 0;
    concurrency = 0;
    paused = false;
    logger = console;
    constructor(options) {
        this.concurrency = options.concurrency || Number.MAX_SAFE_INTEGER;
        this.logger = options.logger || console;
    }
    get doesConcurrencyAllowAnother() {
        return this.pending < this.concurrency;
    }
    tryToStartAnother() {
        if (this.doesConcurrencyAllowAnother && !this.paused) {
            const job = this.dequeue();
            if (!job)
                return false;
            job().catch(error => {
                this.logger.error(error);
                throw error;
            });
            return true;
        }
        return false;
    }
    next() {
        this.pending -= 1;
        this.tryToStartAnother();
    }
    enqueue(run, options) {
        options = {
            priority: 0,
            ...options
        };
        const element = {
            id: options.id,
            priority: options.priority || 0,
            tag: options.tag,
            run
        };
        if (this.size &&
            this.queue[this.size - 1] &&
            (this.queue[this.size - 1].priority || 0) >= (options.priority || 0)) {
            this.queue.push(element);
            return;
        }
        const index = lowerBound(this.queue, element, (a, b) => (b.priority || 0) - (a.priority || 0));
        this.queue.splice(index, 0, element);
    }
    dequeue() {
        if (this.tag) {
            const index = findLastIndex(this.queue, item => item.tag === this.tag);
            if (index >= 0) {
                const item = this.queue.splice(index, 1);
                return item[0]?.run;
            }
            this.tag = undefined;
        }
        const item = this.queue.shift();
        return item?.run;
    }
    /**
     * Get the size of the remaining items in the queue
     */
    get size() {
        return this.queue.length;
    }
    /**
     * Clear the promise queue of all pending promises
     */
    clear() {
        this.queue.length = 0;
    }
    /**
     * Prioritize the queue against a new tag
     *
     * @param tag the tag to prioritize the queue against
     */
    prioritize(tag) {
        this.tag = tag;
    }
    /**
     * Add a task to the priority queue.
     *
     * @param func the function to resolve
     * @param options the options for this task (tag and priority)
     * @returns a promise
     */
    async add(func, options = {}) {
        return new Promise((resolve, reject) => {
            this.enqueue(async () => {
                this.pending += 1;
                try {
                    const result = await func();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    this.next();
                }
            }, options);
            this.tryToStartAnother();
        });
    }
    has(id) {
        return this.queue.some(item => item.id === id);
    }
    async now(id) {
        const index = this.queue.findIndex(item => item.id === id);
        if (index >= 0) {
            // grab the item out of the queue
            const [nowItem] = this.queue.splice(index, 1);
            return nowItem.run();
        }
        return undefined;
    }
    /**
     * Pause execution of subsequent tasks. This will not stop any tasks in progress, but will prevent
     * new ones from starting.
     */
    pause() {
        this.paused = true;
    }
    /**
     * Unpause execution of tasks in the queue. This will start execution of up to the concurrency limit.
     */
    unpause() {
        this.paused = false;
        for (let i = 0; i < this.concurrency; i += 1) {
            this.tryToStartAnother();
        }
    }
}
//# sourceMappingURL=ordered-priority-queue.js.map