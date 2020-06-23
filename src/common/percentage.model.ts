import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Percentage {
  @Field(_type => Int)
  percentage!: number;
}
