import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(_type => ID)
  userId!: string;

  @Field(_type => ID)
  dbId?: string;

  @Field({ nullable: true })
  calendlyLink?: string;
}
