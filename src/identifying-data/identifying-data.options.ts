import { Type } from '@nestjs/common';

export interface IdentifyingDataOptions {
  identifyingApi: string;
}
export interface IdentifyingDataAsyncOptions {
  useExisting: Type<IdentifyingDataOptionsFactory>;
}
export interface IdentifyingDataOptionsFactory {
  createIdentifyingDataOptions():
    | Promise<IdentifyingDataOptions>
    | IdentifyingDataOptions;
}
