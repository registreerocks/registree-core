import { JsonObject } from 'src/common/interfaces/json-object.interface';

export interface CustomerResponse extends JsonObject {
  _id: string;
  name: string;
  description?: string;
  contact: ContactDto;
  billing_address: BillingAddressDto;
  vat?: string;
}

export type ContactDto = {
  name?: string;
  email?: string;
};

export type BillingAddressDto = {
  line_1?: string;
  line_2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
};
