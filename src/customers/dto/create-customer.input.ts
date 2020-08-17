import { InputType, Field } from '@nestjs/graphql';
import { ContactInput } from './contact.input';

@InputType()
export class CreateCustomerInput {
  @Field()
  description?: string;
  @Field()
  name!: string;
  @Field()
  contact!: ContactInput;
}
