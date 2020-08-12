import { EventResponse } from 'src/query-data/dto/event.response';
import { EventDetails } from '../models/event-details.model';
import { QueryResponse } from 'src/query-data/dto/query.response';
import { mapInvitation } from './map-invitation';
import { mapEvent } from './map-event';
import { mapEventMetrics } from './map-event-metrics';

export const mapEventDetails = (
  eventResponse: EventResponse,
  queryResponse: QueryResponse,
): EventDetails => ({
  ...mapEvent(eventResponse),
  ...{
    invites: Object.values(queryResponse.responses).map(mapInvitation),
    metrics: mapEventMetrics(queryResponse.metrics),
  },
});
