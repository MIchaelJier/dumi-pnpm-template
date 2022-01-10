export class HttpError extends Error {
  statusCode: any;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  toString() {
    return this.message;
  }
}
