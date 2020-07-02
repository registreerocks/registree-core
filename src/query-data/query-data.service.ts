import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { EventQueryResponse } from './dto/event-query.response';
import { AuthService } from 'src/auth/auth.service';
import { CreateQueryRequest } from './dto/create-query.request';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class QueryDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectPinoLogger(QueryDataService.name)
    private readonly logger: PinoLogger,
  ) {
    const endpoint = this.configService.get<string>('api.queryApi', '');
    this.axiosInstance = axios.create({
      baseURL: endpoint,
    });
  }

  async createQuery(request: CreateQueryRequest): Promise<string> {
    const accessToken = await this.authService.getAccessToken();

    const result = await this.axiosInstance.post<string>(
      `/query/degree`,
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return result.data;
  }

  async getQuery(queryId: string): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();

    const result = await this.axiosInstance.get<EventQueryResponse>(
      `/query/get`,
      {
        params: {
          id: queryId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return result.data;
  }

  async getCustomerQueries(customerId: string): Promise<EventQueryResponse[]> {
    const accessToken = await this.authService.getAccessToken();
    try {
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
    } catch (err) {
      this.logger.error(
        { err },
        'Failed to get queries by customer id: %s',
        customerId,
      );
      throw err;
    }
  }
}
