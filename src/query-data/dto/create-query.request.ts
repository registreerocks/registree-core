import { JsonObject } from 'src/common/interfaces/json-object.interface';

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
  degree_id: string;
  degree_name: string;
};

type Event = {
  address: string;
  end_date: string;
  //flyer: string;
  attachments: { id: string; filename: string; mimetype: string }[];
  info: string;
  message: string;
  name: string;
  start_date: string;
  type: string;
};
