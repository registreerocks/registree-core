import { CustomerResponse } from 'src/query-data/dto/customer.response';
import { Customer } from '../models/customer.model';

export const mapCustomerDetails = (
  customerResponse: CustomerResponse,
): Customer => ({
  id: customerResponse._id,
  billingDetails: {
    city: customerResponse.billing_address.city,
    country: customerResponse.billing_address.country,
    line1: customerResponse.billing_address.line_1,
    line2: customerResponse.billing_address.line_2,
    province: customerResponse.billing_address.province,
    zip: customerResponse.billing_address.zip,
    vat: customerResponse.vat,
  },
  name: customerResponse.name,
  description: customerResponse.description,
  contact: {
    name: customerResponse.contact.name,
    email: customerResponse.contact.email,
  },
});
