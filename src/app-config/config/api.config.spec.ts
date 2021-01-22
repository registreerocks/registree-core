import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import { hasAllKeys, withMockedEnv } from '../../common/test.helpers';
import { ApiConfig } from './api.config';

describe('ApiConfig', () => {
  test('empty config fails', () => {
    expect(() => withMockedEnv({}, ApiConfig)).toThrow(
      new Error('Missing API endpoint configuration'),
    );
  });

  test('invalid config fails', () => {
    const invalidEnv = fc
      .record(
        {
          CUSTOMER_API: fc.oneof(apiUrl, fc.string()),
          QUERY_API: fc.oneof(apiUrl, fc.string()),
          STUDENT_API: fc.oneof(apiUrl, fc.string()),
          LINKING_API: fc.oneof(apiUrl, fc.string()),
          IDENTIFYING_API: fc.oneof(apiUrl, fc.string()),
        },
        { requiredKeys: [] },
      )
      .filter(
        env =>
          !hasAllKeys(env, [
            'CUSTOMER_API',
            'QUERY_API',
            'STUDENT_API',
            'LINKING_API',
            'IDENTIFYING_API',
          ]),
      );

    fc.assert(
      fc.property(invalidEnv, env => {
        expect(() => withMockedEnv(env, ApiConfig)).toThrow(
          new Error('Missing API endpoint configuration'),
        );
      }),
    );
  });

  test('valid config', () => {
    const validEnv = fc.record({
      CUSTOMER_API: apiUrl,
      QUERY_API: apiUrl,
      STUDENT_API: apiUrl,
      LINKING_API: apiUrl,
      IDENTIFYING_API: apiUrl,
    });

    fc.assert(
      fc.property(validEnv, env => {
        expect(withMockedEnv(env, ApiConfig)).toStrictEqual({
          customerApi: env.CUSTOMER_API,
          queryApi: env.QUERY_API,
          studentApis: [env.STUDENT_API],
          linkingApi: env.LINKING_API,
          identifyingApi: env.IDENTIFYING_API,
        });
      }),
    );
  });

  test('example config', () => {
    const exampleEnv = dotenv.parse(fs.readFileSync('.env.example'));
    expect(withMockedEnv(exampleEnv, ApiConfig)).toMatchInlineSnapshot(`
      Object {
        "customerApi": "http://someapi.com",
        "identifyingApi": "http://identifying-api.example.com",
        "linkingApi": "http://linking-api.example.com",
        "queryApi": "http://query-api.example.com",
        "studentApis": Array [
          "http://student-api.example.com",
        ],
      }
    `);
  });
});

// Helpers:

/** Arbitrary API URL value. */
const apiUrl = fc.webUrl({
  authoritySettings: {
    withIPv4: true,
    withIPv6: true,
    withIPv4Extended: true,
    withPort: true,
    withUserInfo: true,
  },
});
