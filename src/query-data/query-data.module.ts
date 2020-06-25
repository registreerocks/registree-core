import { Module } from '@nestjs/common';
import { QueryDataService } from './query-data.service';
import { ConfigModule } from '@nestjs/config';
import apiConfig from 'src/config/api.config';

@Module({
  imports: [ConfigModule.forFeature(apiConfig)],
  providers: [QueryDataService],
  exports: [QueryDataService],
})
export class QueryDataModule {}
