import type {
  ChannelSegmentClaim,
  ChannelSegmentDescriptor
} from '../../../src/ts/channel-segment';
import { TimeseriesType } from '../../../src/ts/channel-segment';
import type { Units } from '../../../src/ts/common';
import type { FkFrequencyPreview, FkSpectraClaimCheck, FkSpectraCOI } from '../../../src/ts/fk';
import type { SignalDetection } from '../../../src/ts/signal-detection';
import {
  findAzimuthFeatureMeasurement,
  getCurrentHypothesis
} from '../../../src/ts/signal-detection/util';
import { getTestFkSpectraClaimCheck } from './fk-spectra';

export const fkChannelSegmentDescriptor: ChannelSegmentDescriptor = {
  channel: {
    effectiveAt: 1677974400,
    name: 'ASAR.fk.SHZ/cc6456be8447ec0108077f78b8d73dab3b3059b8edcc6d104f998716a83ba5b3'
  },
  startTime: 1678203144.708,
  endTime: 1678203144.708,
  creationTime: 1678210073.631
};

/**
 * Base object for creating an FkChannelSegment claim check. timeseries and missingInputChannels are not included.
 */
const baseFkChannelSegment = {
  maskedBy: [],
  units: 'NANOMETERS_SQUARED_PER_SECOND' as Units.NANOMETERS_SQUARED_PER_SECOND,
  timeseriesType: TimeseriesType.FK_SPECTRA,
  id: fkChannelSegmentDescriptor
};

export const getTestFkChannelSegment = (
  sd: SignalDetection
): ChannelSegmentClaim<FkSpectraCOI, FkSpectraClaimCheck> => {
  const sdHypo = getCurrentHypothesis(sd.signalDetectionHypotheses);
  const azFm = findAzimuthFeatureMeasurement(sdHypo.featureMeasurements);
  const testFkSpectraClaimCheck = getTestFkSpectraClaimCheck();

  return {
    id: azFm?.measuredChannelSegment ? azFm.measuredChannelSegment.id : baseFkChannelSegment.id,
    maskedBy: baseFkChannelSegment.maskedBy,
    units: baseFkChannelSegment.units,
    timeseriesType: baseFkChannelSegment.timeseriesType,
    timeseries: testFkSpectraClaimCheck,
    missingInputChannels: {
      claimCheckType: 'missingInputChannels',
      id: testFkSpectraClaimCheck.id
    }
  };
};

export const getTestFkFrequencyPreviewRecord = (
  sds: SignalDetection[]
): Record<SignalDetection['id'], FkFrequencyPreview[]> => {
  const record = {};
  sds.forEach(sd => {
    const testFkSpectraClaimCheck = getTestFkSpectraClaimCheck();
    const freqThumbnail: FkFrequencyPreview = {
      frequencyBand: {
        lowFrequencyHz:
          testFkSpectraClaimCheck.configuration.fkSpectraParameters.fkFrequencyRange.lowFrequencyHz,
        highFrequencyHz:
          testFkSpectraClaimCheck.configuration.fkSpectraParameters.fkFrequencyRange.highFrequencyHz
      },
      fkSpectra: testFkSpectraClaimCheck
    };
    record[sd.id] = [freqThumbnail];
  });
  return record;
};
