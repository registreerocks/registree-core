import { ObjectType, Field } from '@nestjs/graphql';
import { DegreeSelection } from './degree-selection.model';
import { QueryTranscript } from './query-transcript.model';
import { QueryTranscriptConnection } from './pagination/query-transcript-connection.model';
import { Faculty } from 'src/universities/models/faculty.model';

@ObjectType()
export class QueryDetails {
  @Field(_type => [DegreeSelection])
  parameters!: DegreeSelection[];

  rawResults!: QueryTranscript[];

  @Field(_type => [Faculty])
  faculties?: Faculty[];

  @Field(_type => [QueryTranscriptConnection])
  results?: QueryTranscriptConnection;

  @Field()
  updatedAt!: Date;
}
