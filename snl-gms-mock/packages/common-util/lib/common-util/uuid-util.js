import v4 from 'uuid/v4';
import v5 from 'uuid/v5';
/**
 * Generate a UUID string
 */
function asString() {
    return v4().toString();
}
/**
 * Generate a UUID string
 */
export const uuid4 = () => v4().toString();
export const uuid = {
    asString
};
/**
 * Generates a V5 uuid
 *
 * See: {@link https://www.npmjs.com/package/uuid#uuidv5name-namespace-buffer-offset | NPM Docs}
 *
 * @param name
 * @param namespace
 * @returns
 */
export const uuid5 = (name, namespace) => v5(name, namespace).toString();
//# sourceMappingURL=uuid-util.js.map