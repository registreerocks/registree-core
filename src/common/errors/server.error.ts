export class ServerError extends Error {
  constructor(message: string, public readonly innerError?: unknown) {
    super(message);
  }
}
