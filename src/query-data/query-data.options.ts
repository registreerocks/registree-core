import { Type } from '@nestjs/common';

export interface QueryDataOptions {
  queryApi: string;
}
export interface QueryDataAsyncOptions {
  useExisting: Type<QueryDataOptionsFactory>;
}
export interface QueryDataOptionsFactory {
  createQueryDataOptions(): Promise<QueryDataOptions> | QueryDataOptions;
}
