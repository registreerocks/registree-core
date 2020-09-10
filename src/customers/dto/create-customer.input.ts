import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field()
  description?: string;

  @IsNotEmpty()
  @Field()
  name!: string;
}
