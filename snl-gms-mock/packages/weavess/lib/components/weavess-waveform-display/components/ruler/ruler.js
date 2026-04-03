import { HotkeyListener } from '@gms/ui-util';
import moment from 'moment';
import * as React from 'react';
import { useFollowMouse } from '../../../../util/custom-hooks';
import { LabelValue } from './label-value';
function RulerCrossHairDiv(props) {
    const { ruler, startX, boundMousePositionX, boundMousePositionY, scrollTop } = props;
    const { startTime, endTime } = ruler;
    const isModifierKeyActive = HotkeyListener.isKeyDown(HotkeyListener.ModifierHotKeys.CONTROL) ||
        HotkeyListener.isKeyDown(HotkeyListener.ModifierHotKeys.ALT) ||
        HotkeyListener.isKeyDown(HotkeyListener.ModifierHotKeys.META) ||
        HotkeyListener.isKeyDown(HotkeyListener.ModifierHotKeys.SHIFT);
    return !isModifierKeyActive && !startTime.isSame(endTime) ? (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "ruler__start-marker", style: {
                transform: `translateX(${startX}px)`
            } }),
        React.createElement("div", { className: "ruler__current-marker", style: {
                width: `${Math.abs(startX - boundMousePositionX)}px`,
                transform: `translateX(${Math.min(startX, boundMousePositionX)}px) translateY(${boundMousePositionY - scrollTop}px)`
            } }))) : null;
}
function RulerTooltipDiv(props) {
    const { ruler } = props;
    const { startTime, endTime, duration } = ruler;
    return startTime.isSame(endTime) ? (React.createElement("div", { className: "ruler-tooltip", "data-cy": "ruler-tooltip" },
        React.createElement(LabelValue, { label: "Date", value: `${startTime.format('YYYY-MM-DD')}`, tooltip: "Date", containerClass: "ruler-tooltip-container" }),
        React.createElement(LabelValue, { label: "Time", value: `${startTime.format('HH:mm:ss.SSS')}`, tooltip: "Time", containerClass: "ruler-tooltip-container" }))) : (React.createElement("div", { className: "ruler-tooltip", "data-cy": "ruler-tooltip" },
        React.createElement(LabelValue, { label: "Date", value: `${startTime.format('YYYY-MM-DD')}`, tooltip: "Date", containerClass: "ruler-tooltip-container" }),
        React.createElement(LabelValue, { label: "Start Time", value: `${startTime.format('HH:mm:ss.SSS')}`, tooltip: "Start Time", containerClass: "ruler-tooltip-container" }),
        React.createElement(LabelValue, { label: "End Time", value: `${endTime.format('HH:mm:ss.SSS')}`, tooltip: "End Time", containerClass: "ruler-tooltip-container" }),
        React.createElement(LabelValue, { label: "Duration", value: `${moment.utc(duration).format('HH:mm:ss.SSS')}`, tooltip: "Duration", containerClass: "ruler-tooltip-container" })));
}
/**
 * A ruler component that draws lines to the display to illustrate duration and provide info
 *
 * @param props RulerProps
 * @returns A ruler component
 */
export const Ruler = React.memo(function Ruler(props) {
    const { isActive, initialPoint, containerDimensions, onRulerMouseUp, computeTimeSecsForMouseXFractionalPosition } = props;
    const { onMouseMove, initialMouseX, mouseX, mouseY } = useFollowMouse(initialPoint);
    HotkeyListener.useGlobalHotkeyListener();
    React.useEffect(() => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onRulerMouseUp);
        document.addEventListener('mouseup', onRulerMouseUp);
        if (isActive) {
            document.addEventListener('mousemove', onMouseMove);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onRulerMouseUp);
        };
    }, [isActive, onMouseMove, onRulerMouseUp]);
    if (!isActive || mouseX === 0)
        return null;
    const canvasLeftPos = containerDimensions.canvas.rect?.left ?? 0;
    const canvasWidth = containerDimensions.canvas.rect?.width ?? 0;
    const canvasTop = containerDimensions.canvas.rect?.top ?? 0;
    const canvasHeight = containerDimensions.canvas.rect?.height ?? 0;
    const scrollTop = containerDimensions.viewport?.scrollTop ?? 0;
    const startX = initialMouseX - canvasLeftPos;
    const currentMousePositionX = mouseX - canvasLeftPos;
    const currentMousePositionY = mouseY - canvasTop;
    const leftOffset = canvasLeftPos;
    const boundMousePositionX = Math.min(Math.max(0, currentMousePositionX), canvasWidth);
    const timeMouseX = (mouseX - leftOffset) / canvasWidth;
    const boundTimeX = Math.min(Math.max(0, timeMouseX), 1);
    const initialTime = moment
        .unix(computeTimeSecsForMouseXFractionalPosition((initialMouseX - leftOffset) / canvasWidth))
        .utc();
    const currentTime = moment.unix(computeTimeSecsForMouseXFractionalPosition(boundTimeX)).utc();
    const duration = initialTime.isBefore(currentTime)
        ? currentTime.diff(initialTime)
        : initialTime.diff(currentTime);
    const ruler = {
        startTime: initialTime.isBefore(currentTime) ? initialTime : currentTime,
        endTime: currentTime.isBefore(initialTime) ? initialTime : currentTime,
        duration
    };
    const labelOffset = 115;
    const labelHeight = 120;
    const tooltipBoundLimit = 100;
    const boundMousePositionY = Math.min(Math.max(0, currentMousePositionY), canvasHeight);
    let tooltipPositionX = boundMousePositionX;
    let tooltipPositionY = boundMousePositionY - scrollTop;
    if (tooltipPositionX < tooltipBoundLimit) {
        tooltipPositionX += labelOffset;
    }
    if (tooltipPositionX > canvasWidth - labelOffset) {
        tooltipPositionX -= labelOffset;
    }
    if (tooltipPositionY < tooltipBoundLimit) {
        tooltipPositionY = labelOffset;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(RulerCrossHairDiv, { ruler: ruler, startX: startX, scrollTop: scrollTop, boundMousePositionX: boundMousePositionX, boundMousePositionY: boundMousePositionY }),
        React.createElement("div", { className: "ruler__info", style: {
                transform: `translateX(${tooltipPositionX - labelOffset}px) translateY(${tooltipPositionY - labelHeight}px)`
            } },
            React.createElement(RulerTooltipDiv, { ruler: ruler }))));
});
//# sourceMappingURL=ruler.js.map