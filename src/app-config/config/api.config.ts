import { registerAs } from '@nestjs/config';

export const ApiConfig = registerAs('api', () => {
  const customerApi = process.env.CUSTOMER_API;
  const queryApi = process.env.QUERY_API;
  const studentApi = process.env.STUDENT_API;
  const linkingApi = process.env.LINKING_API;
  const identifyingApi = process.env.IDENTIFYING_API;
  if (customerApi && queryApi && studentApi && linkingApi && identifyingApi) {
    return {
      customerApi,
      queryApi,
      studentApis: [studentApi],
      linkingApi,
      identifyingApi,
    };
  } else {
    throw new Error('Missing API endpoint configuration');
  }
});
