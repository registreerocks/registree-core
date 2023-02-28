import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { AcademicYearOfStudy } from '../models/academic-year-of-study.model';
import { DegreeInput } from './degree.input';

@InputType()
export class ExpandEventQueryInput {
  @Field(_type => [DegreeInput])
  @IsArray()
  @ValidateNested()
  @Type(_of => DegreeInput)
  degrees!: DegreeInput[];

  @Field(_type => [AcademicYearOfStudy])
  @IsEnum(AcademicYearOfStudy, { each: true })
  @ArrayUnique()
  academicYearOfStudyList!: AcademicYearOfStudy[];
}
