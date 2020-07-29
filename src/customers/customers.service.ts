import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CustomersDataProvider } from './customers.data-provider';
import { mapCustomerDetails } from './mappers/mapCustomerDetails';

@Injectable()
export class CustomersService {
  constructor(private readonly dataProvider: CustomersDataProvider) {}

  async findOneById(id: string, token: string): Promise<Customer> {
    const response = await this.dataProvider.findOneCustomer(id, token);
    return mapCustomerDetails(response);
  }
}
