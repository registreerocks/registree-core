/**
 * Helpers for working with Polly.
 */

import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Polly, RecordingEventListener } from '@pollyjs/core';
import { pollyContext } from '@spotify/polly-jest-presets';
import { Entry } from 'har-format';
import { ApiConfig } from '../../src/app-config/config/api.config';
import { AuthConfig } from '../../src/app-config/config/auth.config';
import {
  redactHeaderInPlace,
  redactHostSet,
  redactJSONStringKey,
  redactString,
  redactURL,
} from './redaction.helpers';

/** Get the {@link Polly} instance from context. */
export function getPolly(): Polly {
  // XXX(Pi): This type doesn't seem to get inferred?
  return pollyContext.polly;
}

/** Helper: Get the set of Registree service API endpoints to redact. */
export function getAPIHostRedactions(
  app: INestApplication,
): Map<string, string> {
  const apiConfig: ConfigType<typeof ApiConfig> = app.get(ApiConfig.KEY);
  return new Map<string, string>([
    [apiConfig.customerApi, 'redacted-query-customer-host'],
    [apiConfig.queryApi, 'redacted-query-api-host'],
    ...apiConfig.studentApis.map((studentApi: string, i: number): [
      string,
      string,
    ] => [studentApi, `redacted-student-api-host-${i}`]),
    [apiConfig.linkingApi, 'redacted-linking-api-host'],
    [apiConfig.identifyingApi, 'redacted-identifying-api-host'],
  ]);
}

/**
 * Configure Polly to match requests based on redacted API hosts.
 * This allows the same recordings to work with different local endpoint configurations.
 * This should be called during test setup.
 */
export function configurePollyRequestMatching(app: INestApplication): void {
  getPolly().configure({
    matchRequestsBy: {
      url: requestURL => redactHostSet(requestURL, getAPIHostRedactions(app)),
    },
  });
}

/**
 * Enable redaction of Auth0 access token updates.
 * This should be called during test setup.
 */
export function persistRedactedAuth0AccessTokenUpdates(
  app: INestApplication,
): void {
  const authConfig: ConfigType<typeof AuthConfig> = app.get(AuthConfig.KEY);
  const auth0BaseURL = `https://${authConfig.domain}/oauth`;

  getPolly()
    .server.post(`${auth0BaseURL}/token`)
    .on('beforePersist', handleAuth0AccessTokenUpdate(authConfig));
}

export function handleAuth0AccessTokenUpdate(
  authConfig: ConfigType<typeof AuthConfig>,
): RecordingEventListener {
  return (_req, { request, response }: Entry): void => {
    // Strip client secrets from request
    const auth0ClientRedactions = new Map<string, string>([
      [authConfig.clientId, 'redacted-auth0-client-id'],
      [authConfig.clientSecret, 'redacted-auth0-client-secret'],
    ]);
    const postData = request?.postData;
    if (postData?.text !== undefined) {
      postData.text = redactString(postData.text, auth0ClientRedactions);
      // Update size to match
      request.bodySize = postData.text.length;
    }

    // Strip access token result from response
    const content = response.content;
    if (content.mimeType === 'application/json' && content.text) {
      content.text = redactJSONStringKey(
        content.text,
        'access_token',
        'redacted-auth0-access-token',
      );
      // Update sizes to match
      response.bodySize = content.size = content.text.length;
    } else {
      throw new TypeError(
        `expected JSON response content, got: ${JSON.stringify(content)}`,
      );
    }
  };
}

/**
 * Enable redaction of Registree service API calls.
 * This should be called during test setup.
 */
export function persistRedactedAPICalls(app: INestApplication): void {
  for (const [hostURL, redactedHost] of getAPIHostRedactions(app)) {
    const matchingURL = new URL('*', hostURL).toString(); // "*" relative to hostURL
    getPolly()
      .server.any(matchingURL)
      .on('beforePersist', handleAPICall(redactedHost));
  }
}

export function handleAPICall(redactedHost: string): RecordingEventListener {
  return (_req, { request }: Entry): void => {
    const redactedToken = 'Bearer redacted-auth0-access-token';

    redactHeaderInPlace(request.headers, 'authorization', _ => redactedToken);
    redactHeaderInPlace(request.headers, 'host', _ => redactedHost);
    request.url = redactURL(request.url, {
      protocol: 'https',
      hostname: redactedHost,
      port: '',
    });
  };
}
