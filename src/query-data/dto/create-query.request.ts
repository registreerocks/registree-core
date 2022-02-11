import { JsonObject } from 'src/common/interfaces/json-object.interface';
import { AttachmentDto } from './attachment.dto';

export interface CreateQueryRequest extends JsonObject {
  customer_id: string;
  event: Event;
  query: {
    details: QueryDetails[];
  };
}

type QueryDetails = {
  absolute?: number;
  percentage?: number;
  average?: number;
  race?: string[];
  gender?: string[];
  degree_id: string;
  degree_name: string;
};

type Event = {
  address: string;
  end_date: string;
  //flyer: string;
  attachments: AttachmentDto[];
  info: string;
  message: string;
  name: string;
  start_date: string;
  type: string;
  password?: string;
};
