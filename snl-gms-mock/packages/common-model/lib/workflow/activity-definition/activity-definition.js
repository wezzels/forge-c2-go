/**
 * Assert the object is {@link FilterDefinitionRealization} or throw
 * @param object the object to check
 */
export function isScanActivityDefinition(object) {
    if (Object.keys(object).includes('virtualEventHypocenter'))
        return true;
    return false;
}
//# sourceMappingURL=activity-definition.js.map