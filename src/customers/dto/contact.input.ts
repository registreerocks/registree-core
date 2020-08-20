import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class ContactInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email!: string;

  @IsNotEmpty()
  @Field()
  name!: string;

  @IsNotEmpty()
  @Field()
  userId!: string;
}
