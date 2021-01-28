import { Invitation } from '../models/invitation.model';
import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import {
  InvitationState,
  calculateInvitationState,
} from '../models/invitation-state.enum';

@Resolver(_of => Invitation)
export class InvitationResolver {
  @ResolveField('invitationState', _return => InvitationState)
  getInvitationState(@Parent() invitation: Invitation): InvitationState {
    return calculateInvitationState(invitation);
  }
}
