import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { EventQueryResponse } from './dto/event-query.response';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class QueryDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const endpoint = this.configService.get<string>('api.queryApi', '');
    this.axiosInstance = axios.create({
      baseURL: endpoint,
    });
  }

  async getCustomerQueries(customerId: string): Promise<EventQueryResponse[]> {
    const accessToken = await this.authService.getAccessToken();

    const result = await this.axiosInstance.get<EventQueryResponse[]>(
      `/query/get_by_customer`,
      {
        params: {
          customer_id: customerId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return result.data;
  }
}
