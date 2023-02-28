import { EventQueryResponse } from 'src/query-data/dto/event-query.response';
import { EventSummary } from '../models/event-summary.model';

export const mapEventSummary = (
  response: EventQueryResponse,
): EventSummary => ({
  eventId: response._id,
  eventName: response.event.name,
  invitedCount: Object.keys(response.query.responses).length,
  acceptedCount: response.query.metrics.accepted,
  attendedCount: response.query.metrics.attended,
  respondedCount: response.query.metrics.responded,
  viewedCount: response.query.metrics.viewed,
});
