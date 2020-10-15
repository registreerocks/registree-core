import {
  Resolver,
  Parent,
  ResolveField,
  Mutation,
  Args,
  ID,
} from '@nestjs/graphql';
import { EventDetails } from '../models/event-details.model';
import { UploadedFile } from 'src/common/uploaded-file.model';
import { UploadService } from 'src/upload/upload.service';
import { QueriesService } from '../queries.service';
import { UpdateEventInfoInput } from '../dto/update-event-info.input';
import { EventQuery } from '../models/event-query.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/common/interfaces/user.interface';

@Resolver(_of => EventDetails)
export class EventDetailsResolver {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(_returns => EventQuery)
  async updateEventInfo(
    @Args({
      name: 'queryId',
      type: () => ID,
    })
    queryId: string,
    @Args({
      name: 'updateEventInfoInput',
      type: () => UpdateEventInfoInput,
    })
    input: UpdateEventInfoInput,
  ): Promise<EventQuery> {
    return this.queriesService.updateEventInfo(queryId, input);
  }

  @Mutation(_returns => EventQuery)
  async addAttachments(
    @Args({
      name: 'queryId',
      type: () => ID,
    })
    queryId: string,
    @Args({
      name: 'attachments',
      type: () => [GraphQLUpload],
    })
    input: Promise<FileUpload>[],
  ): Promise<EventQuery> {
    return this.queriesService.addAttachments(queryId, input);
  }

  @Mutation(_returns => EventQuery)
  async deleteAttachments(
    @Args({
      name: 'queryId',
      type: () => ID,
    })
    queryId: string,
    @Args({
      name: 'attachmentIds',
      type: () => [ID],
    })
    input: string[],
  ): Promise<EventQuery> {
    return this.queriesService.deleteAttachments(queryId, input);
  }

  @Mutation(_returns => EventQuery)
  async setQueryInviteToViewed(
    @Args({ name: 'queryId', type: () => ID })
    queryId: string,
    @CurrentUser() user: User,
  ): Promise<EventQuery> {
    const input = { viewed: true };
    return this.queriesService.updateQueryInvite(queryId, user.dbId, input);
  }

  @Mutation(_returns => EventQuery)
  async setQueryInviteToAccepted(
    @Args({ name: 'queryId', type: () => ID })
    queryId: string,
    @CurrentUser() user: User,
  ): Promise<EventQuery> {
    const input = { accepted: true };
    return this.queriesService.updateQueryInvite(queryId, user.dbId, input);
  }

  @Mutation(_returns => EventQuery)
  async setQueryInviteToDeclined(
    @Args({ name: 'queryId', type: () => ID })
    queryId: string,
    @CurrentUser() user: User,
  ): Promise<EventQuery> {
    const input = { accepted: false };
    return this.queriesService.updateQueryInvite(queryId, user.dbId, input);
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
