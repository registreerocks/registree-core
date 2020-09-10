import { Module, DynamicModule } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';

@Module({
  providers: [UsersResolver, UsersService],
})
export class UsersModule {
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    return {
      module: UsersModule,
      imports: [Auth0DataModule.forRootAsync(options)],
    };
  }
}
