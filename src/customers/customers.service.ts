import { Injectable, BadRequestException } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Contact } from 'src/contacts/models/contact.model';

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
        throw new Error('Could not update customer to add contact.');
      }
    } else {
      throw new BadRequestException(
        'Contact is already a contact on another client',
      );
    }
  }
}
