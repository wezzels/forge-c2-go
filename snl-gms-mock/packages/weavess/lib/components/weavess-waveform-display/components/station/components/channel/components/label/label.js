/* eslint-disable react/destructuring-assignment */
import { Tooltip } from '@blueprintjs/core';
import { classList, UILogger } from '@gms/ui-util';
import React from 'react';
import { YAxis } from '../../../../../axes';
import { LabelLeftElement } from './label-elements';
import { AzimuthRow, ChannelNameRow, ChooseWaveformRow, LabelHeaderRow } from './label-rows';
const logger = UILogger.create('GMS_LOG_WEAVESS');
/**
 * Label component. Describes a waveform (or other graphic component) and has optional events
 */
export class Label extends React.PureComponent {
    /** The y-axis references. */
    yAxisRefs = {};
    // ******************************************
    // BEGIN REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * @param prevProps the previous props
     * @param prevState the previous state
     */
    componentDidUpdate(prevProps) {
        // should we force re-draw the yAxis?
        // Note that the y-axis will redraw based on its changed props,
        // so we don't need to check for changes to the bounds
        if (this.props.channel.id !== prevProps.channel.id ||
            this.props.channel?.height !== prevProps.channel?.height ||
            this.props.channel.yAxisTicks !== prevProps.channel.yAxisTicks) {
            this.refreshYAxis();
        }
    }
    /**
     * Catches exceptions generated in descendant components.
     * Unhandled exceptions will cause the entire component tree to unmount.
     *
     * @param error the error that was caught
     * @param info the information about the error
     */
    componentDidCatch(error, info) {
        logger.error(`Weavess Label Error: ${error} : ${info}`);
    }
    // ******************************************
    // END REACT COMPONENT LIFECYCLE METHODS
    // ******************************************
    /**
     * Creates the phase label and color string based on props.
     * If all are the same, returns that value. Otherwise, returns `*` for the label and
     * undefined for the color.
     *
     * @returns a phase label string and color string
     */
    getPhaseLabelAndColor = () => {
        if (this.props.channel?.waveform?.signalDetections) {
            const phaseLabel = this.props.channel.waveform.signalDetections.reduce((label, phase) => {
                return label === phase.label ? label : '*';
            }, this.props.channel.waveform.signalDetections[0]?.label);
            const phaseColor = this.props.channel.waveform.signalDetections.reduce((color, phase) => {
                return color === phase.color ? color : undefined;
            }, this.props.channel.waveform.signalDetections[0]?.label);
            return { phaseLabel, phaseColor };
        }
        return { phaseColor: undefined, phaseLabel: undefined };
    };
    // eslint-disable-next-line react/sort-comp, complexity
    render() {
        const { phaseLabel, phaseColor } = this.getPhaseLabelAndColor();
        // In cases such as in measurement and individual mode, default channels should display channel distance/azimuth rather than station distance/azimuth
        // If channel distance/azimuth is not provided (such as in overlay mode), we fall back to station distance/azimuth.
        const distance = this.props.isDefaultChannel && this.props.channel.distance !== undefined
            ? this.props.channel.distance
            : this.props.distance;
        const azimuth = this.props.isDefaultChannel && this.props.channel.azimuth !== undefined
            ? this.props.channel.azimuth
            : this.props.azimuth;
        const customLabelProps = { ...this.props, phase: phaseLabel };
        return (React.createElement("div", { onContextMenu: this.onContextMenu, 
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex: 0, className: `label${this.props?.events?.onChannelLabelClick ? ' label--actionable' : ''}` },
            React.createElement("div", { className: `label-container${this.props.channel.isSelected ? ' is-selected' : ''}` },
                React.createElement(LabelLeftElement, { isDefaultChannel: this.props.isDefaultChannel, isExpandable: this.props.isExpandable, isSplitChannel: !!this.props.channel.splitChannelTime, closeSplitChannelOverlayCallback: this.props.closeSplitChannelOverlayCallback, channelId: this.props.channel.id, isMeasureWindow: this.props.isMeasureWindow }),
                React.createElement("div", { className: "label-container-content" },
                    React.createElement("div", { className: `label-container-content-label${this.props.channel.isSelected ? ' is-selected' : ''}`, onClick: this.labelContainerContentOnClick, "data-cy": `channel-label-${this.props.channel.id}` }, this.props.customLabel ? (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    React.createElement(this.props.customLabel, { ...customLabelProps })) : (React.createElement("div", null,
                        React.createElement("span", { className: "weavess-tooltip__target label-container-content" },
                            !this.props.isDefaultChannel && this.props.labelHeader && (React.createElement(LabelHeaderRow, { labelHeader: this.props.labelHeader })),
                            React.createElement(Tooltip, { disabled: !this.props.channelLabelTooltip, className: classList({
                                    'weavess-tooltip': true,
                                    'weavess-tooltip--help': !!this.props.channelLabelTooltip
                                }), content: this.props.channelLabelTooltip, placement: "right", hoverOpenDelay: 250 },
                                React.createElement("span", { className: "station-label-container" },
                                    React.createElement(ChooseWaveformRow, { isDefaultChannel: this.props.isDefaultChannel, isSplitChannel: !!this.props.channel.splitChannelTime }),
                                    React.createElement(ChannelNameRow, { isSplitChannel: !!this.props.channel.splitChannelTime, isDefaultChannel: this.props.isDefaultChannel, channelName: this.props.channel.name, channelLabel: this.props.channel.channelLabel, channelLabelTooltip: this.props.channelLabelTooltip, channelLabelIcon: this.props.channelLabelIcon, phaseColor: phaseColor, phaseLabel: phaseLabel, tooltipText: phaseLabel === '*' ? 'Multiple phases' : undefined }))),
                            React.createElement(AzimuthRow, { azimuth: azimuth, distance: distance, distanceUnits: this.props.distanceUnits }))))),
                    React.createElement("div", { style: {
                            height: '100%'
                        }, "data-cy-contains-amplitude-markers": this.hasYAxes() },
                        this.props.suppressLabelYAxis ||
                            !this.props.yAxisBounds?.waveformYAxisBounds ? undefined : (React.createElement(YAxis, { key: `${this.props.channel.id}_yaxis_waveform`, ref: ref => {
                                this.yAxisRefs.waveformYAxisBounds = ref;
                            }, maxAmplitude: this.props.yAxisBounds.waveformYAxisBounds.maxAmplitude, minAmplitude: this.props.yAxisBounds.waveformYAxisBounds.minAmplitude, heightInPercentage: this.props.yAxisBounds.waveformYAxisBounds?.heightInPercentage, yAxisTicks: this.props.channel.yAxisTicks })),
                        this.props.suppressLabelYAxis ||
                            !this.yAxisRefs?.spectrogramYAxisBounds ? undefined : (React.createElement(YAxis, { key: `${this.props.channel.id}_yaxis_spectrogram`, ref: ref => {
                                this.yAxisRefs.spectrogramYAxisBounds = ref;
                            }, maxAmplitude: this.props.yAxisBounds.spectrogramYAxisBounds?.maxAmplitude, minAmplitude: this.props.yAxisBounds.spectrogramYAxisBounds?.minAmplitude, heightInPercentage: this.props.yAxisBounds.spectrogramYAxisBounds?.heightInPercentage, yAxisTicks: this.props.channel.yAxisTicks })))))));
    }
    /**
     * Refreshes the y-axis for the label
     */
    refreshYAxis = () => {
        if (this.yAxisRefs) {
            Object.keys(this.yAxisRefs).forEach(key => {
                const yAxis = this.yAxisRefs[key];
                if (yAxis) {
                    yAxis.display();
                }
            });
        }
    };
    hasYAxes = () => {
        return (!!this.props.yAxisBounds?.waveformYAxisBounds ||
            !!this.props.yAxisBounds?.spectrogramYAxisBounds);
    };
    /**
     * Helper method to reduce code complexity
     *
     * @param amplitude
     * @returns
     */
    // eslint-disable-next-line class-methods-use-this
    amplitudeOrFallback = (amplitude) => {
        return amplitude ?? -1;
    };
    /**
     * The on context menu event handler
     * Does not fire if channel is in split-expansion mode
     *
     * @param e the mouse event
     */
    onContextMenu = (e) => {
        if (this.props.events?.onContextMenu && (e.button === 2 || (e.button === 0 && e.ctrlKey))) {
            e.preventDefault();
            if (this.props.channel.splitChannelTime)
                return;
            this.props.events.onContextMenu(e, this.props.channel.id, this.props.channelName, this.hasYAxes() && this.props.yAxisBounds.waveformYAxisBounds?.minAmplitude != null
                ? this.amplitudeOrFallback(this.props.yAxisBounds.waveformYAxisBounds.minAmplitude ?? -1)
                : -1, this.hasYAxes() && this.props.yAxisBounds.waveformYAxisBounds?.maxAmplitude != null
                ? this.props.yAxisBounds.waveformYAxisBounds.maxAmplitude ?? 1
                : 1, this.props.isDefaultChannel, this.props.isMeasureWindow);
        }
        // Prevents chrome context menu from appearing if
        // Left mouse + control is used to summon context menu
        if (this.props.events?.onChannelLabelClick && e.button === 0 && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            if (this.props.channel.splitChannelTime)
                return;
            this.props.events.onChannelLabelClick(e, this.props.channel.id);
        }
    };
    /**
     * The label container content on click event handler
     *
     * @param e the mouse event
     */
    labelContainerContentOnClick = (e) => {
        if (this.props.events && this.props.events.onChannelLabelClick) {
            this.props.events.onChannelLabelClick(e, this.props.channel.id);
        }
    };
}
//# sourceMappingURL=label.js.map