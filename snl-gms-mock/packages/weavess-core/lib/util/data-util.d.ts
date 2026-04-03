import type { DataByTime } from '../types';
/**
 * Given the values, determine if there is a step value when a value goes up or down;
 * There is not a step value then add the step value to ensure `steps` when the
 * values increase or decrease.
 *
 * @param values the values provided to chart
 */
export declare const createStepPoints: (values: number[][]) => DataByTime;
/**
 * Creates a linear scaling function
 *
 * @param domain the domain from which to scale (input)
 * @param range the range to which to scale (output)
 * @returns a scaling function that maps the domain to the range
 */
export declare const scaleLinear: (domain: [number, number], range: [number, number]) => (numSecs: number) => number;
//# sourceMappingURL=data-util.d.ts.map