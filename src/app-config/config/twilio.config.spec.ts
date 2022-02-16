import * as dotenv from 'dotenv';
import * as fc from 'fast-check';
import * as fs from 'fs';
import { hasAllKeys, withMockedEnv } from '../../common/test.helpers';
import { TwilioConfig } from './twilio.config';

describe('TwilioConfig', () => {
  test('empty config fails', () => {
    expect(() => withMockedEnv({}, TwilioConfig)).toThrow(
      new Error('Incomplete twilio config provided'),
    );
  });

  test('invalid config fails', () => {
    const invalidEnv = fc
      .record(
        {
          TWILIO_ACCOUNT_SID: fc.string(),
          TWILIO_AUTH_TOKEN: fc.string(),
        },
        { requiredKeys: [] },
      )
      .filter(
        env => !hasAllKeys(env, ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN']),
      );

    fc.assert(
      fc.property(invalidEnv, env => {
        expect(() => withMockedEnv(env, TwilioConfig)).toThrow(
          new Error('Incomplete twilio config provided'),
        );
      }),
    );
  });

  test('valid config', () => {
    const validEnv = fc.record(
      {
        TWILIO_ACCOUNT_SID: fc.string({ minLength: 1 }),
        TWILIO_AUTH_TOKEN: fc.string({ minLength: 1 }),
      },
      { requiredKeys: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'] },
    );

    fc.assert(
      fc.property(validEnv, env => {
        expect(withMockedEnv(env, TwilioConfig)).toStrictEqual({
          accountSid: env.TWILIO_ACCOUNT_SID,
          authToken: env.TWILIO_AUTH_TOKEN,
        });
      }),
    );
  });

  test('example config', () => {
    const exampleEnv = dotenv.parse(fs.readFileSync('.env.example'));
    expect(withMockedEnv(exampleEnv, TwilioConfig)).toMatchInlineSnapshot(`
      Object {
        "accountSid": "someaccountsid",
        "authToken": "someauthtoken",
      }
    `);
  });
});
