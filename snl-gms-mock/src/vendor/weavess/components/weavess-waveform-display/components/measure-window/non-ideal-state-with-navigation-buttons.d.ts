import React from 'react';
export interface NonIdealStateWithNavigationButtonsProps {
    icon: string | undefined;
    title: string | undefined;
    description: string | undefined;
    buttonCallback: (reverse?: boolean | undefined) => void;
    buttonDisabled: boolean | undefined;
}
export declare function NonIdealStateWithNavigationButtons(props: Readonly<NonIdealStateWithNavigationButtonsProps>): React.JSX.Element;
//# sourceMappingURL=non-ideal-state-with-navigation-buttons.d.ts.map