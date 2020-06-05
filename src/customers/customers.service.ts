import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';

@Injectable()
export class CustomersService {
  async findOneById(id: string): Promise<Customer> {
    return {
      id,
      name: 'tst',
      description: 'testDesc',
    };
  }
}
