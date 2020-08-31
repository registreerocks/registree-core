import { Type } from '@nestjs/common';

export interface Auth0DataOptions {
  managementApi: string;
  connection: string;
}
export interface Auth0DataAsyncOptions {
  useExisting: Type<Auth0DataOptionsFactory>;
}
export interface Auth0DataOptionsFactory {
  createAuth0DataOptions(): Promise<Auth0DataOptions> | Auth0DataOptions;
}
