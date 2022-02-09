import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

@Injectable()
export class MessagingService {
  public constructor(
    @InjectTwilio()
    private readonly client: TwilioClient,
  ) {}

  async sendSMS(to: string, body: string) {
    try {
      await this.client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
