import React from 'react';
interface WezzelosEmbedProps {
    src?: string;
    width?: string;
    height?: string;
    onMessage?: (event: MessageEvent) => void;
    onEventSelect?: (eventId: string) => void;
    onStationSelect?: (stationId: string) => void;
    onDetectionSelect?: (detectionId: string) => void;
    token?: string;
    className?: string;
}
/**
 * Wezzelos Embed Component
 *
 * Embeds GMS Mock UI within Wezzelos dashboard using iframe.
 * Provides communication between parent and iframe via postMessage API.
 */
export declare const WezzelosEmbed: React.FC<WezzelosEmbedProps>;
export default WezzelosEmbed;
//# sourceMappingURL=WezzelosEmbed.d.ts.map