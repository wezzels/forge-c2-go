import { z } from 'zod';

import { AllColorMaps } from '../color/types';
import { IanDisplays } from '../displays/types';
import { MagnitudeType } from '../event/types';
import { filterListSchema } from '../filter/schema';
import { FkThumbnailSize } from '../fk/types';
import { stationEntityReferenceSchema } from '../station-definitions';
import type { ToZodSchema } from '../type-util/zod-util';
import { constructZodLiteralUnionType } from '../type-util/zod-util';
import {
  AllClickEventDefinitions,
  AllDoubleClickDefinitions,
  AllDragEventDefinitions,
  AllHotkeyDefinitions,
  AllScrollEventDefinitions
} from '../ui-configuration';
import type {
  AzimuthSlownessDisplayLayout,
  DualDisplayLayout,
  EventDisplayLayout,
  GlobalPreferences,
  LocationDisplayLayout,
  MagnitudeDisplayLayout,
  MapDisplaySettings,
  SignalDetectionDisplayLayout,
  StationVisibilityList,
  TabularDisplayLayout,
  UiUserPreferences,
  UserLayout,
  UserPreferencesKeyboardShortcuts,
  WaveformDisplayLayout,
  WorkspaceLayout
} from './types';
import {
  AllHideEmptyWaveformRows,
  AllNumberVisibleWaveformsOptions,
  ChannelColumn,
  COLUMN_SPACER_PREFIX,
  DisplayedEventsConfigurationEnum,
  DisplayedSignalDetectionConfigurationEnum,
  EventsColumn,
  FkPropertiesColumn,
  LocationHistoryAssociationColumn,
  LocationHistoryColumn,
  MapLayers,
  NetworkMagnitudeColumn,
  SignalDetectionColumn,
  SiteColumn,
  StationMagnitudeColumn,
  WaveformDisplayedSignalDetectionConfigurationEnum
} from './types';

/** A zod schema defining the global application preferences */
export const globalPreferencesSchema = z
  .object({
    /**
     * The name (unique) of the color map that should be used for generating images such as FK spectra
     */
    colorMap: constructZodLiteralUnionType(AllColorMaps.map(literal => z.literal(literal))),

    /**
     * The name (unique) of the UI theme that should be applied to GMS. The theme with this name
     * will be looked up in processing config. If not found, GMS will fall back to the default theme.
     */
    currentTheme: z.string().min(1),

    /**
     * Denotes the conditions for if/when empty waveform rows should be hidden from the UI
     */
    hideEmptyWaveformRows: constructZodLiteralUnionType(
      AllHideEmptyWaveformRows.map(literal => z.literal(literal))
    ),
    numberVisibleWaveformsOption: constructZodLiteralUnionType(
      AllNumberVisibleWaveformsOptions.map(literal => z.literal(literal))
    ),
    customNumberVisibleWaveforms: z.number()
  } satisfies ToZodSchema<GlobalPreferences>)
  .strict()
  .readonly();

/** Schema for {@link MapDisplaySettings} */
export const mapDisplaySettingsSchema = z
  .object({
    /** Denotes if the map is displayed in two dimensions (or three) */
    twoDimensional: z.boolean().readonly(),
    layerVisibility: z.record(z.string(), z.boolean()),
    /**
     * Denotes if the map should only show detections within the visible
     * timerange in relation to the Waveform display
     */
    syncToWaveformDisplayVisibleTimeRange: z.boolean().readonly()
  } satisfies ToZodSchema<MapDisplaySettings>)
  .strict()
  .refine(
    data =>
      Object.values(MapLayers)
        .filter(key => key !== 'events' && key !== 'signalDetections')
        .every(requiredKey => requiredKey in data.layerVisibility),
    () => ({
      message: 'Invalid layer visibility values in map display settings',
      path: ['layerVisibility']
    })
  );

const tabularDisplayLayoutSchema = z
  .object({
    columnVisibility: z.record(z.string(), z.boolean()),
    pinnedColumns: z.record(z.string(), z.union([z.literal('left'), z.literal('right')])),
    columnOrder: z.array(z.string()),
    columnWidths: z.record(z.string(), z.number())
  } satisfies ToZodSchema<TabularDisplayLayout>)
  .strict();

