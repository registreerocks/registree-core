import { Field, ObjectType, ID } from '@nestjs/graphql';
import { EventDetails } from './event-details.model';
import { QueryDetails } from './query-details.model';

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
