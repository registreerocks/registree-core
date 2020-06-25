import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

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
}
