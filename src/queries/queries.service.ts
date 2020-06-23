import { Injectable } from '@nestjs/common';
import { EventQuery } from './models/event-query.model';
import { CreateEventQueryInput } from './dto/create-event-query.input';
import { UploadService } from 'src/upload/upload.service';
import { QueryDataService } from 'src/query-data/query-data.service';
import { mapEventQuery } from './mappers/mapEventQuery';

@Injectable()
export class QueriesService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly queryDataService: QueryDataService,
  ) {}

  async getCustomerQueries(customerId: string): Promise<EventQuery[]> {
    const response = await this.queryDataService.getCustomerQueries(customerId);
    return response.map(mapEventQuery);
  }

  // async createEventQuery(input: CreateEventQueryInput): Promise<EventQuery> {
  //   if (input.flyer) {
  //     const { createReadStream, filename, mimetype } = await input.flyer;
  //     const key = await this.uploadService.saveFile(createReadStream, filename);
  //     const flyer = { filename, mimetype, key };
  //     return {
  //       id: 'x',
  //       file: key,
  //     };
  //   } else {
  //     return {
  //       id: 'dx',
  //       file: 'dasf',
  //     };
  //   }
  // }
}
