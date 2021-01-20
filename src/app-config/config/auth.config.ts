import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// XXX: api.config.ts duplication
const apiURL = Joi.string()
  .uri({ scheme: ['http', 'https'] })
  .required();

const AuthConfigSchema = Joi.object({
  AUTH0_DOMAIN: Joi.string().required(),
  AUTH0_CLIENT_ID: Joi.string().required(),
  AUTH0_CLIENT_SECRET: Joi.string().required(),
  AUTH0_AUDIENCE: apiURL,
  NODE_ENV: Joi.string().allow(''), // only for ignoreExpiration
  AUTH0_MANAGEMENT_API: apiURL,
  AUTH0_CONNECTION: Joi.string().required(),
  AUTH0_API_KEY: Joi.string().required(),
  ADMIN_API_KEY: Joi.string().required(),
});

type AuthConfigSchemaType = {
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_AUDIENCE: string;
  NODE_ENV: string; // only for ignoreExpiration:
  AUTH0_MANAGEMENT_API: string;
  AUTH0_CONNECTION: string;
  AUTH0_API_KEY: string;
  ADMIN_API_KEY: string;
};

export const AuthConfig = registerAs('auth', () => {
  const validated = Joi.attempt(process.env, AuthConfigSchema, 'AuthConfig:', {
    abortEarly: false,
    stripUnknown: true,
  }) as AuthConfigSchemaType;

  return {
    domain: validated.AUTH0_DOMAIN,
    clientId: validated.AUTH0_CLIENT_ID,
    clientSecret: validated.AUTH0_CLIENT_SECRET,
    audience: validated.AUTH0_AUDIENCE,
    ignoreExpiration: validated.NODE_ENV === 'develop',
    managementApi: validated.AUTH0_MANAGEMENT_API,
    connection: validated.AUTH0_CONNECTION,
    auth0ApiKey: validated.AUTH0_API_KEY,
    adminApiKey: validated.ADMIN_API_KEY,
  };
});
