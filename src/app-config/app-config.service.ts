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
import { PricingConfig } from './config/pricing.config';
import {
  PricingOptionsFactory,
  PricingOptions,
} from 'src/pricing/pricing.options';
import { StudentDataOptions } from 'src/student-data/student-data.options';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import {
  Auth0DataOptionsFactory,
  Auth0DataOptions,
} from 'src/auth0-data/auth0-data.options';

@Injectable()
export class AppConfigService
  implements
    AuthOptionsFactory,
    QueryDataOptionsFactory,
    UploadOptionsFactory,
    PricingOptionsFactory,
    MongooseOptionsFactory,
    Auth0DataOptionsFactory {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,

    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,

    @Inject(ApiConfig.KEY)
    private readonly apiConfig: ConfigType<typeof ApiConfig>,

    @Inject(StorageConfig.KEY)
    private readonly storageConfig: ConfigType<typeof StorageConfig>,

    @Inject(PricingConfig.KEY)
    private readonly pricingConfig: ConfigType<typeof PricingConfig>,
  ) {}

  createAuthOptions(): AuthOptions {
    return this.authConfig;
  }

  createQueryDataOptions(): QueryDataOptions {
    return {
      queryApi: this.apiConfig.queryApi,
    };
  }

  createAuth0DataOptions(): Auth0DataOptions {
    return {
      managementApi: this.authConfig.managementApi,
      connection: this.authConfig.connection,
    };
  }

  createStudentDataOptions(): StudentDataOptions {
    return {
      studentApis: this.apiConfig.studentApis,
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

  createPricingOptions(): PricingOptions {
    return this.pricingConfig;
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.appConfig.mongoUri,
      sslValidate: false,
    };
  }
}
