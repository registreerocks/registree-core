import { Module, DynamicModule } from '@nestjs/common';
import { StudentsResolver } from './resolvers/students.resolver';
import { StudentsService } from './students.service';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';
import { QueryDataAsyncOptions } from 'src/query-data/query-data.options';
import { LinkingDataAsyncOptions } from 'src/linking-data/linking-data.options';
import { IdentifyingDataAsyncOptions } from 'src/identifying-data/identifying-data.options';
import { QueryDataModule } from 'src/query-data/query-data.module';
import { LinkingDataModule } from 'src/linking-data/linking-data.module';
import { IdentifyingDataModule } from 'src/identifying-data/identifying-data.module';
import { CustomersModule } from 'src/customers/customers.module';
import { HostResolver } from './resolvers/host.resolver';

@Module({
  providers: [StudentsResolver, StudentsService, HostResolver],
})
export class StudentsModule {
  static forRootAsync(
    options: Auth0DataAsyncOptions &
      QueryDataAsyncOptions &
      LinkingDataAsyncOptions &
      IdentifyingDataAsyncOptions,
  ): DynamicModule {
    return {
      module: StudentsModule,
      imports: [
        Auth0DataModule.forRootAsync(options),
        QueryDataModule.forRootAsync(options),
        LinkingDataModule.forRootAsync(options),
        IdentifyingDataModule.forRootAsync(options),
        CustomersModule.forRootAsync(options),
      ],
    };
  }
}
