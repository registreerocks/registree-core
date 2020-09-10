import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BillingDetails } from './billing-details.model';
import { Contact } from '../../contacts/models/contact.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Customer extends Document {
  @Field(_type => ID)
  get id(): string {
    return super.id as string;
  }

  @Prop()
  @Field()
  description?: string;

  @Prop()
  @Field()
  name!: string;

  @Prop(BillingDetails)
  @Field(_type => BillingDetails)
  billingDetails!: BillingDetails;

  @Prop([Contact])
  @Field(_type => [Contact])
  contacts!: Contact[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
