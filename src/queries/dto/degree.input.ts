import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDefined, IsString, Max, Min, ValidateIf } from 'class-validator';

@InputType()
export class DegreeInput {
  @Field()
  @IsString()
  degreeId!: string;

  @Field(_type => Int, { nullable: true })
  @ValidateIf((o: DegreeInput) => !o.percentage && !o.average)
  @IsDefined()
  @Min(1)
  absolute?: number;

  // TODO: fail if both or no absolute, average and percentage

  @Field(_type => Int, { nullable: true })
  @ValidateIf(
    (o: DegreeInput) => !o.absolute && !o.average && o.percentage !== undefined,
  )
  @IsDefined()
  @Min(1)
  @Max(100)
  percentage?: number;

  @Field(_type => Int, { nullable: true })
  @ValidateIf((o: DegreeInput) => !o.absolute && !o.percentage)
  @IsDefined()
  @Min(1)
  @Max(100)
  average?: number;
}
