import { Type } from '@nestjs/common';

export interface MessagingOptions {
  accountSid: string;
  authToken: string;
}
export interface MessagingOptionsFactory {
  createMessagingOptions(): Promise<MessagingOptions> | MessagingOptions;
}
export interface MessagingAsyncOptions {
  useExisting: Type<MessagingOptionsFactory>;
}
