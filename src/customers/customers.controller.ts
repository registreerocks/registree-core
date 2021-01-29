import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiKeyAuthGuard } from 'src/auth/apiKey-auth.guard';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Customer } from './models/customer.model';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(ApiKeyAuthGuard)
  @Get()
  async getCustomers(): Promise<Customer | Customer[]> {
    const customers = await this.customersService.findAll();
    if (customers) return customers;
    else throw new NotFoundException();
  }

  // XXX: This overlaps with getCustomerById() below (so the order matters).
  //
  // FIXME: These methods need reworking and testing.
  // See https://github.com/registreerocks/registree-core/issues/361
  @UseGuards(ApiKeyAuthGuard)
  @Get('customerId')
  async getCustomerIdByContactUserId(
    @Query('userId') userId: string,
  ): Promise<string> {
    const customer = await this.customersService.findOneByUserId(userId);
    if (customer) return customer.id;
    else throw new NotFoundException();
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get(':id')
  async getCustomerById(@Param('id') customerId: string): Promise<Customer> {
    const customer = await this.customersService.findOneByCustomerId(
      customerId,
    );
    if (customer) return customer;
    else throw new NotFoundException();
  }

  @UseGuards(ApiKeyAuthGuard)
  @Post('create')
  async createCustomer(@Body() input: CreateCustomerInput): Promise<Customer> {
    const customer = await this.customersService.createCustomer(input);
    return customer;
  }
}
