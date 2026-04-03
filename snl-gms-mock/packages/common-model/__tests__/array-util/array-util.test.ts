import { atOrThrow, findIndexOrThrow, findOrThrow } from '../../src/ts/array-util';

describe('Array Util tests', () => {
  const testArray = ['foo', 'bar', 'baz'];

  describe('findOrThrow', () => {
    it('Finds element', () => {
      expect(findOrThrow(testArray, item => item === 'foo')).toBeDefined();
    });

    it('Cannot find element and throws', () => {
      expect(() => findOrThrow(testArray, item => item === 'fake')).toThrow();
    });
  });

  describe('atOrThrow', () => {
    it('Finds element', () => {
      expect(atOrThrow(testArray, testArray.length - 1)).toBeDefined();
    });

    it('Cannot find element and throws', () => {
      expect(() => atOrThrow(testArray, testArray.length + 1)).toThrow();
    });
  });

  describe('findIndexOrThrow', () => {
    it('Finds element', () => {
      expect(findIndexOrThrow(testArray, item => item === 'foo')).toBeDefined();
    });

    it('Cannot find element and throws', () => {
      expect(() => findIndexOrThrow(testArray, item => item === 'fake')).toThrow();
    });
  });
});
