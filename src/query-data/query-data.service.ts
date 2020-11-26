import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { EventQueryResponse } from './dto/event-query.response';
import { AuthService } from 'src/auth/auth.service';
import { CreateQueryRequest } from './dto/create-query.request';
import { QueryDataOptions } from './query-data.options';
import { QUERY_DATA_OPTIONS } from './query-data.constants';
import { UpdateEventRequest } from './dto/update-event.request';
import { ExpandQueryRequest } from './dto/expand-query.request';
import { UpdateQueryInviteStatus } from './dto/update-query-invite-status.request';
import { ServerError } from 'src/common/errors/server.error';
import { UpdateStudentLink } from './dto/update-student-link.request';

@Injectable()
export class QueryDataService {
  private readonly axiosInstance: AxiosInstance;

  constructor(
    @Inject(QUERY_DATA_OPTIONS) private readonly options: QueryDataOptions,
    private readonly authService: AuthService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.queryApi,
    });
  }

  async getStudentCountForQuery(request: CreateQueryRequest): Promise<number> {
    const accessToken = await this.authService.getAccessToken();

    try {
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
    } catch (err) {
      throw new ServerError('Failed to get student count for a query', err);
    }
  }

  async createQuery(request: CreateQueryRequest): Promise<string> {
    const accessToken = await this.authService.getAccessToken();

    try {
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
    } catch (err) {
      throw new ServerError('Query creation failed', err);
    }
  }

  async expandQuery(
    queryId: string,
    request: ExpandQueryRequest,
  ): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();
    try {
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
    } catch (err) {
      throw new ServerError('Failed to expand query', err);
    }
  }

  async getQuery(queryId: string): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();

    try {
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
    } catch (err) {
      throw new ServerError('Failed to get query by id', err);
    }
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
      throw new ServerError('Failed to get queries by customer id', err);
    }
  }

  async getStudentQueries(transcriptId: string): Promise<EventQueryResponse[]> {
    const accessToken = await this.authService.getAccessToken();
    try {
      const result = await this.axiosInstance.get<EventQueryResponse[]>(
        `/query/get_by_transcript_id?transcript_id=${transcriptId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError('Failed to get queries by transcript id', err);
    }
  }

  async updateQueryInviteStatus(
    queryId: string,
    request: UpdateQueryInviteStatus,
  ): Promise<EventQueryResponse> {
    const accessToken = await this.authService.getAccessToken();

    //WIPs

    // get query first
    // const queryIdReturned = await this.get(`query/${queryId}`,

    // getQuery(queryId)

    // {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // },
    // );

    // async getQuery(queryId: string): Promise<EventQuery> {
    // return mapEventQuery(response);
    // }

    // const resp = await this.getQuery(queryId);

    //return this.getQuery(queryId);
    // }

    try {
      await this.axiosInstance.post<string>(
        `/query/update_status/${queryId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (err) {
      throw new ServerError(
        'Failed to update student invite status for transcriptId',
        err,
      );
    }
    return this.getQuery(queryId);
  }

  async linkStudent(queryId: string, request: UpdateStudentLink) {
    const accessToken = await this.authService.getAccessToken();
    try {
      await this.axiosInstance.post<string>(
        `/query/add_student_attendance/${queryId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (err) {
      throw new ServerError('Failed to link student to query', err);
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
      throw new ServerError('Failed to update event details', err);
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
      throw new ServerError('Failed to add attachments', err);
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
      throw new ServerError('Failed to delete attachments', err);
    }
  }
}
