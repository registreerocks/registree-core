import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email!: string;

  @IsNotEmpty()
  @Field()
  name!: string;
}
