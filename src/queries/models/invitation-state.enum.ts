import { registerEnumType } from '@nestjs/graphql';
import { Invitation } from './invitation.model';

export enum InvitationState {
  NONE = 0,
  VIEWED = 1,
  RESPONDED = 2,
  ACCEPTED = 3,
  ATTENDED = 4,
}

registerEnumType(InvitationState, { name: 'InvitationState' });

export const calculateInvitationState = (
  invitation: Invitation,
): InvitationState => {
  if (invitation.attended) {
    return InvitationState.ACCEPTED;
  }
  if (invitation.accepted) {
    return InvitationState.ACCEPTED;
  }
  if (invitation.respondedAt) {
    return InvitationState.RESPONDED;
  }
  if (invitation.viewedAt) {
    return InvitationState.VIEWED;
  }
  return InvitationState.NONE;
};
