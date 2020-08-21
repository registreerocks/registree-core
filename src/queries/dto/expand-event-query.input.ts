import { InputType, Field } from '@nestjs/graphql';
import { DegreeInput } from './degree.input';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class ExpandEventQueryInput {
  @Field(_type => [DegreeInput])
  @ValidateNested()
  @Type(_of => DegreeInput)
  degrees!: DegreeInput[];
}
