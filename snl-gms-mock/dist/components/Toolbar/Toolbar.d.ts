import React from 'react';
interface ToolbarProps {
    onRefresh?: () => void;
    onCreateEvent?: () => void;
    onFilter?: () => void;
    onExport?: () => void;
    title: string;
    count?: number;
}
export declare const Toolbar: React.FC<ToolbarProps>;
export default Toolbar;
//# sourceMappingURL=Toolbar.d.ts.map