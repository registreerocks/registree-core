import { InputType, Field, Int } from '@nestjs/graphql';
import { Min, Max, ValidateIf, IsDefined } from 'class-validator';

@InputType()
export class DegreeInput {
  @Field()
  degreeId!: string;

  @Field(_type => Int, { nullable: true })
  @ValidateIf((o: DegreeInput) => !o.percentage)
  @IsDefined()
  @Min(1)
  absolute?: number;

  @Field(_type => Int, { nullable: true })
  @ValidateIf((o: DegreeInput) => !o.absolute && o.percentage !== undefined)
  @IsDefined()
  @Min(1)
  @Max(100)
  percentage?: number;
}
