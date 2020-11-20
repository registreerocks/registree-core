import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'nestjs-graphql-dataloader';
import { CustomersService } from '../customers.service';
import { Customer } from '../models/customer.model';

@Injectable({ scope: Scope.REQUEST })
export class CustomersLoader extends OrderedNestDataLoader<string, Customer> {
  constructor(private readonly customersService: CustomersService) {
    super();
  }

  protected getOptions = () => ({
    query: (keys: readonly string[]) =>
      this.customersService.getCustomersById(keys),
  });
}
