import { EventResponse } from './event.response';
import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface StudentEventQueryResponse extends JsonObject {
  _id: string;
  customer_id: string;
  event: EventResponse;
  response: ResponseDto;
}

export type ResponseDto = {
  accepted: boolean;
  attended: boolean;
  responded: string;
  sent: string;
  viewed: string;
};
