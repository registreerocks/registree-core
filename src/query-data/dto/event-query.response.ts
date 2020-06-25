import { EventResponse } from './event.response';
import { JsonObject } from 'src/common/interfaces/json-object.interface';
import { QueryResponse } from './query.response';

export interface EventQueryResponse extends JsonObject {
  _id: string;
  customer_id: string;
  event: EventResponse;
  query: QueryResponse;
}
