import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EventMetrics {
  @Field(_type => Int)
  acceptedCount!: number;

  @Field(_type => Int)
  attendedCount!: number;

  @Field(_type => Int)
  respondedCount!: number;

  @Field(_type => Int)
  viewedCount!: number;
}
