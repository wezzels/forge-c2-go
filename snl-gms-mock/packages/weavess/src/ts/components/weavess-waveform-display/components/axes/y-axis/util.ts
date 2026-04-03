/**
 * Create a formatter function that formats y-axis ticks
 *
 * @param min the min tick value
 * @param max the max tick value
 * @returns a formatter that will limit precision of the ticks
 */
export function getYAxisTickFormatter(min: number, max: number) {
  // set the floating point precision of amplitude
  let precision = 1;

  // Display 0 digits if min or max absolute value is >= 1.0
  if (Math.max(Math.abs(min), Math.abs(max)) >= 1.0) {
    precision = 0;
  }

  return (value: number) => {
    const sign = value < 0 ? -1 : 1;

    const inclusiveVal =
      precision === 0 ? Math.ceil(value) : (Math.ceil(Math.abs(value * 10)) / 10) * sign;
    return inclusiveVal.toFixed(precision);
  };
}
