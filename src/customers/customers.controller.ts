import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('customerId')
  async getCustomerIdByContactUserId(
    @Query('userId') userId: string,
  ): Promise<string> {
    const customer = await this.customersService.findOneByUserId(userId);
    if (customer) return customer.id;
    else throw new NotFoundException();
  }
}
