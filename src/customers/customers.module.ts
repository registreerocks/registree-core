import { Module } from '@nestjs/common';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { CustomersDataProvider } from './customers.data-provider';
import apiConfig from 'src/config/api.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(apiConfig)],
  providers: [CustomersResolver, CustomersService, CustomersDataProvider],
})
export class CustomersModule {}
