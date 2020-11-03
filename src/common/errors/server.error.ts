export class ServerError extends Error {
  constructor(
    public readonly baseError: unknown,
    public readonly handlerClass: string,
    public readonly handler: string,
  ) {
    super('Internal Server Error');
  }
}