const dualDisplayLayoutSchema = z
  .object({
    displayOne: tabularDisplayLayoutSchema,
    displayTwo: tabularDisplayLayoutSchema
  } satisfies ToZodSchema<DualDisplayLayout>)
  .strict();

/** Zod schema for the {@link AzimuthSlownessDisplayLayout} object */
export const azimuthSlownessDisplayLayoutSchema = z
  .object({
    ...tabularDisplayLayoutSchema.shape,
    thumbnailSize: z.nativeEnum(FkThumbnailSize),
    thumbnailColumnWidth: z.number(),
    fkStepsVisible: z.boolean(),
    fkPreviewsVisible: z.boolean(),
    fkBeamsAndTracesVisible: z.boolean()
  } satisfies ToZodSchema<AzimuthSlownessDisplayLayout>)
  .omit({ columnWidths: true, columnVisibility: true, pinnedColumns: true })
  .strict()
  .refine(
    data =>
      data.columnOrder.every(columnOrderStr => FkPropertiesColumn[columnOrderStr] !== undefined),
    () => ({
      message: 'Invalid FK Properties table column values in column order list',
      path: ['columnOrder']
    })
  );

/** Zod schema for the {@link EventDisplayLayout} object */
export const eventDisplayLayoutSchema = z
  .object({
    ...tabularDisplayLayoutSchema.shape,
    visibleEvents: z.record(z.string(), z.boolean())
  } satisfies ToZodSchema<EventDisplayLayout>)
  .strict()
  .refine(
    data =>
      Object.keys(data.columnVisibility).every(
        visibleColumn => EventsColumn[visibleColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Events Display table column values in visible column list',
      path: ['columnVisibility']
    })
  )
  .refine(
    data =>
      Object.keys(data.pinnedColumns).every(
        pinnedColumn => EventsColumn[pinnedColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Events Display table column values in pinned column list',
      path: ['pinnedColumns']
    })
  )
  .refine(
    data => data.columnOrder.every(columnOrderStr => EventsColumn[columnOrderStr] !== undefined),
    () => ({
      message: 'Invalid Events Display table column values in column order list',
      path: ['columnOrder']
    })
  )
  .refine(
    data =>
      Object.keys(data.columnWidths).every(
        columnWidthKey => EventsColumn[columnWidthKey] !== undefined
      ),
    () => ({
      message: 'Invalid Events Display table column values in column width map',
      path: ['columnWidths']
    })
  )
  .refine(
    data =>
      Object.keys(data.visibleEvents).every(
        visibleEventStr => DisplayedEventsConfigurationEnum[visibleEventStr] !== undefined
      ),
    () => ({
      message: 'Invalid Displayed Events configuration values in visible events map',
      path: ['visibleEvents']
    })
  );

/** Zod schema for the {@link SignalDetectionDisplayLayout} object */
export const signalDetectionDisplayLayoutSchema = z
  .object({
    ...tabularDisplayLayoutSchema.shape,
    visibleSignalDetections: z.record(z.string(), z.boolean())
  } satisfies ToZodSchema<SignalDetectionDisplayLayout>)
  .strict()
  .refine(
    data =>
      Object.keys(data.columnVisibility).every(
        visibleColumn => SignalDetectionColumn[visibleColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Signal Detections List Display table column values in visible column list',
      path: ['columnVisibility']
    })
  )
  .refine(
    data =>
      Object.keys(data.pinnedColumns).every(
        pinnedColumn => SignalDetectionColumn[pinnedColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Signal Detections List Display table column values in pinned column list',
      path: ['pinnedColumns']
    })
  )
  .refine(
    data =>
      data.columnOrder.every(columnOrderStr => SignalDetectionColumn[columnOrderStr] !== undefined),
    () => ({
      message: 'Invalid Signal Detections List Display table column values in column order list',
      path: ['columnOrder']
    })
  )
  .refine(
    data =>
      Object.keys(data.columnWidths).every(
        columnWidthKey => SignalDetectionColumn[columnWidthKey] !== undefined
      ),
    () => ({
      message: 'Invalid Signal Detections List Display table column values in column width map',
      path: ['columnWidths']
    })
  )
  .refine(
    data =>
      Object.keys(data.visibleSignalDetections).every(
        visibleSdStr =>
          DisplayedSignalDetectionConfigurationEnum[visibleSdStr] !== undefined ||
          visibleSdStr === 'syncWaveform'
      ),
    () => ({
      message:
        'Invalid Displayed Signal Detections configuration values in visible signal detections map',
      path: ['visibleSignalDetections']
    })
  );

