import { Type } from '@nestjs/common';

export interface UploadOptionsLocal {
  useLocal: true;
}

export interface UploadOptionsS3 {
  useLocal: false;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export type UploadOptions = UploadOptionsLocal | UploadOptionsS3;

export interface UploadAsyncOptions {
  useExisting: Type<UploadOptionsFactory>;
}
export interface UploadOptionsFactory {
  createUploadOptions(): Promise<UploadOptions> | UploadOptions;
}
