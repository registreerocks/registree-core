import {
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiKeyAuthGuard } from 'src/auth/apiKey-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(ApiKeyAuthGuard)
  @Get('customerId')
  async getCustomerIdByContactUserId(
    @Query('userId') userId: string,
  ): Promise<string> {
    const customer = await this.customersService.findOneByUserId(userId);
    if (customer) return customer.id;
    else throw new NotFoundException();
  }
}
