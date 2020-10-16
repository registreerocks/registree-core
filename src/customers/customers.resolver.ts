import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';
import { NotFoundException } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';
import { CreateCustomerInput } from './dto/create-customer.input';
import { PaginationArgs } from 'src/common/pagination/pagination-args';
import { connectionFromArray } from 'graphql-relay';
import { CustomerConnection } from './models/pagination/customer-connection.model';
import { UpdateCustomerDetailsInput } from './dto/update-customer-details.input';
import { UpdateBillingDetailsInput } from './dto/update-billing-details.input';
import { Contact } from 'src/contacts/models/contact.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { GetUserResponse } from 'src/auth0-data/dto/get-user.response';

@Resolver(_of => Customer)
export class CustomersResolver {
  constructor(
    private readonly customersService: CustomersService,
    private readonly auth0DataService: Auth0DataService,
  ) {}

  @Query(_returns => Customer, { name: 'customer' })
  async getCurrentCustomer(@CurrentUser() user: User): Promise<Customer> {
    const result = await this.customersService.findOneByUserId(user.userId);
    if (result) {
      return result;
    } else {
      throw new NotFoundException();
    }
  }

  @Query(_returns => Customer)
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
  updateBillingDetails(
    @Args({ name: 'customerId', type: () => ID })
    customerId: string,
    @Args('updateBillingDetailsInput')
    input: UpdateBillingDetailsInput,
  ): Promise<Customer> {
    return this.customersService.updateBillingDetails(customerId, input);
  }

  @Mutation(_returns => Customer)
  updateCustomerDetails(
    @Args({ name: 'customerId', type: () => ID }) customerId: string,
    @Args('updateCustomerDetailsInput')
    input: UpdateCustomerDetailsInput,
  ): Promise<Customer> {
    return this.customersService.updateCustomerDetails(customerId, input);
  }

  @Mutation(_returns => Customer)
  async createCustomer(
    @Args({ name: 'createCustomerInput', type: () => CreateCustomerInput })
    input: CreateCustomerInput,
  ): Promise<Customer> {
    const result = await this.customersService.createCustomer(input);
    return result;
  }

  @ResolveField('contacts', _returns => [Contact])
  async getContacts(@Parent() customer: Customer): Promise<Contact[]> {
    return Promise.all(
      customer.contactIds.map(async contactId => {
        const user = await this.auth0DataService.getUser(contactId);
        return this.getContactResponseMapper(user);
      }),
    );
  }

  private getContactResponseMapper(response: GetUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
      dbId: response.app_metadata.db_id,
    };
  }
}
