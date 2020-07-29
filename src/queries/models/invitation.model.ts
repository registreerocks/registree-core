import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Invitation {
  @Field()
  accepted!: boolean;

  @Field()
  attended!: boolean;

  @Field({ nullable: true })
  respondedAt?: Date;

  @Field({ nullable: true })
  sentAt?: Date;

  @Field({ nullable: true })
  viewedAt?: Date;

  @Field({ nullable: true })
  email?: string;
}
