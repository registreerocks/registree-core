import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class QueryTranscriptFilter {
  @Field(_type => [ID], { nullable: true })
  degrees?: string[];

  @Field({ nullable: true })
  degreeCompleted?: boolean;

  @Field({ nullable: true })
  attendedEvent?: boolean;
}