const LocationHistoryAssociationExtraColumns: string[] = [
  'conflict',
  'isAddedSignalDetection',
  'isDeletedSignalDetection'
] as const;

const NetworkMagnitudeExtraColumns: string[] = [
  `${COLUMN_SPACER_PREFIX}MB`,
  `${COLUMN_SPACER_PREFIX}MB_CODA`,
  `${COLUMN_SPACER_PREFIX}MB_MB`,
  `${COLUMN_SPACER_PREFIX}MB_MLE`,
  `${COLUMN_SPACER_PREFIX}MB_PG`,
  `${COLUMN_SPACER_PREFIX}MB_REL_T`,
  `${COLUMN_SPACER_PREFIX}ML`,
  `${COLUMN_SPACER_PREFIX}MS`,
  `${COLUMN_SPACER_PREFIX}MS_MLE`,
  `${COLUMN_SPACER_PREFIX}MS_VMAX`,
  `${COLUMN_SPACER_PREFIX}MW_CODA`
] as const;

const StationMagnitudeExtraColumns: string[] = [
  `associatedSignalDetections.MB.conflict`,
  `associatedSignalDetections.MB.isAddedSignalDetection`,
  `associatedSignalDetections.MB.isDeletedSignalDetection`,
  `associatedSignalDetections.MB.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MB`,

  `associatedSignalDetections.MB_CODA.conflict`,
  `associatedSignalDetections.MB_CODA.isAddedSignalDetection`,
  `associatedSignalDetections.MB_CODA.isDeletedSignalDetection`,
  `associatedSignalDetections.MB_CODA.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MB_CODA`,

  `associatedSignalDetections.MB_MB.conflict`,
  `associatedSignalDetections.MB_MB.isAddedSignalDetection`,
  `associatedSignalDetections.MB_MB.isDeletedSignalDetection`,
  `associatedSignalDetections.MB_MB.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MB_MB`,

  `associatedSignalDetections.MB_MLE.conflict`,
  `associatedSignalDetections.MB_MLE.isAddedSignalDetection`,
  `associatedSignalDetections.MB_MLE.isDeletedSignalDetection`,
  `associatedSignalDetections.MB_MLE.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MB_MLE`,

  `associatedSignalDetections.MB_PG.conflict`,
  `associatedSignalDetections.MB_PG.isAddedSignalDetection`,
  `associatedSignalDetections.MB_PG.isDeletedSignalDetection`,
  `associatedSignalDetections.MB_PG.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MB_PG`,

  `associatedSignalDetections.MB_REL_T.conflict`,
  `associatedSignalDetections.MB_REL_T.isAddedSignalDetection`,
  `associatedSignalDetections.MB_REL_T.isDeletedSignalDetection`,
  `associatedSignalDetections.MB_REL_T.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MB_REL_T`,

  `associatedSignalDetections.ML.conflict`,
  `associatedSignalDetections.ML.isAddedSignalDetection`,
  `associatedSignalDetections.ML.isDeletedSignalDetection`,
  `associatedSignalDetections.ML.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}ML`,

  `associatedSignalDetections.MS.conflict`,
  `associatedSignalDetections.MS.isAddedSignalDetection`,
  `associatedSignalDetections.MS.isDeletedSignalDetection`,
  `associatedSignalDetections.MS.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MS`,

  `associatedSignalDetections.MS_MLE.conflict`,
  `associatedSignalDetections.MS_MLE.isAddedSignalDetection`,
  `associatedSignalDetections.MS_MLE.isDeletedSignalDetection`,
  `associatedSignalDetections.MS_MLE.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MS_MLE`,

  `associatedSignalDetections.MS_VMAX.conflict`,
  `associatedSignalDetections.MS_VMAX.isAddedSignalDetection`,
  `associatedSignalDetections.MS_VMAX.isDeletedSignalDetection`,
  `associatedSignalDetections.MS_VMAX.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MS_VMAX`,

  `associatedSignalDetections.MW_CODA.conflict`,
  `associatedSignalDetections.MW_CODA.isAddedSignalDetection`,
  `associatedSignalDetections.MW_CODA.isDeletedSignalDetection`,
  `associatedSignalDetections.MW_CODA.needsAmplitudeReview`,
  `${COLUMN_SPACER_PREFIX}MW_CODA`
] as const;

