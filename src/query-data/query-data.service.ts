import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { EventQueryResponse } from './dto/event-query.response';
import { AuthService } from 'src/auth/auth.service';
import { CreateQueryRequest } from './dto/create-query.request';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { QueryDataOptions } from './query-data.options';
import { QUERY_DATA_OPTIONS } from './query-data.constants';
import { UpdateEventRequest } from './dto/update-event.request';
import { ExpandQueryRequest } from './dto/expand-query.request';

@Injectable()
export class QueryDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(QUERY_DATA_OPTIONS) private readonly options: QueryDataOptions,
    private readonly authService: AuthService,
    @InjectPinoLogger(QueryDataService.name)
    private readonly logger: PinoLogger,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.queryApi,
    });
  }

  async getStudentCountForQuery(request: CreateQueryRequest): Promise<number> {
    const accessToken = await this.authService.getAccessToken();

    const result = await this.axiosInstance.post<number>(
      '/dry_run/degree',
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return result.data;
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

  async expandQuery(
    queryId: string,
    request: ExpandQueryRequest,
  ): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();

    const result = await this.axiosInstance.post<EventQueryResponse>(
      `/expand/degree/${queryId}`,
      request.details,
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
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error(
        { err },
        'Failed to get queries by customer id: %s',
        customerId,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }

  async updateEventInfo(
    queryId: string,
    request: UpdateEventRequest,
  ): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.put<EventQueryResponse>(
        `/event/update_info/${queryId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error(
        { err },
        'Failed to update event details for id: %s',
        queryId,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }

  async addAttachments(
    queryId: string,
    attachments: { filename: string; id: string; mimetype: string }[],
  ): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.put<EventQueryResponse>(
        `/event/add_attachments/${queryId}`,
        attachments,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error(
        { err },
        'Failed to add attachments for id: %s',
        queryId,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }

  async deleteAttachments(
    queryId: string,
    attachments: string[],
  ): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.put<EventQueryResponse>(
        `/event/delete_attachments/${queryId}`,
        attachments,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error(
        { err },
        'Failed to delete attachments for id: %s',
        queryId,
      );
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }
}
