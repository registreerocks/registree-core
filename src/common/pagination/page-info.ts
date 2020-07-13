import { Field, ObjectType } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';

@ObjectType()
export class PageInfo implements Relay.PageInfo {
  @Field(_type => String, { nullable: true })
  endCursor?: string;

  @Field(_type => Boolean)
  hasNextPage!: boolean;

  @Field(_type => Boolean)
  hasPreviousPage!: boolean;

  @Field(_type => String, { nullable: true })
  startCursor?: string;
}
