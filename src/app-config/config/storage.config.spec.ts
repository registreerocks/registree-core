import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import { hasAllKeys, withMockedEnv } from '../../common/test.helpers';
import { StorageConfig } from './storage.config';

describe('StorageConfig', () => {
  const s3Keys = ['S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET'];

  test('empty config fails', () => {
    expect(() => withMockedEnv({}, StorageConfig)).toThrow(
      new Error(
        'StorageConfig: ' + s3Keys.map(k => `"${k}" is required`).join('. '),
      ),
    );
  });

  test('invalid config fails', () => {
    const invalidEnv = fc
      .record(
        {
          LOCAL_OBJECT_STORAGE: fc.string().filter(s => s !== 'true'), // TODO: other values
          S3_ENDPOINT: fc.string(),
          S3_ACCESS_KEY_ID: fc.string(),
          S3_SECRET: fc.string(),
        },
        { requiredKeys: [] },
      )
      .filter(env => !hasAllKeys(env, s3Keys));

    fc.assert(
      fc.property(invalidEnv, env => {
        expect(() => withMockedEnv(env, StorageConfig)).toThrow(
          new Error(
            'StorageConfig: ' +
              // XXX: Split out array of messages to join?
              (env['LOCAL_OBJECT_STORAGE'] &&
              !['true', 'false'].includes(env['LOCAL_OBJECT_STORAGE'])
                ? '"LOCAL_OBJECT_STORAGE" must be a boolean. '
                : '') +
              s3Keys
                .map(k =>
                  env[k] === undefined
                    ? `"${k}" is required`
                    : env[k] === ''
                    ? `"${k}" is not allowed to be empty`
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
    const validEnvLocal = fc.record(
      {
        LOCAL_OBJECT_STORAGE: fc.constant('true'),
        S3_ENDPOINT: fc.oneof(fc.constant(''), fc.domain()),
        S3_ACCESS_KEY_ID: fc.string(),
        S3_SECRET: fc.string(),
      },
      { requiredKeys: ['LOCAL_OBJECT_STORAGE'] },
    );
    const validEnvNonLocal = fc.record(
      {
        LOCAL_OBJECT_STORAGE: fc.constantFrom('', 'true', 'false'),
        S3_ENDPOINT: fc.domain(),
        S3_ACCESS_KEY_ID: fc.string({ minLength: 1 }),
        S3_SECRET: fc.string({ minLength: 1 }),
      },
      { requiredKeys: ['S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET'] },
    );
    const validEnv = fc.oneof(validEnvLocal, validEnvNonLocal);

    fc.assert(
      fc.property(validEnv, env => {
        expect(withMockedEnv(env, StorageConfig)).toStrictEqual(
          env.LOCAL_OBJECT_STORAGE === 'true'
            ? { useLocal: true }
            : {
                useLocal: false,
                endpoint: env.S3_ENDPOINT,
                accessKeyId: env.S3_ACCESS_KEY_ID,
                secretAccessKey: env.S3_SECRET,
              },
        );
      }),
    );
  });

  test('example config snapshot', () => {
    const exampleEnv = dotenv.parse(fs.readFileSync('.env.example'));
    expect(withMockedEnv(exampleEnv, StorageConfig)).toMatchInlineSnapshot(`
      Object {
        "useLocal": true,
      }
    `);
  });
});
