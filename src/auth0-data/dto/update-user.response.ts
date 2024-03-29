import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface UpdateUserResponse extends JsonObject {
  user_id: string;
  email?: string;
  email_verified?: boolean;
  verify_email?: boolean;
  name?: string;
  app_metadata: Metadata;
}

type Metadata = {
  roles: string[];
  db_id: string;
  privacyPolicy?: string;
  calendlyLink?: string;
};
