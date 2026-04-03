import React from 'react';
import type { Station } from '../../models/station';
interface CreateSignalDetectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (detection: any) => void;
    stations: Station[];
}
export declare const CreateSignalDetectionModal: React.FC<CreateSignalDetectionModalProps>;
export default CreateSignalDetectionModal;
//# sourceMappingURL=CreateSignalDetectionModal.d.ts.map