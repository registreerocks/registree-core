import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { Host } from '../models/host.model';
import { CustomersService } from 'src/customers/customers.service';

@Resolver(_of => Host)
export class HostResolver {
  constructor(private readonly customersService: CustomersService) {}
  @ResolveField('name', _returns => String)
  async getEventHostName(@Parent() host: Host): Promise<string> {
    const customer = await this.customersService.findOneByCustomerId(host.id);
    if (customer) {
      return customer.name;
    } else {
      throw new Error('Host not found.');
    }
  }
}
