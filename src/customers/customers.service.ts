import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CustomersDataProvider } from './customers.data-provider';

@Injectable()
export class CustomersService {
  constructor(private readonly dataProvider: CustomersDataProvider) {}

  async findOneById(id: string, token: string): Promise<Customer> {
    const result = await this.dataProvider.findOneCustomer(id, token);
    return {
      id: result._id,
      billingDetails: {
        city: result.billing_address.city,
        country: result.billing_address.country,
        line1: result.billing_address.line_1,
        line2: result.billing_address.line_2,
        province: result.billing_address.province,
        zip: result.billing_address.zip,
        vat: result.vat,
      },
      name: result.name,
      description: result.description,
      contact: {
        name: result.contact.name,
        email: result.contact.email,
      },
    };
  }
}
