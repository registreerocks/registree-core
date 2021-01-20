import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import {
  arbitraryURL,
  hasAllKeys,
  isValidURL,
  withMockedEnv,
} from '../../common/test.helpers';
import { ApiConfig } from './api.config';

describe('ApiConfig', () => {
  const apiKeys = [
    'CUSTOMER_API',
    'QUERY_API',
    'STUDENT_API',
    'LINKING_API',
    'IDENTIFYING_API',
  ];

  test('empty config fails', () => {
    expect(() => withMockedEnv({}, ApiConfig)).toThrow(
      new Error(
        'ApiConfig: ' + apiKeys.map(k => `"${k}" is required`).join('. '),
      ),
    );
  });

  test('invalid config fails', () => {
    const invalidEnv = fc
      .record(
        {
          CUSTOMER_API: fc.oneof(arbitraryURL, fc.string()),
          QUERY_API: fc.oneof(arbitraryURL, fc.string()),
          STUDENT_API: fc.oneof(arbitraryURL, fc.string()),
          LINKING_API: fc.oneof(arbitraryURL, fc.string()),
          IDENTIFYING_API: fc.oneof(arbitraryURL, fc.string()),
        },
        { requiredKeys: [] },
      )
      .filter(env => !hasAllKeys(env, apiKeys));

    fc.assert(
      fc.property(invalidEnv, env => {
        expect(() => withMockedEnv(env, ApiConfig)).toThrow(
          new Error(
            'ApiConfig: ' +
              apiKeys
                .map(k =>
                  env[k] === undefined
                    ? `"${k}" is required`
                    : env[k] === ''
                    ? `"${k}" is not allowed to be empty`
                    : !isValidURL(env[k])
                    ? `"${k}" must be a valid uri with a scheme matching the http|https pattern`
                    : undefined,
                )
                .filter(s => s !== undefined)
                .join('. '),
          ),
        );
      }),
    );
  });

  test('valid config', () => {
    const validEnv = fc.record({
      CUSTOMER_API: arbitraryURL,
      QUERY_API: arbitraryURL,
      STUDENT_API: arbitraryURL,
      LINKING_API: arbitraryURL,
      IDENTIFYING_API: arbitraryURL,
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
