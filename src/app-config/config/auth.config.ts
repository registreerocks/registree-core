import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('auth', () => {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.AUTH0_AUDIENCE;
  if (domain && clientId && clientSecret && audience) {
    return {
      domain,
      clientId,
      clientSecret,
      audience,
    };
  } else {
    throw new Error(
      'Required environment variables not set for the auth namespace',
    );
  }
});
