import React from 'react';
/**
 * Hook that keeps track of mouse location and initial mouse x
 *
 * @returns mouse information and setter for mouseX
 */
export const useFollowMouse = (initial = { x: 0, y: 0 }) => {
    const initialMouseX = React.useRef(initial.x);
    const [mouseX, setMouseX] = React.useState(initial.x);
    const [mouseY, setMouseY] = React.useState(initial.y);
    //! useEffect updates local state
    React.useEffect(() => {
        setMouseX(initial.x);
        setMouseY(initial.y);
        initialMouseX.current = initial.x;
    }, [initial]);
    const onMouseMove = React.useCallback((event) => {
        setMouseX(event.clientX);
        setMouseY(event.clientY);
    }, []);
    return {
        initialMouseX: initialMouseX.current,
        onMouseMove,
        setMouseX,
        mouseX,
        mouseY
    };
};
//# sourceMappingURL=custom-hooks.js.map