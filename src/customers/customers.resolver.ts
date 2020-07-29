import { Resolver, Query } from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { BearerToken } from 'src/auth/bearer-token.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(_returns => Customer, { name: 'customer' })
  @UseGuards(GqlAuthGuard)
  async getCustomer(
    @CurrentUser() user: User,
    @BearerToken() token: string,
  ): Promise<Customer> {
    return this.customersService.findOneById(user.dbId, token);
  }

  // @Mutation(_returns => Customer)
  // async setCustomer(): Promise<Customer> {
  //   return this.customersService.setCustomer(id);
  // }
}
