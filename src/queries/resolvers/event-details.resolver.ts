import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { EventDetails } from '../models/event-details.model';
import { UploadedFile } from 'src/common/uploaded-file.model';
import { UploadService } from 'src/upload/upload.service';

@Resolver(_of => EventDetails)
export class EventDetailsResolver {
  constructor(private readonly uploadService: UploadService) {}

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
