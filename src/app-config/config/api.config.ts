import { registerAs } from '@nestjs/config';

export const ApiConfig = registerAs('api', () => {
  const customerApi = process.env.CUSTOMER_API;
  const queryApi = process.env.QUERY_API;
  if (customerApi && queryApi) {
    return { customerApi, queryApi };
  } else {
    throw new Error('Missing API endpoint configuration');
  }
});
