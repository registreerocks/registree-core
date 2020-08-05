import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import {
  AuthOptions,
  AuthAsyncOptions,
  AuthOptionsFactory,
} from './auth.options';
import { AUTH_OPTIONS } from './auth.constants';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, AuthService],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {
  static forRootAsync(params: AuthAsyncOptions): DynamicModule {
    const paramsProvider: Provider<AuthOptions | Promise<AuthOptions>> = {
      provide: AUTH_OPTIONS,
      useFactory: async (optionsFactory: AuthOptionsFactory) =>
        await optionsFactory.createAuthOptions(),
      inject: [params.useExisting],
    };
    return {
      global: true,
      module: AuthModule,
      providers: [paramsProvider],
    };
  }
}
