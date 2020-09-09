import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface GetIdentifyingDataResponse extends JsonObject {
  _id: string;
  first_name: string;
  last_name: string;
  student_id: string;
}
