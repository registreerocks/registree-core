import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FsStorageService } from './fs-storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3StorageService } from './s3-storage.service';
import storageConfig from 'src/config/storage.config';

// TODO The correct way to do this is to use dynamic modules, and not rely on the config service at this point
const objectStorageFactory = (configService: ConfigService) => {
  if (configService.get<string>('storage.useLocal')) {
    return new FsStorageService();
  } else {
    return new S3StorageService(configService);
  }
};

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [
    UploadService,
    {
      provide: 'IObjectStorageProvider',
      useFactory: objectStorageFactory,
      inject: [ConfigService],
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
