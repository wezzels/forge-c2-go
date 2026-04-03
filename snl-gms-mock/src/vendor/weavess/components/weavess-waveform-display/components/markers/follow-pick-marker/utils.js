import React from 'react';
export const useMousePosition = () => {
    const [mousePosition, setMousePosition] = React.useState({
        x: null,
        y: null
    });
    //! useEffect updates local state
    React.useEffect(() => {
        const updateMousePosition = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);
    return mousePosition;
};
//# sourceMappingURL=utils.js.map