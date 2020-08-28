import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.AUTH0_AUDIENCE;
  const ignoreExpiration = process.env.NODE_ENV === 'develop';
  const managementApi = process.env.AUTH0_MANAGEMENT_API;
  const connection = process.env.AUTH0_CONNECTION;
  if (
    domain &&
    clientId &&
    clientSecret &&
    audience &&
    managementApi &&
    connection
  ) {
    return {
      domain,
      clientId,
      clientSecret,
      audience,
      ignoreExpiration,
      managementApi,
      connection,
    };
  } else {
    throw new Error(
      'Required environment variables not set for the auth namespace',
    );
  }
});
