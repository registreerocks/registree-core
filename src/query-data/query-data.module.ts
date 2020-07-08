import { Module, DynamicModule, Provider } from '@nestjs/common';
import { QueryDataService } from './query-data.service';
import {
  QueryDataOptionsFactory,
  QueryDataAsyncOptions,
  QueryDataOptions,
} from './query-data.options';
import { QUERY_DATA_OPTIONS } from './query-data.constants';

@Module({
  providers: [QueryDataService],
  exports: [QueryDataService],
})
export class QueryDataModule {
  static forRoot(options: QueryDataOptions): DynamicModule {
    const optionsProvider: Provider<QueryDataOptions> = {
      provide: QUERY_DATA_OPTIONS,
      useValue: options,
    };
    return {
      module: QueryDataModule,
      providers: [optionsProvider],
    };
  }
  static forRootAsync(options: QueryDataAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      QueryDataOptions | Promise<QueryDataOptions>
    > = {
      provide: QUERY_DATA_OPTIONS,
      useFactory: async (optionsFactory: QueryDataOptionsFactory) =>
        await optionsFactory.createQueryDataOptions(),
      inject: [options.useExisting],
    };
    return {
      module: QueryDataModule,
      providers: [optionsProvider],
    };
  }
}
