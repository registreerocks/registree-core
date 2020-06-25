import { ObjectType, Field } from '@nestjs/graphql';
import { QueryTranscript } from './query-transcript.model';
import { QueryInvitation } from './query-invitation.model';
import { QueryStudent } from './query-student.model';

@ObjectType()
export class Result {
  // TODO: Field guard
  @Field(_type => QueryTranscript)
  transcript!: QueryTranscript;

  @Field(_type => QueryInvitation)
  invite!: QueryInvitation;

  @Field(_type => QueryStudent)
  studentInformation?: QueryStudent;
}
