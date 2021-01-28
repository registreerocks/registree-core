import { registerAs } from '@nestjs/config';

// TODO, validate app config
export const AppConfig = registerAs('app', () => ({
  port: process.env.PORT ?? 3000,
  host: process.env.HOST ?? 'localhost',
  httpLogLevel: (process.env.HTTP_LOG_LEVEL ?? 'info') as Level,
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost/registree-core',
}));

type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
