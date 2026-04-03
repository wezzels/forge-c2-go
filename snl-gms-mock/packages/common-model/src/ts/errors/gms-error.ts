export class GMSError extends Error {
  public readonly id: string;

  public constructor(message: string, id: string = 'error') {
    super(message);
    Object.setPrototypeOf(this, GMSError.prototype);
    this.id = id;
  }
}
