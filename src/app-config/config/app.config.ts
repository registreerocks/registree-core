import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const AppConfigSchema = Joi.object({
  // TODO: Omit if missing, rather than defaulting to localhost?
  HOST: Joi.string().empty('').default('localhost'),

  PORT: Joi.number().empty('').default(3000),

  HTTP_LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
    .empty('')
    .default('info'),

  // https://docs.mongodb.com/manual/reference/connection-string/
  MONGO_URI: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .empty('')
    .default('mongodb://localhost/registree-core'),
});

type AppConfigSchemaType = {
  HOST: string;
  PORT: number;
  HTTP_LOG_LEVEL: Level;
  MONGO_URI: string;
};

export const AppConfig = registerAs('app', () => {
  const validated = Joi.attempt(process.env, AppConfigSchema, 'AppConfig:', {
    abortEarly: false,
    stripUnknown: true,
  }) as AppConfigSchemaType;

  return {
    port: validated.PORT,
    host: validated.HOST,
    httpLogLevel: validated.HTTP_LOG_LEVEL,
    mongoUri: validated.MONGO_URI,
  };
});

type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
