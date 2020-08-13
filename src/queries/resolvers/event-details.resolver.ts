import {
  Resolver,
  Parent,
  ResolveField,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { EventDetails } from '../models/event-details.model';
import { EventInfo } from '../models/event-info.model';
import { UploadedFile } from 'src/common/uploaded-file.model';
import { UploadService } from 'src/upload/upload.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { QueriesService } from '../queries.service';
import { UpdateEventInfoInput } from '../dto/update-event-info.input';

@Resolver(_of => EventDetails)
export class EventDetailsResolver {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(_returns => EventInfo)
  @UseGuards(GqlAuthGuard)
  async updateEventInfo(
    @Args({
      name: 'updateEventDetailsInput',
      type: () => UpdateEventInfoInput,
    })
    queryId: string,
    input: UpdateEventInfoInput,
  ): Promise<EventInfo> {
    return this.queriesService.updateEventInfo(queryId, input);
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
