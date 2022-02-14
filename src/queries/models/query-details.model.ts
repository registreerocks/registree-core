import { ObjectType, Field } from '@nestjs/graphql';
import { AcademicYearOfStudy } from './academic-year-of-study.model';
import { DegreeSelection } from './degree-selection.model';
import { QueryTranscript } from './query-transcript.model';
import { QueryTranscriptConnection } from './pagination/query-transcript-connection.model';
import { Faculty } from 'src/universities/models/faculty.model';

@ObjectType()
export class QueryDetails {
  @Field(_type => [DegreeSelection])
  parameters!: DegreeSelection[];

  @Field(_type => [AcademicYearOfStudy])
  academicYearOfStudyList!: AcademicYearOfStudy[];

  rawResults!: QueryTranscript[];

  @Field(_type => [Faculty])
  faculties?: Faculty[];

  @Field(_type => [QueryTranscriptConnection])
  results?: QueryTranscriptConnection;

  @Field()
  updatedAt!: Date;

  @Field(_type => [String])
  race!: string[];

  @Field(_type => [String])
  gender!: string[];
}
