import { Module, DynamicModule, Provider } from '@nestjs/common';
import { LinkingDataService } from './linking-data.service';
import {
  LinkingDataOptionsFactory,
  LinkingDataOptions,
  LinkingDataAsyncOptions,
} from './linking-data.options';
import { LINKING_DATA_OPTIONS } from './linking-data.constants';

@Module({
  providers: [LinkingDataService],
  exports: [LinkingDataService],
})
export class LinkingDataModule {
  static forRootAsync(options: LinkingDataAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      LinkingDataOptions | Promise<LinkingDataOptions>
    > = {
      provide: LINKING_DATA_OPTIONS,
      useFactory: async (optionsFactory: LinkingDataOptionsFactory) =>
        await optionsFactory.createLinkingDataOptions(),
      inject: [options.useExisting],
    };
    return {
      module: LinkingDataModule,
      providers: [optionsProvider],
    };
  }
}
