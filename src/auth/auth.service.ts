import { Injectable, Inject } from '@nestjs/common';
import addSeconds from 'date-fns/addSeconds';
import axios, { AxiosInstance } from 'axios';
import { AccessTokenResponse } from './dto/access-token.response';
import isAfter from 'date-fns/isAfter';
import { AuthOptions } from './auth.options';
import { AUTH_OPTIONS } from './auth.constants';

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
      return this.accessToken;
    } else {
      return this.accessToken;
    }
  }

  async getManagementToken(): Promise<string> {
    if (
      isAfter(new Date(), this.managementTokenExpiry) ||
      !this.managementToken
    ) {
      await this.updateManagementToken();
      return this.managementToken;
    } else {
      return this.managementToken;
    }
  }

  private async updateAccessToken(): Promise<void> {
    const result = await this.axiosInstance.post<AccessTokenResponse>(
      '/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        grant_type: 'client_credentials',
      },
    );
    this.tokenExpiry = addSeconds(new Date(), result.data.expires_in - 60);
    this.accessToken = result.data.access_token;
  }

  private async updateManagementToken(): Promise<void> {
    const result = await this.axiosInstance.post<AccessTokenResponse>(
      '/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.managementAudience,
        grant_type: 'client_credentials',
      },
    );
    this.managementTokenExpiry = addSeconds(
      new Date(),
      result.data.expires_in - 60,
    );
    this.managementToken = result.data.access_token;
  }

  validateApiKey(apiKey: string) {
    return this.apiKeys.find(knownKey => apiKey === knownKey);
  }
}
