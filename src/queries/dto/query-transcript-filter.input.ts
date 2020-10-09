import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class QueryTranscriptFilter {
  @Field(_type => [ID], { nullable: true })
  degreeIds?: string[];

  @Field({ nullable: true })
  degreeCompleted?: boolean;

  @Field({ nullable: true })
  eventAttended?: boolean;
}
