import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(_type => ID)
  id!: string;

  @Field()
  description!: string;

  @Field()
  name!: string;
}
