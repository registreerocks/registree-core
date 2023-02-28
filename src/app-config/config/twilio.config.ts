import { registerAs } from '@nestjs/config';

export const TwilioConfig = registerAs('twilio', () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (accountSid && authToken) {
    return { accountSid, authToken };
  } else {
    throw new Error('Incomplete twilio config provided');
  }
});
