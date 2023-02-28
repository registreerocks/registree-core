import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { MESSAGING_OPTIONS } from './messaging.constants';
import { MessagingOptions } from './messaging.options';
import { Twilio } from 'twilio';

@Injectable()
export class MessagingService {
  private readonly twilioClient: Twilio;
  constructor(
    @Inject(MESSAGING_OPTIONS) private readonly options: MessagingOptions,
  ) {
    this.twilioClient = new Twilio(options.accountSid, options.authToken);
  }

  async sendBulkSMS(numbers: string[], message: string): Promise<string> {
    const allPromise = Promise.all(
      numbers.map(num => {
        return this.sendSMS(num, message);
      }),
    );
    try {
      const values = await allPromise;
      return values.join();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async sendSMS(to: string, body: string): Promise<string> {
    try {
      const result = await this.twilioClient.messages.create({
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
