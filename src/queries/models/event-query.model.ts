import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { EventDetails } from './event-details.model';
import { QueryDetails } from './query-details.model';
import { Quote } from '../../pricing/models/quote.model';
import { Customer } from 'src/customers/models/customer.model';

@ObjectType()
export class EventQuery {
  @Field(_type => ID)
  id!: string;

  customerId!: string;

  @Field(_type => Customer)
  customer?: Customer;

  @Field(_type => EventDetails)
  eventDetails!: EventDetails;

  @Field(_type => QueryDetails)
  queryDetails!: QueryDetails;

  @Field(_type => Quote)
  quoteDetails?: Quote;

  @Field(_type => Float)
  currentPrice?: number;
}
