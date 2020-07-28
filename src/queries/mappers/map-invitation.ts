import { ResponseDto } from 'src/query-data/dto/query.response';
import { Invitation } from '../models/invitation.model';

export const mapInvitation = (response: ResponseDto): Invitation => ({
  accepted: response.accepted,
  respondedAt: new Date(response.responded),
  attended: response.attended,
  sentAt: new Date(response.sent),
  viewedAt: new Date(response.viewed),
  email: '',
});
