import React from 'react';
/**
 * Hook that keeps track of mouse location and initial mouse x
 *
 * @returns mouse information and setter for mouseX
 */
export declare const useFollowMouse: (initial?: {
    x: number;
    y: number;
}) => {
    initialMouseX: number;
    onMouseMove: (event: MouseEvent) => void;
    setMouseX: React.Dispatch<React.SetStateAction<number>>;
    mouseX: number;
    mouseY: number;
};
//# sourceMappingURL=custom-hooks.d.ts.map