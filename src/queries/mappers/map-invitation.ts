import { ResponseDto } from 'src/query-data/dto/query.response';
import { Invitation } from '../models/invitation.model';

export const mapInvitation = (response: ResponseDto): Invitation => ({
  accepted: response.accepted,
  respondedAt: response.responded ? new Date(response.responded) : undefined,
  attended: response.attended,
  sentAt: response.sent ? new Date(response.sent) : undefined,
  viewedAt: response.viewed ? new Date(response.viewed) : undefined,
  email: '',
});
