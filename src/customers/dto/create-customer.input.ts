import { InputType, Field } from '@nestjs/graphql';
import { ContactInput } from './contact.input';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateCustomerInput {
  @Field()
  description?: string;

  @IsNotEmpty()
  @Field()
  name!: string;

  @Field()
  @ValidateNested()
  @Type(_of => ContactInput)
  contact!: ContactInput;
}
