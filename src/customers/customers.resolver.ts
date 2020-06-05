import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';

@Resolver(_of => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(_returns => Customer, { name: 'customer' })
  async getCustomer(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Customer> {
    return this.customersService.findOneById(id);
  }

  // @Mutation(_returns => Customer)
  // async setCustomer(): Promise<Customer> {
  //   return this.customersService.setCustomer(id);
  // }
}
