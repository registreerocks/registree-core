import { Module, DynamicModule, Provider } from '@nestjs/common';
import { IdentifyingDataService } from './identifying-data.service';
import {
  IdentifyingDataOptionsFactory,
  IdentifyingDataOptions,
  IdentifyingDataAsyncOptions,
} from './identifying-data.options';
import { IDENTIFYING_DATA_OPTIONS } from './identifying-data.constants';

@Module({
  providers: [IdentifyingDataService],
  exports: [IdentifyingDataService],
})
export class IdentifyingDataModule {
  static forRootAsync(options: IdentifyingDataAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      IdentifyingDataOptions | Promise<IdentifyingDataOptions>
    > = {
      provide: IDENTIFYING_DATA_OPTIONS,
      useFactory: async (optionsFactory: IdentifyingDataOptionsFactory) =>
        await optionsFactory.createIdentifyingDataOptions(),
      inject: [options.useExisting],
    };
    return {
      module: IdentifyingDataModule,
      providers: [optionsProvider],
    };
  }
}
