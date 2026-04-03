import React from 'react';
interface WaveformFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filter: WaveformFilter) => void;
}
export interface WaveformFilter {
    type: 'bandpass' | 'highpass' | 'lowpass';
    lowFrequency: number;
    highFrequency: number;
}
export declare const WaveformFilterModal: React.FC<WaveformFilterModalProps>;
export default WaveformFilterModal;
//# sourceMappingURL=WaveformFilterModal.d.ts.map