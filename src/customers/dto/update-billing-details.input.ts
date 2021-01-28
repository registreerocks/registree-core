import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsNumberString,
  Matches,
  Length,
} from 'class-validator';

@InputType()
export class UpdateBillingDetailsInput {
  @Field({ nullable: true })
  addressee?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  line1?: string;

  @Field({ nullable: true })
  line2?: string;

  @Field({ nullable: true })
  province?: string;

  @Field({
    nullable: true,
    description: "The vat number of the company, must match '/^4d{9}$/'",
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @Matches(/^4\d{9}$/, { message: 'vat must be a valid vat number' })
  vat?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @Length(4, 4)
  zip?: string;
}
