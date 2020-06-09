import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BillingDetails } from './billing-details.model';
import { Contact } from './contact.model';

@ObjectType()
export class Customer {
  @Field(_type => ID)
  id!: string;

  @Field()
  description!: string;

  @Field()
  name!: string;

  @Field(_type => BillingDetails)
  billingDetails!: BillingDetails;

  @Field(_type => Contact)
  contact!: Contact;
}
