import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { AUTH0_DATA_OPTIONS } from './auth0-data.constants';
import { Auth0DataOptions } from './auth0-data.options';
import { CreateUserRequest } from './dto/create-user.request';
import { CreateUserResponse } from './dto/create-user.response';
import { GetUserResponse } from './dto/get-user.response';
import { UpdateUserRequest } from './dto/update-user.request';
import { UpdateUserResponse } from './dto/update-user.response';
import { ServerError } from 'src/common/errors/server.error';

@Injectable()
export class Auth0DataService {
  private readonly axiosInstance: AxiosInstance;
  private readonly connection: string;

  constructor(
    @Inject(AUTH0_DATA_OPTIONS) private readonly options: Auth0DataOptions,
    private readonly authService: AuthService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.managementApi,
    });
    this.connection = options.connection;
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const accessToken = await this.authService.getManagementToken();
    try {
      request.connection = this.connection;

      const result = await this.axiosInstance.post<CreateUserResponse>(
        '/users',
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return result.data;
    } catch (err) {
      throw new ServerError('Failed to create Auth0 user', err);
    }
  }

  async getUser(userId: string): Promise<GetUserResponse> {
    const accessToken = await this.authService.getManagementToken();
    try {
      const result = await this.axiosInstance.get<GetUserResponse>(
        `/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError('Failed to get Auth0 user by id', err);
    }
  }

  async getUsers(customerIds: string[]): Promise<GetUserResponse[]> {
    const accessToken = await this.authService.getManagementToken();
    const searchQuery = this.buildUserQuery(customerIds);
    try {
      const result = await this.axiosInstance.get<GetUserResponse[]>(
        `/users?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError('Failed to get Auth0 users with query', err);
    }
  }

  async getCalendlyUsers(): Promise<GetUserResponse[]> {
    const accessToken = await this.authService.getManagementToken();
    const searchQuery = `app_metadata.calendlyLink:* AND identities.connection:${this.options.connection}`;
    try {
      const result = await this.axiosInstance.get<GetUserResponse[]>(
        `/users?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError(
        'Failed to get Auth0 users with calendly query',
        err,
      );
    }
  }

  async updateUser(
    userId: string,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const accessToken = await this.authService.getManagementToken();
    try {
      const result = await this.axiosInstance.patch<UpdateUserResponse>(
        `/users/${userId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return result.data;
    } catch (err) {
      throw new ServerError('Failed to update Auth0 user', err);
    }
  }

  private buildUserQuery(contactIds: string[]): string {
    return `user_id:("${contactIds.join('" OR "')}")`;
  }
}
