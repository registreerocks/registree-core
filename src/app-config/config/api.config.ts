import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// XXX: auth.config.ts duplication
const apiURL = Joi.string()
  .uri({ scheme: ['http', 'https'] })
  .required();

const ApiConfigSchema = Joi.object({
  CUSTOMER_API: apiURL,
  QUERY_API: apiURL,
  STUDENT_API: apiURL,
  LINKING_API: apiURL,
  IDENTIFYING_API: apiURL,
});

type ApiConfigSchemaType = {
  CUSTOMER_API: string;
  QUERY_API: string;
  STUDENT_API: string;
  LINKING_API: string;
  IDENTIFYING_API: string;
};

export const ApiConfig = registerAs('api', () => {
  const validated = Joi.attempt(process.env, ApiConfigSchema, 'ApiConfig:', {
    abortEarly: false,
    stripUnknown: true,
  }) as ApiConfigSchemaType;

  return {
    customerApi: validated.CUSTOMER_API,
    queryApi: validated.QUERY_API,
    studentApis: [validated.STUDENT_API],
    linkingApi: validated.LINKING_API,
    identifyingApi: validated.IDENTIFYING_API,
  };
});
