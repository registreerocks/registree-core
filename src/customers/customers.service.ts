import { Injectable, BadRequestException } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './dto/create-customer.input';

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
}
