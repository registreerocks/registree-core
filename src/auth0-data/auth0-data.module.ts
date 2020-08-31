import { Module, DynamicModule, Provider } from '@nestjs/common';
import { Auth0DataService } from './auth0-data.service';
import {
  Auth0DataOptionsFactory,
  Auth0DataAsyncOptions,
  Auth0DataOptions,
} from './auth0-data.options';
import { AUTH0_DATA_OPTIONS } from './auth0-data.constants';

@Module({
  providers: [Auth0DataService],
  exports: [Auth0DataService],
})
export class Auth0DataModule {
  static forRoot(options: Auth0DataOptions): DynamicModule {
    const optionsProvider: Provider<Auth0DataOptions> = {
      provide: AUTH0_DATA_OPTIONS,
      useValue: options,
    };
    return {
      module: Auth0DataModule,
      providers: [optionsProvider],
    };
  }
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    const optionsProvider: Provider<
      Auth0DataOptions | Promise<Auth0DataOptions>
    > = {
      provide: AUTH0_DATA_OPTIONS,
      useFactory: async (optionsFactory: Auth0DataOptionsFactory) =>
        await optionsFactory.createAuth0DataOptions(),
      inject: [options.useExisting],
    };
    return {
      module: Auth0DataModule,
      providers: [optionsProvider],
    };
  }
}
