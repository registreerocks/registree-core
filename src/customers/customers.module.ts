import { Module } from '@nestjs/common';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { CustomersDataProvider } from './customers.data-provider';
import { ConfigModule } from '@nestjs/config';
import { ApiConfig } from 'src/app-config/config/api.config';

@Module({
  imports: [ConfigModule.forFeature(ApiConfig)],
  providers: [CustomersResolver, CustomersService, CustomersDataProvider],
})
export class CustomersModule {}
