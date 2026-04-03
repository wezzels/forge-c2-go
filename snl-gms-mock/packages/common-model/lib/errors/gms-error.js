export class GMSError extends Error {
    id;
    constructor(message, id = 'error') {
        super(message);
        Object.setPrototypeOf(this, GMSError.prototype);
        this.id = id;
    }
}
//# sourceMappingURL=gms-error.js.map