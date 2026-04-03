export function assertNotNullish(val, name) {
    if (val == null) {
        throw new Error(`Null assertion failure. ${name} cannot be null`);
    }
}
//# sourceMappingURL=type-util.js.map