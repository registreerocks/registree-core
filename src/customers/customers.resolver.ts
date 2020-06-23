import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { BearerToken } from 'src/auth/bearer-token.decorator';

@Resolver(_of => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(_returns => Customer, { name: 'customer' })
  @UseGuards(GqlAuthGuard)
  async getCustomer(
    @Args('id', { type: () => ID }) id: string,
    @BearerToken() token: string,
  ): Promise<Customer> {
    return this.customersService.findOneById(id, token);
  }

  // @Mutation(_returns => Customer)
  // async setCustomer(): Promise<Customer> {
  //   return this.customersService.setCustomer(id);
  // }
}
