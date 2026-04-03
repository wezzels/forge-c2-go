import { BandType, FilterType, LinearFilterType } from '../../src/ts/filter';
import type {
  AzimuthSlownessDisplayLayout,
  DualDisplayLayout,
  EventDisplayLayout,
  GlobalPreferences,
  LocationDisplayLayout,
  MapDisplaySettings,
  SignalDetectionDisplayLayout,
  StationVisibilityList,
  UiUserPreferences,
  UserLayout,
  UserProfile,
  WaveformDisplayLayout,
  WorkspaceLayout
} from '../../src/ts/user-profile';
import {
  azimuthSlownessDisplayLayoutSchema,
  eventDisplayLayoutSchema,
  globalPreferencesSchema,
  locationDisplayLayoutSchema,
  mapDisplaySettingsSchema,
  signalDetectionDisplayLayoutSchema,
  stationPropertiesDisplayLayoutSchema,
  stationVisibilityListSchema,
  uiUserPreferencesSchema,
  userLayoutSchema,
  userProfileSchema,
  waveformDisplayLayoutSchema,
  workspaceLayoutSchema
} from '../../src/ts/user-profile';
import {
  uiUserPreferencesData,
  workspaceLayoutsData
} from '../__data__/user-profile/ui-user-preferences-data';
import { expectSafeParseFailure } from '../test-util/zod-util';

describe('User Profile Schema', () => {
  describe('userLayoutSchema', () => {
    it('should validate a valid UserLayout object', () => {
      const validLayout: UserLayout = {
        name: 'DefaultLayout',
        layoutConfiguration: 'some-encoded-json'
      };

      expect(userLayoutSchema.safeParse(validLayout).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidLayout = {
        layoutConfiguration: 'some-encoded-json'
        // Missing name
      };

      expect(userLayoutSchema.safeParse(invalidLayout).success).toBeFalsy();
    });

    it('should invalidate an object with deprecated properties', () => {
      const invalidLayout = {
        name: 'DefaultLayout',
        supportedUserInterfaceModes: ['IAN'], // supportedUserInterfaceModes is invalid/no longer in the COI
        layoutConfiguration: 'some-encoded-json'
      };

      expect(userLayoutSchema.safeParse(invalidLayout).success).toBeFalsy();
    });
  });

  describe('userProfileSchema', () => {
    it('should validate a valid UserProfile object', () => {
      const validProfile: UserProfile = {
        userId: 'user123',
        userPreferences: uiUserPreferencesData
      };

      expect(userProfileSchema.safeParse(validProfile).success).toBeTruthy();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidProfile = {
        userId: 'user123',
        defaultAnalystLayoutName: 'DefaultAnalystLayout'
        // Missing workspaceLayouts, and preferences
      };

      expect(userProfileSchema.safeParse(invalidProfile).success).toBeFalsy();
    });

    it('should invalidate an object with deprecated properties', () => {
      const invalidProfile = {
        userId: 'user123',
        defaultAnalystLayoutName: 'DefaultAnalystLayout',
        workspaceLayouts: [
          {
            name: 'DefaultLayout',
            supportedUserInterfaceModes: ['IAN'], // supportedUserInterfaceModes is invalid/no longer in the COI
            layoutConfiguration: 'some-encoded-json'
          }
        ],
        preferences: uiUserPreferencesData
      };

      expect(userProfileSchema.safeParse(invalidProfile).success).toBeFalsy();
    });

    it('should invalidate an object with a high frequency that is lower than the low frequency', () => {
      const userPreferences: UiUserPreferences = {
        ...uiUserPreferencesData,
        customFilterList: {
          name: 'Custom Filters',
          defaultFilterIndex: 0,
          filters: [
            {
              _uiIsError: false,
              filterDefinition: {
                name: 'Invalid band reject',
                comments: 'highFrequencyHz is lower than lowFrequencyHz...',
                filterDescription: {
                  filterType: FilterType.LINEAR,
                  causal: true,
                  correctGroupDelay: false,
                  linearFilterType: LinearFilterType.IIR_BUTTERWORTH,
                  order: 3,
                  passBandType: BandType.BAND_REJECT,
                  zeroPhase: false,
                  comments: 'highFrequencyHz is lower than lowFrequencyHz...',
                  highFrequencyHz: 0.1,
                  lowFrequencyHz: 1
                }
              },
              withinHotKeyCycle: false
            }
          ]
        }
      };
      const invalidProfile: UserProfile = {
        userId: 'user123',
        userPreferences
      };

      expect(userProfileSchema.safeParse(invalidProfile).success).toBeFalsy();

      const result = userProfileSchema.safeParse(invalidProfile);

      expectSafeParseFailure(result);
      expect(result.error.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'custom',
            message: 'highFrequencyHz is not greater than lowFrequencyHz',
            path: [
              'userPreferences',
              'customFilterList',
              'filters',
              0,
              'filterDefinition',
              'filterDescription',
              'highFrequencyHz'
            ]
          })
        ])
      );
    });
  });
});

