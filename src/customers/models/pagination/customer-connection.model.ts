import { ObjectType, Int, Field } from '@nestjs/graphql';
import { Customer } from '../customer.model';
import PaginatedResponse from '../../../common/pagination/pagination';

@ObjectType()
export class CustomerConnection extends PaginatedResponse(Customer) {
  @Field(_type => Int)
  totalCount!: number;
}
