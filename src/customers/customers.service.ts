import { Injectable } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerInput } from './dto/create-customer.input';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findOneById(id: string, _token: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const createdCustomer = new this.customerModel({
      name: input.name,
      contact: input.contact,
      description: input.description,
      contacts: [{ name: input.contact.name, email: input.contact.email }],
    });
    return createdCustomer.save();
  }
}
