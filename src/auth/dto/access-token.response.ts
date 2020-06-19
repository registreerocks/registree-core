import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface AccessTokenResponse extends JsonObject {
  access_token: string;
  expires_in: number;
}
