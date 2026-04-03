import max from 'lodash/max';
import min from 'lodash/min';
/**
 * Determines the min and max values.
 *
 * @param values the values to calculate the min and max
 */
export const findMinAndMax = (values) => {
    return {
        min: min(values),
        max: max(values)
    };
};
/**
 * Determines the min and max values for the x-axis and y-axis.
 *
 * @param xValues the x-axis values to calculate the min and max
 * @param yValues the y-axis values to calculate the min and max
 */
export const findXYMinAndMax = (xValues, yValues) => {
    const xMinMax = findMinAndMax(xValues);
    const yMinMax = findMinAndMax(yValues);
    return {
        xMin: xMinMax.min,
        xMax: xMinMax.max,
        yMin: yMinMax.min,
        yMax: yMinMax.max
    };
};
//# sourceMappingURL=min-max-util.js.map