import { JsonObject } from 'src/common/interfaces/json-object.interface';
import { AttachmentDto } from './attachment.dto';

export interface EventResponse extends JsonObject {
  address: string;
  end_date: string;
  flyer: string;
  info: string;
  name: string;
  start_date: string;
  attachments?: AttachmentDto[];
  type: string;
  password: string;
  eventPlatform: string;
}
