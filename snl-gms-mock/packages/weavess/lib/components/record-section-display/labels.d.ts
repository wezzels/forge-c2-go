import React from 'react';
export interface RecordSectionLabelsProps {
    /** Bottom value as number */
    bottomVal: number;
    /** Top value as number */
    topVal: number;
    /** Phases options as any */
    phases: [
        {
            percentX: number;
            percentY: number;
            phase: string;
        }
    ];
}
export declare class RecordSectionLabels extends React.Component<RecordSectionLabelsProps, unknown> {
    readonly containerStyle: React.CSSProperties;
    /**
     * Constructor
     *
     * @param props Record Section Labels props as RecordSectionLabelsProps
     */
    constructor(props: RecordSectionLabelsProps);
    /**
     * @returns labels as any[]
     */
    getLabels(): any[];
    render(): JSX.Element;
}
//# sourceMappingURL=labels.d.ts.map