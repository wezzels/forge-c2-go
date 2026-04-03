import React from 'react';
import type { Event } from '../../models/event';
interface AssociateDetectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssociate: (eventId: string) => void;
    events: Event[];
    detectionId: string;
}
export declare const AssociateDetectionModal: React.FC<AssociateDetectionModalProps>;
export default AssociateDetectionModal;
//# sourceMappingURL=AssociateDetectionModal.d.ts.map