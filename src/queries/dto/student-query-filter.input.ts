import { InputType, Field } from '@nestjs/graphql';
import { InvitationState } from '../models/invitation-state.enum';

@InputType()
export class StudentQueryFilter {
  @Field(_type => InvitationState, { nullable: true })
  invitationState?: InvitationState;
}
