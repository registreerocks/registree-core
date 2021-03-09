import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { DegreeInput } from './degree.input';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateEventQueryInput {
  @Field()
  @MinLength(1)
  name!: string;

  @Field()
  @MinLength(1)
  address!: string;

  @Field(_type => GraphQLISODateTime)
  @IsDate()
  startDate!: Date;

  @Field(_type => GraphQLISODateTime)
  @IsDate()
  endDate!: Date;

  @Field()
  @MinLength(1)
  information!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;

  @Field(_type => [DegreeInput])
  @IsArray()
  @ValidateNested()
  @Type(_of => DegreeInput)
  degrees!: DegreeInput[];

  // TODO: Enum or | type
  @Field()
  @MinLength(1)
  eventType!: string;

  @Field(_type => [GraphQLUpload], { nullable: true })
  attachments?: Promise<FileUpload>[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;
}
