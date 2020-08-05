import { Type } from '@nestjs/common/interfaces';

export interface AuthOptions {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  ignoreExpiration: boolean;
}

export interface AuthAsyncOptions {
  useExisting: Type<AuthOptionsFactory>;
}

export interface AuthOptionsFactory {
  createAuthOptions(): Promise<AuthOptions> | AuthOptions;
}
