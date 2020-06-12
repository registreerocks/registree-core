import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EventQuery {
  @Field()
  file!: string;
}
