import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  customerApi: process.env.CUSTOMER_API,
}));
