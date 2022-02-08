import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateContactInput {
  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  calendlyLink?: string;
}
