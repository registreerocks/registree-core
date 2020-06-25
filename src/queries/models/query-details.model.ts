import { ObjectType, Field } from '@nestjs/graphql';
import { QueryMetrics } from './query-metrics.model';
import { DegreeSelection } from './degree-selection.model';

@ObjectType()
export class QueryDetails {
  @Field(_type => [DegreeSelection])
  selection!: DegreeSelection[];

  metrics!: QueryMetrics;
  @Field()
  updatedAt!: Date;
}
