import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Student {
  @Field(_type => String)
  name!: string;
}
