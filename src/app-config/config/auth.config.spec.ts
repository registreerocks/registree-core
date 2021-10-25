import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import { hasAllKeys, withMockedEnv } from '../../common/test.helpers';
import { AuthConfig } from './auth.config';

describe('AuthConfig', () => {
  test('empty config fails', () => {
    expect(() => withMockedEnv({}, AuthConfig)).toThrow(
      new Error(
        'Required environment variables not set for the auth namespace',
      ),
    );
  });

  test('invalid config fails', () => {
    const invalidEnv = fc
      .record(
        {
          AUTH0_DOMAIN: fc.string(),
          AUTH0_CLIENT_ID: fc.string(),
          AUTH0_CLIENT_SECRET: fc.string(),
          AUTH0_AUDIENCE: fc.string(),
          AUTH0_MANAGEMENT_API: fc.string(),
          AUTH0_CONNECTION: fc.string(),
          AUTH0_API_KEY: fc.string(),
          ADMIN_API_KEY: fc.string(),
          NODE_ENV: fc.oneof(fc.constant('develop'), fc.string()),
        },
        { requiredKeys: [] },
      )
      .filter(
        env =>
          !hasAllKeys(env, [
            'AUTH0_DOMAIN',
            'AUTH0_CLIENT_ID',
            'AUTH0_CLIENT_SECRET',
            'AUTH0_AUDIENCE',
            'AUTH0_MANAGEMENT_API',
            'AUTH0_CONNECTION',
            'AUTH0_API_KEY',
            'ADMIN_API_KEY',
          ]),
      );

    fc.assert(
      fc.property(invalidEnv, env => {
        expect(() => withMockedEnv(env, AuthConfig)).toThrow(
          new Error(
            'Required environment variables not set for the auth namespace',
          ),
        );
      }),
    );
  });

  test('valid config', () => {
    const validEnv = fc.record({
      AUTH0_DOMAIN: fc.string({ minLength: 1 }),
      AUTH0_CLIENT_ID: fc.string({ minLength: 1 }),
      AUTH0_CLIENT_SECRET: fc.string({ minLength: 1 }),
      AUTH0_AUDIENCE: fc.string({ minLength: 1 }),
      AUTH0_MANAGEMENT_API: fc.string({ minLength: 1 }),
      AUTH0_CONNECTION: fc.string({ minLength: 1 }),
      AUTH0_API_KEY: fc.string({ minLength: 1 }),
      ADMIN_API_KEY: fc.string({ minLength: 1 }),
      NODE_ENV: fc.oneof(fc.constant('develop'), fc.string()),
    });

    fc.assert(
      fc.property(validEnv, env => {
        expect(withMockedEnv(env, AuthConfig)).toStrictEqual({
          domain: env.AUTH0_DOMAIN,
          clientId: env.AUTH0_CLIENT_ID,
          clientSecret: env.AUTH0_CLIENT_SECRET,
          audience: env.AUTH0_AUDIENCE,
          managementApi: env.AUTH0_MANAGEMENT_API,
          connection: env.AUTH0_CONNECTION,
          auth0ApiKey: env.AUTH0_API_KEY,
          adminApiKey: env.ADMIN_API_KEY,
          ignoreExpiration: env.NODE_ENV === 'develop',
        });
      }),
    );
  });

  test('example config', () => {
    const exampleEnv = dotenv.parse(fs.readFileSync('.env.example'));
    expect(withMockedEnv(exampleEnv, AuthConfig)).toMatchInlineSnapshot(`
      Object {
        "adminApiKey": "someapikey",
        "audience": "http://localhost:3000",
        "auth0ApiKey": "someapikey",
        "clientId": "someClientId",
        "clientSecret": "someClientSecret",
        "connection": "Connection-Name",
        "domain": "registree.eu.auth0.com",
        "ignoreExpiration": true,
        "managementApi": "https://link.to/auth0/management/api",
      }
    `);
  });
});
