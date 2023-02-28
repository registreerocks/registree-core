import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import {
  MessagingAsyncOptions,
  MessagingOptions,
  MessagingOptionsFactory,
} from './messaging.options';
import { MESSAGING_OPTIONS } from './messaging.constants';

@Module({
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {
  static forRootAsync(options: MessagingAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      MessagingOptions | Promise<MessagingOptions>
    > = {
      provide: MESSAGING_OPTIONS,
      useFactory: async (optionsFactory: MessagingOptionsFactory) =>
        await optionsFactory.createMessagingOptions(),
      inject: [options.useExisting],
    };
    return {
      module: MessagingModule,
      providers: [optionsProvider],
    };
  }
}
