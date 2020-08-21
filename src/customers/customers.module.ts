import { Module } from '@nestjs/common';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { ConfigModule } from '@nestjs/config';
import { ApiConfig } from 'src/app-config/config/api.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './models/customer.model';

@Module({
  imports: [
    ConfigModule.forFeature(ApiConfig),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [CustomersResolver, CustomersService],
})
export class CustomersModule {}
