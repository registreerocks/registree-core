import { AuthConfig } from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import {
  QueryDataOptionsFactory,
  QueryDataOptions,
} from 'src/query-data/query-data.options';
import { ApiConfig } from './config/api.config';
import { UploadOptionsFactory, UploadOptions } from 'src/upload/upload.options';
import { StorageConfig } from './config/storage.config';
import { AuthOptionsFactory, AuthOptions } from 'src/auth/auth.options';

@Injectable()
export class AppConfigService
  implements AuthOptionsFactory, QueryDataOptionsFactory, UploadOptionsFactory {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,

    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,

    @Inject(ApiConfig.KEY)
    private readonly apiConfig: ConfigType<typeof ApiConfig>,

    @Inject(StorageConfig.KEY)
    private readonly storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  createAuthOptions(): AuthOptions {
    return this.authConfig;
  }

  createQueryDataOptions(): QueryDataOptions {
    return {
      queryApi: this.apiConfig.queryApi,
    };
  }
  createUploadOptions(): UploadOptions {
    return {
      accessKeyId: this.storageConfig.accessKeyId,
      endpoint: this.storageConfig.endpoint,
      secretAccessKey: this.storageConfig.secretAccessKey,
      useLocal: this.storageConfig.useLocal,
    };
  }

    createAppParams(): ConfigType<typeof AppConfig> {
    return this.appConfig;
  }
}
