import {
  Resolver,
  Parent,
  ResolveField,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { EventDetails } from '../models/event-details.model';
import { Event } from '../models/event.model';
import { UploadedFile } from 'src/common/uploaded-file.model';
import { UploadService } from 'src/upload/upload.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { QueriesService } from '../queries.service';
import { UpdateEventDetailsInput } from '../dto/update-event-details.input';

@Resolver(_of => EventDetails)
export class EventDetailsResolver {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(_returns => Event)
  @UseGuards(GqlAuthGuard)
  async updateEventDetails(
    @Args({
      name: 'updateEventDetailsInput',
      type: () => UpdateEventDetailsInput,
    })
    queryId: string,
    input: UpdateEventDetailsInput,
  ): Promise<Event> {
    return this.queriesService.updateEventDetails(queryId, input);
  }

  @ResolveField('attachments', _returns => [UploadedFile])
  async getAttachments(
    @Parent() eventDetails: EventDetails,
  ): Promise<UploadedFile[]> {
    return Promise.all(
      eventDetails.attachments.map(async file => {
        const url = await this.uploadService.getFileLink(file.id);
        return {
          ...file,
          url,
        };
      }),
    );
  }
}
