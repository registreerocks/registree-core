import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface GetUserResponse extends JsonObject {
  blocked?: boolean;
  created_at?: string;
  email: string;
  email_verified?: boolean;
  identities?: Identity[];
  name: string;
  nickname?: string;
  picture?: string;
  updated_at?: string;
  username?: string;
  user_id: string;
  app_metadata: Metadata;
  phone_number?: string;
  phone_verified?: boolean;
  last_ip?: string;
  last_login?: string;
  logins_count?: number;
  given_name?: string;
  family_name?: string;
}

type Metadata = {
  roles: string[];
  db_id: string;
};

type Identity = {
  connection?: string;
  user_id?: string;
  provider?: string;
  isSocial?: boolean;
};
