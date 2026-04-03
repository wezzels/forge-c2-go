import { doubleValueSchema, locationSchema } from '../../src/ts/common/schema';
import type { DoubleValue, Location } from '../../src/ts/common/types';
import { Units } from '../../src/ts/common/types';

describe('common-schema', () => {
  describe('locationSchema', () => {
    it('should validate a valid Location object', () => {
      const validLocation: Location = {
        latitudeDegrees: 40.7128,
        longitudeDegrees: -74.006,
        elevationKm: 0.01,
        depthKm: 0.02
      };

      expect(locationSchema.safeParse(validLocation).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidLocation = {
        latitudeDegrees: 40.7128,
        longitudeDegrees: -74.006
        // Missing elevationKm and depthKm
      };

      expect(locationSchema.safeParse(invalidLocation).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidLocation = {
        latitudeDegrees: '40.7128', // latitudeDegrees should be a number
        longitudeDegrees: -74.006,
        elevationKm: 0.01,
        depthKm: 0.02
      };

      expect(locationSchema.safeParse(invalidLocation).success).toBeFalsy();
    });
  });

  describe('doubleValueSchema', () => {
    it('should validate a valid DoubleValue object', () => {
      const validDoubleValue: DoubleValue = {
        value: 1.23,
        standardDeviation: 0.01,
        units: Units.DECIBELS
      };

      expect(doubleValueSchema.safeParse(validDoubleValue).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDoubleValue = {
        // Missing value
        standardDeviation: 0.01,
        units: Units.DECIBELS
      };

      expect(doubleValueSchema.safeParse(invalidDoubleValue).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDoubleValue = {
        value: 1.23,
        standardDeviation: '0.01', // standardDeviation should be a number
        units: Units.DECIBELS
      };

      expect(doubleValueSchema.safeParse(invalidDoubleValue).success).toBeFalsy();
    });

    it('should validate an object without optional fields', () => {
      const validDoubleValue: DoubleValue = {
        value: 1.23,
        units: Units.DECIBELS
      };

      expect(doubleValueSchema.safeParse(validDoubleValue).success).toBeTruthy();
    });
  });
});
