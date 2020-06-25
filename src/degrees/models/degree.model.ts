import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Degree {
  @Field(_type => ID)
  id!: string;

  @Field()
  degreeName!: string;
}
