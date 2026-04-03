/* eslint-disable @typescript-eslint/no-magic-numbers */
import { getYAxisTickFormatter } from '../../../../../../src/ts/components/weavess-waveform-display/components/axes/y-axis/util';

describe('getYAxisTickFormatter', () => {
  it('should return the same value if run on its own output if given a max offset greater than 1', () => {
    const formatter = getYAxisTickFormatter(-1.23, 1);

    const formattedValue1 = formatter(1.23);
    const formattedValue2 = formatter(Number.parseFloat(formattedValue1));
    const formattedValue3 = formatter(Number.parseFloat(formattedValue2));

    expect(formattedValue1).toBe(formattedValue2);
    expect(formattedValue1).toBe(formattedValue3);
    expect(formattedValue1).toBe('2');
  });
  it('should return the same value if run on its own output if given a max offset less than 1', () => {
    const formatter = getYAxisTickFormatter(-0.23, 0.1);

    const formattedValue1 = formatter(-0.19);
    const formattedValue2 = formatter(Number.parseFloat(formattedValue1));
    const formattedValue3 = formatter(Number.parseFloat(formattedValue2));

    expect(formattedValue1).toBe(formattedValue2);
    expect(formattedValue1).toBe(formattedValue3);
    expect(formattedValue1).toBe('-0.2');
  });

  it('should round up if greater than 1', () => {
    const formatter = getYAxisTickFormatter(-1, 1.1);
    expect(formatter(1.1)).toBe('2');
    expect(formatter(1.11)).toBe('2');
    expect(formatter(1.5)).toBe('2');
    expect(formatter(1.55)).toBe('2');
  });

  it('should return an unchanged value for the max of 0.1', () => {
    const formatter = getYAxisTickFormatter(-0.01, 0.1);
    expect(formatter(0.1)).toBe('0.1');
  });

  it('should round up to 0.2 for the max of 0.11', () => {
    const formatter = getYAxisTickFormatter(-0.1, 0.11);
    expect(formatter(0.11)).toBe('0.2');
  });

  it('should return an unchanged value of -1 for the min of -0.1', () => {
    const formatter = getYAxisTickFormatter(-0.1, -0.01);
    expect(formatter(-0.1)).toBe('-0.1');
  });

  it('should round up to -0.2 for the min of -0.11', () => {
    const formatter = getYAxisTickFormatter(-0.11, -0.01);
    expect(formatter(-0.11)).toBe('-0.2');
  });

  it('should leave a value of 1 unchanged', () => {
    const formatter = getYAxisTickFormatter(-1, 1);
    expect(formatter(1)).toBe('1');
    expect(formatter(-1)).toBe('-1');
  });
});
