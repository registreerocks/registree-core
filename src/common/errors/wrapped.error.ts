export class WrappedError<T = unknown> {
  constructor(
    public readonly baseError: T,
    public readonly handlerClass: string,
    public readonly handler: string,
  ) {}
}
