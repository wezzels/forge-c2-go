import { useResizeObserver } from '@gms/ui-util';
import { WeavessConstants } from '@gms/weavess-core';
import * as React from 'react';
/**
 * Returns a callback used by the ResizeObserver for the horizontal divider.
 *
 * @param ref the reference object for obtaining the BoundingClientRect
 * @param setHeight a state action setter for setting the height
 * @param setWidth a state action setter for setting the width
 * @returns
 */
export const useResizeObserverCallback = (ref, setHeight, setWidth) => {
    return React.useMemo(() => () => {
        const { current } = ref;
        if (current !== null) {
            const boundingClientRect = current.getBoundingClientRect();
            setHeight(() => boundingClientRect.height);
            setWidth(() => boundingClientRect.width);
        }
    }, [ref, setHeight, setWidth]);
};
/**
 * A hook that attaches a resize observer and returns the height of the referenced element
 * Note that it tracks state internally, and so will issue a rerender to children when
 * the component resizes and the ResizeObserver event fires.
 *
 * @param ref A ref to the element we want the size of
 * @returns the height and width of the element, or undefined
 */
const useElementSize = (ref) => {
    const [heightPx, setHeight] = React.useState(() => {
        return ref.current?.getBoundingClientRect().height;
    });
    const [widthPx, setWidth] = React.useState(() => {
        return ref.current?.getBoundingClientRect().width;
    });
    useResizeObserver(ref?.current, useResizeObserverCallback(ref, setHeight, setWidth));
    return { heightPx, widthPx };
};
/**
 * A hook that creates a drag listener. Note that the drag listener is wrapped in useCallback
 * to ensure that it is referentially stable for components that are passed it as a prop.
 */
const useDividerDragListener = (minTopHeight, maxTopHeight, topHeightPx, bottomHeightPx, setTopHeightPx, setIsResizing, onResizeEnd) => React.useCallback((event) => {
    const startPosition = event.clientY;
    const minHeightPx = minTopHeight ?? WeavessConstants.DEFAULT_DIVIDER_TOP_MIN_HEIGHT_PX;
    const maxHeightPx = maxTopHeight ?? WeavessConstants.DEFAULT_DIVIDER_TOP_MAX_HEIGHT_PX;
    setIsResizing(true);
    const onDividerMouseMove = (e2) => {
        const currentPos = e2.clientY;
        const diff = currentPos - startPosition;
        const heightPx = topHeightPx + diff;
        setTopHeightPx(Math.min(Math.max(heightPx, minHeightPx), maxHeightPx));
    };
    const onDividerMouseUp = () => {
        document.body.removeEventListener('mousemove', onDividerMouseMove);
        document.body.removeEventListener('mouseup', onDividerMouseUp);
        setIsResizing(false);
        if (onResizeEnd)
            onResizeEnd(topHeightPx, bottomHeightPx);
    };
    document.body.addEventListener('mousemove', onDividerMouseMove);
    document.body.addEventListener('mouseup', onDividerMouseUp);
}, [
    bottomHeightPx,
    maxTopHeight,
    minTopHeight,
    onResizeEnd,
    setIsResizing,
    setTopHeightPx,
    topHeightPx
]);
/**
 * Renders a top and bottom container with a resizable horizontal divider between them.
 * Will fill the space available to it.
 * Top and bottom containers can be ReactElements or functions that return a React Element.
 */
export function HorizontalDivider({ topComponent, bottomComponent, topClassName, bottomClassName, showTop, showBottom, minTopHeight, maxTopHeight, onResizeEnd }) {
    const topContainerRef = React.useRef(null);
    const bottomContainerRef = React.useRef(null);
    const bottomHeightPx = useElementSize(bottomContainerRef).heightPx ?? -1;
    const [topHeightPx, setTopHeightPx] = React.useState(WeavessConstants.DEFAULT_DIVIDER_TOP_HEIGHT_PX);
    const [isResizing, setIsResizing] = React.useState(false);
    const onDividerDrag = useDividerDragListener(minTopHeight, maxTopHeight, topHeightPx, bottomHeightPx, setTopHeightPx, setIsResizing, onResizeEnd);
    const shouldShowTop = showTop === undefined || showTop;
    const shouldShowBottom = showBottom === undefined || showBottom;
    return (React.createElement(React.Fragment, null,
        shouldShowTop && (React.createElement("div", { ref: ref => {
                topContainerRef.current = ref;
            }, className: `horizontal-divider__top ${topClassName}`, "data-cy": `${topClassName}`, style: {
                height: `${topHeightPx}px`
            } }, typeof topComponent === 'function'
            ? topComponent(topHeightPx, bottomHeightPx, isResizing)
            : topComponent)),
        shouldShowTop && shouldShowBottom && (React.createElement("div", { className: "horizontal-divider__handle" },
            React.createElement("div", { className: "horizontal-divider__target", "data-cy": "waveform-divider", onMouseDown: onDividerDrag }))),
        shouldShowBottom && (React.createElement("div", { ref: ref => {
                bottomContainerRef.current = ref;
            }, className: `horizontal-divider__bottom ${bottomClassName}`, "data-cy": `${bottomClassName}`, style: {
                height: showTop ? `calc(100% - ${topHeightPx}px)` : '100%'
            } }, typeof bottomComponent === 'function'
            ? bottomComponent(topHeightPx, bottomHeightPx, isResizing)
            : bottomComponent))));
}
//# sourceMappingURL=horizontal-divider.js.map