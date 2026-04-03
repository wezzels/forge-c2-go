import { DEFAULT_CHANNEL_HEIGHT_PIXELS, DEFAULT_LABEL_WIDTH_PIXELS } from './constants';
/** Defines the default configuration for Weavess */
export const defaultConfiguration = {
    defaultChannelHeightPx: DEFAULT_CHANNEL_HEIGHT_PIXELS,
    labelWidthPx: DEFAULT_LABEL_WIDTH_PIXELS,
    xAxisLabel: undefined,
    shouldRenderWaveforms: true,
    shouldRenderSpectrograms: true,
    backgroundColor: '#182026',
    outOfBoundsColor: '#000000',
    waveformDimPercent: 0.75,
    defaultChannel: {
        disableMeasureWindow: false,
        disableMaskModification: false
    },
    sdUncertainty: {
        fractionDigits: 8,
        minUncertainty: 0.1
    },
    nonDefaultChannel: {
        disableMeasureWindow: false,
        disableMaskModification: false
    },
    colorScale: undefined
};
//# sourceMappingURL=configuration.js.map