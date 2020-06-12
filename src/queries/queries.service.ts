import { Injectable } from '@nestjs/common';
import { EventQuery } from './models/event-query.model';
import { CreateEventQueryInput } from './dto/create-event-query.input';
import { UploadService } from 'src/upload/upload.service';
@Injectable()
export class QueriesService {
  constructor(private readonly uploadService: UploadService) {}

  async createEventQuery(input: CreateEventQueryInput): Promise<EventQuery> {
    if (input.flyer) {
      const { createReadStream, filename, mimetype } = await input.flyer;
      const key = await this.uploadService.saveFile(createReadStream, filename);
      const flyer = { filename, mimetype, key };
      return {
        file: key,
      };
    } else {
      return {
        file: 'dasf',
      };
    }
  }
}
