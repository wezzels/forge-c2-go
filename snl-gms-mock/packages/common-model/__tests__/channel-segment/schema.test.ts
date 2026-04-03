import type { ChannelSegmentDescriptor } from '../../src/ts/channel-segment';
import {
  channelSegmentDescriptorSchema,
  fdsnWaveformSchema
} from '../../src/ts/channel-segment/schema';
import { pdarUiChannelSegmentDescriptor } from '../__data__/signal-detections/signal-detection-data';

describe('Channel Segment Schema', () => {
  describe('channelSegmentDescriptorSchema', () => {
    it('should validate a valid ChannelSegmentDescriptor object with full channel', () => {
      const validDescriptor: ChannelSegmentDescriptor = pdarUiChannelSegmentDescriptor;

      expect(channelSegmentDescriptorSchema.safeParse(validDescriptor).success).toBeTruthy();
    });

    it('should validate a valid ChannelSegmentDescriptor object with channel version reference', () => {
      const validDescriptor: ChannelSegmentDescriptor = {
        channel: {
          name: 'Channel1',
          effectiveAt: 1627849200
        },
        startTime: 1627849200,
        endTime: 1627849300,
        creationTime: 1627849400
      };

      expect(channelSegmentDescriptorSchema.safeParse(validDescriptor).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidDescriptor = {
        channel: {
          name: 'Channel1',
          effectiveAt: 1627849200
        },
        startTime: 1627849200
        // Missing endTime and creationTime
      };

      expect(channelSegmentDescriptorSchema.safeParse(invalidDescriptor).success).toBeFalsy();
    });

    it('should invalidate an object with incorrect types', () => {
      const invalidDescriptor = {
        channel: {
          name: 'Channel1',
          effectiveAt: 1627849200
        },
        startTime: '1627849200', // startTime should be a number
        endTime: 1627849300,
        creationTime: 1627849400
      };

      expect(channelSegmentDescriptorSchema.safeParse(invalidDescriptor).success).toBeFalsy();
    });
  });

  describe('FDSN', () => {
    it('should validate a valid empty FDSN waveform', () => {
      expect(
        fdsnWaveformSchema.safeParse({
          data: [],
          channel: 'c',
          station: 's',
          location: 'l',
          storage: 's',
          sampleRate: 0,
          numberOfSamples: 0,
          timestamp: '1627849200',
          network: 'n'
        }).success
      ).toBeTruthy();
    });

    it('should validate a invalid FDSN waveform sample count', () => {
      expect(
        fdsnWaveformSchema.safeParse({
          data: [],
          channel: 'c',
          station: 's',
          location: 'l',
          storage: 's',
          sampleRate: 0,
          numberOfSamples: 10,
          timestamp: '1627849200',
          network: 'n'
        }).success
      ).toBeFalsy();
    });

    it('should validate a invalid FDSN waveform sample rate', () => {
      expect(
        fdsnWaveformSchema.safeParse({
          data: [],
          channel: 'c',
          station: 's',
          location: 'l',
          storage: 's',
          sampleRate: -1,
          numberOfSamples: 0,
          timestamp: '1627849200',
          network: 'n'
        }).success
      ).toBeFalsy();
    });
  });
});
