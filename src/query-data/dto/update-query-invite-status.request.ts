import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface UpdateQueryInviteStatus extends JsonObject {
  student_address?: string;
  viewed?: boolean;
  accepted?: boolean;
  attended?: boolean;
}
