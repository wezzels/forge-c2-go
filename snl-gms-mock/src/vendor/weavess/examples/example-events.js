/* eslint-disable @typescript-eslint/no-magic-numbers */
import { UILogger } from '@gms/ui-util';
import { WeavessConstants, WeavessUtil } from '@gms/weavess-core';
import { UNFILTERED } from '@gms/weavess-core/lib/types';
import React from 'react';
import { Weavess } from '../weavess';
import { WeavessGenericContainerWrapper } from './container-wrapper';
const logger = UILogger.create('GMS_LOG_WEAVESS');
export class EventsExample extends React.Component {
    weavess;
    render() {
        const waveforms = [];
        const startTimeSecs = new Date('2016-01-01T00:00:00Z').valueOf() / WeavessConstants.MILLISECONDS_IN_SECOND;
        const endTimeSecs = startTimeSecs + 1800; // + 30 minutes
        for (let i = 0; i < 25; i += 1) {
            const waveform = WeavessUtil.createDummyWaveform({
                channelName: 'ExampleChannel',
                startTimeSecs,
                endTimeSecs,
                sampleRate: 20,
                eventAmplitude: WeavessUtil.getSecureRandomNumber() * 2,
                noiseAmplitude: WeavessUtil.getSecureRandomNumber() * 0.25,
                hasSignalDetections: true,
                hasTheoreticalPhaseWindows: true,
                wfFilterId: UNFILTERED
            });
            waveform.id = `Channel${i}`;
            waveform.name = `Channel ${i}`;
            waveforms.push(waveform);
        }
        return (React.createElement(WeavessGenericContainerWrapper, null,
            React.createElement(Weavess, { ref: ref => {
                    if (ref) {
                        this.weavess = ref;
                    }
                }, activeSplitModeType: undefined, shouldThickenStationBorders: false, stations: waveforms, viewableInterval: {
                    startTimeSecs,
                    endTimeSecs
                }, displayInterval: {
                    startTimeSecs,
                    endTimeSecs
                }, events: {
                    stationEvents: {
                        defaultChannelEvents: {
                            labelEvents: {},
                            events: {
                                onSignalDetectionClick: () => {
                                    logger.debug('signal detection deleted!');
                                },
                                onSignalDetectionDragEnd: () => {
                                    logger.debug('signal detection modified!');
                                }
                            }
                        },
                        nonDefaultChannelEvents: {
                            labelEvents: {},
                            events: {}
                        }
                    }
                }, flex: false })));
    }
}
//# sourceMappingURL=example-events.js.map