import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class QueryDegree {
  @Field(_type => ID)
  id!: string;

  @Field()
  degreeName!: string;
}
