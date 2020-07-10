import { Module, DynamicModule } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { UploadModule } from 'src/upload/upload.module';
import { QueryDataModule } from 'src/query-data/query-data.module';
import { QueryDataAsyncOptions } from 'src/query-data/query-data.options';
import { UploadAsyncOptions } from 'src/upload/upload.options';
import { EventDetailsResolver } from './resolvers/event-details.resolver';
import { EventQueriesResolver } from './resolvers/event-queries.resolver';

@Module({
  providers: [EventQueriesResolver, EventDetailsResolver, QueriesService],
})
export class QueriesModule {
  static forRootAsync(
    options: QueryDataAsyncOptions & UploadAsyncOptions,
  ): DynamicModule {
    return {
      module: QueriesModule,
      imports: [
        QueryDataModule.forRootAsync(options),
        UploadModule.forRootAsync(options),
      ],
    };
  }
}
