import { Injectable, BadRequestException } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Contact } from 'src/contacts/models/contact.model';
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
        'contacts.userId': userId,
      })
      .exec();
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const createdCustomer = new this.customerModel({
      name: input.name,
      description: input.description,
      contacts: [],
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

  async addContact(customerId: string, contact: Contact): Promise<Customer> {
    const userCustomer = await this.customerModel
      .findOne({
        'contacts.userId': contact.userId,
      })
      .exec();

    if (userCustomer === null) {
      const updatedCustomer = await this.customerModel.findOneAndUpdate(
        {
          _id: customerId,
        },
        { $push: { contacts: contact } },
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
      throw new BadRequestException(
        'Contact is already a contact on another client',
      );
    }
  }
}
