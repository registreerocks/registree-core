import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface UpdateStudentInviteStatus extends JsonObject {
  student_address: string;
  viewed?: boolean;
  accepted?: boolean;
  attended?: boolean;
}
