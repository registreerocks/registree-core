import { ObjectType, Field } from '@nestjs/graphql';
import { Percentage } from 'src/common/percentage.model';
import { Absolute } from 'src/common/absolute.model';
import { AmountUnion } from 'src/common/amount.union';
import { Degree } from 'src/degrees/models/degree.model';

@ObjectType()
export class DegreeSelection {
  @Field(_type => AmountUnion)
  amount!: Percentage | Absolute;

  @Field()
  degree!: Degree;
}
