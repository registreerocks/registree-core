import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Host {
  @Field(_type => ID)
  id!: string;

  @Field(_type => String)
  name?: string;
}
