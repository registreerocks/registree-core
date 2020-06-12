import { Module } from '@nestjs/common';
import { QueriesResolver } from './queries.resolver';
import { QueriesService } from './queries.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  providers: [QueriesResolver, QueriesService],
})
export class QueriesModule {}
