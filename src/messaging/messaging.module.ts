import { DynamicModule, Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import {
  TwilioModule,
  TwilioModuleAsyncOptions,
  TwilioOptionsFactory,
} from 'nestjs-twilio';

@Module({
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {
  static forRootAsync(options: TwilioModuleAsyncOptions): DynamicModule {
    return TwilioModule.forRootAsync({
      useFactory: async (optionsFactory: TwilioOptionsFactory) =>
        await optionsFactory.createTwilioOptions(),
      inject: [options.useExisting],
    });
  }
}
