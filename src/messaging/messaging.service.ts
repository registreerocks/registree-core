import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

@Injectable()
export class MessagingService {
  constructor(
    @InjectTwilio()
    private readonly client: TwilioClient,
  ) {}

  async sendSMS(to: string, body: string): Promise<string> {
    try {
      const result = await this.client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      return result.sid;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
