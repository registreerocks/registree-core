import { Type } from '@nestjs/common';

export interface LinkingDataOptions {
  linkingApi: string;
}
export interface LinkingDataAsyncOptions {
  useExisting: Type<LinkingDataOptionsFactory>;
}
export interface LinkingDataOptionsFactory {
  createLinkingDataOptions(): Promise<LinkingDataOptions> | LinkingDataOptions;
}
