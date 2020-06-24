import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(_type => String, { nullable: true })
  endCursor?: string;

  @Field(_type => Boolean)
  hasNextPage!: boolean;

  @Field(_type => Boolean)
  hasPreviousPage!: boolean;

  @Field(_type => String, { nullable: true })
  startCursor?: string;
}
