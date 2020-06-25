import { Module } from '@nestjs/common';
import { QueriesResolver } from './queries.resolver';
import { QueriesService } from './queries.service';
import { UploadModule } from 'src/upload/upload.module';
import { QueryDataModule } from 'src/query-data/query-data.module';

@Module({
  imports: [UploadModule, QueryDataModule],
  providers: [QueriesResolver, QueriesService],
})
export class QueriesModule {}
