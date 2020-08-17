import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Absolute {
  @Field(_type => Int)
  absolute!: number;
}
