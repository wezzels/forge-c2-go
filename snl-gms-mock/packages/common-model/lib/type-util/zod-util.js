import { z } from 'zod';
import { GMSError } from '../errors/gms-error';
export function isValidZodLiteralUnion(literals) {
    return literals.length >= 2;
}
export function constructZodLiteralUnionType(literals) {
    if (!isValidZodLiteralUnion(literals)) {
        throw new Error('Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2');
    }
    return z.union(literals);
}
export class ZodValidationError extends GMSError {
    id;
    constructor(error, id, parsedValue) {
        const message = `Invalid data structure from ${id}`;
        super(message);
        Object.setPrototypeOf(this, ZodValidationError.prototype);
        this.id = id;
        const errorReport = { issues: error.issues };
        if (parsedValue !== undefined) {
            errorReport.response = parsedValue;
        }
        console.error(`[Zod Validation Error]: ${message}`, {
            id,
            message,
            issues: error.issues,
            parsedValue
        });
    }
}
//# sourceMappingURL=zod-util.js.map