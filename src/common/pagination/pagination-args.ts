import { Field, ArgsType, Int } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';

@ArgsType()
export class PaginationArgs implements Relay.ConnectionArguments {
  @Field(_type => String, { nullable: true })
  after?: string;

  @Field(_type => String, { nullable: true })
  before?: string;

  @Field(_type => Int, { nullable: true })
  first?: number;

  @Field(_type => Int, { nullable: true })
  last?: number;
}
