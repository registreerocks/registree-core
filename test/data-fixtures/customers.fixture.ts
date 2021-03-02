import { DocumentDefinition } from 'mongoose';
import { Customer } from '../../src/customers/models/customer.model';

/**
 * Get customer data in a form that's ready to be loaded.
 */
export function getCustomers(): DocumentDefinition<Customer>[] {
  return customers.map(customer => ({
    ...customer,
    id: customer._id,
  }));
}

type CustomerRaw = Pick<
  Customer,
  'name' | 'description' | 'contactIds' | 'billingDetails'
> & { _id: string };

export const TEST_CUSTOMER_ID = '603863f29572f871f8a7fbf9';

/** Use this to reference the loaded customer in tests. */
export const TEST_CUSTOMER_CONTACT_ID = 'test-customer-contact-id';

const customers: CustomerRaw[] = [
  {
    _id: TEST_CUSTOMER_ID,
    name: 'Test Customer',
    description: 'Test Customer description',
    contactIds: [TEST_CUSTOMER_CONTACT_ID],
    billingDetails: {},
  },
];
