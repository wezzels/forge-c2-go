import type { DistanceUnits } from '@gms/weavess-core/lib/types';
import React from 'react';
export interface ChooseWaveformRowProps {
    isDefaultChannel: boolean;
    isSplitChannel: boolean;
}
export interface ChannelNameRowProps {
    isSplitChannel: boolean;
    channelLabel?: string;
    channelLabelTooltip?: string;
    channelLabelIcon?: JSX.Element;
    channelName: string | JSX.Element;
    phaseLabel: string | undefined;
    phaseColor: string | undefined;
    isDefaultChannel: boolean;
    tooltipText?: string;
}
export interface PhaseLabelProps {
    phaseLabel: string;
    phaseColor: string | undefined;
    tooltipText?: string;
}
export interface AzimuthRowProps {
    azimuth: number;
    distance: number;
    distanceUnits: DistanceUnits;
}
export interface LabelHeaderRowProps {
    labelHeader: string | JSX.Element;
}
export interface FKRowProps {
    id: string;
}
/**
 * Special formatting for FK channel label rows
 *
 * @param props uses ID to determine FK type
 * @returns name row for FK plots
 */
export declare const FKNameRow: React.NamedExoticComponent<FKRowProps>;
/**
 * Exists only when split channel mode expansion is active, and only for Default Channels
 *
 * @param isDefaultChannel
 * @param isSplitChannel
 * @returns null when not a default channel in split channel expanded mode
 */
export declare const ChooseWaveformRow: React.NamedExoticComponent<ChooseWaveformRowProps>;
/**
 * Includes the channel name.
 * For split non-default channels, also contains Signal Detection phase colored to match event association
 *
 * @param props
 * @returns a row for weavess channel labels
 */
export declare const ChannelNameRow: React.NamedExoticComponent<ChannelNameRowProps>;
/**
 *
 * @param props Includes the Azimuth and Distance when an event is open
 * @returns a row for weavess channel labels
 */
export declare const AzimuthRow: React.NamedExoticComponent<AzimuthRowProps>;
/**
 * @returns simple row to display a label header
 */
export declare const LabelHeaderRow: React.NamedExoticComponent<LabelHeaderRowProps>;
//# sourceMappingURL=label-rows.d.ts.map