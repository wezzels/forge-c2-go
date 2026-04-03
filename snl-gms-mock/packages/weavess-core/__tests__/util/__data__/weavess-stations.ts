import type { Station } from '../../../src/ts/types';
import { DistanceUnits, LineStyle } from '../../../src/ts/types';
import { WeavessTypes } from '../../../src/ts/weavess-core';

export const stations: Station[] = [
  {
    id: 'AKASG',
    name: 'AKASG',
    distance: 0,
    distanceUnits: DistanceUnits.Degrees,
    defaultChannels: [
      {
        id: 'AKASG',
        name: 'name',
        isSelected: false,
        height: 24.8,
        timeOffsetSeconds: 0,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {
            Unfiltered: [
              {
                configuredInputName:
                  '{"channel":{"name":"AKASG.beam.BHZ/beam,fk,coherent/steer,az_183.370deg,slow_6.976s_per_deg/29c996d7a77486a61cf974acb6d1ae2f717768b2ca32ff4573159c089d4e9e5c","effectiveAt":1696951279.45},"startTime":1696951279.45,"endTime":1696951579.425,"creationTime":1696951279.45}',
                channelName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_183.370deg,slow_6.976s_per_deg/29c996d7a77486a61cf974acb6d1ae2f717768b2ca32ff4573159c089d4e9e5c',
                wfFilterId: 'Unfiltered',
                isSelected: false,
                description: 'Unfiltered',
                descriptionLabelColor: '#f5f8fa',
                dataSegments: [
                  {
                    displayType: [WeavessTypes.DisplayType.LINE],
                    color: '#4580e6',
                    pointSize: 1,
                    data: {
                      startTimeSecs: 1696951279.45,
                      endTimeSecs: 1696951579.425,
                      sampleRate: 40,
                      id: '{"domain":{"startTimeSecs":1696950000,"endTimeSecs":1696953600},"id":{"channel":{"effectiveAt":1696951279.45,"name":"AKASG.beam.BHZ/beam,fk,coherent/steer,az_183.370deg,slow_6.976s_per_deg/29c996d7a77486a61cf974acb6d1ae2f717768b2ca32ff4573159c089d4e9e5c"},"startTime":1696951279.45,"endTime":1696951579.425,"creationTime":1696951279.45},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1696951279.45,"endTime":1696951579.425,"sampleCount":12000,"sampleRateHz":40}}',
                      domainTimeRange: {
                        startTimeSecs: 1696950000,
                        endTimeSecs: 1696953600
                      },
                      values: []
                    }
                  }
                ],
                units: 'NANOMETERS',
                timeseriesType: 'WAVEFORM'
              },
              {
                configuredInputName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_177.922deg,slow_9.413s_per_deg/6e4b3e5a2b63c3cbd569e364df3b05425dbb1821c8c583ba972da0fbfb2de1d7',
                channelName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_177.922deg,slow_9.413s_per_deg/6e4b3e5a2b63c3cbd569e364df3b05425dbb1821c8c583ba972da0fbfb2de1d7',
                wfFilterId: 'Unfiltered',
                isSelected: false,
                description: 'Unfiltered',
                descriptionLabelColor: '#f5f8fa',
                dataSegments: [
                  {
                    displayType: [WeavessTypes.DisplayType.LINE],
                    color: '#4580e6',
                    pointSize: 1,
                    data: {
                      startTimeSecs: 1696954290.675,
                      endTimeSecs: 1696954590.65,
                      sampleRate: 40,
                      id: '{"domain":{"startTimeSecs":1696950000,"endTimeSecs":1696953600},"id":{"channel":{"effectiveAt":1696954290.675,"name":"AKASG.beam.BHZ/beam,fk,coherent/steer,az_177.922deg,slow_9.413s_per_deg/6e4b3e5a2b63c3cbd569e364df3b05425dbb1821c8c583ba972da0fbfb2de1d7"},"startTime":1696954290.675,"endTime":1696954590.65,"creationTime":1696954290.675},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1696954290.675,"endTime":1696954590.65,"sampleCount":12000,"sampleRateHz":40}}',
                      domainTimeRange: {
                        startTimeSecs: 1696950000,
                        endTimeSecs: 1696953600
                      },
                      values: []
                    }
                  }
                ],
                units: 'NANOMETERS',
                timeseriesType: 'WAVEFORM'
              },
              {
                configuredInputName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_36.958deg,slow_3.440s_per_deg/e7834155029d2a0c57c3b0396070ab04fc33e84d728a894a451f1409e5a4cc08',
                channelName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_36.958deg,slow_3.440s_per_deg/e7834155029d2a0c57c3b0396070ab04fc33e84d728a894a451f1409e5a4cc08',
                wfFilterId: 'Unfiltered',
                isSelected: false,
                description: 'Unfiltered',
                descriptionLabelColor: '#f5f8fa',
                dataSegments: [
                  {
                    displayType: [WeavessTypes.DisplayType.LINE],
                    color: '#4580e6',
                    pointSize: 1,
                    data: {
                      startTimeSecs: 1696954425.95,
                      endTimeSecs: 1696954725.925,
                      sampleRate: 40,
                      id: '{"domain":{"startTimeSecs":1696950000,"endTimeSecs":1696953600},"id":{"channel":{"effectiveAt":1696954425.95,"name":"AKASG.beam.BHZ/beam,fk,coherent/steer,az_36.958deg,slow_3.440s_per_deg/e7834155029d2a0c57c3b0396070ab04fc33e84d728a894a451f1409e5a4cc08"},"startTime":1696954425.95,"endTime":1696954725.925,"creationTime":1696954425.95},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1696954425.95,"endTime":1696954725.925,"sampleCount":12000,"sampleRateHz":40}}',
                      domainTimeRange: {
                        startTimeSecs: 1696950000,
                        endTimeSecs: 1696953600
                      },
                      values: []
                    }
                  }
                ],
                units: 'NANOMETERS',
                timeseriesType: 'WAVEFORM'
              },
              {
                configuredInputName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_21.481deg,slow_5.853s_per_deg/fd812051f929567ff5ed6b96613a2930e309578d55b571ceaf8fc3f39557bc0e',
                channelName:
                  'AKASG.beam.BHZ/beam,fk,coherent/steer,az_21.481deg,slow_5.853s_per_deg/fd812051f929567ff5ed6b96613a2930e309578d55b571ceaf8fc3f39557bc0e',
                wfFilterId: 'Unfiltered',
                isSelected: false,
                description: 'Unfiltered',
                descriptionLabelColor: '#f5f8fa',
                dataSegments: [
                  {
                    displayType: [WeavessTypes.DisplayType.LINE],
                    color: '#4580e6',
                    pointSize: 1,
                    data: {
                      startTimeSecs: 1696953472.775,
                      endTimeSecs: 1696953772.75,
                      sampleRate: 40,
                      id: '{"domain":{"startTimeSecs":1696950000,"endTimeSecs":1696953600},"id":{"channel":{"effectiveAt":1696953472.775,"name":"AKASG.beam.BHZ/beam,fk,coherent/steer,az_21.481deg,slow_5.853s_per_deg/fd812051f929567ff5ed6b96613a2930e309578d55b571ceaf8fc3f39557bc0e"},"startTime":1696953472.775,"endTime":1696953772.75,"creationTime":1696953472.775},"type":"WAVEFORM","filter":"Unfiltered","waveform":{"type":"WAVEFORM","startTime":1696953472.775,"endTime":1696953772.75,"sampleCount":12000,"sampleRateHz":40}}',
                      domainTimeRange: {
                        startTimeSecs: 1696950000,
                        endTimeSecs: 1696953600
                      },
                      values: []
                    }
                  }
                ],
                units: 'NANOMETERS',
                timeseriesType: 'WAVEFORM'
              }
            ]
          },
          predictedPhases: [],
          signalDetections: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ],
            selectionWindows: []
          }
        }
      }
    ],
    nonDefaultChannels: [
      {
        id: 'AKASG.AKASG.HHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'AKASG.AKASG.HHN',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'AKASG.AKASG.HHE',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      }
    ],
    areChannelsShowing: true
  },
  {
    id: 'PDAR',
    name: 'PDAR',
    distance: 0,
    distanceUnits: DistanceUnits.Degrees,
    defaultChannels: [
      {
        id: 'PDAR',
        name: 'name',
        isSelected: false,
        height: 24.8,
        timeOffsetSeconds: 0,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          predictedPhases: [],
          signalDetections: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ],
            selectionWindows: []
          }
        }
      }
    ],
    nonDefaultChannels: [
      {
        id: 'PDAR.PD01.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD02.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD03.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD04.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD05.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD06.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD07.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD08.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD09.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD10.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD11.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD12.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD13.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD31.BHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD31.BHN',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD31.BHE',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD32.SHZ',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD32.SHN',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      },
      {
        id: 'PDAR.PD32.SHE',
        name: 'name',
        isSelected: false,
        timeOffsetSeconds: 0,
        height: 24.8,
        waveform: {
          channelSegmentId: 'unfiltered',
          channelSegmentsRecord: {},
          signalDetections: [],
          masks: [],
          markers: {
            verticalMarkers: [
              {
                id: 'startTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274392801
              },
              {
                id: 'endTime',
                color: '#fff',
                lineStyle: LineStyle.SOLID,
                timeSecs: 1274400000
              }
            ]
          }
        }
      }
    ],
    areChannelsShowing: true
  }
];
