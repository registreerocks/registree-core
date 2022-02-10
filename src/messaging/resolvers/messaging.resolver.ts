import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MessagingService } from '../messaging.service';

@Resolver(_of => String)
export class MessagingResolver {
  constructor(private readonly messagingService: MessagingService) {}

  @Mutation(_returns => String)
  async sendSMS(
    @Args({
      name: 'to',
      type: () => String,
    })
    to: string,
    @Args({
      name: 'body',
      type: () => String,
    })
    body: string,
  ): Promise<string> {
    return this.messagingService.sendSMS(to, body);
  }
}
