import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ContactInput {
  @Field()
  email!: string;
  @Field()
  name!: string;
}
