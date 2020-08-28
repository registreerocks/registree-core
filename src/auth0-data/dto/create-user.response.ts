import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface CreateUserResponse extends JsonObject {
  blocked: boolean;
  created_at: string;
  connection: string;
  email: string;
  email_verified: boolean;
  identities: Identity[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  app_metadata: Metadata;
}

type Metadata = {
  roles: string[];
};

type Identity = {
  connection: string;
  user_id: string;
  provider: string;
  isSocial: boolean;
};
