import { Injectable, BadRequestException } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { Contact } from './models/contact.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './dto/create-customer.input';
import { CreateUserInput } from './dto/create-user.input';
import { Auth0DataService } from 'src/auth0-data/auth0-data.service';
import { CreateUserRequest } from 'src/auth0-data/dto/create-user.request';
import { CreateUserResponse } from 'src/auth0-data/dto/create-user.response';
import * as crypto from 'crypto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private readonly auth0DataService: Auth0DataService,
  ) {}

  async findOneByCustomerId(customerId: string): Promise<Customer | null> {
    return await this.customerModel
      .findOne({
        _id: customerId,
      })
      .exec();
  }

  async findOneByUserId(userId: string): Promise<Customer | null> {
    return await this.customerModel
      .findOne({
        'contacts.userId': userId,
      })
      .exec();
  }
  
  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  async createUser(input: CreateUserInput): Promise<Contact> {
    const user = await this.auth0DataService.createUser(
      this.createUserRequestMapper(input),
    );
    return this.createUserResponseMapper(user);
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const userCustomer = await this.customerModel
      .findOne({
        'contacts.userId': input.contact.userId,
      })
      .exec();

    if (userCustomer === null) {
      const createdCustomer = new this.customerModel({
        name: input.name,
        contact: input.contact,
        description: input.description,
        contacts: [
          {
            name: input.contact.name,
            email: input.contact.email,
            userId: input.contact.userId,
          },
        ],
        billingDetails: {
          city: null,
        },
      });
      return createdCustomer.save();
    } else {
      throw new BadRequestException(
        'User is already a contact on another client',
      );
    }
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
}
