import { Module, DynamicModule } from '@nestjs/common';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './models/customer.model';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [CustomersResolver, CustomersService],
})
export class CustomersModule {
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    return {
      module: CustomersModule,
      imports: [Auth0DataModule.forRootAsync(options)],
    };
  }
}
