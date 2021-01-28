import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCustomerDetailsInput {
  @Field({ nullable: true })
  description?: string;

  @Field()
  @IsNotEmpty()
  name!: string;
}
