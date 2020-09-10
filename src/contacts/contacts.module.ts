import { Module, DynamicModule } from '@nestjs/common';
import { ContactsResolver } from './contacts.resolver';
import { ContactsService } from './contacts.service';
import { Auth0DataModule } from 'src/auth0-data/auth0-data.module';
import { Auth0DataAsyncOptions } from 'src/auth0-data/auth0-data.options';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  providers: [ContactsResolver, ContactsService],
})
export class ContactsModule {
  static forRootAsync(options: Auth0DataAsyncOptions): DynamicModule {
    return {
      module: ContactsModule,
      imports: [
        Auth0DataModule.forRootAsync(options),
        CustomersModule.forRootAsync(options),
      ],
    };
  }
}