describe('UiUserPreferences schema', () => {
  describe('azimuthSlownessDisplayLayoutSchema', () => {
    const validAzimuthSlownessDisplayLayout: AzimuthSlownessDisplayLayout =
      uiUserPreferencesData.displayLayouts['azimuth-slowness'];

    it('valid schema', () => {
      expect(
        azimuthSlownessDisplayLayoutSchema.safeParse(validAzimuthSlownessDisplayLayout).success
      ).toBeTruthy();
    });

    it('invalid columnOrder', () => {
      const invalidAzimuthSlownessDisplayLayout: AzimuthSlownessDisplayLayout = {
        ...validAzimuthSlownessDisplayLayout,
        columnOrder: ['residual', 'foo']
      };

      expect(
        azimuthSlownessDisplayLayoutSchema.safeParse(invalidAzimuthSlownessDisplayLayout).success
      ).toBeFalsy();

      expect(() => azimuthSlownessDisplayLayoutSchema.parse(invalidAzimuthSlownessDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid FK Properties table column values in column order list",
            "path": [
              "columnOrder"
            ]
          }
        ]"
      `);
    });
  });

  describe('eventDisplayLayoutSchema', () => {
    const validEventDisplayLayout: EventDisplayLayout = uiUserPreferencesData.displayLayouts.events;
    it('valid schema', () => {
      expect(eventDisplayLayoutSchema.safeParse(validEventDisplayLayout).success).toBeTruthy();
    });

    it('invalid columnVisibility', () => {
      const invalidEventDisplayLayout: EventDisplayLayout = {
        ...validEventDisplayLayout,
        columnVisibility: { depth: true, foo: true }
      };

      expect(eventDisplayLayoutSchema.safeParse(invalidEventDisplayLayout).success).toBeFalsy();

      expect(() => eventDisplayLayoutSchema.parse(invalidEventDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Events Display table column values in visible column list",
            "path": [
              "columnVisibility"
            ]
          }
        ]"
      `);
    });

    it('invalid columnOrder', () => {
      const invalidEventDisplayLayout: EventDisplayLayout = {
        ...validEventDisplayLayout,
        columnOrder: ['depth', 'foo']
      };

      expect(eventDisplayLayoutSchema.safeParse(invalidEventDisplayLayout).success).toBeFalsy();

      expect(() => eventDisplayLayoutSchema.parse(invalidEventDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Events Display table column values in column order list",
            "path": [
              "columnOrder"
            ]
          }
        ]"
      `);
    });
    it('invalid columnWidths', () => {
      const invalidEventDisplayLayout: EventDisplayLayout = {
        ...validEventDisplayLayout,
        columnWidths: { depth: 10, foo: 15 }
      };

      expect(eventDisplayLayoutSchema.safeParse(invalidEventDisplayLayout).success).toBeFalsy();

      expect(() => eventDisplayLayoutSchema.parse(invalidEventDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Events Display table column values in column width map",
            "path": [
              "columnWidths"
            ]
          }
        ]"
      `);
    });
  });

  describe('signalDetectionDisplayLayoutSchema', () => {
    const validSignalDetectionDisplayLayout: SignalDetectionDisplayLayout =
      uiUserPreferencesData.displayLayouts['signal-detections-list'];

    it('valid schema', () => {
      expect(
        signalDetectionDisplayLayoutSchema.safeParse(validSignalDetectionDisplayLayout).success
      ).toBeTruthy();
    });

    it('invalid columnVisibility', () => {
      const invalidSignalDetectionDisplayLayout: SignalDetectionDisplayLayout = {
        ...validSignalDetectionDisplayLayout,
        columnVisibility: { depth: true, foo: true }
      };

      expect(
        signalDetectionDisplayLayoutSchema.safeParse(invalidSignalDetectionDisplayLayout).success
      ).toBeFalsy();

      expect(() => signalDetectionDisplayLayoutSchema.parse(invalidSignalDetectionDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Signal Detections List Display table column values in visible column list",
            "path": [
              "columnVisibility"
            ]
          }
        ]"
      `);
    });

    it('invalid columnOrder', () => {
      const invalidSignalDetectionDisplayLayout: SignalDetectionDisplayLayout = {
        ...validSignalDetectionDisplayLayout,
        columnOrder: ['depth', 'foo']
      };

      expect(
        signalDetectionDisplayLayoutSchema.safeParse(invalidSignalDetectionDisplayLayout).success
      ).toBeFalsy();

      expect(() => signalDetectionDisplayLayoutSchema.parse(invalidSignalDetectionDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Signal Detections List Display table column values in column order list",
            "path": [
              "columnOrder"
            ]
          }
        ]"
      `);
    });
    it('invalid columnWidths', () => {
      const invalidSignalDetectionDisplayLayout: SignalDetectionDisplayLayout = {
        ...validSignalDetectionDisplayLayout,
        columnWidths: { depth: 10, foo: 15 }
      };

      expect(
        signalDetectionDisplayLayoutSchema.safeParse(invalidSignalDetectionDisplayLayout).success
      ).toBeFalsy();

      expect(() => signalDetectionDisplayLayoutSchema.parse(invalidSignalDetectionDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Signal Detections List Display table column values in column width map",
            "path": [
              "columnWidths"
            ]
          }
        ]"
      `);
    });
  });

  describe('locationDisplayLayoutSchema', () => {
    const validLocationDisplayLayout: LocationDisplayLayout =
      uiUserPreferencesData.displayLayouts.location;

    it('valid schema', () => {
      expect(
        locationDisplayLayoutSchema.safeParse(validLocationDisplayLayout).success
      ).toBeTruthy();
    });

    it('invalid columnVisibility, columnOrder, and columnWidths for both displays', () => {
      const invalidLocationDisplayLayout: DualDisplayLayout = {
        ...validLocationDisplayLayout,
        displayOne: {
          columnVisibility: { foo: true },
          pinnedColumns: {},
          columnOrder: ['foo'],
          columnWidths: { foo: 10 }
        },
        displayTwo: {
          columnVisibility: { bar: true },
          pinnedColumns: {},
          columnOrder: ['bar'],
          columnWidths: { bar: 10 }
        }
      };

      expect(
        locationDisplayLayoutSchema.safeParse(invalidLocationDisplayLayout).success
      ).toBeFalsy();

      expect(() => locationDisplayLayoutSchema.parse(invalidLocationDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "unrecognized_keys",
            "keys": [
              "pinnedColumns"
            ],
            "path": [
              "displayTwo"
            ],
            "message": "Unrecognized key(s) in object: 'pinnedColumns'"
          },
          {
            "code": "custom",
            "message": "Invalid Location History table column values in visible column list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Location History table column values in column order list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Location History table column values in column width map",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Location Association table column values in visible column list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Location Association table column values in column order list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Location Association table column values in column width map",
            "path": []
          }
        ]"
      `);
    });
  });

  describe('stationPropertiesDisplayLayoutSchema', () => {
    const validStationPropertiesDisplayLayout: DualDisplayLayout =
      uiUserPreferencesData.displayLayouts['station-properties'];

    it('valid schema', () => {
      expect(
        stationPropertiesDisplayLayoutSchema.safeParse(validStationPropertiesDisplayLayout).success
      ).toBeTruthy();
    });

    it('invalid columnVisibility, columnOrder, and columnWidths for both displays', () => {
      const invalidStationPropertiesDisplayLayout: DualDisplayLayout = {
        ...validStationPropertiesDisplayLayout,
        displayOne: {
          columnVisibility: { foo: true },
          pinnedColumns: {},
          columnOrder: ['foo'],
          columnWidths: { foo: 10 }
        },
        displayTwo: {
          columnVisibility: { bar: true },
          pinnedColumns: {},
          columnOrder: ['bar'],
          columnWidths: { bar: 10 }
        }
      };

      expect(
        stationPropertiesDisplayLayoutSchema.safeParse(invalidStationPropertiesDisplayLayout)
          .success
      ).toBeFalsy();

      expect(() =>
        stationPropertiesDisplayLayoutSchema.parse(invalidStationPropertiesDisplayLayout)
      ).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Channel Group table column values in visible column list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Channel Group table column values in column order list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Channel Group table column values in column width map",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Channel Configuration table column values in visible column list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Channel Configuration table column values in column order list",
            "path": []
          },
          {
            "code": "custom",
            "message": "Invalid Channel Configuration table column values in column width map",
            "path": []
          }
        ]"
      `);
    });
  });

  describe('waveformDisplayLayoutSchema', () => {
    const validWaveformDisplayLayout: WaveformDisplayLayout =
      uiUserPreferencesData.waveformDisplayLayout;

    it('valid schema', () => {
      expect(
        waveformDisplayLayoutSchema.safeParse(validWaveformDisplayLayout).success
      ).toBeTruthy();
    });

    it('invalid visibleSignalDetections', () => {
      const invalidWaveformDisplayLayout: WaveformDisplayLayout = {
        ...validWaveformDisplayLayout,
        visibleSignalDetections: { foo: true }
      };

      expect(
        waveformDisplayLayoutSchema.safeParse(invalidWaveformDisplayLayout).success
      ).toBeFalsy();
      expect(() => waveformDisplayLayoutSchema.parse(invalidWaveformDisplayLayout))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid Displayed Signal Detection configuration in Waveform Display visible signal detection configuration",
            "path": [
              "visibleSignalDetections"
            ]
          }
        ]"
      `);
    });
  });

  it('stationVisibilityListSchema', () => {
    const validStationVisibilityList: StationVisibilityList = {
      name: 'Test Station Visibility List',
      stations: [{ name: 'Test Station' }]
    };

    expect(stationVisibilityListSchema.safeParse(validStationVisibilityList).success).toBeTruthy();
  });

  it('workspaceLayoutSchema', () => {
    const validWorkspaceLayout: WorkspaceLayout = workspaceLayoutsData[0];

    expect(workspaceLayoutSchema.safeParse(validWorkspaceLayout).success).toBeTruthy();
  });

  it('globalPreferencesSchema', () => {
    const validGlobalPreferences: GlobalPreferences = uiUserPreferencesData.globalPreferences;

    expect(globalPreferencesSchema.safeParse(validGlobalPreferences).success).toBeTruthy();
  });

  describe('mapDisplaySettingsSchema', () => {
    const validMapDisplaySettings: MapDisplaySettings = uiUserPreferencesData.mapDisplaySettings;

    it('valid schema', () => {
      expect(mapDisplaySettingsSchema.safeParse(validMapDisplaySettings).success).toBeTruthy();
    });

    it('invalid visibleSignalDetections', () => {
      const invalidMapDisplaySettings: MapDisplaySettings = {
        ...validMapDisplaySettings,
        layerVisibility: { foo: true }
      };

      expect(mapDisplaySettingsSchema.safeParse(invalidMapDisplaySettings).success).toBeFalsy();
      expect(() => mapDisplaySettingsSchema.parse(invalidMapDisplaySettings))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Invalid layer visibility values in map display settings",
            "path": [
              "layerVisibility"
            ]
          }
        ]"
      `);
    });
  });

  it('uiUserPreferencesSchema', () => {
    const validUiUserPreferences: UiUserPreferences = uiUserPreferencesData;

    expect(uiUserPreferencesSchema.safeParse(validUiUserPreferences).success).toBeTruthy();
  });
});
