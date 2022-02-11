import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface ExpandQueryRequest extends JsonObject {
  details: QueryDetails[];
}

type QueryDetails = {
  absolute?: number;
  percentage?: number;
  average?: number;
  degree_id: string;
  degree_name: string;
};
