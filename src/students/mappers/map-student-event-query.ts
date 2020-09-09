import { StudentEventQuery } from '../models/student-event-query.model';
import { StudentEventQueryResponse } from 'src/query-data/dto/student-event-query.response';

export const mapStudentEventQuery = (
  response: StudentEventQueryResponse,
): StudentEventQuery => ({
  id: response._id,
  host: {
    id: response.customer_id,
  },
  eventDetails: {
    address: response.event.address,
    startDate: new Date(response.event.start_date),
    endDate: new Date(response.event.end_date),
    attachments: response.event.attachments
      ? response.event.attachments.map(a => ({ ...a, url: a.id }))
      : [],
    eventType: response.event.type,
    information: response.event.info,
    name: response.event.name,
    password: response.response.accepted ? response.event.password : undefined,
  },
  response: {
    accepted: response.response.accepted,
    respondedAt: response.response.responded
      ? new Date(response.response.responded)
      : undefined,
    attended: response.response.attended,
    sentAt: response.response.sent
      ? new Date(response.response.sent)
      : undefined,
    viewedAt: response.response.viewed
      ? new Date(response.response.viewed)
      : undefined,
  },
});
