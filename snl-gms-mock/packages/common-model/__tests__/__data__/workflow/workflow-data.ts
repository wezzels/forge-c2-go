import { WorkflowTypes } from '../../../src/ts/common-model';
import { WaveformMode } from '../../../src/ts/ui-configuration/types';
import { asarAS01Channel } from '../station-definitions';

const iaStage: WorkflowTypes.InteractiveAnalysisStage = {
  name: 'name',
  mode: WorkflowTypes.StageMode.INTERACTIVE,
  duration: 50,
  activities: [
    {
      activityId: { name: 'name' },
      analysisActivity: WorkflowTypes.AnalysisActivity.EVENT_REVIEW
    }
  ]
};

const autoStage: WorkflowTypes.AutomaticProcessingStage = {
  name: 'name',
  mode: WorkflowTypes.StageMode.AUTOMATIC,
  duration: 5000,
  sequences: [
    {
      name: 'name',
      steps: []
    }
  ]
};

export const workflow: WorkflowTypes.Workflow = {
  name: 'workflow',
  stages: [iaStage, autoStage]
};

/**
 * Mock data that matches what might be returned by the stageIntervalsByIdAndTime query.
 * Note that the type returned by that query is not the superset of all possible types that
 * will get returned in reality, and so we use the specific type that is what matches the
 * actual return value, rather than the defined return type from that query.
 */
export const stageIntervals: {
  name: string;
  value: WorkflowTypes.InteractiveAnalysisStageInterval[];
}[] = [
  {
    name: 'AL1',
    value: [
      {
        stageMode: WorkflowTypes.StageMode.INTERACTIVE,
        activityIntervals: [
          {
            activeAnalystIds: ['TestUser'],
            stageIntervalId: {
              definitionId: { name: 'AL1 Event Review' },
              startTime: 0
            },
            comments: [],
            processingStartTime: 1669158900,
            status: WorkflowTypes.IntervalStatus.IN_PROGRESS,
            intervalId: {
              startTime: 1669150800,
              definitionId: {
                name: 'AL1 Event Review'
              }
            },
            modificationTime: 1669152441.906,
            endTime: 1669154400,
            processingEndTime: 1669151100,
            percentAvailable: 1,
            storageTime: 1669152441.906,
            completedAnalystId: '',
            reservedAnalystId: ''
          },
          {
            activeAnalystIds: ['TestUser2'],
            stageIntervalId: {
              definitionId: { name: 'AL1 Scan' },
              startTime: 0
            },
            completedAnalystId: '',
            reservedAnalystId: '',
            comments: [],
            processingStartTime: 1669158900,
            status: WorkflowTypes.IntervalStatus.IN_PROGRESS,
            intervalId: {
              startTime: 1669150800,
              definitionId: {
                name: 'AL1 Scan'
              }
            },
            modificationTime: 1669152441.906,
            endTime: 1669154400,
            processingEndTime: 1669151100,
            percentAvailable: 1,
            storageTime: 1669152441.906
          }
        ],
        comments: [],
        processingStartTime: 1669158900,
        status: WorkflowTypes.IntervalStatus.IN_PROGRESS,
        intervalId: {
          startTime: 1669150800,
          definitionId: {
            name: 'AL1'
          }
        },
        modificationTime: 1669152441.906,
        endTime: 1669154400,
        processingEndTime: 1669151100,
        percentAvailable: 1,
        storageTime: 1669152441.906
      },
      {
        stageMode: WorkflowTypes.StageMode.INTERACTIVE,
        activityIntervals: [
          {
            activeAnalystIds: ['TestUser'],
            stageIntervalId: {
              definitionId: { name: 'AL1 Event Review' },
              startTime: 0
            },
            completedAnalystId: '',
            reservedAnalystId: '',
            comments: [],
            processingStartTime: 1669089900,
            status: WorkflowTypes.IntervalStatus.COMPLETE,
            intervalId: {
              startTime: 1669089600,
              definitionId: {
                name: 'AL1 Event Review'
              }
            },
            modificationTime: 1669089900,
            endTime: 1669093200,
            processingEndTime: 1669089900,
            percentAvailable: 1,
            storageTime: 1669089900
          },
          {
            activeAnalystIds: [],
            stageIntervalId: {
              definitionId: { name: 'AL1 Scan' },
              startTime: 0
            },
            completedAnalystId: '',
            reservedAnalystId: '',
            comments: [],
            processingStartTime: 1669089900,
            status: WorkflowTypes.IntervalStatus.COMPLETE,
            intervalId: {
              startTime: 1669089600,
              definitionId: {
                name: 'AL1 Scan'
              }
            },
            modificationTime: 1669089900,
            endTime: 1669093200,
            processingEndTime: 1669089900,
            percentAvailable: 1,
            storageTime: 1669089900
          }
        ],
        comments: [],
        processingStartTime: 1669089900,
        status: WorkflowTypes.IntervalStatus.COMPLETE,
        intervalId: {
          startTime: 1669089600,
          definitionId: {
            name: 'AL1'
          }
        },
        modificationTime: 1669089900,
        endTime: 1669093200,
        processingEndTime: 1669089900,
        percentAvailable: 1,
        storageTime: 1669089900
      }
    ]
  }
];

export const scanActivityDefinition: WorkflowTypes.ScanActivityDefinition = {
  activityId: {
    name: 'AL1 Alaska'
  },
  defaultAnalysisMode: WorkflowTypes.AnalysisMode.WAVEFORM_SCAN,
  defaultPhase: 'P',
  defaultWaveformMode: WaveformMode.Individual,
  filterList: 'Seismic',
  stationGroup: {
    name: 'Primary',
    description: 'hello',
    effectiveAt: 7892345
  },
  geographicRegionName: 'Alaska',
  defaultScanTimeRange: 600,
  rawChannelsVisibleForStation: { ASAR: [asarAS01Channel] },
  virtualEventHypocenter: {
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    depthKm: 0
  }
};

export const activityDefinitions: Record<string, WorkflowTypes.ActivityDefinition> = {
  'AL2 Event Review': {
    activityId: {
      name: 'AL2 Event Review'
    },
    defaultAnalysisMode: WorkflowTypes.AnalysisMode.EVENT_REVIEW,
    defaultPhase: 'LR',
    defaultWaveformMode: WaveformMode.Overlay,
    filterList: 'Long Period',
    stationGroup: {
      name: 'Auxiliary',
      description: 'hello',
      effectiveAt: 7892345
    }
  },
  'AL1 Event Review': {
    activityId: {
      name: 'AL1 Event Review'
    },
    defaultAnalysisMode: WorkflowTypes.AnalysisMode.EVENT_REVIEW,
    defaultPhase: 'P',
    defaultWaveformMode: WaveformMode.Overlay,
    filterList: 'Seismic',
    stationGroup: {
      name: 'Primary',
      description: 'hello',
      effectiveAt: 7892345
    }
  },
  'AL1 Alaska': scanActivityDefinition
};
