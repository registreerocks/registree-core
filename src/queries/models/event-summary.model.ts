import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class EventSummary {
  @Field(_type => ID)
  eventId!: string;

  @Field()
  eventName!: string;

  @Field(_type => Int)
  invitedCount!: number;

  @Field(_type => Int)
  acceptedCount!: number;

  @Field(_type => Int)
  attendedCount!: number;

  @Field(_type => Int)
  respondedCount!: number;

  @Field(_type => Int)
  viewedCount!: number;
}
