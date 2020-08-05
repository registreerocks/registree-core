import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RsvpCost } from './rsvp-cost.model';

@ObjectType()
export class Quote {
  @Field(_type => Int)
  numberOfStudents!: number;

  @Field(_type => [RsvpCost])
  rsvpCostBreakdown!: RsvpCost[];
}
