import { JsonObject } from 'src/common/interfaces/json-object.interface';
import { AttachmentDto } from './attachment.dto';

export interface UpdateEventRequest extends JsonObject {
  address?: string;
  end_date?: string;
  attachments?: AttachmentDto[];
  info?: string;
  message?: string;
  name?: string;
  start_date?: string;
  type?: string;
  password?: string;
}
