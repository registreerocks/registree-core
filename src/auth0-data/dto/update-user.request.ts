import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface UpdateUserRequest extends JsonObject {
  email?: string;
  email_verified?: boolean;
  verify_email?: boolean;
  password?: string;
  name?: string;
  app_metadata?: Metadata;
}

type Metadata = {
  privacyPolicy?: string;
  calendlyLink?: string;
};
