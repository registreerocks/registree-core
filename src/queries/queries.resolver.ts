import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EventQuery } from './models/event-query.model';
import { CreateEventQueryInput } from './dto/create-event-query.input';
import { QueriesService } from './queries.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(_of => EventQuery)
export class QueriesResolver {
  constructor(private readonly queriesService: QueriesService) {}

  @Mutation(_returns => EventQuery)
  @UseGuards(GqlAuthGuard)
  async createQuery(
    @Args({ name: 'createEventQueryInput', type: () => CreateEventQueryInput })
    input: CreateEventQueryInput,
    @CurrentUser()
    user: Object,
  ): Promise<EventQuery> {
    console.log(user);
    //this.queriesService.createEventQuery(input);
    // const { createReadStream, filename, mimetype } = await input.flyer!;
    // const res = await this.uploadService.saveFile(createReadStream, filename);
    return {
      file: 'asdf',
    };
  }
}
