import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import addSeconds from 'date-fns/addSeconds';
import isAfter from 'date-fns/isAfter';
import { AUTH_OPTIONS } from './auth.constants';
import { AuthOptions } from './auth.options';
import { AccessTokenResponse } from './dto/access-token.response';

@Injectable()
export class AuthService {
  private accessToken = '';
  private managementToken = '';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly axiosInstance: AxiosInstance;
  private readonly audience: string;
  private readonly managementAudience: string;
  private tokenExpiry: Date = new Date();
  private managementTokenExpiry: Date = new Date();
  private apiKeys: string[];

  constructor(@Inject(AUTH_OPTIONS) private readonly options: AuthOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.audience = options.audience;
    this.managementAudience = `https://${options.domain}/api/v2/`;
    this.apiKeys = [options.auth0ApiKey, options.adminApiKey];

    this.axiosInstance = axios.create({
      baseURL: `https://${options.domain}/oauth`,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  async getAccessToken(): Promise<string> {
    if (isAfter(new Date(), this.tokenExpiry) || !this.accessToken) {
      await this.updateAccessToken();
    }
    return this.accessToken;
  }

  async getManagementToken(): Promise<string> {
    if (
      isAfter(new Date(), this.managementTokenExpiry) ||
      !this.managementToken
    ) {
      await this.updateManagementToken();
    }
    return this.managementToken;
  }

  private async updateAccessToken(): Promise<void> {
    ({
      token: this.accessToken,
      expiry: this.tokenExpiry,
    } = await this.updateToken(this.audience));
  }

  private async updateManagementToken(): Promise<void> {
    ({
      token: this.managementToken,
      expiry: this.managementTokenExpiry,
    } = await this.updateToken(this.managementAudience));
  }

  private async updateToken(
    audience: string,
  ): Promise<{ token: string; expiry: Date }> {
    try {
      const result = await this.axiosInstance.post<AccessTokenResponse>(
        '/token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: audience,
          grant_type: 'client_credentials',
        },
      );
      return {
        token: result.data.access_token,
        expiry: addSeconds(new Date(), result.data.expires_in - 60),
      };
    } catch (e) {
      const message: string =
        e instanceof Error
          ? e.stack ?? e.toString()
          : Object.prototype.toString.call(e);
      throw new Error(
        `AuthService: error refreshing ${audience} token: ${message}`,
      );
    }
  }

  validateApiKey(apiKey: string) {
    return this.apiKeys.find(knownKey => apiKey === knownKey);
  }
}
