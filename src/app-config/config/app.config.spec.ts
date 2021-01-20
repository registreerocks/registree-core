import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import { isValidURL, withMockedEnv } from '../../common/test.helpers';
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

  test('invalid config fails', () => {
    const invalidEnv = fc
      .record(
        {
          PORT: fc
            .string()
            .filter(s => !(/^\d+$/.test(s) && parseInt(s) < 0x10000)),
          HOST: fc.string(),
          HTTP_LOG_LEVEL: fc.string().filter(s => !pinoLogLevels.includes(s)),
          MONGO_URI: fc.string().filter(s => !isValidURL(s)),
        },
        { requiredKeys: [] },
      )
      .filter(env => Boolean(env.PORT || env.HTTP_LOG_LEVEL || env.MONGO_URI));

    fc.assert(
      fc.property(invalidEnv, env => {
        expect(() => withMockedEnv(env, AppConfig)).toThrow(
          new Error(
            'AppConfig: ' +
              // XXX: ugly!
              [
                env.PORT ? '"PORT" must be a number' : undefined,
                env.HTTP_LOG_LEVEL
                  ? '"HTTP_LOG_LEVEL" must be one of [fatal, error, warn, info, debug, trace]'
                  : undefined,
                env.MONGO_URI
                  ? '"MONGO_URI" must be a valid uri with a scheme matching the mongodb|mongodb\\+srv pattern'
                  : undefined,
              ]
                .filter(s => s !== undefined)
                .join('. '),
          ),
        );
      }),
    );
  });
  test('valid config', () => {
    const validEnv = fc.record(
      {
        PORT: fc.integer({ min: 0, max: 0xffff }).map(i => i.toString()),
        HOST: fc.oneof(fc.ipV4(), fc.ipV6(), fc.domain()), // TODO: Non-domain hostnames?
        HTTP_LOG_LEVEL: fc.constantFrom(...pinoLogLevels),
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

// TODO: Reference pino log levels
const pinoLogLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
