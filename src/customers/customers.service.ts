import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCustomerInput } from './dto/create-customer.input';
import { ApolloError } from 'apollo-server-express';
import { UpdateCustomerDetailsInput } from './dto/update-customer-details.input';
import { UpdateBillingDetailsInput } from './dto/update-billing-details.input';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
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
        contactIds: userId,
      })
      .exec();
  }

  getCustomersById(keys: readonly string[]): Promise<Customer[]> {
    return this.customerModel
      .find()
      .where('_id')
      .in(keys.map(x => new Types.ObjectId(x)))
      .exec();
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const createdCustomer = new this.customerModel({
      name: input.name,
      description: input.description,
      contactIds: input.initialContact ? [input.initialContact] : [],
      billingDetails: {
        city: null,
      },
    });
    return createdCustomer.save();
  }

  async updateBillingDetails(
    customerId: string,
    input: UpdateBillingDetailsInput,
  ): Promise<Customer> {
    const updatedCustomer = await this.customerModel.findOneAndUpdate(
      { _id: customerId },
      { billingDetails: input },
      { new: true },
    );
    if (updatedCustomer) {
      return updatedCustomer;
    } else {
      throw new ApolloError(
        'failed to update billing details, customer with id not found',
        'NOT_FOUND',
      );
    }
  }

  async updateCustomerDetails(
    customerId: string,
    input: UpdateCustomerDetailsInput,
  ): Promise<Customer> {
    const updatedCustomer = await this.customerModel.findOneAndUpdate(
      { _id: customerId },
      { name: input.name, description: input.description },
      { new: true },
    );
    if (updatedCustomer) {
      return updatedCustomer;
    } else {
      throw new ApolloError(
        'failed to update customer, customer with id not found',
        'NOT_FOUND',
      );
    }
  }

  async addContact(customerId: string, userId: string): Promise<Customer> {
    const userCustomer = await this.findOneByUserId(userId);
    if (userCustomer === null) {
      const updatedCustomer = await this.customerModel.findOneAndUpdate(
        {
          _id: customerId,
        },
        { $push: { contactIds: userId } },
        { new: true },
      );
      if (updatedCustomer !== null) {
        return updatedCustomer;
      } else {
        throw new ApolloError(
          'Failed to add contact to customer, customer with id not found',
          'NOT_FOUND',
        );
      }
    } else {
      throw new ApolloError(
        'Contact is already a contact on another client',
        'INPUT_ERROR',
      );
    }
  }
}
