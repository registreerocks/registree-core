import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';
import { CreateCustomerInput } from './dto/create-customer.input';

@Resolver(_of => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(_returns => Customer, { name: 'customer' })
  @UseGuards(GqlAuthGuard)
  async getCurrentCustomer(@CurrentUser() user: User): Promise<Customer> {
    const result = await this.customersService.findOneByUserId(user.dbId);
    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Mutation(_returns => Customer)
  async createCustomer(
    @Args({ name: 'createCustomerInput', type: () => CreateCustomerInput })
    input: CreateCustomerInput,
  ): Promise<Customer> {
    const result = await this.customersService.createCustomer(input);
    return result;
  }
}
