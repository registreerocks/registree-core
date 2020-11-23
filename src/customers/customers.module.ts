import { Module, DynamicModule } from '@nestjs/common';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './models/customer.model';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';
import { CustomersController } from './customers.controller';
import { CustomersLoader } from './loaders/customers.loader';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],

  exports: [CustomersService, CustomersLoader],
  providers: [CustomersResolver, CustomersService, CustomersLoader],
  controllers: [CustomersController],
})
export class CustomersModule {
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    return {
      module: CustomersModule,
      imports: [Auth0DataModule.forRootAsync(options)],
    };
  }
}
