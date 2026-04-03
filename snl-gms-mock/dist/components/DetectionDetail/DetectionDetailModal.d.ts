import React from 'react';
import type { SignalDetection } from '../../models/detection';
interface DetectionDetailModalProps {
    detection: SignalDetection | null;
    isOpen: boolean;
    onClose: () => void;
    onAssociate?: (detectionId: string) => void;
    onCreateDetection?: () => void;
}
export declare const DetectionDetailModal: React.FC<DetectionDetailModalProps>;
export default DetectionDetailModal;
//# sourceMappingURL=DetectionDetailModal.d.ts.map