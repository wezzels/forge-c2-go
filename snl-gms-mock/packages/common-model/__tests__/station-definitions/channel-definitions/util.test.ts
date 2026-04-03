import { UNFILTERED } from '../../../src/ts/filter/types';
import {
  getChannelNameFromModeChannel,
  getFilterNameFromChannelName,
  isFilteredChannelName,
  parseWaveformChannelType
} from '../../../src/ts/station-definitions/channel-definitions/util';

describe('Waveform Utils tests', () => {
  describe('getFilterNameFromChannelName', () => {
    test('defined', () => {
      expect(getFilterNameFromChannelName).toBeDefined();
    });
    test('to give a proper result', () => {
      const testString = '/filter,myFancyTestMatchingString/';
      expect(getFilterNameFromChannelName(testString)).toMatch(`myFancyTestMatchingString`);
    });
    test('to return UNFILTERED if the check for a filter is bad', () => {
      const testString = '/myBadFancyTestMatchingString/';
      expect(getFilterNameFromChannelName(testString)).toMatch(UNFILTERED);
    });
  });
  describe('isFilteredChannelName', () => {
    test('defined', () => {
      expect(isFilteredChannelName).toBeDefined();
    });
    test('to give a proper result', () => {
      const testString = '/filter,myFancyTestMatchingString/';
      expect(isFilteredChannelName(testString)).toBeTruthy();
    });
    test('to return UNFILTERED if the check for a filter is bad', () => {
      const testString = '/myBadFancyTestMatchingString/';
      expect(isFilteredChannelName(testString)).toBeFalsy();
    });
  });

  test('parseBeamType from channel name', () => {
    expect(parseWaveformChannelType(undefined)).toBeUndefined();
    expect(parseWaveformChannelType('foobar')).toBeUndefined();
    expect(parseWaveformChannelType('ASAR.AS01.BHZ')).toEqual('Raw channel');
    let channelName =
      'KSRS.beam.SHZ/beam,fk,coherent/steer,az_104.325deg,slow_13.808s_per_deg/33689b9f-8e74-36a2-a9eb-115ade4d6d9a';
    expect(parseWaveformChannelType(channelName)).toEqual('Fk beam');
    channelName =
      'KSRS.beam.SHZ/beam,event,coherent/steer,az_104.325deg,slow_13.808s_per_deg/33689b9f-8e74-36a2-a9eb-115ade4d6d9a';
    expect(parseWaveformChannelType(channelName)).toEqual('Event beam');
    channelName =
      'KSRS.beam.SHZ/beam,detection,coherent/steer,az_104.325deg,slow_13.808s_per_deg/33689b9f-8e74-36a2-a9eb-115ade4d6d9a';
    expect(parseWaveformChannelType(channelName)).toEqual('Detection beam');
    channelName = 'KSRS.temp.---';
    expect(parseWaveformChannelType(channelName)).toEqual('N/A');
    channelName =
      'KSRS.beam.SHZ/beam,foobar,coherent/steer,az_104.325deg,slow_13.808s_per_deg/33689b9f-8e74-36a2-a9eb-115ade4d6d9a';
    expect(parseWaveformChannelType(channelName)).toBeUndefined();
    expect(parseWaveformChannelType('KSRS.beam.SHZ/')).toBeUndefined();
  });

  test('getChannelNameFromModeChannel', () => {
    expect(
      getChannelNameFromModeChannel(
        'TEST.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/823c7098394f1a45647698832309aef2d7abfd6e676b8380a48e2a9165d7efd2.individual.1727357072.3561727357372.331'
      )
    ).toEqual(
      'TEST.beam.BHZ/beam,fk,coherent/steer,az_206.436deg,slow_10.855s_per_deg/823c7098394f1a45647698832309aef2d7abfd6e676b8380a48e2a9165d7efd2'
    );
    expect(
      getChannelNameFromModeChannel(
        'TEST.beam.BHZ/beam,amplitude,coherent/steer,backaz_206.436deg,slow_10.855s_per_deg/b56ce053a741f82c982a642a1341a05e2d25dd21c8e6fdf77b4c0247fe828159.measurement.d681ca4d-fb12-3221-bb65-4fd4288617f2'
      )
    ).toEqual(
      'TEST.beam.BHZ/beam,amplitude,coherent/steer,backaz_206.436deg,slow_10.855s_per_deg/b56ce053a741f82c982a642a1341a05e2d25dd21c8e6fdf77b4c0247fe828159'
    );
    expect(getChannelNameFromModeChannel('TEST.beam.BHZ')).toEqual('TEST.beam.BHZ');
  });
});
