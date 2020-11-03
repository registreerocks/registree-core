import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface UpdateStudentLink extends JsonObject {
  student_address?: string;
  student_number: string;
  user_id: string;
}
