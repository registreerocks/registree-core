import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Contact } from './models/contact.model';
import { CreateUserInput } from './dto/create-user.input';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import { connectionFromArray } from 'graphql-relay';
import { CustomerConnection } from './models/pagination/customer-connection.model';

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

  @Query(_returns => Customer)
  @UseGuards(GqlAuthGuard)
  async getCustomer(
    @Args({ name: 'customerId', type: () => ID })
    customerId: string,
  ): Promise<Customer> {
    const result = await this.customersService.findOneByCustomerId(customerId);
    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Query(_returns => CustomerConnection)
  @UseGuards(GqlAuthGuard)
  async getCustomers(
    @Args() args: PaginationArgs,
  ): Promise<CustomerConnection> {
    const result = await this.customersService.findAll();
    // TODO: default sorting
    const paginatedCustomers = connectionFromArray(result, args);

    return {
      ...paginatedCustomers,
      totalCount: result.length,
    };
  }

  @Mutation(_returns => Customer)
  async createCustomer(
    @Args({ name: 'createCustomerInput', type: () => CreateCustomerInput })
    input: CreateCustomerInput,
  ): Promise<Customer> {
    const result = await this.customersService.createCustomer(input);
    return result;
  }

  @Mutation(_returns => Contact)
  async createUser(
    @Args({ name: 'createUserInput', type: () => CreateUserInput })
    input: CreateUserInput,
  ): Promise<Contact> {
    const result = await this.customersService.createUser(input);
    return result;
  }
}
