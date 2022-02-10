import { Resolver, Mutation } from '@nestjs/graphql';
import { MessagingService } from '../messaging.service';

@Resolver(_of => String)
export class MessagingResolver {
  constructor(private readonly messagingService: MessagingService) {}

  @Mutation(_returns => String)
  async sendSMS(to: string, body: string): Promise<string> {
    const result = await this.messagingService.sendSMS(to, body);
    return result;
  }
}
