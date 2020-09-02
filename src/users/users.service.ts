import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Contact } from 'src/customers/models/contact.model';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { CreateUserRequest } from 'src/auth0-data/dto/create-user.request';
import { CreateUserResponse } from 'src/auth0-data/dto/create-user.response';
import { GetUserResponse } from 'src/auth0-data/dto/get-user.response';
import { UpdateUserRequest } from 'src/auth0-data/dto/update-user.request';
import { UpdateUserResponse } from 'src/auth0-data/dto/update-user.response';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly auth0DataService: Auth0DataService) {}

  async createUser(input: CreateUserInput): Promise<Contact> {
    const user = await this.auth0DataService.createUser(
      this.createUserRequestMapper(input),
    );
    return this.createUserResponseMapper(user);
  }

  async getUser(userId: string): Promise<Contact> {
    const user = await this.auth0DataService.getUser(userId);
    return this.getUserResponseMapper(user);
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<Contact> {
    const user = await this.auth0DataService.updateUser(
      userId,
      this.updateUserRequestMapper(input),
    );
    return this.updateUserResponseMapper(user);
  }

  private createUserRequestMapper(input: CreateUserInput): CreateUserRequest {
    return {
      ...input,
      blocked: false,
      connection: '',
      email_verified: false,
      password: crypto.randomBytes(20).toString('base64'),
      verify_email: true,
      app_metadata: {
        roles: ['recruiter'],
      },
    };
  }

  private createUserResponseMapper(response: CreateUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
    };
  }

  private getUserResponseMapper(response: GetUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
    };
  }

  private updateUserRequestMapper(input: UpdateUserInput): UpdateUserRequest {
    const request = {};
    Object.assign(
      request,
      input.name ? { name: input.name } : null,
      input.password ? { password: input.password } : null,
      input.email
        ? { email: input.email, email_verified: false, verify_email: true }
        : null,
    );
    return request;
  }

  private updateUserResponseMapper(response: UpdateUserResponse): Contact {
    return {
      name: response.name,
      email: response.email,
      userId: response.user_id,
    };
  }
}
