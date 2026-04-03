import React from 'react';
interface LocationEditorProps {
    latitude: number;
    longitude: number;
    depth: number;
    uncertainty?: {
        latitude: number;
        longitude: number;
        depth: number;
    };
    onLocationChange: (lat: number, lon: number, depth: number) => void;
    onRecalculate?: () => void;
    onSave?: () => void;
    readOnly?: boolean;
}
export declare const LocationEditor: React.FC<LocationEditorProps>;
export default LocationEditor;
//# sourceMappingURL=LocationEditor.d.ts.map