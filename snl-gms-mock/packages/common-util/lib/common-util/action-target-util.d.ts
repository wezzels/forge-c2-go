/**
 * Takes selected ids and using the right clicked id determines if action target
 * is only the right clicked or all of the selected and updates action targets
 *
 * @param selectedIds selected ids that can be action targets
 * @param rightClickedId right clicked id used to determine if in selectedIds
 * @returns Object { isRightClickInSelected, actionTargets }
 */
export declare const determineActionTargetsFromRightClick: (selectedIds: string[], rightClickedId: string) => {
    isRightClickInSelected: boolean;
    actionTargets: string[];
};
/**
 * Takes selected ids and using the right clicked id determines if action target
 * is only the right clicked or all of the selected and updates action targets
 *
 * @param selectedIds selected ids that can be action targets
 * @param rightClickedId right clicked id used to determine if in selectedIds
 * @param function to updated action targets in state
 * @returns Object { isRightClickInSelected, actionTargets }
 */
export declare const determineActionTargetsFromRightClickAndSetActionTargets: (selectedIds: string[], rightClickedId: string, updateActionTargets: (targetIds: string[]) => void) => {
    isRightClickInSelected: boolean;
    actionTargets: string[];
};
//# sourceMappingURL=action-target-util.d.ts.map