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
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { QueriesService } from '../queries.service';
import { UpdateEventInfoInput } from '../dto/update-event-info.input';
import { EventQuery } from '../models/event-query.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(_of => EventDetails)
export class EventDetailsResolver {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly uploadService: UploadService,
  ) {}

  @Mutation(_returns => EventQuery)
  @UseGuards(GqlAuthGuard)
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
  @UseGuards(GqlAuthGuard)
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
  @UseGuards(GqlAuthGuard)
  async deleteAttachments(
    @Args({
      name: 'queryId',
      type: () => ID,
    })
    queryId: string,
    @Args({
      name: 'attachmentIds',
      type: () => [String],
    })
    input: string[],
  ): Promise<EventQuery> {
    return this.queriesService.deleteAttachments(queryId, input);
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
