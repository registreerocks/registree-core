import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class RsvpCost {
  @Field(_type => Float)
  cost!: number;

  @Field(_type => Int)
  percent!: number;
}
