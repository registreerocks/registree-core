import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AcademicYearOfStudy } from '../models/academic-year-of-study.model';
import { DegreeInput } from './degree.input';
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
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
  @IsString()
  @IsOptional()
  message?: string;

  @Field(_type => [DegreeInput])
  @IsArray()
  @ValidateNested()
  @Type(_of => DegreeInput)
  degrees!: DegreeInput[];

  @Field(_type => [AcademicYearOfStudy])
  @IsEnum(AcademicYearOfStudy, { each: true })
  @ArrayUnique()
  academicYearOfStudyList!: AcademicYearOfStudy[];

  @Field(_type => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  race?: string[];

  @Field(_type => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  gender?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  smsMessage?: string;

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
