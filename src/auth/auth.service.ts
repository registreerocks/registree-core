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
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly axiosInstance: AxiosInstance;
  private readonly audience: string;
  private tokenExpiry: Date = new Date();

  constructor(@Inject(AUTH_OPTIONS) private readonly options: AuthOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.audience = options.audience;

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
}
