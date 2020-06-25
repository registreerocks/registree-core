import { Field, ArgsType, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(_type => Int, { nullable: true })
  skip?: number;

  @Field(_type => String, { nullable: true })
  after?: string;

  @Field(_type => String, { nullable: true })
  before?: string;

  @Field(_type => Int, { nullable: true })
  first?: number;

  @Field(_type => Int, { nullable: true })
  last?: number;
}
