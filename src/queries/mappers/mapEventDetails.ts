import { EventResponse } from 'src/query-data/dto/event.response';
import { EventDetails } from '../models/event-details.model';

export const mapEventDetails = (
  eventResponse: EventResponse,
): EventDetails => ({
  address: eventResponse.address,
  startDate: new Date(eventResponse.start_date),
  endDate: new Date(eventResponse.end_date),
  attachments: [], // TODO: Add mapping
  eventType: eventResponse.type,
  information: eventResponse.info,
  name: eventResponse.name,
});
