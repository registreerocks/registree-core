import { Module, DynamicModule, Provider} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FsStorageService } from './fs-storage.service';
import { S3StorageService } from './s3-storage.service';
import { UPLOAD_OPTIONS, OBJECT_STORAGE } from './upload.constants';
import {
  UploadOptionsFactory,
  UploadOptions,
  UploadAsyncOptions,
} from './upload.options';
import { IObjectStorageProvider } from './interfaces/object-storage-provider.interface';


@Module({
  providers: [
    UploadService,
  ],
  exports: [UploadService],
})
export class UploadModule {
  static forRootAsync(options: UploadAsyncOptions): DynamicModule {
    const optionsProvider: Provider<UploadOptions | Promise<UploadOptions>> = {
      provide: UPLOAD_OPTIONS,
      useFactory: async (optionsFactory: UploadOptionsFactory) =>
        await optionsFactory.createUploadOptions(),
      inject: [options.useExisting],
    };

    const objectStorageProvider: Provider<
      IObjectStorageProvider | Promise<IObjectStorageProvider>
    > = {
      provide: OBJECT_STORAGE,
      inject: [options.useExisting],
      useFactory: async (optionsFactory: UploadOptionsFactory) => {
        const options = await optionsFactory.createUploadOptions();
        if (options.useLocal) {
          return new FsStorageService();
        } else {
          return new S3StorageService(options);
        }
      },
    };

    return {
      module: UploadModule,
      providers: [optionsProvider, objectStorageProvider],
    };
  }
}
