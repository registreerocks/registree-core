import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class QueryInvitation {
  @Field()
  accepted!: boolean;

  @Field()
  attended!: boolean;

  @Field()
  respondedAt!: Date;

  @Field()
  sentAt!: Date;

  @Field()
  viewedAt!: Date;
}
