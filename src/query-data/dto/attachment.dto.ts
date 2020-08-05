import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface AttachmentDto extends JsonObject {
  id: string;
  filename: string;
  mimetype: string;
}
