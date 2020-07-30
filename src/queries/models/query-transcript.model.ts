import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Degree } from 'src/degrees/models/degree.model';
import { StudentLink } from 'src/student-linking/models/student-link.model';

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

  @Field(_type => Degree)
  degree!: Degree;

  @Field(_type => StudentLink)
  studentLink!: StudentLink;
}
