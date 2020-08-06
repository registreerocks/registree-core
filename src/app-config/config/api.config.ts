import { registerAs } from '@nestjs/config';

export const ApiConfig = registerAs('api', () => {
  const customerApi = process.env.CUSTOMER_API;
  const queryApi = process.env.QUERY_API;
  const studentApi = process.env.STUDENT_API;
  if (customerApi && queryApi && studentApi) {
    return { customerApi, queryApi, studentApis: [studentApi] };
  } else {
    throw new Error('Missing API endpoint configuration');
  }
});
