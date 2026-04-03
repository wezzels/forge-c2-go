import React from 'react';
import type { SignalDetection } from '../../models/detection';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
interface SignalDetectionsPanelProps {
    detections: SignalDetection[];
    selectedDetectionIds: string[];
    onDetectionSelect: (detectionIds: string[]) => void;
    onDetectionDoubleClick: (detectionId: string) => void;
}
export declare const SignalDetectionsPanel: React.FC<SignalDetectionsPanelProps>;
export default SignalDetectionsPanel;
//# sourceMappingURL=SignalDetectionsPanel.d.ts.map