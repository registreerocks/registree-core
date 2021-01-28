import { EventResponse } from 'src/query-data/dto/event.response';
import { EventDetails } from '../models/event-details.model';
import { QueryResponse } from 'src/query-data/dto/query.response';
import { mapInvitation } from './map-invitation';
import { mapEventMetrics } from './map-event-metrics';

export const mapEventDetails = (
  eventResponse: EventResponse,
  queryResponse: QueryResponse,
): EventDetails => ({
  address: eventResponse.address,
  startDate: new Date(eventResponse.start_date),
  endDate: new Date(eventResponse.end_date),
  attachments: eventResponse.attachments
    ? eventResponse.attachments.map(a => ({ ...a, url: a.id }))
    : [],
  eventType: eventResponse.type,
  information: eventResponse.info,
  name: eventResponse.name,
  invites: Object.entries(queryResponse.responses).map(mapInvitation),
  metrics: mapEventMetrics(queryResponse.metrics),
  password: eventResponse.password,
});
