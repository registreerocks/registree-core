import { Field, ObjectType, ID } from '@nestjs/graphql';
import { EventDetails } from './event-details.model';
import { QueryDetails } from './query-details.model';
import { Quote } from '../../pricing/models/quote.model';

@ObjectType()
export class EventQuery {
  @Field(_type => ID)
  id!: string;

  @Field(_type => ID)
  customerId!: string;

  @Field(_type => EventDetails)
  eventDetails!: EventDetails;

  @Field(_type => QueryDetails)
  queryDetails!: QueryDetails;
}

@ObjectType()
export class EventQueryWithPricing extends EventQuery {
  @Field()
  quoteDetails!: Quote;

  @Field()
  currentPrice!: number;
}
