import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Student {
  @Field()
  email?: string;

  @Field()
  name?: string;

  @Field(_type => ID)
  userId!: string;

  @Field(_type => ID)
  studentNumber?: string;
}
