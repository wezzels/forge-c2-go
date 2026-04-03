import max from 'lodash/max';
import min from 'lodash/min';
/**
 * Interface that provides the minimum and maximum
 * values for both x and y.
 */
export interface MinAndMax {
    readonly xMin: number | undefined;
    readonly xMax: number | undefined;
    readonly yMin: number | undefined;
    readonly yMax: number | undefined;
}
/**
 * Determines the min and max values.
 *
 * @param values the values to calculate the min and max
 */
export declare const findMinAndMax: (values: number[] | undefined) => {
    min: number | undefined;
    max: number | undefined;
};
/**
 * Determines the min and max values for the x-axis and y-axis.
 *
 * @param xValues the x-axis values to calculate the min and max
 * @param yValues the y-axis values to calculate the min and max
 */
export declare const findXYMinAndMax: (xValues: number[], yValues: number[]) => MinAndMax;
//# sourceMappingURL=min-max-util.d.ts.map