/** Zod schema for the location display object */
export const locationDisplayLayoutSchema = z
  .object({
    displayOne: tabularDisplayLayoutSchema,
    displayTwo: tabularDisplayLayoutSchema.omit({ pinnedColumns: true })
  } satisfies ToZodSchema<LocationDisplayLayout>)
  .strict()
  .refine(
    data =>
      Object.keys(data.displayOne.columnVisibility).every(
        visibleColumn =>
          LocationHistoryColumn[visibleColumn] !== undefined || visibleColumn === 'savePoint'
      ),
    () => ({
      message: 'Invalid Location History table column values in visible column list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.pinnedColumns).every(
        pinnedColumn =>
          LocationHistoryColumn[pinnedColumn] !== undefined || pinnedColumn === 'savePoint'
      ),
    () => ({
      message: 'Invalid Location History table column values in pinned column list'
    })
  )
  .refine(
    data =>
      data.displayOne.columnOrder.every(
        columnOrderStr =>
          LocationHistoryColumn[columnOrderStr] !== undefined || columnOrderStr === 'savePoint'
      ),
    () => ({
      message: 'Invalid Location History table column values in column order list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.columnWidths).every(
        columnWidthKey =>
          LocationHistoryColumn[columnWidthKey] !== undefined || columnWidthKey === 'savePoint'
      ),
    () => ({
      message: 'Invalid Location History table column values in column width map'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.columnVisibility).every(
        visibleColumn =>
          LocationHistoryAssociationColumn[visibleColumn] !== undefined ||
          LocationHistoryAssociationExtraColumns.includes(visibleColumn)
      ),
    () => ({
      message: 'Invalid Location Association table column values in visible column list'
    })
  )
  .refine(
    data =>
      data.displayTwo.columnOrder.every(
        columnOrderStr =>
          LocationHistoryAssociationColumn[columnOrderStr] !== undefined ||
          LocationHistoryAssociationExtraColumns.includes(columnOrderStr)
      ),
    () => ({
      message: 'Invalid Location Association table column values in column order list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.columnWidths).every(
        columnWidthKey =>
          LocationHistoryAssociationColumn[columnWidthKey] !== undefined ||
          LocationHistoryAssociationExtraColumns.includes(columnWidthKey)
      ),
    () => ({
      message: 'Invalid Location Association table column values in column width map'
    })
  );

/** Zod schema for the station properties display object */
export const stationPropertiesDisplayLayoutSchema = z
  .object({
    ...dualDisplayLayoutSchema.shape
  } satisfies ToZodSchema<DualDisplayLayout>)
  .strict()
  .refine(
    data =>
      Object.keys(data.displayOne.columnVisibility).every(
        visibleColumn => SiteColumn[visibleColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Group table column values in visible column list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.pinnedColumns).every(
        pinnedColumn => SiteColumn[pinnedColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Group table column values in pinned column list'
    })
  )
  .refine(
    data =>
      data.displayOne.columnOrder.every(columnOrderStr => SiteColumn[columnOrderStr] !== undefined),
    () => ({
      message: 'Invalid Channel Group table column values in column order list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.columnWidths).every(
        columnWidthKey => SiteColumn[columnWidthKey] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Group table column values in column width map'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.columnVisibility).every(
        visibleColumn => ChannelColumn[visibleColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Configuration table column values in visible column list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.pinnedColumns).every(
        pinnedColumn => ChannelColumn[pinnedColumn] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Configuration table column values in pinned column list'
    })
  )
  .refine(
    data =>
      data.displayTwo.columnOrder.every(
        columnOrderStr => ChannelColumn[columnOrderStr] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Configuration table column values in column order list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.columnWidths).every(
        columnWidthKey => ChannelColumn[columnWidthKey] !== undefined
      ),
    () => ({
      message: 'Invalid Channel Configuration table column values in column width map'
    })
  );

/** Zod schema for the magnitude display object */
export const magnitudeDisplayLayoutSchema = z
  .object({
    ...dualDisplayLayoutSchema.shape,
    visibleMagnitudeTypes: z.record(z.string(), z.boolean())
  } satisfies ToZodSchema<MagnitudeDisplayLayout>)
  .strict()
  .refine(
    data =>
      Object.keys(data.visibleMagnitudeTypes).every(
        visibleMagnitudeType => MagnitudeType[visibleMagnitudeType] !== undefined
      ),
    () => ({
      message: 'Invalid Visible Magnitude Type values in visibleMagnitudeType map'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.columnVisibility).every(
        visibleColumn =>
          NetworkMagnitudeColumn[visibleColumn] !== undefined ||
          NetworkMagnitudeExtraColumns.includes(visibleColumn)
      ),
    () => ({
      message: 'Invalid Network Magnitude table column values in visible column list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.pinnedColumns).every(
        pinnedColumn =>
          NetworkMagnitudeColumn[pinnedColumn] !== undefined ||
          NetworkMagnitudeExtraColumns.includes(pinnedColumn)
      ),
    () => ({
      message: 'Invalid Network Magnitude table column values in pinned column list'
    })
  )
  .refine(
    data =>
      data.displayOne.columnOrder.every(
        columnOrderStr =>
          NetworkMagnitudeColumn[columnOrderStr] !== undefined ||
          NetworkMagnitudeExtraColumns.includes(columnOrderStr)
      ),
    () => ({
      message: 'Invalid Network Magnitude table column values in column order list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayOne.columnWidths).every(
        columnWidthKey =>
          NetworkMagnitudeColumn[columnWidthKey] !== undefined ||
          NetworkMagnitudeExtraColumns.includes(columnWidthKey)
      ),
    () => ({
      message: 'Invalid Network Magnitude table column values in column width map'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.columnVisibility).every(
        visibleColumn =>
          StationMagnitudeColumn[visibleColumn] !== undefined ||
          StationMagnitudeExtraColumns.includes(visibleColumn)
      ),
    () => ({
      message: 'Invalid Station Magnitude table column values in visible column list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.pinnedColumns).every(
        pinnedColumn =>
          StationMagnitudeColumn[pinnedColumn] !== undefined ||
          StationMagnitudeExtraColumns.includes(pinnedColumn)
      ),
    () => ({
      message: 'Invalid Station Magnitude table column values in pinned column list'
    })
  )
  .refine(
    data =>
      data.displayTwo.columnOrder.every(
        columnOrderStr =>
          StationMagnitudeColumn[columnOrderStr] !== undefined ||
          StationMagnitudeExtraColumns.includes(columnOrderStr)
      ),
    () => ({
      message: 'Invalid Station Magnitude table column values in column order list'
    })
  )
  .refine(
    data =>
      Object.keys(data.displayTwo.columnWidths).every(
        columnWidthKey =>
          StationMagnitudeColumn[columnWidthKey] !== undefined ||
          StationMagnitudeExtraColumns.includes(columnWidthKey)
      ),
    () => ({
      message: 'Invalid Station Magnitude table column values in column width map'
    })
  );

/** Zod schema for the {@link WaveformDisplayLayout} object */
export const waveformDisplayLayoutSchema = z
  .object({
    visibleSignalDetections: z.record(z.string(), z.boolean())
  } satisfies ToZodSchema<WaveformDisplayLayout>)
  .strict()
  .refine(
    data =>
      Object.keys(data.visibleSignalDetections).every(
        visibleSdStr =>
          WaveformDisplayedSignalDetectionConfigurationEnum[visibleSdStr] !== undefined
      ),
    () => ({
      message:
        'Invalid Displayed Signal Detection configuration in Waveform Display visible signal detection configuration',
      path: ['visibleSignalDetections']
    })
  );

/** Zod schema for the {@link StationVisibilityList} object */
export const stationVisibilityListSchema = z
  .object({
    name: z.string(),
    stations: z.array(stationEntityReferenceSchema)
  } satisfies ToZodSchema<StationVisibilityList>)
  .strict();

/** Zod schema for the {@link WorkspaceLayout} object */
export const workspaceLayoutSchema = z
  .object({
    name: z.string().min(1),
    layoutConfiguration: z.string().min(1)
  } satisfies ToZodSchema<WorkspaceLayout>)
  .strict();

export const userPreferencesKeyboardShortcutSchema = z
  .object({
    clickEvents: z.object(
      AllClickEventDefinitions.reduce((accumulator, clickEvent) => {
        accumulator[clickEvent] = z.array(z.string()).optional();
        return accumulator;
      }, {})
    ),
    middleClickEvents: z.object({}), // always empty
    rightClickEvents: z.object({}), // always empty
    doubleClickEvents: z.object(
      AllDoubleClickDefinitions.reduce((accumulator, clickEvent) => {
        accumulator[clickEvent] = z.array(z.string()).optional();
        return accumulator;
      }, {})
    ),
    dragEvents: z.object(
      AllDragEventDefinitions.reduce((accumulator, clickEvent) => {
        accumulator[clickEvent] = z.array(z.string()).optional();
        return accumulator;
      }, {})
    ),
    scrollEvents: z.object(
      AllScrollEventDefinitions.reduce((accumulator, clickEvent) => {
        accumulator[clickEvent] = z.array(z.string()).optional();
        return accumulator;
      }, {})
    ),
    hotkeys: z.object(
      AllHotkeyDefinitions.reduce((accumulator, clickEvent) => {
        accumulator[clickEvent] = z.array(z.string()).optional();
        return accumulator;
      }, {})
    )
  } satisfies ToZodSchema<UserPreferencesKeyboardShortcuts>)
  .strict();

/** A zod schema for the {@link UiUserPreferences} object */
export const uiUserPreferencesSchema = z
  .object({
    /** json URI-encoded string of the golden layout configuration */
    defaultWorkspaceLayout: z.string().min(1).readonly(),

    /** preferences that affect the global application such as colorMap */
    globalPreferences: globalPreferencesSchema,

    /** Named workspace layouts containing json URI-encoded strings of a golden layout configuration */
    workspaceLayouts: z.array(workspaceLayoutSchema),

    customFilterList: filterListSchema.optional(),

    mapDisplaySettings: mapDisplaySettingsSchema,

    /** mapping of table-based display layouts for specific displays eg; Azimuth Slowness, Events, Signal Detections */
    displayLayouts: z.object({
      [IanDisplays.AZIMUTH_SLOWNESS]: azimuthSlownessDisplayLayoutSchema,
      [IanDisplays.EVENTS]: eventDisplayLayoutSchema,
      [IanDisplays.SIGNAL_DETECTIONS]: signalDetectionDisplayLayoutSchema,
      [IanDisplays.LOCATION]: locationDisplayLayoutSchema,
      [IanDisplays.STATION_PROPERTIES]: stationPropertiesDisplayLayoutSchema,
      [IanDisplays.MAGNITUDE]: magnitudeDisplayLayoutSchema
    }),

    waveformDisplayLayout: waveformDisplayLayoutSchema,

    stationVisibilityLists: z.array(stationVisibilityListSchema),

    keyboardShortcuts: userPreferencesKeyboardShortcutSchema
  } satisfies ToZodSchema<UiUserPreferences>)
  .strict();

/** A zod schema defining the user layout. */
export const userLayoutSchema = z
  .object({
    /** the unique layout name */
    name: z.string().min(1).readonly(),

    /** the golden layout URI encoded json layout configuration */
    layoutConfiguration: z.string().min(1).readonly()
  } satisfies ToZodSchema<UserLayout>)
  .strict()
  .readonly();

/** A zod schema defining the user profile. */
export const userProfileSchema = z
  .object({
    /** the unique user id */
    userId: z.string().min(1).readonly(),

    /** user preferences */
    userPreferences: uiUserPreferencesSchema
  })
  .strict()
  .readonly();
