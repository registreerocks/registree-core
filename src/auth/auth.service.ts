import { Injectable } from '@nestjs/common';
import addSeconds from 'date-fns/addSeconds';
import axios, { AxiosInstance } from 'axios';
import { AccessTokenResponse } from './dto/access-token.response';
import isAfter from 'date-fns/isAfter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private accessToken = '';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly axiosInstance: AxiosInstance;
  private readonly audience: string;
  private tokenExpiry: Date = new Date();

  constructor(private readonly configService: ConfigService) {
    this.clientId = configService.get<string>('auth.clientId', '');
    this.clientSecret = configService.get<string>('auth.clientSecret', '');
    this.audience = configService.get<string>('auth.audience', '');
    const domain = configService.get<string>('auth.domain', '');

    if (!this.clientId || !this.clientSecret || !this.audience || !domain) {
      throw new Error('Confidential client details were not provided');
    }

    this.axiosInstance = axios.create({
      baseURL: `https://${domain}/oauth`,
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
