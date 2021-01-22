import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import { withMockedEnv } from '../../common/test.helpers';
import { AppConfig } from './app.config';

describe('AppConfig', () => {
  test('empty config defaults', () => {
    expect(withMockedEnv({}, AppConfig)).toMatchInlineSnapshot(`
      Object {
        "host": "localhost",
        "httpLogLevel": "info",
        "mongoUri": "mongodb://localhost/registree-core",
        "port": 3000,
      }
    `);
  });

  test.todo('invalid config fails');

  test('valid config', () => {
    const validEnv = fc.record(
      {
        PORT: fc.integer({ min: 0, max: 0xffff }).map(i => i.toString()),
        HOST: fc.oneof(fc.ipV4(), fc.ipV4Extended(), fc.ipV6(), fc.domain()),
        HTTP_LOG_LEVEL: fc.constantFrom(
          // TODO: Reference pino log levels
          'fatal',
          'error',
          'warn',
          'info',
          'debug',
          'trace',
        ),
        MONGO_URI: mongoUri,
      },
      { requiredKeys: [] },
    );

    fc.assert(
      fc.property(validEnv, env => {
        expect(withMockedEnv(env, AppConfig)).toStrictEqual({
          port: parseInt(env.PORT ?? '3000'),
          host: env.HOST ?? 'localhost',
          httpLogLevel: env.HTTP_LOG_LEVEL ?? 'info',
          mongoUri: env.MONGO_URI ?? 'mongodb://localhost/registree-core',
        });
      }),
    );
  });

  test('example config', () => {
    const exampleEnv = dotenv.parse(fs.readFileSync('.env.example'));
    expect(withMockedEnv(exampleEnv, AppConfig)).toMatchInlineSnapshot(`
      Object {
        "host": "localhost",
        "httpLogLevel": "debug",
        "mongoUri": "mongodb://localhost:27017/registree-core",
        "port": 3000,
      }
    `);
  });
});

// Helpers:

/**
 * Arbitrary MongoDB Connection String URI.
 *
 * @see https://docs.mongodb.com/manual/reference/connection-string/
 */
const mongoUri = fc.webUrl({
  validSchemes: ['mongodb', 'mongodb+srv'],
  authoritySettings: {
    withIPv4: true,
    withIPv4Extended: true,
    withIPv6: true,
    withPort: true,
    withUserInfo: true,
  },
  withQueryParameters: true,
});
