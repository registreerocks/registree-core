import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface EventResponse extends JsonObject {
  address: string;
  end_date: string;
  flyer: string;
  info: string;
  name: string;
  start_date: string;
  type: string;
}
