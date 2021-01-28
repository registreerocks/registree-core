import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface CreateUserRequest extends JsonObject {
  blocked: boolean;
  connection: string;
  email: string;
  email_verified: boolean;
  name: string;
  password: string;
  verify_email: boolean;
  app_metadata: Metadata;
}

type Metadata = {
  roles: string[];
};
