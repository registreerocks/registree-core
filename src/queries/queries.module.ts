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

@Module({
  providers: [EventQueriesResolver, EventDetailsResolver, QueriesService],
})
export class QueriesModule {
  static forRootAsync(
    options: QueryDataAsyncOptions & UploadAsyncOptions & PricingAsyncOptions,
  ): DynamicModule {
    return {
      module: QueriesModule,
      imports: [
        PricingModule.forRootAsync(options),
        QueryDataModule.forRootAsync(options),
        UploadModule.forRootAsync(options),
      ],
    };
  }
}
