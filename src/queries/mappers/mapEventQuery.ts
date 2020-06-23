import { EventQuery } from '../models/event-query.model';
import { EventQueryResponse } from 'src/query-data/dto/event-query.response';
import { mapEventDetails } from './mapEventDetails';
import { mapQueryDetails } from './mapQueryDetails';

export const mapEventQuery = (response: EventQueryResponse): EventQuery => ({
  customerId: response.customer_id,
  eventDetails: mapEventDetails(response.event),
  id: response._id,
  queryDetails: mapQueryDetails(response.query),
});
