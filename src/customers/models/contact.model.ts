import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;
}
