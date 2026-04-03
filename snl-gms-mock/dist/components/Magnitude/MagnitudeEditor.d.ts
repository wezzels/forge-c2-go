import React from 'react';
interface MagnitudeEditorProps {
    magnitudes: {
        mb?: number;
        ms?: number;
        ml?: number;
        mw?: number;
    };
    networkMagnitude?: number;
    onMagnitudeChange: (type: string, value: number) => void;
    onRecalculate?: () => void;
    onSave?: () => void;
    readOnly?: boolean;
}
export declare const MagnitudeEditor: React.FC<MagnitudeEditorProps>;
export default MagnitudeEditor;
//# sourceMappingURL=MagnitudeEditor.d.ts.map