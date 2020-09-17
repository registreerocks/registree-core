import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { StudentLink } from 'src/student-linking/models/student-link.model';
import { QueryDegree } from './query-degree.model';
import { Degree } from 'src/universities/models/degree.model';

@ObjectType()
export class QueryTranscript {
  @Field(_type => ID)
  id!: string;

  @Field(_type => Float)
  degreeAverage!: number;

  @Field()
  degreeCompleted!: boolean;

  @Field()
  latestTerm!: number;

  @Field(_type => QueryDegree)
  degree?: Degree;

  degreeId!: string;

  @Field(_type => StudentLink)
  studentLink!: StudentLink;
}
