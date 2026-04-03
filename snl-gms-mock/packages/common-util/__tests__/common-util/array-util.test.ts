import { mergeTypedArrays } from '../../src/ts/common-util';

describe('array util', () => {
  test('function exist', () => {
    expect(mergeTypedArrays).toBeDefined();
  });

  test('can merge typed arrays', () => {
    expect(mergeTypedArrays(undefined, undefined)).toEqual(undefined);

    expect(mergeTypedArrays(new Float64Array([5]), undefined)).toMatchInlineSnapshot(`
      Float64Array [
        5,
      ]
    `);

    expect(mergeTypedArrays(undefined, new Float64Array([2]))).toMatchInlineSnapshot(`
      Float64Array [
        2,
      ]
    `);

    expect(mergeTypedArrays(new Float64Array([5]), new Float64Array([]))).toMatchInlineSnapshot(`
      Float64Array [
        5,
      ]
    `);

    expect(mergeTypedArrays(new Float64Array([]), new Float64Array([2]))).toMatchInlineSnapshot(`
      Float64Array [
        2,
      ]
    `);

    expect(mergeTypedArrays(new Float64Array([1, 2, 3]), new Float64Array([4, 5])))
      .toMatchInlineSnapshot(`
      Float64Array [
        1,
        2,
        3,
        4,
        5,
      ]
    `);

    expect(() => {
      mergeTypedArrays(new Float64Array([1, 2, 3]), new Float32Array([4, 5]) as any);
    }).toThrow();
  });
});
