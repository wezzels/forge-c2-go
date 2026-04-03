/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  capitalizeFirstLetters,
  determinePrecisionByType,
  prettifyAllCapsEnumType,
  setDecimalPrecision,
  setDecimalPrecisionAsNumber,
  stripOutFirstOccurrence
} from '../../src/ts/common-util/formatting-util';
import { ValueType } from '../../src/ts/types/value-type';

describe('Format utils', () => {
  describe('setDecimalPrecision and setDecimalPrecisionAsNumber', () => {
    const numberToEdit = 4.89756;
    it('One decimal place', () => {
      const one = setDecimalPrecision(numberToEdit, 1);
      const oneNumber = setDecimalPrecisionAsNumber(numberToEdit, 1);
      expect(one).toEqual('4.9');
      expect(oneNumber).toEqual(4.9);
    });

    it('Two decimal places', () => {
      const two = setDecimalPrecision(numberToEdit, 2);
      const twoNumber = setDecimalPrecisionAsNumber(numberToEdit, 2);
      expect(two).toEqual('4.90');
      expect(twoNumber).toEqual(4.9);
    });

    it('Three decimal places', () => {
      const three = setDecimalPrecision(numberToEdit, 3);
      const threeNumber = setDecimalPrecisionAsNumber(numberToEdit, 3);
      expect(three).toEqual('4.898');
      expect(threeNumber).toEqual(4.898);
    });

    it('Four decimal places', () => {
      const four = setDecimalPrecision(numberToEdit, 4);
      const fourNumber = setDecimalPrecisionAsNumber(numberToEdit, 4);
      expect(four).toEqual('4.8976');
      expect(fourNumber).toEqual(4.8976);
    });

    it('Adds commas for large numbers', () => {
      const large = setDecimalPrecision(100000000, 4);
      expect(large).toEqual('100,000,000.0000');
    });

    it('Rounds up', () => {
      const numToRound = 1.125;
      const result = setDecimalPrecision(numToRound, 2);
      const resultNumber = setDecimalPrecisionAsNumber(numToRound, 2);
      expect(result).toEqual('1.13');
      expect(resultNumber).toEqual(1.13);
    });

    it('Rounds down', () => {
      const numToRound = 1.125;
      const result = setDecimalPrecision(numToRound, 1);
      const resultNumber = setDecimalPrecisionAsNumber(numToRound, 1);
      expect(result).toEqual('1.1');
      expect(resultNumber).toEqual(1.1);
    });
  });

  test('Prettify All Caps Enum', () => {
    const singleWordEnum = 'MISSING';
    expect(prettifyAllCapsEnumType(singleWordEnum)).toEqual('Missing');

    const multiWordEnum = 'ENV_TYPE_TO_TEST';
    expect(prettifyAllCapsEnumType(multiWordEnum, true)).toEqual('Type To Test');
  });

  test('Strip station from channel name', () => {
    const channel = 'STATION.SITE.CHANNEL';
    expect(stripOutFirstOccurrence(channel)).toEqual('SITE.CHANNEL');

    // Handle where pattern doesn't match channel
    expect(stripOutFirstOccurrence(channel, '*')).toEqual(channel);
  });

  test('capital first letters', () => {
    expect(capitalizeFirstLetters('foo was here! * ')).toEqual('Foo Was Here! *');
  });

  test('precision by type', () => {
    // Strings
    expect(determinePrecisionByType(99.919, ValueType.PERCENTAGE, true)).toEqual('99.92');
    expect(determinePrecisionByType(99.919, ValueType.INTEGER, true)).toEqual('100');
    expect(determinePrecisionByType(99.919, ValueType.FLOAT, true)).toEqual('99.92');
    expect(determinePrecisionByType(99.919, undefined, true)).toEqual('99.92');

    // Numbers
    expect(determinePrecisionByType(99.919, ValueType.PERCENTAGE, false)).toEqual(99.92);
    expect(determinePrecisionByType(99.919, ValueType.INTEGER, false)).toEqual(100);
    expect(determinePrecisionByType(99.919, ValueType.FLOAT, false)).toEqual(99.92);
    expect(determinePrecisionByType(99.919, undefined, false)).toEqual(99.92);

    // Handle undefined value and pattern
    expect(determinePrecisionByType(undefined, undefined, false)).toEqual(undefined);
  });
});
