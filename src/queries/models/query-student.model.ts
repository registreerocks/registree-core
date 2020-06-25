import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QueryStudent {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  studentId!: string;
}
