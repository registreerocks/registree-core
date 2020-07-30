import { ObjectType, Field } from '@nestjs/graphql';
import { DegreeSelection } from './degree-selection.model';
import { QueryTranscript } from './query-transcript.model';

@ObjectType()
export class QueryDetails {
  @Field(_type => [DegreeSelection])
  parameters!: DegreeSelection[];

  @Field(_type => [QueryTranscript])
  results!: QueryTranscript[];

  @Field()
  updatedAt!: Date;
}
