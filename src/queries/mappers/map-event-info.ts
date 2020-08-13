import { EventResponse } from 'src/query-data/dto/event.response';
import { EventInfo } from '../models/event-info.model';

export const mapEventInfo = (eventResponse: EventResponse): EventInfo => ({
  address: eventResponse.address,
  startDate: new Date(eventResponse.start_date),
  endDate: new Date(eventResponse.end_date),
  attachments: eventResponse.attachments
    ? eventResponse.attachments.map(a => ({ ...a, url: a.id }))
    : [],
  eventType: eventResponse.type,
  information: eventResponse.info,
  name: eventResponse.name,
  password: eventResponse.password,
});
