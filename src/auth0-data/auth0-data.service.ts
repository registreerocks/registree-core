import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AUTH0_DATA_OPTIONS } from './auth0-data.constants';
import { Auth0DataOptions } from './auth0-data.options';
import { CreateUserRequest } from './dto/create-user.request';
import { CreateUserResponse } from './dto/create-user.response';
import { GetUserResponse } from './dto/get-user.response';
import { UpdateUserRequest } from './dto/update-user.request';
import { UpdateUserResponse } from './dto/update-user.response';

@Injectable()
export class Auth0DataService {
  private readonly axiosInstance: AxiosInstance;
  private readonly connection: string;

  constructor(
    @Inject(AUTH0_DATA_OPTIONS) private readonly options: Auth0DataOptions,
    private readonly authService: AuthService,
    @InjectPinoLogger(Auth0DataService.name)
    private readonly logger: PinoLogger,
  ) {
    this.axiosInstance = axios.create({
      baseURL: options.managementApi,
    });
    this.connection = options.connection;
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const accessToken = await this.authService.getManagementToken();
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
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error({ err }, 'Failed to get user with id: %s', userId);
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
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
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      this.logger.error({ err }, 'Failed to get user with id: %s', userId);
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      throw err;
    }
  }
}
