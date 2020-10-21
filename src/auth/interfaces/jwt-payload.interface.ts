import { JsonObject } from '../../common/interfaces/json-object.interface';

export interface JwtPayload extends JsonObject {
  /** Id of the user in our database */
  'https://registree.com/db_id'?: string;
  /** Email of the user in auth0 */
  'https://registree.com/email'?: string;
  /** Issuer (who created and signed this token) */
  iss?: string;
  /** Subject (whom the token refers to) */
  sub?: string;
  /** Audience (who or what the token is intended for) */
  aud?: string[] | string;
  /** Issued at (seconds since Unix epoch) */
  iat?: number;
  /** Expiration time (seconds since Unix epoch) */
  exp?: number;
  /** Authorization party (the party to which this token was issued) */
  azp?: string;
  /** Token scope (what the token has access to) */
  scope?: string;
}
