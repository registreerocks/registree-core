import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Average {
  @Field(_type => Int)
  average!: number;

  readonly amountType: 'Average' = 'Average';
}
