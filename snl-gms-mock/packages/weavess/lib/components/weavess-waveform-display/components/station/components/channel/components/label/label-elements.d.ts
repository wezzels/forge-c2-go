import React from 'react';
export interface StationExpansionButtonProps {
    channelId: string;
    showMaskIndicator: boolean;
    onClick: any;
    isExpanded: boolean;
    rowHeight: number;
}
export interface LabelLeftCancelElementProps {
    channelId: string;
    onClick: any;
}
export interface DefaultLabelLeftElementProps {
    isDefaultChannel: boolean;
    isSplitChannel: boolean;
}
export interface LabelLeftElementProps {
    isDefaultChannel: boolean;
    isSplitChannel: boolean;
    closeSplitChannelOverlayCallback: any;
    channelId: string;
    isExpandable: boolean;
    isMeasureWindow: boolean;
}
/**
 * A button for expanding or collapsing the channel row to reveal sub-channels
 *
 * @param props StationExpansionButtonProps
 * @returns an expand element for the left hand side of the weavess label
 */
export declare const StationExpansionButton: React.NamedExoticComponent<StationExpansionButtonProps>;
/**
 * A button used to cancel the split channel row expansion
 *
 * @param props CancelElementProps
 * @returns Cancel button element for the left hand side of the weavess label
 */
export declare function LabelLeftCancelElement(props: LabelLeftCancelElementProps): React.JSX.Element;
/**
 *  Currently displayed when the channel is not expandable, and does not need a CancelElement.
 *  Is colored differently for split channels.
 *
 * @param props
 * @returns DefaultLeftElement for the left hand side of the weavess label
 */
export declare function DefaultLabelLeftElement(props: DefaultLabelLeftElementProps): React.JSX.Element;
/**
 * The left-hand element in a weavess channel label. Might contain an expand/collapse element if it's on a default channel,
 * or a cancel element if the default channel is in expansion mode.
 *
 * @param props
 * @returns left-hand weavess label element
 */
export declare const LabelLeftElement: React.NamedExoticComponent<LabelLeftElementProps>;
//# sourceMappingURL=label-elements.d.ts.map