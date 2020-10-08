import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class UpdateEventInfoInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  information?: string;

  @Field({ nullable: true })
  message?: string;

  // TODO: Enum or | type
  @Field({ nullable: true })
  eventType?: string;

  @Field({ nullable: true })
  password?: string;
}
