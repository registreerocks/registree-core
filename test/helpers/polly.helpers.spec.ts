import type { ConfigType } from '@nestjs/config';
import type { ListenerEvent, Request } from '@pollyjs/core';
import type { Entry } from 'har-format';
import { AuthConfig } from '../../src/app-config/config/auth.config';
import { makeEntry, makeRequestPOST, makeResponseOK } from './har.helpers';
import { handleAPICall, handleAuth0AccessTokenUpdate } from './polly.helpers';

// Dummy values for unused parameters below:
const _req = (null as unknown) as Request;
const _event = (null as unknown) as ListenerEvent;

describe('handleAuth0AccessTokenUpdate', () => {
  const mockAuthConfig: ConfigType<typeof AuthConfig> = {
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
  } as ConfigType<typeof AuthConfig>;

  function describeAuth0AccessTokenUpdate(args: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
  }): Entry {
    return makeEntry(
      makeRequestPOST({
        url: 'https://registree.eu.auth0.com/oauth/token',
        json: {
          client_id: args.clientId,
          client_secret: args.clientSecret,
          audience: 'https://registree.rocks/apis',
          grant_type: 'client_credentials',
        },
      }),
      makeResponseOK({
        json: {
          access_token: args.accessToken,
          scope: 'registree admin lecturer student verifier recruiter',
          expires_in: 36000,
          token_type: 'Bearer',
        },
      }),
    );
  }

  function expectedCall() {
    return describeAuth0AccessTokenUpdate({
      clientId: mockAuthConfig.clientId,
      clientSecret: mockAuthConfig.clientSecret,
      accessToken: 'mock-auth0-access-token',
    });
  }

  test('redact expected call', async () => {
    const entry = expectedCall();

    await handleAuth0AccessTokenUpdate(mockAuthConfig)(_req, entry, _event);
    expect(entry).toStrictEqual(
      describeAuth0AccessTokenUpdate({
        clientId: 'redacted-auth0-client-id',
        clientSecret: 'redacted-auth0-client-secret',
        accessToken: 'redacted-auth0-access-token',
      }),
    );
  });

  test('reject bad content type', () => {
    const entry = expectedCall();
    entry.response.content.mimeType = 'text/plain';

    expect(() =>
      handleAuth0AccessTokenUpdate(mockAuthConfig)(_req, entry, _event),
    ).toThrowError(
      `expected JSON response content, got: ${JSON.stringify(
        entry.response.content,
      )}`,
    );
  });
});

describe('handleAPICall', () => {
  function describeAPICall(args: { host: string; accessToken: string }): Entry {
    // Hardcode these, for now:
    const path = '/mock/path';
    const jsonRequest = { mock: 'request' };
    const jsonResponse = { mock: 'response' };

    return makeEntry(
      makeRequestPOST({
        url: new URL(path, `https://${args.host}/`).toString(),
        headers: new Map([
          ['host', args.host],
          ['authorization', `Bearer ${args.accessToken}`],
        ]),
        json: jsonRequest,
      }),
      makeResponseOK({
        json: jsonResponse,
      }),
    );
  }

  function expectedCall() {
    return describeAPICall({
      host: 'sensitive-api.example.com:8080',
      accessToken: 'sensitive-auth0-access-token',
    });
  }

  test('redact expected call', async () => {
    const entry = expectedCall();

    await handleAPICall('redacted-api-host')(_req, entry, _event);
    expect(entry).toStrictEqual(
      describeAPICall({
        host: 'redacted-api-host',
        accessToken: 'redacted-auth0-access-token',
      }),
    );
  });
});
