import { EventQuery } from '../models/event-query.model';
import { EventQueryResponse } from 'src/query-data/dto/event-query.response';
import { mapEventDetails } from './map-event-details';
import { mapQueryDetails } from './map-query-details';

export const mapEventQuery = (response: EventQueryResponse): EventQuery => ({
  customerId: response.customer_id,
  eventDetails: mapEventDetails(response.event, response.query),
  id: response._id,
  queryDetails: mapQueryDetails(response.query),
});
