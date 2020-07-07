import { Type } from '@nestjs/common';

export interface UploadOptions {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  useLocal: boolean;
}
export interface UploadAsyncOptions {
  useExisting: Type<UploadOptionsFactory>;
}
export interface UploadOptionsFactory {
  createUploadOptions(): Promise<UploadOptions> | UploadOptions;
}
