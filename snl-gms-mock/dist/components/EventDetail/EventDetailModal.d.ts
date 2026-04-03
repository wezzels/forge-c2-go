import React from 'react';
import type { Event } from '../../models/event';
interface EventDetailModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Event) => void;
}
export declare const EventDetailModal: React.FC<EventDetailModalProps>;
export default EventDetailModal;
//# sourceMappingURL=EventDetailModal.d.ts.map