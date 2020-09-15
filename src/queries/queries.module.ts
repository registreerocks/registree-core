import { Module, DynamicModule } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { UploadModule } from 'src/upload/upload.module';
import { QueryDataModule } from 'src/query-data/query-data.module';
import { QueryDataAsyncOptions } from 'src/query-data/query-data.options';
import { UploadAsyncOptions } from 'src/upload/upload.options';
import { EventDetailsResolver } from './resolvers/event-details.resolver';
import { EventQueriesResolver } from './resolvers/event-queries.resolver';
import { PricingModule } from 'src/pricing/pricing.module';
import { PricingAsyncOptions } from 'src/pricing/pricing.options';
import { QueryDetailsResolver } from './resolvers/query-details.resolver';
import { CustomersModule } from 'src/customers/customers.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { IdentifyingDataModule } from 'src/identifying-data/identifying-data.module';
import { LinkingDataModule } from 'src/linking-data/linking-data.module';
import { IdentifyingDataAsyncOptions } from 'src/identifying-data/identifying-data.options';
import { LinkingDataAsyncOptions } from 'src/linking-data/linking-data.options';

@Module({
  providers: [
    EventQueriesResolver,
    EventDetailsResolver,
    QueriesService,
    QueryDetailsResolver,
  ],
})
export class QueriesModule {
  static forRootAsync(
    options: QueryDataAsyncOptions &
      UploadAsyncOptions &
      PricingAsyncOptions &
      Auth0DataAsyncOptions &
      IdentifyingDataAsyncOptions &
      LinkingDataAsyncOptions,
  ): DynamicModule {
    return {
      module: QueriesModule,
      imports: [
        Auth0DataModule.forRootAsync(options),
        PricingModule.forRootAsync(options),
        QueryDataModule.forRootAsync(options),
        UploadModule.forRootAsync(options),
        CustomersModule.forRootAsync(options),
        IdentifyingDataModule.forRootAsync(options),
        LinkingDataModule.forRootAsync(options),
      ],
    };
  }
}
